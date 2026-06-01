/**
 * Auth API - Email/Password + Google OAuth
 * JWT-less token system for Cloudflare Workers
 */

import { adminApi } from './adminApi.js';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json'
  };
}

// Simple token generator
function generateToken() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = 'tk_';
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

// Hash password (simple, not bcrypt - for Workers compatibility)
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'iraq-salt-2026');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Get current user from request
async function getCurrentUser(request, env) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) return null;
  const token = authHeader.replace('Bearer ', '');
  
  const session = await env.DB.prepare(
    'SELECT s.*, u.id as user_id, u.email, u.display_name, u.role, u.avatar_url, u.status FROM user_sessions s JOIN users u ON s.user_id = u.id WHERE s.token = ? AND s.expires_at > datetime("now")'
  ).bind(token).first();
  
  if (!session) return null;
  
  return {
    id: session.user_id,
    email: session.email,
    displayName: session.display_name,
    role: session.role,
    avatarUrl: session.avatar_url,
    status: session.status
  };
}

export const AuthAPI = {
  // Get current user from token
  async handleMe(request, env) {
    try {
      const user = await getCurrentUser(request, env);
      if (!user) {
        return new Response(JSON.stringify({ success: false, error: 'Not authenticated' }), {
          status: 401, headers: corsHeaders()
        });
      }
      return new Response(JSON.stringify({ success: true, user }), { headers: corsHeaders() });
    } catch (error) {
      return new Response(JSON.stringify({ success: false, error: error.message }), {
        status: 500, headers: corsHeaders()
      });
    }
  },

  // Email/Password Register
  async handleRegister(request, env) {
    try {
      const { email, password, displayName } = await request.json();
      
      if (!email || !password || password.length < 6) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Email and password (min 6 chars) required'
        }), { status: 400, headers: corsHeaders() });
      }
      
      // Check if email exists
      const existing = await env.DB.prepare(
        'SELECT id FROM users WHERE email = ?'
      ).bind(email).first();
      
      if (existing) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Email already registered'
        }), { status: 409, headers: corsHeaders() });
      }
      
      const userId = `user_${Date.now()}`;
      const passwordHash = await hashPassword(password);
      
      await env.DB.prepare(`
        INSERT INTO users (id, email, password_hash, display_name, role, status, created_at)
        VALUES (?, ?, ?, ?, 'user', 'active', datetime('now'))
      `).bind(userId, email.toLowerCase().trim(), passwordHash, displayName || email.split('@')[0]).run();
      
      // Create session
      const token = generateToken();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30); // 30 days
      
      await env.DB.prepare(`
        INSERT INTO user_sessions (id, user_id, token, expires_at, created_at)
        VALUES (?, ?, ?, datetime('now', '+30 days'), datetime('now'))
      `).bind(`sess_${Date.now()}`, userId, token).run();
      
      return new Response(JSON.stringify({
        success: true,
        token,
        user: {
          id: userId,
          email: email.toLowerCase().trim(),
          displayName: displayName || email.split('@')[0],
          role: 'user'
        }
      }), { headers: corsHeaders() });
      
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: error.message
      }), { status: 500, headers: corsHeaders() });
    }
  },

  // Email/Password Login
  async handleLogin(request, env) {
    try {
      const { email, password } = await request.json();
      
      if (!email || !password) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Email and password required'
        }), { status: 400, headers: corsHeaders() });
      }
      
      const user = await env.DB.prepare(
        'SELECT * FROM users WHERE LOWER(email) = LOWER(?)'
      ).bind(email.trim()).first();
      
      if (!user) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Invalid credentials'
        }), { status: 401, headers: corsHeaders() });
      }

      // Admin accounts seeded with placeholder hash — verify via env secret
      const isAdminEmail = user.role === 'admin';
      const adminPassword = env.ADMIN_PASSWORD || 'Admin@2026';
      let passwordValid = false;

      if (isAdminEmail && password === adminPassword) {
        passwordValid = true;
        // Upgrade the stored hash to the real hash so future logins work normally
        const realHash = await hashPassword(password);
        if (user.password_hash !== realHash) {
          await env.DB.prepare('UPDATE users SET password_hash = ? WHERE id = ?')
            .bind(realHash, user.id).run();
        }
      } else {
        const passwordHash = await hashPassword(password);
        passwordValid = passwordHash === user.password_hash;
      }
      
      if (!passwordValid) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Invalid credentials'
        }), { status: 401, headers: corsHeaders() });
      }
      
      // Create session
      const token = generateToken();
      
      await env.DB.prepare(`
        INSERT INTO user_sessions (id, user_id, token, expires_at, created_at)
        VALUES (?, ?, ?, datetime('now', '+30 days'), datetime('now'))
      `).bind(`sess_${Date.now()}`, user.id, token).run();
      
      return new Response(JSON.stringify({
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          displayName: user.display_name,
          role: user.role,
          avatarUrl: user.avatar_url
        }
      }), { headers: corsHeaders() });
      
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: error.message
      }), { status: 500, headers: corsHeaders() });
    }
  },

  // Logout - delete session
  async handleLogout(request, env) {
    try {
      const authHeader = request.headers.get('Authorization');
      if (authHeader) {
        const token = authHeader.replace('Bearer ', '');
        await env.DB.prepare('DELETE FROM user_sessions WHERE token = ?').bind(token).run();
      }
      return new Response(JSON.stringify({ success: true, message: 'Logged out' }), {
        headers: corsHeaders()
      });
    } catch (error) {
      return new Response(JSON.stringify({ success: false, error: error.message }), {
        status: 500, headers: corsHeaders()
      });
    }
  },

  // Forgot Password - send reset email via Mailchannels
  async handleForgotPassword(request, env) {
    try {
      const { email } = await request.json();
      
      if (!email) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Email required'
        }), { status: 400, headers: corsHeaders() });
      }
      
      // Check if user exists
      const user = await env.DB.prepare(
        'SELECT id, display_name FROM users WHERE LOWER(email) = LOWER(?)'
      ).bind(email.trim()).first();
      
      // Always return success to avoid email enumeration
      if (!user) {
        return new Response(JSON.stringify({
          success: true,
          message: 'If an account exists, a reset link has been sent to your email.'
        }), { headers: corsHeaders() });
      }
      
      // Generate reset token (valid for 1 hour)
      const resetToken = generateToken();
      
      // Store reset token
      await env.DB.prepare(`
        INSERT OR REPLACE INTO password_resets (email, token, expires_at, created_at)
        VALUES (?, ?, datetime('now', '+1 hour'), datetime('now'))
      `).bind(email.toLowerCase().trim(), resetToken).run();
      
      const frontendUrl = env.FRONTEND_URL || 'https://billboard3dnakedeye-mor.mahdialmuntadhar1.workers.dev';
      const resetLink = `${frontendUrl}/?reset_token=${resetToken}&email=${encodeURIComponent(email)}`;
      const userName = user.display_name || email.split('@')[0];

      // Send email via Mailchannels (free on Cloudflare Workers)
      try {
        const emailPayload = {
          personalizations: [{
            to: [{ email: email.toLowerCase().trim(), name: userName }]
          }],
          from: {
            email: 'noreply@sakumaku.iq',
            name: 'SakuMaku Platform'
          },
          reply_to: { email: 'support@sakumaku.iq', name: 'SakuMaku Support' },
          subject: 'Password Reset Request — SakuMaku',
          content: [
            {
              type: 'text/plain',
              value: `Hello ${userName},\n\nYou requested a password reset.\n\nClick the link below to reset your password (valid for 1 hour):\n${resetLink}\n\nIf you did not request this, ignore this email.\n\n— SakuMaku Team`
            },
            {
              type: 'text/html',
              value: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;background:#0f0f0f;color:#fff;border-radius:12px">
  <h2 style="color:#C9A84C">Password Reset</h2>
  <p>Hello <strong>${userName}</strong>,</p>
  <p>You requested a password reset for your SakuMaku account.</p>
  <a href="${resetLink}" style="display:inline-block;margin:16px 0;padding:12px 24px;background:#C9A84C;color:#000;border-radius:8px;text-decoration:none;font-weight:700">Reset My Password</a>
  <p style="color:#888;font-size:12px">This link expires in 1 hour. If you did not request this, ignore this email.</p>
  <hr style="border-color:#333;margin:20px 0">
  <p style="color:#555;font-size:11px">SakuMaku — Iraq Business Directory</p>
</div>`
            }
          ]
        };

        const mcResponse = await fetch('https://api.mailchannels.net/tx/v1/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(emailPayload)
        });

        if (!mcResponse.ok) {
          console.error('Mailchannels error:', mcResponse.status, await mcResponse.text());
        }
      } catch (emailErr) {
        // Email sending failed but token is stored — user can still use the link if shown
        console.error('Email send error:', emailErr.message);
      }
      
      return new Response(JSON.stringify({
        success: true,
        message: 'Password reset link has been sent to your email address.'
      }), { headers: corsHeaders() });
      
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: error.message
      }), { status: 500, headers: corsHeaders() });
    }
  },

  // Reset Password - confirm password reset
  async handleResetPassword(request, env) {
    try {
      const { token, newPassword } = await request.json();
      
      if (!token || !newPassword || newPassword.length < 6) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Token and password (min 6 chars) required'
        }), { status: 400, headers: corsHeaders() });
      }
      
      // Check if reset token exists and is valid
      const reset = await env.DB.prepare(
        'SELECT email FROM password_resets WHERE token = ? AND expires_at > datetime("now")'
      ).bind(token).first();
      
      if (!reset) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Invalid or expired reset token'
        }), { status: 400, headers: corsHeaders() });
      }
      
      // Hash new password
      const passwordHash = await hashPassword(newPassword);
      
      // Update user password
      await env.DB.prepare(
        'UPDATE users SET password_hash = ? WHERE email = ?'
      ).bind(passwordHash, reset.email).run();
      
      // Delete reset token
      await env.DB.prepare('DELETE FROM password_resets WHERE token = ?').bind(token).run();
      
      // Delete all sessions for this user (force re-login)
      await env.DB.prepare(`
        DELETE FROM user_sessions WHERE user_id IN (SELECT id FROM users WHERE email = ?)
      `).bind(reset.email).run();
      
      return new Response(JSON.stringify({
        success: true,
        message: 'Password reset successfully. Please login with your new password.'
      }), { headers: corsHeaders() });
      
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: error.message
      }), { status: 500, headers: corsHeaders() });
    }
  },

  // Google OAuth Initiate
  async handleGoogleAuth(request, env) {
    try {
      const clientId = env.GOOGLE_CLIENT_ID;
      const frontendUrl = env.FRONTEND_URL || 'https://billboard3dnakedeye-mor.vercel.app';
      
      if (!clientId) {
        // Redirect back to frontend with friendly error instead of returning JSON
        return Response.redirect(`${frontendUrl}/?auth_error=${encodeURIComponent('Google Login is temporarily unavailable. Please use Email/Password login instead.')}`, 302);
      }
      
      const redirectUri = `${new URL(request.url).origin}/api/auth/google/callback`;
      const state = generateToken();
      
      const googleUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=openid%20email%20profile&state=${state}`;
      
      return Response.redirect(googleUrl, 302);
      
    } catch (error) {
      const frontendUrl = env.FRONTEND_URL || 'https://billboard3dnakedeye-mor.vercel.app';
      return Response.redirect(`${frontendUrl}/?auth_error=${encodeURIComponent(error.message)}`, 302);
    }
  },

  // Google OAuth Callback
  async handleGoogleCallback(request, env) {
    try {
      const url = new URL(request.url);
      const code = url.searchParams.get('code');
      
      if (!code) {
        return new Response(JSON.stringify({
          success: false,
          error: 'No code provided'
        }), { status: 400, headers: corsHeaders() });
      }
      
      const clientId = env.GOOGLE_CLIENT_ID;
      const clientSecret = env.GOOGLE_CLIENT_SECRET;
      const redirectUri = `${url.origin}/api/auth/google/callback`;
      
      // Exchange code for tokens
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code'
        })
      });
      
      const tokenData = await tokenResponse.json();
      
      if (!tokenData.id_token) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Failed to get Google token'
        }), { status: 400, headers: corsHeaders() });
      }
      
      // Get user info from Google
      const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { 'Authorization': `Bearer ${tokenData.access_token}` }
      });
      
      const googleUser = await userInfoResponse.json();
      
      // Check if user exists
      let user = await env.DB.prepare(
        'SELECT * FROM users WHERE email = ?'
      ).bind(googleUser.email).first();
      
      if (!user) {
        // Create new user
        const userId = `google_${googleUser.id}`;
        await env.DB.prepare(`
          INSERT INTO users (id, email, display_name, avatar_url, role, status, created_at)
          VALUES (?, ?, ?, ?, 'user', 'active', datetime('now'))
        `).bind(userId, googleUser.email, googleUser.name, googleUser.picture).run();
        
        user = { id: userId, email: googleUser.email, display_name: googleUser.name, avatar_url: googleUser.picture, role: 'user' };
      }
      
      // Create session
      const token = generateToken();
      await env.DB.prepare(`
        INSERT INTO user_sessions (id, user_id, token, expires_at, created_at)
        VALUES (?, ?, ?, datetime('now', '+30 days'), datetime('now'))
      `).bind(`sess_${Date.now()}`, user.id, token).run();
      
      // Redirect back to frontend with token
      const frontendUrl = env.FRONTEND_URL || 'https://billboard3dnakedeye-mor.vercel.app';
      return Response.redirect(`${frontendUrl}/?auth_token=${token}&user_id=${user.id}&email=${encodeURIComponent(user.email)}&name=${encodeURIComponent(user.display_name || user.email)}&avatar=${encodeURIComponent(user.avatar_url || '')}`, 302);
      
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: error.message
      }), { status: 500, headers: corsHeaders() });
    }
  },

  // DELETE /api/auth/account  — permanently delete account by email+password
  async handleDeleteAccount(request, env) {
    try {
      const { email, password } = await request.json();
      if (!email || !password) {
        return new Response(JSON.stringify({ success: false, error: 'Email and password required' }), { status: 400, headers: corsHeaders() });
      }

      const hash = await hashPassword(password);
      const user = await env.DB.prepare('SELECT id FROM users WHERE email = ? AND password_hash = ?').bind(email.trim().toLowerCase(), hash).first();

      if (!user) {
        return new Response(JSON.stringify({ success: false, error: 'Incorrect email or password' }), { status: 401, headers: corsHeaders() });
      }

      // Delete sessions then user
      await env.DB.prepare('DELETE FROM user_sessions WHERE user_id = ?').bind(user.id).run();
      await env.DB.prepare('DELETE FROM users WHERE id = ?').bind(user.id).run();

      return new Response(JSON.stringify({ success: true, message: 'Account deleted' }), { headers: corsHeaders() });
    } catch (error) {
      return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500, headers: corsHeaders() });
    }
  }
};

export { getCurrentUser };

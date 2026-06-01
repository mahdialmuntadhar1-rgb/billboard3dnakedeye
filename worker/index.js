// Cloudflare Worker for Iraq Businesses Dashboard
// With D1 Database and Import System

import { ImportAPI } from './importApi.js';
import { BusinessAPI } from './businessApi.js';
import { AdminAPI } from './adminApi.js';
import { AuthAPI } from './authApi.js';
import { OnboardAPI } from './onboardApi.js';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Import API Routes
    if (path === '/api/business/import' && request.method === 'POST') {
      return ImportAPI.handleImportUpload(request, env);
    }

    if (path === '/api/business/import/preview' && request.method === 'POST') {
      return ImportAPI.handleImportPreview(request, env);
    }

    if (path.startsWith('/api/business/import/status/') && request.method === 'GET') {
      return ImportAPI.handleImportStatus(request, env);
    }

    if (path.startsWith('/api/business/import/errors/') && request.method === 'GET') {
      return ImportAPI.handleImportErrors(request, env);
    }

    if (path === '/api/business/import/history' && request.method === 'GET') {
      return ImportAPI.handleImportHistory(request, env);
    }

    if (path.startsWith('/api/business/import/retry/') && request.method === 'POST') {
      return ImportAPI.handleImportRetry(request, env);
    }

    // Onboarding Routes
    if (path === '/api/onboard/lookup' && request.method === 'POST') {
      return OnboardAPI.handleLookup(request, env);
    }

    if (path === '/api/onboard/claim' && request.method === 'POST') {
      return OnboardAPI.handleClaim(request, env);
    }

    if (path === '/api/onboard/create' && request.method === 'POST') {
      return OnboardAPI.handleCreate(request, env);
    }

    // Business API Routes
    if (path === '/api/businesses' && request.method === 'GET') {
      return BusinessAPI.handleGetBusinesses(request, env);
    }

    if (path.startsWith('/api/businesses/') && request.method === 'GET') {
      return BusinessAPI.handleGetBusiness(request, env);
    }

    if (path === '/api/feed/business-posts' && request.method === 'GET') {
      return BusinessAPI.handleGetFeedPosts(request, env);
    }

    if (path === '/api/governorates' && request.method === 'GET') {
      return BusinessAPI.handleGetGovernorates(request, env);
    }

    if (path === '/api/categories' && request.method === 'GET') {
      return BusinessAPI.handleGetCategories(request, env);
    }

    if (path === '/api/cities' && request.method === 'GET') {
      return BusinessAPI.handleGetCities(request, env);
    }

    // Post CRUD Routes (Public)
    if (path === '/api/posts' && request.method === 'POST') {
      return AdminAPI.handleCreatePost(request, env);
    }

    if (path.startsWith('/api/posts/') && request.method === 'PUT') {
      return AdminAPI.handleUpdatePost(request, env);
    }

    if (path.startsWith('/api/posts/') && request.method === 'DELETE') {
      return AdminAPI.handleDeletePost(request, env);
    }

    // Post Interactions (Public)
    if (path === '/api/posts/like' && request.method === 'POST') {
      return AdminAPI.handleLikePost(request, env);
    }

    if (path === '/api/posts/comment' && request.method === 'POST') {
      return AdminAPI.handleCommentOnPost(request, env);
    }

    if (path === '/api/posts/share' && request.method === 'POST') {
      return AdminAPI.handleSharePost(request, env);
    }

    // Hero Slides (Public GET, Admin CUD)
    if (path === '/api/hero-slides' && request.method === 'GET') {
      return AdminAPI.handleGetHeroSlides(request, env);
    }

    if (path === '/api/hero-slides' && request.method === 'POST') {
      return AdminAPI.handleCreateHeroSlide(request, env);
    }

    if (path.startsWith('/api/hero-slides/') && request.method === 'PUT') {
      return AdminAPI.handleUpdateHeroSlide(request, env);
    }

    if (path.startsWith('/api/hero-slides/') && request.method === 'DELETE') {
      return AdminAPI.handleDeleteHeroSlide(request, env);
    }

    // Banners (Public GET)
    if (path === '/api/banners' && request.method === 'GET') {
      return AdminAPI.handleGetBanners(request, env);
    }

    // Admin Routes
    // Auth Routes
    if (path === '/api/auth/register' && request.method === 'POST') {
      return AuthAPI.handleRegister(request, env);
    }

    if (path === '/api/auth/login' && request.method === 'POST') {
      return AuthAPI.handleLogin(request, env);
    }

    if (path === '/api/auth/google' && request.method === 'GET') {
      return AuthAPI.handleGoogleAuth(request, env);
    }

    if (path === '/api/auth/google/callback' && request.method === 'GET') {
      return AuthAPI.handleGoogleCallback(request, env);
    }

    if (path === '/api/auth/me' && request.method === 'GET') {
      return AuthAPI.handleMe(request, env);
    }

    if (path === '/api/auth/logout' && request.method === 'POST') {
      return AuthAPI.handleLogout(request, env);
    }

    if (path === '/api/auth/forgot-password' && request.method === 'POST') {
      return AuthAPI.handleForgotPassword(request, env);
    }

    if (path === '/api/auth/reset-password' && request.method === 'POST') {
      return AuthAPI.handleResetPassword(request, env);
    }

    if (path === '/api/auth/account' && request.method === 'DELETE') {
      return AuthAPI.handleDeleteAccount(request, env);
    }

    if (path === '/api/admin/login' && request.method === 'POST') {
      return AdminAPI.handleLogin(request, env);
    }

    if (path === '/api/admin/stats' && request.method === 'GET') {
      return AdminAPI.handleGetStats(request, env);
    }

    if (path.startsWith('/api/admin/businesses/') && request.method === 'PUT') {
      return AdminAPI.handleUpdateBusiness(request, env);
    }

    if (path.startsWith('/api/admin/businesses/') && request.method === 'DELETE') {
      return AdminAPI.handleDeleteBusiness(request, env);
    }

    if (path === '/api/admin/comments' && request.method === 'GET') {
      return AdminAPI.handleGetComments(request, env);
    }

    if (path.startsWith('/api/admin/comments/') && request.method === 'DELETE') {
      return AdminAPI.handleDeleteComment(request, env);
    }

    if (path === '/api/health' && request.method === 'GET') {
      try {
        // Test database connection
        await env.DB.prepare('SELECT 1').first();
        
        const businessCount = await env.DB.prepare('SELECT COUNT(*) as count FROM businesses').first();
        
        return new Response(JSON.stringify({
          success: true,
          message: 'API is running',
          database: 'connected',
          businessCount: businessCount?.count || 0
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } catch (error) {
        return new Response(JSON.stringify({
          success: false,
          message: 'Database connection failed',
          error: error.message
        }), {
          status: 503,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    // API-only worker — no static file serving
    return new Response(JSON.stringify({
      success: false,
      message: 'API route not found',
      availableRoutes: ['/api/health', '/api/businesses', '/api/categories', '/api/governorates', '/api/auth/login', '/api/auth/register']
    }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
};

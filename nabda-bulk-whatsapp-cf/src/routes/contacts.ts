import { Hono } from 'hono';
import { D1Client } from '../db/d1-client';
import { normalizePhoneNumber, validatePhoneNumber } from '../utils/phone-normalization';
import { detectLanguage } from '../utils/language-detection';
import type { Env } from '../middleware/auth';

const contacts = new Hono<{ Bindings: Env }>();

// GET /api/contacts - List contacts with pagination and filters
contacts.get('/', async (c) => {
  const db = new D1Client(c.env.DB);
  const page = parseInt(c.req.query('page') || '1');
  const limit = parseInt(c.req.query('limit') || '50');
  const search = c.req.query('search') || '';
  const governorates = c.req.query('governorate')?.split(',') || [];

  const result = await db.getContacts({
    page,
    limit,
    search: search || undefined,
    governorates: governorates.length > 0 ? governorates as any : undefined,
  });

  return c.json({
    success: true,
    contacts: result.contacts,
    pagination: {
      page,
      limit,
      total: result.total,
      pages: result.pages,
    },
  });
});

// POST /api/contacts - Create a single contact
contacts.post('/', async (c) => {
  const db = new D1Client(c.env.DB);
  const body = await c.req.json();

  const { name, phone, governorate, language, tags } = body;

  if (!name || !phone) {
    return c.json({ error: 'Name and phone are required' }, 400);
  }

  if (!validatePhoneNumber(phone)) {
    return c.json({ error: 'Invalid phone number format' }, 400);
  }

  const normalizedPhone = normalizePhoneNumber(phone);
  const detectedLanguage = language || (governorate ? detectLanguage(governorate) : 'arabic');

  try {
    const contact = await db.createContact({
      name,
      phone: normalizedPhone,
      governorate,
      language: detectedLanguage,
      tags,
    });

    return c.json({ success: true, contact }, 201);
  } catch (error: any) {
    if (error.message?.includes('UNIQUE constraint')) {
      return c.json({ error: 'Contact with this phone and governorate already exists' }, 409);
    }
    return c.json({ error: 'Failed to create contact' }, 500);
  }
});

// PUT /api/contacts/:id - Update a contact
contacts.put('/:id', async (c) => {
  const db = new D1Client(c.env.DB);
  const id = c.req.param('id');
  const body = await c.req.json();

  const updateData: any = {};
  if (body.name) updateData.name = body.name;
  if (body.phone) {
    if (!validatePhoneNumber(body.phone)) {
      return c.json({ error: 'Invalid phone number format' }, 400);
    }
    updateData.phone = normalizePhoneNumber(body.phone);
  }
  if (body.governorate !== undefined) updateData.governorate = body.governorate;
  if (body.language !== undefined) updateData.language = body.language;
  if (body.tags !== undefined) updateData.tags = body.tags;

  const contact = await db.updateContact(id, updateData);

  if (!contact) {
    return c.json({ error: 'Contact not found' }, 404);
  }

  return c.json({ success: true, contact });
});

// DELETE /api/contacts/:id - Delete a contact
contacts.delete('/:id', async (c) => {
  const db = new D1Client(c.env.DB);
  const id = c.req.param('id');

  const deleted = await db.deleteContact(id);

  if (!deleted) {
    return c.json({ error: 'Contact not found' }, 404);
  }

  return c.json({ success: true, message: 'Contact deleted successfully' });
});

// DELETE /api/contacts/bulk - Bulk delete contacts
contacts.delete('/bulk', async (c) => {
  const db = new D1Client(c.env.DB);
  const { ids } = await c.req.json();

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return c.json({ error: 'Contact IDs are required' }, 400);
  }

  const deleted = await db.deleteContactsBulk(ids);

  return c.json({ success: true, deleted });
});

// GET /api/contacts/governorates/counts - Get contact counts by governorate
contacts.get('/governorates/counts', async (c) => {
  const db = new D1Client(c.env.DB);
  const counts = await db.getGovernorateCounts();

  return c.json({ success: true, counts });
});

// POST /api/contacts/import - Import contacts from CSV file (FormData)
contacts.post('/import', async (c) => {
  const db = new D1Client(c.env.DB);

  const formData = await c.req.formData();
  const file = formData.get('file') as File;
  const duplicateHandling = (formData.get('duplicateHandling') as string) || 'skip';

  if (!file) {
    return c.json({ error: 'CSV file is required' }, 400);
  }

  const text = await file.text();
  const lines = text.split('\n');

  // Parse CSV headers
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/^\uFEFF/, ''));
  const rows = lines.slice(1).filter(line => line.trim());

  let inserted = 0;
  let duplicates = 0;
  let errors = 0;
  const errorDetails: any[] = [];

  for (let i = 0; i < rows.length; i++) {
    const values = rows[i].split(',').map(v => v.trim());
    const row: any = {};

    headers.forEach((header: string, index: number) => {
      row[header] = values[index];
    });

    try {
      if (!row.name || !row.phone) {
        errors++;
        errorDetails.push({ row: i + 2, message: 'Missing name or phone' });
        continue;
      }

      // Normalize phone
      const phone = row.phone.replace(/\D/g, '');
      const normalizedPhone = phone.startsWith('0') ? `+964${phone.substring(1)}` : `+964${phone}`;

      // Check for duplicate by phone
      const existing = await db.getContacts({
        search: normalizedPhone,
        limit: 1,
      });

      if (existing.contacts.length > 0) {
        if (duplicateHandling === 'overwrite') {
          await db.updateContact(existing.contacts[0].id!, {
            name: row.name,
            phone: normalizedPhone,
            governorate: row.governorate,
            email: row.email,
            tags: row.tags ? row.tags.split(';') : undefined,
          });
          inserted++;
        } else {
          duplicates++;
        }
      } else {
        await db.createContact({
          name: row.name,
          phone: normalizedPhone,
          governorate: row.governorate,
          email: row.email,
          tags: row.tags ? row.tags.split(';') : undefined,
        });
        inserted++;
      }
    } catch (error: any) {
      errors++;
      errorDetails.push({ row: i + 2, message: error.message });
    }
  }

  return c.json({
    success: true,
    event: 'complete',
    inserted,
    duplicates,
    errors,
    total: rows.length,
    errorDetails,
  });
});

export default contacts;

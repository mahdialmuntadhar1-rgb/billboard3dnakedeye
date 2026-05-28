import { createClient } from '@supabase/supabase-js';

const getSupabase = () => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(`Missing Supabase config: URL=${!!url}, KEY=${!!key}`);
  }

  return createClient(url, key);
};

function validateTemplate(template: any) {
  const errors: string[] = [];

  if (!template.name || template.name.trim().length === 0) {
    errors.push('Template name is required');
  }
  if (!template.body || template.body.trim().length === 0) {
    errors.push('Template body is required');
  }
  if (template.body && template.body.length > 1024) {
    errors.push('Template body must be less than 1024 characters');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

export default async function handler(req: any, res: any) {
  try {
    const supabase = getSupabase();
    const { method, query, body } = req;
    const id = query.id as string;

    // GET /api/templates - List all templates
    if (method === 'GET' && !id) {
      const { is_active } = query;

      let queryBuilder = supabase
        .from('message_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (is_active !== undefined) {
        queryBuilder = queryBuilder.eq('is_active', is_active === 'true');
      }

      const { data, error } = await queryBuilder;

      if (error) throw error;

      return res.status(200).json({ templates: data });
    }

    // POST /api/templates - Create new template
    if (method === 'POST' && !id) {
      const { name, body: templateBody, cta_type, cta_value, weight, is_active } = body;

      const template = {
        name,
        body: templateBody,
        cta_type: cta_type || 'none',
        cta_value,
        weight: weight || 1,
        is_active: is_active ?? true,
      };

      const validation = validateTemplate(template);
      if (!validation.valid) {
        return res.status(400).json({ errors: validation.errors });
      }

      const { data, error } = await supabase
        .from('message_templates')
        .insert(template)
        .select()
        .single();

      if (error) throw error;

      return res.status(200).json({ template: data });
    }

    // GET /api/templates/:id - Get single template
    if (method === 'GET' && id && id !== 'validate') {
      const { data, error } = await supabase
        .from('message_templates')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) {
        return res.status(404).json({ error: 'Template not found' });
      }

      return res.status(200).json({ template: data });
    }

    // PUT /api/templates/:id - Update template
    if (method === 'PUT' && id) {
      const { name, body: templateBody, cta_type, cta_value, weight, is_active } = body;

      const update: any = {
        name,
        body: templateBody,
        cta_type,
        cta_value,
        weight,
        is_active,
      };

      Object.keys(update).forEach(key => {
        if (update[key] === undefined) {
          delete update[key];
        }
      });

      const { data, error } = await supabase
        .from('message_templates')
        .update(update)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return res.status(200).json({ template: data });
    }

    // DELETE /api/templates/:id - Delete template
    if (method === 'DELETE' && id) {
      const { error } = await supabase
        .from('message_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return res.status(200).json({ success: true });
    }

    res.status(404).json({ error: 'Not found' });
  } catch (error: any) {
    console.error('API Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

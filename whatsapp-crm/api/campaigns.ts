import { createClient } from '@supabase/supabase-js';

const getSupabase = () => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(`Missing Supabase config: URL=${!!url}, KEY=${!!key}`);
  }

  return createClient(url, key);
};

export default async function handler(req: any, res: any) {
  try {
    const supabase = getSupabase();
    const { method, query, body } = req;
    const id = query.id as string;

    // GET /api/campaigns - List all campaigns
    if (method === 'GET' && !id) {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return res.status(200).json({ campaigns: data });
    }

    // POST /api/campaigns - Create new campaign
    if (method === 'POST' && !id) {
      const { name, description, template_strategy, audience_filters, template_ids } = body;

      const { data: campaign, error: campaignError } = await supabase
        .from('campaigns')
        .insert({
          name,
          description,
          template_strategy: template_strategy || 'single_template',
          audience_filters: audience_filters || {},
          status: 'draft',
        })
        .select()
        .single();

      if (campaignError) throw campaignError;

      if (template_ids && template_ids.length > 0) {
        const campaignTemplates = template_ids.map((templateId: string) => ({
          campaign_id: campaign.id,
          template_id: templateId,
        }));

        const { error: linkError } = await supabase
          .from('campaign_templates')
          .insert(campaignTemplates);

        if (linkError) throw linkError;
      }

      return res.status(200).json({ campaign });
    }

    // GET /api/campaigns/:id - Get campaign with templates
    if (method === 'GET' && id) {
      const { data: campaign, error: campaignError } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', id)
        .single();

      if (campaignError) throw campaignError;

      const { data: templates, error: templatesError } = await supabase
        .from('campaign_templates')
        .select('template_id, message_templates(*)')
        .eq('campaign_id', id);

      if (templatesError) throw templatesError;

      return res.status(200).json({
        campaign,
        templates: templates?.map((t: any) => t.message_templates) || []
      });
    }

    // PUT /api/campaigns/:id - Update campaign
    if (method === 'PUT' && id) {
      const { name, description, template_strategy, audience_filters, status } = body;

      const { data, error } = await supabase
        .from('campaigns')
        .update({
          name,
          description,
          template_strategy,
          audience_filters,
          status,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return res.status(200).json({ campaign: data });
    }

    // DELETE /api/campaigns/:id - Delete campaign
    if (method === 'DELETE' && id) {
      const { error } = await supabase
        .from('campaigns')
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

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

    // GET /api/messages/status - Get message status stats
    if (method === 'GET' && query.status === '') {
      const { data, error } = await supabase
        .from('messages')
        .select('status');

      if (error) throw error;

      const stats = {
        total: data?.length || 0,
        pending: data?.filter((m: any) => m.status === 'pending').length || 0,
        sent: data?.filter((m: any) => m.status === 'sent').length || 0,
        delivered: data?.filter((m: any) => m.status === 'delivered').length || 0,
        read: data?.filter((m: any) => m.status === 'read').length || 0,
        failed: data?.filter((m: any) => m.status === 'failed').length || 0,
      };

      return res.status(200).json(stats);
    }

    // POST /api/messages/queue - Queue messages for sending
    if (method === 'POST' && body.campaign_id) {
      const { campaign_id, businesses, test_message_type, landing_page_variant, recipient_count } = body;

      // Create message records
      const messages = businesses.map((b: any) => ({
        campaign_id,
        phone: b.phone,
        business_name: b.name,
        status: 'pending',
        message_type: test_message_type || 'standard',
        landing_page_variant: landing_page_variant || 'default'
      }));

      const { data, error } = await supabase
        .from('messages')
        .insert(messages)
        .select();

      if (error) throw error;

      return res.status(200).json({
        queued: data?.length || 0,
        messages: data || [],
        safety_summary: {
          total_queued: data?.length || 0,
          test_message_type,
          campaign_id
        }
      });
    }

    // POST /api/messages/send - Send queued messages
    if (method === 'POST' && body.limit) {
      const { limit, campaign_id } = body;

      let queryBuilder = supabase
        .from('messages')
        .select('*')
        .eq('status', 'pending')
        .limit(limit);

      if (campaign_id) {
        queryBuilder = queryBuilder.eq('campaign_id', campaign_id);
      }

      const { data: pending, error: pendingError } = await queryBuilder;

      if (pendingError) throw pendingError;

      if (!pending || pending.length === 0) {
        return res.status(200).json({ sent: 0, failed: 0, results: [] });
      }

      // Mark as sent (in production would call Nabda API)
      const { error: updateError } = await supabase
        .from('messages')
        .update({ status: 'sent', sent_at: new Date().toISOString() })
        .in('id', pending.map((m: any) => m.id));

      if (updateError) throw updateError;

      return res.status(200).json({
        sent: pending.length,
        failed: 0,
        results: pending
      });
    }

    // GET /api/messages/pending - Get pending count
    if (method === 'GET' && query.pending !== undefined) {
      const { campaign_id } = query;

      let queryBuilder = supabase
        .from('messages')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'pending');

      if (campaign_id) {
        queryBuilder = queryBuilder.eq('campaign_id', campaign_id);
      }

      const { count, error } = await queryBuilder;

      if (error) throw error;

      return res.status(200).json({ pending: count || 0 });
    }

    res.status(404).json({ error: 'Not found' });
  } catch (error: any) {
    console.error('Messages API Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

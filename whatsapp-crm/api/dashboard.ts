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
    if (req.method === 'GET') {
      const { data: campaigns, error: campaignsError } = await supabase
        .from('campaigns')
        .select('*');

      if (campaignsError) throw campaignsError;

      const { data: messages, error: messagesError } = await supabase
        .from('messages')
        .select('status');

      if (messagesError) throw messagesError;

      const stats = {
        total_campaigns: campaigns?.length || 0,
        active_campaigns: campaigns?.filter((c: any) => c.status === 'running').length || 0,
        total_messages: messages?.length || 0,
        sent_messages: messages?.filter((m: any) => m.status === 'sent').length || 0,
        failed_messages: messages?.filter((m: any) => m.status === 'failed').length || 0,
        delivered_messages: messages?.filter((m: any) => m.status === 'delivered').length || 0,
      };

      return res.status(200).json(stats);
    }

    res.status(404).json({ error: 'Not found' });
  } catch (error: any) {
    console.error('Dashboard API Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

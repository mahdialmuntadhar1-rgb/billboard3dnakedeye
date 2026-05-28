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
    const phone = query.phone as string;

    // GET /api/inbox/stats/unread - Get unread count
    if (method === 'GET' && query.stats === 'unread') {
      const { data, error } = await supabase
        .from('inbox_messages')
        .select('id', { count: 'exact', head: true })
        .eq('is_read', false);

      if (error) throw error;

      return res.status(200).json({ unread: data?.length || 0 });
    }

    // GET /api/inbox - List conversations
    if (method === 'GET' && !phone) {
      const { unread_only, limit } = query;

      let queryBuilder = supabase
        .from('conversations')
        .select('*')
        .order('updated_at', { ascending: false });

      if (unread_only === 'true') {
        queryBuilder = queryBuilder.eq('has_unread', true);
      }

      if (limit) {
        queryBuilder = queryBuilder.limit(parseInt(limit));
      }

      const { data, error, count } = await queryBuilder;

      if (error) throw error;

      return res.status(200).json({
        conversations: data || [],
        total: count || 0
      });
    }

    // GET /api/inbox/conversation/:phone - Get conversation
    if (method === 'GET' && phone) {
      const { data: messages, error: messagesError } = await supabase
        .from('inbox_messages')
        .select('*')
        .eq('phone', phone)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;

      const { data: business, error: businessError } = await supabase
        .from('conversations')
        .select('business_name')
        .eq('phone', phone)
        .single();

      if (businessError && businessError.code !== 'PGRST116') throw businessError;

      return res.status(200).json({
        phone,
        messages: messages || [],
        business_name: business?.business_name
      });
    }

    // POST /api/inbox/reply - Send reply
    if (method === 'POST' && body.phone) {
      const { phone: replyPhone, content, replied_by } = body;

      const { data, error } = await supabase
        .from('inbox_messages')
        .insert({
          phone: replyPhone,
          content,
          direction: 'outbound',
          is_read: true,
          replied_by: replied_by || 'system'
        })
        .select()
        .single();

      if (error) throw error;

      return res.status(200).json({ message: data });
    }

    // POST /api/inbox/mark-read - Mark conversation as read
    if (method === 'POST' && body.phone) {
      const { phone: readPhone } = body;

      const { error } = await supabase
        .from('inbox_messages')
        .update({ is_read: true })
        .eq('phone', readPhone)
        .eq('direction', 'inbound');

      if (error) throw error;

      return res.status(200).json({ success: true });
    }

    res.status(404).json({ error: 'Not found' });
  } catch (error: any) {
    console.error('Inbox API Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

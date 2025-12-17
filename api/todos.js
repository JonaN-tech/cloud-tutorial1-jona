import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // Validate environment variables before creating the client
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    console.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY');
    return res.status(500).json({ error: 'Supabase environment variables are not set' });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase.from('todos').select('*');
      if (error) throw error;
      return res.status(200).json(data);
    } else if (req.method === 'POST') {
      const { title } = req.body || {};
      if (!title) return res.status(400).json({ error: 'Missing title in request body' });

      const { data, error } = await supabase
        .from('todos')
        .insert([{ title, completed: false }])
        .single();
      if (error) throw error;
      return res.status(201).json(data);
    } else {
      res.setHeader('Allow', 'GET,POST');
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}

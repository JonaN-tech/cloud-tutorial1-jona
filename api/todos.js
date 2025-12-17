import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('todos')
        .select('*');

      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const { text } = req.body;
      if (!text) {
        return res.status(400).json({ error: "Missing text" });
      }

      const { data, error } = await supabase
        .from('todos')
        .insert([{ text }]);

      if (error) throw error;
      return res.status(201).json(data);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}

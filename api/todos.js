import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
    try {
    if (req.method === 'GET') {
      const { data, error } = await supabase.from('todos').select('*');
      if (error) throw error;
      res.status(200).json(data);   
    }
    if (req.method === 'POST'){
      const { title } = req.body;
      const { data, error } = await supabase
        .from('todos')
        .insert([{ title, completed: false }])
        .single();
      if (error) throw error;
      res.status(201).json(data);
    }
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: error.message });
    }
}

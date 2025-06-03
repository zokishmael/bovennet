require('dotenv').config({ path: process.env.ENV_PATH || '.env' });
const path = require('path');
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const app = express();
const port = process.env.PORT || 3000;


const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const APP_PASSWORD = process.env.APP_PASSWORD;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Supabase credentials missing!");
  process.exit(1);
}

// Inisialisasi Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Middleware
app.use(cors());
app.use(express.json());

// Endpoint untuk konfigurasi
app.get('/api/config', (req, res) => {
  res.json({
    appName: "Sistem Pencarian KTP",
    features: ["Pencarian Nama", "Pencarian NIK", "Pencarian KK"]
  });
});

// Endpoint login
app.post('/api/login', (req, res) => {
  const { password } = req.body;
  
  if (password === process.env.APP_PASSWORD) {
    res.json({ success: true });
  } else {
    res.status(401).json({ 
      success: false, 
      message: "Password salah" 
    });
  }
});

// Endpoint pencarian
app.post('/api/search', async (req, res) => {
  const { searchType, searchTerm, page = 1 } = req.body;
  const itemsPerPage = 12;
  const offset = (page - 1) * itemsPerPage;

  try {
    let query = supabase
      .from('ktp')
      .select('*', { count: 'exact' })
      .range(offset, offset + itemsPerPage - 1);

    switch(searchType) {
      case 'nama_lengkap':
        query = query.ilike('nama_lengkap', `%${searchTerm}%`);
        break;
      case 'nik':
        query = query.eq('nik', searchTerm);
        break;
      case 'no_kk':
        query = query.eq('no_kk', searchTerm);
        break;
      case 'bulan_lahir':
        query = query.filter('tgl_lhr', 'like', `%-${searchTerm.padStart(2, '0')}-%`);
        break;
      case 'tahun_lahir':
        query = query.filter('tgl_lhr', 'like', `${searchTerm}-%`);
        break;
      case 'nama_kec':
        query = query.ilike('nama_kec', `%${searchTerm}%`);
        break;
    }

    const { data, error, count } = await query;

    if (error) throw error;

    res.json({
      success: true,
      data,
      total: count,
      page,
      totalPages: Math.ceil(count / itemsPerPage)
    });
    
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mencari data",
      error: error.message
    });
  }
});

// Endpoint untuk detail orang
app.get('/api/person/:nik', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('ktp')
      .select('*')
      .eq('nik', req.params.nik)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: "Data tidak ditemukan" });

    res.json(data);
    
  } catch (error) {
    console.error('Person detail error:', error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil detail",
      error: error.message
    });
  }
});

// Endpoint untuk keluarga
app.get('/api/family/:no_kk', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('ktp')
      .select('nik, nama_lengkap, jenis_kelamin, tgl_lhr, status_hub_keluarga, id_foto')
      .eq('no_kk', req.params.no_kk);

    if (error) throw error;
    
    res.json(data || []);
    
  } catch (error) {
    console.error('Family data error:', error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil data keluarga",
      error: error.message
    });
  }
});

// Static files handling - HARUS di bawah route API
app.use(express.static(path.join(__dirname, 'public')));

// Fallback untuk SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

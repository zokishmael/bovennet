import { useState } from 'react';
import { supabase } from '../../hooks/useSupabase';
import { toast } from 'react-hot-toast';

interface CreateFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CreateForm({ onSuccess, onCancel }: CreateFormProps) {
  const [formData, setFormData] = useState({
    nik: '',
    no_kk: '',
    nama_lengkap: '',
    jenis_kelamin: 'LAKI-LAKI',
    tmpt_lhr: '',
    tgl_lhr: '',
    ibu: '',
    ayah: '',
    status_hub_keluarga: '',
    jenis_pekerjaan: '',
    alamat: '',
    nama_kec: '',
    nama_kel: '',
    id_foto: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Auto-format NIK dan No KK (hanya angka, max 16 digit)
    if (name === 'nik' || name === 'no_kk') {
      const numericValue = value.replace(/\D/g, '').slice(0, 16);
      setFormData(prev => ({ ...prev, [name]: numericValue }));
      return;
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Validasi
  if (!/^\d{16}$/.test(formData.nik)) {
    toast.error('NIK harus 16 digit angka');
    return;
  }

  if (!/^\d{16}$/.test(formData.no_kk)) {
    toast.error('No KK harus 16 digit angka');
    return;
  }

  if (!formData.nama_lengkap.trim()) {
    toast.error('Nama lengkap wajib diisi');
    return;
  }

  setIsSubmitting(true);
  
  try {
    const { data, error } = await supabase
      .from('ktp')
      .insert([{
        nik: formData.nik,
        no_kk: formData.no_kk,
        nama_lengkap: formData.nama_lengkap,
        jenis_kelamin: formData.jenis_kelamin,
        tmpt_lhr: formData.tmpt_lhr || null,
        tgl_lhr: formData.tgl_lhr || null,
        ibu: formData.ibu || null,
        ayah: formData.ayah || null,
        status_hub_keluarga: formData.status_hub_keluarga || null,
        jenis_pekerjaan: formData.jenis_pekerjaan || null,
        alamat: formData.alamat || null,
        nama_kec: formData.nama_kec || null,
        nama_kel: formData.nama_kel || null,
        id_foto: formData.id_foto || null
      }])
      .select(); // Tambahkan ini untuk mendapatkan response data

    if (error) {
      console.error('Supabase error details:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      throw new Error('Tidak ada data yang dikembalikan setelah insert');
    }

    toast.success('Data berhasil ditambahkan');
    onSuccess();
  } catch (error) {
    console.error('Error creating data:', error);
    toast.error(`Gagal menambahkan data`);
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-4 pt-6">
      <div className="bg-blue-800 p-4 rounded-lg mb-4">
        <h3 className="text-lg font-medium text-white">Data Baru - Wajib 16 Digit Angka</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300">NIK (16 digit angka)</label>
          <input
            type="text"
            name="nik"
            value={formData.nik}
            onChange={handleChange}
            pattern="\d{16}"
            title="Harus 16 digit angka"
            maxLength={16}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300">No. KK (16 digit angka)</label>
          <input
            type="text"
            name="no_kk"
            value={formData.no_kk}
            onChange={handleChange}
            pattern="\d{16}"
            title="Harus 16 digit angka"
            maxLength={16}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300">Nama Lengkap</label>
          <input
            type="text"
            name="nama_lengkap"
            value={formData.nama_lengkap}
            onChange={handleChange}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Jenis Kelamin</label>
          <select
            name="jenis_kelamin"
            value={formData.jenis_kelamin}
            onChange={handleChange}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          >
            <option value="LAKI-LAKI">Laki-laki</option>
            <option value="PEREMPUAN">Perempuan</option>
          </select>
        </div>
		<div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Tempat Lahir</label>
          <input
            type="text"
            name="tmpt_lhr"
            value={formData.tmpt_lhr}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
          />
        </div>
		<div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Tanggal Lahir</label>
          <input
            type="date"
            name="tgl_lhr"
            value={formData.tgl_lhr}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
          />
        </div>
  <div>
          <label className="block text-sm font-medium text-gray-300">Distrik</label>
          <input
            type="text"
            name="nama_kec"
            value={formData.nama_kec}
            onChange={handleChange}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
		<div>
          <label className="block text-sm font-medium text-gray-300">Kelurahan</label>
          <input
            type="text"
            name="nama_kel"
            value={formData.nama_kel}
            onChange={handleChange}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
		<div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Nama Ayah</label>
          <input
            type="text"
            name="ayah"
            value={formData.ayah}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
          />
        </div>
		<div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Nama Ibu</label>
          <input
            type="text"
            name="ibu"
            value={formData.ibu}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Status dalam Keluarga</label>
          <input
            type="text"
            name="status_hub_keluarga"
            value={formData.status_hub_keluarga}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
          />
        </div>
		<div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Pekerjaan</label>
          <input
            type="text"
            name="jenis_pekerjaan"
            value={formData.jenis_pekerjaan}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Alamat</label>
          <textarea
            name="alamat"
            value={formData.alamat}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
          />
        </div>
		<div>
          <label className="block text-sm font-medium text-gray-300 mb-1">ID Foto (Google Drive ID)</label>
          <input
            type="text"
            name="id_foto"
            value={formData.id_foto || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Menyimpan...' : 'Simpan Data Baru'}
        </button>
      </div>
    </form>
  );
}
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface KTPData {
  nik: string;
  no_kk: string;
  nama_lengkap: string;
  jenis_kelamin: string;
  tmpt_lhr: string;
  tgl_lhr: string;
  ibu: string;
  ayah: string;
  status_hub_keluarga: string;
  jenis_pekerjaan: string;
  alamat: string;
  nama_kec: string;
  nama_kel: string;
  id_foto?: string;
}


interface EditFormProps {
  data: KTPData;
  onUpdate: (data: KTPData) => void;
  onCancel: () => void;
}

export default function EditForm({ data, onUpdate, onCancel }: EditFormProps) {
  const [formData, setFormData] = useState<KTPData>(data);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi field wajib
    if (!formData.nik || !formData.no_kk || !formData.nama_lengkap) {
      toast.error('NIK, No KK, dan Nama Lengkap wajib diisi');
      return;
    }

    onUpdate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Kolom 1 */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">NIK</label>
          <input
            type="text"
            name="nik"
            value={formData.nik}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">No KK</label>
          <input
            type="text"
            name="no_kk"
            value={formData.no_kk}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Nama Lengkap</label>
          <input
            type="text"
            name="nama_lengkap"
            value={formData.nama_lengkap}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Jenis Kelamin</label>
          <select
            name="jenis_kelamin"
            value={formData.jenis_kelamin}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
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
      </div>

      {/* Kolom 2 */}
      <div className="space-y-4">
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

      {/* Tombol Aksi */}
      <div className="md:col-span-2 flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          Batal
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Simpan Perubahan
        </button>
      </div>
    </form>
  );
}
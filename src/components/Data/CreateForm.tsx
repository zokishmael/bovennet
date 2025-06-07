import { useState } from 'react'
import { supabase } from '../../hooks/useSupabase'
import { toast } from 'react-hot-toast'

interface CreateFormProps {
  onSuccess: () => void
  onCancel: () => void
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
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.nik.length !== 16) {
      toast.error('NIK must be 16 digits')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Check if NIK already exists
      const { data: existingData } = await supabase
        .from('ktp')
        .select('nik')
        .eq('nik', formData.nik)
        .single()

      if (existingData) {
        toast.error('NIK already exists in database')
        setIsSubmitting(false)
        return
      }

      const { error } = await supabase
        .from('ktp')
        .insert([formData])

      if (error) throw error

      toast.success('Data created successfully')
      onSuccess()
    }catch (error: unknown) {
  if (error instanceof Error) {
    console.error('Error:', error.message);
    toast.error('Error: ' + error.message);
  } else {
    console.error('Unknown error:', error);
    toast.error('An unknown error occurred');
  }
} finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300">NIK (16 digits)</label>
          <input
            type="text"
            name="nik"
            value={formData.nik}
            onChange={handleChange}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
            maxLength={16}
            minLength={16}
            pattern="\d{16}"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300">No. KK (16 digits)</label>
          <input
            type="text"
            name="no_kk"
            value={formData.no_kk}
            onChange={handleChange}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
            maxLength={16}
            minLength={16}
            pattern="\d{16}"
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300">Full Name</label>
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
          <label className="block text-sm font-medium text-gray-300">Gender</label>
          <select
            name="jenis_kelamin"
            value={formData.jenis_kelamin}
            onChange={handleChange}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          >
            <option value="LAKI-LAKI">Male</option>
            <option value="PEREMPUAN">Female</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300">Birth Place</label>
          <input
            type="text"
            name="tmpt_lhr"
            value={formData.tmpt_lhr}
            onChange={handleChange}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300">Birth Date</label>
          <input
            type="date"
            name="tgl_lhr"
            value={formData.tgl_lhr}
            onChange={handleChange}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300">Mother's Name</label>
          <input
            type="text"
            name="ibu"
            value={formData.ibu}
            onChange={handleChange}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300">Father's Name</label>
          <input
            type="text"
            name="ayah"
            value={formData.ayah}
            onChange={handleChange}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300">Family Status</label>
          <input
            type="text"
            name="status_hub_keluarga"
            value={formData.status_hub_keluarga}
            onChange={handleChange}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300">Occupation</label>
          <input
            type="text"
            name="jenis_pekerjaan"
            value={formData.jenis_pekerjaan}
            onChange={handleChange}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300">Address</label>
          <textarea
            name="alamat"
            value={formData.alamat}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300">District</label>
          <input
            type="text"
            name="nama_kec"
            value={formData.nama_kec}
            onChange={handleChange}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300">Village</label>
          <input
            type="text"
            name="nama_kel"
            value={formData.nama_kel}
            onChange={handleChange}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300">Photo ID (Google Drive ID)</label>
          <input
            type="text"
            name="id_foto"
            value={formData.id_foto}
            onChange={handleChange}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Creating...' : 'Create'}
        </button>
      </div>
    </form>
  );
}
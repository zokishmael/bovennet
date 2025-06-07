import { useState } from 'react';
import { supabase } from '../../hooks/useSupabase';
import { toast } from 'react-hot-toast';
import ViewData from './ViewData';
import EditForm from './EditForm';

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

interface DataListProps {
  data: KTPData[];
  onDelete: (nik: string) => void;
  onRefresh: () => void;
}

export default function DataList({ data, onDelete, onRefresh }: DataListProps) {
  const [selectedData, setSelectedData] = useState<KTPData | null>(null);
  const [viewMode, setViewMode] = useState<'view' | 'edit'>('view');
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Pagination logic
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const currentData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Fungsi untuk menghasilkan tombol halaman
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5; // Jumlah maksimal tombol halaman yang ditampilkan

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Sesuaikan jika di ujung
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Tombol First Page
    if (startPage > 1) {
      pageNumbers.push(
        <button
          key={1}
          onClick={() => setCurrentPage(1)}
          className={`px-3 py-1 rounded ${1 === currentPage ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
        >
          1
        </button>
      );
      if (startPage > 2) {
        pageNumbers.push(<span key="ellipsis-start" className="px-2">...</span>);
      }
    }

    // Tombol Halaman
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-3 py-1 rounded ${i === currentPage ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
        >
          {i}
        </button>
      );
    }

    // Tombol Last Page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push(<span key="ellipsis-end" className="px-2">...</span>);
      }
      pageNumbers.push(
        <button
          key={totalPages}
          onClick={() => setCurrentPage(totalPages)}
          className={`px-3 py-1 rounded ${totalPages === currentPage ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
        >
          {totalPages}
        </button>
      );
    }

    return pageNumbers;
  };

  const handleView = (item: KTPData) => {
    setSelectedData(item);
    setViewMode('view');
    setIsOpen(true);
  };

  const handleEdit = (item: KTPData) => {
    setSelectedData(item);
    setViewMode('edit');
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedData(null);
  };

const handleUpdate = async (updatedData: KTPData) => {
  try {
    console.log('Data yang akan diupdate:', updatedData);
    
    // Hilangkan field yang tidak perlu atau bermasalah
    const { data, error } = await supabase
      .from('ktp')
      .update({
        no_kk: updatedData.no_kk,
        nama_lengkap: updatedData.nama_lengkap,
        jenis_kelamin: updatedData.jenis_kelamin,
        tmpt_lhr: updatedData.tmpt_lhr,
        tgl_lhr: updatedData.tgl_lhr || null,
        ibu: updatedData.ibu || null,
        ayah: updatedData.ayah || null,
        status_hub_keluarga: updatedData.status_hub_keluarga || null,
        jenis_pekerjaan: updatedData.jenis_pekerjaan || null,
        alamat: updatedData.alamat || null,
        nama_kec: updatedData.nama_kec || null,
        nama_kel: updatedData.nama_kel || null,
        id_foto: updatedData.id_foto || null
      })
      .eq('nik', updatedData.nik)
      .select();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      // Cek apakah data benar-benar ada
      const { data: checkData } = await supabase
        .from('ktp')
        .select('nik')
        .eq('nik', updatedData.nik);
      
      if (!checkData || checkData.length === 0) {
        throw new Error(`Data dengan NIK ${updatedData.nik} tidak ditemukan`);
      } else {
        throw new Error('Update gagal tanpa pesan error');
      }
    }

    toast.success('Data berhasil diperbarui');
    onRefresh();
    handleClose();
  } catch (error) {
    console.error('Update error:', error);
    toast.error(`Gagal memperbarui data: ${error.message}`);
  }
};

  return (
    <div className="mt-8">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Foto
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Informasi
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-900 divide-y divide-gray-700">
            {currentData.map((item) => (
              <tr key={item.nik}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex-shrink-0 h-12 w-12">
                    <img
  className="h-12 w-12 rounded-full object-cover"
  src={item.id_foto 
    ? `https://bovennet.web.app/photos/${item.nik}.jpg`
    : item.jenis_kelamin === 'LAKI-LAKI' 
      ? '/male-placeholder.jpg' 
      : '/female-placeholder.jpg'}
  alt={item.nama_lengkap} 
  loading="lazy"  
  decoding="async" 
  data-nimg="1" 
/>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-white">{item.nama_lengkap}</div>
                  <div className="text-sm text-gray-300">NIK: {item.nik}</div>
                  <div className="text-sm text-gray-300">No KK: {item.no_kk}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleView(item)}
                    className="mr-2 text-indigo-400 hover:text-indigo-300"
                  >
                    Lihat
                  </button>
                  <button
                    onClick={() => handleEdit(item)}
                    className="mr-2 text-yellow-400 hover:text-yellow-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(item.nik)}
                    className="text-red-400 hover:text-red-300"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-400">
            Menampilkan {(currentPage - 1) * itemsPerPage + 1} -{' '}
            {Math.min(currentPage * itemsPerPage, data.length)} dari {data.length} data
          </div>
          
          <div className="flex space-x-1">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded bg-gray-700 text-gray-300 disabled:opacity-50 hover:bg-gray-600"
            >
              Prev
            </button>

            {renderPageNumbers()}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded bg-gray-700 text-gray-300 disabled:opacity-50 hover:bg-gray-600"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Modal View/Edit */}
      {isOpen && selectedData && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-white">
                  {viewMode === 'view' ? 'Detail Data' : 'Edit Data'}
                </h3>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-white"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {viewMode === 'view' ? (
                <ViewData data={selectedData} />
              ) : (
                <EditForm 
                  data={selectedData} 
                  onUpdate={handleUpdate} 
                  onCancel={handleClose} 
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import { useState } from 'react';
import { supabase } from '../hooks/useSupabase';
import { toast } from 'react-hot-toast';
import Header from '../components/Layout/Header';
import SearchForm from '../components/Data/SearchForm';
import DataList from '../components/Data/DataList';
import CreateForm from '../components/Data/CreateForm';

export default function Dashboard() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

const handleSearch = async (searchBy: string, query: string) => {
  try {
    setIsLoading(true);
    let queryBuilder = supabase
      .from('ktp')
      .select('*');

    if (searchBy === 'nik') {
      queryBuilder = queryBuilder.ilike('nik', `%${query}%`);
    } else {
      queryBuilder = queryBuilder.ilike('nama_lengkap', `%${query}%`);
    }

    const { data: results, error } = await queryBuilder;
    
    if (error) {
      throw error;
    }
    
    setData(results || []);
  } catch (error: unknown) {
  if (error instanceof Error) {
    console.error('Error:', error.message);
    toast.error('Error: ' + error.message);
  } else {
    console.error('Search error:', error);
    toast.error('Error searching');
  }
}

};

const handleDelete = async (nik: string) => {
  if (!window.confirm('Apakah Anda yakin ingin menghapus data ini?')) return;

  try {
    console.log('Menghapus NIK:', nik); // Debugging
    
    const { error } = await supabase
      .from('ktp')
      .delete()
      .eq('nik', nik);

    console.log('Response delete:', error); // Debugging

    if (error) {
      throw error;
    }

    toast.success('Data berhasil dihapus');
    setData(prev => prev.filter(item => item.nik !== nik));
  } catch (error: unknown) {
  if (error instanceof Error) {
    console.error('Error:', error.message);
    toast.error('Error: ' + error.message);
  } else {
    console.error('Unknown error:', error);
    toast.error(`Gagal menghapus data`);
  }
}
};

  const handleRefresh = () => {
    setData([]);
  };

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    handleRefresh();
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-gray-800 p-6 rounded-lg shadow">
              <h2 className="text-lg font-medium text-white mb-4">Pencarian Data</h2>
              <SearchForm onSearch={handleSearch} />
              
              <div className="mt-6">
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="w-full px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  + Tambah Data Baru
                </button>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <div className="bg-gray-800 p-6 rounded-lg shadow">
              <h2 className="text-lg font-medium text-white mb-4">Hasil Pencarian</h2>
              
              {isLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : (
                <>
                  {data.length > 0 ? (
                    <DataList 
                      data={data} 
                      onDelete={handleDelete} 
                      onRefresh={handleRefresh} 
                    />
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-400">Tidak ada data yang ditampilkan. Lakukan pencarian untuk melihat hasil.</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      
{showCreateForm && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium text-white">Tambah Data Baru (16 digit)</h3>
          <button
            onClick={() => setShowCreateForm(false)}
            className="text-gray-400 hover:text-gray-300"
          >
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="mt-4">
          <CreateForm 
            onSuccess={handleCreateSuccess} 
            onCancel={() => setShowCreateForm(false)} 
          />
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
}
import { useState } from 'react'
import { toast } from 'react-hot-toast'

interface SearchFormProps {
  onSearch: (searchBy: string, query: string) => void
}

export default function SearchForm({ onSearch }: SearchFormProps) {
  const [searchBy, setSearchBy] = useState<'nama_lengkap' | 'nik'>('nama_lengkap')
  const [query, setQuery] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!query.trim()) {
      toast.error('Please enter a search term')
      return
    }
    
    if (searchBy === 'nik' && query.length !== 16) {
      toast.error('NIK must be 16 digits')
      return
    }
    
    onSearch(searchBy, query)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium text-gray-300">Search By</label>
        <div className="flex space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="text-indigo-600 form-radio"
              checked={searchBy === 'nama_lengkap'}
              onChange={() => setSearchBy('nama_lengkap')}
            />
            <span className="ml-2 text-gray-300">Nama Lengkap</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="text-indigo-600 form-radio"
              checked={searchBy === 'nik'}
              onChange={() => setSearchBy('nik')}
            />
            <span className="ml-2 text-gray-300">NIK (16 digit)</span>
          </label>
        </div>
      </div>
      
      <div>
        <label htmlFor="search" className="block text-sm font-medium text-gray-300">
          Search Term
        </label>
        <input
          id="search"
          type="text"
          className="w-full px-3 py-2 mt-1 text-gray-900 bg-gray-200 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      
      <button
        type="submit"
        className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Search
      </button>
    </form>
  )
}
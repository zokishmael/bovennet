import type{ KTPData } from  './KtpData';

interface ViewDataProps {
  data: KTPData;
}

export default function ViewData({ data }: ViewDataProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Kolom Foto */}
      <div className="col-span-1">
        <div className="bg-gray-700 p-4 rounded-lg">
          <img
            className="w-full h-auto max-h-64 object-contain mx-auto"
            src={data.id_foto 
              ? `https://lh3.googleusercontent.com/d/${data.id_foto}`
              : data.jenis_kelamin === 'LAKI-LAKI' 
                ? '/male-placeholder.jpg' 
                : '/female-placeholder.jpg'}
            alt={`Foto ${data.nama_lengkap}`} loading="lazy" decoding="async" 
          />
        </div>
      </div>

      {/* Kolom Data Pribadi */}
      <div className="col-span-1">
        <h4 className="text-lg font-semibold text-white mb-3">Data Pribadi</h4>
        <div className="space-y-2">
          <p className="text-sm"><span className="font-medium text-gray-300">NIK:</span> <span className="text-white">{data.nik}</span></p>
          <p className="text-sm"><span className="font-medium text-gray-300">No KK:</span> <span className="text-white">{data.no_kk}</span></p>
          <p className="text-sm"><span className="font-medium text-gray-300">Nama Lengkap:</span> <span className="text-white">{data.nama_lengkap}</span></p>
          <p className="text-sm"><span className="font-medium text-gray-300">Jenis Kelamin:</span> <span className="text-white">{data.jenis_kelamin}</span></p>
          <p className="text-sm"><span className="font-medium text-gray-300">Tempat/Tgl Lahir:</span> <span className="text-white">{data.tmpt_lhr}, {new Date(data.tgl_lhr).toLocaleDateString('id-ID')}</span></p>
        </div>
      </div>

      {/* Kolom Data Keluarga & Alamat */}
      <div className="col-span-1">
        <div className="space-y-4">
          <div>
            <h4 className="text-lg font-semibold text-white mb-2">Data Keluarga</h4>
            <div className="space-y-2">
              <p className="text-sm"><span className="font-medium text-gray-300">Nama Ayah:</span> <span className="text-white">{data.ayah || '-'}</span></p>
              <p className="text-sm"><span className="font-medium text-gray-300">Nama Ibu:</span> <span className="text-white">{data.ibu || '-'}</span></p>
              <p className="text-sm"><span className="font-medium text-gray-300">Status Keluarga:</span> <span className="text-white">{data.status_hub_keluarga || '-'}</span></p>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-2">Alamat & Pekerjaan</h4>
            <div className="space-y-2">
              <p className="text-sm"><span className="font-medium text-gray-300">Alamat:</span> <span className="text-white">{data.alamat || '-'}</span></p>
              <p className="text-sm"><span className="font-medium text-gray-300">Kecamatan:</span> <span className="text-white">{data.nama_kec || '-'}</span></p>
              <p className="text-sm"><span className="font-medium text-gray-300">Kelurahan:</span> <span className="text-white">{data.nama_kel || '-'}</span></p>
              <p className="text-sm"><span className="font-medium text-gray-300">Pekerjaan:</span> <span className="text-white">{data.jenis_pekerjaan || '-'}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
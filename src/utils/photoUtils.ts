export const getPhotoUrl = (idFoto: string | undefined | null, jenisKelamin: string, thumbnail: boolean = true): string => {
  if (!idFoto) {
    return jenisKelamin === 'LAKI-LAKI' 
      ? '/male-placeholder.jpg' 
      : '/female-placeholder.jpg';
  }

  // Cek jika idFoto sudah berupa URL lengkap
  if (idFoto.startsWith('http')) {
    return idFoto;
  }

  // Format Google Drive thumbnail
  if (thumbnail) {
    return `https://lh3.googleusercontent.com/d/${idFoto}=s100-c`; // s100-c untuk thumbnail 100px dengan crop
  }

  // Format Google Drive full size
  return `https://lh3.googleusercontent.com/d/${idFoto}=w800`; // w800 untuk lebar maks 800px
};
// Variabel global
let currentPage = 1;
const itemsPerPage = 12;
let totalPages = 1;
let currentSearchType = 'nama_lengkap';
let currentSearchTerm = '';
let currentPersonId = null;

// DOM Elements
const loginScreen = document.getElementById('login-screen');
const mainApp = document.getElementById('main-app');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const searchType = document.getElementById('search-type');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const resultsGrid = document.getElementById('results-grid');
const noResults = document.getElementById('no-results');
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');
const pageInfo = document.getElementById('page-info');
const detailModal = document.getElementById('detail-modal');
const closeModal = document.getElementById('close-modal');
const modalBody = document.getElementById('modal-body');

// Event Listeners
loginBtn.addEventListener('click', handleLogin);
logoutBtn.addEventListener('click', handleLogout);
searchBtn.addEventListener('click', performSearch);
searchType.addEventListener('change', updatePlaceholder);
prevPageBtn.addEventListener('click', goToPrevPage);
nextPageBtn.addEventListener('click', goToNextPage);
closeModal.addEventListener('click', closeDetailModal);

// Fungsi untuk login
async function handleLogin() {
  const password = passwordInput.value.trim();
  
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ password })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (result.success) {
      loginScreen.classList.add('hidden');
      mainApp.classList.remove('hidden');
    } else {
      alert(result.message || 'Password salah!');
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('Terjadi kesalahan saat login: ' + error.message);
  }
}

// Fungsi untuk logout
function handleLogout() {
  mainApp.classList.add('hidden');
  loginScreen.classList.remove('hidden');
  passwordInput.value = '';
  resultsGrid.innerHTML = '';
}

// Update placeholder berdasarkan jenis pencarian
function updatePlaceholder() {
  const type = searchType.value;
  let placeholder = '';
  
  switch(type) {
    case 'nama_lengkap':
      placeholder = 'Cari berdasarkan nama...';
      break;
    case 'nik':
      placeholder = 'Cari berdasarkan NIK (16 digit)...';
      break;
    case 'no_kk':
      placeholder = 'Cari berdasarkan No. KK...';
      break;
    case 'bulan_lahir':
      placeholder = 'Masukkan bulan (1-12)...';
      break;
    case 'tahun_lahir':
      placeholder = 'Masukkan tahun (4 digit)...';
      break;
    case 'nama_kec':
      placeholder = 'Cari berdasarkan nama kecamatan...';
      break;
  }
  
  searchInput.placeholder = placeholder;
}

// Fungsi utama untuk pencarian
async function performSearch() {
  currentPage = 1;
  currentSearchType = searchType.value;
  currentSearchTerm = searchInput.value.trim();
  
  if (!currentSearchTerm) {
    alert('Masukkan kata kunci pencarian!');
    return;
  }
  
  await searchData();
}

// Fungsi untuk melakukan pencarian
async function searchData() {
  try {
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        searchType: currentSearchType,
        searchTerm: currentSearchTerm,
        page: currentPage
      })
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Gagal melakukan pencarian');
    }
    
    // Hitung total halaman
    totalPages = result.totalPages;
    
    // Update paginasi
    updatePagination();
    
    // Tampilkan hasil
    displayResults(result.data);
    
  } catch (error) {
    console.error('Search error:', error);
    alert(error.message || 'Terjadi kesalahan saat mencari data');
  }
}

// Tampilkan hasil pencarian
function displayResults(data) {
  resultsGrid.innerHTML = '';
  
  if (!data || data.length === 0) {
    noResults.classList.remove('hidden');
    return;
  }
  
  noResults.classList.add('hidden');
  
  data.forEach(person => {
    const card = document.createElement('div');
    card.className = 'result-card';
    
    // Tentukan foto yang akan ditampilkan
    let photoUrl = '';
    if (person.id_foto) {
      photoUrl = `https://lh3.googleusercontent.com/d/${person.id_foto}=s50`;
    } else {
      photoUrl = person.jenis_kelamin === 'LAKI-LAKI' ? 
        'assets/male-placeholder.jpg' : 'assets/female-placeholder.jpg';
    }
    
    // Tampilkan data yang sesuai dengan jenis pencarian
    let details = '';
    switch(currentSearchType) {
      case 'nama_lengkap':
        details = `
          <div class="result-detail">${person.tmpt_lhr}</div>
          <div class="result-detail">${formatDate(person.tgl_lhr)}</div>
        `;
        break;
      case 'nik':
        details = `
          <div class="result-detail">${person.no_kk}</div>
        `;
        break;
      case 'no_kk':
        details = `
          <div class="result-detail">${person.status_hub_keluarga}</div>
        `;
        break;
      case 'bulan_lahir':
      case 'tahun_lahir':
        details = `
          <div class="result-detail">${formatDate(person.tgl_lhr)}</div>
          <div class="result-detail">${person.tmpt_lhr}</div>
        `;
        break;
      case 'nama_kec':
        details = `
          <div class="result-detail">${person.nama_kel}</div>
        `;
        break;
    }
    
    card.innerHTML = `
      <div class="result-header">
        <img src="${photoUrl}" 
             alt="${person.nama_lengkap}" 
             class="result-photo"
             data-id="${person.nik}">
        <div class="result-info">
          <div class="result-name">${person.nama_lengkap}</div>
          ${details}
        </div>
      </div>
    `;
    
    // Tambahkan event listener untuk foto
    const photo = card.querySelector('.result-photo');
    photo.addEventListener('click', () => {
      showPersonDetail(person.nik);
    });
    
    resultsGrid.appendChild(card);
  });
}

// Update tampilan paginasi
function updatePagination() {
  pageInfo.textContent = `Halaman ${currentPage} dari ${totalPages}`;
  prevPageBtn.disabled = currentPage === 1;
  nextPageBtn.disabled = currentPage === totalPages;
}

// Navigasi ke halaman sebelumnya
function goToPrevPage() {
  if (currentPage > 1) {
    currentPage--;
    searchData();
  }
}

// Navigasi ke halaman berikutnya
function goToNextPage() {
  if (currentPage < totalPages) {
    currentPage++;
    searchData();
  }
}

// Tampilkan detail orang dalam modal
async function showPersonDetail(nik) {
  try {
    // Ambil data detail
    const response = await fetch(`/api/person/${nik}`);
    const person = await response.json();
    
    if (!person) {
      throw new Error('Data tidak ditemukan');
    }
    
    currentPersonId = nik;
    
    // Tampilkan modal
    detailModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    // Tentukan foto yang akan ditampilkan
    let photoUrl = '';
    if (person.id_foto) {
      photoUrl = `https://lh3.googleusercontent.com/d/${person.id_foto}`;
    } else {
      photoUrl = person.jenis_kelamin === 'LAKI-LAKI' ? 
        'assets/male-placeholder.jpg' : 'assets/female-placeholder.jpg';
    }
    
    // Render detail data
    modalBody.innerHTML = `
      <div class="modal-photo-container">
        <img src="${photoUrl}" alt="${person.nama_lengkap}" class="modal-photo">
      </div>
      <div class="modal-details">
        <div class="detail-item">
          <div class="detail-label">NIK</div>
          <div class="detail-value">${person.nik}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">No. KK</div>
          <div class="detail-value">${person.no_kk}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Nama Lengkap</div>
          <div class="detail-value">${person.nama_lengkap}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Jenis Kelamin</div>
          <div class="detail-value">${person.jenis_kelamin === 'LAKI-LAKI' ? 'Laki-laki' : 'Perempuan'}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Tempat Lahir</div>
          <div class="detail-value">${person.tmpt_lhr}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Tanggal Lahir</div>
          <div class="detail-value">${formatLongDate(person.tgl_lhr)}</div>
        </div>
        <div class="detail-item sensitive-field">
          <div class="detail-label">Nama Ibu</div>
          <div class="sensitive-value" id="ibu-value">••••••••</div>
          <button class="toggle-visibility" data-field="ibu">
            <i class="fas fa-eye"></i>
          </button>
        </div>
        <div class="detail-item sensitive-field">
          <div class="detail-label">Nama Ayah</div>
          <div class="sensitive-value" id="ayah-value">••••••••</div>
          <button class="toggle-visibility" data-field="ayah">
            <i class="fas fa-eye"></i>
          </button>
        </div>
        <div class="detail-item">
          <div class="detail-label">Status Hubungan Keluarga</div>
          <div class="detail-value">${person.status_hub_keluarga}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Pekerjaan</div>
          <div class="detail-value">${person.jenis_pekerjaan}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Alamat</div>
          <div class="detail-value">${person.alamat}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Kecamatan</div>
          <div class="detail-value">${person.nama_kec}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Kelurahan</div>
          <div class="detail-value">${person.nama_kel}</div>
        </div>
      </div>
    `;
    
    // Tambahkan event listener untuk toggle visibility
    document.querySelectorAll('.toggle-visibility').forEach(button => {
      button.addEventListener('click', (e) => {
        const field = e.currentTarget.dataset.field;
        toggleVisibility(field, person);
      });
    });
    
    // Simpan data person untuk toggle visibility
    modalBody.dataset.person = JSON.stringify(person);
    
    // Ambil data keluarga jika ada
    await showFamilyMembers(person.no_kk, nik);
    
  } catch (error) {
    console.error('Person detail error:', error);
    alert(error.message || 'Terjadi kesalahan saat mengambil detail data');
  }
}

// Tampilkan anggota keluarga
async function showFamilyMembers(no_kk, excludeNik) {
  try {
    const response = await fetch(`/api/family/${no_kk}`);
    const family = await response.json();
    
    if (!family || family.length === 0) return;
    
    const familySection = document.createElement('div');
    familySection.className = 'family-section';
    
    familySection.innerHTML = `
      <div class="family-title">Anggota Keluarga</div>
      <div class="results-grid family-results">
        <!-- Anggota keluarga akan ditampilkan di sini -->
      </div>
    `;
    
    const familyGrid = familySection.querySelector('.family-results');
    
    family.forEach(member => {
      if (member.nik === excludeNik) return;
      
      let photoUrl = '';
      if (member.id_foto) {
        photoUrl = `https://lh3.googleusercontent.com/d/${member.id_foto}=s50`;
      } else {
        photoUrl = member.jenis_kelamin === 'LAKI-LAKI' ? 
          'assets/male-placeholder.jpg' : 'assets/female-placeholder.jpg';
      }
      
      const memberCard = document.createElement('div');
      memberCard.className = 'result-card';
      memberCard.setAttribute('data-nik', member.nik);
      
      memberCard.innerHTML = `
        <div class="result-header">
          <img src="${photoUrl}" 
               alt="${member.nama_lengkap}" 
               class="result-photo">
          <div class="result-info">
            <div class="result-name">${member.nama_lengkap}</div>
            <div class="result-detail">${member.status_hub_keluarga}</div>
            <div class="result-detail">${formatDate(member.tgl_lhr)}</div>
          </div>
        </div>
      `;
      
      // Tambahkan event listener
      memberCard.addEventListener('click', () => {
        showPersonDetail(member.nik);
      });
      
      familyGrid.appendChild(memberCard);
    });
    
    modalBody.appendChild(familySection);
    
  } catch (error) {
    console.error('Family data error:', error);
  }
}

// Toggle visibility untuk data sensitif
function toggleVisibility(field, person) {
  const valueElement = document.getElementById(`${field}-value`);
  const button = event.currentTarget;
  const icon = button.querySelector('i');
  
  if (!person) {
    try {
      person = JSON.parse(modalBody.dataset.person);
    } catch {
      return;
    }
  }
  
  if (valueElement.classList.contains('sensitive-value')) {
    // Tampilkan nilai sebenarnya
    valueElement.textContent = person[field];
    valueElement.classList.remove('sensitive-value');
    icon.classList.remove('fa-eye');
    icon.classList.add('fa-eye-slash');
  } else {
    // Sembunyikan nilai
    valueElement.textContent = '••••••••';
    valueElement.classList.add('sensitive-value');
    icon.classList.remove('fa-eye-slash');
    icon.classList.add('fa-eye');
  }
}

// Tutup modal detail
function closeDetailModal() {
  detailModal.classList.add('hidden');
  document.body.style.overflow = 'auto';
}

// Format tanggal dari YYYY-MM-DD menjadi DD/MM/YYYY
function formatDate(dateString) {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
}

// Format tanggal menjadi: Senin, 12 Januari 1978
function formatLongDate(dateString) {
  if (!dateString) return '';
  
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  
  const date = new Date(dateString);
  
  // Validasi jika date tidak valid
  if (isNaN(date.getTime())) {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`; // Kembalikan format lama jika invalid
  }
  
  const dayName = days[date.getDay()];
  const dayNumber = date.getDate();
  const monthName = months[date.getMonth()];
  const yearNumber = date.getFullYear();
  
  return `${dayName}, ${dayNumber} ${monthName} ${yearNumber}`;
}

// Inisialisasi
updatePlaceholder();
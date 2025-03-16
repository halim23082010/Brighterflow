


let data = [];


async function loadData() {
    try {
        const response = await fetch('/data.json');
        if (!response.ok) {
            throw new Error('Veri yüklenemedi!');
        }
        data = await response.json(); 
    } catch (error) {
        console.error('Hata:', error);
    }
}

// Arama fonksiyonu
function search() {
    const query = document.getElementById('search-box').value.toLowerCase();
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = ''; 

    if (query.length === 0) {
        return;
    }

    // Filtreleme işlemi
    const filteredData = data.filter(item => item.name.toLowerCase().includes(query));

    // Sonuçları ekrana yazdırma
    filteredData.forEach(item => {
        const resultItem = document.createElement('div');
        resultItem.classList.add('result-item');
        resultItem.textContent = item.name.trim(); 
        resultItem.onclick = () => {
            window.location.href = item.href; 
        };
        resultsContainer.appendChild(resultItem);
    });
}


const nesne1 = document.getElementById('search-box');
const nesne2 = document.getElementById('search-results');

function ayarla() {
    if (window.innerWidth >= 680) {
        nesne2.style.width = `${nesne1.offsetWidth}px`;
    }
}


window.addEventListener('resize', ayarla);
window.addEventListener('load', async () => {
    await loadData(); 
    ayarla(); 
});









// Slider'ı seç
const slider = document.querySelector('.slider');

// Gerçek slayt sayısını hesapla (klonlar hariç)
const slideCount = slider.children.length - 2;

// Aktif slayt indeksi
let currentIndex = 1; // Başlangıçta gerçek ilk slayt

// Slider'ı başlangıç pozisyonuna getir
slider.style.transform = `translateX(-${currentIndex * 100}%)`;

// Otomatik kaydırma için setInterval değişkeni
let autoSlideInterval = setInterval(autoSlide, 4000);

// Otomatik kaydırma fonksiyonu
function autoSlide() {
    currentIndex++;
    slider.style.transition = 'transform 1.5s ease-in-out';
    slider.style.transform = `translateX(-${currentIndex * 100}%)`;

    if (currentIndex === slideCount + 1) {
        setTimeout(() => {
            slider.style.transition = 'none';
            currentIndex = 1;
            slider.style.transform = `translateX(-${currentIndex * 100}%)`;
        }, 1000);
    }
}

// Manuel kaydırma fonksiyonları
function slideToNext() {
    currentIndex++;
    slider.style.transition = 'transform 1.5s ease-in-out';
    slider.style.transform = `translateX(-${currentIndex * 100}%)`;

    if (currentIndex === slideCount + 1) {
        setTimeout(() => {
            slider.style.transition = 'none';
            currentIndex = 1;
            slider.style.transform = `translateX(-${currentIndex * 100}%)`;
        }, 500);
    }
}

function slideToPrev() {
    currentIndex--;
    slider.style.transition = 'transform 1.5s ease-in-out';
    slider.style.transform = `translateX(-${currentIndex * 100}%)`;

    if (currentIndex === 0) {
        setTimeout(() => {
            slider.style.transition = 'none';
            currentIndex = slideCount;
            slider.style.transform = `translateX(-${currentIndex * 100}%)`;
        }, 1000);
    }
}

// Durdur/Başlat butonu işlevselliği
let isPlaying = true; // Slider'ın oynatılıp oynatılmadığını kontrol eder
const playPauseBtn = document.querySelector('.play-pause-btn');
const icon = playPauseBtn.querySelector('i'); // İkonu seç

playPauseBtn.addEventListener('click', () => {
    if (isPlaying) {
        clearInterval(autoSlideInterval); // Otomatik kaydırmayı durdur
        icon.classList.remove('fa-pause'); // Pause ikonunu kaldır
        icon.classList.add('fa-play'); // Play ikonunu ekle
    } else {
        autoSlideInterval = setInterval(autoSlide, 3000); // Otomatik kaydırmayı yeniden başlat
        icon.classList.remove('fa-play'); // Play ikonunu kaldır
        icon.classList.add('fa-pause'); // Pause ikonunu ekle
    }
    isPlaying = !isPlaying; // Durumu tersine çevir
});

// Butonları seç ve olay dinleyicilerini ekle
document.querySelector('.next-btn').addEventListener('click', slideToNext);
document.querySelector('.prev-btn').addEventListener('click', slideToPrev);








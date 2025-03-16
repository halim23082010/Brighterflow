




document.addEventListener("DOMContentLoaded", function () {
    const sortSelect = document.getElementById("sort-options");
    const productList = document.getElementById("product-list");

    
    sortSelect.addEventListener("change", function () {
        let sortBy = this.value;

        if (sortBy === "price-low-high") {
            
            sortProducts((a, b) => parseFloat(a.dataset.price) - parseFloat(b.dataset.price));
        } else if (sortBy === "price-high-low") {
            
            sortProducts((a, b) => parseFloat(b.dataset.price) - parseFloat(a.dataset.price));
        } else if (sortBy === "newest") {
            
            sortProducts((a, b) => new Date(b.dataset.date) - new Date(a.dataset.date));
        } else if (sortBy === "best-sellers") {
            
            sortProducts((a, b) => parseInt(b.dataset.sold) - parseInt(a.dataset.sold));
        } else if (sortBy === "featured") {
            
            location.reload();
        }
    });

    
    function sortProducts(sortFunction) {
        let products = Array.from(productList.children);
        products.sort(sortFunction);

        
        productList.innerHTML = "";
        products.forEach(product => productList.appendChild(product));
    }
});



function countProducts() {
    const products = document.querySelectorAll('.product'); // .product sınıfına sahip tüm öğeleri seç
    const resultCountElement = document.getElementById('result-count'); // Sonuç sayısının gösterileceği eleman
    resultCountElement.textContent = ` ${products.length} results found`; // Ürün sayısını yazdır
}

// Sayfa yüklendiğinde sayıyı güncelle
window.onload = countProducts;




let data = [];




async function loadData() {
    try {
        const response = await fetch('/data.json');
        if (!response.ok) {
            throw new Error('Veri yüklenemedi');
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

















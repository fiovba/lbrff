import { getData,updateBook} from './service.js';
let books = []
let categData;
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let slides = [];
let swiperInstance = null;
let mobileSlides = [];
async function getData2() {
    console.log("getData2 çağırıldı");
    slides = await getData('slides');
    mobileSlides = await getData('mobileSlides');
    books = await getData('kitablar');
    categData= await getData('categories');
     renderSlides();

    renderBooks(books);
    renderMenu(categData);
    const topBooks = books
        .sort((a, b) => b.view - a.view) 
        .slice(0, 5);
    const topSold = books
        .sort((a, b) => b.soldCount - a.soldCount) 
        .slice(0, 5);
    renderTopBooks(topBooks);
    renderTopSold(topSold);
     updateCartCount();

}
window.togglePopup=function (id) {
    const popup = document.getElementById(id);
    popup.classList.toggle('hidden');
}

window.handleSearch = async function () {
  const input = document.getElementById('searchInput');
  const value = input?.value.trim().toLowerCase();
  let foundBook = [];

  if (!value) return;

  foundBook = books.filter(book =>
    book.name.toLowerCase().includes(value) ||
    book.author.toLowerCase().includes(value)
  );

  if (foundBook.length > 0) {
    localStorage.setItem("searchResults", JSON.stringify(foundBook));
    window.location.href = `search.htm`;
  } else {
    Swal.fire({
      title: 'Tapılmadı!',
      text: 'Axtardığınız kitab mövcud deyil',
      icon: 'error',
      confirmButtonText: 'Bağla'
    });
  }
};

document.getElementById('favoritesIcon').addEventListener('click', () => {
    renderFavorites();
    togglePopup('favoritesPopup');
});

document.getElementById('cartIcon').addEventListener('click', () => {
    renderCart();
    togglePopup('cartPopup');
});
document.getElementById('cartIcon2').addEventListener('click', () => {
    renderCart();
    togglePopup('cartPopup');
});
const staticCards = document.getElementById('staticCards')
const outset = document.getElementById('outset')
const popup = document.getElementById('popup')
const categSec = document.getElementById('categ')
const subcategSec = document.getElementById('subcateg')
const subsubcategSec = document.getElementById('subsubcateg')
window.handlePopup = function (status) {
    outset.style.display = status ? 'flex' : 'none'
}
outset.addEventListener("click",(e)=>{
    if(!popup.contains(e.target)){
        outset.style.display = 'none'
    }
})
function renderMenu(categData){
      categData.forEach(data=>categSec.innerHTML+=`<li onclick="filterByCategory('${data.category}')" onmouseover="printSub('${data.category}')" class="px-4 py-3">${data.category}<i class="pl-[3px] text-[10px] fa-solid fa-chevron-right"></i></li>`)
}
window.printSub=function (sub){
    subcategSec.innerHTML = "" 
    const obj = categData.find(item=>item.category==sub)
    obj.subCategory.forEach(data=>subcategSec.innerHTML+=`<li onclick="filterBySubCategory('${data.name}')" onmouseover="printSubSub('${data.name}')" class="px-4 py-3">${data.name}<i class="pl-[3px] text-[10px] fa-solid fa-chevron-right"></i></li>`)
}
window.printSubSub = function (subsub){
    subsubcategSec.innerHTML = "";

    categData.forEach(category => {
        category.subCategory.forEach(subCat => {
            if (subCat.name === subsub) {
                subCat.subSubCategory.forEach(subSubItem => {
                    subsubcategSec.innerHTML += `
                        <li onclick="filterBySubSubCategory('${subSubItem}')"  class="px-4 py-3 cursor-pointer">${subSubItem}</li>`;
                });
            }
        });
    });
}
window.filterByCategory = function (categoryName) {
    const filtered = books.filter(book => book.category == categoryName);
    renderBooks(filtered);
    outset.style.display = 'none'
    
}

window.filterBySubCategory = function (subCatName) {
    const lowerSubCatName = subCatName.trim().toLowerCase();
    const filtered = books.filter(book => 
        book.altCateg.some(cat => cat.toLowerCase() === lowerSubCatName)
    );
    console.log(filtered);
    renderBooks(filtered);
    outset.style.display = 'none'
    
}


window.filterBySubSubCategory = function (subSubCatName) {
    const filtered = books.filter(book => book.altAltCateg.includes(subSubCatName));
    renderBooks(filtered);
    outset.style.display = 'none'
}


function renderSlides() {
    const swiperWrapper = document.querySelector(".swiper-wrapper");
    swiperWrapper.innerHTML = "";

    const isMobile = window.innerWidth <= 968;
    const slidesToUse = isMobile ? mobileSlides : slides;

    slidesToUse.forEach(imageUrl => {
        const slideEl = document.createElement("div");
        slideEl.className = "swiper-slide h-48 sm:h-50 md:h-90";
        slideEl.innerHTML = `
            <img src="${imageUrl}" alt="slide" class="w-full h-full object-cover" />
        `;
        swiperWrapper.appendChild(slideEl);
    });

    if (swiperInstance) {
        swiperInstance.update();
    } else {
        swiperInstance = new Swiper(".mySwiper", {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
            delay: 2000, 
            disableOnInteraction: false, 
        },
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
        });
    }
}

window.addEventListener("resize", () => {
    renderSlides();
});
window.addEventListener("resize", () => {
    if (window.slides && window.mobileSlides) {
        renderSlides(window.slides, window.mobileSlides);
    }
});

function renderBooks(books) {
    const staticCards = document.getElementById('staticCards');
    staticCards.innerHTML = '';

    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    books.forEach(book => {
        const isFavorite = favorites.some(fav => fav.id === book.id);

        const card = document.createElement('div');
        card.className = `
            w-[180px] bg-white rounded-2xl shadow relative 
            hover:scale-105 transition-all duration-300 cursor-pointer
        `.trim();
        card.innerHTML = `
            <div class="relative">
                <img onclick="goDetails(${book.id})" src="${book.img}" alt="${book.name}" class="w-full h-[260px] object-cover rounded-t" />
                <button class="fav-icon absolute top-2 right-2  p-1 rounded-full shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="${isFavorite ? 'red' : 'none'}" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="w-5 h-5 text-red-500">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 
                        4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 
                        14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 
                        3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                </button>
            </div>
            <div class="p-2">
                <h3 class="text-sm font-semibold line-clamp-2">${book.name}</h3>
                <p class="text-xs text-gray-500">${book.author}</p>
                <p class="text-sm font-semibold mt-1">${book.price} ₼</p>
            </div>
        `;

        // Ürək iconuna click funksiyası
        const favBtn = card.querySelector('.fav-icon');
        favBtn.addEventListener('click', (e) => {

            let updatedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
            const alreadyFavorited = updatedFavorites.some(fav => fav.id === book.id);

            if (alreadyFavorited) {
                updatedFavorites = updatedFavorites.filter(fav => fav.id !== book.id);
            } else {
                updatedFavorites.push(book);
            }

            localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
            renderBooks(books);
            renderFavorites();
        });

        staticCards.appendChild(card);
    });
}
window.goDetails = function (id) {
    window.location.href = `details.htm?id=${id}`;
}
const barIcon = document.getElementById("barIcon");
const closeSidebar = document.getElementById("closeSidebar");
barIcon.addEventListener("click", () => {
    document.getElementById("sidebarMobile").classList.remove("-translate-x-full");
});

document.addEventListener("click", function (e) {
    if (!document.getElementById("sidebarMobile").contains(e.target) && !barIcon.contains(e.target)) {
        document.getElementById("sidebarMobile").classList.add("-translate-x-full");
    }
});
closeSidebar.addEventListener("click", () => {
    sidebarMobile.classList.add("-translate-x-full");

});

window.toggleAccordion = function (id) {
    const content = document.getElementById(id);
    const icon = document.getElementById(`icon-${id}`);
    const isHidden = content.classList.contains("hidden");
    document.querySelectorAll('#sidebarMobile div[id$="Links"]').forEach(div => div.classList.add("hidden"));
    document.querySelectorAll('#sidebarMobile span[id^="icon-"]').forEach(span => span.innerText = "+");

    if (isHidden) {
        content.classList.remove("hidden");
        icon.innerText = "−";
    }
}
const katalogBtn = document.getElementById('catalogBtn');
function getCurrentMonthNameAz() {
    const aylar = [
        "Yanvar", "Fevral", "Mart", "Aprel", "May", "İyun",
        "İyul", "Avqust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"
    ];
    const indi = new Date();
    return aylar[indi.getMonth()];
}

function renderTopBooks(topBooks) {
    const topBooksDiv = document.getElementById('topView');
    const ayBasliq = document.getElementById('ayBasliq');
    ayBasliq.innerHTML = `<h2>${getCurrentMonthNameAz()} ayının Ən Çox <span class="text-red-500">Baxılanları</span></h2>`;
    topBooksDiv.innerHTML = ''; 
   
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    topBooks.forEach(book => {
        const isFavorite = favorites.some(fav => fav.id === book.id);

        const card = document.createElement('div');
        card.className = `
            w-[180px] min-w-[180px] bg-white rounded-2xl mt-5 shadow relative 
           cursor-pointer flex flex-col
        `.trim();

        card.innerHTML = `
            <div class="relative">
                <img onclick="goDetails(${book.id})" src="${book.img}" alt="${book.name}" class="w-full h-[260px] object-cover rounded-t" />
                <button class="fav-icon absolute top-2 right-2  p-1 rounded-full shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="${isFavorite ? 'red' : 'none'}" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="w-5 h-5 text-red-500">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 
                        4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 
                        14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 
                        3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                </button>
            </div>
            <div class="p-2">
                <h3 class="text-sm font-semibold line-clamp-2">${book.name}</h3>
                <p class="text-xs text-gray-500">${book.author}</p>
                <p class="text-sm font-semibold mt-1">${book.price} ₼</p>
            </div>
        `;

        const favBtn = card.querySelector('.fav-icon');
        favBtn.addEventListener('click', (e) => {
            e.stopPropagation();

            let updatedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
            const alreadyFavorited = updatedFavorites.some(fav => fav.id === book.id);

            if (alreadyFavorited) {
                updatedFavorites = updatedFavorites.filter(fav => fav.id !== book.id);
            } else {
                updatedFavorites.push(book);
            }

            localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
            renderTopBooks(topBooks);
            renderFavorites();
        });

        topBooksDiv.appendChild(card);
    });
}
function renderTopSold(topSold) {
    const topSoldBooksDiv = document.getElementById('topSold');
    const ayBasliq1 = document.getElementById('ayBasliq1');
    ayBasliq1.innerHTML = `<h2>${getCurrentMonthNameAz()} ayının Ən Çox <span class="text-red-500">Satılanları</span></h2>`;
    topSoldBooksDiv.innerHTML = ''; 
   
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    topSold.forEach(book => {
        const isFavorite = favorites.some(fav => fav.id === book.id);

        const card = document.createElement('div');
        card.className = `
            w-[180px] min-w-[180px] bg-white rounded-2xl mt-5 shadow relative 
             cursor-pointer flex flex-col
        `.trim();

        card.innerHTML = `
            <div class="relative">
                <img onclick="goDetails(${book.id})" src="${book.img}" alt="${book.name}" class="w-full h-[260px] object-cover rounded-t" />
                <button class="fav-icon absolute top-2 right-2  p-1 rounded-full shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="${isFavorite ? 'red' : 'none'}" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="w-5 h-5 text-red-500">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 
                        4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 
                        14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 
                        3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                </button>
            </div>
            <div class="p-2">
                <h3 class="text-sm font-semibold line-clamp-2">${book.name}</h3>
                <p class="text-xs text-gray-500">${book.author}</p>
                <p class="text-sm font-semibold mt-1">${book.price} ₼</p>
            </div>
        `;

        const favBtn = card.querySelector('.fav-icon');
        favBtn.addEventListener('click', (e) => {
            e.stopPropagation();

            let updatedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
            const alreadyFavorited = updatedFavorites.some(fav => fav.id === book.id);

            if (alreadyFavorited) {
                updatedFavorites = updatedFavorites.filter(fav => fav.id !== book.id);
            } else {
                updatedFavorites.push(book);
            }

            localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
            renderTopSold(topSold);
            renderFavorites();
        });

        topSoldBooksDiv.appendChild(card);
    });
}

window.addToCart = function (id) {
    const selectedBook = books.find(b => b.id == id);
    if (!selectedBook) return;

    let item = cart.find(c => c.book.id === id);
    if (item) {
        item.quantity++;
    } else {
        cart.push({ book: selectedBook, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart)); // <- Bunu ƏLAVƏ ELƏ!
    renderCart();
    updateCartCount();
}


window.buyAllItems = async function () {
    if (cart.length === 0) return;

    const result = await Swal.fire({
        title: 'Əminsiniz?',
        text: 'Səbətdəki bütün kitabları almaq istəyirsinizmi?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Bəli, alıram',
        cancelButtonText: 'Xeyr',
        reverseButtons: true
    });

    if (!result.isConfirmed) return;

    for (let item of cart) {
        const book = books.find(b => b.id === item.book.id);
        if (!book || book.stockCount < item.quantity) {
            await Swal.fire({
                title: 'Yetersiz stok!',
                text: `"${book?.name || 'Naməlum kitab'}" üçün kifayət qədər kitab yoxdur.`,
                icon: 'error',
                confirmButtonText: 'Bağla'
            });
            return;
        }
    }

    for (let item of cart) {
        const book = books.find(b => b.id === item.book.id);
        if (!book || book.stockCount <= 0) continue;

        book.stockCount -= item.quantity;
        book.soldCount += item.quantity;
        await updateBook(book.id, book); 
    }

    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();

    await Swal.fire({
        title: 'Kitabların artıq sənindir! 🥳',
        text: 'Bizi seçdiyiniz üçün təşəkkürlər 😊',
        icon: 'success',
        confirmButtonText: 'Bağla'
    });
};



window.removeFromCart=function(id) {
    cart = cart.filter(c => c.book.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateCartCount();
}

function updateCartCount() {
    const countEl = document.getElementById("cartCount");
    let totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    countEl.textContent = totalCount;
    countEl.style.display = totalCount > 0 ? 'block' : 'none';
}
window.buyAllItems = async function () {
    if (cart.length === 0) return;

    const result = await Swal.fire({
        title: 'Əminsiniz?',
        text: 'Səbətdəki bütün kitabları almaq istəyirsinizmi?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Bəli, alıram',
        cancelButtonText: 'Xeyr',
        reverseButtons: true
    });

    if (!result.isConfirmed) return;

    for (let item of cart) {
        const book = books.find(b => b.id === item.book.id);
        if (!book || book.stockCount < item.quantity) {
            await Swal.fire({
                title: 'Yetersiz stok!',
                text: `"${book?.name || 'Naməlum kitab'}" üçün kifayət qədər kitab yoxdur.`,
                icon: 'error',
                confirmButtonText: 'Bağla'
            });
            return;
        }
    }

    for (let item of cart) {
    const book = books.find(b => b.id === item.book.id);
    if (!book || book.stockCount <= 0) continue;

    // Əgər soldCount undefined-dirsə, sıfıra bərabərləşdir
    if (typeof book.soldCount !== 'number') {
        book.soldCount = 0;
    }

    book.stockCount -= item.quantity;
    book.soldCount += item.quantity;
    await updateBook(book.id, book); 
}


    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateCartCount();

    await Swal.fire({
        title: 'Kitabların artıq sənindir! 🥳',
        text: 'Bizi seçdiyiniz üçün təşəkkürlər 😊',
        icon: 'success',
        confirmButtonText: 'Bağla'
    });
};

function renderCart() {
    const container = document.getElementById('cartContent');
    const cartBooks = document.getElementById('cartBooks');

    if (cart.length === 0) {
        container.innerHTML = "<p>Səbətiniz boşdur.</p>";
        cartBooks.innerHTML = "";
        return;
    }

    let total = 0;
    container.innerHTML = cart.map(({ book, quantity }) => {
        const itemTotal = book.price * quantity;
        total += itemTotal;

        return `
            <div class="flex items-center gap-4 mb-4 border-b border-gray-400 pb-2">
                <img src="${book.img}" alt="${book.name}" class="w-12 h-16 object-cover rounded">
                <div class="flex-grow">
                    <h3 class="font-semibold">${book.name}</h3>
                    <p class="text-sm text-gray-600">${book.author}</p>
                    <p class="text-sm">Qiymət: ${(itemTotal).toFixed(2)} ₼</p>
                    <p class="text-sm">
                        Say: 
                        <input 
                            type="number" 
                            min="1" 
                            value="${quantity}" 
                            onchange="updateQuantity(${book.id}, this.value)"
                            class="w-16 text-center border border-gray-300 rounded ml-2"
                        />
                    </p>
                </div>
                <button onclick="removeFromCart(${book.id})" class="text-red-700 hover:underline ml-2">Sil</button>
            </div>
        `;
    }).join('');

    cartBooks.innerHTML = `
        <div class="mt-4 flex justify-between items-center">
            <p class="font-bold text-lg">Cəmi: ${total.toFixed(2)} ₼</p>
            <button onclick="buyAllItems()" class="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-600">
                Hamısını Al
            </button>
        </div>
    `;
}

window.updateQuantity = function (bookId, newQuantity) {
    newQuantity = parseInt(newQuantity);
    if (isNaN(newQuantity) || newQuantity < 1) return;

    const item = cart.find(c => c.book.id === bookId);
    if (item) {
        item.quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        updateCartCount();
    }
}

function addToFavorites(book) {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  const isExist = favorites.some(fav => fav.id === book.id);
  if (isExist) {
    alert('Bu kitab artıq seçilmişlərdədir.');
    return;
  }

  favorites.push(book);
  localStorage.setItem('favorites', JSON.stringify(favorites));
  alert('Kitab seçilmişlərə əlavə olundu!');
}

function renderFavorites () {
  const favoritesContainer = document.getElementById('favoritesContent'); 
  favoritesContainer.innerHTML = '';

  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  if (favorites.length === 0) {
    favoritesContainer.innerHTML = '<p>Seçilmiş kitab yoxdur.</p>';
    return;
  }

  favorites.forEach(book => {
    const card = document.createElement('div');
    card.classList.add('book-card');
    card.innerHTML = `
      <div class="flex items-center gap-4 mb-4 border-b border-gray-400 pb-2">
            <img onclick="goDetails(${book.id})" src="${book.img}" alt="${book.name}" class="w-12 h-16 object-cover rounded">
            <div class="flex-grow">
                <h3 class="font-semibold">${book.name}</h3>
                <p class="text-sm text-gray-600">${book.author}</p>
            </div>
            <button onclick="removeFromFavorites(${book.id})" class="text-red-700 hover:underline ml-2">Sil</button>
        </div>
    `;
    favoritesContainer.appendChild(card);
  });
}
window.removeFromFavorites = function(bookId) {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  favorites = favorites.filter(book => book.id !== bookId);
  localStorage.setItem('favorites', JSON.stringify(favorites));
  renderFavorites(); 
}


getData2()
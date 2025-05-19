import { getData } from './service.js';

let allBooks = [];
let allCateg = [];
let filteredBooks = [];

let selectedCategory = null;
let selectedLanguage = null;
let selectedPrice = null;
let inStockOnly = false;

async function loadBooks() {
  allBooks = await getData('kitablar');
  allCateg = await getData('categories');

  filteredBooks = allBooks;

  renderCategories();
  renderFilters();
  renderBooks(filteredBooks);
}

function renderCategories() {
  const container = document.getElementById('filterbyCateg');
 

  const subSubCategories = getAllSubSubCategories(allCateg);

  subSubCategories.forEach(cat => {
    container.innerHTML += `
      <button class="category-btn px-3 py-1 m-1">${cat}</button>
    `;
  });

  const buttons = container.querySelectorAll('.category-btn');
  buttons.forEach(button => {
    button.onclick = function() {
      applyCategoryFilter(this.textContent);
    };
  });
}

function getAllSubSubCategories(categories) {
  let result = [];
  categories.forEach(category => {
    let subCategories = category.subCategory || [];
    subCategories.forEach(sub => {
      let subSub = sub.subSubCategory || [];
      subSub.forEach(s => {
        if (result.indexOf(s) === -1) {
          result.push(s);
        }
      });
    });
  });
  return result;
}

function renderFilters() {
  const container = document.getElementById('filter');

  let allLanguages = [];
  allBooks.forEach(book => {
    let langs = book.lang || [];
    langs.forEach(lang => {
      if (!allLanguages.includes(lang)) {
        allLanguages.push(lang);
      }
    });
  });

  let langOptions = '<option value="">Hamısı</option>';
  allLanguages.forEach(lang => {
    langOptions += `<option value="${lang}">${lang}</option>`;
  });

  container.innerHTML = `
    <h4 class="font-semibold mb-2">Filtrlər</h4>
    <div>
      <label>Dil:</label>
      <select id="languageFilter" class="border-1 border-gray-400 p-1 rounded w-full">${langOptions}</select>
    </div>
    <div>
      <input type="range"   class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" max="100" min="2" id="priceInput" value="100" />
      <span id="priceValue" class="text-sm ml-2">100 ₼</span>
    </div>
    <div class="mt-2">
      <label><input  type="checkbox" id="stockFilter" /> Yalnız stokda olanlar</label>
    </div>
    <button id="applyFiltersBtn" class="mt-3 px-4 py-2 bg-red-500 text-white rounded">Tətbiq et</button>
  `;

  const priceInput = document.getElementById('priceInput');
  const priceValue = document.getElementById('priceValue');

  priceInput.oninput = function() {
    priceValue.textContent = priceInput.value + ' ₼';
    selectedPrice = Number(priceInput.value);
  };

  container.querySelector('#applyFiltersBtn').onclick = function() {
    selectedLanguage = container.querySelector('#languageFilter').value || null;
    inStockOnly = container.querySelector('#stockFilter').checked;

    applyOtherFilters();
  };
}

function applyAllFilters() {
  let result = allBooks;

  if (selectedCategory) {
    result = result.filter(book => book.altAltCateg && book.altAltCateg.some(c => c.toLowerCase() === selectedCategory.toLowerCase()));
  }

  if (selectedLanguage) {
    result = result.filter(book => book.lang && book.lang.some(l => l.toLowerCase() === selectedLanguage.toLowerCase()));
  }

  if (inStockOnly) {
    result = result.filter(book => book.stockCount > 0);
  }

  if (selectedPrice !== null && selectedPrice !== undefined) {
    result = result.filter(book => Number(book.price) <= selectedPrice);
  }

  filteredBooks = result;
  renderBooks(filteredBooks);
}

function applyCategoryFilter(category) {
  if (selectedCategory === category) {
    selectedCategory = null; 
  } else {
    selectedCategory = category;
  }
  applyAllFilters();
}

function applyOtherFilters() {
  const langSelect = document.getElementById('languageFilter');
  selectedLanguage = langSelect.value || null;

  const stockCheckbox = document.getElementById('stockFilter');
  inStockOnly = stockCheckbox.checked;

  const priceInput = document.getElementById('priceInput');
  selectedPrice = Number(priceInput.value);

  applyAllFilters();
}

function renderBooks(books) {
  const container = document.getElementById('booksContainer');
  container.innerHTML = '';

  if (books.length === 0) {
    container.innerHTML = '<p>Kitab tapılmadı.</p>';
    return;
  }

  books.forEach(book => {
    container.innerHTML += `
      <div class="w-[80%] md:w-[180px] md:min-w-[180px] bg-white rounded-2xl mt-5 justify-center shadow relative cursor-pointer flex flex-col">
        <div class="relative w-full">
          <img onclick="goDetails('${book.id}')" src="${book.img}" alt="${book.name}" class="w-full h-[90%] md:h-[260px] object-cover rounded-t" />
          <button class="fav-icon absolute top-2 right-2 p-1 rounded-full shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="w-5 h-5 text-red-500">
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
      </div>
    `;
  });
}

window.goDetails = function(id) {
  window.location.href = `details.htm?id=${id}`;
};




loadBooks();

import { getData } from "./service.js";
let selectedAuthor = null;
let books = [];
const booksContainer = document.getElementById("booksContainer");
const title = document.getElementById("booksByAuthorTitle");
const authorsContainer = document.getElementById("authorsContainer");
const bookDiv = document.getElementById("bookDiv");

async function getData2() {
  console.log("getData2 çağırıldı");
  books = await getData("kitablar");
  showAuthors();
  applyFilters();
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


window.toggleAccordion = function (id) {
  const element = document.getElementById(id);
  element.classList.toggle("hidden");
};

function getUniqueAuthors() {
  const authorSet = new Set();
  books.forEach(book => authorSet.add(book.author.trim()));
  return Array.from(authorSet).sort((a, b) => a.localeCompare(b));
}

function groupAuthorsByLetter(authors) {
  const grouped = {};
  authors.forEach(author => {
    const firstLetter = author.charAt(0).toUpperCase();
    if (!grouped[firstLetter]) {
      grouped[firstLetter] = [];
    }
    grouped[firstLetter].push(author);
  });

  return Object.keys(grouped)
    .sort()
    .reduce((acc, key) => {
      acc[key] = grouped[key].sort((a, b) => a.localeCompare(b));
      return acc;
    }, {});
}

function showAuthors() {
 selectedAuthor = null
  title.textContent = "";
  booksContainer.innerHTML = "";
  bookDiv.style.display = "none";
  authorsContainer.style.display = "block";
  authorsContainer.innerHTML = "";

  const authors = getUniqueAuthors();
  const groupedAuthors = groupAuthorsByLetter(authors);

  for (const letter in groupedAuthors) {
    const letterHeader = document.createElement("h2");
    letterHeader.textContent = letter;
    letterHeader.style.marginTop = "20px";
    letterHeader.style.color = "#444";
    authorsContainer.appendChild(letterHeader);

    const groupDiv = document.createElement("div");
    groupDiv.style.display = "flex";
    groupDiv.style.flexWrap = "wrap";
    groupDiv.style.gap = "10px";
    groupDiv.style.marginBottom = "20px";

    groupedAuthors[letter].forEach(author => {
      const btn = document.createElement("button");
      btn.textContent = author;
      btn.style.margin = "5px";
      btn.style.color = "red";
      btn.style.fontWeight = "bold";
      btn.style.cursor = "pointer";
      btn.style.padding = "10px";

      btn.onclick = () => showBooksByAuthor(author);
      groupDiv.appendChild(btn);
    });

    authorsContainer.appendChild(groupDiv);
  }
}

function showBooksByAuthor(author) {
 selectedAuthor = author.trim();
  authorsContainer.style.display = "none";
  
  bookDiv.style.display = "flex";
applyFilters(); 

  title.textContent = `${author} - Kitabları`;
  booksContainer.innerHTML = "";

  const filtered = books.filter(book => book.author.trim() === author.trim());

  if (filtered.length === 0) {
    booksContainer.innerHTML = "<p>Kitab tapılmadı.</p>";
    return;
  }

  const booksGrid = document.createElement("div");
  booksGrid.style.display = "flex";
  booksGrid.style.flexWrap = "wrap";
  booksGrid.style.gap = "20px";

  filtered.forEach(book => {
    const card = document.createElement("div");
    card.className = `
            w-[180px] min-w-[180px] bg-white rounded-2xl mt-5 shadow relative justify-center
            hover:scale-105 transition-all duration-300 cursor-pointer flex flex-col
        `.trim();

        card.innerHTML = `
            <div class="relative justify-center">
                <img onclick="goDetails(${book.id})" src="${book.img}" alt="${book.name}" class="w-full h-[260px] object-cover rounded-t" />
                <button class="fav-icon absolute top-2 right-2  p-1 rounded-full shadow-md">
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
        `;


    booksGrid.appendChild(card);
    
  });

  booksContainer.appendChild(booksGrid);
}

window.updatePriceLabel = function (value) {
  document.getElementById("priceValue").textContent = value;
};
window.goDetails = function (id) {
    window.location.href = `details.htm?id=${id}`;
}
window.applyFilters = function () {
  const maxPrice = parseFloat(document.getElementById("priceRange").value);
  const stockValue = document.querySelector('input[name="stock"]:checked').value;

  let filteredBooks = books;

  if (selectedAuthor) {
    filteredBooks = filteredBooks.filter(book => book.author.trim() === selectedAuthor);
  }

  filteredBooks = filteredBooks.filter(book => parseFloat(book.price) <= maxPrice);

  if (stockValue === "in") {
    filteredBooks = filteredBooks.filter(book => book.stockCount > 0);
  } else if (stockValue === "out") {
    filteredBooks = filteredBooks.filter(book => book.stockCount <= 0);
  }

  renderFilteredBooks(filteredBooks);
};

function renderFilteredBooks(bookList) {
  booksContainer.innerHTML = "";

  if (bookList.length === 0) {
    booksContainer.innerHTML = "<p>Uyğun kitab tapılmadı.</p>";
    return;
  }

  const booksGrid = document.createElement("div");
  booksGrid.style.display = "flex";
  booksGrid.style.flexWrap = "wrap";
  booksGrid.style.gap = "20px";

  bookList.forEach(book => {
    const card = document.createElement("div");
    card.className = `
            w-[180px] min-w-[180px] bg-white rounded-2xl mt-5 shadow relative justify-center
            hover:scale-105 transition-all duration-300 cursor-pointer flex flex-col
        `.trim();

        card.innerHTML = `
            <div class="relative justify-center">
                <img onclick="goDetails(${book.id})" src="${book.img}" alt="${book.name}" class="w-full h-[260px] object-cover rounded-t" />
                <button class="fav-icon absolute top-2 right-2  p-1 rounded-full shadow-md">
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
        `;

    booksGrid.appendChild(card);
  });

  booksContainer.appendChild(booksGrid);
}


getData2();

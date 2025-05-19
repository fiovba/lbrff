import { getData } from "./service.js";
let books = [];
const container = document.getElementById('booksContainer');

async function getData2() {
  console.log("getData2 çağırıldı");
  books = await getData("kitablar");

}

window.onload = function () {
  const results = JSON.parse(localStorage.getItem("searchResults")) || [];

  if (results.length === 0) {
    container.innerHTML = "<p class='text-center text-gray-500 mt-5'>Heç bir nəticə tapılmadı.</p>";
    return;
  }

  container.innerHTML = '';
  results.forEach(book => {
    container.innerHTML += `
      <div class="w-[180px] min-w-[180px] bg-white rounded-2xl mt-5 shadow relative 
        cursor-pointer flex flex-col">
        <div class="relative">
          <img onclick="goDetails(${book.id})" src="${book.img}" alt="${book.name}" class="w-full h-[260px] object-cover rounded-t" />
          <button class="fav-icon absolute top-2 right-2 p-1 rounded-full shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="w-5 h-5 text-red-500">
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
};

window.goDetails = function (id) {
  window.location.href = `details.htm?id=${id}`;
};

window.goDetails = function (id) {
  window.location.href = `details.htm?id=${id}`;
}

getData2();

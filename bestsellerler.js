import { getData } from './service.js';

async function loadBestsellers() {
  const kitaplar = await getData('kitablar');
  if (!kitaplar || kitaplar.length === 0) {
    document.getElementById('bestsellerList').innerHTML = "<p>Kitab tapılmadı.</p>";
    return;
  }

  const topBooks = kitaplar
    .filter(book => book.soldCount > 0)
    .sort((a, b) => b.soldCount - a.soldCount)
    .slice(0, 10); // Top 6 bestseller

  renderBooks(topBooks);
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
function getCurrentMonthNameAz() {
    const aylar = [
        "Yanvar", "Fevral", "Mart", "Aprel", "May", "İyun",
        "İyul", "Avqust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"
    ];
    const indi = new Date();
    return aylar[indi.getMonth()];
}

window.goDetails = function (id) {
    window.location.href = `details.htm?id=${id}`;
}
function renderBooks(books) {
    const baslig=document.getElementById("baslig")
    baslig.textContent=`${getCurrentMonthNameAz()} ayının Bestsellerleri`;
  const container = document.getElementById('bestsellerList');
  container.innerHTML = ''; 

  books.forEach(book => {
    container.innerHTML += `<div class=" w-[85%] md:w-[180px] min-w-[180px] bg-white rounded-2xl mt-5 shadow relative 
            hover:scale-105 transition-all duration-300 cursor-pointer justify-center flex flex-col">
            <div class="relative">
                <img onclick="goDetails(${book.id})" src="${book.img}" alt="${book.name}" class="w-full md:h-[260px] object-cover rounded-t" />
                <button class="fav-icon absolute top-2 right-2  p-1 rounded-full shadow-md">
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
}

loadBestsellers();
 
import { getData } from './service.js';

let endirimler = [];

async function getData2() {
  endirimler = await getData('campanies');
  renderCards();
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

const campaniesDiv = document.getElementById('campaniesDiv');

 function renderCards() {
    campaniesDiv.innerHTML = '';
    endirimler.forEach(item => {
      const daysLeft = item.countdown.match(/\d+/)[0];
      const card = document.createElement('div');
      card.className = "flex bg-white rounded-xl shadow-md w-[300px] overflow-hidden";

      card.innerHTML = `
        <div class="flex flex-col">
        <img src="${item.img}" alt="Kampaniya" class="w-40 object-contain bg-gray-50" />
        <div class="p-4 flex flex-col justify-between flex-1">
          <div class="flex items-center gap-3 mb-4">
            <div class="bg-gray-200 rounded-lg w-14 h-16 flex flex-col items-center justify-center text-gray-700 font-semibold">
                <div class="text-xs text-gray-500">Bitməsinə</div>
              <div class="text-2xl">${daysLeft}</div>
              <div class="text-xs">gün qaldı</div>
            </div>
            
          </div>
          <div>
            <p class="text-sm font-semibold mb-1">${item.discount}</p>
            <p class="text-xs text-gray-400">${item.period}</p>
          </div>
        </div>
        </div>
      `;
      campaniesDiv.appendChild(card);
    });
  }


getData2();

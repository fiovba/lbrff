import { getData, addComment, updateViewCount,updateBook } from './service.js';

let book = [];
let bookId = null;
let comments = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let books = []; 

async function loadBook() {
    book = await getData('kitablar');
    books = book; 
    comments = await getData('comments');
    if (!book) {
        console.log('xeta');
        return;
    }
    loadBooksDetails();
    renderComments(comments);
    updateCartCount()
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
window.togglePopup = function (id) {
    const popup = document.getElementById(id);
    popup.classList.toggle('hidden');
}
document.getElementById('favoritesIcon').addEventListener('click', () => {
    renderFavorites();
    togglePopup('favoritesPopup');
});
document.getElementById('cartIcon').addEventListener('click', () => {
    renderCart();
    togglePopup('cartPopup');
});
async function loadBooksDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    bookId = urlParams.get('id');
    const booksItem = book.find(book => book.id == bookId);
    const viewedKey = `viewed_${bookId}`;

    if (booksItem && !localStorage.getItem(viewedKey)) {
        await updateViewCount(booksItem);
        localStorage.setItem(viewedKey, 'true');
    }
    document.getElementById("detailsDiv").innerHTML = `
    <div class="font-sans w-full lg:w-1/3 flex justify-center items-center">
        <img id="bookImage" class="rounded shadow-lg w-full object-cover" alt="Book cover" src="${booksItem.img}" />
    </div>
    <div class="w-full lg:w-2/3 space-y-4">
        <h1 id="bookName" class="text-4xl text-gray-800 font-bold pt-2">${booksItem.name}</h1>
        <p id="bookAuthor" class="text-sm text-gray-600">${booksItem.author}</p>
        <div class="flex items-center gap-3">
            <span id="bookPrice" class="text-2xl font-semibold text-gray-800">${booksItem.price} ₼</span>
            <span class="line-through text-sm text-gray-400" id="endirimsizQiymet">${((booksItem.price * 1.20).toFixed(2))}₼</span>
            <span class="text-sm bg-red-100 text-red-700 px-2 py-1 rounded">20%</span>
        </div>

        <button onclick="addToCart(${bookId})"
            class="bg-[#f14b56] text-white px-6 py-3 rounded-2xl hover:bg-red-700 transition w-full">
            <i class="fa-solid fa-cart-shopping"></i>
            Səbətə əlavə et
        </button>
        <div class="py-3 flex flex-col gap-3">
            <h4 class="font-bold text-gray-800">Çatdırılma haqqında</h4>
            <p class="text-gray-600">Bakı şəhəri üçün təxmini müddət və qiymətlər.</p>
            <p class="text-gray-600"><i class="fa-solid fa-store"></i> Mağazadan təhvil alma — <span class="font-bold">pulsuz</span>.</p>
            <p class="text-gray-600"><i class="fa-solid fa-car-side"></i> Kuryer ilə — operator təsdiqindən sonra <span class="font-bold">24 saat</span> ərzində. 30 AZN və yuxarı sifarişlərdə — <span class="font-bold">pulsuz</span>.</p>
        </div>
        <div class="mt-6">
            <h2 class="text-lg font-bold mb-2 text-gray-800">Təsvir</h2>
            <p id="bookDesc" class="text-sm text-gray-700 leading-relaxed">${booksItem.description}</p>
            <p class="text-sm text-gray-600">Baxış sayı: <strong>${booksItem.view || 1}</strong></p>
        </div>
    </div>`;
}

function renderComments(comments) {
    const commentsSection = document.getElementById('commentsSection');
    const filteredComments = comments.filter(com => com.bookId == bookId);

    commentsSection.innerHTML = '';

    filteredComments.forEach(comment => {
        commentsSection.innerHTML += `
            <div class="bg-gray-100 text-sm text-gray-700 p-3 rounded mb-2 flex flex-col hover:bg-gray-200 transition-colors duration-200">
                <div class="text-gray-900 mb-1 font-bold">@${comment.username}</div>
                <div class="whitespace-pre-line">${comment.text}</div>
            </div>
        `;
    });
}

document.getElementById('commentForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const commentText = document.getElementById('newComment').value.trim();

    if (!username || !commentText) return;

    const newCommentObj = {
        bookId: bookId,
        username: username,
        text: commentText
    };

    const addedComment = await addComment(newCommentObj);

    if (addedComment) {
        comments.push(addedComment);
        renderComments(comments);
        document.getElementById('username').value = '';
        document.getElementById('newComment').value = '';
    } else {
        alert('Rəy əlavə edilərkən xəta baş verdi');
    }
});

window.addToCart = function (id) {
    const selectedBook = books.find(b => b.id == id);
    if (!selectedBook) return;

    const item = cart.find(c => c.book.id === id);
    if (item) {
        item.quantity++;
    } else {
        cart.push({ book: selectedBook, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateCartCount()
    Swal.fire({
        title: 'Uğurla əlavə olundu!',
        text: 'Kitab səbətə əlavə olundu!',
        icon: 'success',
        confirmButtonText: 'Bağla'
        });
        cart = JSON.parse(localStorage.getItem('cart')) || [];


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
    updateCartCount()
    await Swal.fire({
        title: 'Kitabların artıq sənindir! 🥳',
        text: 'Bizi seçdiyiniz üçün təşəkkürlər 😊',
        icon: 'success',
        confirmButtonText: 'Bağla'
    });
};

function renderCart() {
    const container = document.getElementById('cartContent');
    if (cart.length === 0) {
        container.innerHTML = "<p>Səbətiniz boşdur.</p>";
        return;
    }

    let total = 0;
    container.innerHTML = cart.map(({ book, quantity }) => {
        total += book.price * quantity;
        return `
            <div class="flex items-center gap-4 mb-4 border-b border-gray-400 pb-2">
                <img src="${book.img}" alt="${book.name}" class="w-12 h-16 object-cover rounded">
                <div class="flex-grow">
                    <h3 class="font-semibold">${book.name}</h3>
                    <p class="text-sm text-gray-600">${book.author}</p>
                    <p class="text-sm">Qiymət: ${(book.price * quantity).toFixed(2)} ₼</p>
                    <p class="text-sm">Say: ${quantity}</p>
                </div>
                <button onclick="removeFromCart(${book.id})" class="text-red-700 hover:underline ml-2">Sil</button>
            </div>
        `;
    }).join('');

    container.innerHTML += `
        <div class="mt-4 flex justify-between items-center">
            <p class="font-bold text-lg">Cəmi: ${total.toFixed(2)} ₼</p>
            <button onclick="buyAllItems()" class="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-600">
                Hamısını Al
            </button>
        </div>
    `;
}

window.removeFromCart=function(id) {
    cart = cart.filter(c => c.book.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateCartCount()
    cart = JSON.parse(localStorage.getItem('cart')) || [];

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
      <div class="flex items-center gap-4 mb-4 border-b border-gray-300 pb-2">
            <img src="${book.img}" alt="${book.name}" class="w-12 h-16 object-cover rounded">
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
function updateCartCount() {
    const countEl = document.getElementById("cartCount");
    let totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    countEl.textContent = totalCount;
    countEl.style.display = totalCount > 0 ? 'block' : 'none';
}
loadBook();

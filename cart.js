import { getData,updateBook } from './service.js';
let books = []

let cart = JSON.parse(localStorage.getItem('cart')) || [];
async function getData2() {
    console.log("getData2 çağırıldı");
    books = await getData('kitablar');
    loadCartPage()
      updateCartCount();

  

}
function loadCartPage() {
    const container = document.getElementById('cartPageContainer');
    cart = JSON.parse(localStorage.getItem('cart')) || [];

    container.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
        container.innerHTML = `<p class="text-center text-gray-500 mt-8">Səbət boşdur</p>`;
        return;
    }
    cart.forEach(({ book, quantity }) => {
        total += book.price * quantity;

        container.innerHTML += `
        <div class="flex flex-col lg:flex-row items-center py-6 border-b border-gray-200 gap-6 w-full">
            <div class="img-box max-lg:w-full">
                <img src="${book.img}" alt="${book.name}" class="aspect-square w-full lg:max-w-[140px] rounded-xl object-cover">
            </div>
            <div class="flex flex-row items-center w-full">
                <div class="grid grid-cols-1 lg:grid-cols-2 w-full">
                    <div class="flex items-center">
                        <div>
                            <h2 class="font-semibold text-xl leading-8 text-black mb-3">${book.name}</h2>
                            <p class="font-normal text-lg leading-8 text-gray-500 mb-3">By: ${book.author}</p>
                            <div class="flex items-center">
                                <p class="font-medium text-base leading-7 text-black pr-4 mr-4 border-r border-gray-200">
                                    Qiymət: <span class="text-indigo-600">${book.price.toFixed(2)} ₼</span>
                                </p>
                                <p class="font-medium text-base leading-7 text-black">
                                    Say: <span class="text-gray-500">${quantity}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="grid grid-cols-5">
                        <div class="col-span-5 lg:col-span-1 flex items-center max-lg:mt-3">
                            <div class="flex gap-3 lg:block">
                                <p class="font-medium text-sm leading-7 text-black">Cəmi</p>
                                <p class="lg:mt-4 font-medium text-sm leading-7 text-indigo-600">${(book.price * quantity).toFixed(2)} ₼</p>
                            </div>
                        </div>
                        <div class="col-span-5 lg:col-span-2 flex items-center max-lg:mt-3 ">
                            <div class="flex gap-3 lg:block">
                                <p class="font-medium text-sm leading-7 text-black">Status</p>
                                <p class="font-medium text-sm leading-6 whitespace-nowrap py-0.5 px-3 rounded-full lg:mt-3 bg-emerald-50 text-emerald-600">
                                    Hazırdır
                                </p>
                            </div>
                        </div>
                        <div class="col-span-5 lg:col-span-2 flex items-center max-lg:mt-3">
                            <div class="flex gap-3 lg:block">
                                <p class="font-medium text-sm whitespace-nowrap leading-6 text-black">Təxmini çatdırılma</p>
                                <p class="font-medium text-base whitespace-nowrap leading-7 lg:mt-3 text-emerald-500">Tezliklə</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    });

    container.innerHTML += `
        <div class="w-full border-t border-gray-200 px-6 flex flex-col lg:flex-row items-center justify-between mt-6">
            <p class="font-semibold text-lg text-black py-6">Cəmi qiymət: <span class="text-red-600">${total.toFixed(2)} ₼</span></p>
            <button onclick="buyAllItems()" class="rounded-full py-3 px-7 font-semibold text-sm leading-7 text-white bg-red-600 shadow-sm shadow-transparent transition-all duration-500">
                Səbəti təsdiqlə
            </button>
        </div>
    `;
}
window.removeFromCart=function(id) {
    cart = cart.filter(c => c.book.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCartPage() 
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

        book.stockCount -= item.quantity;
        book.soldCount += item.quantity;
        await updateBook(book.id, book); 
    }

    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCartPage() 

    await Swal.fire({
        title: 'Kitabların artıq sənindir! 🥳',
        text: 'Bizi seçdiyiniz üçün təşəkkürlər 😊',
        icon: 'success',
        confirmButtonText: 'Bağla'
    });
};


getData2()
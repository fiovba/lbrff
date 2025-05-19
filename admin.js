import { getData, deleteBookByID, addBook, updateBook } from "./service.js";

const tbody = document.querySelector('tbody');
let books = [];

async function getData2() {
    books = await getData("kitablar");
    printTable();
}

window.handleDelete = async (id) => {
    await deleteBookByID(Number(id));
    books = books.filter(book => book.id !== Number(id));
    printTable();
};

window.openModule = function () {
    document.getElementById("bookModal").classList.remove("hidden");
};

window.closeModule = function () {
    document.getElementById("bookModal").classList.add("hidden");
};

window.saveBook = async function () {
    const name = document.getElementById("nameInput").value;
    const author = document.getElementById("authorInput").value;
    const img = document.getElementById("imgInput").value;
    const price = parseFloat(document.getElementById("priceInput").value);
    const description = document.getElementById("descriptionInput").value;
    const category = document.getElementById("categoryInput").value;
    const altcategory = document.getElementById("altCategInput").value.split(",").map(item => item.trim());
    const altAltcategory = document.getElementById("altAltCategInput").value.split(",").map(item => item.trim());
    const language = document.getElementById("langInput").value.split(",").map(item => item.trim());
    const stockCount = parseInt(document.getElementById("stockCountInput").value);

    const newBook = {
        name,
        author,
        img,
        price,
        description,
        category,
        altCateg: altcategory,
        altAltCateg: altAltcategory,
        lang: language,
        stockCount,
        soldCount: 0,
        view: 0
    };

    await addBook(newBook);
    clearInputs();
    closeModule();
    getData2();
};

function clearInputs() {
    document.getElementById("nameInput").value = "";
    document.getElementById("authorInput").value = "";
    document.getElementById("imgInput").value = "";
    document.getElementById("priceInput").value = "";
    document.getElementById("descriptionInput").value = "";
    document.getElementById("categoryInput").value = "";
    document.getElementById("altCategInput").value = "";
    document.getElementById("altAltCategInput").value = "";
    document.getElementById("langInput").value = "";
    document.getElementById("stockCountInput").value = "";
}

window.handleEdit = function(id) {
    openModule();
    const selectedBook = books.find(book => book.id == id);

    document.getElementById("nameInput").value = selectedBook.name;
    document.getElementById("authorInput").value = selectedBook.author;
    document.getElementById("imgInput").value = selectedBook.img;
    document.getElementById("priceInput").value = selectedBook.price;
    document.getElementById("descriptionInput").value = selectedBook.description;
    document.getElementById("categoryInput").value = selectedBook.category;
    document.getElementById("altCategInput").value = selectedBook.altCateg.join(", ");
    document.getElementById("altAltCategInput").value = selectedBook.altAltCateg.join(", ");
    document.getElementById("langInput").value = selectedBook.lang.join(", ");
    document.getElementById("stockCountInput").value = selectedBook.stockCount;

    document.getElementById("savebook").onclick = async function () {
        const updatedBook = {
            id,
            name: document.getElementById("nameInput").value,
            author: document.getElementById("authorInput").value,
            img: document.getElementById("imgInput").value,
            price: parseFloat(document.getElementById("priceInput").value),
            description: document.getElementById("descriptionInput").value,
            category: document.getElementById("categoryInput").value,
            altCateg: document.getElementById("altCategInput").value.split(",").map(item => item.trim()),
            altAltCateg: document.getElementById("altAltCategInput").value.split(",").map(item => item.trim()),
            lang: document.getElementById("langInput").value.split(",").map(item => item.trim()),
            stockCount: parseInt(document.getElementById("stockCountInput").value),
        };
        console.log(updatedBook);
        
        await updateBook(id, updatedBook);
        clearInputs();
        closeModule();
        getData2();
    };

   
};

function printTable() {
    tbody.innerHTML = '';
    books.forEach(book => {
        const truncatedDescription = book.description.length > 70 ? book.description.slice(0, 70) + '...' : book.description;

        tbody.innerHTML += `
        <tr class="bg-red-800 border-b border-red-900">
            <th scope="row" class="px-6 py-4 font-medium whitespace-nowrap text-white">${book.name}</th>
            <td class="px-6 py-4">${book.author}</td>
            <td class="px-6 py-4">${truncatedDescription}</td>
            <td class="px-6 py-4"><img class="w-[70px] h-[70px]" src="${book.img}" alt="${book.name}"></td>
            <td class="px-6 py-4">${book.price} ₼</td>
            <td class="px-6 py-4">
                <a href="#" onclick="handleEdit(${book.id})" class="font-medium p-2 rounded-xl bg-white text-blue-600 hover:underline">Edit</a>
                <a href="#" onclick="handleDelete(${book.id})" class="font-medium p-2 rounded-xl bg-white text-red-700 hover:underline ml-2">Delete</a>
            </td>
        </tr>`;
    });
}

getData2();

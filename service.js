async function getData(category){
    try{
        const res = await fetch(`libraff-data-production.up.railway.app/${category}`);
        if(!res.ok) throw new Error(res.status);
        return await res.json();
    }
    catch(error){
        console.log(error.message);
    }
}

async function addComment(newComments){
    const res = await fetch(`libraff-data-production.up.railway.app/comments`, {
        method:"POST", 
        headers:{'Content-Type':'application/json'}, 
        body:JSON.stringify(newComments)
    });
    return await res.json();
}

async function updateViewCount(book) {
    try {
        book.view = book.view + 1;
        const response = await fetch(`libraff-data-production.up.railway.app/kitablar/${book.id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(book)
        });
        return await response.json();
    } catch (error) {
        console.error('View count artırılarkən xəta baş verdi:', error);
    }
}

async function addBook(newItem) {
    try {
        const res = await fetch(`libraff-data-production.up.railway.app/kitablar`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newItem)
        });
        if (!res.ok) throw new Error(res.status);
        return await res.json();
    } catch (error) {
        console.error('Create item error:', error);
    }
}

async function updateBook(id, updatedFields) {
    try {
        const res = await fetch(`libraff-data-production.up.railway.app/kitablar/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedFields)
        });

        if (!res.ok) throw new Error(`Status: ${res.status}`);
        return await res.json();
    } catch (error) {
        console.error('PATCH update error:', error);
    }
}


async function deleteBookByID(id) {
    try {
        const res = await fetch(`libraff-data-production.up.railway.app/kitablar/${id}`, {
            method: 'DELETE'
        });
        if (!res.ok) throw new Error(res.status);
        return await res.json();
    } catch (error) {
        console.error('Delete item error:', error);
    }
}

export {
    getData,
    addComment,
    updateViewCount,
    addBook,
    updateBook,
    deleteBookByID
};

async function GetData() {
    try {
        let res = await fetch('http://localhost:3001/posts')
        if (res.ok) {
            let posts = await res.json();
            let bodyTable = document.getElementById('body-table');
            bodyTable.innerHTML = '';
            for (const post of posts) {
                bodyTable.innerHTML += convertObjToHTML(post)
            }
        }
    } catch (error) {
        console.log(error);
    }
}
async function Save() {
    let id = document.getElementById("id_txt").value.trim();
    let title = document.getElementById("title_txt").value;
    let views = document.getElementById("views_txt").value;

    if (!id) {
        // Auto-increment ID
        let res = await fetch('http://localhost:3001/posts');
        let posts = await res.json();
        let maxId = posts.length > 0 ? Math.max(...posts.map(p => parseInt(p.id))) : 0;
        id = (maxId + 1).toString();
    }

    let getItem = await fetch('http://localhost:3001/posts/' + id);
    if (getItem.ok) {
        let res = await fetch('http://localhost:3001/posts/'+id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: title,
                views: views,
                isDeleted: false // Ensure not deleted when updating
            })
        })
        
    } else {
        //fetch -> HTTP POST
        let res = await fetch('http://localhost:3001/posts', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: id,
                title: title,
                views: views,
                isDeleted: false
            })
        })
    }
    GetData();
    return false;

}

function convertObjToHTML(post) {
    let style = post.isDeleted ? 'style="text-decoration: line-through;"' : '';
    return `<tr>
    <td ${style}>${post.id}</td>
    <td ${style}>${post.title}</td>
    <td ${style}>${post.views}</td>
    <td><input type='submit' value='Delete' onclick='Delete("${post.id}")'></td>
    </tr>`
}
async function Delete(id) {
    // Soft delete 
    let getRes = await fetch('http://localhost:3001/posts/' + id);
    if (getRes.ok) {
        let post = await getRes.json();
        let res = await fetch('http://localhost:3001/posts/' + id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...post,
                isDeleted: true
            })
        })
        if (res.ok) {
            GetData()
        }
    }
    return false;
}
GetData();


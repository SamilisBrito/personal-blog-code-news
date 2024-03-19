const BASE_URL = "http://localhost:3000";

function navigateToIndex(e) {
    e.preventDefault()
    window.location.href = `/pages`;
}

async function getPosts() {
    const response = await (await fetch(`${BASE_URL}/posts`)).json();
    return response;
}


function renderSectionsContent(id, posts) {
    const PARENT = document.getElementById('all-posts');
    
    Object.values(posts).forEach(post => {
        const createdAt = new Date(post.createdAt)
        if (post.id === id) {
            PARENT.innerHTML = `
            <img
                class="w-full h-80 object-cover mb-4"
                src=${post.image}
                alt="fulano de tal e tal"
              />
              <div id="primary-information" class="mx-auto max-w-7xl mb-10">
                <h2 id="title-form" class="text-4xl font-bold mb-4">${post.title}</h2>
                <span>${post.author}</span> -
                <span class="text-slate-500">${createdAt.getDate()}, ${createdAt.toLocaleString('pt-br', { month: 'long' })} de ${createdAt.getFullYear()}</span>
                <span class="text-slate-500">às ${createdAt.getHours()}:${createdAt.getMinutes()}h</span>
              </div>
              <p class="text-xl leading-9 mb-5">
                ${post.text}
              </p>
              <button id="btn-cancel" class="bg-slate-500 py-2 px-4 rounded flex gap-1">
                <img src="../imgs/arrow-left.svg" alt="icone de voltar"> Voltar
              </button>
            `
        }
    })
    PARENT.childNodes[7].addEventListener('click', (e) => navigateToIndex(e))
}


(async function init() {

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    let posts = [];

    posts = await getPosts();

    renderSectionsContent(id, posts)
})();

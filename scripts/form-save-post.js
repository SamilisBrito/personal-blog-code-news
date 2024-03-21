const BASE_URL = "http://localhost:3000";

async function createPostsAPI(post) {
  await fetch(`${BASE_URL}/posts`, {
    method: "POST",
    body: JSON.stringify({
      ...post,
      alt: "Imagem padrão",
      createdAt: new Date().getTime(),
      // updatedAt: new Date().getTime(),
    }),
  });
}

async function editPostsAPI(post, id) {
  await fetch(`${BASE_URL}/posts/${id}`, {
    method: "PATCH",
    body: JSON.stringify({
      ...post,
      updatedAt: new Date().getTime(),
    }),
  });
}

async function getTags() {
  const response = await fetch(`${BASE_URL}/tags`);
  const tags = await response.json();
  return tags.reduce((acc, tag) => {
    acc[tag.id] = tag.name;
    return acc;
  }, {});
}

// tratar dados
async function saveForm(e, id, createPostsAPI, editPostsAPI, navigateToManagement) {
  e.preventDefault();

  const image = document.getElementById("image").value;
  const author = document.getElementById("author").value;
  const title = document.getElementById("title").value;
  const tag = document.getElementById("select-tag").value;
  const text = document.getElementById("text").value;

  if (author === "" || title === "" || tag === "" || text === "" || image === "") {
    alert("Por favor, preencha todos os campos obrigatórios.");
    return;
  }

  try {
    if (id) {
      await editPostsAPI({
        image,
        author,
        title,
        tags: [tag],
        text,
      }, id);
    } else {
      await createPostsAPI({
        image,
        author,
        title,
        tags: [tag],
        text,
      });
    }

    navigateToManagement(e);
  } catch (error) {
    window.alert(error);
  }
}

async function render(id, deletePost, navigateToManagement) {
  const titleForm = document.getElementById('title-form')
  if (id) {

    titleForm.textContent = 'Editar';
    const post = await (await fetch(`${BASE_URL}/posts/${id}`)).json();

    document.getElementById('image').value = post.image
    document.getElementById('author').value = post.author
    document.getElementById('title').value = post.title
    document.getElementById('select-tag').value = post.tags
    document.getElementById('text').value = post.text

    const PARENT = document.getElementById('primary-information');
    const btnDelete = document.createElement('button');
    btnDelete.classList.add("bg-slate-800", "p-1", "rounded");
    btnDelete.id = 'btn-delete'
    btnDelete.innerHTML = `<img src="../imgs/trash.svg" alt="" />`
    PARENT.appendChild(btnDelete)

    btnDelete.addEventListener("click", (e) => deletePost(e, id, navigateToManagement))

  } else {
    titleForm.textContent = 'Criar';
  }
}

async function deletePost(e, id, navigateToManagement) {
  try {
    atch(`${BASE_URL}/posts/${id}`, {
      method: "Dwait feELETE",
    })
    navigateToManagement(e)
    window.alert('Post excluído com sucesso')
  } catch (error) {
    window.alert('Não foi possível excluír')
  }
}

function selectTag(element, tags) {
  Object.entries(tags).forEach((tag) => {
    const newOption = document.createElement('option');
    newOption.textContent = tag[1];
    newOption.value = tag[0];
    element.appendChild(newOption);
  })
}

function navigateToManagement(e) {
  e.preventDefault()
  window.location.href = `/pages/management.html`;
}


(async function init() {
  const BTN_CANCEL = document.getElementById("btn-cancel");
  const BTN_SAVE = document.getElementById("bnt-save");
  const SELECT_TAGS = document.getElementById("select-tag");

  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');

  let tags = [];

  tags = await getTags();

  selectTag(SELECT_TAGS, tags)

  BTN_CANCEL.addEventListener("click", (e) => navigateToManagement(e));

  BTN_SAVE.addEventListener("click", (e) =>
    saveForm(e, id, createPostsAPI, editPostsAPI, navigateToManagement)
  );

  render(id, deletePost, navigateToManagement);

})();

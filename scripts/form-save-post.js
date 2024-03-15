const BASE_URL = "http://localhost:3000";

async function createPostsAPI(post) {
  let result = await fetch(`${BASE_URL}/posts`, {
    method: "POST",
    body: JSON.stringify({
      ...post,
      image: "../imgs/default-image.png",
      alt: "Imagem padrão",
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    }),
  });
  result = await result.json();
}

function navigateToManagement() {
  window.location.href = `/pages/management.html`;
}

// tratar dados
async function saveForm(e, action, navigateToManagement) {
  e.preventDefault();

  const author = document.getElementById("author").value;
  const title = document.getElementById("title").value;
  const tag = document.getElementById("select-tag").value;
  const text = document.getElementById("text").value;

  if (author === "" || title === "" || tag === "" || text === "") {
    alert("Por favor, preencha todos os campos obrigatórios.");
    return;
  }

  try {
    await action({
      author,
      title,
      tags: [tag],
      text,
    });

    navigateToManagement();
  } catch (error) {
    console.error(error);
    window.alert("Samilis");
  }
}

(async function init() {
  const BTN_CANCEL = document.getElementById("btn-cancel");
  const BTN_SAVE = document.getElementById("bnt-save");

  BTN_CANCEL.addEventListener("click", () => navigateToManagement());

  BTN_SAVE.addEventListener("click", (e) =>
    saveForm(e, createPostsAPI, navigateToManagement)
  );
})();

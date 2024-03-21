const BASE_URL = 'http://localhost:3000'

async function getPosts() {
  const response = await (await fetch(`${BASE_URL}/posts`)).json();
  return response;
}

async function getTags() {
  const response = await fetch(`${BASE_URL}/tags`);
  const tags = await response.json();
  return tags.reduce((acc, tag) => {
    acc[tag.id] = tag.name;
    return acc;
  }, {});
}

function renderPosts(posts, tags, tagParent) {
  const MAIN = document.getElementById(tagParent);
  posts.forEach(post => {

    const POST_TAGS = post.tags;
    const ARTICLE_TOPIC = document.createElement('article');
    ARTICLE_TOPIC.classList.add('max-w-96', 'cursor-pointer');
    const createdAt = new Date(post.createdAt)

    let postText = post.text;
    let readMoreButton = '';

    // Adiciona limite de caracteres e botão "ler mais"
    if (postText.length > 100) {
      postText = postText.substring(0, 100) + '...';
      readMoreButton = '<span class="underline text-slate-100 hover:text-purple-600">ler mais</span>';
    }

    ARTICLE_TOPIC.innerHTML = `
    <img
      class="rounded mb-2 object-cover h-48 w-96"
      src="${post.image}"
      alt="${post.alt}"
    />
    <div class="content">
      <p class="mb-3">
        <span>${post.author}</span> -
        <span class="text-slate-500">${createdAt.getDate()}, ${createdAt.toLocaleString('pt-br', { month: 'long' })} de ${createdAt.getFullYear()}</span>
        <span class="text-slate-500">às ${createdAt.getHours()}:${createdAt.getMinutes()}h</span>
      </p>
      <h2 class="mb-4">${[post.title]}</h2>
      <p class="text-slate-500 mb-4 text-sm">
      ${postText} ${readMoreButton}
      </p>
      <div class="tags flex gap-2"></div>
    </div>`

    const TAGS_CONTAINER = ARTICLE_TOPIC.querySelector('.tags');
    POST_TAGS.forEach(tag => {
      const SPAN_TAGS = document.createElement('span');

      SPAN_TAGS.classList.add('rounded', 'px-3', 'py-1', 'bg-slate-800', 'text-xs');
      SPAN_TAGS.textContent = tags[tag];
      TAGS_CONTAINER.appendChild(SPAN_TAGS);
    });

    MAIN.appendChild(ARTICLE_TOPIC);
    ARTICLE_TOPIC.addEventListener('click', () => openPage(post.id))
  });
}

function openPage(id = "") {
  window.location.href = `/pages/content.html?id=${id}`;
}

function renderTags(tags) {
  const HEADER = document.querySelector('#header')
  const UL_BUTTON = document.createElement('ul');
  UL_BUTTON.classList.add('mb-14', 'flex', 'gap-8', 'font-bold')

  Object.entries(tags).forEach((tag) => {
    const LI_BUTTON = document.createElement('li');
    LI_BUTTON.innerHTML = `<input class="absolute peer w-0 h-0 " type="checkbox" name="filter-tags" id="${tag[0]}">
    <label class="hover:text-slate-600 peer-checked:bg-slate-800 px-2 rounded" for="${tag[0]}">${tag[1]}</label>`
    UL_BUTTON.appendChild(LI_BUTTON)
  })
  HEADER.appendChild(UL_BUTTON)
}

function renderSection(id, idParent, classListSection = ['mb-10'], name = '') {
  const PARENT = document.getElementById(idParent);
  const SECTION = document.createElement('section')
  SECTION.classList.add(...classListSection)
  SECTION.id = id;
  if (name) {
    SECTION.innerHTML = `
    <h2 class="font-bold text-4xl col-span-full">${name}</h2>`
  }

  PARENT.appendChild(SECTION);
}

function searchInput(searchInput, posts, tags, idParent, renderSectionDefault, renderSection, renderPosts, clearElement, postsNotFound) {
  const MAIN_ELEMENT = document.getElementById(idParent);

  const FILTER_POST = posts.filter((post) => {
    return post.title.toLowerCase().includes(searchInput.value.toLowerCase());
  });

  if (searchInput.value !== '') {
    clearElement(MAIN_ELEMENT)

    if (FILTER_POST.length !== 0) {
      renderSection('section-search-posts', idParent, ['grid', 'grid-cols-3', 'gap-12', 'mb-10'])
      renderPosts(FILTER_POST, tags, 'section-search-posts')
    } else {
      postsNotFound(idParent)
    }

  } else {
    clearElement(MAIN_ELEMENT)
    renderSectionDefault()
  }


}

function filterByTag(idTag, posts, idParent, foreignTags, resetCheckedTags, resetFilter, clearElement, postsNotFound) {
  const elementTag = document.getElementById(idTag)
  const MAIN_ELEMENT = document.getElementById(idParent);
  // coiso da ge
  resetCheckedTags(elementTag, foreignTags)
  // 
  clearElement(MAIN_ELEMENT)
  if (!elementTag.checked) {
    return resetFilter()
  }


  let arrayOfPostsWithTheSameTag = []
  posts.forEach((post) => {
    const TAGS_POST = post.tags
    TAGS_POST.forEach(tagsPost => {
      if (idTag == tagsPost) {
        arrayOfPostsWithTheSameTag.push(post)
        renderSection('section-search-posts', idParent, ['grid', 'grid-cols-3', 'gap-12', 'mb-10'])
      }
    })
  })
  renderPosts(arrayOfPostsWithTheSameTag, foreignTags, 'section-search-posts')

  if(!MAIN_ELEMENT.hasChildNodes()){
    postsNotFound(idParent)
  }
}

function resetCheckedTags(currentTag, allTags) {
  if (currentTag.checked) {
    Object.keys(allTags).forEach(idTag => {
      const elementTag = document.getElementById(idTag)
      if (elementTag.id !== currentTag.id) {
        elementTag.checked = false
      }
    })
  } else {
    Object.keys(allTags).forEach(idTag => {
      const elementTag = document.getElementById(idTag)
      elementTag.checked = false
    })
  }
}

function clearElement(element) {
  element.innerHTML = ""
}

function postsNotFound(idParent){
  renderSection('section-search-posts', idParent)
    const section = document.querySelector('#section-search-posts');

    const SECONDARY_TITLE = document.createElement('h2');
    SECONDARY_TITLE.classList.add('font-bold', 'text-4xl', 'text-center', 'text-slate-600');
    SECONDARY_TITLE.textContent = 'Posts não encontrados';

    section.appendChild(SECONDARY_TITLE);
}

(async function init() {
  const NEW_POSTS = 'sections-news-posts';
  const POSTS_POPULAR = 'sections-all-posts';
  const SEARCH_INPUT = document.getElementById('search-input');
  const MAIN_ELEMENT = 'all-posts';

  let posts = [];
  let tags = [];

  tags = await getTags();
  posts = await getPosts();

  const newPostsOrdenados = posts.slice().sort((a, b) => b.createdAt - a.createdAt);
  
  function renderSectionsDefault() {
    renderSection(NEW_POSTS, MAIN_ELEMENT, ['grid', 'grid-cols-3', 'gap-12', 'mb-10'], 'Novos')
    renderPosts(newPostsOrdenados.slice(0, 3), tags, NEW_POSTS);
    renderSection(POSTS_POPULAR, MAIN_ELEMENT, ['grid', 'grid-cols-3', 'gap-12', 'mb-10'], 'Todos')
    renderPosts(posts, tags, POSTS_POPULAR);
  }

  renderSectionsDefault()
  renderTags(tags);

  Object.keys(tags).forEach(idTag => {
    const elementTag = document.getElementById(idTag)
    elementTag.addEventListener('click', () => filterByTag(idTag, posts, MAIN_ELEMENT, tags, resetCheckedTags, renderSectionsDefault, clearElement, postsNotFound))
  })

  SEARCH_INPUT.addEventListener('input', () => searchInput(SEARCH_INPUT, posts, tags, MAIN_ELEMENT, renderSectionsDefault, renderSection, renderPosts, clearElement, postsNotFound))
})()









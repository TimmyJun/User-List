const BASE_URL = "https://lighthouse-user-api.herokuapp.com";
const INDEX_URL = BASE_URL + "/api/v1/users/";
const users = [];
const userList = document.querySelector("#data-panel");

// 搜尋功能使用的變數
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
let filteredUser = [];

// 收藏與移除功能使用的變數
const dataPanel = document.querySelector("#data-panel");

// 分頁功能使用的變數
const perPageUsers = 20
const pagination = document.querySelector('.pagination')




// add user Data
function addUserData(data) {
  let userHTML = "";

  data.forEach((user) => {
    userHTML += `
    <div class="me-3 mb-3">
      <div class="card" style="width: 12rem;">
        <img src="${user.avatar}" class="card-img-top" alt="profile picture" data-id="${user.id}" data-bs-toggle="modal" data-bs-target="#exampleModal">
        <div class="card-body text-center">
          <h6 class="card-title" id="username" data-id="${user.id}" data-bs-toggle="modal" data-bs-target="#exampleModal">${user.name} ${user.surname}</h6>
        </div>
        <div class="card-footer d-flex justify-content-end">
          <button class="btn btn-success btn-add-favorite" data-id="${user.id}">+</button>
        </div>
      </div>
    </div>
 `;
  });
  userList.innerHTML = userHTML;
}

function loadAlluserData() {
  axios
    .get(INDEX_URL)
    .then(function (response) {
      users.push(...response.data.results);
      renderPaginator(users.length)
      addUserData(getUserByPage(1));
    })
    .catch(function (error) {
      console.log(error);
    });
}

function showModal(event) {
  const id = event.target.dataset.id;
  if (!id) {
    return;
  }

  const userName = document.querySelector("#user-name");
  const modalAvatar = document.querySelector(".modal-avatar");
  const info = document.querySelector(".user-info");

  userName.innerText = "";
  modalAvatar.src = "";
  info.innerHTML = "";

  axios
    .get(INDEX_URL + id)
    .then(function (response) {
      const user = response.data;
      userName.innerText = `${user.name} ${user.surname}`;
      modalAvatar.src = user.avatar;
      info.innerHTML = `
      <ul>
        <li>email:${user.email}</li>
        <li>gender:${user.gender}</li>
        <li>age:${user.age}</li>
        <li>region:${user.region}</li>
        <li>birthday:${user.birthday}</li>
      </ul>
    `;
    })
    .catch(function (error) {
      console.log(error);
    });
}

// 搜尋使用者
searchForm.addEventListener("submit", function onSearchFormSubmitted(event) {
  event.preventDefault();
  const keyword = searchInput.value.trim().toLowerCase();

  filteredUser = users.filter(
    (user) =>
      user.name.toLowerCase().includes(keyword) ||
      user.surname.toLowerCase().includes(keyword)
  );
  if (filteredUser.length === 0) {
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的結果`);
  }

  renderPaginator(filteredUser.length)
  addUserData(addUserData(getUserByPage(1)));
});

// 收藏 / 移除使用者
function addToFavorit(id) {
  const list = JSON.parse(localStorage.getItem('FavoriteUsers')) || []
  const user = users.find((user) => user.id === id)

  if (list.some((user) => user.id === id)) {
    return alert('此用戶已經在收藏清單中！')
  }

  list.push(user)
  localStorage.setItem('FavoriteUsers', JSON.stringify(list))
}

dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-add-favorite")) {
    addToFavorit(Number(event.target.dataset.id));
  }
});

// 分頁
function getUserByPage(page) {
  const data = filteredUser.length ? filteredUser : users
  const startIndex = (page - 1) * perPageUsers

  return data.slice(startIndex, startIndex + perPageUsers)
}

function renderPaginator(number) {
  const totalPages = Math.ceil(number / perPageUsers)
  let rawPaginatorHTML = ''

  for (let page = 1; page <= totalPages; page++) {
    rawPaginatorHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }

  pagination.innerHTML = rawPaginatorHTML
}

pagination.addEventListener('click', function onPaginationClicked(event) {
  if (event.target.tagName !== 'A') return

  const page = Number(event.target.dataset.page)
  addUserData(getUserByPage(page))
})

// add code here
loadAlluserData();
userList.addEventListener("click", showModal);

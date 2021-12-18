const BASE_URL = "https://lighthouse-user-api.herokuapp.com";
const INDEX_URL = BASE_URL + "/api/v1/users/";
const users = JSON.parse(localStorage.getItem('FavoriteUsers')) || [] //收藏清單;
const userList = document.querySelector("#data-panel");

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
          <button class="btn btn-danger btn-remove-favorite" data-id="${user.id}">X</button>
        </div>
      </div>
    </div>
 `;
  });
  userList.innerHTML = userHTML;
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
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
let filteredUser = [];

searchForm.addEventListener("submit", function onSearchFormSubmitted(event) {
  event.preventDefault();
  const keyword = searchInput.value.trim().toLowerCase();

  filteredUser = users.filter(
    (user) =>
      user.name.toLowerCase().includes(keyword) ||
      user.surname.toLowerCase().includes(keyword)
  );
  if (filteredUser.length === 0) {
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的用戶`);
  }

  addUserData(filteredUser);
});

// 收藏 / 移除使用者
const dataPanel = document.querySelector("#data-panel");

function removeFromFavorite(id) {
  if (!users || !users.length) return

  const userIndex = users.findIndex((user) => user.id === id)
  if (userIndex === -1) return

  users.splice(userIndex, 1)

  localStorage.setItem('FavoriteUsers', JSON.stringify(users))
  addUserData(users)
}

dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-remove-favorite")) {
    removeFromFavorite(Number(event.target.dataset.id));
  }
});

// add code here
userList.addEventListener("click", showModal);
addUserData(users)
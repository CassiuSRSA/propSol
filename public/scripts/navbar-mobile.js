const hamburgerBtn = document.querySelector(".hamburger");
const navbarElement = document.querySelector("#navbar");

hamburgerBtn.addEventListener("click", () => {
  navbarElement.classList.toggle("show");
  if (!navbarElement.classList.value) {
    hamburgerBtn.innerHTML = `<i class="fa-solid fa-bars fa-2x"></i>`;
  } else {
    hamburgerBtn.innerHTML = `<i class="fa-solid fa-x fa-2x"></i>`;
  }
});

const dropdown = document.getElementsByClassName("dropdown")[0];
const dropdownContent = document.getElementsByClassName("dropdown-content")[0];
const account = document.getElementById("account");
const contact = document.getElementById("contact");
const logout = document.getElementById("logout");

dropdown.addEventListener("focus", () => {
    dropdownContent.classList.remove("no-display");
    dropdownContent.classList.add("block-display");
});
dropdown.addEventListener("blur", () => {
    dropdownContent.classList.remove("block-display");
    dropdownContent.classList.add("no-display");
});

account.addEventListener("click", () => {
    window.location.href = "/account";
});
contact.addEventListener("click", () => {
    window.location.href = "/contact";
});
logout.addEventListener("click", () => {
    window.location.href = "/logout";
});
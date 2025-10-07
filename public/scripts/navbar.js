

// Desktop navbar dropdown

const dropdown = document.getElementsByClassName("dropdown")[0];
const dropdownContent = document.querySelector(".dropdown .card");
const account = document.getElementById("account");
const contact = document.getElementById("contact");
const logout = document.getElementById("logout");

try {
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
} catch { /* dropdown do not exist on mobile view DOM */ }




// Mobile navbar menu panel

const mobileMenu = document.getElementById('mobile-menu');

function openMenu() {
    mobileMenu.style.display = 'flex';
    mobileMenu.style.animation = "mobile-menu-open 500ms forwards ease";
}

function closeMenu() {
    mobileMenu.style.animation = "mobile-menu-close 500ms forwards ease";
}

try {
    const desktopMenuToggler = document.getElementById('desktop-menu-toggler');
    let menuState = false; //closed

    desktopMenuToggler.addEventListener('click', (e) => {
        menuState ? closeMenu() : openMenu();
        menuState = !menuState;
    });
} catch { /* desktopMenuToggler do not exist on mobile view DOM */ }


try {
    const mobileOpenMenu = document.getElementById('mobile-menu-icon');
    const mobileCloseMenu = document.getElementById('close-menu-icon');

    mobileOpenMenu.addEventListener('click', (e) => {

        // toggle menu icons form display
        mobileOpenMenu.style.display = 'none';
        mobileCloseMenu.style.display = 'block';

        openMenu();
    });

    mobileCloseMenu.addEventListener('click', (e) => {
        mobileCloseMenu.style.display = 'none';
        mobileOpenMenu.style.display = 'block';
        closeMenu();
    });
} catch {/* menuIcons do not exist on desktop view DOM */} 
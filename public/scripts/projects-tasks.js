const openPopups = document.getElementsByClassName('open-add-popup');
const closePopup = document.getElementById('close-add-popup');
const popup = document.getElementsByClassName('add-popup')[0];

for (openPopup of openPopups) {
    openPopup.addEventListener('click', () => {
        popup.classList.remove('no-display');
        popup.classList.add('flex');
    });
}

closePopup.addEventListener('click', () => {
    popup.classList.remove('flex');
    popup.classList.add('no-display');
});
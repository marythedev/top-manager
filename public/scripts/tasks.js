const checkboxes = document.querySelectorAll(".checkbox input[type=checkbox]");

for (const checkbox of checkboxes) {
    checkbox.addEventListener('click', () => {
        if (checkbox.checked) {
            for (const other of checkboxes) {
                if (checkbox != other && other.checked)
                    other.checked = false;
            }
        }
    });
}



const openUpdPopups = document.getElementsByClassName('open-update-popup');
const closeUpdPopups = document.getElementsByClassName('close-update-popup');

for (const openUpdPopup of openUpdPopups) {
    const updPopup = document.getElementById(openUpdPopup.getAttribute('data-id'));
    openUpdPopup.addEventListener('click', () => {
        updPopup.classList.remove('no-display');
        updPopup.classList.add('flex');
    });
}

for (const closeUpdPopup of closeUpdPopups) {
    const updPopup = document.getElementById(closeUpdPopup.getAttribute('data-id'));
    closeUpdPopup.addEventListener('click', () => {
        updPopup.classList.remove('flex');
        updPopup.classList.add('no-display');
    });
}

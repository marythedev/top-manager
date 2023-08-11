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
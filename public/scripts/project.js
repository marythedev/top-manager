const projectNameInput = document.getElementById('project-name');
const checkmark = document.getElementsByClassName('checkmark-icon')[0];
const updateProjectForm = document.getElementById('update-project');

checkmark.addEventListener('click', () => {
    updateProjectForm.submit();
});

projectNameInput.addEventListener('focus', () => {
    checkmark.classList.remove('no-display');
});

projectNameInput.addEventListener('blur', () => {
    setTimeout(() => {
        checkmark.classList.add('no-display');
    }, 100)
});
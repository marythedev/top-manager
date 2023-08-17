const openProjects = document.getElementsByClassName('open-project-page');

for (const openProject of openProjects) {
    const project_id = openProject.getAttribute('data-id');
    openProject.addEventListener('click', () => {
        window.location.href = `/projects/${project_id}`;
    });
}
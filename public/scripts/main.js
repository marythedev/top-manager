const noMultipleRedirect = (link) => {
    link.onclick = (event) => {
        event.preventDefault();
    }
}

const noMultipleSubmit = (form) => {
    const buttons = form.getElementsByTagName("button");
    for (const button of buttons)
        button.disabled = true;
    return true;
}
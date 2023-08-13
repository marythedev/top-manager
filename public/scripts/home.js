const previous = document.getElementById("previous-icon");
const next = document.getElementById("next-icon");

const carouselImages = document.getElementsByClassName("carousel-img");
const dots = document.getElementsByClassName("dot");

let currentIndex = 0;

next.addEventListener("click", () => {
    carouselImages[currentIndex].classList.remove("active");
    dots[currentIndex].classList.remove("active");

    currentIndex++;
    if (currentIndex >= carouselImages.length)
        currentIndex = 0;

    carouselImages[currentIndex].classList.add("active");
    dots[currentIndex].classList.add("active");
});

previous.addEventListener("click", () => {
    carouselImages[currentIndex].classList.remove("active");
    dots[currentIndex].classList.remove("active");

    currentIndex--;
    if (currentIndex <= -1)
        currentIndex = carouselImages.length - 1;

    carouselImages[currentIndex].classList.add("active");
    dots[currentIndex].classList.add("active");
});
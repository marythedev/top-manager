// Carousel logic
const track = document.querySelector('.carousel-track');
const cards = document.querySelectorAll('.testimonial-card');
let index = 0;
const totalCards = cards.length;
let autoSwipeInterval;

function updateCarousel() {
    if (index < 0)
        index = totalCards - 1;
    else if (index >= totalCards)
        index = 0;
    track.style.transform = `translateX(-${index * 100}%)`;
}

function startAutoSwipe() {
    autoSwipeInterval = setInterval(() => {
        index++;
        updateCarousel();
    }, 5000);
}

startAutoSwipe();

document.getElementById('current-year').textContent = new Date().getFullYear();

// Feature animation on scroll
const featureItems = document.querySelectorAll('.features li');

function revealFeatures() {
    const scrollY = window.scrollY + window.innerHeight;
    featureItems.forEach((item, i) => {
        if (item.offsetTop < scrollY - 50) {
            setTimeout(() => item.classList.add('visible'), i * 150);
        }
    });
}

window.addEventListener('scroll', revealFeatures);
window.addEventListener('load', revealFeatures);
const images = ["dinner.jpg", "indian-dish.jpg", "jollof-rice.jpg", "palestine-food.jpg", "rice-dish.jpg", "strogronoff.jpg", "indian-dish.jpg"]
const reviews = ['"This is the best recipe site ever! -Jane"', '"I finally learned how to cook!" -Sarah', '"Found my new favorite recipe on here." -Dave', '"Perfect for college students" -Fred', '"Love the variety of dishes!" -Molly', '"My go-to site for cooking inspiration." -Gregory', '"The fridge feature is so helpful!" -Penelope'];
const carousel = document.querySelector(".carousel");
// const reviewContainer = document.getElementById("review-container")
const reviewText = document.getElementById("review");

const interval = setInterval(function(){
    startCarousel();
}, 3000);
var index = 0;

startCarousel = () => {
    //update the image
    carousel.style.backgroundImage = `url(${images[index]})`;
    carousel.classList.remove("fade");
    void carousel.offsetWidth;
    carousel.classList.add("fade");

    //update the review text
    reviewText.textContent = reviews[index];
    reviewText.classList.remove("fade");
    void reviewText.offsetWidth;
    reviewText.classList.add("fade");

    index = (index + 1) % images.length; // Ensures index resets to 0 after reaching the end
};

    // //increment and loop index
    // if (index > images.length - 1)
    //     index = 0;

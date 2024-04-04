let Page1 = document.querySelector(".Page1");
let StartGame = document.querySelector(".StartBtn");
let snakeGameTitle = document.querySelector(".Page1 h1");
let playbtn = document.querySelector(".fa-play");
let originalText = snakeGameTitle.dataset.value;
let letters = ["𐩱", "𐩼", "𐩻", "𐩺", "𐩹", "𐩸", "𐩷", "𐩶", "𐩥", "𐩯", "𐩵", "𐩴", "𐩳", "𐩲", "𐩰", "𐩮", "𐩭", "𐩬", "𐩫", "𐩪", "𐩩", "𐩨", "𐩧", "𐩦", "𐩤", "𐩣", "𐩢", "𐩡", "ß", "œ", "Ħ", "Ł"];
let interval = null;
let currentIndex = 0;
// const audio = new Audio('./Audio/random letter reveal - sound effect.mp3');
// let AudioOFF=document.querySelector(".Page1 .fa-volume-xmark");
// let AudioON=document.querySelector(".Page1 .fa-volume-high");
// let isMuted = true // Initialize AudioStart to true by default



// Function to generate random text
function generateRandomNotoText(length) {
    let text = "";
    for (let i = 0; i < length; i++) {
        text += letters[Math.floor(Math.random() * letters.length)];
    }
    return text;
}

// Function to handle interval
function intervalFunction() {
    if (currentIndex < 40) {
        snakeGameTitle.innerText = generateRandomNotoText(originalText.length);
    } else if (currentIndex < originalText.length + 40) {
        let revealedText = originalText.slice(0, currentIndex - 40);
        let remainingSpaces = originalText.length - revealedText.length;
        let notoText = generateRandomNotoText(remainingSpaces);
        snakeGameTitle.innerText = revealedText + notoText;
    } else {
        clearInterval(interval);
        snakeGameTitle.innerText = originalText;
    }
    if (currentIndex === 40) {
        clearInterval(interval);
        interval = setInterval(intervalFunction, 150);
    }

    currentIndex++;
}

// Set up interval
interval = setInterval(intervalFunction, 100);

// Set timeout for class addition
setTimeout(() => {
    snakeGameTitle.classList.add("h1ColorWhite");
}, 7000);

// AudioON.addEventListener("click", () => {
//     audio.muted = true; // Mute the audio
//     AudioOFF.classList.remove("hidden");
//     AudioON.classList.add("hidden");
//     isMuted = true;
// });

// AudioOFF.addEventListener("click", () => {
//     audio.muted = false;
//     AudioOFF.classList.add("hidden");
//     AudioON.classList.remove("hidden");
//     isMuted = false;
// });

// document.addEventListener('DOMContentLoaded', function() {
//     audio.play(); // Play audio when the page content is loaded
// });


// Export variables if needed
export { Page1, StartGame, playbtn };

import { Page1, StartGame, playbtn } from "./Page1.js";
let Page2 = document.querySelector(".Page2");
let GameStartBtn=document.querySelector(".GameStartsBtn");
let closeBtn=document.querySelector(".CloseBtn");

// Level js variables
let Level = document.querySelector(".levels h1");
let LevelPlus = document.querySelector(".levels .fa-caret-right");
let LevelMinus = document.querySelector(".levels .fa-caret-left");
let LevelsCount = ["EASY", "MEDIUM", "HARD", "EXPERT"];
let CurrentLevel = 0;
let LevelName = LevelsCount[CurrentLevel];

// Colors js variables
let SnakeColorSet = document.querySelector(".colors h1");
let colorPlus = document.querySelector(".colors .fa-caret-right");
let colorMinus = document.querySelector(".colors .fa-caret-left");
let colorCount = ["red", "orange", "yellow", "chartreuse", "green", "springgreen", "cyan", "azure", "blue", "violet", "magenta", "pink", "grey", "white"];
let CurrentColor = 0;
let ColorName = colorCount[CurrentColor].toUpperCase();


StartGame.onclick = () => {
    Page1.classList.add("hidden")
    Page2.classList.remove("hidden")
}
playbtn.onclick = () => {
    Page1.classList.add("hidden")
    Page2.classList.remove("hidden")
}

closeBtn.onclick=()=>{
    window.close();
}

// Level Selection
LevelPlus.onclick = () => {
    if (CurrentLevel < LevelsCount.length - 1) {
        CurrentLevel += 1;
        Level.innerHTML = LevelsCount[CurrentLevel];
        LevelName = Level.innerHTML;
    } else {
        CurrentLevel = 0;
        Level.innerHTML = LevelsCount[CurrentLevel];
        LevelName = Level.innerHTML;
    }
}

LevelMinus.onclick = () => {
    if (CurrentLevel > 0) {
        CurrentLevel -= 1;
        Level.innerHTML = LevelsCount[CurrentLevel];
        LevelName = Level.innerHTML;
    } else {
        CurrentLevel = LevelsCount.length - 1;
        Level.innerHTML = LevelsCount[CurrentLevel];
        LevelName = Level.innerHTML;
    }
}

// Color Selection
colorPlus.onclick = () => {
    if (CurrentColor < colorCount.length - 1) {
        CurrentColor += 1;
        SnakeColorSet.innerHTML = colorCount[CurrentColor].toUpperCase();
        ColorName = SnakeColorSet.innerHTML;
    } else {
        CurrentColor = 0;
        SnakeColorSet.innerHTML = colorCount[CurrentColor].toUpperCase();
        ColorName = SnakeColorSet.innerHTML;
    }
}

colorMinus.onclick = () => {
    if (CurrentColor > 0) {
        CurrentColor -= 1;
        SnakeColorSet.innerHTML = colorCount[CurrentColor].toUpperCase();
        ColorName = SnakeColorSet.innerHTML;
    } else {
        CurrentColor = colorCount.length - 1;
        SnakeColorSet.innerHTML = colorCount[CurrentColor].toUpperCase();
        ColorName = SnakeColorSet.innerHTML;
    }
}

export { Page2, LevelName, ColorName ,GameStartBtn};
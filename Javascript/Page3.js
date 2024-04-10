import { Page2, LevelName, ColorName, GameStartBtn } from "./Page2.js";
import { Page1 } from "./Page1.js";

let LevelName_Page3;
let Page3 = document.querySelector(".Page3");
let canvas = document.querySelector("canvas");
let c = canvas.getContext("2d");
let snakeDirection = "right";
let dx = 5; // Initial speed and direction
let dy = 0;
let snakeSpeed = 5;
let snake = [];
let FoodPill;
let PowerPill;
let BodySize = 20; // Initial body size of the snake
let CurrentScore = 0;
let ScoreAdd = 1;
let HighScoreDiv = document.querySelector(".HighScore");
let CurrentScoreDiv = document.querySelector(".CurrentScore");
let isGamePaused = false;
let isGameEnd = false;
let wallCollisions = [];
let WallWidth = 10;
let WallLength;
let bombTimeout;
let BombPill = [];
let escapeBtn = document.querySelector(".GamePaused");
let ResumeBtn = document.querySelector(".GamePaused .ResumeBtn");
let AudioControlBtn = document.querySelector(".GamePaused .AudioControlBtn");
let MainMenuBtn = document.querySelector(".GamePaused .MainMenuBtn");
let scoreDisplay = document.querySelector(".DisplayFinalScore");
let GameEnd = document.querySelector(".GameEnd");
let ImageCircleDisplay = document.querySelector(".ImageCircle img");
let MainMenuBtn2=document.querySelector(".MainMenu2");
let RestartBtn=document.querySelector(".RestartBtn");

let GameEndingImage = [
    "./Images/Snake_Eaing_Bomb.jpg",
    "./Images/Snake_Eating_Itself.jpg",
    "./Images/Snake_Hitting_Wall.webp"
];

let LevelObject = {
    "EASY": 0,
    "MEDIUM": 0,
    "HARD": 0,
    "EXPERT": 0
}
window.localStorage.setItem("LevelHighScore", JSON.stringify(LevelObject));
let StoredDataScore = localStorage.getItem("LevelHighScore");
let LevelHighScore = StoredDataScore ? JSON.parse(StoredDataScore) : {};

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ResumeBtn.onclick = () => {
    escapeBtn.classList.add("hidden");
    isGamePaused = false;
    animate();
}

if (!StoredDataScore) {
    window.localStorage.setItem("LevelHighScore", JSON.stringify(LevelHighScore));
}

function resetCanvas() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    snakeDirection = "right";
    dx = 5;
    dy = 0;
    snakeSpeed = 5;
    snake = [];
    BodySize = 20;
    ScoreAdd = 1;
    CurrentScore = 0;
    isGamePaused = false;
    isGameEnd=false;
    wallCollisions = [];
    bombTimeout = null;
    FoodPill.x = randomIntFromRange(FoodPill.radius + 30, canvas.width - FoodPill.radius - 30);
    FoodPill.y = randomIntFromRange(FoodPill.radius + 30, canvas.height - FoodPill.radius - 30);
    PowerPill.x = randomIntFromRange(PowerPill.radius + 30, canvas.width - PowerPill.radius - 30);
    PowerPill.y = randomIntFromRange(PowerPill.radius + 30, canvas.height - PowerPill.radius - 30);

    snake.push(circle(canvas.width / 2, 100, "black"));
    for (let i = 1; i < BodySize; i++) {
        snake.push(circle(snake[i - 1].x, 100, ColorName)); // Use the color specified by ColorName
    }

    escapeBtn.classList.add("hidden");
    GameEnd.classList.add("hidden")
}

function GameEnding(img) {
    setTimeout(() => {
        GameEnd.classList.remove("hidden");
        ImageCircleDisplay.src = img;
        scoreDisplay.style.color = ColorName;
        scoreDisplay.innerHTML=CurrentScore;
    }, 500);
}

MainMenuBtn.onclick = () => {
    Page3.classList.add("hidden");
    Page2.classList.remove("hidden");
    LevelName_Page3 = "";

    resetCanvas();
};

MainMenuBtn2.onclick=()=>{
    Page3.classList.add("hidden");
    Page2.classList.remove("hidden");
    LevelName_Page3 = "";

    resetCanvas();
}

RestartBtn.onclick=()=>{
    resetCanvas();
    animate();
}

function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function circle(x, y, color) {
    let obj = {};
    obj.x = x;
    obj.y = y;
    obj.radius = 15; // Define the radius for the circle
    obj.color = color;
    obj.shadow = 0;

    obj.draw = () => {
        c.save();
        c.shadowColor = "#e3eaef";
        c.shadowBlur = obj.shadow;
        c.fillStyle = obj.color; // Set fill style before drawing
        c.beginPath();
        c.arc(obj.x, obj.y, obj.radius, 0, Math.PI * 2); // Draw a circle
        c.fill(); // Fill the circle
        c.closePath();
        c.restore();
    }

    obj.update = (prevX, prevY) => {
        obj.draw();
        let tempX = obj.x;
        let tempY = obj.y;
        obj.x = prevX;
        obj.y = prevY;
        prevX = tempX;
        prevY = tempY;
    }

    return obj;
}

function foodPill() {
    let obj = {};
    obj.radius = 15;
    obj.x = randomIntFromRange(obj.radius + 30, canvas.width - obj.radius - 30);
    obj.y = randomIntFromRange(obj.radius + 30, canvas.height - obj.radius - 30);

    obj.shadow = 10;
    obj.shadowDirection = 1;

    obj.draw = () => {
        c.save();
        c.shadowColor = "#e3eaef";
        c.shadowBlur = obj.shadow;
        c.fillStyle = "#00ffe6";
        c.beginPath();
        c.arc(obj.x, obj.y, obj.radius, 0, Math.PI * 2, false);
        c.fill();
        c.stroke();
        c.closePath();
        c.restore();
    }

    obj.update = () => {
        obj.draw();
        obj.shadow += obj.shadowDirection;
        if (obj.shadow === 30) {
            obj.shadowDirection = -1;
        } else if (obj.shadow === 10) {
            obj.shadowDirection = 1;
        }
    }

    return obj;
}
FoodPill = foodPill();

function powerPill() {
    let obj = {};
    obj.radius = 25;
    obj.x = randomIntFromRange(obj.radius + 30, canvas.width - obj.radius - 30);
    obj.y = randomIntFromRange(obj.radius + 30, canvas.height - obj.radius - 30);
    obj.shadow = 20;
    obj.shadowDirection = 1;

    obj.draw = () => {
        c.save();
        c.shadowColor = "#e3eaef";
        c.shadowBlur = obj.shadow;
        c.fillStyle = "red";
        c.beginPath();
        c.arc(obj.x, obj.y, obj.radius, 0, Math.PI * 2, false);
        c.fill();
        c.closePath();
        c.restore();

        c.fillStyle = "white";
        c.font = "bold 30px FontAwesome";
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.fillText("\uf0e7", obj.x, obj.y);

    }
    obj.update = () => {
        obj.draw();
        obj.shadow += obj.shadowDirection;
        if (obj.shadow === 30) {
            obj.shadowDirection = -1;
        } else if (obj.shadow === 10) {
            obj.shadowDirection = 1;
        }
    }
    return obj;
}
PowerPill = powerPill();

document.addEventListener("keydown", function (event) {
    const key = event.key;
    if (Page1.classList.contains("hidden") && Page2.classList.contains("hidden") && !isGameEnd) {
        if ((escapeBtn.classList.contains("hidden"))) {
            if ((key === "w" || key === "ArrowUp") && snakeDirection !== "down") {
                dx = 0;
                dy = -snakeSpeed;
                snakeDirection = "up";
            } else if ((key === "s" || key === "ArrowDown") && snakeDirection !== "up") {
                dx = 0;
                dy = snakeSpeed;
                snakeDirection = "down";
            } else if ((key === "a" || key === "ArrowLeft") && snakeDirection !== "right") {
                dx = -snakeSpeed;
                dy = 0;
                snakeDirection = "left";
            } else if ((key === "d" || key === "ArrowRight") && snakeDirection !== "left") {
                dx = snakeSpeed;
                dy = 0;
                snakeDirection = "right";
            }
        }
        if (key === "Escape") {
            escapeBtn.classList.toggle("hidden");
            if (isGamePaused) {
                isGamePaused = false;
                animate(); // Resume the game loop
            } else {
                isGamePaused = true;
            }
        }
    }
});

function LevelWalls(len) {
    let obj = {};
    c.fillStyle = "#ffffd7";
    obj.walls = () => {
        c.save();
        c.beginPath();
        // Top Left
        c.fillRect(0, 0, WallWidth, len);
        c.fillRect(0, 0, len, WallWidth);

        // Top Right
        c.fillRect(canvas.width, 0, -len, WallWidth);
        c.fillRect(canvas.width, 0, -WallWidth, len);

        // Bottom Left
        c.fillRect(0, canvas.height, WallWidth, -len);
        c.fillRect(0, canvas.height, len, -WallWidth);

        // Bottom Right
        c.fillRect(canvas.width, canvas.height, -WallWidth, -len);
        c.fillRect(canvas.width, canvas.height, -len, -WallWidth);

        c.closePath();
        c.restore();
    }

    obj.midWall = () => {
        c.beginPath();
        c.fillRect(canvas.width / 2, canvas.height / 2 - 150, 15, 300);
        c.fillRect(canvas.width / 2 - 150, canvas.height / 2, 300, 15);
        c.closePath();
    }

    return obj;
}

function bombPill() {
    let obj = {};
    obj.radius = 30;
    obj.x = randomIntFromRange(obj.radius + 30, canvas.width - obj.radius - 30);
    obj.y = randomIntFromRange(obj.radius + 30, canvas.height - obj.radius - 30);
    obj.shadow = 30;
    obj.shadowDirection = 1;

    obj.draw = () => {
        c.save();
        c.shadowBlur = obj.shadow;
        c.shadowColor = "red"
        c.fillStyle = "black";
        c.beginPath();
        c.arc(obj.x, obj.y, obj.radius, 0, Math.PI * 2, false);
        c.fill();
        c.closePath();
        c.restore();

        c.fillStyle = "white";
        c.font = "bold 40px FontAwesome";
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.fillText("\uf1e2", obj.x, obj.y);

    }
    obj.update = () => {
        obj.draw();
        obj.shadow += obj.shadowDirection;
        if (obj.shadow === 30) {
            obj.shadowDirection = -1;
        } else if (obj.shadow === 5) {
            obj.shadowDirection = 1;
        }
    }
    obj.resetPosition = () => {
        obj.x = randomIntFromRange(obj.radius + 30, canvas.width - obj.radius - 30);
        obj.y = randomIntFromRange(obj.radius + 30, canvas.height - obj.radius - 30);
    }
    return obj;
}

function checkCollision(x1, y1, x2, y2, radius1, radius2) {
    let distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    return distance < (radius1 + radius2);
}

function PowerPillEffect() {
    snakeSpeed *= 2;
    ScoreAdd *= 2;
    if (dx !== 0) {
        dx = Math.sign(dx) * 2 * snakeSpeed;
        dy = 0;
    } else if (dy !== 0) {
        dx = 0;
        dy = Math.sign(dy) * 2 * snakeSpeed;
    }
    snake.forEach((blur) => {
        blur.shadow = 60;
    })
    setTimeout(() => {
        snakeSpeed /= 2;
        ScoreAdd /= 2;
        if (dx !== 0) {
            dx = Math.sign(dx) * snakeSpeed;
            dy = 0;
        } else if (dy !== 0) {
            dx = 0;
            dy = Math.sign(dy) * snakeSpeed;
        }
        snake.forEach((blur) => {
            blur.shadow = 0;
        })
    }, 5000)
}

function DrawWalls(WallLength) {
    wallCollisions = [
        collisionDetectionRectangle(snake[0].x, snake[0].y, snake[0].radius, 0, 0, WallWidth, WallLength),
        collisionDetectionRectangle(snake[0].x, snake[0].y, snake[0].radius, 0, 0, WallLength, WallWidth),
        collisionDetectionRectangle(snake[0].x, snake[0].y, snake[0].radius, canvas.width, 0, -WallLength, WallWidth),
        collisionDetectionRectangle(snake[0].x, snake[0].y, snake[0].radius, canvas.width, 0, -WallWidth, WallLength),
        collisionDetectionRectangle(snake[0].x, snake[0].y, snake[0].radius, 0, canvas.height, WallWidth, -WallLength),
        collisionDetectionRectangle(snake[0].x, snake[0].y, snake[0].radius, 0, canvas.height, WallLength, -WallWidth),
        collisionDetectionRectangle(snake[0].x, snake[0].y, snake[0].radius, canvas.width, canvas.height, -WallWidth, -WallLength),
        collisionDetectionRectangle(snake[0].x, snake[0].y, snake[0].radius, canvas.width, canvas.height, -WallLength, -WallWidth)
    ];
}

function collisionDetectionRectangle(circleX, circleY, circleRadius, rectX, rectY, rectWidth, rectHeight) {
    // Check for collision with mid walls
    if (circleX + circleRadius > rectX && circleX - circleRadius < rectX + rectWidth &&
        circleY + circleRadius > rectY && circleY - circleRadius < rectY + rectHeight) {
        console.log("Mid-wall collision detected");
        return true;
    }

    // Perform regular collision detection for the outer walls
    let distX = Math.abs(circleX - (rectX + rectWidth / 2));
    let distY = Math.abs(circleY - (rectY + rectHeight / 2));

    if (distX > (Math.abs(rectWidth) / 2 + circleRadius)) {
        return false;
    }
    if (distY > (Math.abs(rectHeight) / 2 + circleRadius)) {
        return false;
    }

    return true;
}



BombPill = bombPill();

function animate() {
    if (!isGamePaused && !isGameEnd) {
        requestAnimationFrame(animate);
    }

    c.clearRect(0, 0, innerWidth, innerHeight);
    PowerPill.update();
    FoodPill.update();
    wallCollisions.length = 0;

    let prevX = snake[0].x;
    let prevY = snake[0].y;

    // Update the snake's head position
    snake[0].x += dx;
    snake[0].y += dy;

    // Check if the snake's head goes out of the screen
    if (snake[0].x >= canvas.width) {
        snake[0].x = 0; // Move to the left side of the screen
    } else if (snake[0].x < 0) {
        snake[0].x = canvas.width; // Move to the right side of the screen
    }
    if (snake[0].y >= canvas.height) {
        snake[0].y = 0; // Move to the top of the screen
    } else if (snake[0].y < 0) {
        snake[0].y = canvas.height; // Move to the bottom of the screen
    }

    // Check for collision with food
    if (checkCollision(snake[0].x, snake[0].y, FoodPill.x, FoodPill.y, snake[0].radius, FoodPill.radius)) {
        CurrentScore += ScoreAdd;
        BodySize += 10;
        FoodPill.x = randomIntFromRange(FoodPill.radius, canvas.width - FoodPill.radius);
        FoodPill.y = randomIntFromRange(FoodPill.radius, canvas.height - FoodPill.radius);
        // Update the snake array to reflect the new BodySize
        addSnakeSegment();
        StoreDataOfScore()
    }

    if (checkCollision(snake[0].x, snake[0].y, PowerPill.x, PowerPill.y, snake[0].radius, PowerPill.radius)) {
        PowerPill.x = -100;
        PowerPill.y = -100;
        PowerPillEffect();
        setTimeout(() => {
            PowerPill.x = randomIntFromRange(PowerPill.radius, canvas.width - PowerPill.radius);
            PowerPill.y = randomIntFromRange(PowerPill.radius, canvas.height - PowerPill.radius);
        }, 20000);
    }

    //Current score updation
    CurrentScoreDiv.innerHTML = `Score : ${CurrentScore}`;

    // Update the positions of the snake's body segments
    for (let i = 1; i < snake.length; i++) {
        let tempX = snake[i].x;
        let tempY = snake[i].y;
        snake[i].x = prevX;
        snake[i].y = prevY;
        prevX = tempX;
        prevY = tempY;
        snake[i].draw(); // Draw the segment
    }

    for (let i = 20; i < snake.length; i++) {
        if (checkCollision(snake[0].x, snake[0].y, snake[i].x, snake[i].y, snake[0].radius, snake[i].radius)) {
            isGameEnd = true
            GameEnding(GameEndingImage[1])
            break;
        }
    }

    if (LevelName_Page3 === "MEDIUM") {
        WallLength = 200;
        let mediumWall = LevelWalls(WallLength);
        mediumWall.walls();
        DrawWalls(WallLength);

    } else if (LevelName_Page3 === "HARD") {
        WallLength = canvas.width;
        let hardWall = LevelWalls(WallLength);
        hardWall.walls();
        DrawWalls(WallLength);
    }
    else if (LevelName_Page3 === "EXPERT") {
        BombPill.update();
        if (!bombTimeout) {
            bombTimeout = setTimeout(() => {
                BombPill.resetPosition(); // Reset position of the first bomb
                bombTimeout = null; // Reset the timeout variable
            }, randomIntFromRange(2000, 3000));
        }
        WallLength = canvas.width;
        let ExpertWall = LevelWalls(WallLength);
        ExpertWall.walls();
        ExpertWall.midWall();
        if (collisionDetectionRectangle(snake[0].x, snake[0].y, snake[0].radius, canvas.width / 2, canvas.height / 2 - 150, 15, 300) || (collisionDetectionRectangle(snake[0].x, snake[0].y, snake[0].radius, canvas.width / 2 - 150, canvas.height / 2, 300, 15))) {
            isGameEnd = true;
            GameEnding(GameEndingImage[2])
        }
        DrawWalls(WallLength);
        if (checkCollision(snake[0].x, snake[0].y, BombPill.x, BombPill.y, snake[0].radius, BombPill.radius)) {
            isGameEnd = true;
            GameEnding(GameEndingImage[0])
        }
    }
    if (wallCollisions.some(collision => collision)) {
        isGameEnd = true;
        GameEnding(GameEndingImage[2])
    }

    // Redraw the snake's head after updating its position
    snake[0].draw();
}



GameStartBtn.onclick = () => {
    Page2.classList.add("hidden");
    Page3.classList.remove("hidden");
    snake = []; // Reset the snake array
    snake.push(circle(canvas.width / 2, 100, "black"));
    for (let i = 1; i < BodySize; i++) {
        snake.push(circle(snake[i - 1].x, 100, ColorName)); // Use blue color for all segments
    }
    if (!isGamePaused) {
        animate(); // Start the animation loop only if the game is not paused
    }
    LevelName_Page3 = LevelName
};
for (let i = 1; i < BodySize; i++) {
    snake.push(circle(snake[i-1].x, canvas.height / 2, ColorName));
}

// window.onload = () => {
//     snake = []; // Reset the snake array
//     snake.push(circle(canvas.width / 2, 100, "black"));
//     for (let i = 1; i < BodySize; i++) {
//         snake.push(circle(snake[i - 1].x, 100, ColorName)); // Use blue color for all segments
//     }
//     if (!isGamePaused) {
//         animate(); // Start the animation loop only if the game is not paused
//     }
//     LevelName_Page3 = "EXPERT"
// }

function StoreDataOfScore() {
    console.log("LevelName:", LevelName);
    console.log("CurrentScore:", CurrentScore);
    if (LevelName === "EASY") {
        LevelHighScore.EASY += 1;
    } else if (LevelName === "MEDIUM") {
        LevelHighScore.MEDIUM = Math.max(LevelHighScore.MEDIUM || 0, CurrentScore);
    } else if (LevelName === "HARD") {
        LevelHighScore.HARD = Math.max(LevelHighScore.HARD || 0, CurrentScore);
    } else {
        LevelHighScore.EXPERT = Math.max(LevelHighScore.EXPERT || 0, CurrentScore);
    }
}

function addSnakeSegment() {
    for (let i = 0; i < 10; i++) {
        // Increase the spacing between segments by adding a fixed distance to the x coordinate of the last segment
        let newSegment = circle(snake[snake.length - 1].x, snake[snake.length - 1].y, ColorName);
        snake.push(newSegment);
    }
}

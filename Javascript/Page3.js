import { Page2, LevelName, ColorName, GameStartBtn } from "./Page2.js";

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
let StoredDataScore = localStorage.getItem("LevelHighScore", JSON.stringify());
let LevelHighScore = JSON.parse(StoredDataScore);

// LevelHighScore.EASY=10;

// window.localStorage.setItem("LevelHighScore", JSON.stringify(LevelHighScore));

// let updatedStoredDataScore = window.localStorage.getItem("LevelHighScore");

// let updatedLevelHighScore = JSON.parse(updatedStoredDataScore);

// let updatedEasyScore = updatedLevelHighScore.EASY;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
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
    obj.x = randomIntFromRange(obj.radius, canvas.width - obj.radius);
    obj.y = randomIntFromRange(obj.radius, canvas.height - obj.radius);
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
    obj.x = randomIntFromRange(obj.radius, canvas.width - obj.radius);
    obj.y = randomIntFromRange(obj.radius, canvas.height - obj.radius);
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
});


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
function animate() {
    if (!isGamePaused) {
        requestAnimationFrame(animate);
    }
    c.clearRect(0, 0, innerWidth, innerHeight);
    PowerPill.update();
    FoodPill.update();

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
        if (LevelName === "EASY") {
            LevelHighScore.EASY += 10
            StoreDataOfScore()
        } else if (LevelName === "MEDIUM") {
            LevelHighScore.MEDIUM = 10
            StoreDataOfScore()
        } else if (LevelName === "HARD") {
            LevelHighScore.HARD = 10
            StoreDataOfScore()
        } else {
            LevelHighScore.EXPERT = 10
            StoreDataOfScore()
        }
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
            isGamePaused = true;
            break;
        }
    }

    // Redraw the snake's head after updating its position
    snake[0].draw();
}

GameStartBtn.onclick = () => {
    Page2.classList.add("hidden");
    Page3.classList.remove("hidden");
    snake = []; // Reset the snake array
    snake.push(circle(canvas.width / 2, canvas.height / 2, "black"));
    for (let i = 1; i < BodySize; i++) {
        snake.push(circle(snake[i - 1].x, canvas.height / 2, ColorName)); // Use blue color for all segments
    }
    if (!isGamePaused) {
        animate(); // Start the animation loop only if the game is not paused
    }
};

function StoreDataOfScore() {
    window.localStorage.setItem("LevelHighScore", JSON.stringify(LevelHighScore));
}



// Remove it after full coding
window.onload = () => {
    snake = []; // Reset the snake array
    snake.push(circle(canvas.width / 2, canvas.height / 2, "black"));
    for (let i = 1; i < BodySize; i++) {
        snake.push(circle(snake[i - 1].x, canvas.height / 2, ColorName)); // Use blue color for all segments
    }
    if (!isGamePaused) {
        animate(); // Start the animation loop only if the game is not paused
    }
}

//Comment for begning:-
// for (let i = 1; i < BodySize; i++) {
//     snake.push(circle(snake[i-1].x, canvas.height / 2, ColorName));
// }








function addSnakeSegment() {
    for (let i = 0; i < 10; i++) {
        // Increase the spacing between segments by adding a fixed distance to the x coordinate of the last segment
        let newSegment = circle(snake[snake.length - 1].x + 30, snake[snake.length - 1].y, ColorName);
        snake.push(newSegment);
    }
    BodySize += 10;
}
addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Update snake positions
    snake.forEach((segment, index) => {
        segment.x = (canvas.width / 2) + (index * segment.radius * 2);
        segment.y = canvas.height / 2;
    });
});

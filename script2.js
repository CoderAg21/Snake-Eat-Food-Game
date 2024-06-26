
// global scope
let moveAudio = new Audio("move.mp3");

let playAudio = new Audio("music.mp3");
let gameOverAudio = new Audio("over.mp3");
let eatAudio = new Audio("food.mp3");
let howtostart = document.querySelector(".howtostart")
playAudio.volume = .9;
let gameContainer = document.querySelector(".container");
let liveScore = document.querySelector(".liveScore");
let xDiff = 0;
let yDiff = 0
let foodElement;
let isSwiped = true;
let speed = 12;
let score = 0;
let collide = false;
let lastPaintTime = 0
let startFirstTime = true;
let isright = true
let istop = true
let isleft = true
let isodwn = true
let ekey = {
    key: "noKey"
}
let foodDir = {
    x: 13,
    y: 11,
}

let inputDir = {
    x: 0,
    y: 0,
}

let snakeArray = [
    {
        x: 5,
        y: 11,
    }

]




// export code from online to detect the swipe direction...
document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);

let xDown = null;
let yDown = null;

function getTouches(evt) {
    return evt.touches ||             // browser API
        evt.originalEvent.touches; // jQuery
}

function handleTouchStart(evt) {
    const firstTouch = getTouches(evt)[0];
    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;
};

function handleTouchMove(evt) {
    if (!xDown || !yDown) {
        return;
    }

    var xUp = evt.touches[0].clientX;
    var yUp = evt.touches[0].clientY;

    xDiff = xDown - xUp;
    yDiff = yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {/*most significant*/
        if (xDiff > 0) {
            /* left swipe */
            arrowSwipeLeft();


        } else {
            arrowSwipeRight();
            /* right swipe */


        }
    } else {
        if (yDiff > 0) {
            arrowSwipeUp();
            /* up swipe */

        } else {
            arrowSwipeDown();

            /* down swipe */
        }
    }
    /* reset values */
    xDown = null;
    yDown = null;

};



function arrowSwipeLeft() {

    inputDir.x = -1;
    // console.log('left')
    inputDir.y = 0;
    moveAudio.play();
    isright = false
    istop = true
    isleft = true
    isodwn = true
}

function arrowSwipeRight() {

    inputDir.x = 1;
    inputDir.y = 0;
    // console.log('right')
    moveAudio.play();
    isleft = false
    isright = true
    istop = true
    isodwn = true
}
function arrowSwipeUp() {

    inputDir.y = -1;
    inputDir.x = 0;
    moveAudio.play()
    isright = true
    // console.log('top')
    isodwn = false
    istop = true
    isleft = true
}

function arrowSwipeDown() {
    inputDir.y = 1
    inputDir.x = 0;
    moveAudio.play()
    istop = false;
    isright = true
    // console.log('down')
    isleft = true
    isodwn = true

}

function anyKeySwipeToStart() {
    inputDir = { x: 1, y: 0 };
    playAudio = new Audio("music.mp3");
    playAudio.play();
    moveAudio.play()
    howtostart.style.display = 'none';
    startFirstTime = false;
    isSwiped = false;

}





// Engine of the game..
const gameEngine = () => {
    gameContainer.innerHTML = "";
    liveScore.innerText = score;
    snakeArray.forEach((e, inddex) => {
        // logic fof head and body of the snake
        let snakeElement = document.createElement("div");
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        if (inddex === 0) {
            snakeElement.classList.add("head");
            //console.log(e.x,e.y)
            //console.log("lol")

        }
        else {
            snakeElement.classList.add("snakeBody");
        }
        gameContainer.append(snakeElement)
    });

    // calling food in random direction and if the snake eat the food, then expanding its body..
    foodElement = document.createElement("div");
    foodElement.classList.add("food");
    gameContainer.appendChild(foodElement)
    foodElement.style.gridColumnStart = foodDir.x;
    foodElement.style.gridRowStart = foodDir.y;
    if (snakeArray[0].x === foodDir.x && snakeArray[0].y === foodDir.y) {
        snakeArray.push({ x: snakeArray[0].x + inputDir.x, y: snakeArray[0].y + inputDir.y })
        score++;
        eatAudio.play();
        let a = (Number.parseInt(18 * Math.random()) + 1);
        let b = (Number.parseInt(18 * Math.random()) + 1);
        snakeArray.forEach((e) => {
            console.log(e.x != a && e.y != b)
            if (e.x != a && e.y != b) {
                foodDir = { x: b, y: a }
                foodElement.style.gridColumnStart = foodDir.x;
                foodElement.style.gridRowStart = foodDir.y;
            }
            else {
                return;
            }


        })

    }

    // listening keyboard events

    window.addEventListener('keydown', (e) => {

        if (startFirstTime || isSwiped) {
            anyKeySwipeToStart()
        }

        if ((e.key == "ArrowLeft") && isleft == true) {
            arrowSwipeLeft();
        }

        else if ((e.key == "ArrowRight") && isright == true) {
            arrowSwipeRight();
        }
        else if ((e.key == "ArrowUp") && istop == true) {
            arrowSwipeUp()

        }
        else if ((e.key == "ArrowDown") && isodwn == true) {
            arrowSwipeDown();

        }

    })




    // collide  with its body
    snakeArray.forEach((e, index) => {

        if ((snakeArray[0].x === e.x && snakeArray[0].y === e.y) && index != 0) {
            collide = true;

        }
    })



    const isCollide = (snakarr) => {
        if (snakarr[0].x == 21 || snakarr[0].y === 21 || snakarr[0].x === 0 || snakarr[0].y === 0) {
            return true;
        }
        else {
            return false;
        }

    }


    //gameOver logic
    if (isCollide(snakeArray) || collide) {
        playAudio.pause();
        gameOverAudio.play();
        alert("Your Game Is Over..");
        foodDir = { x: 15, y: 11 }
        inputDir = { x: 0, y: 0, }
        snakeArray = [{ x: 5, y: 11, }]
        score = 0;
        howtostart.style.display = 'block';
        [isright, isleft, istop, isodwn] = [true, true, true, true,];
        startFirstTime = true;
        collide = false
        isSwiped = true;

    }

}


// engine to move the snake in a particular direction
const gameEngine2 = () => {
    //move the snake in direction

    for (let i = snakeArray.length - 2; i >= 0; i--) {
        snakeArray[i + 1] = { ...snakeArray[i] }

    }
    snakeArray[0].x += inputDir.x
    snakeArray[0].y += inputDir.y
    //console.log(snakeArray)

}



//main logic starts here..(to create the loop of fps or paint the screen  in every after 0.5 sec)
const main = (ctime) => {
    //console.log(ctime)
    window.requestAnimationFrame(main)
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {

        gameEngine()
        return;
    }
    gameEngine2();
    lastPaintTime = ctime;

}


window.requestAnimationFrame(main)
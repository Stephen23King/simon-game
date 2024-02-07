var buttonColors = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern = [];
var started = false;
var level = 0;
var gameOver = false;
var waitingForRestart = false;
var topScores = [];

if (localStorage.getItem("topScores")) {
    topScores = JSON.parse(localStorage.getItem("topScores"));
}

$(document).ready(function() {
    updateTopScoresDisplay();
});

$(document).keydown(function() {
    if (!started) {
        $("#level-title").text("Level " + level);
        nextSequence();
        started = true;
    } else if (gameOver) {
        restartGame();
    }
});

$(document).keyup(function() {
    if (gameOver && waitingForRestart) {
        waitingForRestart = false;
    }
});

$(".btn").click(function() {
    if (!started || gameOver || waitingForRestart) {
        return;
    }

    var userChosenColour = $(this).attr("id");
    userClickedPattern.push(userChosenColour);
    playSound(userChosenColour);
    animatePress(userChosenColour);
    checkAnswer(userClickedPattern.length - 1);
});

function nextSequence() {
    if (gameOver) {
        return false;
    }

    userClickedPattern = [];
    level++;
    $("#level-title").text("Level " + level);
    var randomNumber = Math.floor(Math.random() * 4);
    var randomChosenColor = buttonColors[randomNumber];
    gamePattern.push(randomChosenColor);

    $("#" + randomChosenColor).fadeIn(100).fadeOut(100).fadeIn(100);
    playSound(randomChosenColor);
}

function playSound(randomColor) {
    var audio = new Audio("sounds/" + randomColor + ".mp3");
    audio.play();
}

function animatePress(currentColor) {
    $("#" + currentColor).addClass("pressed");
    setTimeout(function() {
        $("#" + currentColor).removeClass("pressed");
    }, 100);
}

function checkAnswer(currentLevel) {
    if (userClickedPattern[currentLevel] === gamePattern[currentLevel]) {
        console.log("success");
        if (userClickedPattern.length === gamePattern.length) {
            setTimeout(function() {
                nextSequence();
            }, 1000);
        }
    }
    else {
        console.log("game over");
        gameOver = true;
        gameOverScreen();
    }
}

function gameOverScreen() {
    playSound("wrong");
    $("body").addClass("game-over");
    setTimeout(function() {
        $("body").removeClass("game-over");
    }, 200);
    $("#level-title").html("Game Over: Level " + (level) + "<br>Press Any Key TWICE to Restart.");

    // Update top scores if applicable
    if (topScores.length < 3 || level > topScores[2]) {
        topScores.push(level);
        topScores.sort((a, b) => b - a); // Sort in descending order
        topScores = topScores.slice(0, 3); // Keep only the top 3 scores
        localStorage.setItem("topScores", JSON.stringify(topScores));
        updateTopScoresDisplay();
    }
}

function restartGame() {
    started = false;
    gameOver = false;
    level = 0;
    gamePattern = [];
}

function updateTopScoresDisplay() {
    $("#top-scores").empty();
    for (var i = 0; i < topScores.length; i++) {
        $("#top-scores").append("<div>Score #" + (i + 1) + ": Level " + topScores[i] + "</div>");
    }
}



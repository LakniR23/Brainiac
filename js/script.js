const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");

// Variables to track progress
let currentQuestionIndex = 0;
let score = 0;

function saveCompletionState() {
    // Save quiz state and score in localStorage
    localStorage.setItem("quizCompleted", "true");
    localStorage.setItem("quizScore", score);
    localStorage.setItem("currentQuestionIndex", currentQuestionIndex);
}

function clearCompletionState() {
    // Clear saved state when "Home" is pressed
    localStorage.removeItem("quizCompleted");
    localStorage.removeItem("quizScore");
    localStorage.removeItem("currentQuestionIndex");
}

function checkCompletionState() {
    // Check if the quiz was previously completed
    return localStorage.getItem("quizCompleted") === "true";
}

function getSavedScore() {
    // Retrieve the saved score from localStorage
    const savedScore = localStorage.getItem("quizScore");
    return savedScore ? parseInt(savedScore, 10) : 0;
}

function getSavedQuestionIndex() {
    // Retrieve the saved question index from localStorage
    const savedIndex = localStorage.getItem("currentQuestionIndex");
    return savedIndex ? parseInt(savedIndex, 10) : 0;
}

function saveQuizState() {
    // Save the current question and score to localStorage
    localStorage.setItem("currentQuestionIndex", currentQuestionIndex);
    localStorage.setItem("quizScore", score);
}

function loadQuizState() {
    // Load the quiz state if saved
    currentQuestionIndex = getSavedQuestionIndex();
    score = getSavedScore();
}

function startQuiz() {
    // Reset quiz state and clear any completion flags
    clearCompletionState();
    currentQuestionIndex = 0;
    score = 0; // Reset the score
    nextButton.innerHTML = "Next";
    nextButton.style.display = "none";
    nextButton.onclick = handleNextButton; // Reset to handle next question
    showQuestion();
}

function showQuestion() {
    resetState();
    let currentQuestion = questions[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

    currentQuestion.answers.forEach((answer) => {
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add("btn");
        answerButtons.appendChild(button);
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener("click", selectAnswer);
    });

    // Save the current quiz state
    saveQuizState();
}

function resetState() {
    nextButton.style.display = "none"; // Hide Next button
    while (answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild);
    }
}

function selectAnswer(e) {
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";
    if (isCorrect) {
        selectedBtn.classList.add("correct");
        score++;
    } else {
        selectedBtn.classList.add("incorrect");
    }

    // Disable all buttons and highlight the correct answer
    Array.from(answerButtons.children).forEach((button) => {
        if (button.dataset.correct === "true") {
            button.classList.add("correct");
        }
        button.disabled = true;
    });

    nextButton.style.display = "block"; // Show next button
}

function showScore() {
    resetState();

    if (checkCompletionState()) {
        score = getSavedScore(); // Retrieve the saved score
    }

    questionElement.innerHTML = `Your score ${score} out of ${questions.length}!`;

    // Create "Take quiz again!" button
    nextButton.innerHTML = "Take quiz again!";
    nextButton.style.display = "block";
    nextButton.onclick = startQuiz;

    // Create "Home" button
    const homeButton = document.createElement("button");
    homeButton.innerHTML = "Home";
    homeButton.classList.add("btn", "home-btn");

    homeButton.addEventListener("click", () => {
        clearCompletionState();
        window.location.href = "index.html"; // Redirect to home page
    });

    answerButtons.appendChild(homeButton);

    // Save the completion state after showing the score
    saveCompletionState();
}

function handleNextButton() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showScore();
    }
}

nextButton.onclick = handleNextButton;

// Handle page refresh
if (checkCompletionState()) {
    loadQuizState();
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showScore();
    }
} else {
    startQuiz();
}

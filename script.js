const minutesDisplay = document.getElementById("minutes");
const secondsDisplay = document.getElementById("seconds");
const startBtn = document.getElementById("start-btn");
const taskButtons = document.querySelectorAll(".task-btn");
const quizModal = document.getElementById("quiz-modal");
const quizBtn = document.getElementById("quiz-btn");
const closeQuizBtn = document.getElementById("close-quiz");
const submitQuizBtn = document.getElementById("submit-quiz");
const quizResult = document.getElementById("quiz-result");
const bgColorPicker = document.getElementById("bg-color-picker");
const soundSelector = document.getElementById("sound-selector");
const confettiCanvas = document.getElementById("confetti-canvas");
const settingsBtn = document.getElementById("settings-btn");
const settingsPanel = document.getElementById("settings-panel");
const closeSettingsBtn = document.getElementById("close-settings");
const quizQuestionsContainer = document.getElementById("quiz-questions");

let countdown;
let sessionTime = 25;
let sound = new Audio();

// 🕰️ Start Timer Logic
function startTimer(duration) {
    clearInterval(countdown);
    let timeLeft = duration * 60;

    countdown = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;

        minutesDisplay.textContent = String(minutes).padStart(2, "0");
        secondsDisplay.textContent = String(seconds).padStart(2, "0");

        if (timeLeft <= 0) {
            clearInterval(countdown);
            triggerConfetti();
            sound.play();
            alert("Time's up! Great job!");
        }

        timeLeft--;
    }, 1000);
}

startBtn.addEventListener("click", () => startTimer(sessionTime));

taskButtons.forEach(button => {
    button.addEventListener("click", () => {
        sessionTime = button.getAttribute("data-time");
        startTimer(sessionTime);
    });
});

// 🎯 Quiz Logic
const quizQuestions = [
    {
        question: "How long do you want to focus?",
        options: ["15 min", "30 min", "45 min", "60 min"],
        value: [15, 30, 45, 60]
    },
    {
        question: "What kind of work are you doing?",
        options: ["Creative", "Memorization", "Quick Tasks", "Deep Focus"],
        value: ["creative", "memorization", "quick", "deep"]
    }
];

// Load quiz questions dynamically
function loadQuizQuestions() {
    quizQuestionsContainer.innerHTML = "";
    quizQuestions.forEach((q, index) => {
        const questionEl = document.createElement("div");
        questionEl.innerHTML = `
            <p>${q.question}</p>
            <div>
                ${q.options.map((option, i) => `
                    <label>
                        <input type="radio" name="q${index}" value="${q.value[i]}">
                        ${option}
                    </label>
                `).join('')}
            </div>
        `;
        quizQuestionsContainer.appendChild(questionEl);
    });
}

// Show recommendation after quiz submission
submitQuizBtn.addEventListener("click", () => {
    const answers = quizQuestions.map((q, index) => {
        const selectedOption = document.querySelector(`input[name="q${index}"]:checked`);
        return selectedOption ? selectedOption.value : null;
    });

    if (answers.includes(null)) {
        alert("Please answer all the questions!");
        return;
    }

    // Process answers for recommendation
    const focusTime = parseInt(answers[0]);
    const workType = answers[1];

    let recommendation = "";
    if (workType === "creative") {
        recommendation = `Try a ${focusTime}-minute creative focus session! 🎨`;
    } else if (workType === "memorization") {
        recommendation = `Use a ${focusTime}-minute memorization session for better retention! 📚`;
    } else if (workType === "quick") {
        recommendation = `Boost productivity with a ${focusTime}-minute quick task sprint! ⚡`;
    } else if (workType === "deep") {
        recommendation = `Deep focus for ${focusTime} minutes will help you master complex tasks! 🎯`;
    }

    // Display recommendation with fade-in
    quizResult.textContent = recommendation;
    quizResult.classList.remove("hidden");
    quizResult.style.opacity = 0;
    setTimeout(() => {
        quizResult.style.opacity = 1;
    }, 100);

    // Optionally set the timer automatically
    sessionTime = focusTime;
});

// 🎉 Confetti Effect
function triggerConfetti() {
    confettiCanvas.classList.add("active");
    setTimeout(() => {
        confettiCanvas.classList.remove("active");
    }, 3000);
}

// 🌈 Background Color Picker
bgColorPicker.addEventListener("input", (e) => {
    document.body.style.backgroundColor = e.target.value;
});

// 🎧 Sound Selector
soundSelector.addEventListener("change", (e) => {
    switch (e.target.value) {
        case 'rain':
            sound.src = 'rain.mp3';
            break;
        case 'lofi':
            sound.src = 'lofi.mp3';
            break;
        case 'forest':
            sound.src = 'forest.mp3';
            break;
        default:
            sound.pause();
            sound.src = '';
    }
});

// ✅ Fix for Settings Panel 🛠️
settingsBtn.addEventListener("click", () => {
    // Toggle settings panel visibility
    settingsPanel.classList.toggle("show");
});

//Open Settings Panel when clicked
//settingsBtn.addEventListener("click", () => {
    //settingsPanel.classList.toggle("show");
//});

//Close Settings Panel when "close" button is clicked
closeSettingsBtn.addEventListener("click", () => {
    settingsPanel.classList.remove("show");
});

// Make sure settings panel is not hidden behind other elements
settingsPanel.style.zIndex = "1000";
settingsBtn.style.zIndex = "1001"; // Ensure button stays above other elements

// 📊 Open/Close Quiz Modal
quizBtn.addEventListener("click", () => {
    quizModal.classList.remove("hidden");
    loadQuizQuestions(); // Load questions when opening
});

closeQuizBtn.addEventListener("click", () => {
    quizModal.classList.add("hidden");
});

// ✅ Load quiz questions on page load
loadQuizQuestions();
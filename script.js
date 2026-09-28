const loadingArea = document.querySelector(".loading_area");
const progressArea = document.getElementById("progress_area");
const questionContainer = document.getElementById("question_container");
const submitButton = document.getElementById("submit");

const resultSection = document.getElementById("result");
const scoreElement = document.getElementById("score");
const percentageElement = document.getElementById("percentage");
const feedbackElement = document.getElementById("question_feedback");
const restartButton = document.getElementById("restart");


const API_URL = "https://opentdb.com/api.php?amount=10&type=multiple";

let questions = [];
let score = 0;


resultSection.style.display = "none";


function loadQuiz() {

    loadingArea.style.display = "block";
    questionContainer.innerHTML = "";
    resultSection.style.display = "none";
    score = 0;

    fetch(API_URL)
        .then(function(response) {

            if (!response.ok) {
                throw new Error("Failed to fetch questions");
            }

            return response.json();
        })

        .then(function(data) {

            questions = data.results;

            loadingArea.style.display = "none";

            displayQuestions();

            updateProgress();
        })

        .catch(function(error) {

            loadingArea.innerHTML = "<p>Unable to load the quiz. Please try again.</p>";

            console.log(error);
        });
}



function displayQuestions() {

    questionContainer.innerHTML = "";

    questions.forEach(function(question, index) {

        const questionCard = document.createElement("div");
        questionCard.className = "question-card";

        const questionText = document.createElement("h3");

        questionText.textContent =
            (index + 1) + ". " + decodeHTML(question.question);

        questionCard.appendChild(questionText);


        const options = [
            question.correct_answer,
            ...question.incorrect_answers
        ];


        options.sort(function() {
            return Math.random() - 0.5;
        });


        const optionsContainer = document.createElement("div");
        optionsContainer.className = "options";


        // Create the four options

        options.forEach(function(option) {

            const label = document.createElement("label");

            const input = document.createElement("input");

            input.type = "radio";

            input.name = "question-" + index;

            input.value = option;

            label.appendChild(input);

            label.appendChild(
                document.createTextNode(" " + decodeHTML(option))
            );

            optionsContainer.appendChild(label);

            optionsContainer.appendChild(
                document.createElement("br")
            );



            input.addEventListener("change", updateProgress);
        });


        questionCard.appendChild(optionsContainer);


        const feedback = document.createElement("p");

        feedback.className = "question-feedback";

        questionCard.appendChild(feedback);


        questionContainer.appendChild(questionCard);
    });
}



function updateProgress() {

    const answeredQuestions =
        document.querySelectorAll(
            'input[type="radio"]:checked'
        ).length;

    progressArea.innerHTML =
        "<p>" + answeredQuestions + "/" +
        questions.length + " Answered</p>";
}

// 7. Submit quiz

submitButton.addEventListener("click", function() {

    score = 0;

    const questionCards =
        document.querySelectorAll(".question-card");

    questionCards.forEach(function(card, index) {

        const selectedAnswer =
            card.querySelector(
                'input[type="radio"]:checked'
            );

        const feedback =
            card.querySelector(".question-feedback");


        if (!selectedAnswer) {

            feedback.textContent = "Not answered";
            feedback.style.color = "orange";

            return;
        }


        const correctAnswer =
            decodeHTML(questions[index].correct_answer);

        const userAnswer =
            decodeHTML(selectedAnswer.value);


        if (userAnswer === correctAnswer) {

            score++;

            feedback.textContent = "Correct!";
            feedback.style.color = "green";

        } else {

            feedback.textContent =
                "Incorrect. Correct answer: " +
                correctAnswer;

            feedback.style.color = "red";
        }
    });


    // Calculate percentage

    const percentage =
        (score / questions.length) * 100;


    // Display result

    scoreElement.textContent =
        "Score: " + score + "/" + questions.length;

    percentageElement.textContent =
        "Percentage: " + percentage + "%";

    feedbackElement.textContent =
        "You answered " +
        score +
        " out of " +
        questions.length +
        " questions correctly.";


    resultSection.style.display = "block";

    resultSection.scrollIntoView({
        behavior: "smooth"
    });
});

// 8. Restart quiz

restartButton.addEventListener("click", function() {

    loadQuiz();
});

// 9. Decode API text

function decodeHTML(text) {

    const textarea = document.createElement("textarea");

    textarea.innerHTML = text;

    return textarea.value;
}


// 10. Start the quiz

loadQuiz();

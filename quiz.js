
let selectedLanguage = "";

let currentQuestion = 0;

let score = 0;

let selectedAnswer = null;


const questions = {

    C: [

        {
            question: "Which symbol is used to end a statement in C?",
            answers: [
                ";",
                ":",
                ".",
                ","
            ],
            correct: 0
        },

        {
            question: "Which function is used to print output in C?",
            answers: [
                "print()",
                "printf()",
                "display()",
                "cout"
            ],
            correct: 1
        },

        {
            question: "Which header file is commonly used for printf()?",
            answers: [
                "stdlib.h",
                "string.h",
                "stdio.h",
                "math.h"
            ],
            correct: 2
        },

        {
            question: "Which data type is used to store a single character?",
            answers: [
                "int",
                "char",
                "float",
                "double"
            ],
            correct: 1
        },

        {
            question: "Which operator is used to get the address of a variable?",
            answers: [
                "*",
                "&",
                "#",
                "@"
            ],
            correct: 1
        }

    ],


    Java: [

        {
            question: "Which keyword is used to create a class in Java?",
            answers: [
                "class",
                "struct",
                "object",
                "define"
            ],
            correct: 0
        },

        {
            question: "Which method is the entry point of a Java program?",
            answers: [
                "start()",
                "run()",
                "main()",
                "execute()"
            ],
            correct: 2
        },

        {
            question: "Which keyword is used for inheritance in Java?",
            answers: [
                "inherits",
                "extends",
                "implements",
                "super"
            ],
            correct: 1
        },

        {
            question: "Which data type stores true or false?",
            answers: [
                "boolean",
                "bool",
                "logical",
                "bit"
            ],
            correct: 0
        },

        {
            question: "Which symbol is used to create an object?",
            answers: [
                "new",
                "create",
                "object",
                "make"
            ],
            correct: 0
        }

    ],


    Python: [

        {
            question: "Which keyword is used to define a function in Python?",
            answers: [
                "function",
                "define",
                "def",
                "fun"
            ],
            correct: 2
        },

        {
            question: "Which function is used to display output?",
            answers: [
                "echo()",
                "print()",
                "display()",
                "write()"
            ],
            correct: 1
        },

        {
            question: "Which symbol is used for comments in Python?",
            answers: [
                "//",
                "/*",
                "#",
                "--"
            ],
            correct: 2
        },

        {
            question: "Which data structure stores key-value pairs?",
            answers: [
                "List",
                "Tuple",
                "Dictionary",
                "Set"
            ],
            correct: 2
        },

        {
            question: "Which keyword is used to create a loop over a sequence?",
            answers: [
                "loop",
                "for",
                "repeat",
                "iterate"
            ],
            correct: 1
        }

    ],


    JavaScript: [

        {
            question: "Which keyword can be used to declare a variable?",
            answers: [
                "var",
                "variable",
                "int",
                "define"
            ],
            correct: 0
        },

        {
            question: "Which function displays a message in the browser console?",
            answers: [
                "print()",
                "console.log()",
                "display()",
                "write()"
            ],
            correct: 1
        },

        {
            question: "Which symbol is used for a single-line comment?",
            answers: [
                "#",
                "//",
                "<!--",
                "**"
            ],
            correct: 1
        },

        {
            question: "Which keyword declares a constant?",
            answers: [
                "constant",
                "fixed",
                "const",
                "static"
            ],
            correct: 2
        },

        {
            question: "Which method adds an item to the end of an array?",
            answers: [
                "add()",
                "push()",
                "insert()",
                "append()"
            ],
            correct: 1
        }

    ]

};



/* ================= LANGUAGE SELECTION ================= */

function selectLanguage(language) {

    selectedLanguage = language;


    const buttons =
        document.querySelectorAll(".language-options button");


    buttons.forEach(button => {

        button.classList.remove("selected");

        if (button.textContent.trim() === language) {

            button.classList.add("selected");

        }

    });


    document.getElementById("start-button").disabled = false;

}



/* ================= START QUIZ ================= */

function startQuiz() {

    if (selectedLanguage === "") {

        return;

    }


    currentQuestion = 0;

    score = 0;


    document
        .getElementById("start-screen")
        .classList.add("hidden");


    document
        .getElementById("result-screen")
        .classList.add("hidden");


    document
        .getElementById("quiz-screen")
        .classList.remove("hidden");


    document.getElementById("language-name").textContent =
        selectedLanguage;


    showQuestion();

}



/* ================= SHOW QUESTION ================= */

function showQuestion() {

    const questionList =
        questions[selectedLanguage];


    const question =
        questionList[currentQuestion];


    selectedAnswer = null;


    document.getElementById("question").textContent =
        question.question;


    document.getElementById("question-number").textContent =
        `Question ${currentQuestion + 1} / ${questionList.length}`;


    const progress =
        ((currentQuestion) / questionList.length) * 100;


    document.getElementById("progress").style.width =
        progress + "%";


    const answersContainer =
        document.getElementById("answers");


    answersContainer.innerHTML = "";


    question.answers.forEach((answer, index) => {

        const button =
            document.createElement("button");


        button.className = "answer";

        button.textContent = answer;


        button.onclick = function() {

            selectAnswer(index, button);

        };


        answersContainer.appendChild(button);

    });


    document.getElementById("next-button").disabled = true;

}



/* ================= SELECT ANSWER ================= */

function selectAnswer(index, button) {

    selectedAnswer = index;


    const buttons =
        document.querySelectorAll(".answer");


    buttons.forEach(btn => {

        btn.classList.remove("selected");

    });


    button.classList.add("selected");


    document.getElementById("next-button").disabled = false;

}



/* ================= NEXT QUESTION ================= */

function nextQuestion() {

    if (selectedAnswer === null) {

        return;

    }


    const question =
        questions[selectedLanguage][currentQuestion];


    if (selectedAnswer === question.correct) {

        score++;

    }


    currentQuestion++;


    if (
        currentQuestion <
        questions[selectedLanguage].length
    ) {

        showQuestion();

    }

    else {

        showResult();

    }

}



/* ================= RESULT ================= */

function showResult() {

    document
        .getElementById("quiz-screen")
        .classList.add("hidden");


    document
        .getElementById("result-screen")
        .classList.remove("hidden");


    const total =
        questions[selectedLanguage].length;


    document.getElementById("score").textContent =
        `${score} / ${total}`;


    let message = "";


    if (score === total) {

        message =
            "Excellent! You know your stuff! 🚀";

    }

    else if (score >= 3) {

        message =
            "Great job! Keep practicing! 💪";

    }

    else {

        message =
            "Keep learning and try again! 📚";

    }


    document.getElementById("result-message").textContent =
        message;

}



/* ================= RESTART ================= */

function restartQuiz() {

    selectedLanguage = "";

    currentQuestion = 0;

    score = 0;


    document
        .getElementById("result-screen")
        .classList.add("hidden");


    document
        .getElementById("start-screen")
        .classList.remove("hidden");


    document.getElementById("start-button").disabled = true;


    document
        .querySelectorAll(".language-options button")
        .forEach(button => {

            button.classList.remove("selected");

        });

}
let timeLeft = 30;
let score = 0;
let timer;
let currentQuestion;

function startGame() {
    score = 0;
    timeLeft = 30;
    document.getElementById('points').innerText = score;
    document.getElementById('time').innerText = timeLeft;
    generateQuestion();
    timer = setInterval(updateTimer, 1000);
}

function updateTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        document.getElementById('time').innerText = timeLeft;
    } else {
        clearInterval(timer);
        alert('时间到！您的得分是：' + score);
    }
}

function generateQuestion() {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operators = ['+', '-', '*', '/'];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    currentQuestion = { num1, num2, operator };
    let questionText;

    switch (operator) {
        case '+':
            questionText = `${num1} + ${num2}`;
            currentQuestion.answer = num1 + num2;
            break;
        case '-':
            questionText = `${num1} - ${num2}`;
            currentQuestion.answer = num1 - num2;
            break;
        case '*':
            questionText = `${num1} * ${num2}`;
            currentQuestion.answer = num1 * num2;
            break;
        case '/':
            questionText = `${num1} / ${num2}`;
            currentQuestion.answer = parseFloat((num1 / num2).toFixed(2));
            break;
    }

    document.getElementById('question').innerText = questionText;
}

function checkAnswer() {
    const userAnswer = parseFloat(document.getElementById('answer').value);
    if (userAnswer === currentQuestion.answer) {
        score++;
        document.getElementById('points').innerText = score;
    }
    document.getElementById('answer').value = '';
    generateQuestion();
}

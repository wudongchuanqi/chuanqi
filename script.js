let timeLeft = 30;
let score = 0;
let timer;
let currentQuestion;
let mode = 'selection';
let history = [];

document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('startButton').addEventListener('click', startGame);
    document.getElementById('nextButton').addEventListener('click', nextQuestion);
    document.getElementById('clearHistoryButton').addEventListener('click', clearHistory);
});

function startGame() {
    score = 0;
    timeLeft = 30;
    document.getElementById('points').innerText = score;
    document.getElementById('time').innerText = timeLeft;
    mode = document.getElementById('mode').value; // 获取选择的模式
    generateQuestion();
    timer = setInterval(updateTimer, 1000);
    document.getElementById('game').style.display = 'block';
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

    if (mode === 'selection') {
        document.getElementById('options').innerHTML = '';

        const correctOption = document.createElement('button');
        correctOption.innerText = currentQuestion.answer;
        correctOption.className = 'option-btn';
        correctOption.addEventListener('click', () => checkAnswer(true));
        document.getElementById('options').appendChild(correctOption);

        for (let i = 0; i < 2; i++) {
            const wrongOption = document.createElement('button');
            let wrongAnswer;
            do {
                wrongAnswer = Math.floor(Math.random() * 20) - 10;
            } while (wrongAnswer === currentQuestion.answer);

            wrongOption.innerText = wrongAnswer;
            wrongOption.className = 'option-btn';
            wrongOption.addEventListener('click', () => checkAnswer(false));
            document.getElementById('options').appendChild(wrongOption);
        }

        // Randomize the order of options
        for (let i = document.getElementById('options').children.length; i >= 0; i--) {
            document.getElementById('options').appendChild(document.getElementById('options').children[Math.random() * i | 0]);
        }
    } else if (mode === 'answer') {
        document.getElementById('options').innerHTML = '';

        const correctOption = document.createElement('button');
        correctOption.innerText = '?';
        correctOption.className = 'option-btn';
        correctOption.addEventListener('mouseover', () => revealAnswer(correctOption));
        correctOption.addEventListener('mouseout', () => hideAnswer(correctOption));
        correctOption.addEventListener('click', () => checkAnswer(true));
        document.getElementById('options').appendChild(correctOption);
    }
}

function revealAnswer(button) {
    button.innerText = currentQuestion.answer;
}

function hideAnswer(button) {
    button.innerText = '?';
}

function checkAnswer(isCorrect) {
    if (isCorrect) {
        score++;
        document.getElementById('points').innerText = score;
    }
    generateQuestion();
}

function nextQuestion() {
    generateQuestion();
}

function clearHistory() {
    history = [];
    alert('历史记录已清除');
}

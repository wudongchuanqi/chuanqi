let timeLeft = 30;
let score = 0;
let timer;
let currentQuestion;
let correctAnswer;
let mode = 'selection';

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
        document.getElementById('options').innerHTML = `
            <input type="text" id="answer" placeholder="输入答案">
            <button onclick="checkAnswer()">提交</button>
        `;
    }
}

function checkAnswer(isCorrect) {
    if (mode === 'selection') {
        if (isCorrect) {
            score++;
            document.getElementById('points').innerText = score;
        }
    } else if (mode === 'answer') {
        const userAnswer = parseFloat(document.getElementById('answer').value);
        if (userAnswer === currentQuestion.answer) {
            score++;
            document.getElementById('points').innerText = score;
        }
        document.getElementById('answer').value = '';
    }
    generateQuestion();
}

function nextQuestion() {
    generateQuestion();
}

function clearHistory() {
    // Clear history logic (to be implemented)
    alert('历史记录已清除');
}

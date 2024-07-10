let timeLeft;
let score;
let timer;
let currentQuestion;
let questions;
let correctAnswers;
let gameMode;
let history = [];

function startGame() {
    score = 0;
    timeLeft = parseInt(document.getElementById('timePerQuestion').value) * parseInt(document.getElementById('numQuestions').value);
    correctAnswers = 0;
    gameMode = document.getElementById('mode').value;
    document.getElementById('points').innerText = score;
    document.getElementById('time').innerText = timeLeft;
    questions = [];
    for (let i = 0; i < parseInt(document.getElementById('numQuestions').value); i++) {
        questions.push(generateQuestion());
    }
    document.getElementById('game').style.display = 'block';
    timer = setInterval(updateTimer, 1000);
    nextQuestion();
}

function updateTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        document.getElementById('time').innerText = timeLeft;
    } else {
        endGame();
    }
}

function generateQuestion() {
    const num1 = Math.floor(Math.random() * parseInt(document.getElementById('range').value)) + 1;
    const num2 = Math.floor(Math.random() * parseInt(document.getElementById('range').value)) + 1;
    const operators = ['+', '-', '*', '/'];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    let questionText;
    let answer;

    switch (operator) {
        case '+':
            questionText = `${num1} + ${num2}`;
            answer = num1 + num2;
            break;
        case '-':
            questionText = `${num1} - ${num2}`;
            answer = num1 - num2;
            break;
        case '*':
            questionText = `${num1} * ${num2}`;
            answer = num1 * num2;
            break;
        case '/':
            questionText = `${num1} / ${num2}`;
            answer = parseFloat((num1 / num2).toFixed(2));
            break;
    }

    return { questionText, answer };
}

function nextQuestion() {
    if (questions.length === 0) {
        endGame();
        return;
    }
    currentQuestion = questions.shift();
    document.getElementById('question').innerText = currentQuestion.questionText;
    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';

    if (gameMode === 'selection') {
        const options = generateOptions(currentQuestion.answer);
        options.forEach(option => {
            const button = document.createElement('button');
            button.innerText = option;
            button.onclick = () => checkAnswer(option);
            button.onmouseover = () => button.style.color = '#FF5722';
            button.onmouseout = () => button.style.color = '#000';
            optionsDiv.appendChild(button);
        });
    } else {
        const answerInput = document.createElement('input');
        answerInput.type = 'number';
        answerInput.id = 'answer';
        optionsDiv.appendChild(answerInput);
        const submitButton = document.createElement('button');
        submitButton.innerText = '提交';
        submitButton.onclick = () => checkAnswer(parseFloat(answerInput.value));
        optionsDiv.appendChild(submitButton);
    }
}

function checkAnswer(answer) {
    if (answer === currentQuestion.answer) {
        score++;
        correctAnswers++;
    }
    document.getElementById('points').innerText = score;
    nextQuestion();
}

function endGame() {
    clearInterval(timer);
    const correctRate = (correctAnswers / parseInt(document.getElementById('numQuestions').value)) * 100;
    const totalScore = (correctRate / 100) * 100;
    let message = `游戏结束！\n你的得分是：${totalScore.toFixed(2)}分，正确率为：${correctRate.toFixed(2)}%`;
    if (totalScore === 100) {
        const compliments = ['太棒了！', '非常好！', '你真是天才！'];
        const randomCompliment = compliments[Math.floor(Math.random() * compliments.length)];
        message += ` ${randomCompliment}`;
    }
    alert(message);
    history.push({ score: totalScore.toFixed(2), correctRate: correctRate.toFixed(2) });
    updateHistory();
}

function generateOptions(correctAnswer) {
    const options = new Set();
    options.add(correctAnswer);
    while (options.size < 4) {
        options.add(Math.floor(Math.random() * 20) + 1);
    }
    return [...options];
}

function updateHistory() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';
    history.forEach(record => {
        const li = document.createElement('li');
        li.innerText = `得分：${record.score}，正确率：${record.correctRate}%`;
        historyList.appendChild(li);
    });
    document.getElementById('history').style.display = 'block';
}

function clearHistory() {
    history = [];
    updateHistory();
}

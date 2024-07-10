let timeLeft;
let score = 0;
let timer;
let currentQuestion;
let correctAnswers = 0;
let history = [];

function startGame() {
    document.getElementById('mainContainer').style.display = 'none';
    document.getElementById('gameContainer').style.display = 'block';

    score = 0;
    correctAnswers = 0;
    timeLeft = parseInt(document.getElementById('timePerQuestion').value);
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
        checkAnswer(false);
    }
}

function generateQuestion() {
    const num1 = Math.floor(Math.random() * parseInt(document.getElementById('range').value)) + 1;
    const num2 = Math.floor(Math.random() * parseInt(document.getElementById('range').value)) + 1;
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

    const options = [];
    while (options.length < 4) {
        const randomOption = (Math.random() * (num1 + num2 * 2)).toFixed(2);
        if (!options.includes(randomOption)) {
            options.push(randomOption);
        }
    }
    if (!options.includes(currentQuestion.answer.toString())) {
        options[Math.floor(Math.random() * 4)] = currentQuestion.answer.toString();
    }

    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';
    options.forEach(option => {
        const button = document.createElement('button');
        button.innerText = option;
        button.onclick = () => checkAnswer(option);
        optionsContainer.appendChild(button);
    });
}

function checkAnswer(userAnswer) {
    clearInterval(timer);

    if (userAnswer === currentQuestion.answer.toString()) {
        score++;
        correctAnswers++;
    }

    document.getElementById('points').innerText = score;

    const numQuestions = parseInt(document.getElementById('numQuestions').value);
    if (correctAnswers < numQuestions) {
        generateQuestion();
        timeLeft = parseInt(document.getElementById('timePerQuestion').value);
        timer = setInterval(updateTimer, 1000);
    } else {
        endGame();
    }
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

    document.getElementById('mainContainer').style.display = 'block';
    document.getElementById('gameContainer').style.display = 'none';
}

function updateHistory() {
    console.log('历史记录:', history);
}

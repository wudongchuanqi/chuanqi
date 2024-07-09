let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timePerQuestion;
let mode; 

// 历史统计数据
let history = JSON.parse(localStorage.getItem('history')) || [];

function startGame() {
    const operation = document.getElementById('operation').value;
    const range = parseInt(document.getElementById('range').value);
    const resultRange = parseInt(document.getElementById('resultRange').value);
    const numQuestions = parseInt(document.getElementById('numQuestions').value);
    timePerQuestion = parseInt(document.getElementById('timePerQuestion').value);
    const allowDecimals = document.getElementById('allowDecimals').checked;
    const allowNegative = document.getElementById('allowNegative').checked;
    mode = document.getElementById('mode').value;

    questions = generateQuestions(operation, range, resultRange, numQuestions, allowDecimals, allowNegative);
    currentQuestionIndex = 0;
    score = 0;

    document.getElementById('settingsForm').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    showQuestion();
}

function showQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    document.getElementById('question').innerText = currentQuestion.question;
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';

    if (mode === 'selection') {
        currentQuestion.options.forEach(option => {
            const button = document.createElement('button');
            button.innerText = option;
            button.onclick = () => checkAnswer(option);
            optionsContainer.appendChild(button);
        });
    } else if (mode === 'answer') {
        const input = document.createElement('input');
        input.type = 'text';
        input.id = 'userAnswer';
        optionsContainer.appendChild(input);
        const button = document.createElement('button');
        button.innerText = '提交';
        button.onclick = () => checkAnswer(input.value);
        optionsContainer.appendChild(button);
    }

    document.getElementById('feedback').innerText = '';
    startTimer();
}

function startTimer() {
    let timeLeft = timePerQuestion;
    document.getElementById('time').innerText = timeLeft;

    timer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            document.getElementById('time').innerText = timeLeft;
        } else {
            checkAnswer(null); 
        }
    }, 1000);
}

function checkAnswer(selectedOption) {
    clearInterval(timer);

    const currentQuestion = questions[currentQuestionIndex];
    const feedback = document.getElementById('feedback');

    if (selectedOption == currentQuestion.answer) {
        score++;
        feedback.innerText = '正确!';
        feedback.style.color = 'green';
    } else {
        feedback.innerText = `错误! 正确答案是: ${currentQuestion.answer}`;
        feedback.style.color = 'red';
    }

    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        setTimeout(showQuestion, 2000); 
    } else {
        setTimeout(endGame, 2000); 
    }
}

function endGame() {
    document.getElementById('game').style.display = 'none';
    const scorePercentage = (score / questions.length) * 100;
    const finalScore = Math.round(scorePercentage);
    const result = document.createElement('div');
    let encouragement = '';

    if (finalScore === 100) {
        const messages = ['太棒了!', '优秀!', '满分，继续努力!'];
        encouragement = messages[Math.floor(Math.random() * messages.length)];
    }

    result.innerHTML = `<h2>游戏结束!</h2><p>你的得分是: ${finalScore}分，正确率为: ${scorePercentage.toFixed(2)}%</p><p>${encouragement}</p>`;
    document.body.appendChild(result);

    history.push({ date: new Date().toLocaleString(), score: finalScore, accuracy: scorePercentage.toFixed(2) });
    localStorage.setItem('history', JSON.stringify(history));

    displayHistory();
}

function generateQuestions(operation, range, resultRange, numQuestions, allowDecimals, allowNegative) {
    const questions = [];
    for (let i = 0; i < numQuestions; i++) {
        let question, answer;
        let num1, num2;

        do {
            num1 = Math.floor(Math.random() * (range + 1));
            num2 = Math.floor(Math.random() * (range + 1));
            switch (operation) {
                case 'addition':
                    question = `${num1} + ${num2}`;
                    answer = num1 + num2;
                    break;
                case 'subtraction':
                    question = `${num1} - ${num2}`;
                    answer = num1 - num2;
                    break;
                case 'multiplication':
                    question = `${num1} × ${num2}`;
                    answer = num1 * num2;
                    break;
                case 'division':
                    num2 = num2 === 0 ? 1 : num2;
                    question = `${num1} ÷ ${num2}`;
                    answer = allowDecimals ? parseFloat((num1 / num2).toFixed(2)) : Math.floor(num1 / num2);
                    break;
                case 'mixed':
                    const ops = ['+', '-', '×', '÷'];
                    const op = ops[Math.floor(Math.random() * ops.length)];
                    switch (op) {
                        case '+':
                            question = `${num1} + ${num2}`;
                            answer = num1 + num2;
                            break;
                        case '-':
                            question = `${num1} - ${num2}`;
                            answer = num1 - num2;
                            break;
                        case '×':
                            question = `${num1} × ${num2}`;
                            answer = num1 * num2;
                            break;
                        case '÷':
                            num2 = num2 === 0 ? 1 : num2;
                            question = `${num1} ÷ ${num2}`;
                            answer = allowDecimals ? parseFloat((num1 / num2).toFixed(2)) : Math.floor(num1 / num2);
                            break;
                    }
                    break;
            }
        } while ((!allowNegative && answer < 0) || answer > resultRange);

        const options = generateOptions(answer, resultRange, allowDecimals);
        questions.push({ question, answer, options });
    }
    return questions;
}

function generateOptions(correctAnswer, range, allowDecimals) {
    const options = [correctAnswer];
    while (options.length < 3) {
        let option;
        if (allowDecimals) {
            option = parseFloat((Math.random() * range).toFixed(2));
        } else {
            option = Math.floor(Math.random() * (range + 1));
        }
        if (!options.includes(option)) {
            options.push(option);
        }
    }
    return options.sort(() => Math.random() - 0.5);
}

function displayHistory() {
    const historyContainer = document.getElementById('history');
    historyContainer.innerHTML = '<h3>历史记录</h3>';

    if (history.length === 0) {
        historyContainer.innerHTML += '<p>暂无记录</p>';
    } else {
        const table = document.createElement('table');
        table.innerHTML = '<tr><th>日期</th><th>得分</th><th>正确率</th></tr>';
        history.forEach(record => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${record.date}</td><td>${record.score}</td><td>${record.accuracy}%</td>`;
            table.appendChild(row);
        });
        historyContainer.appendChild(table);
    }
}

function clearHistory() {
    localStorage.removeItem('history');
    history = [];
    displayHistory();
}

document.addEventListener('DOMContentLoaded', () => {
    displayHistory();
});

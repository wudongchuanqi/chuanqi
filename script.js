let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timePerQuestion;
let mode; // 增加模式变量

function startGame() {
    const operation = document.getElementById('operation').value;
    const range = parseInt(document.getElementById('range').value);
    const resultRange = parseInt(document.getElementById('resultRange').value);
    const numQuestions = parseInt(document.getElementById('numQuestions').value);
    timePerQuestion = parseInt(document.getElementById('timePerQuestion').value);
    const allowDecimals = document.getElementById('allowDecimals').checked;
    const allowNegative = document.getElementById('allowNegative').checked;
    mode = document.getElementById('mode').value; // 获取模式值

    questions = generateQuestions(operation, range, resultRange, numQuestions, allowDecimals, allowNegative);
    currentQuestionIndex = 0;
    score = 0;

    document.getElementById('settingsPage').style.display = 'none';
    document.getElementById('gamePage').style.display = 'block';
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
        const button = document.createElement('button');
        button.innerText = '?'; // 初始显示为问号
        button.onclick = () => checkAnswer(currentQuestion.answer);
        button.onmouseover = () => button.innerText = currentQuestion.answer; // 鼠标悬停显示答案
        button.onmouseleave = () => button.innerText = '?'; // 鼠标移开显示问号
        button.ontouchstart = () => button.innerText = currentQuestion.answer; // 手机端触摸显示答案
        button.ontouchend = () => button.innerText = '?'; // 手机端触摸结束显示问号
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
            checkAnswer(null); // Times up, no answer selected
        }
    }, 1000);
}

function checkAnswer(selectedOption) {
    clearInterval(timer);

    const currentQuestion = questions[currentQuestionIndex];
    const feedback = document.getElementById('feedback');

    if (selectedOption === currentQuestion.answer) {
        score++;
        feedback.innerText = '正确!';
        feedback.style.color = 'green';
    } else {
        feedback.innerText = `错误! 正确答案是: ${currentQuestion.answer}`;
        feedback.style.color = 'red';
    }

    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        setTimeout(showQuestion, 2000); // Show next question after 2 seconds
    } else {
        setTimeout(endGame, 2000); // End game after 2 seconds
    }
}
function endGame() {
    document.getElementById('gamePage').style.display = 'none';

    const totalQuestions = questions.length;
    const accuracy = ((score / totalQuestions) * 100).toFixed(2);
    const totalScore = (score / totalQuestions * 100).toFixed(2);

    let resultText = `你的得分是：${totalScore}分，正确率为${accuracy}%`;
    if (totalScore === '100.00') {
        const compliments = ['干得漂亮！', '太棒了！', '你真是个天才！', '完美！'];
        const randomCompliment = compliments[Math.floor(Math.random() * compliments.length)];
        resultText += `<br>${randomCompliment}`;
    }

    const result = document.createElement('div');
    result.innerHTML = `<h2>游戏结束!</h2><p>${resultText}</p>`;
    document.body.appendChild(result);

    // 记录历史得分
    const history = JSON.parse(localStorage.getItem('history')) || [];
    history.push({ score: totalScore, accuracy: accuracy });
    localStorage.setItem('history', JSON.stringify(history));

    // 更新历史记录展示
    updateHistory();
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
                    num2 = num2 === 0 ? 1 : num2; // Avoid division by zero
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
                            num2 = num2 === 0 ? 1 : num2; // Avoid division by zero
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

function updateHistory() {
    const history = JSON.parse(localStorage.getItem('history')) || [];
    const historyContainer = document.getElementById('history');
    historyContainer.innerHTML = '<h3>历史得分</h3>';
    history.forEach((entry, index) => {
        const entryDiv = document.createElement('div');
        entryDiv.innerText = `第${index + 1}次: 得分${entry.score}分, 正确率${entry.accuracy}%`;
        historyContainer.appendChild(entryDiv);
    });
}

function clearHistory() {
    localStorage.removeItem('history');
    updateHistory();
}


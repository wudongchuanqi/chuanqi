let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timePerQuestion;
let mode;

// 历史统计数据
let history = JSON.parse(localStorage.getItem('history')) || [];

// 开始游戏函数
function startGame() {
    // 获取用户设置的参数
    const operation = document.getElementById('operation').value;
    const range = parseInt(document.getElementById('range').value);
    const resultRange = parseInt(document.getElementById('resultRange').value);
    const numQuestions = parseInt(document.getElementById('numQuestions').value);
    timePerQuestion = parseInt(document.getElementById('timePerQuestion').value);
    const allowDecimals = document.getElementById('allowDecimals').checked;
    const allowNegative = document.getElementById('allowNegative').checked;
    mode = document.getElementById('mode').value;

    // 生成问题集
    questions = generateQuestions(operation, range, resultRange, numQuestions, allowDecimals, allowNegative);
    currentQuestionIndex = 0;
    score = 0;

    // 隐藏设置表单，显示游戏界面
    document.getElementById('settingsForm').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    showQuestion(); // 显示第一个问题
}

// 显示当前问题函数
function showQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    document.getElementById('question').innerText = currentQuestion.question;
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';

    // 根据选择的模式生成相应的选项或输入框
    if (mode === 'selection') {
        currentQuestion.options.forEach(option => {
            const button = document.createElement('button');
            button.innerText = option;
            button.className = 'option-button'; // 添加类名
            button.onclick = () => checkAnswer(option);
            optionsContainer.appendChild(button);
        });
    } else if (mode === 'answer') {
        // 移除输入框，显示默认问号按钮
        const button = document.createElement('button');
        button.innerText = '?';
        button.className = 'answer-button'; // 添加类名
        button.onclick = () => checkAnswer(currentQuestion.answer);
        optionsContainer.appendChild(button);
    }

    document.getElementById('feedback').innerText = '';
    startTimer(); // 启动计时器
}

// 启动计时器函数
function startTimer() {
    let timeLeft = timePerQuestion;
    document.getElementById('time').innerText = timeLeft;

    timer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            document.getElementById('time').innerText = timeLeft;
        } else {
            checkAnswer(null); // 时间到，提交空答案
        }
    }, 1000);
}

// 检查答案函数
function checkAnswer(selectedOption) {
    clearInterval(timer); // 停止计时器

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
        setTimeout(showQuestion, 2000); // 显示下一个问题
    } else {
        setTimeout(endGame, 2000); // 游戏结束
    }
}

// 游戏结束函数
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

    // 记录历史数据
    history.push({ date: new Date().toLocaleString(), score: finalScore, accuracy: scorePercentage.toFixed(2) });
    localStorage.setItem('history', JSON.stringify(history));

    displayHistory(); // 显示历史记录
}

// 生成问题集函数
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

// 生成选项函数
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

// 显示历史记录函数
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

// 清除历史记录函数
function clearHistory() {
    localStorage.removeItem('history');
    history = [];
    displayHistory();
}

// 页面加载完成后显示历史记录
document.addEventListener('DOMContentLoaded', () => {
    displayHistory();
});

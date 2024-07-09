let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timePerQuestion;

function startGame() {
    const operation = document.getElementById('operation').value;
    const range = parseInt(document.getElementById('range').value);
    const resultRange = parseInt(document.getElementById('resultRange').value);
    const numQuestions = parseInt(document.getElementById('numQuestions').value);
    timePerQuestion = parseInt(document.getElementById('timePerQuestion').value);
    const allowDecimals = document.getElementById('allowDecimals').checked;
    const allowNegative = document.getElementById('allowNegative').checked;
    const mode = document.querySelector('input[name="mode"]:checked').value;

    questions = generateQuestions(operation, range, resultRange, numQuestions, allowDecimals, allowNegative);
    currentQuestionIndex = 0;
    score = 0;

    document.getElementById('settingsForm').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    showQuestion(mode);
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
function showQuestion(mode) {
    const currentQuestion = questions[currentQuestionIndex];
    document.getElementById('question').innerText = currentQuestion.question;
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';

    if (mode === 'select') {
        currentQuestion.options.forEach(option => {
            const button = document.createElement('button');
            button.innerText = option;
            button.onclick = () => checkAnswer(option, mode);
            optionsContainer.appendChild(button);
        });
    } else {
        const input = document.createElement('input');
        input.type = 'number';
        input.id = 'userAnswer';
        optionsContainer.appendChild(input);

        const submitButton = document.createElement('button');
        submitButton.innerText = '提交答案';
        submitButton.onclick = () => checkAnswer(parseFloat(input.value), mode);
        optionsContainer.appendChild(submitButton);
    }

    document.getElementById('feedback').innerText = '';
    document.getElementById('time').innerText = `时间: ${timePerQuestion}秒`;

    timer = setInterval(() => {
        timePerQuestion--;
        document.getElementById('time').innerText = `时间: ${timePerQuestion}秒`;
        if (timePerQuestion <= 0) {
            clearInterval(timer);
            checkAnswer(null, mode);
        }
    }, 1000);
}

function checkAnswer(userAnswer, mode) {
    clearInterval(timer);
    const currentQuestion = questions[currentQuestionIndex];

    if (userAnswer === currentQuestion.answer) {
        score++;
        document.getElementById('feedback').innerText = '正确！';
        document.getElementById('feedback').style.color = 'green';
    } else {
        document.getElementById('feedback').innerText = `错误！正确答案是 ${currentQuestion.answer}`;
        document.getElementById('feedback').style.color = 'red';
    }

    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        timePerQuestion = parseInt(document.getElementById('timePerQuestion').value);
        setTimeout(() => showQuestion(mode), 1000);
    } else {
        showResults();
    }
}

function showResults() {
    const totalQuestions = questions.length;
    const correctAnswers = score;
    const accuracy = ((correctAnswers / totalQuestions) * 100).toFixed(2);

    document.getElementById('game').innerHTML = `
        <h2>游戏结束！</h2>
        <p>你答对了 ${correctAnswers} 题，共 ${totalQuestions} 题。</p>
        <p>正确率：${accuracy}%</p>
        <button onclick="location.reload()">再来一次</button>
    `;
}

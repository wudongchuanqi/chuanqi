let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timePerQuestion;
let mode; // 增加模式变量

function startGame() {
    const operationElement = document.getElementById('operation');
    const rangeElement = document.getElementById('range');
    const resultRangeElement = document.getElementById('resultRange');
    const numQuestionsElement = document.getElementById('numQuestions');
    const timePerQuestionElement = document.getElementById('timePerQuestion');
    const allowDecimalsElement = document.getElementById('allowDecimals');
    const allowNegativeElement = document.getElementById('allowNegative');
    const modeElement = document.querySelector('input[name="mode"]:checked');

    if (!operationElement || !rangeElement || !resultRangeElement || !numQuestionsElement || !timePerQuestionElement || !allowDecimalsElement || !allowNegativeElement || !modeElement) {
        console.error('One or more elements are missing');
        return;
    }

    const operation = operationElement.value;
    const range = parseInt(rangeElement.value);
    const resultRange = parseInt(resultRangeElement.value);
    const numQuestions = parseInt(numQuestionsElement.value);
    timePerQuestion = parseInt(timePerQuestionElement.value);
    const allowDecimals = allowDecimalsElement.checked;
    const allowNegative = allowNegativeElement.checked;
    mode = modeElement.value;

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
        const button = document.createElement('button');
        button.innerText = currentQuestion.answer; // 只显示正确答案
        button.onclick = () => checkAnswer(currentQuestion.answer);
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
            checkAnswer(null); // 时间到，没有选择答案
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
        setTimeout(showQuestion, 2000); // 2秒后显示下一个问题
    } else {
        setTimeout(endGame, 2000); // 2秒后结束游戏
    }
}

function endGame() {
    document.getElementById('game').style.display = 'none';
    const result = document.createElement('div');
    result.innerHTML = `<h2>游戏结束!</h2><p>你的得分是: ${score}/${questions.length}</p>`;
    document.body.appendChild(result);
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
                    num2 = num2 === 0 ? 1 : num2; // 避免除以0
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
                            num2 = num2 === 0 ? 1 : num2; // 避免除以0
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

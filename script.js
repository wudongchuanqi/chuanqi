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
    
    questions = generateQuestions(operation, range, resultRange, numQuestions, allowDecimals, allowNegative);
    currentQuestionIndex = 0;
    score = 0;
    
    document.getElementById('settingsForm').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    showQuestion();
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

function showQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    document.getElementById('question').innerText = currentQuestion.question;
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';
    
    currentQuestion.options.forEach(option => {
        const button = document.createElement('button');
        button.innerText = option;
        button.onclick = () => checkAnswer(option);
        optionsContainer.appendChild(button);
    });
    
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
            clearInterval(timer);
            checkAnswer(null); // Timeout without answering
        }
    }, 1000);
}

function checkAnswer(selectedAnswer) {
    clearInterval(timer);
    const currentQuestion = questions[currentQuestionIndex];
    const feedback = document.getElementById('feedback');
    if (selectedAnswer === currentQuestion.answer) {
        feedback.innerText = '正确!';
        score++;
    } else {
        feedback.innerText = `错误! 正确答案是 ${currentQuestion.answer}`;
    }
    setTimeout(nextQuestion, 1000);
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        endGame();
    }
}

function endGame() {
    const totalQuestions = questions.length;
    const percentage = Math.round((score / totalQuestions) * 100);
    alert(`游戏结束! 你的得分是 ${score} / ${totalQuestions}. 正确率: ${percentage}%`);
    document.getElementById('settingsForm').style.display = 'block';
    document.getElementById('game').style.display = 'none';
}

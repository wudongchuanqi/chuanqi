let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timePerQuestion;
let mode;

function startGame() {
    console.log('开始游戏按钮被点击');
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
    console.log('显示题目');
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
        button.innerText = '点击查看答案';
        button.onclick = () => {
            button.innerText = currentQuestion.answer;
            checkAnswer(currentQuestion.answer);
        };
        optionsContainer.appendChild(button);
    }

    document.getElementById('feedback').innerText = '';
    startTimer();
}

function startTimer() {
    console.log('启动计时器');
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
    console.log('检查答案');
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
    console.log('游戏结束');
    document.getElementById('game').style.display = 'none';
    const result = document.createElement('div');
    result.innerHTML = `<h2>游戏结束!</h2><p>你的得分是: ${score}/${questions.length}</p>`;
    document.body.appendChild(result);
}

function generateQuestions(operation, range, resultRange, numQuestions, allowDecimals, allowNegative) {
    console.log('生成题目');
    const questions = [];
    for (let i = 0; i < numQuestions; i++) {
        let question, answer;
        let num1, num2;

        do {
            num1 = Math.floor(Math.random() * (range + 1));
            num2 = Math.floor(Math.random() * (range + 1));
            
            if (allowDecimals) {
                num1 += Math.random();
                num2 += Math.random();
            }
            
            if (allowNegative) {
                if (Math.random() > 0.5) num1 = -num1;
                if (Math.random() > 0.5) num2 = -num2;
            }

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
                    question = `${num1} * ${num2}`;
                    answer = num1 * num2;
                    break;
                case 'division':
                    if (num2 === 0) continue; // 防止除以零
                    question = `${num1} / ${num2}`;
                    answer = num1 / num2;
                    break;
                case 'mixed':
                    const operations = ['+', '-', '*', '/'];
                    const randomOperation = operations[Math.floor(Math.random() * operations.length)];
                    switch (randomOperation) {
                        case '+':
                            question = `${num1} + ${num2}`;
                            answer = num1 + num2;
                            break;
                        case '-':
                            question = `${num1} - ${num2}`;
                            answer = num1 - num2;
                            break;
                        case '*':
                            question = `${num1} * ${num2}`;
                            answer = num1 * num2;
                            break;
                        case '/':
                            if (num2 === 0) continue; // 防止除以零
                            question = `${num1} / ${num2}`;
                            answer = num1 / num2;
                            break;
                    }
                    break;
            }
        } while (Math.abs(answer) > resultRange);

        const options = [];
        if (mode === 'selection') {
            options.push(answer);
            while (options.length < 4) {
                let wrongAnswer;
                do {
                    wrongAnswer = Math.floor(Math.random() * (2 * resultRange + 1)) - resultRange;
                    if (allowDecimals) wrongAnswer += Math.random();
                } while (options.includes(wrongAnswer) || wrongAnswer === answer);
                options.push(wrongAnswer);
            }
            options.sort(() => Math.random() - 0.5);
        }

        questions.push({ question, answer, options });
    }
    return questions;
}

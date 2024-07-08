let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timePerQuestion;

function startGame() {
    const operation = document.getElementById('operation').value;
    const range = parseInt(document.getElementById('range').value);
    const numQuestions = parseInt(document.getElementById('numQuestions').value);
    timePerQuestion = parseInt(document.getElementById('timePerQuestion').value);
    
    questions = generateQuestions(operation, range, numQuestions);
    currentQuestionIndex = 0;
    score = 0;
    
    document.getElementById('settingsForm').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    showQuestion();
}

function generateQuestions(operation, range, numQuestions) {
    const questions = [];
    for (let i = 0; i < numQuestions; i++) {
        const num1 = Math.floor(Math.random() * (range + 1));
        const num2 = Math.floor(Math.random() * (range + 1));
        let question, answer;
        
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
                question = `${num1} / ${num2}`;
                answer = parseFloat((num1 / num2).toFixed(2));
                break;
        }
        
        const options = generateOptions(answer, range);
        questions.push({ question, answer, options });
    }
    return questions;
}

function generateOptions(correctAnswer, range) {
    const options = [correctAnswer];
    while (options.length < 3) {
        const option = Math.floor(Math.random() * (range + 1) * 2);
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
        feedback.innerText = '正确！';
        score++;
    } else {
        feedback.innerText = '错误！';
    }
    
    currentQuestionIndex++;
    
    if (currentQuestionIndex < questions.length) {
        setTimeout(showQuestion, 1000);
    } else {
        setTimeout(showScore, 1000);
    }
}

function nextQuestion() {
    document.getElementById('feedback').innerText = '';
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showScore();
    }
}

function showScore() {
    document.getElementById('game').style.display = 'none';
    document.getElementById('settingsForm').style.display = 'block';
    alert(`游戏结束！您的得分是：${score}/${questions.length}`);
}

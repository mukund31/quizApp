const questionElem=document.getElementById("question")
const answerButton=document.getElementById("answer-buttons")
const nextButton=document.getElementById("next-btn")
const optionButton=document.getElementById("option-btn")

let questions=[]

async function fetchQuestions() {
    let response=await fetch("questions.json")
    questions=await response.json()
    startQuiz()
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array
}

let currentQuesindex=0
let score=0
let skipped=0


function startQuiz() {
    currentQuesindex=0
    score=0
    skipped=0
    questions=shuffleArray(questions)
    showQuestion()
}

function showQuestion() {
    nextButton.style.display="block"
    nextButton.innerHTML="Skip"
    answerButton.style.display="block"
    let currentQues=questions[currentQuesindex]
    let questionNumber=currentQuesindex+1
    questionElem.innerHTML=questionNumber+". "+currentQues.question

    let answerList=answerButton.childNodes
    let i=1
    currentQues.answers.forEach(answers=> {
        const button=document.createElement("button")
        button.innerHTML=answers.text
        button.classList.add("btn")
        answerList[i].replaceWith(button)
        i=i+2
        if(answers.correct) {
            button.dataset.correct=answers.correct
        }
        button.addEventListener("click",selectAnswer)

    })
}

function selectAnswer(e) {
    const selectedBtn=e.target
    const isCorrect=selectedBtn.dataset.correct==="true"
    if(isCorrect) {
        selectedBtn.classList.add("correct-option")
        score=score+1
    }
    else
        selectedBtn.classList.add("incorrect-option")
    Array.from(answerButton.children).forEach(button=> {
        if(button.dataset.correct==="true") 
            button.classList.add("correct-option")
        button.disabled=true
        button.classList.add("cursor-dis")
        if(!button.classList.contains("correct-option") && !button.classList.contains("incorrect-option")) {
            button.classList.add("netural-option")
        }
    })
    nextButton.style.display="block"
    nextButton.innerHTML="Next"
}

function displayScore() {
    questionElem.innerHTML=`Your Score is: ${score} out of ${questions.length} questions, Questions Skiped: ${skipped}` 
    answerButton.style.display="none"
    nextButton.style.display="block"
    nextButton.innerHTML="Replay Quiz"
}

function nextQuestion() {
    currentQuesindex++
    if(currentQuesindex<questions.length) {
        showQuestion()
    }
    else {
        displayScore()
    }
}

nextButton.addEventListener("click",()=> {
    if(nextButton.innerHTML==="Skip")
        skipped++
    if(currentQuesindex<questions.length) {
        nextQuestion()
    }
    else {
        startQuiz()
    }
})

fetchQuestions()
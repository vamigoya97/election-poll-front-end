console.log('working')

const base_URL = 'http://localhost:3000'
const questionsContainer = document.querySelector("#questions-container")
const questionsCard = document.querySelector("#questions-card")
const questionForm = document.querySelector("#question-form")

fetch(`${base_URL}/questions`)
    .then(response => response.json())
    .then(questions => {
       appendQuestions(questions)

    //    questions.forEach(question => {
    //         const trumpButton = document.querySelector("#trump-button")
    //         const bidenButton = document.querySelector("#biden-button")
    //         const buttons = document.querySelector("#button-section")

    //         trumpButton.addEventListener('click', (event) => {
    //             const votesTag = document.createElement('p')
    //             count = 0
    //             votesTag.innerHTML = `<span>${count}</span>`
    //             buttons.append(votesTag)
    //         })

    //         bidenButton.addEventListener('click', (event) => {
    //             const votesTag = document.createElement('p')
    //             count = 0
    //             votesTag.innerHTML = `<span>${count}</span>`
    //             buttons.append(votesTag)
    //         })
    //    })

       

    //    questions.forEach(question => {
    //     const buttons = document.querySelector("#button-section")
    //     const trumpButton = document.querySelector("#trump-button")
    //     const bidenButton = document.querySelector("#biden-button")
    
    //     trumpButton.addEventListener('click', eventListenerOnTrumpButton(question, buttons))
    //     bidenButton.addEventListener('click', eventListenerOnBidenButton(question, buttons))

    //    })

       questionForm.addEventListener('submit', function(event) {
            event.preventDefault()
            const formData = new FormData(event.target)
            const questionBody = formData.get('body')
            appendUserCreatedQuestion(questionBody)
            fetch(`${base_URL}/questions`, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({ 
                    body: questionBody, 
                    trump_votes: 0,
                    biden_votes: 0,
                    candidate_1_id: 1,
                    candidate_2_id: 2
                 })
            }).then(response => response.json())
                .then(console.log)
       })

    })

function appendUserCreatedQuestion(question) {
    const p = document.createElement('p')
    p.textContent = question

    const button_1 = document.createElement('button')
    const button_2 = document.createElement('button')
    button_1.id = "trump-button"
    button_2.id = "biden-button"
    button_1.textContent = "Trump"
    button_2.textContent = "Biden"

    const questionSection = document.createElement('div')
    questionSection.id = 'question-section'
    questionSection.appendChild(p)

    const votesSection = document.createElement('div')
    const votesSpanTrump = document.createElement('span')
    const votesSpanBiden = document.createElement('span')
    votesSection.id = 'votes-section'
    votesSpanTrump.id = 'votes-span-trump'
    votesSpanBiden.id = 'votes-span-biden'
    votesSpanTrump.textContent = question.trump_votes
    votesSpanBiden.textContent = question.biden_votes

    const buttonSection  = document.createElement('div')
    buttonSection.id = 'button-section'
    buttonSection.append(button_1, button_2)

    questionsCard.append(questionSection, buttonSection)

    button_1.addEventListener('click', () => eventListenerTrump(votesSection, votesSpanTrump, votesSpanBiden, question))
    button_2.addEventListener('click', () => eventListenerBiden(votesSection, votesSpanBiden, votesSpanTrump, question))
}

function appendQuestions(questions) {
    questions.forEach(question => {
        const p = document.createElement('p')
        p.textContent = `${question.body}`

        const button_1 = document.createElement('button')
        const button_2 = document.createElement('button')
        button_1.id = "trump-button"
        button_2.id = "biden-button"
        button_1.textContent = `${question.candidate_1.name}`
        button_2.textContent = `${question.candidate_2.name}`

        const questionSection = document.createElement('div')
        questionSection.id = 'question-section'
        questionSection.appendChild(p)

        const votesSection = document.createElement('div')
        const votesSpanTrump = document.createElement('span')
        const votesSpanBiden = document.createElement('span')
        votesSection.id = 'votes-section'
        votesSpanTrump.id = 'votes-span-trump'
        votesSpanBiden.id = 'votes-span-biden'
        votesSpanTrump.textContent = question.trump_votes
        votesSpanBiden.textContent = question.biden_votes

        const buttonSection  = document.createElement('div')
        buttonSection.id = 'button-section'
        buttonSection.append(button_1, button_2)

        questionsCard.append(questionSection, buttonSection, votesSection)

        button_1.addEventListener('click', () => eventListenerTrump(votesSection, votesSpanTrump, votesSpanBiden, question))
        button_2.addEventListener('click', () => eventListenerBiden(votesSection, votesSpanBiden, votesSpanTrump, question))
    })
}

function eventListenerTrump(votesSection, votesSpanTrump, votesSpanBiden, question) {
    var votes = parseInt(votesSpanTrump.innerText)
    console.log(parseInt(votesSpanTrump.innerText), question)
    votes += 1
    votesSpanTrump.innerHTML = `${votes} for Trump <br>`
    votesSpanBiden.innerHTML = `${question.biden_votes} for Biden`
    votesSection.append(votesSpanTrump, votesSpanBiden)
    fetch(`${base_URL}/questions/${question.id}`, {
        method: "PATCH", 
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
        },
        body: JSON.stringify({ 
            //body: body,
            trump_votes: votes
            //biden_votes: bidenVotes,
            //candidate_1_id: 1,
            //candidate_2_id: 2
        })
    }).then(response => response.json())
        .then(console.log)
}

function eventListenerBiden(votesSection, votesSpanBiden, votesSpanTrump, question) {
    var votes = parseInt(votesSpanBiden.innerText)
    votes += 1
    votesSpanBiden.innerHTML = `${votes} for Biden`
    votesSpanTrump.innerHTML = `${question.trump_votes} for Trump <br>`
    votesSection.append(votesSpanTrump, votesSpanBiden)
    fetch(`${base_URL}/questions/${question.id}`, {
        method: "PATCH", 
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
        },
        body: JSON.stringify({ 
            //body: body,
            //trump_votes: trumpVotes,
            biden_votes: votes
            //candidate_1_id: 1,
            //candidate_2_id: 2
        })
    }).then(response => response.json())
        .then(console.log)
}



// CACHE PAGE ELEMENTS
var page = document.getElementById('page');
var highScoreLink = document.getElementById('high-score');
var pageContent = document.getElementById('page-content');
var startQuizBtn = document.getElementById('start-quiz');
var timerDisplay = document.getElementById('timer');

// GLOBAL VARIABLES
var counter = 60;
var scoreArr = loadScores() || [];
var questionIndex = 0;
var questionsArr = [
	{
		question           : 'Commonly used data types do NOT include:',
		answers            : [ 'strings', 'booleans', 'alerts', 'numbers' ],
		correctAnswerIndex : 2
	},
	{
		question           : 'Arrays in Javascript can be used to store _______',
		answers            : [
			'numbers and strings',
			'other arrays',
			'booleans',
			'all of the above'
		],
		correctAnswerIndex : 3
	},
	{
		question           : 'The condition in an IF/ELSE is enclosed with _______',
		answers            : [
			'quotes',
			'curly brackets',
			'parenthesis',
			'square brackets'
		],
		correctAnswerIndex : 2
	},
	{
		question           :
			'String values must be enclosed within _______ when being assigned to variables',
		answers            : [ 'commas', 'curly brackets', 'quotes', 'parenthesis' ],
		correctAnswerIndex : 2
	},
	{
		question           :
			'A very useful tool used during development and debugging for printing content to the debugger:',
		answers            : [
			'JavaScript',
			'terminal/bash',
			'for loops',
			'console.log'
		],
		correctAnswerIndex : 3
	}
];

// GLOBAL SCOPE EVENT LISTENERS
highScoreLink.addEventListener('click', highScoresPage);
startQuizBtn.addEventListener('click', startQuiz);

function startQuiz() {
	// start timer
	timer();

	// call function to create single question
	createQuestion(questionsArr[questionIndex]);
}

function timer() {
	window.startCountdown = setInterval(function() {
		counter--;
		// check if above zero since wrong answer can pull it below despite conditional check for clearInterval
		counter > 0 ? (timerDisplay.innerText = counter) : (timerDisplay.innerText = 0);
		// stop timer at 0
		if (counter === 0) {
			clearInterval(startCountdown);
			gameOverView();
		}
	}, 1000);
}

// FUNCTION TO CREATE SINGLE QUESTION VIEW
function createQuestion(questionObj) {
	// clear page
	pageContent.innerHTML = '';

	// iterate index for call to next question
	questionIndex++;

	// create question page container
	var questionContainerEl = document.createElement('div');
	questionContainerEl.className = 'question';
	questionContainerEl.id = 'question';

	// create question
	var questionEl = document.createElement('h2');
	questionEl.textContent = questionObj.question;
	// append question
	questionContainerEl.appendChild(questionEl);
	// create answer-list
	var answerListEl = document.createElement('ul');
	answerListEl.className = 'answer-list';
	answerListEl.id = 'answer-list';

	// create array of answers
	var answers = questionObj.answers;
	// generate li for each answer in array
	for (var i = 0; i < answers.length; i++) {
		var answerEl = document.createElement('li');
		answerEl.className = 'answer-list-item';
		// add button
		answerEl.innerHTML =
			// '<button class="btn answer-btn">' + (i + 1) + '. ' + answers[i] + '</button>';
			`<button class="btn answer-btn">${i + 1}. ${answers[i]}</button>`;
		// set data-attr flag on correct answer
		if (i === questionObj.correctAnswerIndex) {
			answerEl.setAttribute('data-correct-answer', 'true');
		}
		// append answer to ul
		answerListEl.appendChild(answerEl);
	}

	questionContainerEl.appendChild(answerListEl);
  pageContent.appendChild(questionContainerEl);
  
  // listen for user click on answer
	answerListEl.addEventListener('click', checkAnswer);
}

// CHECK ANSWER, DISPLAY FEEDBACK MSG, TIMED CALL TO NEXT QUESTION FUNCTION
function checkAnswer(event) {
	// find parent li of clicked button
	var clicked = event.target.closest('li.answer-list-item');
	var answerList = document.getElementById('answer-list');

	// check if clicked is truthy otherwise, ul was clicked and we don't want function to proceed or we will get an error because ul has no parent li.answer-list-item so .hasAttribute would be called on null
	if (clicked) {
		var isCorrectAnswer = clicked.hasAttribute('data-correct-answer');
		if (isCorrectAnswer) {
			// display 'correct' message
			var correctMsgEl = document.createElement('p');
			correctMsgEl.className = 'feedback-msg';
			correctMsgEl.innerText = 'Correct!';
			answerList.appendChild(correctMsgEl);
		} else {
			// display 'wrong' message
			counter = counter - 10;
			var wrongMsgEl = document.createElement('p');
			wrongMsgEl.className = 'feedback-msg';
			wrongMsgEl.innerText = 'Wrong!';
			answerList.appendChild(wrongMsgEl);
		}
		answerList.removeEventListener('click', checkAnswer);

		// remove feedback msg after 1 second and proceed to next question or game over
		setTimeout(function() {
			if (counter <= 0 || questionIndex >= questionsArr.length) {
				gameOverView();
			} else {
				createQuestion(questionsArr[questionIndex]);
			}
		}, 1000);
	}
}

// FUNCTION TO CREATE GAME-OVER VIEW
function gameOverView() {
	// stop timer
	clearInterval(window.startCountdown);

	pageContent.innerHTML = '';

	var gameOverEl = document.createElement('div');
	gameOverEl.className = 'game-over';
	gameOverEl.id = 'game-over';

	var gameOverMsgEl = document.createElement('h2');
	gameOverMsgEl.innerText = 'All done!';
	gameOverEl.appendChild(gameOverMsgEl);

	var scoreMsgEl = document.createElement('h3');
	scoreMsgEl.innerText = 'Your final score is ';

	var scoreEl = document.createElement('span');
	scoreEl.id = 'player-score';

	if (counter >= 0) {
		scoreEl.innerText = counter + '.';
	} else {
		scoreEl.innerText = 0 + '.';
	}

	scoreMsgEl.appendChild(scoreEl);
	gameOverEl.appendChild(scoreMsgEl);

	var playerStatsFormEl = document.createElement('form');
	playerStatsFormEl.innerHTML =
		"<label for='initials'>Enter initials:</label>" +
		"<input type='text' id='initials' name='initials' maxlength=2>" +
		"<button class='btn btn-short' type='submit'>Submit</button>";

	// add listener for input submit which calls function to add player object with player and score to high scoreArr
	playerStatsFormEl.addEventListener('submit', handleStatsSubmit);

	gameOverEl.appendChild(playerStatsFormEl);
	pageContent.appendChild(gameOverEl);
}

function handleStatsSubmit(event) {
	event.preventDefault();
	// get and save player stats
	var playerInitials = document
		.querySelector("input[name='initials']")
		.value.toUpperCase();
	var playerScore = counter > 0 ? counter : 0;
	var playerStatsObj = {
		player : playerInitials,
		score  : playerScore
	};
	scoreArr.push(playerStatsObj);
	saveScores();

	// display high scores
	highScoresPage();
}

// FUNCTION TO DISPLAY HIGH SCORES PAGE
function highScoresPage() {
	page.innerHTML = '';

	var highScoresContainerEl = document.createElement('div');
	// highScoresContainerEl.classList = 'container high-scores';
	highScoresContainerEl.classList = 'container high-scores';
	highScoresContainerEl.id = 'high-scores';
	var heading = document.createElement('h2');
	heading.innerText = 'High Scores';
	highScoresContainerEl.appendChild(heading);
	var highScoresList = document.createElement('ul');
	for (var i = 0; i < scoreArr.length; i++) {
		var playerStats = document.createElement('li');
		playerStats.innerText =
			i + 1 + '. ' + scoreArr[i].player + ' - ' + scoreArr[i].score;
		highScoresList.appendChild(playerStats);
	}
	highScoresContainerEl.appendChild(highScoresList);
	var actionsContainer = document.createElement('div');
	actionsContainer.className = 'actions';
	var goBackBtn = document.createElement('a');
	goBackBtn.id = 'go-back';
	goBackBtn.setAttribute('href', './index.html');
	goBackBtn.classList = 'btn btn-short';
	goBackBtn.innerText = 'Go Back';
	actionsContainer.appendChild(goBackBtn);
	var clearScores = document.createElement('button');
	clearScores.classList = 'btn btn-short';
	clearScores.innerText = 'Clear high scores';
	clearScores.addEventListener('click', handleClearScores);
	actionsContainer.appendChild(clearScores);

	highScoresContainerEl.appendChild(actionsContainer);
	page.appendChild(highScoresContainerEl);
}

// clear high scores
function handleClearScores() {
	scoreArr = [];
	saveScores();
	highScoresPage();
}

function saveScores() {
	// sort high scores highest to lowest
	scoreArr.sort((a, b) => b.score - a.score);
	localStorage.setItem('stats', JSON.stringify(scoreArr));
}

// load high scores from localStorage
function loadScores() {
	var stats = localStorage.getItem('stats');
	if (!stats) {
		return false;
	}
	return (stats = JSON.parse(stats));
}
// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyA-VKC4Go08dztSBazATumTZZwUgxldcvo",
    authDomain: "quiz-game-sprint.firebaseapp.com",
    databaseURL: "https://quiz-game-sprint-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "quiz-game-sprint",
    storageBucket: "quiz-game-sprint.firebasestorage.app",
    messagingSenderId: "66615979",
    appId: "1:66615979:web:e366228ae2ac85d2d1d5ee",
    measurementId: "G-R2YPZTWJ0D"
};

// Initialize Firebase
let database;
try {
    firebase.initializeApp(firebaseConfig);
    database = firebase.database();
} catch (error) {
    console.error("Firebase Init Error:", error);
    alert("Erreur de configuration Firebase. Vérifiez la console.");
}

// User Info
let currentPlayerId = null;
let currentPlayerName = "";
let isHost = false;
let serverTimeOffset = 0; // Difference between server time and local time

// Quiz Data
const quizData = [
    {
        question: "Quel est l'objectif principal des méthodes agiles ?",
        answers: [
            "Respecter strictement un plan initial",
            "Livrer rapidement de la valeur tout en s'adaptant",
            "Réduire le nombre de développeurs",
            "Éviter toute documentation"
        ],
        correct: 1
    },
    {
        question: "Scrum est avant tout :",
        answers: [
            "Un langage de programmation",
            "Une méthode rigide",
            "Un framework agile",
            "Un outil de gestion de projet"
        ],
        correct: 2
    },
    {
        question: "Que représente un sprint en Scrum ?",
        answers: [
            "Une phase finale du projet",
            "Une longue période de développement",
            "Un cycle court et itératif",
            "Une réunion avec le client"
        ],
        correct: 2
    },
    {
        question: "Quelle est la première étape d'un sprint ?",
        answers: [
            "La revue du sprint",
            "Les tests",
            "La planification du sprint",
            "La livraison finale"
        ],
        correct: 2
    },
    {
        question: "Que produit l'équipe à la fin de chaque sprint ?",
        answers: [
            "Un rapport détaillé",
            "Un logiciel fonctionnel",
            "Une documentation complète",
            "Un nouveau planning"
        ],
        correct: 1
    },
    {
        question: "Quel principe est au cœur de l'agilité ?",
        answers: [
            "Suivre un processus fixe",
            "Minimiser la communication",
            "S'adapter au changement",
            "Travailler sans client"
        ],
        correct: 2
    },
    {
        question: "Pourquoi la collaboration avec le client est-elle essentielle ?",
        answers: [
            "Pour réduire les coûts",
            "Pour valider uniquement à la fin",
            "Pour s'assurer que le produit répond aux besoins",
            "Pour accélérer la programmation"
        ],
        correct: 2
    },
    {
        question: "Que se passe-t-il lors de la revue de sprint ?",
        answers: [
            "L'équipe commence un nouveau sprint",
            "Le travail est présenté et discuté",
            "Les développeurs changent de rôle",
            "Le projet est terminé"
        ],
        correct: 1
    },
    {
        question: "Scrum favorise principalement :",
        answers: [
            "Le travail en solitaire",
            "Une amélioration continue",
            "Des cycles très longs",
            "Une planification unique"
        ],
        correct: 1
    },
    {
        question: "Quelle est la meilleure mesure de l'avancement en agilité ?",
        answers: [
            "Le nombre de réunions",
            "La documentation produite",
            "Le logiciel fonctionnel",
            "Le budget consommé"
        ],
        correct: 2
    },
    {
        question: "BONUS 🎯 : Scrum, c'est surtout…",
        answers: [
            "Beaucoup de réunions",
            "Du stress en continu",
            "Une approche flexible et collaborative",
            "Une méthode sans règles"
        ],
        correct: 2
    }
];

// State Management
let localCurrentQuestionIndex = -1;
let score = 0;
let userAnswers = [];
let timerAnimationFrame; // For requestAnimationFrame

// DOM Elements
const loginScreen = document.getElementById('login-screen');
const lobbyScreen = document.getElementById('lobby-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultsScreen = document.getElementById('results-screen');

const joinBtn = document.getElementById('join-btn');
const usernameInput = document.getElementById('username-input');
const hostStartBtn = document.getElementById('host-start-btn');
const playersListEl = document.getElementById('players-list');
const playerCountEl = document.getElementById('player-count');

// Quiz DOM
const questionText = document.getElementById('question-text');
const answersContainer = document.getElementById('answers-container');
const currentQuestionEl = document.getElementById('current-question');
const totalQuestionsEl = document.getElementById('total-questions');
const qNumberEl = document.getElementById('q-number');
const progressFill = document.getElementById('progress-fill');
const timerBar = document.getElementById('timer-bar');

// Result DOM
const scoreNumberEl = document.getElementById('score-number');
const leaderboardContainer = document.getElementById('leaderboard-list');
const shareBtn = document.getElementById('share-btn');
const confettiCanvas = document.getElementById('confetti-canvas');
const qrCodeContainer = document.getElementById('qr-code');
const currentUrlEl = document.getElementById('current-url');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    totalQuestionsEl.textContent = quizData.length;

    // Listen for server time offset
    const offsetRef = firebase.database().ref(".info/serverTimeOffset");
    offsetRef.on("value", (snap) => {
        serverTimeOffset = snap.val();
    });
});

// Event Listeners
// Event Listeners
joinBtn.addEventListener('click', joinGame);
hostStartBtn.addEventListener('click', hostStartGame);
shareBtn.addEventListener('click', shareResults);
if (document.getElementById('reset-btn')) {
    document.getElementById('reset-btn').addEventListener('click', hostResetGame);
}

// --- Multiplayer Logic ---

function joinGame() {
    const username = usernameInput.value.trim();
    if (!username) {
        alert("Veuillez entrer un Nom correct !");
        return;
    }

    currentPlayerName = username;
    currentPlayerId = 'player_' + Math.random().toString(36).substr(2, 9);

    // Save to Firebase
    const playerRef = database.ref('players/' + currentPlayerId);
    playerRef.set({
        name: username,
        score: 0,
        status: 'waiting',
        joinedAt: firebase.database.ServerValue.TIMESTAMP
    }).then(() => {
        playerRef.onDisconnect().remove();
        showLobby();
        listenToLobby();
        listenToGameStatus();
    }).catch(err => {
        console.error("Join Error:", err);
        alert("Erreur de connexion : " + err.message + "\n\nVérifiez les 'Règles' dans votre console Firebase.");
    });
}

function showLobby() {
    loginScreen.classList.remove('active');
    lobbyScreen.classList.add('active');
    generateQRCode();
}

function generateQRCode() {
    const currentUrl = window.location.href;
    currentUrlEl.textContent = currentUrl;

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(currentUrl)}`;
    const img = document.createElement('img');
    img.src = qrUrl;
    img.alt = 'QR Code';
    img.style.width = '150px';
    img.style.height = '150px';
    img.style.display = 'block';

    qrCodeContainer.innerHTML = '';
    qrCodeContainer.appendChild(img);
    
    currentUrlEl.style.marginBottom = '30px'; // Adjust the value as needed
}

function listenToLobby() {
    const playersRef = database.ref('players');
    playersRef.on('value', (snapshot) => {
        const players = snapshot.val() || {};
        const playerIds = Object.keys(players);

        playerCountEl.textContent = playerIds.length;
        playersListEl.innerHTML = '';

        playerIds.forEach(id => {
            const p = players[id];
            const div = document.createElement('div');
            div.className = 'player-item';
            div.innerHTML = `
                <div class="player-avatar">${p.name.charAt(0).toUpperCase()}</div>
                <div class="player-name">${p.name} ${id === currentPlayerId ? '(Vous)' : ''}</div>
            `;
            playersListEl.appendChild(div);
        });

        // Determine Host (Earliest Joiner)
        const sortedPlayers = Object.values(players).sort((a, b) => a.joinedAt - b.joinedAt);
        if (sortedPlayers.length > 0 && sortedPlayers[0].name === currentPlayerName) {
            isHost = true;
            hostStartBtn.classList.remove('hidden');
                        // ADD THIS LINE to add space above the button
            hostStartBtn.style.marginTop = '30px'; // Adjust the value as needed
        } else {
            isHost = false;
            hostStartBtn.classList.add('hidden');
        }
    });
}

// --- Host Logic ---

const QUESTION_DURATION = 15000; // 15 seconds per question

function hostStartGame() {
    if (!isHost) return;

    // Initial State
    updateGameStatus(0, 'playing');

    // Start Loop
    runGameLoop(0);
}

function runGameLoop(questionIndex) {
    // Wait for the duration then move to next
    setTimeout(() => {
        const nextIndex = questionIndex + 1;

        if (nextIndex < quizData.length) {
            updateGameStatus(nextIndex, 'playing');
            runGameLoop(nextIndex);
        } else {
            updateGameStatus(nextIndex, 'finished');
        }
    }, QUESTION_DURATION);
}

function updateGameStatus(index, state) {
    const data = {
        state: state,
        currentQuestion: index,
        lastUpdate: firebase.database.ServerValue.TIMESTAMP
    };

    if (state === 'playing') {
        data.questionStartTime = firebase.database.ServerValue.TIMESTAMP;
    }

    database.ref('gameStatus').set(data);
}

function hostResetGame() {
    if (!isHost) return;

    // Reset game status to 'waiting' (Lobby)
    database.ref('gameStatus').set({
        state: 'waiting',
        lastUpdate: firebase.database.ServerValue.TIMESTAMP
    });

    // Reset all players' scores and status
    database.ref('players').once('value', (snapshot) => {
        const players = snapshot.val();
        if (players) {
            const updates = {};
            Object.keys(players).forEach(key => {
                updates[`players/${key}/score`] = 0;
                updates[`players/${key}/status`] = 'waiting';
            });
            database.ref().update(updates);
        }
    });
}

// --- Client Logic ---

function listenToGameStatus() {
    database.ref('gameStatus').on('value', (snapshot) => {
        const status = snapshot.val();
        if (!status) return;

        // Handle Game Reset
        if (status.state === 'waiting') {
            resetLocalState();
            showLobby();
            return;
        }

        if (status.state === 'playing') {
            const serverQuestionIndex = status.currentQuestion;

            // Only update if it's a new question
            if (serverQuestionIndex !== localCurrentQuestionIndex) {
                localCurrentQuestionIndex = serverQuestionIndex;
                if (localCurrentQuestionIndex < quizData.length) {
                    startLocalQuestion(localCurrentQuestionIndex, status.questionStartTime);
                }
            }
        } else if (status.state === 'finished') {
            if (localCurrentQuestionIndex !== 'finished') {
                localCurrentQuestionIndex = 'finished';
                finishGame();
            }
        }
    });
}

function resetLocalState() {
    localCurrentQuestionIndex = -1;
    score = 0;
    userAnswers = [];
    quizScreen.classList.remove('active');
    resultsScreen.classList.remove('active');
    lobbyScreen.classList.add('active'); // Go back to lobby
    if (timerAnimationFrame) cancelAnimationFrame(timerAnimationFrame);
}

function startLocalQuestion(index, startTime) {
    if (!quizScreen.classList.contains('active')) {
        lobbyScreen.classList.remove('active');
        quizScreen.classList.add('active');
    }

    const question = quizData[index];

    // UI Updates
    questionText.textContent = question.question;
    qNumberEl.textContent = index + 1;
    currentQuestionEl.textContent = index + 1;

    const progress = ((index) / quizData.length) * 100;
    progressFill.style.width = progress + '%';

    // Reset Answers
    answersContainer.innerHTML = '';
    question.answers.forEach((answer, i) => {
        const button = document.createElement('button');
        button.className = 'answer-btn';
        button.textContent = answer;
        button.addEventListener('click', () => selectAnswer(i));
        answersContainer.appendChild(button);
    });

    // Restart Timer Animation with Sync
    // Calculate estimated server time when this question started
    // We rely on the server timestamp `startTime` which is absolute server time.
    // To compare with local time, we need: localTime + serverTimeOffset = estimatedServerTime
    
    if (timerAnimationFrame) cancelAnimationFrame(timerAnimationFrame);

    function updateTimer() {
        const estimatedServerNow = Date.now() + serverTimeOffset;
        const elapsed = estimatedServerNow - startTime;
        const remaining = Math.max(0, QUESTION_DURATION - elapsed);
        const percentageRemaining = (remaining / QUESTION_DURATION) * 100;

        timerBar.style.width = percentageRemaining + '%';

        if (remaining > 0) {
            timerAnimationFrame = requestAnimationFrame(updateTimer);
        } else {
             timerBar.style.width = '0%';
        }
    }

    // Start the loop
    updateTimer();
}

function selectAnswer(selectedIndex) {
    // Only allow selection if buttons are enabled (not already selected)
    const buttons = answersContainer.querySelectorAll('.answer-btn');
    if (buttons.length === 0 || buttons[0].classList.contains('disabled')) return;

    const question = quizData[localCurrentQuestionIndex];

    buttons.forEach(btn => btn.classList.add('disabled'));
    buttons[selectedIndex].classList.add('selected');

    const isCorrect = selectedIndex === question.correct;

    if (isCorrect) {
        buttons[selectedIndex].classList.add('correct');
        score++;
    } else {
        buttons[selectedIndex].classList.add('incorrect');
        buttons[question.correct].classList.add('correct');
    }

    // We do NOT move to next question automatically here. 
    // We wait for the server (Host) to trigger the next question.
}

function finishGame() {
    // Send final score
    database.ref('players/' + currentPlayerId).update({
        score: score,
        status: 'finished'
    });

    quizScreen.classList.remove('active');
    resultsScreen.classList.add('active');

    if (timerAnimationFrame) cancelAnimationFrame(timerAnimationFrame);

    progressFill.style.width = '100%';
    animateScore();
    listenToLeaderboard();

    if (score === quizData.length) launchConfetti();

    if (isHost) {
        const resetBtn = document.getElementById('reset-btn');
        if (resetBtn) resetBtn.classList.remove('hidden');
    }
}

// --- Leaderboard & Utilities ---

function listenToLeaderboard() {
    const playersRef = database.ref('players');
    playersRef.on('value', (snapshot) => {
        const players = snapshot.val() || {};
        const sortedPlayers = Object.keys(players)
            .map(key => ({ id: key, ...players[key] }))
            .sort((a, b) => b.score - a.score);
        renderLeaderboard(sortedPlayers);
    });
}

function renderLeaderboard(players) {
    leaderboardContainer.innerHTML = '';
    const podiumContainer = document.getElementById('podium-container');
    if (podiumContainer) podiumContainer.innerHTML = '';

    // Handle Podium (Top 3)
    const top3 = players.slice(0, 3);
    const rest = players.slice(3);

    if (podiumContainer) {
        top3.forEach((p, index) => {
            const rank = index + 1;
            const initial = p.name.charAt(0).toUpperCase();

            const div = document.createElement('div');
            div.className = `podium-item rank-${rank}`;
            div.innerHTML = `
                <div class="podium-avatar">${initial}</div>
                <div class="podium-bar">${p.score}</div>
                <div class="podium-name">${p.name}</div>
            `;
            podiumContainer.appendChild(div);
        });
    }

    // Handle List (Rest of players)
    // If fewer than 3 players, top3 takes them all, rest is empty.
    // Ideally show everyone in list? Or just 4+?
    // Let's show Rank 4+ in list to avoid duplicates.

    if (rest.length > 0) {
        rest.forEach((p, index) => {
            const rank = index + 4;
            const div = document.createElement('div');
            div.className = `leaderboard-item ${p.id === currentPlayerId ? 'current-user' : ''}`;
            div.innerHTML = `
                <div class="player-info">
                    <span class="rank-badge">${rank}</span>
                    <span class="player-name">${p.name}</span>
                </div>
                <div class="player-score">${p.score}/${quizData.length}</div>
            `;
            leaderboardContainer.appendChild(div);
        });
    } else if (players.length === 0) {
        leaderboardContainer.innerHTML = '<div style="text-align:center;color:#ccc">Aucun joueur</div>';
    }
}

function animateScore() {
    const ring = document.getElementById('score-ring-fill');
    if (ring) {
        const circumference = 2 * Math.PI * 90;
        const percentage = (score / quizData.length);
        const offset = circumference - (percentage * circumference);

        const svg = ring.parentElement;
        if (!document.getElementById('scoreGradient')) {
            const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
            const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
            gradient.setAttribute('id', 'scoreGradient');
            gradient.innerHTML = `
                 <stop offset="0%" style="stop-color:#6366f1;stop-opacity:1" />
                 <stop offset="100%" style="stop-color:#ec4899;stop-opacity:1" />
             `;
            defs.appendChild(gradient);
            svg.insertBefore(defs, svg.firstChild);
        }
        setTimeout(() => { ring.style.strokeDashoffset = offset; }, 100);
    }

    let current = 0;
    const increment = score / 30;
    const timer = setInterval(() => {
        current += increment;
        if (current >= score) {
            current = score;
            clearInterval(timer);
        }
        scoreNumberEl.textContent = Math.floor(current);
    }, 50);
}

function shareResults() {
    const text = `J'ai obtenu ${score}/${quizData.length} au Quiz Agile Multijoueur ! 🚀`;
    if (navigator.share) {
        navigator.share({ title: 'Quiz Agile & Scrum', text: text, url: window.location.href });
    } else {
        alert("Résultat copié !");
    }
}

function launchConfetti() {
    const canvas = confettiCanvas;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const confetti = [];
    const confettiCount = 150;

    for (let i = 0; i < confettiCount; i++) {
        confetti.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            r: Math.random() * 6 + 4,
            d: Math.random() * confettiCount,
            color: ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6'][Math.floor(Math.random() * 5)],
            tilt: Math.random() * 10 - 10,
            tiltAngleIncremental: Math.random() * 0.07 + 0.05,
            tiltAngle: 0
        });
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        confetti.forEach((c, index) => {
            c.y += (Math.cos(c.d) + 3 + c.r / 2) / 2;
            c.x += Math.sin(c.d);
            ctx.beginPath();
            ctx.lineWidth = c.r / 2;
            ctx.strokeStyle = c.color;
            ctx.moveTo(c.x + c.tilt + c.r / 4, c.y);
            ctx.lineTo(c.x + c.tilt, c.y + c.tilt + c.r / 4);
            ctx.stroke();
            if (c.y > canvas.height) confetti[index].y = -10;
        });
        requestAnimationFrame(draw);
    }
    draw();
    setTimeout(() => ctx.clearRect(0, 0, canvas.width, canvas.height), 5000);
}

window.addEventListener('resize', () => {
    if (confettiCanvas) {
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
    }
});

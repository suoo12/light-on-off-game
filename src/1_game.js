
const timerText = document.querySelector('#timer');
const startBtn = document.querySelector('#start');
const retryBtn = document.querySelector('#retry');
const resultText = document.querySelector('#result');
const lightsEls = Array.from(document.querySelectorAll('.light'));
const GHOST_ON_IMGS = ['./src/ghost1front.png', './src/ghost2front.png'];
const GHOST_OFF_IMGS = ['./src/ghost1-1.png', './src/ghost2-2.png'];


let running = false;
let uiTimer = null;
let aiTimer = null;
let timeLeft = 5000;

let lightsOn = Array(9).fill(false);



function updateLightUI(idx) {
    const el = lightsEls[idx];

    if (lightsOn[idx]) {

        el.classList.add('on');
        el.classList.remove('off');

        const randomOn = GHOST_ON_IMGS[Math.floor(Math.random() * GHOST_ON_IMGS.length)];
        el.style.backgroundImage = `url(${randomOn})`;
    } else {

        el.classList.add('off');
        el.classList.remove('on');

        const randomOff = GHOST_OFF_IMGS[Math.floor(Math.random() * GHOST_OFF_IMGS.length)];
        el.style.backgroundImage = `url(${randomOff})`;
    }


    el.textContent = '';
}

function updateAllLightsUI() {
    for (let i = 0; i < 9; i++) updateLightUI(i);
}


function scheduleAI() {
    if (!running) return;

    const delay = 80 + Math.random() * 120;
    aiTimer = setTimeout(() => {
        if (!running) return;
        const idx = Math.floor(Math.random() * 9);
        lightsOn[idx] = false;
        updateLightUI(idx);
        scheduleAI();
    }, delay);
}


function startGame() {
    if (running) return;
    running = true;

    resultText.textContent = '';
    resultText.className = '';


    lightsOn = Array(9).fill(false);
    updateAllLightsUI();

    timeLeft = 5000;


    uiTimer = setInterval(() => {
        if (!running) return;
        timeLeft -= 100;
        if (timeLeft < 0) timeLeft = 0;
        timerText.textContent = 'TIME: ' + (timeLeft / 1000).toFixed(1) + 's';
        if (timeLeft <= 0) {
            finishGame();
        }
    }, 100);


    scheduleAI();
}


function finishGame() {
    if (!running) return;
    running = false;
    clearInterval(uiTimer);
    clearTimeout(aiTimer);
    uiTimer = null; aiTimer = null;

    const onCount = lightsOn.filter(Boolean).length;
    const offCount = 9 - onCount;


    resultText.classList.remove('win', 'lose');

    if (onCount > offCount) {
        resultText.textContent = `YOU WIN (ON ${onCount} / OFF ${offCount})`;
        resultText.classList.add('win');
    } else {
        resultText.textContent = `GHOST WIN (ON ${onCount} / OFF ${offCount})`;
        resultText.classList.add('lose');
    }
}

function resetGame() {
    running = false;
    clearInterval(uiTimer);
    clearTimeout(aiTimer);
    uiTimer = null; aiTimer = null;

    lightsOn = Array(9).fill(false);
    updateAllLightsUI();

    timeLeft = 5000;
    timerText.textContent = 'TIME: 5.0s';
    resultText.textContent = '';
    resultText.className = '';
}


lightsEls.forEach((el) => {
    el.addEventListener('click', () => {
        if (!running) return;
        const idx = Number(el.dataset.idx);
        lightsOn[idx] = true;
        updateLightUI(idx);
    });
});


startBtn.addEventListener('click', startGame);
retryBtn.addEventListener('click', resetGame);


resetGame();
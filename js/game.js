let lastRevealedScore=0;
let firstClickAppliedA=false;
let firstClickAppliedB=false;
let teamNameA='Squadra A';
let teamNameB='Squadra B';

function refreshGameFromStorage(){
  const nome1 = localStorage.getItem('nome1') || 'Squadra A';
  const colore1 = localStorage.getItem('colore1') || '#ffae00';
  const avatar1 = localStorage.getItem('avatar1') || '';

  const nome2 = localStorage.getItem('nome2') || 'Squadra B';
  const colore2 = localStorage.getItem('colore2') || '#ffae00';
  const avatar2 = localStorage.getItem('avatar2') || '';

  teamNameA = nome1;
  teamNameB = nome2;

  document.getElementById('nomeA').textContent = nome1;
  document.getElementById('avatarA').src = avatar1 ? 'assets/avatars/'+avatar1 : '';
  document.getElementById('teamA').style.borderColor = colore1;
  document.getElementById('teamA').style.setProperty('--team-color', colore1);

  document.getElementById('nomeB').textContent = nome2;
  document.getElementById('avatarB').src = avatar2 ? 'assets/avatars/'+avatar2 : '';
  document.getElementById('teamB').style.borderColor = colore2;
  document.getElementById('teamB').style.setProperty('--team-color', colore2);
}

window.refreshGameFromStorage = refreshGameFromStorage;
refreshGameFromStorage();

let currentRound = 0;
let titleRevealTimer;
let pendingTitleText = '';
let activeTeam = null;
let initialTeam = null;
let wheelRotation = 0;
let isWheelSpinning = false;

function setCategoryPlaceholder(titleText){
  const titleEl = document.getElementById('gameTitle');
  if(!titleEl) return;

  clearInterval(titleRevealTimer);
  pendingTitleText = titleText || '';
  titleEl.textContent = 'Scopri categoria';
  titleEl.dataset.revealed = 'false';
  titleEl.classList.add('category-placeholder');

  requestAnimationFrame(() => {
    const height = titleEl.getBoundingClientRect().height;
    if(height > 0){
      titleEl.style.minHeight = Math.ceil(height) + 'px';
    }
  });
}

function setActiveTeam(team){
  activeTeam = team;
  const teamA = document.getElementById('teamA');
  const teamB = document.getElementById('teamB');
  if(teamA && teamB){
    teamA.classList.toggle('turno-attivo', team === 'A');
    teamB.classList.toggle('turno-attivo', team === 'B');
  }
}

function getTeamScores(){
  const scoreA = parseInt(document.getElementById('scoreA')?.textContent || '0', 10);
  const scoreB = parseInt(document.getElementById('scoreB')?.textContent || '0', 10);
  return { scoreA, scoreB };
}

function chooseTeamForNextRound(){
  const { scoreA, scoreB } = getTeamScores();
  if(scoreA < scoreB) return 'A';
  if(scoreB < scoreA) return 'B';
  return pickRandomTeam();
}

function pickRandomTeam(){
  return Math.random() < 0.5 ? 'A' : 'B';
}

function updateWheelLabels(){
  const labelA = document.getElementById('wheelLabelA');
  const labelB = document.getElementById('wheelLabelB');
  const nameA = document.getElementById('nomeA')?.textContent || 'Squadra A';
  const nameB = document.getElementById('nomeB')?.textContent || 'Squadra B';
  if(labelA) labelA.textContent = nameA;
  if(labelB) labelB.textContent = nameB;

  const colorA = document.getElementById('teamA')?.style.borderColor || '#ffae00';
  const colorB = document.getElementById('teamB')?.style.borderColor || '#ffae00';
  const wheel = document.getElementById('turnWheel');
  if(wheel){
    wheel.style.background = `conic-gradient(${colorA} 0deg 180deg, ${colorB} 180deg 360deg)`;
  }
}

function showTurnModal(){
  updateWheelLabels();
  const modal = document.getElementById('turnModal');
  if(modal){
    modal.classList.add('show');
  }
}

function hideTurnModal(){
  const modal = document.getElementById('turnModal');
  if(modal){
    modal.classList.remove('show');
  }
}

function spinWheel(){
  if(isWheelSpinning) return;
  const wheel = document.getElementById('turnWheel');
  const button = document.getElementById('turnSpinButton');
  if(!wheel) return;

  isWheelSpinning = true;
  if(button) button.disabled = true;
  const winner = pickRandomTeam();
  const baseSpins = 4 + Math.floor(Math.random() * 5);
  const sliceOffset = 20 + Math.floor(Math.random() * 140);
  const desiredTopAngle = winner === 'A' ? sliceOffset : 180 + sliceOffset;
  const targetModulo = (360 - desiredTopAngle) % 360;
  const currentModulo = ((wheelRotation % 360) + 360) % 360;
  const delta = (targetModulo - currentModulo + 360) % 360;
  wheelRotation = wheelRotation + baseSpins * 360 + delta;

  const duration = 3 + Math.random() * 1.2;
  wheel.style.transition = `transform ${duration}s cubic-bezier(0.2, 0.8, 0.2, 1)`;
  wheel.style.transform = `rotate(${wheelRotation}deg)`;

  setTimeout(() => {
    isWheelSpinning = false;
    initialTeam = winner;
    setActiveTeam(winner);
    hideTurnModal();
    if(button) button.disabled = false;
  }, duration * 1000 + 150);
}

const spinBtn = document.getElementById('turnSpinButton');
if(spinBtn){
  spinBtn.addEventListener('click', spinWheel);
}

window.showTurnModal = showTurnModal;

function revealCategoryTitle(){
  const titleEl = document.getElementById('gameTitle');
  if(!titleEl || titleEl.dataset.revealed === 'true') return;
  if(!pendingTitleText) return;

  clearInterval(titleRevealTimer);
  titleEl.dataset.revealed = 'true';
  titleEl.textContent = '';
  titleEl.classList.remove('category-placeholder');

  let index = 0;
  titleRevealTimer = setInterval(() => {
    titleEl.textContent = pendingTitleText.slice(0, index + 1);
    index += 1;
    if(index >= pendingTitleText.length){
      clearInterval(titleRevealTimer);
    }
  }, 40);
}

const titleEl = document.getElementById('gameTitle');
if(titleEl){
  titleEl.addEventListener('click', revealCategoryTitle);
}

function changeRound(roundNumber){

  currentRound = roundNumber;
  const nextTeam = chooseTeamForNextRound();

  /* evidenzia bottone attivo */
  document.querySelectorAll('.round-btn').forEach(btn=>{
    btn.classList.remove('active');
    if(parseInt(btn.textContent) === roundNumber){
      btn.classList.add('active');
    }
  });

  /* RESET SOLO GAMEPLAY */
  loadRoundData(roundNumber);
  resetRoundState();
  if(!(activeTeam === null && initialTeam === null)){
    setActiveTeam(nextTeam);
  }
}

function resetRoundState(){

  document.getElementById('scoreA').textContent=0;
  document.getElementById('scoreB').textContent=0;

  lastRevealedScore=0;
  firstClickAppliedA=false;
  firstClickAppliedB=false;

  /* nasconde risposte */
  document.querySelectorAll('.answer-text').forEach(el=>el.classList.add('hidden'));
  document.querySelectorAll('.answer-score').forEach(el=>el.classList.add('hidden'));

  /* reset strike */
  document.querySelectorAll('.strike').forEach(el=>el.classList.remove('active'));

  /* FERMA tensione */
  const tensione = document.getElementById('tensioneSound');
  tensione.pause();
  tensione.currentTime = 0;
}

function revealAnswer(index){
  const allBoxes=document.querySelectorAll(".answer-box");
  const box=allBoxes[index];
  const text=box.querySelector(".answer-text");
  const score=box.querySelector(".answer-score");
  if(text.classList.contains("hidden")){
    text.classList.remove("hidden");
    score.classList.remove("hidden");
    lastRevealedScore=parseInt(score.textContent);
    firstClickAppliedA=false;
    firstClickAppliedB=false;
    const s=document.getElementById('successSound');
    s.currentTime=1;
    s.play();
  }
}

function changeScore(team,delta){
  const scoreEl=document.getElementById(team==='A'?'scoreA':'scoreB');
  let score=parseInt(scoreEl.textContent);
  let pointsAssigned = false;
  if(team==='A'){
    if(!firstClickAppliedA && delta===1 && lastRevealedScore>0){
      score+=lastRevealedScore;
      firstClickAppliedA=true;
      pointsAssigned = true;
    }else{
      score+=delta;
    }
  }else{
    if(!firstClickAppliedB && delta===1 && lastRevealedScore>0){
      score+=lastRevealedScore;
      firstClickAppliedB=true;
      pointsAssigned = true;
    }else{
      score+=delta;
    }
  }
  if(score<0) score=0;
  scoreEl.textContent=score;

  if(pointsAssigned){
    setActiveTeam(team === 'A' ? 'B' : 'A');
  }
}

function restartGame(){
  document.getElementById('scoreA').textContent=0;
  document.getElementById('scoreB').textContent=0;
  lastRevealedScore=0;
  firstClickAppliedA=false;
  firstClickAppliedB=false;
  document.querySelectorAll('.answer-text').forEach(el=>el.classList.add('hidden'));
  document.querySelectorAll('.answer-score').forEach(el=>el.classList.add('hidden'));
  document.querySelectorAll('.round-box').forEach(el=>el.classList.remove('active'));
  document.querySelectorAll('.strike').forEach(el=>el.classList.remove('active'));

    // Ferma musica tensione
  const tensione = document.getElementById('tensioneSound');
  tensione.pause();
  tensione.currentTime = 0;
}

document.getElementById('restartButton').addEventListener('click',restartGame);
document.getElementById('backButton').addEventListener('click',() => {
  if (typeof window.appNavigate === 'function') {
    window.appNavigate('/menu');
  } else {
    window.location.href='/menu';
  }
});

function setupRoundBoxHandlers(){
  document.querySelectorAll('.round-box').forEach(box=>{
    box.addEventListener('click',()=>{
      const isActivating = !box.classList.contains('active');
      box.classList.toggle('active');

      if(isActivating){
        const s = document.getElementById('roundSound');
        s.currentTime = 0;
        s.play();

        // Ferma musica tensione
        const tensione = document.getElementById('tensioneSound');
        tensione.pause();
        tensione.currentTime = 0;

        const maxRound = roundsData.length - 1;
        if(maxRound > currentRound){
          changeRound(currentRound + 1);
        }
      }
    });
  });
}

function checkStrikes() {
  const strikesA = document.querySelectorAll('#teamA .strike.active').length;
  const strikesB = document.querySelectorAll('#teamB .strike.active').length;

  if (strikesA === 3) {
    showRoundDecisivo(teamNameB);
  } else if (strikesB === 3) {
    showRoundDecisivo(teamNameA);
  }
}

function showRoundDecisivo(nomeSquadra) {
  const msg = document.getElementById('roundDecisivo');

  msg.innerHTML = `
    MOMENTO DECISIVO!<br>
    <span style="font-size:0.8em">${nomeSquadra.toUpperCase()} PREPARATEVI!</span>
  `;

msg.style.display = 'block';
msg.classList.remove('hide');

/* forza il browser a registrare opacity:0 */
msg.offsetHeight;

/* fade-in */
msg.classList.add('show');

// Avvia musica tensione
const tensione = document.getElementById('tensioneSound');
tensione.currentTime = 0;
tensione.play();


  setTimeout(() => {
    msg.classList.remove('show');
    msg.classList.add('hide');

    setTimeout(() => {
      msg.style.display = 'none';
    }, 2500);
  }, 6000);
}

document.querySelectorAll('.strike').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const isActivating=!btn.classList.contains('active');
    btn.classList.toggle('active');
    const s=document.getElementById('wrongSound');
    if(isActivating) s.currentTime=0.5;
    s.play();
    checkStrikes();
  });
});

/* =============================
   DATI DI TUTTI I ROUND
============================= */
let roundsData = [];

function buildRoundBoxes(totalRounds){
  const roundsPerRow = 5;
  const containers = document.querySelectorAll('.rounds-container');

  containers.forEach(container => {
    container.innerHTML = '';
    let currentRow = null;

    for(let i = 1; i <= totalRounds; i += 1){
      if((i - 1) % roundsPerRow === 0){
        currentRow = document.createElement('div');
        currentRow.className = 'rounds-row';
        container.appendChild(currentRow);
      }

      const box = document.createElement('div');
      box.className = 'round-box';
      currentRow.appendChild(box);
    }
  });
}

function loadRoundData(roundNumber){

  const round = roundsData[roundNumber];
  if(!round){
    setCategoryPlaceholder('');
    return;
  }

  setCategoryPlaceholder(round.title);

  const data = round.answers;
  const boxes = document.querySelectorAll(".answer-box");

  boxes.forEach((box,i)=>{
    const textEl = box.querySelector(".answer-text");
    const scoreEl = box.querySelector(".answer-score");

    textEl.textContent = data[i].text;
    scoreEl.textContent = data[i].score;
  });

  if (typeof window.normalizeAnswerHeights === 'function') {
    requestAnimationFrame(window.normalizeAnswerHeights);
  }
}

async function initRoundsData(){
  try {
    const response = await fetch('data/rounds.json', { cache: 'no-store' });
    if(!response.ok) throw new Error('Rounds fetch failed');
    roundsData = await response.json();
  } catch (error) {
    console.error('Errore caricamento rounds.json', error);
    roundsData = [];
  }

  const totalRounds = Math.max(roundsData.length - 1, 1);
  buildRoundBoxes(totalRounds);
  setupRoundBoxHandlers();
  changeRound(0);
}

initRoundsData();

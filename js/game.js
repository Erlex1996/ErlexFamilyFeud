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

  document.getElementById('nomeB').textContent = nome2;
  document.getElementById('avatarB').src = avatar2 ? 'assets/avatars/'+avatar2 : '';
  document.getElementById('teamB').style.borderColor = colore2;
}

window.refreshGameFromStorage = refreshGameFromStorage;
refreshGameFromStorage();

let currentRound = 0;

function changeRound(roundNumber){

  currentRound = roundNumber;

  /* aggiorna titolo */
  const title = document.getElementById('gameTitle');
  title.textContent = roundNumber === 0 ? "Round di prova" : "Round " + roundNumber;

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
  if(team==='A'){
    if(!firstClickAppliedA && delta===1 && lastRevealedScore>0){
      score+=lastRevealedScore;
      firstClickAppliedA=true;
    }else{
      score+=delta;
    }
  }else{
    if(!firstClickAppliedB && delta===1 && lastRevealedScore>0){
      score+=lastRevealedScore;
      firstClickAppliedB=true;
    }else{
      score+=delta;
    }
  }
  if(score<0) score=0;
  scoreEl.textContent=score;
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
    }
  });
});

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

const roundsData = [

/* ROUND 0 */
{
title:"Round di prova",
answers:[
{ text:"Vale", score:30 },
{ text:"Dig", score:25 },
{ text:"Livia", score:20 },
{ text:"Ceci", score:15 },
{ text:"Menicu", score:13 },
{ text:"Giulia", score:10 },
{ text:"Pablo", score:7 },
{ text:"Erlex", score:5 }
]
},

/* ROUND 1 */
{
title:"Paesi più visitati al mondo",
answers:[
{ text:"Francia", score:30 },
{ text:"Spagna", score:25 },
{ text:"Stati Uniti", score:20 },
{ text:"Cina", score:15 },
{ text:"Italia", score:13 },
{ text:"Turchia", score:10 },
{ text:"Messico", score:7 },
{ text:"Germania", score:5 }
]
},

/* ROUND 2 */
{
title:"Cibi più ordinati al mondo",
answers:[
{ text:"Pizza", score:30 },
{ text:"Hamburger", score:25 },
{ text:"Sushi", score:20 },
{ text:"Pasta", score:15 },
{ text:"Insalata", score:13 },
{ text:"Dolci", score:10 },
{ text:"Bevande", score:7 },
{ text:"Kebab", score:5 }
]
},

/* ROUND 3 */
{
title:"Artisti più ascoltati su Spotify nel 2025",
answers:[
{ text:"Bad Bunny", score:30 },
{ text:"Taylor Swift", score:25 },
{ text:"The Weeknd", score:20 },
{ text:"Drake", score:15 },
{ text:"Billie Eilish", score:13 },
{ text:"Kendrick Lamar", score:10 },
{ text:"Bruno Mars", score:7 },
{ text:"Ariana Grande", score:5 }
]
},

/* ROUND 4 */
{
title:"Le serie di Netflix più viste di sempre (totale di tutte le stagioni)",
answers:[
{ text:"Squid Game", score:30 },
{ text:"Wednesday", score:25 },
{ text:"Stranger Things", score:20 },
{ text:"La Casa di Carta", score:15 },
{ text:"Bridgerton", score:13 },
{ text:"Adolescence", score:10 },
{ text:"DAHMER: Monster", score:7 },
{ text:"La Regina degli Scacchi", score:5 }
]
},

/* ROUND 5 */
{
title:"Le abitudini più comuni appena ci si sveglia",
answers:[
{ text:"Fare Colazione", score:30 },
{ text:"Bere Acqua", score:25 },
{ text:"Lavarsi", score:20 },
{ text:"Controllare lo Smartphone", score:15 },
{ text:"Andare in Bagno", score:13 },
{ text:"Stretching", score:10 },
{ text:"Guardare notizie Radio/TV", score:7 },
{ text:"Vestirsi/Truccarsi", score:5 }
]
},

/* ROUND 5 */
{
title:"Le preoccupazioni globali più diffuse",
answers:[
{ text:"Inflazione/Costo della vita", score:30 },
{ text:"Guerra e violenze", score:25 },
{ text:"Povertà e disuguaglianza", score:20 },
{ text:"Disoccupazione", score:15 },
{ text:"Corruzione politica", score:13 },
{ text:"Sistema sanitario", score:10 },
{ text:"Immigrazione", score:7 },
{ text:"Cambiamento climatico", score:5 }
]
}

];

function loadRoundData(roundNumber){

  const round = roundsData[roundNumber];
  if(!round) return;

  /* cambia titolo personalizzato */
  const title = document.getElementById('gameTitle');
  title.textContent = round.title;

  const data = round.answers;
  const boxes = document.querySelectorAll(".answer-box");

  boxes.forEach((box,i)=>{
    const textEl = box.querySelector(".answer-text");
    const scoreEl = box.querySelector(".answer-score");

    textEl.textContent = data[i].text;
    scoreEl.textContent = data[i].score;
  });

}
changeRound(0);

const avatarLista = ['dino.png','wolf.png','cat.png','spider.png','eagle.png','turtle.png','mouse.png','hat.png','car.png'];
let avatarIndex = {1:0,2:1};
let avatarSelezionato = {1:null,2:null};

function avatarCorrente(s){
  return avatarLista[avatarIndex[s]];
}

function mostraAvatar(s){
  const img=document.getElementById('avatarMostrato'+s);
  const avatar=avatarCorrente(s);
  img.src='assets/avatars/'+avatar;
  img.classList.remove('avatar-selezionato','avatar-bloccato');

  const altro = (s===1)?2:1;
  if(avatarSelezionato[s]===avatar) img.classList.add('avatar-selezionato');
  if(avatarSelezionato[altro]===avatar) img.classList.add('avatar-bloccato');
}

function nextAvatar(s){
  avatarIndex[s]=(avatarIndex[s]+1)%avatarLista.length;
  mostraAvatar(1);
  mostraAvatar(2);
}

function prevAvatar(s){
  avatarIndex[s]=(avatarIndex[s]-1+avatarLista.length)%avatarLista.length;
  mostraAvatar(1);
  mostraAvatar(2);
}

function toggleAvatar(s){
  const avatar=avatarCorrente(s);
  const altro=(s===1)?2:1;
  if(avatarSelezionato[altro]===avatar) return;

  avatarSelezionato[s]=(avatarSelezionato[s]===avatar)?null:avatar;

  mostraAvatar(1);
  mostraAvatar(2);
  controllaAvvio();
}

function controllaAvvio(){
  const btn = document.getElementById('avviaBtn');

  if(avatarSelezionato[1] && avatarSelezionato[2]){
    btn.disabled = false;
    btn.classList.add('glow-attivo');
  } else {
    btn.disabled = true;
    btn.classList.remove('glow-attivo');
  }
}

const colori=['#e74c3c','#e67e22','#f1c40f','#2ecc71','#1abc9c','#3498db','#9b59b6','#fd79a8','#a0522d','#7f8c8d'];
let coloreIndex={1:0,2:5};
let coloreScelto={1:colori[0],2:colori[5]};

function mostraColore(event,s){
  const colore=colori[coloreIndex[s]];
  const divColore=document.getElementById('coloreMostrato'+s);
  if (divColore) {
    divColore.style.background = colore;
    divColore.style.border = "3px solid #fff";
    divColore.style.borderRadius = "50%";
  } 
  
  coloreScelto[s]=colore;

  if (event && event.target) {
    var card = event.target.closest('.squadra-inner');
    if (card) {
      card.style.borderColor = colore;
      card.style.borderSize = '3px';
      card.style.borderStyle = 'solid';
    }
  }
}

function nextColore(event,s){
  coloreIndex[s]=(coloreIndex[s]+1)%colori.length;
  mostraColore(event,s);
}

function prevColore(event,s){
  coloreIndex[s]=(coloreIndex[s]-1+colori.length)%colori.length;
  mostraColore(event,s);
}

function avviaGioco(){
  if(!(avatarSelezionato[1] && avatarSelezionato[2])) return;

  localStorage.setItem('nome1',document.getElementById('nome1').value);
  localStorage.setItem('colore1',coloreScelto[1]);
  localStorage.setItem('avatar1',avatarSelezionato[1]);

  localStorage.setItem('nome2',document.getElementById('nome2').value);
  localStorage.setItem('colore2',coloreScelto[2]);
  localStorage.setItem('avatar2',avatarSelezionato[2]);

  if (typeof window.appNavigate === 'function') {
    window.appNavigate('/game');
  } else {
    window.location.href='game';
  }
}

mostraAvatar(1);
mostraAvatar(2);
mostraColore(null, 1);
mostraColore(null, 2);

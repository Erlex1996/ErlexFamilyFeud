const HUB_PASSWORDS = [
  { password: 'erlex', source: 'data/rounds.json' },
  { password: 'sberi', source: 'data/rounds_alt.json' }
];

window.roundsSource = null;

function resolveRoundsSource(value){
  const normalized = (value || '').trim();
  if(!normalized) return null;
  const match = HUB_PASSWORDS.find(entry => entry.password === normalized);
  return match ? match.source : null;
}

function setupHubGate(){
  const enterButton = document.getElementById('hubEnterFamily');
  const gate = document.getElementById('hubGate');
  const input = document.getElementById('hubPassword');
  const error = document.getElementById('hubGateError');
  const submit = document.getElementById('hubGateSubmit');
  const cancel = document.getElementById('hubGateCancel');

  if(!enterButton || !gate || !input || !error || !submit || !cancel) return;

  const openGate = () => {
    gate.classList.add('show');
    gate.setAttribute('aria-hidden', 'false');
    input.value = '';
    error.textContent = '';
    setTimeout(() => input.focus(), 0);
  };

  const closeGate = () => {
    gate.classList.remove('show');
    gate.setAttribute('aria-hidden', 'true');
    input.value = '';
    error.textContent = '';
  };

  const handleSubmit = () => {
    const source = resolveRoundsSource(input.value);
    if(!source){
      error.textContent = 'Password non valida.';
      return;
    }
    if(typeof window.setRoundsSource === 'function'){
      window.setRoundsSource(source);
    } else {
      window.roundsSource = source;
    }
    closeGate();
    if (typeof window.appNavigate === 'function') {
      window.appNavigate('/menu');
    } else {
      window.location.href = 'menu';
    }
  };

  enterButton.addEventListener('click', openGate);
  submit.addEventListener('click', handleSubmit);
  cancel.addEventListener('click', closeGate);
  gate.addEventListener('click', (event) => {
    if(event.target === gate) closeGate();
  });
  input.addEventListener('keydown', (event) => {
    if(event.key === 'Enter') handleSubmit();
  });
}

document.addEventListener('DOMContentLoaded', setupHubGate);

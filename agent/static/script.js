// NeonDev script: typing indicator + enter-to-send + status toggle
const sendBtn = document.getElementById('sendBtn');
const clearBtn = document.getElementById('clearBtn');
const userInput = document.getElementById('userInput');
const chatBox = document.getElementById('chatBox');
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');

function setStatus(online=true){
  if(online){ statusDot.classList.remove('offline'); statusDot.classList.add('online'); statusText.innerText = 'Connected' }
  else { statusDot.classList.remove('online'); statusDot.classList.add('offline'); statusText.innerText = 'Disconnected' }
}

// initial status
setStatus(true);

// helper to append messages
function appendMessage(kind, text){
  const d = document.createElement('div');
  d.className = `msg ${kind}`;
  d.innerText = text;
  const meta = document.createElement('span');
  meta.className = 'meta';
  const t = new Date();
  meta.innerText = `${t.getHours()}:${String(t.getMinutes()).padStart(2,'0')}`;
  d.appendChild(meta);
  chatBox.appendChild(d);
  chatBox.scrollTop = chatBox.scrollHeight;
  return d;
}

// show typing indicator
function showTyping(){
  const t = document.createElement('div');
  t.className = 'typing';
  t.id = '__typing';
  t.innerHTML = '<span class="dotx"></span><span class="dotx"></span><span class="dotx"></span>';
  chatBox.appendChild(t);
  chatBox.scrollTop = chatBox.scrollHeight;
  return t;
}

async function sendMessage(){
  const text = userInput.value.trim();
  if(!text) return;
  appendMessage('user', text);
  userInput.value = '';
  userInput.focus();

  // typing indicator
  const typingEl = showTyping();

  try {
    const res = await fetch('/ask', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ prompt: text })
    });

    const json = await res.json();
    // remove typing
    typingEl.remove();

    const reply = json?.response ?? '⚠️ No response';
    appendMessage('bot', reply);
  } catch(err) {
    typingEl.remove();
    appendMessage('bot', '❌ Network / Server error');
    setStatus(false);
    console.error(err);
  }
}

// events
sendBtn.addEventListener('click', sendMessage);
clearBtn.addEventListener('click', ()=>{ chatBox.innerHTML=''; userInput.focus(); });
userInput.addEventListener('keydown', (e)=>{
  if(e.key === 'Enter' && !e.shiftKey){ e.preventDefault(); sendMessage(); }
});

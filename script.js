const screen = document.getElementById('screen');
const keys = document.querySelector('.keys');
let expr = '0';

function formatDisplay(s) {
  return s.replace(/(?<![.\d])\d+(?:\.\d+)?/g, m=>{
    const [int, dec] = m.split('.');
    const withCommas = int.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return dec ? withCommas + '.' + dec : withCommas;
  });
}

function setExpr(newExpr) {
  expr = newExpr.replace(/^[+*/.%]+/, '');
  if(expr===''||expr==='NaN'||expr==='Infinity') expr='0';
  screen.value = formatDisplay(expr);
}

function append(val){ expr==='0'&&/[\d.]/.test(val)? setExpr(val):setExpr(expr+val); }
function del(){ setExpr(expr.length>1?expr.slice(0,-1):'0'); }
function ac(){ setExpr('0'); }

function evaluate() {
  try {
    const safe = expr.replace(/(\d+(\.\d+)?)%/g,'($1/100)');
    if(!/^[\d+\-*/().\s]+$/.test(safe)) throw new Error();
    const result = Function('return '+safe)();
    setExpr(String(result));
  } catch {
    screen.value='Error';
    setTimeout(()=>setExpr('0'),900);
  }
}

// Event listeners
keys.addEventListener('click', e=>{
  const btn=e.target.closest('button'); if(!btn) return;
  const val=btn.dataset.val; const act=btn.dataset.action;
  if(act==='ac') ac();
  else if(act==='del') del();
  else if(act==='eq') evaluate();
  else if(val) append(val);
});

window.addEventListener('keydown', e=>{
  const k=e.key;
  if(/[0-9]/.test(k)) append(k);
  else if(k==='.') append('.');
  else if(['+','-','*','/','(',')'].includes(k)) append(k);
  else if(k==='Enter'||k==='='){ e.preventDefault(); evaluate(); }
  else if(k==='Backspace'){ del(); }
  else if(k==='Escape'){ ac(); }
  else if(k==='%'){ append('%'); }
});

// Theme toggle
function toggleTheme() {
  document.body.classList.toggle("light");
}

// Back button
function goBack() {
  window.location.href = "index.html"; // change to your portfolio homepage
}

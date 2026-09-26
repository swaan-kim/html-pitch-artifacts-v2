/* V2 reusable adapter. The three archived decks remain byte-for-byte unchanged. */
(()=>{'use strict';
const $=s=>document.querySelector(s),all=s=>[...document.querySelectorAll(s)],slides=all('.slide'),deck=$('#deck');
if(!slides.length)return;
let index=0,cue=0,busy=false,timers=[],rolePhase=0,meaningStage=0;
const motion=matchMedia('(prefers-reduced-motion: reduce)'),reduced=()=>motion.matches||document.body.classList.contains('reduced-motion');
const kind=()=>slides[index].dataset.sceneId,steps=i=>Number(slides[i].dataset.steps||0),later=(f,ms)=>timers.push(setTimeout(f,ms));
const activate=(node,on)=>{if(!node)return;node.setAttribute('aria-hidden',String(!on));node.inert=!on;};
function cancel(){timers.forEach(clearTimeout);timers=[];busy=false;deck.setAttribute('aria-busy','false');all('.is-transforming,.is-overflowing,.is-playing,.greeting,.focus-preview').forEach(n=>n.classList.remove('is-transforming','is-overflowing','is-playing','greeting','focus-preview'));}
function lock(ms){busy=true;deck.setAttribute('aria-busy','true');later(()=>{busy=false;deck.setAttribute('aria-busy','false');},reduced()?0:ms);}
function render(hash=true){
slides.forEach((s,i)=>{s.classList.toggle('is-active',i===index);s.dataset.storyStep=String(i===index?cue:0);activate(s,i===index);});
deck.dataset.slide=String(index+1);deck.dataset.cue=String(cue);deck.dataset.total=String(slides.length);
all('[data-routing-panel]').forEach((n,i)=>{const active=i===(kind()==='routing-why'?cue:0);n.classList.toggle('is-current',active);activate(n,active);});
const closingKinds=['closing-position','closing-media','feedback'],closingIndex=closingKinds.indexOf(kind()),closing=closingIndex>=0,stage=closing?closingIndex*2+cue:0,canvas=$('#closing-canvas');
if(canvas){canvas.classList.toggle('is-active',closing);canvas.dataset.closing=String(stage);activate(canvas,closing);['closing-position-view','closing-media-view','closing-tools-view','closing-autopets'].forEach((cls,i)=>activate(canvas.querySelector('.'+cls),closing&&(i===3?stage===6:Math.floor(stage/2)===i)));activate(canvas.querySelector('.global-media-anchor'),closing&&stage!==6);['.ai-bridge','.expanded-copy','.role-summary'].forEach(s=>activate(canvas.querySelector(s),closing&&stage===1));activate(canvas.querySelector('.feedback-quote'),closing&&stage===0);}
for(const [s,on] of [['.gurumi-photo-wrap',kind()==='gurumi-intro'&&cue===0],['.gurumi-reveal',kind()==='gurumi-intro'&&cue===1],['.ecosystem-base',kind()==='ecosystem'&&cue<2],['.eco-pet-question',kind()==='ecosystem'&&cue<2],['.ecosystem-overflow',kind()==='ecosystem'&&cue===1],['.eco-recommend',kind()==='ecosystem'&&cue===2]])activate($(s),on);
all('.demo-panel').forEach((n,i)=>{const on=i===(kind()==='demo'?cue:0);n.classList.toggle('is-current',on);activate(n,on);});
all('[data-demo-step]').forEach((n,i)=>n.setAttribute('aria-current',i===cue?'step':'false'));
all('[data-pet-stage]').forEach((n,i)=>{n.classList.toggle('is-selected',i===meaningStage);n.setAttribute('aria-current',String(i===meaningStage));});
all('[data-meaning-panel]').forEach((n,i)=>{const on=i===(kind()==='meaning'?Math.max(0,cue-1):0);n.classList.toggle('is-current',on);activate(n,on);});
if($('#guide-intro'))$('#guide-intro').hidden=rolePhase>0;if($('#guide-conversation'))$('#guide-conversation').hidden=rolePhase===0;
$('.roles')?.classList.toggle('is-recommended',rolePhase===3);
all('[data-guide-beat]').forEach((n,i)=>{n.classList.toggle('is-visible',rolePhase>i);activate(n,rolePhase>i);});
all('#overview-grid button').forEach((n,i)=>n.setAttribute('aria-current',String(i===index)));
if($('#live-status'))$('#live-status').textContent=`${index+1} / ${slides.length} ${slides[index].dataset.title}`;
if(hash)try{history.replaceState(null,'',`#${index+1}${steps(index)?'/'+(cue+1):''}`);}catch{}
}
function go(i,c=0,hash=true){cancel();index=Math.max(0,Math.min(slides.length-1,Number.isFinite(i)?Math.trunc(i):0));cue=Math.max(0,Math.min(steps(index),Number.isFinite(c)?Math.trunc(c):0));rolePhase=kind()==='roles'&&cue?3:0;meaningStage=kind()==='meaning'&&cue?2:0;if(kind()==='cover'&&cue)$('#cover-pet')?.classList.add('greeting');render(hash);}
function next(){if(busy)return;if(cue>=steps(index)){if(index<slides.length-1){go(index+1);lock(500);}return;}cue++;
if(kind()==='roles'){rolePhase=reduced()?3:1;render();lock(3000);if(!reduced()){later(()=>{rolePhase=2;render();},900);later(()=>{rolePhase=3;render();},1900);}return;}
if(kind()==='meaning'&&cue===1){meaningStage=reduced()?2:1;render();all('.meaning-item')[meaningStage]?.classList.add('is-playing');lock(1450);if(!reduced())later(()=>{meaningStage=2;all('.meaning-item').forEach((n,i)=>n.classList.toggle('is-playing',i===2));render();},750);return;}
render();if(kind()==='cover')$('#cover-pet')?.classList.add('greeting');
if(kind()==='gurumi-intro'){if(!reduced())slides[index].classList.add('is-transforming');lock(2300);return;}
if(kind()==='ecosystem'&&cue===1){if(!reduced())slides[index].classList.add('is-overflowing');lock(4200);return;}
if(kind()==='demo'&&cue===2){lock(1250);later(()=>$('.demo-stage')?.classList.add('focus-preview'),reduced()?0:350);return;}
lock(kind()==='closing-position'?1650:kind()==='cover'?650:500);
}
function previous(){if(cue)go(index,cue-1);else if(index)go(index-1,steps(index-1));lock(350);}
const close=()=>{all('.modal').forEach(n=>n.hidden=true);if($('#feedback-copy'))$('#feedback-copy').contentEditable='false';},open=id=>{const n=$('#'+id);if(n){n.hidden=false;n.querySelector('button')?.focus();}};
function settle(){if(reduced())go(index,cue);}
motion.addEventListener('change',settle);
slides.forEach((s,i)=>{const b=document.createElement('button');b.textContent=`${String(i+1).padStart(2,'0')}  ${s.dataset.title}`;b.onclick=()=>{close();go(i);};$('#overview-grid')?.append(b);});
all('[data-close]').forEach(n=>n.onclick=close);
document.addEventListener('click',e=>{if(e.button!==0||e.ctrlKey||e.metaKey||e.altKey||e.shiftKey||e.target.closest('.modal,#blackout,[contenteditable=true]')||all('.modal').some(n=>!n.hidden)||window.getSelection()?.toString().trim())return;if(!e.target.closest('#viewport')&&e.target!==document.body)return;e.preventDefault();next();},true);
document.addEventListener('keydown',e=>{if(e.key==='Escape'){close();if($('#blackout'))$('#blackout').hidden=true;return;}if(e.ctrlKey||e.metaKey||e.altKey||e.target.isContentEditable||/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName))return;const k=e.key.toLowerCase();if(all('.modal').some(n=>!n.hidden))return;if($('#blackout')&&!$('#blackout').hidden){$('#blackout').hidden=true;return;}
if(['arrowright','pagedown',' '].includes(k)){e.preventDefault();if(!e.repeat)next();}else if(['arrowleft','pageup'].includes(k)){e.preventDefault();previous();}else if(k==='home')go(0);else if(k==='end')go(slides.length-1);else if(/^[0-9]$/.test(k))go(k==='0'?9:Number(k)-1);else if(k==='o')open('overview');else if(k==='?')open('help');else if(k==='e'&&kind()==='feedback'){open('feedback-archive');const f=$('#feedback-copy');if(f){f.contentEditable='true';f.focus();}}else if(k==='m'){document.body.classList.toggle('reduced-motion');settle();}else if(k==='b'&&$('#blackout'))$('#blackout').hidden=false;else if(k==='f'){try{Promise.resolve(document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen()).catch(()=>{});}catch{}}});
const feedback=$('#feedback-copy');try{const saved=localStorage.getItem('pitch-v2-feedback');if(feedback&&saved!==null)feedback.textContent=saved;}catch{}
feedback?.addEventListener('input',()=>{try{localStorage.setItem('pitch-v2-feedback',feedback.innerText);}catch{}});
$('#blackout')?.addEventListener('click',()=>$('#blackout').hidden=true);
let touch=null;deck.addEventListener('touchstart',e=>{touch=[e.changedTouches[0].clientX,e.changedTouches[0].clientY];},{passive:true});deck.addEventListener('touchend',e=>{if(!touch)return;const dx=e.changedTouches[0].clientX-touch[0],dy=e.changedTouches[0].clientY-touch[1];touch=null;if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.5){e.preventDefault();dx<0?next():previous();}},{passive:false});
function scale(){deck.style.transform=`scale(${Math.min(innerWidth/1600,innerHeight/900)})`;}
function hash(){const m=location.hash.match(/^#(\d+)(?:\/(\d+))?$/);go(m?Number(m[1])-1:0,m?Number(m[2]||1)-1:0,false);}
window.addEventListener('resize',scale);window.addEventListener('hashchange',hash);scale();hash();
window.PitchDeck=window.AutoPetsDeck=Object.freeze({go,next,previous,titles:slides.map(s=>s.dataset.title),getState:()=>({slide:index+1,cue,sceneId:kind(),rolePhase,meaningStage,busy}),getScenes:()=>slides.map(s=>({id:s.dataset.sceneId,title:s.dataset.title,steps:Number(s.dataset.steps)}))});
window.prepareForExport=async({sceneId,step=0}={})=>{document.body.classList.add('reduced-motion');go(sceneId?slides.findIndex(s=>s.dataset.sceneId===sceneId):index,sceneId?step:cue);await document.fonts.ready;await Promise.all(all('img').map(i=>i.decode().catch(()=>{})));};
})();

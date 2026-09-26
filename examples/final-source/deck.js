"use strict";
(()=>{
const slides=[...document.querySelectorAll(".slide")],titles=slides.map(s=>s.dataset.title);
const get=id=>document.getElementById(id);
const find=kind=>slides.findIndex(s=>s.classList.contains(kind));
const COVER=find("cover"),ROLES=find("roles"),DEMO=find("demo"),MEANING=find("meaning"),FEEDBACK=find("feedback"),GURUMI=find("gurumi-intro"),ECOSYSTEM=find("ecosystem"),ROUTING=find("routing-why"),CLOSING=find("closing-position"),LAST=slides.length-1;
const lastSteps=slides.map((s,i)=>Number(s.dataset.steps)||(i===MEANING?5:i===COVER||i===ROLES?1:i===DEMO?2:0));
let index=0,step=0,rolePhase=0,meaningStage=0,busy=false,timers=[],lastFocus=null;
const motionQuery=matchMedia("(prefers-reduced-motion: reduce)");
const feedbackKey="autopets-presentation-feedback-v1";
const reduced=()=>document.body.classList.contains("reduced-motion")||motionQuery.matches;
function schedule(callback,ms){timers.push(setTimeout(callback,ms));}
function clearPlayback(){timers.forEach(clearTimeout);timers=[];busy=false;get("deck").setAttribute("aria-busy","false");get("cover-pet").classList.remove("greeting");document.querySelector(".demo-stage").classList.remove("focus-preview");document.querySelectorAll(".meaning-item").forEach(x=>x.classList.remove("is-playing"));slides[GURUMI].classList.remove("is-transforming");slides[ECOSYSTEM].classList.remove("is-overflowing");}
function lockFor(ms){busy=true;get("deck").setAttribute("aria-busy","true");schedule(()=>{busy=false;get("deck").setAttribute("aria-busy","false");},reduced()?60:ms);}
function render(writeHash=true){
slides.forEach((s,i)=>{const active=index===i;s.classList.toggle("is-active",active);s.setAttribute("aria-hidden",String(!active));s.inert=!active;});
slides.forEach((s,i)=>s.dataset.storyStep=String(index===i?step:0));
get("deck").dataset.slide=String(index+1);get("deck").dataset.cue=String(step);get("deck").dataset.total=String(slides.length);
document.querySelectorAll("[data-routing-panel]").forEach((p,i)=>{const active=i===(index===ROUTING?step:0);p.classList.toggle("is-current",active);p.setAttribute("aria-hidden",String(!active));p.inert=!active;});
const closingActive=index>=CLOSING,closingStage=closingActive?(index-CLOSING)*2+step:0;
const canvas=get("closing-canvas");canvas.classList.toggle("is-active",closingActive);canvas.dataset.closing=String(closingStage);canvas.setAttribute("aria-hidden",String(!closingActive));canvas.inert=!closingActive;
["closing-position-view","closing-media-view","closing-tools-view","closing-autopets"].forEach((cls,i)=>{const p=canvas.querySelector("."+cls),active=closingActive&&(i===3?closingStage===6:Math.floor(closingStage/2)===i);p.setAttribute("aria-hidden",String(!active));p.inert=!active;});
canvas.querySelector(".global-media-anchor").setAttribute("aria-hidden",String(!closingActive||closingStage===6));
for(const selector of [".ai-bridge",".expanded-copy",".role-summary"])canvas.querySelector(selector).setAttribute("aria-hidden",String(!closingActive||closingStage!==1));
canvas.querySelector(".feedback-quote").setAttribute("aria-hidden",String(!closingActive||closingStage!==0));
for(const [selector,active] of [[".gurumi-photo-wrap",index===GURUMI&&step===0],[".gurumi-reveal",index===GURUMI&&step===1],[".ecosystem-base",index===ECOSYSTEM&&step<2],[".eco-pet-question",index===ECOSYSTEM&&step<2],[".ecosystem-overflow",index===ECOSYSTEM&&step===1],[".eco-recommend",index===ECOSYSTEM&&step===2]]){const p=document.querySelector(selector);p.setAttribute("aria-hidden",String(!active));p.inert=!active;}
const demoStep=index===DEMO?step:0;
document.querySelectorAll(".demo-panel").forEach((p,i)=>{const active=i===demoStep;p.classList.toggle("is-current",active);p.setAttribute("aria-hidden",String(!active));p.inert=!active;});
document.querySelectorAll("[data-demo-step]").forEach((p,i)=>p.setAttribute("aria-current",i===demoStep?"step":"false"));
document.querySelectorAll("[data-pet-stage]").forEach((p,i)=>{p.classList.toggle("is-selected",i===meaningStage);p.setAttribute("aria-current",String(i===meaningStage));});
document.querySelectorAll("[data-meaning-panel]").forEach((p,i)=>{const active=i===(index===MEANING?Math.max(0,step-1):0);p.classList.toggle("is-current",active);p.setAttribute("aria-hidden",String(!active));p.inert=!active;});
get("guide-intro").hidden=rolePhase>0;get("guide-conversation").hidden=rolePhase===0;slides[ROLES].classList.toggle("is-recommended",rolePhase===3);
document.querySelectorAll("[data-guide-beat]").forEach((p,i)=>{p.classList.toggle("is-visible",rolePhase>i);p.setAttribute("aria-hidden",String(rolePhase<=i));});
[...get("overview-grid").children].forEach((p,i)=>p.setAttribute("aria-current",String(i===index)));
get("live-status").textContent=(index+1)+" / "+slides.length+" "+titles[index];
if(writeHash)try{history.replaceState(null,"","#"+(index+1)+(lastSteps[index]?"/"+(step+1):""));}catch{}
}
function go(to,toStep=0,writeHash=true){
clearPlayback();index=Math.max(0,Math.min(LAST,Number.isFinite(to)?Math.trunc(to):0));step=Math.max(0,Math.min(lastSteps[index],Number.isFinite(toStep)?Math.trunc(toStep):0));
rolePhase=index===ROLES&&step?3:0;meaningStage=index===MEANING&&step?2:0;
if(index!==FEEDBACK)setEditing(false);if(index===COVER&&step)get("cover-pet").classList.add("greeting");render(writeHash);
}
function next(){
if(busy)return;
if(index===COVER&&!step){step=1;get("cover-pet").classList.add("greeting");render();lockFor(650);return;}
if(index===ROLES&&!step){step=1;rolePhase=reduced()?3:1;render();lockFor(3000);if(!reduced()){schedule(()=>{rolePhase=2;render();},900);schedule(()=>{rolePhase=3;render();},1900);}return;}
if(index===DEMO&&step<2){step++;render();if(step===2){lockFor(1250);schedule(()=>document.querySelector(".demo-stage").classList.add("focus-preview"),reduced()?0:350);}else lockFor(450);return;}
if(index===MEANING&&!step){step=1;meaningStage=reduced()?2:1;render();document.querySelectorAll(".meaning-item")[meaningStage].classList.add("is-playing");lockFor(1450);if(!reduced())schedule(()=>{meaningStage=2;document.querySelectorAll(".meaning-item").forEach((x,i)=>x.classList.toggle("is-playing",i===2));render();},750);return;}
if(index===MEANING&&step<lastSteps[MEANING]){step++;render();lockFor(650);return;}
if(index===GURUMI&&!step){step=1;render();if(!reduced())slides[GURUMI].classList.add("is-transforming");lockFor(2300);schedule(()=>slides[GURUMI].classList.remove("is-transforming"),reduced()?0:2300);return;}
if(index===ECOSYSTEM&&!step){step=1;render();if(!reduced())slides[ECOSYSTEM].classList.add("is-overflowing");lockFor(4200);schedule(()=>slides[ECOSYSTEM].classList.remove("is-overflowing"),reduced()?0:4200);return;}
if(step<lastSteps[index]){step++;render();lockFor(index===CLOSING?1650:index>=CLOSING?1100:1000);return;}
if(index<LAST){const intro=index===0;go(index+1);lockFor(index>=CLOSING?1100:intro?700:500);}
}
function previous(){if(step)go(index,step-1);else if(index)go(index-1,lastSteps[index-1]);lockFor(350);}
function setEditing(enabled){const field=get("feedback-copy");field.contentEditable=String(enabled);field.setAttribute("role",enabled?"textbox":"group");document.body.classList.toggle("feedback-editing",enabled);if(enabled)field.focus();else if(document.activeElement===field)field.blur();}
function open(id){lastFocus=document.activeElement;get(id).hidden=false;get(id).querySelector("button")?.focus();}
function close(id){get(id).hidden=true;if(id==="feedback-archive")setEditing(false);if(lastFocus?.isConnected&&!lastFocus.closest("[inert]"))lastFocus.focus();}
function toggle(id){get(id).hidden?open(id):close(id);}
async function fullscreen(){try{document.fullscreenElement?await document.exitFullscreen():await document.documentElement.requestFullscreen();}catch{}}
function settleMotion(){if(!reduced())return;const current=index;clearPlayback();if(current===ROLES&&step)rolePhase=3;if(current===MEANING&&step)meaningStage=2;if(current===COVER&&step)get("cover-pet").classList.add("greeting");render();}
function toggleMotion(){document.body.classList.toggle("reduced-motion");try{localStorage.setItem("autopets-reduced-motion",String(document.body.classList.contains("reduced-motion")))}catch{}settleMotion();}
motionQuery.addEventListener("change",settleMotion);
titles.forEach((title,i)=>{const button=document.createElement("button"),num=document.createElement("span");num.textContent=String(i+1).padStart(2,"0");button.append(num,document.createTextNode(title));button.addEventListener("click",()=>{close("overview");go(i);});get("overview-grid").append(button);});
document.querySelectorAll("[data-close]").forEach(x=>x.addEventListener("click",()=>close(x.dataset.close)));
document.querySelectorAll(".modal").forEach(x=>x.addEventListener("click",event=>{if(event.target===x)close(x.id);}));
document.addEventListener("click",event=>{
if(event.button!==0||event.ctrlKey||event.metaKey||event.altKey||event.shiftKey)return;
if(event.target.closest(".modal,#blackout,[contenteditable=true]"))return;
if(!get("overview").hidden||!get("help").hidden||!get("feedback-archive").hidden||!get("blackout").hidden)return;
if(window.getSelection()?.toString().trim())return;
if(!event.target.closest("#viewport")&&event.target!==document.body)return;
event.preventDefault();event.stopPropagation();next();
},true);
try{const saved=localStorage.getItem(feedbackKey);if(saved!==null)get("feedback-copy").textContent=saved;if(localStorage.getItem("autopets-reduced-motion")==="true")document.body.classList.add("reduced-motion");}catch{}
get("feedback-copy").addEventListener("input",()=>{try{localStorage.setItem(feedbackKey,get("feedback-copy").innerText)}catch{}});
get("feedback-copy").addEventListener("paste",event=>{event.preventDefault();const selection=window.getSelection();if(!selection.rangeCount)return;const range=selection.getRangeAt(0),text=document.createTextNode(event.clipboardData.getData("text/plain"));range.deleteContents();range.insertNode(text);range.setStartAfter(text);range.collapse(true);selection.removeAllRanges();selection.addRange(range);get("feedback-copy").dispatchEvent(new Event("input"));});
document.addEventListener("keydown",event=>{
if(event.target.isContentEditable||/^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName)){if(event.key==="Escape"){event.preventDefault();close("feedback-archive");}return;}
if(event.ctrlKey||event.metaKey||event.altKey)return;
if(!get("blackout").hidden){event.preventDefault();get("blackout").hidden=true;return;}
const modal=[get("overview"),get("help"),get("feedback-archive")].find(x=>!x.hidden);
if(modal){if(event.key==="Escape"){event.preventDefault();close(modal.id);}if(event.key==="Tab"){const elements=[...modal.querySelectorAll("button,a")],first=elements[0],last=elements.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}return;}
const key=event.key.toLowerCase();
if(["arrowright","pagedown"," "].includes(key)){event.preventDefault();if(!event.repeat)next();}
else if(["arrowleft","pageup"].includes(key)){event.preventDefault();previous();}
else if(key==="home"){event.preventDefault();go(0);}
else if(key==="end"){event.preventDefault();go(LAST);}
else if(/^[0-9]$/.test(key)){event.preventDefault();go(key==="0"?9:Number(key)-1);}
else if(key==="f"){event.preventDefault();fullscreen();}
else if(key==="o"){event.preventDefault();toggle("overview");}
else if(key==="m"){event.preventDefault();toggleMotion();}
else if(key==="e"&&index===FEEDBACK){event.preventDefault();open("feedback-archive");setEditing(true);}
else if(key==="b"){event.preventDefault();get("blackout").hidden=false;}
else if(key==="?"){event.preventDefault();toggle("help");}
});
get("blackout").addEventListener("click",()=>get("blackout").hidden=true);
let touchStart=null;
get("deck").addEventListener("touchstart",event=>{if(event.target.closest("[contenteditable=true]"))return;touchStart={x:event.changedTouches[0].clientX,y:event.changedTouches[0].clientY};},{passive:true});
get("deck").addEventListener("touchend",event=>{if(!touchStart)return;const dx=event.changedTouches[0].clientX-touchStart.x,dy=event.changedTouches[0].clientY-touchStart.y;touchStart=null;if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.5){event.preventDefault();dx<0?next():previous();}},{passive:false});
function scale(){get("deck").style.transform="scale("+Math.min(innerWidth/1600,innerHeight/900)+")";}
function readHash(){const match=location.hash.match(/^#(\d+)(?:\/(\d+))?$/);go(match?Number(match[1])-1:0,match?Number(match[2]||1)-1:0,false);}
window.addEventListener("resize",scale);window.addEventListener("hashchange",readHash);scale();readHash();
window.AutoPetsDeck=Object.freeze({go,next,previous,titles,getState:()=>({slide:index+1,step:index===DEMO?step+1:null,cue:index===DEMO?0:step,meaningStage,meaningPanel:index===MEANING?Math.max(0,step-1):null,rolePhase,busy})});
})();

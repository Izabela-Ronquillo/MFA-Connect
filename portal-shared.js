const API = 'https://mfaconnect.vercel.app/';
var D=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],FD=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
function apiBase(){try{return (typeof API!=='undefined'&&API)?String(API).replace(/\/+$/,''):''}catch(e){return ''}}
async function apiFetch(path,opts){var b=apiBase(); if(!b) throw new Error('API base not configured'); opts=opts||{}; opts.headers=Object.assign({'Content-Type':'application/json'},opts.headers||{}); var r=await fetch(b+path,opts); var ct=(r.headers.get('content-type')||''); var j=ct.indexOf('application/json')>=0?await r.json().catch(function(){return {}}):{}; if(!r.ok||j.ok===false) throw new Error((j&&j.error)||('HTTP '+r.status)); return j;}
async function syncDBFromServer(){try{var j=await apiFetch('/api/db'); if(j&&j.data){ DB=normalizeDB(j.data); try{localStorage.setItem('mfa_portal_db',JSON.stringify(DB))}catch(e){} } }catch(e){} return DB;}
function saveDBRemote(){try{var b=apiBase(); if(!b) return; fetch(b+'/api/db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(DB)}).catch(function(){})}catch(e){}}
var $=function(id){return document.getElementById(id)};
var peso=function(n){return '\u20B1'+Number(n||0).toLocaleString('en-PH',{minimumFractionDigits:2})};
var esc=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]})};
var today=function(){return new Date().toLocaleDateString('en-PH',{year:'numeric',month:'short',day:'numeric'})};
var SESSION_MAX_AGE=1000*60*60*8;
function isStrongPassword(pw){pw=String(pw||'');return pw.length>=10&&/[a-z]/.test(pw)&&/[A-Z]/.test(pw)&&/[0-9]/.test(pw)&&/[^A-Za-z0-9]/.test(pw)}
function passwordPolicyMessage(){return 'Password must be at least 10 characters and include uppercase, lowercase, number, and special character.'}
function flash(msg,type){type=type||'ok';var el=$('flash');if(!el)return;el.innerHTML=msg?'<div class="msg '+esc(type)+'">'+esc(msg)+'</div>':'';if(msg)setTimeout(function(){if(el&&el.textContent===msg)el.innerHTML=''},3500)}
function onDay(s,d){var m=String(s||'').match(/(\w{3}) \u2013 (\w{3})/);if(m){var a=D.indexOf(m[1]),b=D.indexOf(m[2]);if(a>=0&&b>=0)return d>=a&&d<=b}return String(s||'').indexOf(D[d])>=0}
function v(g){return g==null?'<span class="na">\u2013</span>':esc(g)}
var DEFAULT={school:{name:'Marvelous Faith Academy',tagline:'Keep the Faith Alive!',address:'125 FTM Compound, Mambog 4, Bacoor City, Cavite, Philippines, 4102',phone:'0917 123 4567',email:'mfaonline@mfabacoor.net',about:'MFA Connect portal.'},
 accounts:[],students:{},teacherSched:[],gradeQueue:[],documents:[],teacherAssignments:[],site:{heroTitle:'Welcome to Marvelous Faith Academy',heroSub:'',historyTitle:'Our History',historyText:'',mission:'',vision:'',contact:'',hymn:'',about:'',footer:'',announcements:[]},_seq:1};
function clone(o){return JSON.parse(JSON.stringify(o))}
function normalizeDB(d){
  var base=clone(DEFAULT); if(!d||typeof d!=='object') return base;
  d.school=Object.assign({},base.school,d.school||{});
  d.accounts=Array.isArray(d.accounts)?d.accounts.filter(function(a){return a&&a.id&&a.role&&a.name}).map(function(a){return Object.assign({pw:'',first:false},a)}):base.accounts;
  d.students=d.students&&typeof d.students==='object'?d.students:base.students;
  d.teacherSched=Array.isArray(d.teacherSched)?d.teacherSched:base.teacherSched;
  d.gradeQueue=Array.isArray(d.gradeQueue)?d.gradeQueue:base.gradeQueue;
  d.documents=Array.isArray(d.documents)?d.documents:base.documents;
  d.teacherAssignments=Array.isArray(d.teacherAssignments)?d.teacherAssignments:base.teacherAssignments;
  d.site=Object.assign({},base.site,d.site||{});
  if(!Array.isArray(d.site.announcements)) d.site.announcements=[];
  d._seq=typeof d._seq==='number'?d._seq:base._seq;
  return d;
}
function loadDB(){
  try{var raw=localStorage.getItem('mfa_portal_db');if(!raw)return clone(DEFAULT);var d=JSON.parse(raw);if(!d||!Array.isArray(d.accounts))return clone(DEFAULT);return normalizeDB(d)}catch(e){return clone(DEFAULT)}
}
function saveDB(){try{localStorage.setItem('mfa_portal_db',JSON.stringify(DB))}catch(e){} saveDBRemote();}
var DB=loadDB(),me=null,sDay=null;
function acctById(id){id=String(id==null?'':id);for(var i=0;i<DB.accounts.length;i++){if(String(DB.accounts[i].id)===id)return DB.accounts[i]}return null}
function ensureStudent(id){id=String(id||'');if(!DB.students[id])DB.students[id]={sched:[],att:[],fees:{total:0,pay:[]},grades:{}};var st=DB.students[id];if(!Array.isArray(st.sched))st.sched=[];if(!Array.isArray(st.att))st.att=[];if(!st.fees||typeof st.fees!=='object')st.fees={total:0,pay:[]};if(typeof st.fees.total!=='number')st.fees.total=Number(st.fees.total)||0;if(!Array.isArray(st.fees.pay))st.fees.pay=[];if(!st.grades||typeof st.grades!=='object')st.grades={};return st}
function openView(v){var els=document.querySelectorAll('.nv');for(var i=0;i<els.length;i++)els[i].classList.toggle('on',els[i].getAttribute('data-v')===v);if(VIEWS&&VIEWS[v])VIEWS[v]()}
function setMain(t,s,h){if($('ttl'))$('ttl').textContent=t||'';if($('subh'))$('subh').textContent=s||'';if($('views'))$('views').innerHTML=h||''}
function ban(){if(!me||!DB||!DB.school)return '';return '<div class="c ban s6"><h3>'+esc(String(me.role||'').toUpperCase())+'</h3><h2>'+esc(me.name||'')+'</h2><p>'+esc(me.level||me.subject||DB.school.name||'')+'</p><p>'+esc(me.adviser?'Adviser: '+me.adviser:(DB.school.tagline||''))+'</p></div>'}
function buildShell(){if(!me||!Array.isArray(NAV)||!$('nav'))return;$('mn').textContent=me.name||'';$('mr').textContent=(me.role||'').charAt(0).toUpperCase()+(me.role||'').slice(1);$('mid').textContent=me.id||'';$('nav').innerHTML=NAV.map(function(n,i){return '<button type="button" class="nv'+(i===0?' on':'')+'" data-v="'+esc(n[0])+'"><b>'+esc(n[1])+'</b>'+esc(n[2])+'</button>'}).join('');$('nav').onclick=function(e){var b=e.target;while(b&&b!==this&&!b.classList.contains('nv'))b=b.parentNode;if(b&&b.classList.contains('nv')){openView(b.getAttribute('data-v'));closeSidebar()}};openView(NAV[0][0])}
function refreshPortalView(){try{if(!me)return;var fresh=acctById(me.id);if(fresh)me=fresh;if(typeof buildShell==='function'&&$('nav')){var cur=document.querySelector('.nv.on');var v=cur?cur.getAttribute('data-v'):(NAV&&NAV[0]&&NAV[0][0]);buildShell();if(v&&VIEWS&&VIEWS[v])openView(v);}}catch(e){}}
function checkSession(role){try{var s=JSON.parse(sessionStorage.getItem('mfa_session')||'null');if(!s||s.role!==role||!s.id||!s.ts||(Date.now()-s.ts)>SESSION_MAX_AGE){sessionStorage.removeItem('mfa_session');location.href='student-portal-mfa.html';return false}var a=acctById(s.id);if(!a||a.role!==role){sessionStorage.removeItem('mfa_session');location.href='student-portal-mfa.html';return false}me=a;return true}catch(e){sessionStorage.removeItem('mfa_session');location.href='student-portal-mfa.html';return false}}
function signOut(){try{sessionStorage.removeItem('mfa_session')}catch(e){}location.href='student-portal-mfa.html'}
function toggleSidebar(){var side=document.querySelector('.side'),overlay=document.querySelector('.sidebar-overlay');if(!side||!overlay)return;var isOpen=side.classList.toggle('open');overlay.classList.toggle('open',isOpen)}
function closeSidebar(){var side=document.querySelector('.side'),overlay=document.querySelector('.sidebar-overlay');if(!side||!overlay)return;side.classList.remove('open');overlay.classList.remove('open')}
document.addEventListener('DOMContentLoaded',function(){
  if(document.querySelector('.app')){
    if(!document.querySelector('.hamburger')){var hamburger=document.createElement('button');hamburger.className='hamburger noprint';hamburger.type='button';hamburger.innerHTML='&#9776;';hamburger.setAttribute('aria-label','Toggle navigation');hamburger.onclick=toggleSidebar;document.body.appendChild(hamburger)}
    if(!document.querySelector('.sidebar-overlay')){var overlay=document.createElement('div');overlay.className='sidebar-overlay';overlay.onclick=closeSidebar;document.body.appendChild(overlay)}
  }
});

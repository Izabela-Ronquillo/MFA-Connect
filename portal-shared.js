var D=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],FD=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
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
 accounts:[{id:'admin-001',pw:'Temp#Admin1',role:'admin',name:'Ms. Angela Reyes',first:true},{id:'registrar-001',pw:'Temp#Regis1',role:'registrar',name:'Mrs. Liza Bautista',first:true},{id:'cashier-001',pw:'Temp#Cash1',role:'cashier',name:'Mr. Carlo Santos',first:true},{id:'teacher-001',pw:'Temp#Teach1',role:'teacher',name:'Mr. Roberto Garcia',subject:'Mathematics',first:true},{id:'2023-0142',pw:'Temp#Stud1',role:'student',name:'Juan Miguel Dela Cruz',level:'Grade 8 \u2013 St. Matthew',sy:'2025\u20132026',adviser:'Mr. Roberto Garcia',first:true}],
 students:{'2023-0142':{sched:[['7:30 \u2013 8:30 AM','Filipino','Mon \u00B7 Wed \u00B7 Fri','Rm 201','Mrs. Reyes'],['8:30 \u2013 9:30 AM','Mathematics','Mon \u2013 Fri','Rm 201','Mr. Garcia'],['9:45 \u2013 10:45 AM','Science','Mon \u00B7 Tue \u00B7 Thu','Science Lab','Ms. Villanueva'],['10:45 \u2013 11:45 AM','English','Mon \u2013 Fri','Rm 201','Mrs. Cruz'],['1:00 \u2013 2:00 PM','Araling Panlipunan','Tue \u00B7 Thu','Rm 201','Mr. Bautista'],['2:00 \u2013 3:00 PM','MAPEH','Wed \u00B7 Fri','Gym','Coach Ramos'],['3:00 \u2013 4:00 PM','Christian Living','Tue','Chapel','Pastor Lim']],
 att:[['Nov 3','Present'],['Oct 31','Present'],['Oct 30','Late'],['Oct 29','Present'],['Oct 28','Present'],['Oct 27','Absent'],['Oct 24','Present'],['Oct 23','Present'],['Oct 22','Present'],['Oct 21','Late']],
 fees:{total:42500,pay:[['Jun 10, 2025','OR-004512','Enrollment / Downpayment',15000],['Aug 5, 2025','OR-004877','Monthly Installment',5500],['Sep 8, 2025','OR-005103','Monthly Installment',5500],['Oct 6, 2025','OR-005390','Monthly Installment',5500]]},
 grades:{'2025\u20132026':[['Filipino',88,90,null,null,null],['English',91,89,null,null,null],['Mathematics',84,null,null,null,null],['Science',86,88,null,null,null],['Araling Panlipunan',90,92,null,null,null],['MAPEH',93,94,null,null,null],['Edukasyon sa Pagpapakatao',95,94,null,null,null],['TLE',89,91,null,null,null],['Christian Living',96,97,null,null,null]]}}},
 teacherSched:[['7:30 \u2013 8:30 AM','Mathematics 8','Grade 8 \u2013 St. Matthew','Rm 201','Mon \u2013 Fri'],['8:30 \u2013 9:30 AM','Math Remediation','Grade 8 \u2013 St. Mark','Rm 202','Tue \u00B7 Thu']],
 gradeQueue:[{id:1,studentId:'2023-0142',student:'Juan Miguel Dela Cruz',subject:'Mathematics',quarter:2,grade:87,teacher:'Mr. Roberto Garcia',status:'pending',sy:'2025\u20132026'}],
 documents:[{id:1,student:'Juan Miguel Dela Cruz',studentId:'2023-0142',type:'Registration Form',status:'On file',date:'Jun 5, 2025'},{id:2,student:'Juan Miguel Dela Cruz',studentId:'2023-0142',type:'Certificate of Enrollment',status:'Available on request',date:'Jun 10, 2025'}],teacherAssignments:[],site:{heroTitle:'Welcome to Marvelous Faith Academy',heroSub:'',historyTitle:'Our History',historyText:'',mission:'',vision:'',contact:'',hymn:'',about:'',footer:'',announcements:[]},_seq:10};
function clone(o){return JSON.parse(JSON.stringify(o))}
var LEGACY_PW={'admin-001':'admin123','registrar-001':'registrar123','cashier-001':'cashier123','teacher-001':'teacher123','2023-0142':'temp1234'};
var DEMO_TEMP={'admin-001':'Temp#Admin1','registrar-001':'Temp#Regis1','cashier-001':'Temp#Cash1','teacher-001':'Temp#Teach1','2023-0142':'Temp#Stud1'};
function migrateLegacyAccounts(db){
  if(!db||!Array.isArray(db.accounts)) return db;
  for(var i=0;i<db.accounts.length;i++){
    var a=db.accounts[i]; if(!a||!a.id) continue;
    if(LEGACY_PW[a.id] && a.pw===LEGACY_PW[a.id]){ a.pw=DEMO_TEMP[a.id]||a.pw; a.first=true; }
  }
  return db;
}
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
  return migrateLegacyAccounts(d);
}
function loadDB(){
  try{var raw=localStorage.getItem('mfa_portal_db');if(!raw)return clone(DEFAULT);var d=JSON.parse(raw);if(!d||!Array.isArray(d.accounts))return clone(DEFAULT);return normalizeDB(d)}catch(e){return clone(DEFAULT)}
}
function saveDB(){try{localStorage.setItem('mfa_portal_db',JSON.stringify(DB))}catch(e){}}
var DB=loadDB(),me=null,sDay=null;
function acctById(id){id=String(id==null?'':id);for(var i=0;i<DB.accounts.length;i++){if(String(DB.accounts[i].id)===id)return DB.accounts[i]}return null}
function ensureStudent(id){id=String(id||'');if(!DB.students[id])DB.students[id]={sched:[],att:[],fees:{total:0,pay:[]},grades:{}};var st=DB.students[id];if(!Array.isArray(st.sched))st.sched=[];if(!Array.isArray(st.att))st.att=[];if(!st.fees||typeof st.fees!=='object')st.fees={total:0,pay:[]};if(typeof st.fees.total!=='number')st.fees.total=Number(st.fees.total)||0;if(!Array.isArray(st.fees.pay))st.fees.pay=[];if(!st.grades||typeof st.grades!=='object')st.grades={};return st}
function openView(v){var els=document.querySelectorAll('.nv');for(var i=0;i<els.length;i++)els[i].classList.toggle('on',els[i].getAttribute('data-v')===v);if(VIEWS&&VIEWS[v])VIEWS[v]()}
function setMain(t,s,h){if($('ttl'))$('ttl').textContent=t||'';if($('subh'))$('subh').textContent=s||'';if($('views'))$('views').innerHTML=h||''}
function ban(){if(!me||!DB||!DB.school)return '';return '<div class="c ban s6"><h3>'+esc(String(me.role||'').toUpperCase())+'</h3><h2>'+esc(me.name||'')+'</h2><p>'+esc(me.level||me.subject||DB.school.name||'')+'</p><p>'+esc(me.adviser?'Adviser: '+me.adviser:(DB.school.tagline||''))+'</p></div>'}
function buildShell(){if(!me||!Array.isArray(NAV)||!$('nav'))return;$('mn').textContent=me.name||'';$('mr').textContent=(me.role||'').charAt(0).toUpperCase()+(me.role||'').slice(1);$('mid').textContent=me.id||'';$('nav').innerHTML=NAV.map(function(n,i){return '<button type="button" class="nv'+(i===0?' on':'')+'" data-v="'+esc(n[0])+'"><b>'+esc(n[1])+'</b>'+esc(n[2])+'</button>'}).join('');$('nav').onclick=function(e){var b=e.target;while(b&&b!==this&&!b.classList.contains('nv'))b=b.parentNode;if(b&&b.classList.contains('nv')){openView(b.getAttribute('data-v'));closeSidebar()}};openView(NAV[0][0])}
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

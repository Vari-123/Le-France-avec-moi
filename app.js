const lessons=[
["Week 1","Survival French","Greetings, introductions, numbers, questions and polite phrases"],
["Week 2","Everyday life","Family, food, shopping, time and routines"],
["Week 3","Travel French","Hotels, transport, directions and emergencies"],
["Week 4","Social French","Friends, hobbies, invitations and small talk"],
["Week 5","Work French","Office vocabulary, meetings, requests and emails"],
["Week 6","Grammar foundation","Present, past, future, negatives and questions"],
["Week 7","Conversation","Opinions, explanations, preferences and stories"],
["Week 8","Listening","Natural speed, contractions and common spoken French"],
["Week 9","Real situations","Restaurant, hotel, doctor, bank and phone"],
["Week 10","Fluency building","Connectors, longer answers and follow-up questions"],
["Week 11","Confidence","Role-play and spontaneous speaking"],
["Week 12","A2 bridge","Longer conversations and practical grammar"],
["Days 85–90","Final challenge","Six-day speaking challenge"]
];
const phrases=[
["Bonjour !","Hello!"],["Comment allez-vous ?","How are you?"],["Je m'appelle…","My name is…"],["Enchanté.","Nice to meet you."],
["Je ne comprends pas.","I don't understand."],["Pouvez-vous répéter ?","Can you repeat?"],["Parlez-vous anglais ?","Do you speak English?"],
["Je voudrais un café, s'il vous plaît.","I would like a coffee, please."],["Combien ça coûte ?","How much does it cost?"],["Où est la gare ?","Where is the station?"],
["Je travaille dans une entreprise.","I work in a company."],["J'apprends le français.","I am learning French."],["J'aime beaucoup cette ville.","I really like this city."],
["Qu'est-ce que vous faites ce week-end ?","What are you doing this weekend?"],["Je suis désolé.","I'm sorry."],["Merci beaucoup.","Thank you very much."]
];
const scenarios={
"☕ Café":{start:"Bonjour ! Qu'est-ce que vous désirez ?",hint:"Order a coffee politely.",replies:["Je voudrais un café, s'il vous plaît.","Et avec du lait, s'il vous plaît.","L'addition, s'il vous plaît."]},
"🏨 Hotel":{start:"Bonjour, vous avez une réservation ?",hint:"Tell me your name and ask about the room.",replies:["Oui, j'ai une réservation.","La chambre est-elle prête ?","À quelle heure est le petit-déjeuner ?"]},
"💼 Office":{start:"Bonjour ! Comment puis-je vous aider ?",hint:"Explain that you are learning French.",replies:["J'apprends le français.","Pouvez-vous parler plus lentement ?","Je vais vérifier."]},
"🛒 Shopping":{start:"Bonjour, je peux vous aider ?",hint:"Ask the price and say you are looking.",replies:["Combien ça coûte ?","Je regarde seulement, merci.","Avez-vous une autre taille ?"]},
"🚆 Travel":{start:"Bonjour ! Où allez-vous ?",hint:"Ask where the station is.",replies:["Où est la gare, s'il vous plaît ?","C'est loin d'ici ?","Merci beaucoup !"]},
"👋 Small talk":{start:"Bonjour ! Comment allez-vous aujourd'hui ?",hint:"Answer and ask the person back.",replies:["Je vais bien, merci. Et vous ?","Je travaille aujourd'hui.","J'apprends le français."]}
};
let state=JSON.parse(localStorage.getItem("frenchGv2")||'{"days":[],"completed":[],"words":{},"goal":20}');
let targetIndex=0,currentScenario=null,chatTurn=0;
const $=id=>document.getElementById(id);
function save(){localStorage.setItem("frenchGv2",JSON.stringify(state));updateUI()}
function today(){return new Date().toISOString().slice(0,10)}
function streak(){let n=0,d=new Date();while(state.days.includes(d.toISOString().slice(0,10))){n++;d.setDate(d.getDate()-1)}return n}
function updateUI(){
 $("streak").textContent="🔥 "+streak();
 const done=Math.min(5,state.completed.filter(x=>x.startsWith(today()+"-")).length);
 $("sessionStatus").textContent=`${done} / 5 completed`;$("sessionBar").style.width=(done*20)+"%";
 $("courseBar").style.width=Math.min(100,(state.completed.length/90)*100)+"%";
 $("stats").textContent=`${state.days.length} practice days · ${Object.keys(state.words).length} vocabulary items reviewed · ${state.completed.length} activities completed · ${state.goal} minutes/day`;
}
function showScreen(id){
 document.querySelectorAll(".screen").forEach(x=>x.classList.remove("active"));$(id).classList.add("active");
 if(id==="coach")renderScenarios();if(id==="review")renderReview();if(id==="course")renderCourse();if(id==="settings")updateUI();
 window.scrollTo(0,0)
}
function mark(kind){
 const key=today()+"-"+kind;if(!state.completed.includes(key))state.completed.push(key);
 if(!state.days.includes(today()))state.days.push(today());save()
}
function startDaily(){showScreen("daily");renderDaily()}
function renderDaily(){
 const day=(new Date().getDate()%30)||1;
 const tasks=[
 ["warm","🔥 Warm-up","Say: Bonjour ! Je m'appelle… J'apprends le français.","speak"],
 ["words","🧠 Vocabulary","Review 5 useful words.","review"],
 ["listen","🔊 Listening","Listen to today's phrase and repeat it.","speak"],
 ["talk","🎙️ Speaking","Say the target sentence into the microphone.","speak"],
 ["chat","💬 Conversation","Complete one short French scenario.","coach"]
 ];
 $("dailyBody").innerHTML=`<div class="lessonCard"><div class="eyebrow">DAY ${day}</div><h2>20-minute French session</h2><p>Do these five small activities. You don't need to be perfect.</p></div>`+
 tasks.map(t=>`<div class="lessonCard"><b>${t[1]}</b><p>${t[2]}</p><button class="secondary" onclick="mark('${t[0]}');showScreen('${t[3]}')">Practice →</button></div>`).join("");
}
function renderScenarios(){
 $("scenarioGrid").innerHTML=Object.keys(scenarios).map(k=>`<button class="scenario" onclick="startScenario('${k}')">${k}<small>${scenarios[k].hint}</small></button>`).join("");
}
function startScenario(name){
 currentScenario=scenarios[name];chatTurn=0;$("chat").innerHTML="";
 $("chatControls").style.display="grid";addBubble("coach",currentScenario.start,"French coach");$("chatInput").focus()
}
function addBubble(type,text,small){$("chat").innerHTML+=`<div class="bubble ${type}">${text}<small>${small}</small></div>`}
function sendChat(){
 if(!currentScenario)return;let v=$("chatInput").value.trim();if(!v)return;
 addBubble("user",v,"You");$("chatInput").value="";
 const reply=currentScenario.replies[Math.min(chatTurn,currentScenario.replies.length-1)];
 chatTurn++;
 setTimeout(()=>{addBubble("coach",reply,"Coach");if(chatTurn>=currentScenario.replies.length){mark("chat");addBubble("coach","Très bien ! 🎉 Now try the same idea without looking at the suggested answer.","Feedback")}},350)
}
function speakInput(){let v=$("chatInput").value.trim();if(v)speak(v)}
function speak(text){const u=new SpeechSynthesisUtterance(text);u.lang="fr-FR";u.rate=.86;speechSynthesis.cancel();speechSynthesis.speak(u)}
function speakTarget(){speak(phrases[targetIndex][0])}
function nextTarget(){targetIndex=(targetIndex+1)%phrases.length;$("targetPhrase").textContent=phrases[targetIndex][0];$("targetMeaning").textContent=phrases[targetIndex][1];$("speechResult").textContent="Tap the microphone and say the sentence naturally."; $("score").textContent=""}
function similarity(a,b){
 a=a.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^\p{L}\p{N}\s]/gu,"").trim().split(/\s+/);
 b=b.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^\p{L}\p{N}\s]/gu,"").trim().split(/\s+/);
 const set=new Set(b),hits=a.filter(x=>set.has(x)).length;return Math.round(100*hits/Math.max(1,set.size))
}
function recognize(){
 const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
 if(!SR){$("speechResult").textContent="Speech recognition isn't available in this browser. Try Chrome on Android.";return}
 const r=new SR();r.lang="fr-FR";r.interimResults=false;r.maxAlternatives=1;$("speechResult").textContent="🎙️ Listening…";r.start();
 r.onresult=e=>{const heard=e.results[0][0].transcript,score=similarity(heard,phrases[targetIndex][0]);$("speechResult").innerHTML=`<b>You said:</b> ${heard}`;$("score").textContent=`${score}% phrase match ${score>=80?"🎉":"— try once more"}`;let k=phrases[targetIndex][0];state.words[k]=(state.words[k]||0)+1;mark("speaking")};
 r.onerror=()=>{$("speechResult").textContent="I couldn't hear that clearly. Try again slowly."}
}
function renderReview(){
 const list=phrases.slice().sort((a,b)=>(state.words[a[0]]||0)-(state.words[b[0]]||0));
 const p=list[0];$("reviewCard").innerHTML=`<div class="flash"><div class="eyebrow">REVIEW NOW</div><div class="fr">${p[0]}</div><p>${p[1]}</p><button class="primary" onclick="speak('${p[0].replace(/'/g,"\\'")}');reviewed('${p[0].replace(/'/g,"\\'")}')">🔊 Hear & review</button></div>`;
}
function reviewed(word){state.words[word]=(state.words[word]||0)+1;mark("review");setTimeout(renderReview,250)}
function renderCourse(){
 $("courseList").innerHTML=lessons.map((x,i)=>`<div class="courseDay"><div><b>${x[0]} · ${x[1]}</b><small>${x[2]}</small></div><span>${i<1?"▶":"○"}</span></div>`).join("");
}
function setGoal(n){state.goal=n;save();alert("Daily goal set to "+n+" minutes.")}
function resetAll(){if(confirm("Reset all progress on this device?")){state={days:[],completed:[],words:{},goal:20};save();renderDaily()}}
$("chatInput").addEventListener("keydown",e=>{if(e.key==="Enter")sendChat()});
updateUI();renderScenarios();renderCourse();
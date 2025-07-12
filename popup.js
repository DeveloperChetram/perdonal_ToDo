document.addEventListener("DOMContentLoaded", function () {
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
// const clear = document.getElementById('clear');
const taskList = document.querySelector('.taskList');
const shortcuts = document.querySelector('.shortcuts');
const doneBtn = document.querySelectorAll('.doneBtn');
const deleteBtn = document.querySelectorAll('.deleteBtn');
const shortcutPlusBtn = document.querySelector('.shortcutPlusBtn');
// const shortcutInputDiv = document.querySelector('.shortcut-input-div');
const quote = document.querySelector('.quote');
let user = true;
let tasks = [];

// resetUserStatus()
function checkNewUser() {
  const userStatus = localStorage.getItem('userStatus');
  if (!userStatus) {
    
    user = true;
    localStorage.setItem('userStatus', 'returning');
    return true;
  } else {

    user = false;
    return false;
  }
}




function isWelcomeNote(taskText) {
  return taskText.includes('📌 Welcome to Work ToDo');
}

function loadTasks() {
  const stored = localStorage.getItem('tasks');
  const welcomeDismissed = localStorage.getItem('welcomeDismissed');
  
  if (stored) {
    tasks = JSON.parse(stored);
  } else if (checkNewUser() && !welcomeDismissed) {
    
    tasks = [
      { text: `<div>
  <span style="color: #e0e0e0; font-weight: bold;">📌 Welcome to <span style="color: #4ab580; font-weight: bold;">Work ToDo</span></span><br>

  <span style="color: #e0e0e0;">• You can add tasks using the 
    <span style="color: #4ab580; font-weight: bold;">"Add Task"</span> button.</span><br>

  <span style="color: #e0e0e0;">• You will receive a 
    <span style="color: #4ab580; font-weight: bold;">quote</span> whenever the page reloads.</span><br>

  <span style="color: #e0e0e0;">• You can even add 
    <span style="color: #4ab580; font-weight: bold;">HTML content</span> (with inline CSS).</span><br>

  <span style="color: #e0e0e0;">• Your tasks are saved in 
    <span style="color: #4ab580; font-weight: bold;">LocalStorage</span>.</span><br>

  <span style="color: #e0e0e0;">• 
    <span style="color: #4ab580; font-weight: bold;">Deleted tasks</span> are permanently removed.</span><br>

  <span style="color: #e0e0e0;">• 
    <span style="color: #4ab580; font-weight: bold;">Edit option</span> is not available yet.</span><br>

  <span style="color: #e0e0e0;">• 
    <span style="color: #4ab580; font-weight: bold;">Thanks for reaching out!</span> 😊</span>
</div>


    `,
     done: false }
    ];
  }
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

const addtask = () => {
  addBtn.addEventListener('click', () => {
    const taskText = taskInput.value.trim();
    if (!taskText) {
      triggerInputError();
      return;
    }
    tasks.push({ text: taskText, done: false });
    taskInput.value = '';
    saveTasks();
    renderTasks();
  })
}
window.addEventListener('keypress', (key) => {
  if (key.key == "Enter") {
    const taskText = taskInput.value.trim();
    if (!taskText) {
      triggerInputError();
      return;
    }
    tasks.push({ text: taskText, done: false });
    taskInput.value = '';
    saveTasks();
    renderTasks();
  }
})

// Error effect: blink input border
function triggerInputError() {
  if (taskInput.classList.contains('input-error')) return;
  taskInput.classList.add('input-error');
  let blinkCount = 0;
  let blink = true;
  const originalPlaceholder = taskInput.placeholder;
  const errorPlaceholder = 'Write something to add';
  const interval = setInterval(() => {
    if (blink) {
      taskInput.style.borderBottom = '1px solid #cf0a0a';
      taskInput.placeholder = errorPlaceholder;
    } else {
      taskInput.style.borderBottom = '1px solid #494949';
      taskInput.placeholder = originalPlaceholder;
    }
    blink = !blink;
    blinkCount++;
    if (blinkCount >= 4) { // 2s, 4 blinks (500ms each)
      clearInterval(interval);
      taskInput.classList.remove('input-error');
      taskInput.style.borderBottom = '1px solid #494949';
      taskInput.placeholder = originalPlaceholder;
    }
  }, 500);

  // Reset on user input
  const resetOnInput = () => {
    if (taskInput.classList.contains('input-error')) {
      taskInput.classList.remove('input-error');
      taskInput.style.borderBottom = '1px solid #494949';
      taskInput.placeholder = originalPlaceholder;
      clearInterval(interval);
      taskInput.removeEventListener('input', resetOnInput);
    }
  };
  taskInput.addEventListener('input', resetOnInput);
}

taskInput.addEventListener('input', () => {
  if (taskInput.classList.contains('input-error')) {
    taskInput.classList.remove('input-error');
    taskInput.style.borderBottom = '1px solid #494949';
  }
});
addtask();


const renderTasks = () => {
  let taskString = ``;
  tasks.forEach((task, index) => {
    taskString += `
      <div class="task">
        <p style="text-decoration: ${task.done ? 'line-through' : 'none'}; opacity: ${task.done ? '0.7' : '1'};  font-style: ${task.done ? 'italic' : 'normal'};  "><span style="width:.4rem; height:.4rem;flex-shrink: 0; border-radius:100px;${task.done ? "background-color:green" : "background-color:red"} ;"></span>  ${task.text}</p>
        <div class="btn-group">
          <button class="deleteBtn" data-index="${index}">Delete</button>
          <button class="doneBtn" data-index="${index}">${task.done ? "Undo" : "Done"}</button>
        </div>
      </div>`;
  });
  taskList.innerHTML = taskString;

  const deleteBtns = document.querySelectorAll('.deleteBtn');
  const doneBtns = document.querySelectorAll('.doneBtn');

  deleteBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const index = e.target.dataset.index;
      
      // Check if user is deleting the welcome note
      if (isWelcomeNote(tasks[index].text)) {
        // Mark that user has seen and dismissed the welcome note
        localStorage.setItem('userStatus', 'returning');
        localStorage.setItem('welcomeDismissed', 'true');
      }
      
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    });
  });

  doneBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const index = e.target.dataset.index;
      tasks[index].done = !tasks[index].done;
      saveTasks();
      renderTasks();
    });
  });
};


let shortcutList = [
  {
    name: "ChatGPT",
    link: "https://chat.openai.com/",
    icon: "icons8-chatgpt.svg"
  },
  {
    name: "DeepSeek",
    link: "https://chat.deepseek.com/",
    icon: "icons8-deepseek.svg"
  },
  {
    name: "Discord",
    link: "https://discord.com/channels/@me",
    icon: "icons8-discord.svg"
  },
  {
    name: "Gemini",
    link: "https://gemini.google.com/",
    icon: "icons8-gemini.svg"
  },
  {
    name: "Gmail",
    link: "https://mail.google.com/",
    icon: "icons8-gmail.svg"
  },
  {
    name: "YouTube",
    link: "https://youtube.com/",
    icon: "icons8-youtube.svg"
  },
  {
    name: "Qwen",
    link: "https://chat.qwen.ai/",
    icon: "qwen.svg"
  }

];
let shortcutString = ``;
shortcutList.forEach((item) => {
  shortcutString += `<a  class="shortcut-link" href="${item.link}" target="_blank"> <div> <img src="/assets/${item.icon}" alt="${item.name}"> </div></a>`

})
shortcuts.innerHTML = shortcutString + shortcuts.innerHTML;


const genZQuotes = [
  "Wake up, you're not rich yet.",
  "Your excuses won’t pay your bills.",
  "No one cares. Work anyway.",
  "Stop crying. Start creating.",
  "Discipline hits harder than motivation.",
  "Do it broke. Do it scared.",
  "You’re not tired, you’re distracted.",
  "No grind? No respect. Simple.",
  "Stop scrolling. Start building. Now.",
  "Nobody feeds lazy people success.",
  "Hustle now. Regret never.",
  "Sleep is for the satisfied.",
  "Show results. Not stories.",
  "Excuses are free. So is failure.",
  "Earn respect. Don’t expect it.",
  "Silence your doubts. Prove your worth.",
  "Nobody owes you anything. Move.",
  "Comfort zones kill potential.",
  "Nobody’s coming. Save yourself.",
  "If it’s easy, it’s worthless.",
  "Be relentless. Or be replaced.",
  "Suffer now. Flex later.",
  "Don’t post. Produce.",
  "Hard work is your only shortcut.",
  "Less talk. More grind.",
  "Make money. Not excuses.",
  "Regret is louder than hustle.",
  "Broke mindset. Broke life.",
  "Starve your distractions. Feed your goals.",
  "Results need sweat, not tweets.",
  "You slacking? They grinding.",
  "Dreams need effort, not emojis.",
  "Still waiting? They already started.",
  "Work in silence. Let results flex.",
  "Zero effort? Expect zero success.",
  "Quit whining. Start winning.",
  "Your future hates laziness.",
  "Every scroll delays your dream.",
  "You choose: grind or regret.",
  "Prove them wrong. Or stay broke.",
  "Be the storm. Not the drizzle.",
  "Clock’s ticking. You’re still dreaming?",
  "Grind loud. Rest quiet.",
  "Stop waiting. Do the damn work.",
  "Talk less. Dominate more.",
  "Don't hope. Hustle.",
  "You deserve nothing. Earn it.",
  "That ‘one day’ is today.",
  "Success doesn’t care how you feel.",
  "Move smart. Move silent. Move fast.",
  "Slay in silence. Show no weakness.",
  "No vibes, just goals.",
  "Your plan needs action, not prayers.",
  "Nobody's watching. Grind anyway.",
  "Do it tired. Do it now.",
  "Fall down? Get louder next time.",
  "You can't chill without the grind.",
  "Lazy ain't cute. Hustle is.",
  "Ideas are useless without execution.",
  "Confidence comes from consistency.",
  "Grind is ugly. Results are pretty.",
  "Cry if you must. Then work.",
  "More action. Less affirmation.",
  "Hustle hard. Stay humble.",
  "No plan? That's the problem.",
  "Victim mode kills success.",
  "Work like you're already behind.",
  "Win quietly. Let noise follow.",
  "Excuses delay everything you want.",
  "If not now, when exactly?",
  "Fear dies in execution.",
  "Bosses don't whine. They work.",
  "Either commit, or quit quietly.",
  "They sleeping. You building.",
  "Stop wasting time proving your point.",
  "Talk goals. Then crush them.",
  "Do the work. Avoid drama.",
  "Energy wasted on worry is useless.",
  "Discipline: doing it when it sucks.",
  "Less doubt. More action.",
  "You aren’t stuck. You’re stalling.",
  "Tomorrow isn’t promised. Grind today.",
  "Reputation is built in private.",
  "Feel the fear. Do it anyway.",
  "Pain is fuel, not excuse.",
  "You want it? Prove it.",
  "They doubted you? Good. Go harder.",
  "Grind doesn’t care about your mood.",
  "Don’t just dream. Deadline it.",
  "You’re not unlucky. You’re unprepared.",
  "Less Netflix. More net worth.",
  "Shut up. Level up.",
  "Win or whine. Not both.",
  "Be addicted to progress.",
  "Don’t get outworked. Ever.",
  "Swipe less. Build more.",
  "Fail forward. Always.",
  "Learn. Execute. Repeat.",
  "Slow grind. Big shine.",
  "Don't wait. Dominate.",
  "Nobody’s coming. Be your own hero.",
  "More pain, more power.",
  "Doubt dies in motion.",
  "Stay broke if you stay lazy.",
    "Quit talking. Start executing now.",
  "No talent? Outwork everyone anyway.",
  "Cry later. Grind now.",
  "Results require work. Not wishes.",
  "Weak effort. Weak life.",
  "Pressure builds beasts.",
  "Losers wait. Winners act.",
  "Broke is loud. Rich is silent.",
  "Time’s ticking. You scrolling?",
  "Stop dreaming. Start building.",
  "Average mindset. Average results.",
  "Go broke trying.",
  "Be obsessed. Not interested.",
  "Lazy days kill dreams.",
  "Do more. Want less.",
  "Only actions earn respect.",
  "Be better. Not bitter.",
  "Broke hustle = Broke outcome.",
  "Mindset decides your money.",
  "Work hurts. So does regret.",
  "Chase skills. Not trends.",
  "Create more. Complain less.",
  "No pain? No power.",
  "Outwork the excuses.",
  "Win without applause.",
  "They chilling. You grinding.",
  "Hustle beats hype.",
  "Zero excuses. Infinite effort.",
  "Bosses bleed silently.",
  "Be cold. Get gold.",
  "Work doesn’t lie.",
  "Get tired. Not soft.",
  "Starve comfort. Feed effort.",
  "Pain is progress.",
  "No cap. Just grind.",
  "Get better. Stay dangerous.",
  "Earn it. Every day.",
  "Choose work. Every damn time.",
  "Build or stay broke.",
  "Be valuable. Not visible.",
  "Don't flex. Just conquer.",
  "No room for weakness.",
  "Pray less. Push more.",
  "Action speaks. Results scream.",
  "Struggle now. Dominate later.",
  "No grind? No gold.",
  "Earn your sleep.",
  "Dreams demand hustle.",
  "Grit over gimmicks.",
  "Commit hard. Or quit.",
  "Comfort is your enemy.",
  "You slacking? They snapping.",
  "Get serious. Or get silent.",
  "Grind till they google you.",
  "Weak minds seek validation.",
  "Don’t settle. Ever.",
  "Rise hard. Stay sharp.",
  "Demand more from yourself.",
  "Clock in. Shut up.",
  "Chase the goal.",
  "Your mood means nothing.",
  "Built different? Prove it.",
  "Soft hustle. Soft life.",
  "Stop wishing. Start working.",
  "You earn what you chase.",
  "Fear success? Stay broke.",
  "Outwork your potential.",
  "Drown noise. Chase greatness.",
  "Mindset makes millions.",
  "No pain? No push.",
  "You owe yourself effort.",
  "Make moves. Not noise.",
  "Excuses don’t build empires.",
  "Lazy today. Broke tomorrow.",
  "Outlast. Outgrind. Outwin.",
  "Don’t pause. Push harder.",
  "They watching. You working?",
  "Enough talking. Show discipline.",
  "Be raw. Stay real.",
  "Silence the weakness.",
  "Play time’s over.",
  "No limits. No mercy.",
  "Earn the peace.",
  "Break comfort. Embrace pressure.",
  "Comfort won’t feed you.",
  "Discipline delivers dreams.",
  "Sleep later. Build now.",
  "Master pain. Own results.",
  "Do more. Talk none.",
  "Loud grind. Quiet wins.",
  "Chase pressure. Not praise.",
  "Be feared. Not forgotten.",
  "They chill. You charge.",
  "Respect the hustle.",
  "Weak days? Work anyway.",
  "Don’t stop. Dominate.",
  "Doubt dies with discipline.",
  "You deserve what you do.",
  "Succeed alone. Applaud later.",
  "Burn excuses. Light goals."
];

const getQuote = ()=>{
  const index = Math.floor((Math.random()*100) )
  quote.innerHTML=genZQuotes[index]
}
getQuote()
loadTasks();
renderTasks();

});
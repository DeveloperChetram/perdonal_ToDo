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


let tasks = [];



function loadTasks() {
  const stored = localStorage.getItem('tasks');
  if (stored) {
    tasks = JSON.parse(stored);
  }
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

const addtask = () => {
  addBtn.addEventListener('click', () => {
    const taskText = taskInput.value.trim();
    if (taskText) {
      tasks.push({ text: taskText, done: false });
      taskInput.value = '';
      saveTasks();
    }
    renderTasks();
  })
}
window.addEventListener('keypress', (key) => {
  if (key.key == "Enter") {
    const taskText = taskInput.value.trim();
    if (taskText) {
      tasks.push({ text: taskText, done: false });
      taskInput.value = '';
      saveTasks();
    }
    renderTasks();
  }
})
addtask();


const renderTasks = () => {
  let taskString = '';
  tasks.forEach((task, index) => {
    taskString += `
      <div class="task">
        <p style="text-decoration: ${task.done ? 'line-through' : 'none'}; font-style: ${task.done ? 'italic' : 'normal'};  "><span style="width:.4rem; height:.4rem; border-radius:100px;${task.done ? "background-color:green" : "background-color:red"} ;"></span>  ${task.text}</p>
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
  shortcutString += `<a href="${item.link}" target="_blank"> <div> <img src="/assets/${item.icon}" alt="${item.name}"> </div></a>`

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
  "Stay broke if you stay lazy."
];

const getQuote = ()=>{
  const index = Math.floor((Math.random()*100) )
  quote.innerHTML=genZQuotes[index]
}
getQuote()
loadTasks();
renderTasks();

});
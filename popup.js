document.addEventListener("DOMContentLoaded", function () {
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
// const clear = document.getElementById('clear');
const taskList = document.querySelector('.taskList');
const shortcuts = document.querySelector('.shortcuts');
const doneBtn = document.querySelectorAll('.doneBtn');
const deleteBtn = document.querySelectorAll('.deleteBtn');
const shortcutPlusBtn = document.querySelector('.shortcutPlusBtn');
const shortcutInputDiv = document.querySelector('.shortcut-input-div');

// shortcutPlusBtn.addEventListener('click', () => {
// // shortcutInputDiv.style.display= "flex"
// console.log(shortcutPlusBtn);
// })
// console.log(shortcutPlusBtn);
let tasks = [];

// clear.addEventListener('click', () => {
//   tasks = [];
//   saveTasks();
//   renderTasks();

// })

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
// const shortcutPlusBtn = document.querySelector('.shortcutPlusBtn');
shortcutPlusBtn.addEventListener('click', () => {
  shortcutInputDiv.classList.toggle('active');
});

// console.log(shortcutString);
loadTasks();
renderTasks();

});
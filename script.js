import axios from 'https://cdn.jsdelivr.net/npm/axios@1.6.8/+esm';

document.addEventListener("DOMContentLoaded", function () {
  const taskInput = document.getElementById("taskInput");
  const addBtn = document.getElementById("addBtn");
  const taskList = document.querySelector(".taskList");
  const shortcuts = document.querySelector(".shortcuts");
  const quote = document.querySelector(".quote");
  const timeDiv = document.querySelector('.time-div');

  let tasks = [];

  function updateTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const displayHour = (hours % 12 || 12).toString().padStart(2, "0");
    timeDiv.textContent = `${displayHour}:${minutes}:${seconds} ${ampm}`;
  }

  if (timeDiv) {
    updateTime();
    setInterval(updateTime, 1000);
  }

  const getTodo = async () => {
    try {
      const response = await axios.get('http://localhost:8000/todo');
      tasks = response.data;
      console.log('Tasks fetched from DB:', tasks);
      getQuote();
      renderTasks();
    } catch (error) {
      console.error("DB fetch failed. Loading from LocalStorage", error);
      loadTasks();
      renderTasks();
    }
  };

  const addAndSaveToDB = async (taskText) => {
    const date = new Date();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const taskObject = {
      text: taskText,
      done: false,
      date: `${date.getDate().toString().padStart(2, "0")} ${months[date.getMonth()]} ${date.getFullYear()}, ${(date.getHours() % 12 || 12).toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")} ${date.getHours() >= 12 ? "PM" : "AM"}`
    };

    let mongoErr = false;

    try {
      addBtn.disabled = true;
      addBtn.innerText = "Adding";
      const response = await axios.post('http://localhost:8000/todo', taskObject);
      taskObject._id = response.data._id;
    } catch (err) {
      console.error(err);
      mongoErr = true;
    }

    tasks.push({ ...taskObject, alert: mongoErr });
    addBtn.innerText = "Add";
    addBtn.disabled = false;
    renderTasks();
  };

  const patchTodo = async (id, done) => {
    try {
      await axios.patch(`http://localhost:8000/todo/${id}`, { done });
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/todo/${id}`);
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  };

  function loadTasks() {
    const stored = localStorage.getItem("tasks");
    const welcomeDismissed = localStorage.getItem("welcomeDismissed");
    if (stored) {
      tasks = JSON.parse(stored);
    } else if (!localStorage.getItem("userStatus") && !welcomeDismissed) {
      localStorage.setItem("userStatus", "returning");
      tasks = [{
        text: `📌 Welcome to Work ToDo`,
        done: false,
        date: new Date().toString(),
      }];
    }
  }

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  const addtask = () => {
    addBtn.addEventListener("click", async () => {
      const taskText = taskInput.value.trim();
      if (!taskText) return triggerInputError();
      await addAndSaveToDB(taskText);
      taskInput.value = "";
    });

    window.addEventListener("keypress", async (key) => {
      if (key.key === "Enter") {
        const taskText = taskInput.value.trim();
        if (!taskText) return triggerInputError();
        await addAndSaveToDB(taskText);
        taskInput.value = "";
      }
    });
  };

  function triggerInputError() {
    if (taskInput.classList.contains("input-error")) return;
    taskInput.classList.add("input-error");
    let blinkCount = 0;
    let blink = true;
    const originalPlaceholder = taskInput.placeholder;
    const interval = setInterval(() => {
      taskInput.style.borderBottom = blink ? "1px solid #cf0a0a" : "1px solid #494949";
      taskInput.placeholder = blink ? "Write something to add" : originalPlaceholder;
      blink = !blink;
      blinkCount++;
      if (blinkCount >= 4) {
        clearInterval(interval);
        taskInput.classList.remove("input-error");
        taskInput.style.borderBottom = "1px solid #494949";
        taskInput.placeholder = originalPlaceholder;
      }
    }, 500);
    taskInput.addEventListener("input", () => {
      taskInput.classList.remove("input-error");
      taskInput.style.borderBottom = "1px solid #494949";
    }, { once: true });
  }

  const renderTasks = () => {
    let taskString = ``;
    tasks.forEach((task, index) => {
      taskString += `
        <div class="task">
          <span style="position: absolute; top: .4rem; left: 0.5rem; font-size: 0.7rem; color: gray;">${task.date}</span>
          ${task.alert ? '<span style="position: absolute; top: .4rem; right: 0.5rem; font-size: 0.7rem; color: #e74c3c; font-style:italic;">Not saved in DB</span>' : ''}
          <p style="text-decoration: ${task.done ? "line-through" : "none"}; opacity: ${task.done ? "0.7" : "1"};">
            <span style="width:.4rem; height:.4rem; flex-shrink: 0; border-radius:100px; ${task.done ? "background-color:green" : "background-color:red"};"></span> 
            ${task.text}
          </p>
          <div class="btn-group" style="position: relative;">
            <div class="confirm-dialog" style="display: none; gap:5px; position: absolute; right: 0px; top: 0;">
              <button class="confirm-delete" data-index="${index}">Delete</button>
              <button class="cancel-delete">Cancel</button>
            </div>
            <button class="deleteBtn" data-index="${index}">Delete</button>
            <button class="doneBtn" style='${task.done ? 'background-color: #0e4429; color:#56d364; border: 1px solid #238636;' : ''}' data-index="${index}">${task.done ? "Undo" : "Done"}</button>
          </div>
        </div>
      `;
    });
    taskList.innerHTML = taskString;

    document.querySelectorAll(".doneBtn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const index = e.target.dataset.index;
        const task = tasks[index];
        task.done = !task.done;
        if (!task.alert && task._id) await patchTodo(task._id, task.done);
        saveTasks();
        renderTasks();
      });
    });

    document.querySelectorAll(".deleteBtn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const dialog = e.target.closest(".btn-group").querySelector(".confirm-dialog");
        dialog.style.display = "flex";
      });
    });

    document.querySelectorAll(".cancel-delete").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const dialog = e.target.closest(".confirm-dialog");
        dialog.style.display = "none";
      });
    });

    document.querySelectorAll(".confirm-delete").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const index = btn.dataset.index;
        const task = tasks[index];
        if (!task.alert && task._id) await deleteTodo(task._id);
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
      });
    });
  };

  const shortcutList = [
    { name: "ChatGPT", link: "https://chat.openai.com/", icon: "icons8-chatgpt.svg" },
    { name: "DeepSeek", link: "https://chat.deepseek.com/", icon: "icons8-deepseek.svg" },
    { name: "Discord", link: "https://discord.com/channels/@me", icon: "icons8-discord.svg" },
    { name: "Gemini", link: "https://gemini.google.com/", icon: "icons8-gemini.svg" },
    { name: "Gmail", link: "https://mail.google.com/", icon: "icons8-gmail.svg" },
    { name: "YouTube", link: "https://youtube.com/", icon: "icons8-youtube.svg" },
    { name: "Qwen", link: "https://chat.qwen.ai/", icon: "qwen.svg" },
  ];
  shortcuts.innerHTML =
    shortcutList.map(item => `<a class="shortcut-link" href="${item.link}" target="_blank"><div><img src="/assets/${item.icon}" alt="${item.name}"></div></a>`).join('') + shortcuts.innerHTML;

  const genZQuotes = [
    "Wake up, you're not rich yet.",
    "Your excuses won’t pay your bills.",
    "Stop scrolling. Start building. Now.",
    "No grind? No respect. Simple.",
    "Discipline hits harder than motivation.",
    "Lazy ain't cute. Hustle is.",
    "Results require work. Not wishes.",
    "Work like you're already behind.",
    "Mindset makes millions.",
    "Starve your distractions. Feed your goals.",
  ];

  const getQuote = () => {
    const index = Math.floor(Math.random() * genZQuotes.length);
    quote.innerHTML = genZQuotes[index];
  };

  addtask();
  getTodo();
});

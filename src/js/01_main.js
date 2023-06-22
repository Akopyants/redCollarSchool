const listItem = document.querySelectorAll(".main-section__list-link");

listItem.forEach(function (item) {
  let word = item.children[0].children[0].innerText.split("");
  item.children[0].innerHTML = "";

  word.forEach(function (letter, idx) {
    const span = document.createElement("span");
    span.style = `--index: ${idx}`;
    span.innerText = letter;
    item.children[0].appendChild(span);
  });

  const cloneDiv = item.children[0].cloneNode(true);
  Object.assign(cloneDiv.style, {
    position: "absolute",
    left: "0",
    top: "0",
  });
  item.appendChild(cloneDiv);
});

let timer = document.getElementById('timer');

if (timer) {


  // кнопки
  const taskBtn = document.getElementById("taskBtn");
  const deleteAllTasksBtn = document.getElementById("deleteAllTasksBtn");
  const taskInput = document.getElementById("taskInput");
  const timerBtnStart = document.getElementById("timerBtnStart");
  const timerBtnReset = document.getElementById("timerBtnReset");

  // Константы для установки времени работы и отдыха
  const WORK_TIME = 25 * 60; // 25 минут
  const SHORT_BREAK_TIME = 5 * 60; // 5 минут
  const LONG_BREAK_TIME = 15 * 60; // 15 минут

  // Переменные для отображения времени на таймере
  let minutes = 25;
  let seconds = 0;

  // Переменные для работы с интервалом
  let intervalId;
  let isTimerRunning = false;

  // Функция для обновления таймера
  const updateTimer = () => {
    document.getElementById("timerMinutes").innerText = minutes
      .toString()
      .padStart(2, "0");
    document.getElementById("timerSeconds").innerText = seconds
      .toString()
      .padStart(2, "0");

    if (seconds > 0) {
      seconds--;
    } else if (minutes > 0) {
      minutes--;
      seconds = 59;
    } else {
      clearInterval(intervalId);
      isTimerRunning = false;

      if (pomodorosCompleted % 4 === 0) {
        minutes = LONG_BREAK_TIME / 60;
        seconds = LONG_BREAK_TIME % 60;
        document.getElementById("timer-title").innerText = "Длинный перерыв";
      } else {
        minutes = SHORT_BREAK_TIME / 60;
        seconds = SHORT_BREAK_TIME % 60;
        document.getElementById("timer-title").innerText = "Короткий перерыв";
        startTimer();
      }

      pomodorosCompleted++;
      saveDataToLocalStorage();
      updatePomodoroCounter();
    }
  };

  // Функция для запуска таймера
  const startTimer = () => {
    if (!isTimerRunning) {
      intervalId = setInterval(updateTimer, 1000);
      isTimerRunning = true;
      document.getElementById("timerBtnStart").innerText = "Приостановить";
    } else {
      clearInterval(intervalId);
      isTimerRunning = false;
      document.getElementById("timerBtnStart").innerText = "Продолжить";
    }
  };

  // Функция для сброса таймера
  const resetTimer = () => {
    clearInterval(intervalId);
    isTimerRunning = false;
    minutes = WORK_TIME / 60;
    seconds = WORK_TIME % 60;
    document.getElementById("timer-title").innerText = "Работа";
    document.getElementById("timerBtnStart").innerText = "Начать";
    updateTimer();
  };

  // Функция для сохранения данных в LocalStorage
  const saveDataToLocalStorage = () => {
    localStorage.setItem("pomodorosCompleted", pomodorosCompleted);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };

  // Функция для загрузки данных из LocalStorage
  const loadDataFromLocalStorage = () => {
    pomodorosCompleted =
      parseInt(localStorage.getItem("pomodorosCompleted")) || 0;
    tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  };

  // Функция для обновления счетчика помодоро
  function updatePomodoroCounter() {
    document.getElementById("pomodoro-counter").innerText = pomodorosCompleted;
  }

  // Функция для обновления списка задач
  const renderTaskList = () => {
    let taskContainer = document.getElementById("taskList");
    taskContainer.innerHTML = "";

    tasks.forEach((task, index) => {
      let li = document.createElement("li");
      li.className = task.complete ? "completed" : "";
      li.innerHTML = `
    <span>${task.task}</span>
    <div class="buttons">
    <span data-index="${index}" class="complete-btn">
      <svg width="40" height="40" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.62451 5.65729L6.31515 9.758L11.8511 3.60693" stroke="#fff" stroke-width="2" stroke-linejoin="round"/>
      </svg>
    </span>
    <span data-index="${index}" class="edit-btn">
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32.2943 15.1472C31.7357 15.1472 31.2828 15.6001 31.2828 16.1586V34.6291C31.2828 36.5809 29.6945 38.1692 27.7426 38.1692H5.56322C3.61137 38.1692 2.02301 36.5809 2.02301 34.6291V12.4495C2.02301 10.4977 3.61137 8.9094 5.56322 8.9094H27.7426C28.3012 8.9094 28.7541 8.45652 28.7541 7.89794C28.7541 7.33936 28.3012 6.88647 27.7426 6.88647H5.56322C2.49561 6.88647 0 9.382 0 12.4495V34.6291C0 37.6965 2.49561 40.1921 5.56322 40.1921H27.7426C30.8101 40.1921 33.3057 37.6965 33.3057 34.6291V16.1587C33.3057 15.6001 32.8529 15.1472 32.2943 15.1472Z" fill="#fff"/>
    <path d="M40.0838 1.72234C38.8644 0.50295 36.8805 0.503447 35.6621 1.72234L18.3366 19.0484C18.3134 19.0716 18.0521 19.3432 17.9844 19.4954L15.5852 24.8856C15.4148 25.2682 15.4977 25.7162 15.794 26.0122C15.9876 26.2057 16.2464 26.3085 16.5097 26.3085C16.6484 26.3085 16.7882 26.2798 16.9205 26.2209L22.3109 23.8216C22.4625 23.7541 22.7345 23.4928 22.7579 23.4696L40.0838 6.14412C40.6745 5.55339 41 4.76816 41 3.93298C41 3.09788 40.6745 2.31248 40.0838 1.72234ZM38.6535 4.71332L21.3275 22.0393C21.3246 22.0423 21.3229 22.0458 21.3201 22.0482L18.5045 23.3016L19.7579 20.4861C19.7604 20.4831 19.7638 20.4816 19.7668 20.4787L37.0924 3.15272C37.5098 2.73529 38.2372 2.73579 38.6536 3.15313C38.8622 3.36106 38.9771 3.63816 38.9771 3.93298C38.9771 4.2278 38.862 4.50482 38.6535 4.71332Z" fill="#fff"/>
    </svg>
    </span>
    <span data-index="${index}" class="close-btn">
      <svg width="23" height="24" viewBox="0 0 23 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.50049 2.00001L21.5029 22.0024" stroke="#fff" stroke-width="4"/>
        <path d="M21.5024 2L1.50006 22.0024" stroke="#fff" stroke-width="4"/>
      </svg>
    </span>
    </div>
    `;
      taskContainer.append(li);
    });

    setCurrentTask();
  };

  // Функция для добавления задачи
  const addTask = () => {
    const task = taskInput.value;

    if (task) {
      tasks.push({ task: task, complete: false });
      saveDataToLocalStorage();
      renderTaskList();
      taskInput.value = "";
    }
  };

  const setCurrentTask = () => {
    let currentTaskItem = document.getElementById("currentTask");
    let currentTask = "";

    for (let i = 0; i < tasks.length; i++) {
      if (!tasks[i].complete) {
        currentTask = tasks[i].task;
        break;
      }
    }

    if (currentTask) {
      currentTaskItem.innerHTML = currentTask;
    } else {
      currentTaskItem.innerHTML = "Задач пока нет";
    }
  };

  const editTask = (editValue, index) => {
    if (editValue.length > 0) {
      tasks[index].task = editValue;

      saveDataToLocalStorage();
      renderTaskList();
    }
  };

  const deleteTask = (index) => {
    tasks.splice(index, 1);

    saveDataToLocalStorage();
    renderTaskList();
  };

  // добавляем задачи по нажатию enter
  taskInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      addTask();
    }
  });

  timerBtnStart.addEventListener("click", () => {
    startTimer();
  });

  timerBtnReset.addEventListener("click", () => {
    resetTimer();
  });

  taskBtn.addEventListener("click", () => {
    addTask();
  });

  deleteAllTasksBtn.addEventListener("click", () => {
    tasks = [];
    saveDataToLocalStorage();
    renderTaskList();
  });

  // удаляем задачу по нажатию на крестик
  const modal = new tingle.modal({
    closeMethods: ["overlay", "button", "escape"],
    closeLabel: "Close",
    cssClass: ["modal"]
  });

  modal.setContent(`
  <h3>Редактирование</h3>
  <input class="block__input" type="text" id="inputModal">
  <button class="block__button task-list__button" id="editBtn">Подтвердить</button>
`);

  document.addEventListener("click", (event) => {
    const target = event.target.closest("#taskList");
    if (target) {
      let itemIndex = event.target.dataset.index;

      if (event.target.classList.value === "close-btn") {
        deleteTask(itemIndex);
      }

      if (event.target.classList.value === "complete-btn") {
        tasks[itemIndex].complete = true;
        saveDataToLocalStorage();
        renderTaskList();
      }

      if (event.target.classList.value === "edit-btn") {
        const inputModal = document.querySelector("#inputModal");
        inputModal.dataset.index = itemIndex;
        inputModal.value = tasks[itemIndex].task;
        modal.open();
      }
    }
  });

  const editBtn = document.getElementById("editBtn");

  editBtn.addEventListener("click", () => {
    let index = inputModal.dataset.index;
    let value = inputModal.value;
    editTask(value, index);
    modal.close();
  });

  inputModal.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      let index = inputModal.dataset.index;
      let value = inputModal.value;
      editTask(value, index);
      modal.close();
    }
  });

  loadDataFromLocalStorage();
  updatePomodoroCounter();
  renderTaskList();
  updateTimer();
  setCurrentTask();

}

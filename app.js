const exercises = [
  {
    id: "1.1",
    title: "Бег на 100 метров",
    description: "Кратковременное скоростное упражнение на ровной, ровной и маркированной дистанции. Старт выполняется из положения высоко или низко с последующим ускорением до финишной линии.",
    unit: "сек",
    mode: "lower",
    thresholds: [13.5, 14.5, 15.5]
  },
  {
    id: "1.2",
    title: "Бег на 1 километр",
    description: "Упражнение на выносливость с преодолением дистанции 1000 метров. Результат фиксируется по времени прохождения всей дистанции.",
    unit: "сек",
    mode: "lower",
    thresholds: [210, 230, 260]
  },
  {
    id: "2.1",
    title: "Подтягивание на перекладине",
    description: "Упражнение выполняется на перекладине хватом сверху. Засчитывается повторение с последующим разгибанием рук в висе.",
    unit: "раз",
    mode: "higher",
    thresholds: [15, 12, 8]
  },
  {
    id: "2.2",
    title: "Поднимание туловища",
    description: "Упражнение для оценки силы мышц брюшного пресса в течение установленного времени или до достижения установленного количества повторений.",
    unit: "раз",
    mode: "higher",
    thresholds: [40, 32, 24]
  },
  {
    id: "3.1",
    title: "Метание гранаты",
    description: "Спортивное метание имитационной гранаты в цель или на дальность с соблюдением техники безопасности и установленной исходной позиции.",
    unit: "м",
    mode: "higher",
    thresholds: [40, 32, 24]
  },
  {
    id: "3.2",
    title: "Прыжок в длину с разбега",
    description: "Прыжок через контрольную линию с разбега с приземлением в обозначенной зоне. Засчитывается результат с наиболее короткой дистанцией от линии отталкивания.",
    unit: "см",
    mode: "higher",
    thresholds: [480, 430, 380]
  }
];

const list = document.querySelector("#exercise-list");
const search = document.querySelector("#search");
const dialog = document.querySelector("#exercise-dialog");

function renderExercises(items) {
  list.innerHTML = "";
  if (!items.length) {
    list.innerHTML = '<div class="empty">Ничего не найдено</div>';
    return;
  }

  items.forEach((exercise) => {
    const card = document.createElement("article");
    card.className = "exercise-card";
    card.tabIndex = 0;
    card.innerHTML = `
      <span class="exercise-card-number">Упражнение ${exercise.id}</span>
      <h2>${exercise.title}</h2>
      <p>${exercise.description.slice(0, 95)}…</p>
    `;
    card.addEventListener("click", () => openExercise(exercise));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter") openExercise(exercise);
    });
    list.appendChild(card);
  });
}

function openExercise(exercise) {
  document.querySelector("#dialog-number").textContent = `Упражнение ${exercise.id}`;
  document.querySelector("#dialog-title").textContent = exercise.title;
  document.querySelector("#dialog-description").textContent = exercise.description;
  dialog.dataset.exerciseId = exercise.id;
  dialog.showModal();
}

search.addEventListener("input", () => {
  const query = search.value.trim().toLowerCase();
  renderExercises(exercises.filter((exercise) =>
    exercise.title.toLowerCase().includes(query) || exercise.id.includes(query)
  ));
});

document.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

document.querySelector(".dialog-calc-btn").addEventListener("click", () => {
  const id = dialog.dataset.exerciseId;
  dialog.close();
  switchView("calculator");
  document.querySelector("#calc-exercise").value = id;
});

const calcSelect = document.querySelector("#calc-exercise");
exercises.forEach((exercise) => {
  const option = document.createElement("option");
  option.value = exercise.id;
  option.textContent = `${exercise.id} — ${exercise.title}`;
  calcSelect.appendChild(option);
});

function switchView(viewName) {
  document.querySelectorAll(".view").forEach((view) => view.classList.remove("active"));
  document.querySelector(`#${viewName}-view`).classList.add("active");
  document.querySelectorAll(".nav-btn").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === viewName);
  });
}

document.querySelectorAll(".nav-btn").forEach((button) => {
  button.addEventListener("click", () => switchView(button.dataset.view));
});

document.querySelector("#calculate").addEventListener("click", () => {
  const exercise = exercises.find((item) => item.id === calcSelect.value);
  const raw = Number(document.querySelector("#calc-result").value);
  const output = document.querySelector("#calc-output");

  if (!Number.isFinite(raw) || raw < 0) {
    output.hidden = false;
    output.innerHTML = "Введите корректный результат.";
    return;
  }

  let points;
  if (exercise.mode === "lower") {
    if (raw <= exercise.thresholds[0]) points = 100;
    else if (raw <= exercise.thresholds[1]) points = 75;
    else if (raw <= exercise.thresholds[2]) points = 50;
    else points = 25;
  } else {
    if (raw >= exercise.thresholds[0]) points = 100;
    else if (raw >= exercise.thresholds[1]) points = 75;
    else if (raw >= exercise.thresholds[2]) points = 50;
    else points = 25;
  }

  output.hidden = false;
  output.innerHTML = `
    <span>Демонстрационная оценка</span>
    <strong>${points} баллов</strong>
    <p>${raw} ${exercise.unit} — ${exercise.title}</p>
  `;
});

renderExercises(exercises);

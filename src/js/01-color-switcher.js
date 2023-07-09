const selectors = {
  body: document.querySelector('body'),
  startBtn: document.querySelector('button[data-start]'),
  stopBtn: document.querySelector('button[data-stop]'),
};
let timerId = null;

selectors.startBtn.addEventListener('click', handlerStart);

/**
 * Створює інтервал для зміни кольору фону <body> на випадкове значення
 * та переводить startBtn в стан disabled
 */
function handlerStart() {
  selectors.body.style.backgroundColor = getRandomHexColor();

  timerId = setInterval(changeBackground, 1000);

  selectors.startBtn.disabled = true;
}

/**
 * Змінює колір фону <body> на випадкове значення через інлайн-стиль
 */
function changeBackground() {
  selectors.body.style.backgroundColor = getRandomHexColor();
}

/**
 * Генерує випадковий колір у форматі HEX
 * @returns {String} Випадковий колір
 */
function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, 0)}`;
}

selectors.stopBtn.addEventListener('click', handlerStop);

/**
 * Зупиняє інтервал із заданим ідентифікатором та задає startBtn активний стан
 */
function handlerStop() {
  clearInterval(timerId);

  selectors.startBtn.disabled = false;
}

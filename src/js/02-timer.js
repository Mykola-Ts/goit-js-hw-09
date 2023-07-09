import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import 'notiflix/dist/notiflix-notify-aio-3.2.6.min.js'

const selectors = {
  body: document.querySelector('body'),
  input: document.querySelector('#datetime-picker'),
  startBtn: document.querySelector('button[data-start]'),
  resetBtn: document.querySelector('button[data-reset]'),
  dataDays: document.querySelector('span[data-days]'),
  dataHours: document.querySelector('span[data-hours]'),
  dataMinutes: document.querySelector('span[data-minutes]'),
  dataSeconds: document.querySelector('span[data-seconds]'),
};
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    console.log(selectedDates[0]);
  },
};
let inputDate;
let currentDate;
let idTimer;

flatpickr('#datetime-picker', options);

selectors.startBtn.disabled = true;

selectors.input.addEventListener('change', handlerInputDate);

/**
 * Перевіряє, щоб обрана дата була в майбутньому. Якщо значення валідне, 
 * переводить startBtn в активний стан
 */
function handlerInputDate() {
  inputDate = new Date(selectors.input.value);
  currentDate = new Date();

  if (inputDate > currentDate) {
    selectors.startBtn.disabled = false;
  } else {
    selectors.startBtn.disabled = true;

    Notify.failure('Please choose a date in the future');
  }
}

selectors.startBtn.addEventListener('click', handlerStart);

/**
 * Викликає функцію timer із заданим інтервалом 
 * та переводить startBtn та input в стан disabled
 */
function handlerStart() {
  timer();

  idTimer = setInterval(timer, 1000);

  selectors.startBtn.disabled = true;
  selectors.input.disabled = true;

  addResetBtn();
}

/**
 * Обчислює раз на секунду, скільки часу залишилось до вказаної дати, 
 * і оновлює інтерфейс таймера, показуючи чотири цифри: дні, години, 
 * хвилини і секунди у форматі xx:xx:xx:xx
 */
function timer() {
  currentDate = new Date();

  const differenceTime = inputDate - currentDate;
  const timeTimer = convertMs(differenceTime);

  selectors.dataDays.textContent = addLeadingZero(timeTimer.days.toString());
  selectors.dataHours.textContent = addLeadingZero(timeTimer.hours.toString());
  selectors.dataMinutes.textContent = addLeadingZero(
    timeTimer.minutes.toString()
  );
  selectors.dataSeconds.textContent = addLeadingZero(
    timeTimer.seconds.toString()
  );

  stopTimer(differenceTime);
}

/**
 * Розраховує переданий час в ms у формат {дні, години, хвилини, секунди}
 * @param {Number} ms 
 * @returns {Object} Об'єкт з розрахованим часом
 */
function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

/**
 * Підставляє в стоку '0' (якщо потрібно), щоб кінцева строка досягла заданої довжини
 * @param {String} value 
 * @returns {String} Строка з довжиною 2
 */
function addLeadingZero(value) {
  return value.padStart(2, '0');
}

/**
 * При досягненні differenceTime значення 0, зупиняє таймер 
 * та задає інтерфейсу таймера початкове значення, 
 * після чого видалає resetBtn
 * @param {Number} differenceTime 
 */
function stopTimer(differenceTime) {
  if (!(differenceTime > 0)) {

    clearInterval(idTimer);

    selectors.dataDays.textContent = '00';
    selectors.dataHours.textContent = '00';
    selectors.dataMinutes.textContent = '00';
    selectors.dataSeconds.textContent = '00';

    selectors.resetBtn.remove();

    selectors.input.disabled = false;
  }
}

/**
 * Створює та додає resetBtn, натискання на яку зупиняє таймер 
 * та задає інтерфейсу таймера початкове значення, 
 * після чого видалає resetBtn
 */
function addResetBtn() {
  selectors.resetBtn = document.createElement('button');
  selectors.resetBtn.type = 'button';
  selectors.resetBtn.dataset.reset = '';
  selectors.resetBtn.textContent = 'Reset';

  selectors.body.appendChild(selectors.resetBtn);

  selectors.resetBtn.addEventListener('click', () => {
    stopTimer();

    selectors.resetBtn.remove();

    selectors.input.disabled = false;
  });
}

import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.6.min.js';

const selectors = {
  form: document.querySelector('.form'),
  delayInput: document.querySelector('input[name = delay]'),
  stepInput: document.querySelector('input[name = step]'),
  amountInput: document.querySelector('input[name = amount]'),
  submitBtn: document.querySelector('.form button[type = submit]'),
};

selectors.delayInput.min = '0';
selectors.amountInput.min = '1';

selectors.form.addEventListener('submit', handlerSubmit);

/**
 * Викликає функцію createPromise(position, delay) стільки разів, скільки ввели в поле amount.
 * Під час кожного виклику передає їй номер промісу (position), що створюється, і затримку,
 * враховуючи першу затримку (delay), введену користувачем, і крок (step)
 * @param {SubmitEvent} evt
 */
function handlerSubmit(evt) {
  evt.preventDefault();

  const values = {
    delay: Number(selectors.delayInput.value),
    step: Number(selectors.stepInput.value),
    amount: Number(selectors.amountInput.value),
  };

  for (let i = 1; i <= values.amount; i += 1) {
    const position = i;

    if (i > 1) {
      values.delay += values.step;
    }

    createPromise(position, values.delay);
  }
}

/**
 * Створює проміс, який виконується або відхиляється через delay часу
 * @param {Number} position
 * @param {Number} delay
 */
function createPromise(position, delay) {
  const shouldResolve = Math.random() > 0.3;

  const promise = new Promise((res, rej) => {
    setTimeout(() => {
      if (shouldResolve) {
        res({ position: position, delay: delay });
      } else {
        rej({ position: position, delay: delay });
      }
    }, delay);
  });

  promise
    .then(({ position, delay }) => {
      Notiflix.Notify.success(`Fulfilled promise ${position} in ${delay}ms`);
    })
    .catch(({ position, delay }) => {
      Notiflix.Notify.failure(`Rejected promise ${position} in ${delay}ms`);
    })
    .finally(() => {
      return console.log({ position: position, delay: delay });
    });
}

import flatpickr from "flatpickr";
import iziToast from "izitoast";
import "flatpickr/dist/flatpickr.min.css";
import "izitoast/dist/css/iziToast.min.css";

export function createTimer() {
  const timerInput = document.querySelector("#datetime-picker");
  const startButton = document.querySelector("[data-start]");
  const stopButton = document.querySelector("[data-stop]");
  const resetButton = document.querySelector("[data-reset]"); // Кнопка Reset
  const daysSpan = document.querySelector("[data-days]");
  const hoursSpan = document.querySelector("[data-hours]");
  const minutesSpan = document.querySelector("[data-minutes]");
  const secondsSpan = document.querySelector("[data-seconds]");

  let countdownDate = null;
  let timerInterval = null;

  stopButton.disabled = true;
  resetButton.disabled = true; // Кнопка Reset спочатку вимкнена

  function updateTimer() {
    const now = new Date();
    const timeLeft = countdownDate - now;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      localStorage.removeItem("countdownDate");
      daysSpan.textContent = "00";
      hoursSpan.textContent = "00";
      minutesSpan.textContent = "00";
      secondsSpan.textContent = "00";
      iziToast.success({
        title: "Completed",
        message: "The countdown has ended!",
        position: "topRight",
      });
      return;
    }

    const days = String(Math.floor(timeLeft / (1000 * 60 * 60 * 24))).padStart(2, "0");
    const hours = String(Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, "0");
    const minutes = String(Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, "0");
    const seconds = String(Math.floor((timeLeft % (1000 * 60)) / 1000)).padStart(2, "0");

    daysSpan.textContent = days;
    hoursSpan.textContent = hours;
    minutesSpan.textContent = minutes;
    secondsSpan.textContent = seconds;
  }

  function startTimer() {
    startButton.disabled = true;
    stopButton.disabled = false;
    resetButton.disabled = false; // Активуємо кнопку Reset
    timerInput.disabled = true;
    localStorage.setItem("countdownDate", countdownDate);
    updateTimer();
    timerInterval = setInterval(updateTimer, 1000);
  }

  function stopTimer() {
    clearInterval(timerInterval);
    localStorage.removeItem("countdownDate");
    startButton.disabled = false;
    stopButton.disabled = true;
    resetButton.disabled = false; // Кнопка Reset залишиться активною
    iziToast.info({
      title: "Stopped",
      message: "The countdown has been stopped.",
      position: "topRight",
    });
  }

  function resetTimer() {
    clearInterval(timerInterval); // Зупиняємо таймер
    localStorage.removeItem("countdownDate");
    daysSpan.textContent = "00";
    hoursSpan.textContent = "00";
    minutesSpan.textContent = "00";
    secondsSpan.textContent = "00";
    startButton.disabled = false; // Активуємо кнопку Start
    stopButton.disabled = true; // Деактивуємо кнопку Stop
    resetButton.disabled = true; // Деактивуємо кнопку Reset
    timerInput.disabled = false; // Дозволяємо вибір нової дати
    iziToast.info({
      title: "Reset",
      message: "The timer has been reset. Please choose a new date.",
      position: "topRight",
    });
  }

  function restoreTimer() {
    const savedDate = localStorage.getItem("countdownDate");
    if (savedDate) {
      countdownDate = new Date(savedDate);
      if (countdownDate > new Date()) {
        startTimer();
      } else {
        localStorage.removeItem("countdownDate");
      }
    }
  }

  startButton.disabled = true;

  flatpickr(timerInput, {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
      const selectedDate = selectedDates[0];

      if (!selectedDate || selectedDate <= new Date()) {
        iziToast.error({
          title: "Error",
          message: "Please choose a date in the future",
          position: "topRight",
        });
        startButton.disabled = true;
      } else {
        countdownDate = selectedDate;
        startButton.disabled = false;
      }
    },
  });

  startButton.addEventListener("click", startTimer);
  stopButton.addEventListener("click", stopTimer);
  resetButton.addEventListener("click", resetTimer); // Обробник події для кнопки Reset

  restoreTimer();
}

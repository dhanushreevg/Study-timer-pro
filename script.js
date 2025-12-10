let studyTime = 25 * 60;
let breakTime = 5 * 60;
let timeLeft = studyTime;
let isRunning = false;
let timer = null;
let mode = "study";

const display = document.getElementById("timeDisplay");
const progress = document.getElementById("progress");
const alarm = document.getElementById("alarm");
const sessions = document.getElementById("sessions");
const themeBtn = document.getElementById("themeToggle");

// Load saved session count and theme
sessions.textContent = localStorage.getItem("sessions") || 0;
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  themeBtn.textContent = "☀️ Light Mode";
}

function updateDisplay() {
  let m = Math.floor(timeLeft / 60);
  let s = timeLeft % 60;
  display.textContent = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function updateProgress() {
  let total = mode === "study" ? studyTime : breakTime;
  progress.style.strokeDashoffset = 690 - (690 * (total - timeLeft)) / total;
}

function startTimer() {
  if (isRunning) return;
  isRunning = true;

  timer = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateDisplay();
      updateProgress();
    } else {
      alarm.play();
      clearInterval(timer);
      isRunning = false;

      if (mode === "study") {
        sessions.textContent = Number(sessions.textContent) + 1;
        localStorage.setItem("sessions", sessions.textContent);

        switchToBreak();
      } else {
        switchToStudy();
      }
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timer);
  isRunning = false;
}

function resetTimer() {
  pauseTimer();
  timeLeft = mode === "study" ? studyTime : breakTime;
  updateDisplay();
  updateProgress();
}

function switchToStudy() {
  mode = "study";
  timeLeft = studyTime;
  document.getElementById("studyBtn").classList.add("active");
  document.getElementById("breakBtn").classList.remove("active");
  updateDisplay();
  updateProgress();
}

function switchToBreak() {
  mode = "break";
  timeLeft = breakTime;
  document.getElementById("breakBtn").classList.add("active");
  document.getElementById("studyBtn").classList.remove("active");
  updateDisplay();
  updateProgress();
}

// Set custom time
document.getElementById("setTime").addEventListener("click", () => {
  let m = Number(document.getElementById("customMinutes").value);
  if (m > 0) {
    if (mode === "study") studyTime = m * 60;
    else breakTime = m * 60;

    timeLeft = m * 60;
    updateDisplay();
    updateProgress();
  }
});

// Theme toggle
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    themeBtn.textContent = "☀️ Light Mode";
    localStorage.setItem("theme", "dark");
  } else {
    themeBtn.textContent = "🌙 Dark Mode";
    localStorage.setItem("theme", "light");
  }
});

// Event listeners
document.getElementById("start").onclick = startTimer;
document.getElementById("pause").onclick = pauseTimer;
document.getElementById("reset").onclick = resetTimer;
document.getElementById("studyBtn").onclick = switchToStudy;
document.getElementById("breakBtn").onclick = switchToBreak;

updateDisplay();
updateProgress();

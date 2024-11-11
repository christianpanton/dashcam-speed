const timerSec = document.getElementById("timer-sec");
const timerFrame = document.getElementById("timer-frame");
const btnsFrame = document.getElementsByClassName("skip-frame");
const btnsSec = document.getElementsByClassName("skip-sec");

let setFrame = (frame) => {
  console.log("SET FRAME", frame);
};

let setSec = (sec) => {
  console.log("SET SEC", sec);
};

function initControls() {
  const getFrame = () => {
    return parseInt(timerFrame.value);
  };

  const getSec = () => {
    return parseFloat(timerSec.value);
  };

  for (let i = 0; i < btnsFrame.length; i++) {
    const btn = btnsFrame[i];
    const dur = parseInt(btn.getAttribute("data-frame"));
    btn.addEventListener("click", () => setFrame(getFrame() + dur));
  }

  for (let i = 0; i < btnsSec.length; i++) {
    const btn = btnsSec[i];
    const dur = parseInt(btn.getAttribute("data-sec"));
    btn.addEventListener("click", () => setSec(getSec() + dur));
  }
}

function updateControls(currentFrame, currentSec, maxFrame, maxSec) {
  timerSec.removeAttribute("disabled");
  timerFrame.removeAttribute("disabled");

  timerSec.value = currentSec.toFixed(2);
  timerFrame.value = currentFrame;

  for (let i = 0; i < btnsFrame.length; i++) {
    const btn = btnsFrame[i];
    const dur = parseInt(btn.getAttribute("data-frame"));

    if (maxFrame >= dur + currentFrame && dur + currentFrame >= 0)
      btn.removeAttribute("disabled");
    else btn.setAttribute("disabled", "disabled");
  }

  for (let i = 0; i < btnsSec.length; i++) {
    const btn = btnsSec[i];
    const dur = parseInt(btn.getAttribute("data-sec"));

    if (maxSec >= dur + currentSec && dur + currentSec >= 0)
      btn.removeAttribute("disabled");
    else btn.setAttribute("disabled", "disabled");
  }
}

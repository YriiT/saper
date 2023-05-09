import { config } from "./const.js";
import { getTimerNode, createDiv, emptyDiv, createElement } from "./helpers.js";
import { openModal } from "./modal.js";

let interval;
export const timer = createDiv("00:00")("timer");

export function stratTimer() {
  let mm = 0;
  let sec = 0;

  let i = 0;
  let time = "";

  interval = setInterval(() => {
    i++;

    sec = i;

    if (sec === 60) {
      mm += 1;
      i = 0;
    }
    const seconds = sec === 60 ? "00" : sec;
    time = `${parseSecond(mm)}:${parseSecond(seconds)}`;
    const node = getTimerNode();

    node.innerText = time;
  }, 1000);
}

export function stopTimer() {
  clearInterval(interval);
}

function parseSecond(t) {
  const value = parseInt(t);
  if (value < 10) {
    return "0" + value;
  }
  return value.toString();
}

const infoWrapper = emptyDiv("info");
const bombsWrapper = emptyDiv("bombs");
const bombsCount = createDiv(config.bombCount, "bombs-count");
bombsCount.id = "bombs-count";
const img = createElement("img", "", "info-button");
const flag = createElement("img", "", "info-button");
img.src = "./info.png";
img.onclick = openModal;
flag.src = "./flag.png";
bombsWrapper.append(flag, bombsCount);
infoWrapper.append(timer, img, bombsWrapper);

export { infoWrapper };

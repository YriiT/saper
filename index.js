import {
  emptyDiv,
  getTimerNode,
  tranformToMatrix,
  isItemBomb,
  createId,
  getRandom,
  itemsArray,
  addBomds,
  getCoordinats,
  getBombsAround,
  isSelected,
  isAllIteemsSelected,
  isAllBombsFlagged,
} from "./helpers.js";

import { icon, colors, config, gameOver } from "./const.js";
import { infoWrapper, stratTimer, stopTimer } from "./timer.js";
import { modal, openModal } from "./modal.js";

let isFirstClick = true;

const body = document.getElementById("body");

const wrapper = emptyDiv("wrapper");
const row = emptyDiv("row");

const itemsMatrix = tranformToMatrix(itemsArray);

itemsMatrix.forEach((item, y) => {
  item.forEach((j, x) => {
    j.id = createId(y, x);
  });
});

wrapper.addEventListener("click", handleClick);

wrapper.addEventListener("contextmenu", handleContexMenyClick);

wrapper.addEventListener("click", handleFirstClick, { once: true });

wrapper.append(...itemsMatrix.flat());

body.append(infoWrapper, wrapper);

body.append(row);
body.append(modal);

function handleClick(e) {
  const target = e.target;
  target.clicked = true;

  if (isFirstClick || target.haveFlag) return;

  target.classList.add("selected");

  if (isItemBomb(target)) {
    target.innerText = icon.bomb;
    openModal(gameOver);
    stopTimer();
    return;
  }

  isWin();

  clickItem(target, itemsMatrix);
}

function handleContexMenyClick(e) {
  e.preventDefault();
  const target = e.target;
  if (isSelected(target)) return;
  target.clicked = true;

  const bombsCount = document.getElementById("bombs-count");
  const count = parseInt(bombsCount.innerText);
  if (target.haveFlag) {
    target.haveFlag = false;
    target.innerText = "";
    bombsCount.innerText = count + 1;
  } else if (count > 0) {
    target.haveFlag = true;
    target.innerText = icon.flag;
    bombsCount.innerText = count - 1;
  }
  isWin();
}

function handleFirstClick(e) {
  stratTimer();
  const bombMap = new Map();
  const exeptItem = parseInt(e.target.getAttribute("data-id"));

  while (bombMap.size < config.bombCount) {
    const item = getRandom(config.itemCount);

    if (item !== exeptItem) {
      bombMap.set(item, item);
    }
  }

  addBomds(bombMap);

  isFirstClick = false;
  handleClick(e);
}

function clickAdjacentBombs(y, x) {
  let i, j, cell;

  for (i = -1; i < 2; i++) {
    for (j = -1; j < 2; j++) {
      if (i === 0 && j === 0) {
        continue;
      }
      cell = document.getElementById(createId(y + i, x + j));

      if (cell && !isSelected(cell) && !cell.clicked && !cell.haveFlag) {
        cell.classList.add("selected");
        clickItem(cell, y + i, x + j);
      }
    }
  }
}

function clickItem(target) {
  target.clicked = true;

  const [y, x] = getCoordinats(target.id);

  const bombCount = getBombsAround(y, x, itemsMatrix);

  if (bombCount === 0) {
    clickAdjacentBombs(y, x);
  }

  target.innerText = bombCount || "";
  target.style.color = colors[bombCount];
}

function isWin() {
  if (isAllIteemsSelected() && isAllBombsFlagged()) {
    const timerNode = getTimerNode();
    stopTimer();
    openModal(`ваш результат ${timerNode.innerText} `);
  }
}

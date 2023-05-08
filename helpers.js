import { config } from "./const.js";

function cury(func) {
  return function caried(...arg) {
    if (arg.length >= func.length) {
      return func.apply(this, arg);
    }
    return function (...otherArgs) {
      return caried.apply(this, [...arg, ...otherArgs]);
    };
  };
}

function createNode(el, text, className) {
  const element = document.createElement(el);
  element.innerText = text;
  element.classList.add(...className.split(" "));
  return element;
}

// export function createElement(el) {
//   return function (text) {
//     return function (className = "") {
//       const element = document.createElement(el);
//       element.innerText = text;
//       element.classList.add(...className.split(" "));
//       return element;
//     };
//   };
// }
export const createElement = cury(createNode);

export const createDiv = createElement("div");
export const emptyDiv = createDiv("");

export const startButton = createElement("a", "Начать игру", "floating-button");

const itemDiv = () => emptyDiv("item");

const getItem = (y, x, items) => {
  return items[y][x];
};

export const isItemBomb = (item) => {
  return item?.classList?.contains("bomb");
};

const checkBombsOnRightTopCorner = (y, x, items) => {
  return [
    getItem(y, x - 1, items),
    getItem(y + 1, x - 1, items),
    getItem(y + 1, x, items),
  ].filter((item) => item);
};

const checkBombsOnLeftTopCorner = (y, x, items) => {
  return [
    getItem(y, x + 1, items),
    getItem(y + 1, x + 1, items),
    getItem(y + 1, x, items),
  ].filter((item) => item);
};

const checkBombsOnTop = (y, x, items) => {
  return [
    getItem(y, x + 1, items),
    getItem(y, x - 1, items),
    getItem(y + 1, x + 1, items),
    getItem(y + 1, x - 1, items),
    getItem(y + 1, x, items),
  ].filter((item) => item);
};

const checkBombsOnbottom = (y, x, items) => {
  return [
    getItem(y, x + 1, items),
    getItem(y, x - 1, items),
    getItem(y - 1, x + 1, items),
    getItem(y - 1, x - 1, items),
    getItem(y - 1, x, items),
  ].filter((item) => item);
};

const checkBombsOnLeftBottomCorner = (y, x, items) => {
  return [
    getItem(y, x + 1, items),
    getItem(y - 1, x + 1, items),
    getItem(y - 1, x, items),
  ].filter((item) => item);
};

const checkBombsOnRightBottomCorner = (y, x, items) => {
  return [
    getItem(y, x - 1, items),
    getItem(y - 1, x - 1, items),
    getItem(y - 1, x, items),
  ].filter((item) => item);
};

const checkBombs = (y, x, items) => {
  return [
    getItem(y - 1, x - 1, items),
    getItem(y - 1, x, items),
    getItem(y - 1, x + 1, items),
    getItem(y, x + 1, items),
    getItem(y + 1, x + 1, items),
    getItem(y + 1, x, items),
    getItem(y + 1, x - 1, items),
    getItem(y, x - 1, items),
  ].filter((node) => node);
};

function sumBomb(nodeArray) {
  return nodeArray.reduce((prev, curent) => {
    if (isItemBomb(curent)) {
      return prev + 1;
    }
    return prev;
  }, 0);
}

export function getBombsAround(y, x, items) {
  if (x === 0 && y === 0) {
    return sumBomb(checkBombsOnLeftTopCorner(y, x, items));
  }

  if (x === 0 && y === config.height - 1) {
    return sumBomb(checkBombsOnLeftBottomCorner(y, x, items));
  }

  if (x === config.width - 1 && y === 0) {
    return sumBomb(checkBombsOnRightTopCorner(y, x, items));
  }

  if (x === config.width - 1 && y === config.height - 1) {
    return sumBomb(checkBombsOnRightBottomCorner(y, x, items));
  }

  if (y === 0) {
    return sumBomb(checkBombsOnTop(y, x, items));
  }

  if (y === config.height - 1) {
    return sumBomb(checkBombsOnbottom(y, x, items));
  }

  return sumBomb(checkBombs(y, x, items));
}

export function tranformToMatrix(arr) {
  const result = [];
  for (let i = 0; i < config.height; i++) {
    result.push(arr.slice(i * config.width, config.width * (i + 1)));
  }
  return result;
}

export function createId(y, x) {
  return `${y}-${x}`;
}

export function getCoordinats(id) {
  return id.split("-").map((item) => parseInt(item));
}

export function isSelected(node) {
  return node.classList.contains("selected");
}

export function getRandom(itemCount) {
  return Math.round(Math.random() * itemCount);
}

export const itemsArray = Array.from(new Array(config.itemCount)).map(
  (item, index) => {
    const el = itemDiv(item);
    el.setAttribute("data-id", index);
    return el;
  }
);

export function creatAtributeSelector(i) {
  return `[data-id="${parseInt(i)}"]`;
}

export function isAllIteemsSelected() {
  const items = document.querySelectorAll(".item");
  let i = 0;
  items.forEach((item) => {
    if (item.clicked) {
      i++;
    }
  });
  return i === items.length;
}

export function isAllBombsFlagged() {
  const bombs = document.querySelectorAll(".bomb");

  let i = 0;
  bombs.forEach((item) => {
    if (item.haveFlag) {
      i++;
    }
  });

  return i === bombs.length;
}

// export function clickAdjacentBombs(y, x) {
//   let i, j, cell;

//   for (i = -1; i < 2; i++) {
//     for (j = -1; j < 2; j++) {
//       if (i === 0 && j === 0) {
//         continue;
//       }
//       cell = document.getElementById(createId(y + i, x + j));

//       if (cell && !isSelected(cell) && !cell.clicked && !cell.haveFlag) {
//         cell.classList.add("selected");
//         clickItem(cell, y + i, x + j);
//       }
//     }
//   }
// }

// export function clickItem(target, itemsMatrix) {
//   target.clicked = true;
//   const [y, x] = getCoordinats(target.id);

//   const bombCount = getBombsAround(y, x, itemsMatrix);

//   if (bombCount === 0) {
//     clickAdjacentBombs(y, x);
//   }

//   target.innerText = bombCount || "";
//   target.style.color = colors[bombCount];
// }

export function addBomds(bombsMap) {
  bombsMap.forEach((value) => {
    const el = document.querySelector(creatAtributeSelector(value));
    if (el) {
      el.classList.add("bomb");
    }
  });
}

export function getTimerNode() {
  return document.getElementsByClassName("timer")[0];
}

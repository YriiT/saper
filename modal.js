import { createElement, emptyDiv } from "./helpers.js";
import { rules, gameOver } from "./const.js";

const modal = createElement("dialog", "", "modal");
const header = createElement("h3", "Победа", "header");

const modalFooter = emptyDiv("modal-footer");
const modalContent = emptyDiv("modal-content");
modalContent.id = "modal-content";

const closeButton = createElement("button", "Понятно", "button");
const playButton = createElement("button", "Играть снова", "button");

playButton.onclick = () => {
  window.location.reload();
};

closeButton.onclick = closeModal;

modalFooter.append(closeButton);

function openModal(result) {
  const el = document.getElementById("modal-content");
  if (typeof result === "string") {
    el.innerHTML = "";
    modalFooter.replaceChild(playButton, closeButton);
    if (result === gameOver) {
      header.innerText = "Поражение";
    }
    el.append(header, result, modalFooter);
  } else {
    el.innerHTML = "";
    el.append(rules, modalFooter);
  }

  modalContent.append(modalFooter);

  modal.showModal();
  document.getElementsByClassName("button")[0].blur();
}

function closeModal() {
  modal.close();
}
modal.append(modalContent);
export { modal, openModal };

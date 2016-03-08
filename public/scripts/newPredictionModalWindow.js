"use strict"

eventListener('load', initNewPredictionButton, window);


function initNewPredictionButton()
{
  var button = document.querySelector("#np");
  if (button  != null) {
    eventListener("click", newPredictionWindow, button);
  }
}

function newPredictionWindow()
{
  insertElement("/new.html", "#new-modal");
  initCloseModalWindowButton();
}

function initCloseModalWindowButton()
{
  var button = document.querySelector(".close-button");
  if (button  != null) {
    eventListener("click", closeModalWindow, button);
  }
}

function closeModalWindow()
{
  removeElement("#new-modal", ".modal-dark-background")
}

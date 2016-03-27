"use strict";

// eventListener('load', initNewPredictionButton, window);

// function initNewPredictionButton()
// {
//   var button = document.querySelector("#np");
//   var insert = document.querySelector("#new-modal");
//   if (button  != null) {
//     eventListener("click", newPredictionWindow, button);
//     observeMutation(postModalLoading,insert);
//   }
// }

function newPredictionWindow()
{
  console.log("hello");
  insertElement("/new.html", "#new-modal");
}

// Runs after the modal window has loaded.
function postModalLoading()
{
  if (document.querySelector(".modal-dark-background")) {
    initCloseModalWindowButton();
  }
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
  console.log("closeModalWindow()");
  removeElement("#new-modal", ".modal-dark-background")
}

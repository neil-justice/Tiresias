"use strict"

eventListener('load', initLoginSlider, window);


function initLoginSlider()
{
  var button = document.querySelector(".login-button");
  if (button  != null) {
    eventListener("click", loginSlider, button);
  }
}

function loginSlider()
{
  insertElement("login.html", "#login-modal");
  initCloseLoginSlider();
  setupPositioning();
}

function setupPositioning()
{
  var sliderHeight = document.querySelector(".login-slider-wrapper").clientHeight;
  var button = document.querySelector(".login-button")
  var bcoords = getCoordinates(button);
  var vOffset = bcoords.top + sliderHeight;


  // Lower the navbar and main section
  document.querySelector("nav").style.top = sliderHeight + "px";
  document.querySelector("main").style.paddingTop = sliderHeight + "px";

  // Slide on-screen with CSS (if supported)
  document.querySelector(".login-slider-wrapper").style.left = "0";

  // Position the cancel button next to the login button
  document.querySelector(".login-close-button").style.left = bcoords.right + "px";
  document.querySelector(".login-close-button").style.top = vOffset + "px";

  // Change the function of the login button to a form submit button
  deleteEventListener("click", loginSlider, button);
  eventListener("click", submitLoginForm, button);

}

function submitLoginForm()
{
  document.querySelector("#login-form").submit();
}

function initCloseLoginSlider()
{
  var button = document.querySelector(".login-close-button");
  if (button  != null) {
    eventListener("click", closeLoginSlider, button);
  }
}

function closeLoginSlider()
{
  // CSS Slide off-screen (if supported)
  document.querySelector(".login-slider-wrapper").style.left = "-100%";

  // Move the navbar and main section back up to top
  document.querySelector("nav").style.top = 0;
  document.querySelector("main").style.paddingTop = 0;

  // Reset login button behaviour
  var button = document.querySelector(".login-button");
  deleteEventListener("click", submitLoginForm, button);
  initLoginSlider();

  // Finally, remove the HTML
  setTimeout(function() {
    removeElement("#login-modal", ".login-slider-wrapper");
  }, 400);
}

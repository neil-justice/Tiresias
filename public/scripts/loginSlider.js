"use strict";
// Function now called from angularcontroller.js
function setupPositioning()
{
  var lbutton = document.querySelector(".login-button");
  var cbutton = document.querySelector(".login-close-button");
  var slider  = document.querySelector(".login-slider");
  var wrapper = document.querySelector(".login-slider-wrapper");
  
  var sliderHeight = wrapper.clientHeight;
  var bcoords = getCoordinates(lbutton);
  var vOffset = bcoords.top + sliderHeight;
  var w = window.innerWidth;

  // Lower the navbar and main section
  document.querySelector("nav").style.top = sliderHeight - 1 + "px";

  var banner = document.querySelector("#banner");

  if (banner) {
    banner.style.marginTop = -500 + "px";
  }

  // Set login form position
  wrapper.style.top = -sliderHeight + 1 + "px";
  slider.style.marginLeft = bcoords.left + "px";
  slider.style.width = (w - bcoords.left - 10) + "px";

  // Position the cancel button next to the login button
  cbutton.style.left = bcoords.right + "px";
  cbutton.style.top = vOffset + "px";

}

function autoFocusUsernameField() {
  document.querySelector(".autofocusInput").focus();
}

function closeLoginSlider()
{
  // Move the navbar and main section back up to top
  document.querySelector("nav").style.top = 0;

  var banner = document.querySelector("#banner");
  if (banner) {
    banner.style.marginTop = 0;
  }
}
"use strict";

// eventListener('load', initLoginSlider, window);

// Setup the login button
// function initLoginSlider()
// {
//   var button = document.querySelector(".login-button");
//   var insert = document.querySelector("#login-modal");
//   if (button  != null) {
//     eventListener("click", loginSlider, button);
//     observeMutation(postSliderLoading,insert);
//   }
// }

// When slider is hidden, show slider; otherwise submit form
// function loginSlider()
// {
//   if (document.querySelector(".login-slider-wrapper")) {
//     document.querySelector("#login-form").submit();
//   }
//   else {
//     insertElement("/login.html", "#login-modal");
//   }
// }

// Activated after the slider has loaded, allowing for asynchronous AJAX
// The if statement stops it trying to act when nodes are removed
// function postSliderLoading()
// {
//   if (document.querySelector(".login-slider-wrapper"))
//   {
//     setupPositioning();
//     initCloseLoginSlider();
//   }
// }

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
  document.querySelector("main").style.paddingTop = sliderHeight + "px";

  // Set login form position
  wrapper.style.top = -sliderHeight + 1 + "px";
  slider.style.marginLeft = bcoords.left + "px";
  slider.style.width = (w - bcoords.left - 10) + "px";

  // Position the cancel button next to the login button
  cbutton.style.left = bcoords.right + "px";
  cbutton.style.top = vOffset + "px";
}

// Setup the cancel button
// function initCloseLoginSlider()
// {
//   var button = document.querySelector(".login-close-button");
//   if (button  != null) {
//     eventListener("click", closeLoginSlider, button);
//   }
// }

// Function attached to the close button
// function closeLoginSlider()
// {
//   // Move the navbar and main section back up to top
//   document.querySelector("nav").style.top = 0;
//   document.querySelector("main").style.paddingTop = 0;
// 
//   // Finally, remove the HTML after a timeout to allow for animation
//   setTimeout(function() {
//     removeElement("#login-modal", ".login-slider-wrapper");
//   }, 400);
// }

function closeLoginSlider()
{
  // Move the navbar and main section back up to top
  document.querySelector("nav").style.top = 0;
  document.querySelector("main").style.paddingTop = 0;
}
"use strict"

if (addEventListener) {
  addEventListener('load', setNavElementHeights);
} 
else if (attachEvent) {
  attachEvent('onload', setNavElementHeights);
}

function setNavElementHeights() 
{
  var navHeight = document.querySelector("nav").clientHeight;
  
  setNavButtonVertAlign(navHeight);
  setNavLinkPadding(navHeight);
}

function setNavButtonVertAlign(navHeight) 
{
  var btnHeight = document.querySelector("nav .button").clientHeight;
  var height = (navHeight - btnHeight) / 2;
  var newHeight = height.toString() + "px";
  
  var list = document.querySelectorAll(".nav-button-padding");
  
  for( var i = 0; i < list.length; i++) {
      list[i].style.height = newHeight;
  }
}

function setNavLinkPadding(navHeight)
{
  var links = document.querySelectorAll("nav li > a");
  
  for( var i = 0; i < links.length; i++) {
      var h = (navHeight - links[i].offsetHeight) / 2;
      var newLinkHeight = h.toString() + "px";
      links[i].style.paddingTop = newLinkHeight;
      links[i].style.paddingBottom = newLinkHeight;
  }
}

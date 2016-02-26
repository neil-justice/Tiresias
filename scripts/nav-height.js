"use strict"
document.addEventListener('load', start);

function start()
{
  setNavElementHeights();
}

function setNavElementHeights() 
{
  var navHeight = document.getElementById("navBar").clientHeight;
  
  if (!navHeight) {
    return undefined;
  }
  
  setNavButtonVertAlign(navHeight);
  setNavLinkPadding(navHeight);
}

function setNavButtonVertAlign(navHeight) 
{
  var btnHeight = document.getElementById("nav-button").clientHeight;
  var height = (navHeight - btnHeight) / 2;
  var newHeight = height.toString() + "px";
  
  var list = document.getElementsByClassName("nav-button-padding");
  
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

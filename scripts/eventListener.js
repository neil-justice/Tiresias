"use strict"

//Handles browsers which don't understand addEventListener
function  eventListener(eventType, func, element)
{
  if (element.addEventListener) {
    element.addEventListener(eventType, func);
  }
  else if (element.attachEvent) {
    element.attachEvent("on" + eventType, func);
  }
}

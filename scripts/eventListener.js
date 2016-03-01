"use strict"

//Handles browsers which don't understand addEventListener
function  eventListener(eventType, func, e)
{
  if (e.addEventListener) {
    e.addEventListener(eventType, func);
  }
  else if (e.attachEvent) {
    e.attachEvent("on" + eventType, func);
  }
}

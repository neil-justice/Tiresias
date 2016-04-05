"use strict"

// Only returns relative coordinates
function getCoordinates(element) {
  var rect = element.getBoundingClientRect();

  return {
    left:   rect.left,
    right:  rect.right,
    top:    rect.top,
    bottom: rect.bottom
  }
}

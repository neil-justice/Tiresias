"use strict"

// Only returns relative coordinates
function getCoordinates(element) {
  var rect = element.getBoundingClientRect();

  return {
    left:   rect.left + window.scrollX,
    right:  rect.right+ window.scrollX,
    top:    rect.top + window.scrollY,
    bottom: rect.bottom + window.scrollY
  }
}

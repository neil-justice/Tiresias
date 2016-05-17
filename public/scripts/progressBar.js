"use strict";

function calcProgress()
{
  // This is a dummy value while JSON objects don't contain a date
  setProgress(100);
}

function setProgress(percent)
{
  if(percent > 100) percent = 100;
  if(percent < 0) percent = 0;

  var color = [
      '#00FF00',
      '#76ff03',
      '#64dd17',
      '#c6ff00',
      '#eeff41',
      '#ffeb3b',
      '#fdd835',
      '#f9a825',
      '#d84315',
      '#ff3d00',
      '#FF0000',]

  var animate = document.querySelector("#svg-animate");
  var animateColor = document.querySelector("#svg-animate-color");

  var cont = document.querySelector("#svg-border");
  var rect = cont.getBoundingClientRect();
  var contWidth = rect.right - rect.left;

  var maxBarWidth = contWidth * 0.985;
  var width = maxBarWidth / (100 / percent);

  animate.setAttribute("to",  width + 'px');
  animateColor.setAttribute("to",  color[Math.floor(percent / 10)]);
}

"use strict";
eventListener('load', calcProgress, window);

function calcProgress()
{
  // This is a dummy value while JSON objects don't contain a date
  setProgress(90);
}

function setProgress(percent)
{
  if(percent > 100) percent = 100;
  if(percent < 0) percent = 0;

  var bar = document.querySelector("#svg-bar");
  var cont = document.querySelector("#svg-border");
  var rect = cont.getBoundingClientRect();
  var contWidth = rect.right - rect.left;

  var maxBarWidth = contWidth * 0.9737669854;
  var width = maxBarWidth / (100 / percent);

  bar.setAttribute("width",  width + 'px');
}

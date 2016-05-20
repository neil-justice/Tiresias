"use strict";

function calcProgress(start, end)
{
  var startDay = moment(start);
  var endDay = moment(end);

  var now = moment();
  var totalTime = endDay.diff(startDay, 'days');
  var daysPassed = now.diff(startDay, 'days');

  setProgress((daysPassed*100) / totalTime);

  return { startDay: startDay.format("Do MMM YYYY"),
           endDay: endDay.format("Do MMM YYYY"),
           daysLeft: endDay.diff(now, 'days')};
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

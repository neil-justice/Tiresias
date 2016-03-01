"use strict"

eventListener('load', start, window);


function start()
{
  var b = document.querySelector("#np");
  if (b  != null) {
    eventListener("click", attach, b);
  }
}

function attach()
{
  insertHTML("new.html", "#new-modal");
}

function insertHTML(url, target)
{
  var x = new XMLHttpRequest();

  x.onreadystatechange = function() {
    if (x.readyState != XMLHttpRequest.DONE) return;

    if (x.readyState == 4 && x.status == 200) {
      inject(x.responseText,target);
    }
  };

  x.open("GET", url, true);
  x.send(null);
}

function inject(nodes, target)
{
  var targetNode = document.querySelector(target);

  targetNode.innerHTML = nodes;
}

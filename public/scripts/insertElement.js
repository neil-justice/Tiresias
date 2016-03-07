"use strict"

function insertElement(url, target)
{
  var x = new XMLHttpRequest();

  x.onreadystatechange = function() {
    if (x.readyState != XMLHttpRequest.DONE) return;

    if (x.readyState == 4 && x.status == 200) {
      insert(x.responseText,target);
    }
  };

  x.open("GET", url, false);
  x.send(null);
}

function insert(nodes, target)
{
  var targetNode = document.querySelector(target);

  targetNode.innerHTML = nodes;
}

"use strict";

function observeMutation(func, element) {
  var observer = new MutationObserver(func);

  var config = { attributes: false,
                 childList: true,
                 characterData: true,
                 subtree: true };

  observer.observe(element, config);
}

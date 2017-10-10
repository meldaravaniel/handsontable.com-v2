(function() {
  var d = document;
  var w = window;
  
  function init() {
    var root = d.querySelector('.knowledge-base');

    root.addEventListener('click', function(event) {
      var target = event.target;
      
      if (target && target.classList.contains('thread')) {
        event.preventDefault();
        
        var content = target.parentElement.nextElementSibling;
        
        if (target.dataset.opened === 'true') {
          target.dataset.opened = 'false';
          content.style.height = '';
          
          return;
        }
        
        for (var i = 0, textNodes = root.querySelectorAll('.thread'); i < textNodes.length; i++) {
          textNodes[i].dataset.opened = 'false';
        }
        for (var i = 0, textNodes = root.querySelectorAll('.answers > div'); i < textNodes.length; i++) {
          textNodes[i].style.height = '';
        }
        
        content.style.height = (content.firstElementChild.getBoundingClientRect().height + 25) + 'px';
        target.dataset.opened = 'true';
      }
    });  
  }
  
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    init();
  } else {
    d.addEventListener('DOMContentLoaded', init);
  }
}());
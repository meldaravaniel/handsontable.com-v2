(function() {
  var d = document;
  var w = window;
  
  d.addEventListener("DOMContentLoaded", function() {
    var root = d.querySelector('.knowledge-base');

    root.addEventListener('click', function(event) {
      var target = event.target;
      
      event.preventDefault();
      
      for (var i = 0, textNodes = root.querySelectorAll('.answers > div'); i < textNodes.length; i++) {
        if (textNodes[i].style.height !== '') {
          textNodes[i].style.height = '';
        }
      }
      
      if (target && target.tagName === 'A') {
        var content = target.parentElement.nextElementSibling;
        
        content.style.height = (content.firstElementChild.getBoundingClientRect().height + 25) + 'px';
      }
    });    
  });
}());
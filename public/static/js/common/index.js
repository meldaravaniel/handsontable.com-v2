(function() {
  var d = document;
  var w = window;
  var $ = function(id) {
    return d.getElementById(id);
  };
  var $$ = function(selector) {
    return d.querySelectorAll(selector);
  };

  d.addEventListener('DOMContentLoaded', function() {
    // click on external iframe snippet (https://gist.github.com/jaydson/1780598)
    var iframeMouseOver = false;

    w.addEventListener('blur', function() {
      if (iframeMouseOver) {
        dataLayer.push({'event': 'Github iframe click'});
      }
    });

    $('mobile-nav-menu').addEventListener('mouseover', function() {
      iframeMouseOver = true;
    });
    $('mobile-nav-menu').addEventListener('mouseout', function() {
      iframeMouseOver = false;
    });
    // end
    
    // mobile hamburger
    $('mobile-nav-menu').addEventListener('ontouchstart' in w ? 'touchstart' : 'click', function(event) {
      var element = $('mobile-nav-menu').parentElement;
      
      element.classList.toggle('mobile-active');
      element.classList.toggle('mobile-inactive');
    });
    // end
    
    // Tabs
    d.addEventListener('click', function(event) {
      var target = event.target;
      
      if (target.id && /^tab\-./.test(target.id) && !/^tab\-content\-./.test(target.id)) {
        var tabGroups = $$('.tabs');
        
        for (var i = 0; i < tabGroups.length; i++) {
          if (tabGroups[i].contains(target)) {
            var tabs = tabGroups[i].querySelectorAll('[id^=tab-]');
            
            for (var j = 0; j < tabs.length; j++) {
              if (tabs[j].classList.contains('active')) {
                tabs[j].classList.remove('active');
              }
            }
            break;
          }
        }
        
        var contentId = 'tab-content-' + target.id.replace('tab-', '');
        var contentElement = $(contentId);
        var contentToActivate = contentElement.dataset.tabForward ? $('tab-content-' + contentElement.dataset.tabForward) : contentElement;
        
        target.classList.add('active');
        contentToActivate.classList.add('active');
        
        var event;
        
        try {
          event = new Event('tab-content-active');
        } catch (ex) {
          event = document.createEvent('Event');
          event.initEvent('tab-content-active', true, true);
        }
        contentElement.dispatchEvent(event);
      }
    });
    // end
  });
  
  // dynamic stats
  axios({
    url: 'https://stats.handsontable.com/stats'
  }).then(function(resp) {
    var data = resp.data;
    var elements = d.querySelectorAll('[data-bind]');
    
    for (var i = 0, len = elements.length; i < len; i++) {
      var prop = elements[i].dataset.bind;
      
      if (data[prop] !== void 0) {
        elements[i].innerText = data[prop];
      }
    }
  });
  // end
}());
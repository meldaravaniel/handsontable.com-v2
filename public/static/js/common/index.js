(function() {
  var d = document;
  var w = window;
  var $ = function(id) {
    return d.getElementById(id);
  };
  var $$ = function(selector) {
    return d.querySelectorAll(selector);
  };

  function init() {
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
    function eventListenerOptionsSupported() {
      var supported = false;
      try {
        var opts = Object.defineProperty({}, 'passive', {
          get: function() {
            supported = true;
          }
        });
        window.addEventListener("test", null, opts);
      } catch (e) {}

      return supported;
    }
    var eventOptions;
    
    if (eventListenerOptionsSupported()) {
      eventOptions = {passive: true};
    }
  
    $('mobile-nav-menu').addEventListener('ontouchstart' in w ? 'touchstart' : 'click', function(event) {
      var element = $('mobile-nav-menu').parentElement;
      
      console.log('dewdewdewdewdew', element);
      
      element.classList.toggle('mobile-active');
      element.classList.toggle('mobile-inactive');
    }, eventOptions);
    // end

    // Tabs
    d.addEventListener('click', function(event) {
      var target = event.target;
      
      if (target.id && /^tab\-./.test(target.id) && !/^tab\-content\-./.test(target.id)) {
        var tabGroups = $$('.tabs-alternative').length ? $$('.tabs-alternative') : $$('.tabs');
        
        for (var i = 0; i < tabGroups.length; i++) {
          if (tabGroups[i].contains(target)) {
            var tabsContent = tabGroups[i].querySelectorAll('[id^=tab-content-]');
            
            for (var j = 0; j < tabsContent.length; j++) {
              if (tabsContent[j].hasAttribute('aria-hidden')) {
                tabsContent[j].setAttribute('aria-hidden', 'true');
              }
            }
            
            var tabs = tabGroups[i].querySelectorAll('[id^=tab-]');
            
            for (var j = 0; j < tabs.length; j++) {
              if (tabs[j].classList.contains('active')) {
                tabs[j].classList.remove('active');
              }
              if (tabs[j].hasAttribute('aria-selected')) {
                tabs[j].setAttribute('aria-selected', 'false');
              }
              if (tabs[j].hasAttribute('aria-hidden')) {
                tabs[j].setAttribute('aria-hidden', 'true');
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
        
        if (target.hasAttribute('aria-selected')) {
          target.setAttribute('aria-selected', 'true');
        }
        if (contentToActivate.hasAttribute('aria-hidden')) {
          contentToActivate.setAttribute('aria-hidden', 'false');
        }
        
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

    // dynamic stats
    if (typeof localStorage !== 'undefined') {
      function updateElements(data) {
        var elements = d.querySelectorAll('[data-bind]');
        
        for (var i = 0, len = elements.length; i < len; i++) {
          var prop = elements[i].dataset.bind;
          
          if (data[prop] !== void 0) {
            elements[i].innerText = data[prop];
          }
        }
      }
      
      function updateVariables(callback) {
        fetch('https://stats.handsontable.com/stats').then(function(response) {
          return response.json();
        }).then(function(data) {
          data.lastUpdate = Date.now();
          
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
          callback(data);
        })
      }
      
      var STORAGE_KEY = 'dynamic-variables';
      var variables = localStorage.getItem(STORAGE_KEY);
      
      if (typeof variables === 'string' && variables) {
        var data = null;
        
        try {
          data = JSON.parse(variables);
        } catch(ex) {}
        
        if (data === null) { // JSON is broken - get data from backend.
          localStorage.removeItem(STORAGE_KEY);
          
          updateVariables(function(data) {
            updateElements(data);
          });
          
        } else if (Date.now() - data.lastUpdate > 3600 * 8 * 1000) { // Cached data are to old - get data from backend
          updateVariables(function(data) {
            updateElements(data);
          });
          
        } else { // Update elements based on cached values
          updateElements(data);
        }
        
      } else {
        // Variables are not exist in the cached - get data from backend.
        updateVariables(function(data) {
          updateElements(data);
        });
      }
    }
    // end

    // lazy images
    var elements = $$('[data-lazy-image]');

    function replaceElementWithImg(target) {
      if (!target.parentNode) {
        return;
      }
      var asBackground;
      var src;
      
      if (target.dataset && target.dataset.asBackground) {
        asBackground = target.dataset.asBackground;
      }
      if (target.dataset && target.dataset.src) {
        src = target.dataset.src;
      }
      
      if (asBackground) {
        $$(asBackground)[0].style.backgroundImage = 'url(' + src + ')';
        target.parentNode.removeChild(target);
      } else {
        var img = document.createElement('img');
        
        if (target.dataset && target.dataset.className) {
          img.classList.add(target.dataset.className);
        }
        if (src) {
          img.src = src;
        }
        if (target.dataset && target.dataset.alt) {
          img.setAttribute('alt', target.dataset.alt);
        }
        img.style.width = target.style.width;
        img.style.height = target.style.height;
        
        target.parentNode.replaceChild(img, target);
      }
    }

    if (typeof IntersectionObserver === 'undefined') {
      for (var i = 0; i < elements.length; i++) {
        replaceElementWithImg(elements[i]);
      }
      
    } else {
      var options = {
        rootMargin: '30px',
        threshold: 0,
      }
      
      var observer = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
          var target = entry.target;
      
          if (entry.isIntersecting) {
            replaceElementWithImg(target);
          }
        });
      }, options);
      
      for (var i = 0; i < elements.length; i++) {
        observer.observe(elements[i]);
      }
    }
  }
  
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    init();
  } else {
    d.addEventListener('DOMContentLoaded', init);
  }
}());
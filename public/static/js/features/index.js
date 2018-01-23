(function() {
  var d = document;
  var w = window;
  var $ = function(id) {
    return d.getElementById(id);
  };
  var $$ = function(selector) {
    return d.querySelectorAll(selector);
  };
  
  function debounce(func, wait) {
    var lastTimer = null;
    var result;

    function _debounce() {
      var args = arguments;

      if (lastTimer) {
        clearTimeout(lastTimer);
      }
      lastTimer = setTimeout(function() {
        result = func.apply(this, args);
      }, wait);

      return result;
    }

    return _debounce;
  }
  
  var hotInstance;
  var validScript;
  
  function evaluate(scripts) {
    scripts.unshift('(function() { document.getElementById("example").textContent = "";');
    scripts.push('return hot }())');
    
    var errorHolder = $('example-error');
    
    errorHolder.style.display = 'none';
    
    try {
      if (hotInstance) {
        hotInstance.destroy();
      }
      
      hotInstance = eval(scripts.join(''));
      validScript = scripts.join('');
    } catch (ex) {
      hotInstance = eval(validScript);
      errorHolder.style.display = 'block';
    }
  }
  
  function init() {
    var dataInitialScript = $$('[data-source-type=data]')[0].textContent.trim();
    var sourceInitialScript = $$('[data-source-type=source]')[0].textContent.trim();
    
    var codeHolder = {
      editor: null,
      sourceValue: sourceInitialScript,
      dataValue: dataInitialScript,
    };
    var activeTab = 'source';
    
    evaluate([dataInitialScript, sourceInitialScript]);
    
    var codeDOMHolders = $$('.code-holder');
    
    for (var i = 0, len = codeDOMHolders.length; i < len; i++) {
      codeHolder.editor = CodeMirror(function(elt) {
        codeDOMHolders[i].parentNode.replaceChild(elt, codeDOMHolders[i]);
      }, {
        value: codeHolder[activeTab + 'Value'],
        indentUnit: 2,
        lineWrapping: true,
        tabSize: 2,
        lineNumbers: true,
        theme: 'dracula',
        mode: 'javascript'
      });
    }
    
    var onChanges = debounce(function(instance, changes) {
      codeHolder[activeTab + 'Value'] = instance.getValue();
      
      evaluate([codeHolder.dataValue, codeHolder.sourceValue]);
    }, 500);
    
    codeHolder.editor.on('changes', onChanges);
    
    $('tab-content-source').addEventListener('tab-content-active', function(event) {
      activeTab = 'source';
      codeHolder.dataValue = codeHolder.editor.getValue();
      codeHolder.editor.setValue(codeHolder.sourceValue);
    });
    $('tab-content-data').addEventListener('tab-content-active', function(event) {
      activeTab = 'data';
      codeHolder.sourceValue = codeHolder.editor.getValue();
      codeHolder.editor.setValue(codeHolder.dataValue);
    });
  }
  
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    init();
  } else {
    d.addEventListener('DOMContentLoaded', init);
  }
}());
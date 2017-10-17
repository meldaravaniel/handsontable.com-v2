(function() {
  var ajax = new XMLHttpRequest();
  var svgResource = '';
  
  if (PAGE_NAME === 'index' || PAGE_NAME === 'pricing') {
    svgResource = '-' + PAGE_NAME;
  }
  
  ajax.open('GET', '/static/images/svg/icons' + svgResource + '.svg');
  ajax.send();
  ajax.onload = function(e) {
    var div = document.createElement('div');
    
    div.style.display = 'none';
    div.innerHTML = ajax.responseText;
    document.body.insertBefore(div, document.body.childNodes[0]);
  }
}());
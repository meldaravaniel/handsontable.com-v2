(function() {
  var ajax = new XMLHttpRequest();
  
  ajax.open('GET', '/static/images/svg/icons.svg');
  ajax.send();
  ajax.onload = function(e) {
    var div = document.createElement('div');
    
    div.innerHTML = ajax.responseText;
    document.body.insertBefore(div, document.body.childNodes[0]);
  }
}());
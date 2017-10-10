(function() {
  var d = document;
  var search = location.search;

  function init() {
    var urlState = search.match(/state=(success|error)/);
    var urlCategory = search.match(/category=(\w+)/);

    var form = d.querySelector('#contact-form');
    var categorySelect = form.querySelector('[name=category]');
    var orderIdInput = form.querySelector('[name=orderId]');
    var submitButton = form.querySelector('[type=submit]');
    var isCategoryExists = false;

    if (Array.isArray(urlState)) {
      urlState = urlState[1];

      if (urlState === 'success') {
        d.getElementById('form-sent').style.display = 'block';
      }
      if (urlState === 'error') {
        d.getElementById('form-error').style.display = 'block';
      }
    }
    if (Array.isArray(urlCategory)) {
      isCategoryExists = Array.prototype.map.call(categorySelect.options, function(element) {
        return element.value;
      }).indexOf(urlCategory[1]) >= 0;

      if (isCategoryExists) {
        categorySelect.value = urlCategory[1];
        onCategoryChange();
      }
    }

    categorySelect.addEventListener('change', onCategoryChange);

    function onCategoryChange() {
      if (categorySelect.value === 'technical_support') {
        orderIdInput.type = 'text';
      } else {
        orderIdInput.type = 'hidden';
      }
    }

    form.addEventListener('submit', function() {
      submitButton.classList.remove('blue');
      submitButton.classList.add('grey');
      submitButton.value = 'Sending...';
    });
  }

  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    init();
  } else {
    d.addEventListener('DOMContentLoaded', init);
  }
}());
function JsfiddleExporter(examplesObj) {
  this.html = '';
  this.css = '';
  this.js = '';
  this.resources = '';

  this.examples = examplesObj;
  this.exampleCodeGenerator = examples.exampleCodeGenerator;

  this.urlEndIndex = window.location.href.lastIndexOf("/");
  this.baseUrl = window.location.href.substr(0, this.urlEndIndex);

  var arrayEach = Handsontable.helper.arrayEach;

  /**
   * Prepare the HTML part of the fiddle.
   */
  this.prepareHtml = function() {
    this.html += this.exampleCodeGenerator.makeHotContainer();
  };

  /**
   * Prepare the CSS part of the fiddle.
   */
  this.prepareCss = function() {
    // External resources hack:
    var i;

    this.css += '</style>\n';
    for (i = 0; i < this.exampleCodeGenerator.externalCss.length; i++) {
      this.css += this.exampleCodeGenerator.externalCss[i].getHtml();
    }

    for (i = 0; i < this.exampleCodeGenerator.externalJs.length; i++) {
      this.css += this.exampleCodeGenerator.externalJs[i].getHtml();
    }
  };

  /**
   * Prepare the JS part of the fiddle.
   */
  this.prepareJs = function() {
    this.js += this.exampleCodeGenerator.getInternalScripts().replace('<script>','').replace('</script>','');
  };

  /**
   * Prepare the external resources.
   */
  this.prepareResources = function() {
    var i;
    for (i = 0; i < this.exampleCodeGenerator.externalCss.length; i++) {
      this.resources += this.exampleCodeGenerator.externalCss[i].body + ',';
    }

    for (i = 0; i < this.exampleCodeGenerator.externalJs.length; i++) {
      this.resources += this.exampleCodeGenerator.externalJs[i].body;

      if (i !== this.exampleCodeGenerator.externalJs.length - 1) {
        this.resources += ',';
      }
    }
  };

  /**
   * Export the example's data to JsFiddle.
   */
  this.export = function(submit) {
    this.prepareHtml();
    this.prepareJs();
    this.prepareCss();

    // Currently not working - user needs to click 'Run' to make it work. Probably the external dependencies are loaded asynchrnonously.
    // this.prepareResources();

    if (submit) {
      this.submit();

      this.css = '';
      this.js = '';
      this.html = '';
      this.resources = '';
    }
  };

  /**
   * Create a temporary form and send data to JsFiddle.
   */
  this.submit = function() {
    var form = document.createElement('FORM');
    form.action = 'http://jsfiddle.net/api/post/library/pure/';
    form.method = 'POST';
    form.target = '_blank';
    form.innerHTML = '<input type="text" name="title" value="Handsontable example">' +
      '<textarea name="wrap">l</textarea>' +
      // '<textarea name="resources">' + this.resources.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</textarea>' +
      '<textarea name="html">' + this.html.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</textarea>' +
      '<textarea name="js">' + this.js.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</textarea>' +
      '<textarea name="css">' + this.css.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</textarea>';

    form.style.visibility = 'hidden';

    document.body.appendChild(form);
    form.submit();
    form.parentNode.removeChild(form);
  };
}
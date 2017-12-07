function TagTemplate(pre, body, post) {
  this.pre = pre || '';
  this.body = body || '';
  this.post = post || '';

  this.getHtml = function() {
    return this.pre + this.body + this.post;
  }
}

function ExampleCodeGenerator() {
  var _this = this;
  var arrayEach = Handsontable.helper.arrayEach;
  this.wrapper = new TagTemplate();
  this.head = new TagTemplate();
  this.body = new TagTemplate();
  this.html = '';
  this.latestSettingsJson = '';

  this.externalCss = [];
  this.externalJs = [];

  /**
   * Create the HTML document outlines.
   */
  this.initWrapper = function() {
    this.wrapper.pre = '<!doctype html>\n<html>\n';
    this.wrapper.post = '</html>';
  };

  /**
   * Create `<head>` outlines.
   */
  this.initHead = function() {
    this.head.pre = '<head>\n';
    this.head.post = '</head>\n';
  };

  /**
   * Create `<body>` outlines.
   */
  this.initBody = function() {
    this.body.pre = '<body>\n';
    this.body.post = '</body>\n';
  };

  /**
   * Add the external CSS dependency.
   *
   * @param {String} url dependency url.
   */
  this.addExternalCss = function(url) {
    var wrapper = new TagTemplate(
      '<link rel="stylesheet" type="text/css" href="',
      url,
      '">\n'
    );

    this.externalCss.push(wrapper);
  };

  /**
   * Add the external JS dependency.
   *
   * @param {String} url dependency url.
   */
  this.addExternalJs = function(url) {
    var wrapper = new TagTemplate(
      '<script src="',
      url,
      '"></script>\n'
    );

    this.externalJs.push(wrapper);
  };

  /**
   * Add all external dependencies.
   */
  this.addAllExternal = function() {
    this.addExternalCss('https://docs.handsontable.com/pro/bower_components/handsontable-pro/dist/handsontable.full.min.css');
    this.addExternalCss('https://handsontable.com/static/css/main.css');

    this.addExternalJs('https://docs.handsontable.com/pro/bower_components/handsontable-pro/dist/handsontable.full.min.js');
  };

  /**
   * Create the Handsontable container element.
   */
  this.makeHotContainer = function() {
    var container = new TagTemplate('<div id="hot">', null, '</div>\n');

    return container.getHtml();
  };

  /**
   * Get the internal scripts.
   */
  this.getInternalScripts = function() {
    var initScript = document.querySelectorAll('[data-jsfiddle]');
    var result = '';

    arrayEach(initScript, function(elem, i) {
      result += new TagTemplate('<script>', elem.innerHTML + '\nvar hot = new Handsontable(hotElement, hotSettings);\n', '</script>').getHtml() + '\n';
    });
    
    if (this.latestSettingsJson !== '') {
      result = this.replaceWithNewSettings(result, this.latestSettingsJson);
    }

    return result;
  };

  /**
   * Replace the old HOT settings with the new provided ones.
   *
   * @param {String} input input JSON
   * @param {String} newSettings JSON of the new settings.
   */
  this.replaceWithNewSettings = function(input, newSettings) {
    input = input.replace(/(var hotSettings(.|\n)*(};))/gi, newSettings);
    input = input.replace('\n\n', '\n');

    return input;
  };

  /**
   * Update the HOT settings.
   */
  this.updateHotSettings = function(newSettings) {
    if (!newSettings) {
      newSettings = '';
    } else {
      var stringifiedSettings = JSON.stringify(newSettings, null, 2);

      // Add the data object
      stringifiedSettings = stringifiedSettings.replace('"getDataPlaceholder"', 'dataObject');

      // Add flag renderer lost in the stringify method
      stringifiedSettings = stringifiedSettings.replace('"data": "flag"', '"data": "flag",\n\t\t\trenderer: flagRenderer');

      stringifiedSettings = stringifiedSettings.replace(/\"([^(\")"]+)\":/g,"$1:").replace(/"/g, '\'');

      newSettings = 'var hotSettings = ' + stringifiedSettings + ';';
    }

    this.latestSettingsJson = newSettings;
    this.html = this.replaceWithNewSettings(this.html, newSettings);
  };

  /**
   * Generate the HTML output string.
   */
  this.generateHtml = function() {
    var i;

    this.html += this.wrapper.pre;

    // --- HEAD START
    this.html += this.head.pre;

    for (i = 0; i < this.externalCss.length; i++) {
      this.html += this.externalCss[i].getHtml();
    }

    for (i = 0; i < this.externalJs.length; i++) {
      this.html += this.externalJs[i].getHtml();
    }

    this.html += this.head.post;
    // --- HEAD END

    this.html += this.body.pre;

    this.html += this.makeHotContainer();

    this.html += this.getInternalScripts();

    this.html += this.body.post;
    this.html += this.wrapper.post;
  };

  /**
   * Get the HTML output string.
   *
   * @returns {String}
   */
  this.getHtml = function() {
    if (this.html === '') {
      this.generateHtml();
    }

    return this.html;
  };

  /**
   * Initialization script.
   */
  this.init = function() {
    _this.initWrapper();
    _this.initHead();
    _this.initBody();

    _this.addAllExternal();
  }();
}
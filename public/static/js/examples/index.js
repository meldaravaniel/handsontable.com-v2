(function() {
  var d = document;
  var w = window;
  var $ = function(id) {
    return d.getElementById(id);
  };
  var $$ = function(selector) {
    return d.querySelectorAll(selector);
  };
  
  var _features = {
    headers: {
      configObject: {
        rowHeaders: true,
        colHeaders: ['ID', 'Country', 'Code', 'Currency', 'Level', 'Units', 'Date', 'Change']
      },
    },
    fixed: {
      configObject: {
        fixedRowsTop: 2,
        fixedColumnsLeft: 3
      }
    },
    sorting: {
      configObject: {
        columnSorting: true,
        sortIndicator: true,
        autoColumnSize: {
          samplingRatio: 23
        }
      },
      dependencies: [
        'headers'
      ]
    },
    'merge-cells': {
      configObject: {
        mergeCells: true
      },
      dependencies: [
        'context-menu'
      ]
    },
    'manual-resize': {
      configObject: {
        manualRowResize: true,
        manualColumnResize: true
      },
      dependencies: [
        'headers'
      ]
    },
    'manual-move': {
      configObject: {
        manualRowMove: true,
        manualColumnMove: true
      },
      dependencies: [
        'headers'
      ]
    },
    'conditional-formatting': {
      configObject: {
        cells: function (row, col, prop) {
          var cellProperties = {};

          if (col === this.instance.countCols() - 1) {
            cellProperties.renderer = function (instance, td, row, col, prop, value, cellProperties) {
              Handsontable.cellTypes[cellProperties.type].renderer.apply(this, arguments);

              if (parseFloat(value) > 0) {
                td.style.color = '#10D22B';
              } else if (parseFloat(value) < 0) {
                td.style.color = '#BB2424';
              } else {
                td.style.color = '';
              }
            }
          }

          return cellProperties;
        }
      }
    },
    'context-menu': {
      configObject: {
        contextMenu: true
      }
    },
    filters: {
      configObject: {
        filters: true
      },
      dependencies: [
        'dropdown-menu'
      ]
    },
    'dropdown-menu': {
      configObject: {
        dropdownMenu: true
      }
    },
    'csv-export': {
      configObject: {}
    },
    'fixed-bottom': {
      configObject: {
        fixedRowsBottom: 2
      }
    },
    'column-summary': {
      configObject: {
        columnSummary: [
          {
            destinationColumn: 4,
            destinationRow: 0,
            type: 'average',
            forceNumeric: true,
            suppressDataTypeErrors: true,
            readOnly: true
          }
        ]
      }
    },
    'nested-headers': {
      configObject: {
        nestedHeaders: [
          ['ID', {label: 'A', colspan: 2}, {label: 'B', colspan: 4}, 'C'],
          ['ID', {label: 'D', colspan: 2}, {label: 'E', colspan: 2}, {label: 'F', colspan: 2}, 'H'],
          ['ID', 'I', 'J', 'K', 'L', 'M', 'N', 'O']
        ]
      }
    },
    'collapsible-columns': {
      configObject: {
        collapsibleColumns: true,
        hiddenColumns: true
      },
      dependencies: [
        'nested-headers'
      ]
    },
    'trim-rows': {
      configObject: {
        trimRows: [1, 2, 5]
      }
    }
  };
  
  var features = function() {
    return _features;
  }
  
  var HOT_SETTINGS_CLONE = {};
  
  Handsontable.helper.deepExtend(HOT_SETTINGS_CLONE, window.hotSettings);
  
  function getLocationOrigin() {
    return location.protocol + '//' + location.host + location.pathname;
  }
  function getLocationSearch() {
    return location.search.substr(1, location.search.length);
  }
  
  function addToURL(enabledFeatures) {
    var features = getLocationSearch();
    
    if (features) {
      features = features.split('&');
    } else {
      features = [];
    }
    features = features.concat(enabledFeatures);
    
    return features.join('&');
  }
  
  function removeFromURL(disabledFeatures) {
    var features = getLocationSearch().split('&');
    
    disabledFeatures.forEach(function(feature) {
      if (features.indexOf(feature) !== -1) {
        features.splice(features.indexOf(feature), 1);
      }
    });
    
    return features.join('&');
  }
  
  function toggleFeatures(featureDescriptions) {
    var featuresIds = [];
    var allFeatures = [];
    
    featureDescriptions.forEach(function(featureDescription) {
      if (featuresIds.indexOf(featureDescription.id) !== -1) {
        allFeatures[featuresIds.indexOf(featureDescription.id)].dependency = false;
        return;
      }
      featuresIds.push(featureDescription.id);
      
      featureDescription.dependency = false;
      allFeatures.push(featureDescription);
      
      (featureDescription.dependencies || []).forEach(function(dependencyFeatureId) {
        if (featuresIds.indexOf(dependencyFeatureId) === -1) {
          var depsFeature = features()[dependencyFeatureId];
          
          if (depsFeature.enabled || depsFeature.enabled === void 0) {
            depsFeature.id = dependencyFeatureId;
            depsFeature.dependency = true;
            
            featuresIds.push(dependencyFeatureId);
            allFeatures.push(depsFeature);
          }
        }
      });
    });
    
    $('export-buttons').classList[featuresIds.indexOf('csv-export') === -1 ? 'remove' : 'add']('visible');
    
    updateHandsontableSettings(allFeatures);
    updateFeatureCheckboxes(allFeatures);
    updateEnabledFeaturesText(allFeatures);
  }
  
  var hot;
  
  function updateHandsontableSettings(features) {
    var hotSettingsClone = {};
    
    Handsontable.helper.deepExtend(hotSettingsClone, HOT_SETTINGS_CLONE);
    
    features.forEach(function(feature) {
      Object.keys(feature.configObject).forEach(function(configKey) {
        hotSettingsClone[configKey] = feature.configObject[configKey];
      });
    });
    
    if (hot) {
      hot.destroy();
    }
    hot = new Handsontable($('hot'), hotSettingsClone);
    
    updateCodePreview(hotSettingsClone);
  }
  
  var codeGenerator = new ExampleCodeGenerator();
  
  function updateCodePreview(hotSettings) {
    var code = $$('#tab-content-code > pre > code');
    
    var settingsToDisplay = Handsontable.helper.clone(hotSettings);
    settingsToDisplay.data = 'getDataPlaceholder';
    
    codeGenerator.updateHotSettings(settingsToDisplay);
    code[0].textContent = codeGenerator.getHtml();
    
    if (typeof Prism !== 'undefined') {
      Prism.highlightAll();
    }
  }
  
  function updateFeatureCheckboxes(features) {
    var checkedCheckboxes = $$('input[id^=feature-]:checked');
    
    for (var i = 0; i < checkedCheckboxes.length; i++) {
      checkedCheckboxes[i].checked = false;
    }
    
    features.forEach(function(feature) {
      var element = $('feature-' + feature.id);
      
      element.checked = true;
      element.className = feature.dependency ? 'dependency' : '';
    });
  }
  
  function updateEnabledFeaturesText(features) {
    var enabledFeaturesDesc = $$('[id^=feature-desc-]');
    
    for (var i = 0; i < enabledFeaturesDesc.length; i++) {
      enabledFeaturesDesc[i].setAttribute('aria-hidden', 'true');
    }
    
    features.forEach(function(feature) {
      $('feature-desc-' + feature.id).setAttribute('aria-hidden', 'false');
    });
    $('feature-noop').setAttribute('aria-hidden', features.length ? 'true' : 'false');
  }
  
  function addListenersFeatureSwitchers() {
    var switches = $$('.feature_entry input[type=checkbox]');
    
    for (var i = 0; i < switches.length; i++) {
      switches[i].addEventListener('change', function(event) {
        var featureId = event.target.id.replace('feature-', '');
        var url;
        
        if (event.target.checked) {
          url = addToURL([featureId]);
          _features[featureId].enabled = true;
        } else {
          url = removeFromURL([featureId]);
          _features[featureId].enabled = false;
        }
        
        if (History.getState().data.enabledModules === url) {
          toggleFeaturesBySearchQuery(History.getState().data.enabledModules);
        } else {
          History.pushState({
            enabledModules: url,
          }, document.title, getLocationOrigin() + '?' + url);
        }
      });
    }
  }
  
  function toggleFeaturesBySearchQuery(searchQuery) {
    var enabledFeatures = searchQuery.split('&');
    var _features = features();
    
    var featureDescriptions = enabledFeatures.map(function(featureId) {
      var featureDescription;
      var festure = _features[featureId];
      
      if (festure) {
        featureDescription = festure;
        featureDescription.id = featureId;
      }
      
      return featureDescription;
    }).filter(function(feature) {
      return feature ? true : false;
    });
    
    toggleFeatures(featureDescriptions);
  }
  
  function init() {
    var searchQuery = getLocationSearch();
    
    if (!searchQuery) {
      History.pushState({
        enabledModules: 'headers'
      }, document.title, getLocationOrigin() + '?headers');
    }
    
    addListenersFeatureSwitchers();
    toggleFeaturesBySearchQuery(getLocationSearch());
    
    History.Adapter.bind(window, 'statechange', function() {
      var enabledModules = History.getState().data.enabledModules;
      
      toggleFeaturesBySearchQuery(enabledModules ? enabledModules : '');
    });
    
    $('jsfiddle-link').addEventListener('click', function(event) {
      event.preventDefault();
      var jsFiddle = new JsfiddleExporter(codeGenerator);
      
      jsFiddle.export(true);
    });
    $('export-csv').addEventListener('click', function(event) {
      hot.getPlugin('exportFile').downloadFile('csv', {filename: 'Handsontable CSV Export example'});
    });
    $('export-string').addEventListener('click', function(event) {
      console.log(hot.getPlugin('exportFile').exportAsString('csv'));
    });
  }
  
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    init();
  } else {
    d.addEventListener('DOMContentLoaded', init);
  }
}());
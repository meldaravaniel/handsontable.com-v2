var examples;

document.addEventListener("DOMContentLoaded", function() {

  var bindTabChangingEvents = function() {
    var tabButtons = document.querySelectorAll('.code-box ul li:not(.action-link) a');
    Handsontable.helper.arrayEach(tabButtons, function(tabButton) {
      tabButton.addEventListener('click', function(event) {
        var target = event.target;
        var tab = document.getElementById(target.id.replace('-link', ''));

        target.setAttribute('aria-selected', 'true');
        tab.setAttribute('aria-hidden', 'false');

        Handsontable.helper.arrayEach(tabButtons, function(tb) {
          if (tb !== tabButton) {
            var tab = document.getElementById(tb.id.replace('-link', ''));

            tb.setAttribute('aria-selected', 'false');
            tab.setAttribute('aria-hidden', 'true');
          }
        });

      });
    });
  }();
  var jsFiddleExporter;

  examples = new Examples(hot, [
    {
      name: 'headers',
      label: 'Headers',
      description: 'Adds rows or column headings to the spreadsheet. ' +
      'You can assign a letter to each column automatically, or enter your own custom name, and even HTML elements.',
      configObject: {
        rowHeaders: true,
        colHeaders: ['ID', 'Country', 'Code', 'Currency', 'Level', 'Units', 'Date', 'Change']
      },
      enabled: true
    },
    {
      name: 'fixed',
      label: 'Fixed rows/columns',
      description: 'Keeps the top rows or left-hand side columns visible while scrolling down or across the table.',
      configObject: {
        fixedRowsTop: 2,
        fixedColumnsLeft: 3
      }
    },
    {
      name: 'sorting',
      label: 'Sorting',
      description: 'Sorts data in ascending or descending order throughout selected columns. ' +
      'You can optionally add an arrow indicating the sorting order.',
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
    {
      name: 'merge-cells',
      label: 'Merge Cells',
      description: 'Creates a larger, single cell by merging multiple cells. ' +
      'It keeps the content of the upper-left cell and removes the content of all other cells.',
      configObject: {
        mergeCells: true
      },
      dependencies: [
        'context-menu'
      ]
    },
    {
      name: 'manual-resize',
      label: 'Row/Column Resize',
      description: 'Allows manual modification of row or column sizes. ' +
      'The sizing handle appears in the right part of the column header or at the bottom of the row header.',
      configObject: {
        manualRowResize: true,
        manualColumnResize: true
      },
      dependencies: [
        'headers'
      ]
    },
    {
      name: 'manual-move',
      label: 'Row/Column Move',
      description: 'Allows manual swapping of rows or columns within the table. ' +
      'The moving handle appears in the left part of the column header or at the top of the row header.',
      configObject: {
        manualRowMove: true,
        manualColumnMove: true
      },
      dependencies: [
        'headers'
      ]
    },
    {
      name: 'conditional-formatting',
      label: 'Conditional Formatting',
      description: 'Defines how the specific cells are formatted depending on the content. ' +
      'For instance, in this demo all negative values are marked red and the positive values are green.',
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
    {
      name: 'context-menu',
      label: 'Context Menu',
      description: 'Opens a pop-up menu that provides a list of items to choose. ' +
      'Right-click anywhere inside the table to open the context menu.',
      configObject: {
        contextMenu: true
      }
    }
  ], [
    {
      name: 'filters',
      label: 'Filters',
      description: 'Allows the addition of criteria to display only specific rows while hiding others. ' +
      'Available from the dropdown menu in the header.',
      configObject: {
          filters: true
      },
      dependencies: [
          'dropdown-menu'
        ]
    },
    {
      name: 'dropdown-menu',
      label: 'Dropdown Menu',
      description: 'Allows the creation of a dropdown menu, available in the column headers.',
      configObject: {
          dropdownMenu: true
      }
    },
    {
      name: 'csv-export',
      label: 'Export to CSV',
      description: 'Adds the ability to export the data as comma-separated values. ' +
      'In the demo above, just click a button to download the flat file.',
      configObject: {}
    },
      {
      name: 'fixed-bottom',
      label: 'Fixed bottom rows',
      description: 'Keeps the bottom rows visible while scrolling down or across the table.',
      configObject: {
        fixedRowsBottom: 2
      }
    },
    {
      name: 'column-summary',
      label: 'Basic calculations',
      description: 'Displays the total numeric values for the specific range. ' +
      'It also calculates min, max, average, and count, and handles custom functions.',
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
    {
      name: 'nested-headers',
      label: 'Nested Headers',
      description: 'Allows the creation of a multi-level, nested structure of the column headers.',
      configObject: {
        nestedHeaders: [
          ['ID', {label: 'A', colspan: 2}, {label: 'B', colspan: 4}, 'C'],
          ['ID', {label: 'D', colspan: 2}, {label: 'E', colspan: 2}, {label: 'F', colspan: 2}, 'H'],
          ['ID', 'I', 'J', 'K', 'L', 'M', 'N', 'O']
        ]
      }
    },
    {
      name: 'collapsible-columns',
      label: 'Collapsible Columns',
      description: 'Enables the visual collapse and expansion of specific columns. ' +
      'It works together with the Nested Headers plugin.',
      configObject: {
        collapsibleColumns: true,
        hiddenColumns: true
      },
      dependencies: [
        'nested-headers'
      ]
    },
    {
      name: 'trim-rows',
      label: 'Trim Rows',
      description: 'Enables the skipping of specific rows while rendering the table.',
      configObject: {
        trimRows: [1, 2, 5]
      }
    }
  ]);

  examples.setHOTsettings(Handsontable.helper.clone(hotSettings));
  examples.setupCodeTab();
  examples.syncFeatures();
  examples.bindEvents();

  jsFiddleExporter = new JsfiddleExporter(examples);

  var bindMenuHeaderEvents = function() {
    var accordionHeaders = document.querySelectorAll('div[aria-expanded] h5');
    for (var i in accordionHeaders) {
      if (accordionHeaders.hasOwnProperty(i)) {
        accordionHeaders[i].addEventListener('click', function(event) {
          var section = event.target.parentNode;
          section.setAttribute('aria-expanded', section.getAttribute('aria-expanded') !== 'true');
        });
      }
    }
  }();

  var bindJsFiddleButton = function() {
    var link = document.getElementById('jsfiddle-link');
    link.addEventListener('click', function(event) {
      jsFiddleExporter.export(true);
    });
  }();

  var bindCsvExportButtons = function () {
    var toggleCsvButtons = function () {
      var buttonPanel = document.getElementById('export-buttons');
      if (window.location.href.indexOf('csv-export') > -1) {
        buttonPanel.className = ' visible';
      } else {
        buttonPanel.className = buttonPanel.className.replace(' visible', '');
      }
    };

    document.getElementById('feature_csv-export').addEventListener('change', toggleCsvButtons);
    toggleCsvButtons();

    document.getElementById('export-csv').addEventListener('click', function() {
      examples.hotInstance.getPlugin('exportFile').downloadFile('csv', {filename: 'Handsontable CSV Export example'});
    });

    document.getElementById('export-string').addEventListener('click', function() {
      console.log(examples.hotInstance.getPlugin('exportFile').exportAsString('csv'));
    });
  }();

});
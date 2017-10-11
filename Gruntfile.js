module.exports = function(grunt) {

    var dir = {
        css: 'www/static/css/',
    };

    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      
      copy: {
        main: {
          files: [
            {expand: true, cwd: 'node_modules/codemirror/lib', src: ['**'], dest: 'public/static/node_components/codemirror'},
            {expand: true, cwd: 'node_modules/codemirror/mode/javascript', src: ['**'], dest: 'public/static/node_components/codemirror/mode/javascript'},
            {expand: true, cwd: 'node_modules/codemirror/theme', src: ['**'], dest: 'public/static/node_components/codemirror/theme'},
            {expand: true, cwd: 'node_modules/classlist-polyfill/src', src: ['**'], dest: 'public/static/node_components/classlist-polyfill'},
          ],
        },
      },

      cssmin: {
        options: {
          shorthandCompacting: false,
          roundingPrecision: -1
        },
        target: {
          files: {
            'www/static/css/main.css': [dir.css + '*.css']
          }
        }
      },
      
      htmlmin: {
        dist: {
          options: {
            removeComments: true,
            collapseWhitespace: true,
          },
          files: [{
            expand: true,
            cwd: 'www',
            src: ['**/*.html', '*.html'],
            dest: 'www',
          }]
        }
      },
      
      svgmin: {
        options: {
          plugins: [
            {removeViewBox: false},
            {removeUselessStrokeAndFill: false},
            {removeEmptyAttrs: false},
          ]
        },
        dist: {
          files: {
            // brands/
            'www/static/images/brands/amazonaws.svg': 'public/static/images/brands/amazonaws.svg',
            'www/static/images/brands/fujitsu.svg': 'public/static/images/brands/fujitsu.svg',
            'www/static/images/brands/intel-logo.svg': 'public/static/images/brands/intel-logo.svg',
            'www/static/images/brands/onekingslane.svg': 'public/static/images/brands/onekingslane.svg',
            'www/static/images/brands/profitbase.svg': 'public/static/images/brands/profitbase.svg',
            'www/static/images/brands/seagate.svg': 'public/static/images/brands/seagate.svg',
            'www/static/images/brands/sony.svg': 'public/static/images/brands/sony.svg',
            'www/static/images/brands/t-mobile.svg': 'public/static/images/brands/t-mobile.svg',
            // svg/
            'www/static/images/svg/header-background-pattern-rez.svg': 'public/static/images/svg/header-background-pattern-rez.svg',
            'www/static/images/svg/header-laptop.svg': 'public/static/images/svg/header-laptop.svg',
            'www/static/images/svg/icons-index.svg': 'public/static/images/svg/icons-index.svg',
            'www/static/images/svg/icons-pricing.svg': 'public/static/images/svg/icons-pricing.svg',
            'www/static/images/svg/icons.svg': 'public/static/images/svg/icons.svg',
          }
        }
      },

      unused: {
        options: {
          reference: 'www/',
          directory: ['**/*.ejs', '**/*.html', '**/*.css'],
          remove: false // set to true to delete unused files from project 
        }
      },
      
      uncss: {
        index: {
          options: {
            ignore: [
              'header nav ul li.news #HW_badge_cont',
              'header nav ul li.news #HW_badge_cont #HW_badge',
              '.brands img',
              '.frontpage .header-laptop',
            ],
          },
          files: [{
            nonull: true,
            src: ['http://localhost:9001/index.html'],
            dest: 'www/static/css/optimized-index.css',
          }],
        },
        pricing: {
          options: {
            ignore: [
              'header nav ul li.news #HW_badge_cont',
              'header nav ul li.news #HW_badge_cont #HW_badge',
            ],
          },
          files: [{
            nonull: true,
            src: ['http://localhost:9001/pricing.html'],
            dest: 'www/static/css/optimized-pricing.css',
          }],
        },
      },

      clean: {
        src: [dir.css + '*', "!www/**/*.css"]
      },
      
      processhtml: {
        dist: {
          files: {
            'www/index.html': ['www/index.html'],
            'www/pricing.html': ['www/pricing.html'],
          }
        }
      },
      
      connect: {
        server: {
          options: {
            port: 9001,
            base: 'www',
          }
        }
      }
    });
    
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-svgmin');
    grunt.loadNpmTasks('grunt-uncss');
    grunt.loadNpmTasks('grunt-unused');

    grunt.registerTask('default', 'build');
    grunt.registerTask('build',  [
      'unused', 
      'cssmin', 
      'svgmin', 
      'connect:server', 
      'uncss', 
      'processhtml', 
      'htmlmin', 
      'clean',
    ]);
    
};
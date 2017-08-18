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

        unused: {
            options: {
                reference: 'www/',
                directory: ['**/*.ejs', '**/*.html', '**/*.css'],
                remove: false // set to true to delete unused files from project 
            }
        },

        clean: {
            src: [dir.css + '*', "!www/**/*.css"]
        },
    });
    
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-unused');

    grunt.registerTask('default', 'build');
    grunt.registerTask('build',  ['copy', 'unused', 'cssmin', 'clean']);
    
};
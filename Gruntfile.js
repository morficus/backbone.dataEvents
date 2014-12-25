/* jshint node: true, browser: false */
'use strict';

var matchDep = require('matchdep');

module.exports = function (grunt) {
    // Find all of the task which start with `grunt-` and load them, rather than explicitly declaring them all
    matchDep.filterDev(['grunt-*', '!grunt-cli']).forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // ### grunt-contrib-jasmine
        // Test cases
        jasmine: {
            src: ['src/dataEvents.js'],
            options: {
                specs: 'tests/**/*.spec.js',
                vendor: [
                    'bower_components/jquery/dist/jquery.js',
                    'bower_components/underscore/underscore.js',
                    'bower_components/backbone/backbone.js'
                ]
            }
        },

        // ### grunt-contrib-jshint
        jshint: {
            all : [
                'Gruntfile.js',
                'src/**/*.js',
                'tests/**/*.js'
            ],
            options: {
                jshintrc: true
            }
        },

        // ### grunt-contrib-copy
        // Copy files into their correct locations
        copy: {
            dist: {
                files: {
                    'dist/dataEvents.js': 'src/dataEvents.js'
                }
            }
        },

        // ### grunt-contrib-uglify
        // Minify javascript files ready for production
        uglify: {
            dist: {
                options: {
                    sourceMap: true
                },
                files: {
                    'dist/dataEvents.min.js': 'dist/dataEvents.js'
                }
            }
        },

        clean: ['dist/']
    });

    grunt.registerTask('default', ['validate', 'clean', 'copy:dist', 'uglify:dist']);
    grunt.registerTask('validate', ['jshint:all', 'jasmine']);
};

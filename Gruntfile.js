module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    jshint: {
      files: [
        ['Gruntfile.js', 'server/**/*.js', 'client/**/*.js', 'index.js']
      ],
      options: {
        jshintrc: '.jshintrc',
        ignores: [
          'client/lib/**/*.js',
          'node_modules/**/*.js'
        ]
      }
    },
    
    react: {
      files: {
        expand: true,
        cwd: 'client/views',
        src: ['*.jsx'],
        dest: 'client/dist/views',
        ext: '.js'
      }
    },
    
    // browserify: {
    //   options: {
    //     transform: [ require('grunt-react').browserify ]
    //   },
    //   app: {
    //     src: 'path/to/source/main.js',
    //     dest: 'path/to/target/output.js'
    //   }
    // }

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-react');
  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask('default', ['jshint', 'react']);


};

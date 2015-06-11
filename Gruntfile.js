module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    jshint: {
      files: [
        ['Gruntfile.js', 'server/**/*.js', 'index.js', 'client/collections/*.js', 'client/models/*.js', 'client/views/*.js']
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

    watch: {
      scripts: {
        files: ['client/**/*.js', 'client/**/*.jsx', 'client/*.js', 'server/**/*.js', 'server/*.js', 'index.js'],
        tasks: ['jshint', 'buildDev'],
        options: {
          spawn: false,
        },
      },
    },

    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: [
          'client/lib/react/react.js',
          'client/lib/react-router/build/umd/ReactRouter.js',
          'client/lib/underscore/underscore.js',
          'client/lib/jquery/dist/jquery.js',
          'client/lib/backbone/backbone.js',
          'client/models/*.js',
          'client/collections/*.js',
          'client/dist/views/Signup.js',
          'client/dist/views/Login.js',
          'client/dist/views/Query.js',
          'client/dist/views/ReviewMealPlan.js',
          'client/dist/views/ShoppingList.js',
          'client/dist/views/MealPlan.js',
          'client/dist/views/MealPlanLink.js',
          'client/dist/views/Navbar.js',
          'client/dist/views/LandingPage.js',
          'client/dist/views/CallToAction.js',
          'client/dist/views/HowItWorks.js',
          'client/dist/views/MealPLanLibrary.js',
          'client/dist/views/NavbarLinks.js',
          'client/dist/views/Recipe.js',
          'client/dist/views/App.js'
          ],
        dest: 'client/dist/<%= pkg.name %>.js'
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'client/dist/<%= pkg.name %>.js': ['<%= concat.dist.dest %>']
        }
      }
    },

    cssmin: {
      options: {
        keepSpecialComments: 0
      },
      dist: {
        files: {
          'client/dist/style.min.css': 'client/styles/main.css'
        }
      }
    },

    nodemon: {
      dev: {
        script: 'index.js'
      }
    }
    
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
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-react');
  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask('default', ['jshint', 'buildDev', 'watch']);
  grunt.registerTask('buildDev', ['react', 'concat', 'cssmin']);
  grunt.registerTask('buildProduction', ['react', 'concat', 'uglify', 'cssmin']);


};

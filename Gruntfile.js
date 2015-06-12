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
        files: ['client/**/*.js', 'client/**/*.jsx', 'client/*.js', 'server/**/*.js', 'server/*.js', 'index.js', 'client/styles/*.css'],
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
          'client/dist/views/MealPlanLibrary.js',
          'client/dist/views/NavbarLinks.js',
          'client/dist/views/Recipe.js',
          'client/dist/views/App.js'
          ],
        dest: 'client/dist/public/<%= pkg.name %>.js'
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'client/dist/public/<%= pkg.name %>.js': ['<%= concat.dist.dest %>']
        }
      }
    },

    copy: {
      css: {
        expand: true,
        cwd: 'client/lib/bootstrap/dist/fonts/',
        src: '**',
        dest: 'client/dist/fonts',
        flatten: true,
        filter: 'isFile'
      },
      images: {
        expand: true,
        cwd: 'client/images/',
        src: '**',
        dest: 'client/dist/images',
        flatten: true,
        filter: 'isFile'
      }
    },

    cssmin: {
      options: {
        keepSpecialComments: 0
      },
      dist: {
        files: {
          'client/dist/public/style.min.css': ['client/lib/bootstrap/dist/css/bootstrap.min.css', 'client/styles/main.css']
        }
      }
    },

    nodemon: {
      dev: {
        script: 'index.js'
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-react');

  grunt.registerTask('default', ['jshint', 'buildDev', 'watch']);
  grunt.registerTask('serve', ['jshint', 'buildDev', 'nodemon']);
  grunt.registerTask('buildDev', ['react', 'concat', 'copy', 'cssmin']);
  grunt.registerTask('buildProduction', ['react', 'concat', 'uglify', 'copy', 'cssmin']);
};

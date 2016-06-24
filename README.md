[![Build Status](https://travis-ci.org/MealKitchen/mealkitchen.svg?branch=master)](https://travis-ci.org/MealKitchen/mealkitchen)

# Meal Kitchen

Meal Kitchen is a personalized recipe recommendation application that helps you plan and manage your meals for the week.


## Team

  - __Product Owner__: Melanie Gin
  - __Scrum Master__: Zack Fischmann
  - __Development Team Members__: Andy Sponring, Mark Tausch, Melanie Gin, Zack Fischmann

## Table of Contents

1. [Usage](#usage)
1. [Requirements](#requirements)
1. [Development](#development)
  1. [Installing Dependencies](#installing-dependencies)
  1. [Setting Up PostgreSQL](#setting-up-postgresql)
  1. [Starting development](#starting-development)
  1. [Testing](#testing)
  1. [Deployment](#deployment)
1. [Roadmap](#roadmap)
1. [Contributing](#contributing)

## Usage

To view Meal Kitchen on production, visit [http://meal.kitchen](http://meal.kitchen).

You will have to sign up (or log in if you already have an account). Start by creating a meal plan - the link to do so is inside the landing page after login and also in the nav bar. Enter your recipe search parameters. You have the option to request a certain amount of breakfasts, lunches and dinners. Note that you can also select preferred cuisines, allergy restrictions and diet restrictions.

Once you submit your recipe query, the app will query Yummly for recipes, taking into account both your search paramaters AND your flavor preferences which the app has learned from your previous interactions. You can review the recipes that were found and reject ones you don't like - new ones will appear to replace them. Once you're satisfied, give your meal plan a name and save it. On the next page you can choose to create a shopping list which will include all the ingredients of the recipes you selected. 

Every time you reject a recipe or save a meal plan, the app gains a better understanding of your taste preferences. The more you use the app, the better the recommendations will be!

## Requirements

- Node 0.12.x
- Postgresql 9.4.x
- Grunt-cli 0.1.x
- Yummly API keys
- Heroku
- Travis-CI

## Development

### Installing Dependencies

From within the root directory:

```sh
npm install
npm install -g grunt-cli
```

npm will install almost all the dependencies you need. Additionally, it will install a local copy of Bower, which is run after `npm install`, in order to fetch client dependencies. Installing grunt-cli will allow you to accomplish required development tasks (described below).

### Setting Up PostgreSQL ###
To run the app for development, PostgreSQL must be installed with the proper role set up. Follow the directions below to set up the DB.

#### If Postgres is not Installed ####
1. Install brew (http://brew.sh/)
2. Type command `brew update`
3. Type command `brew install postgres`

#### Run Postgres ####
1. Install Postgres.app http://postgresapp.com/
2. Open Postgres.app

#### Set Up Root DB Role ####
1. Type command `psql` to open the Postgres shell
2. Type command `CREATE ROLE root WITH LOGIN;`
3. Type command `ALTER ROLE root WITH SUPERUSER;`
4. Type command `ALTER ROLE root WITH CREATEROLE;`
5. Type command `ALTER ROLE root WITH CREATEDB;`
6. Type command `ALTER ROLE root WITH REPLICATION;`

#### Create mealplan database ####
Almost done! The app requires a database named "mealplan", so run the following:

```psql
CREATE DATABASE mealplan;
```

### Starting development
To begin actual development you first need to kick off two processes.

In the root directory run:

```sh
grunt serve
```

This will start the node server using nodemon. Nodemon will monitor your server files for changes and restart the server.

Then open a new Terminal window and run the default Grunt task:

```sh
grunt
```

This task will build all the client files necessary for the app to run. Now you can visit localhost:3000.

### Testing
Currently integration tests have been implemented using Mocha and Chai. These test various API endpoints. To test, run

```sh
npm test
```

The test spec is held in /test/serverSpec.js.

### Deployment
Deployment is accomplished through Heroku with a PostgreSQL DB add-on. To be deployed to Heroku, the code must pass a Travis-CI build.

When you make a pull request to /Unconditional-Chocolate/mealplan, Travis will initiate a build and run `npm test`. If the tests pass, and if the changes are merged in, Travis will automatically deploy the new code to Heroku. The changes will be live on prdouction at [http://meal.kitchen](http://meal.kitchen).

## Roadmap

View the project roadmap [here](https://github.com/Unconditional-Chocolate/mealplan/issues).

## Contributing

See [CONTRIBUTING.md](https://github.com/Unconditional-Chocolate/mealplan/blob/master/CONTRIBUTING.md) for contribution guidelines.

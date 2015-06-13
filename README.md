[![Build Status](https://travis-ci.org/Unconditional-Chocolate/mealplan.svg?branch=master)](https://travis-ci.org/Unconditional-Chocolate/mealplan)

# Meal Kitchen

Meal Kitchen is a personalized recipe recommendation application that helps you plan and manage your meals for the week.


## Team

  - __Product Owner__: Melanie Gin
  - __Scrum Master__: Zack Fischmann
  - __Development Team Members__: Andy Sponring, Mark Tausch, Melanie Gin, Zack Fischmann

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)
  1. [Installing Dependencies](#installing-dependencies)
  1. [Setting Up Postgres](#setting-up-postgres)
  1. [Tasks](#tasks)
1. [Team](#team)
1. [Contributing](#contributing)

## Usage

To view Meal Kitchen on production, visit [http://meal.kitchen](http://meal.kitchen).

You will have to sign up (or log in if you already have an account). Start by creating a meal plan - the link is inside the landing page after login and also in the nav bar. Enter your recipe search parameters. You have the option to request a certain amount of breakfasts, lunches and dinners. Note that you can also select preferred cuisines, allergy restrictions and diet restrictions.

Once you submit your recipe query, the app will query Yummly for recipes, taking into account both your search paramaters AND your flavor preferences which the app has learned from your previous interactions. You can review the recipes that were found and reject ones you don't like - new ones will appear to replace them. When you're satisfied, give your meal plan a name and save it. On the next page you can choose to create a shopping list which will include all the ingredients of the recipes you selected. 

Every time you reject a recipe or save a meal plan, the app gets a better idea of your taste preferences. The more you use our app, the better the recommendations will be!

## Requirements

- Node 0.12.x
- Postgresql 9.4.x

## Development

### Installing Dependencies

From within the root directory:

```sh
sudo npm install -g bower
npm install
bower install
```

### Setting Up Postgres ###
To run the app, Postgres must be installed with proper role set up. Follow the directions below to set up the DB.

#### If Postgres is not Installed ####
1. Install brew (http://brew.sh/)
2. Then type command `brew update`.
3. Then type command `brew install postgres`.

#### Run Postgres ####
1. Install Postgres.app http://postgresapp.com/
2. Open Postgres.app.

#### Set Up Root DB Role ####
1. Type command `psql`.
2. Will be in Postgres shell. Prompt should be `=#` (instead of $).
3. Then type command `CREATE ROLE root WITH LOGIN;`
4. Then type command `ALTER ROLE root WITH SUPERUSER;`
5. Then type command `ALTER ROLE root WITH CREATEROLE;`
6. Then type command `ALTER ROLE root WITH CREATEDB;`
7. Then type command `ALTER ROLE root WITH REPLICATION;`

### Roadmap

View the project roadmap [here](https://github.com/Unconditional-Chocolate/mealplan/issues).

## Contributing

See [CONTRIBUTING.md](https://github.com/Unconditional-Chocolate/mealplan/blob/master/CONTRIBUTING.md) for contribution guidelines.

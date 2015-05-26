# MealPlan

Mealplan helps you cook better food.


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

> Some usage instructions

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

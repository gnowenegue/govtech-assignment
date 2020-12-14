# GovTech Coding Assignment
This is a back-end API project/application built with express.js.\
The database engine used here is MySQL.

## Setup Locally

### Prerequisites

 - Node.js
 - MySQL
 - Yarn (optional)

### Steps

  1) After cloning the project locally, run `npm i` or `yarn` to install all the dependencies.
  2) Upon starting up MySQL service, import one of the dump files provided found in the `dumps` folder.
     - There are 2 versions here. One with the creating schema command included, and the other without.
     - `dump_with_schema.sql` will create a database named `govtech_assignment` for you.
  3) Create a user in MySQL and give it permissions to access the database.
  4) Rename the `.env.sample` file to `.env` and fill in the details of the database connection.
  5) Run `npm run dev` or `yarn dev` to start up a local server and run the application.

## Tests

Run `npm t` or `yarn test` to trigger the unit tests.

Run `npm run coverage` or `yarn coverage` to run the unit tests and get the test coverage result.

## Demo

  The application is deployed on [heroku](https://govtech-assignment.herokuapp.com/).
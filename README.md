# Artjoker_test_task
Node.js test task

It is necessary to develop a primitive API on NodeJS + Express + Mongo / Postgre / MySQL (base to choose from).

There should be several endpoints:

1. Download the CSV file. The file must be parsed and stored in the database
2. Get a collection of users in json format
3. Download the CSV file. It is necessary to serialize a collection of users from the database to a CSV file and send it.

CSV file structure:
The first line is UserName, FirstName, LastName, Age
The remaining lines (example) - TheBlade, Boris, Yurinov, 47
... and so on

+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

There was implemented three following endpoints:

POST /api/items downloads csv file and parse it to json and save to MongoDB;

GET /api/items retrieve all data in json from MongoDB;

GET /api/export retrieve all data in csv file from MongoDB;

+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

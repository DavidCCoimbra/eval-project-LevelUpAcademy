# LevelUp Tech Challenge

## Requirements
- [Node.js](https://nodejs.org/en/)
- [npm](https://www.npmjs.com/)
- [Makefile](https://www.gnu.org/software/make/) (if you wanna use it)

## Installation
To run this app locally, you'll need to have Node.js installed on your machine. Once you have Node.js installed, follow these steps:

1. With Makefile
   1. Clone this repository to your local machine using git clone https://github.com/DavidCCoimbra/eval-project-LevelUpAcademy.
   2. Navigate to the root directory of the app.
   3. Install dependencies using make install.

2. Without Makefile
   1. Clone this repository to your local machine using git clone https://github.com/DavidCCoimbra/eval-project-LevelUpAcademy.
   2. Navigate to the root directory of the app.
   3. Navigate to the api directory
   4. Install dependencies using npm install.
   5. Navigate to the credit-card-validator-visual directory
   6. Install dependencies using npm install.


## Usage with Makefile
```bash
#Navigate to the root folder of the app
#To start the backend, open a terminal window and run the following command:
$ make start-api
#This will start the server at http://localhost:3000. You can now open this URL in your browser to see the app in action.
#To start the frontend, run the following command:
$ make start-client
#This will start the frontend at http://localhost:3000 (make sure you're not using the port :3000).
```
## Usage without Makefile
```bash
#Navigate to the api folder and in one terminal window run the following command to start the backend:
$ npm run dev
#This will start the backend at http://localhost:9000, you can let it run on the background, no need to open the link (make sure you're not using the port :9000).

#Navigate to the credit-card-validator-visual folder and in one terminal window run the following command to start the frontend:
$ npm run start
#This will start the frontend at http://localhost:3000 (make sure you're not using the port :3000).

```
## How to use Jest Tests
```bash
#Navigate to the root folder of the app
#Open a terminal window and run the following command:
$ make start-test
```
## Technologies

Technologies to develop this API

- [Node.js](https://nodejs.org/en/)
- [Express](https://expressjs.com/)
- [Jest](https://jestjs.io/)
- [nodemon](https://nodemon.io/)
- [React](https://react.dev/)
- [VS Code](https://code.visualstudio.com/)

# Express Application Generator
# React App
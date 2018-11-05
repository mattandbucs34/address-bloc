const inquirer = require('inquirer');

module.exports = class MenuController {
  constructor() {
    this.mainMenuQuestions = [
      {
        type: "list",
        name: "mainMenuChoice",
        message: "Please choose from an option below: ",
        choices: [
          "Add new contact",
          "Get Date",
          "Exit"
        ]
      }
    ];

    this.contacts = [];
  }

  main() {
    console.log('Welcome to AddressBloc!\n');
    inquirer.prompt(this.mainMenuQuestions).then((response) => {
      switch(response.mainMenuChoice) {
        case "Add new contact":
          this.addContact();
          break;
        case "Get Date":
          this.getDate();
          break;
        case "Exit":
          this.exit();
        default:
          console.log("Invalid Input!");
          this.main();
      }
    })
    .catch((err) => {
      console.log(err);
    });
  }

  clear() {
    console.log('\x1Bc');
  }

  addContact() {
    this.clear();
    console.log('addContact called');
    this.main();
  }

  getDate() {
    this.clear();
    var date = new Date();
    date = date.getMonth() + '/' + date.getDate() + '/' + date.getFullYear();
    console.log(date);
    this.main();
  }

  getContactCount() {
    return this.contacts.length;
  }

  remindMe() {
    return "Learning is a life-long pursuit!";
  }

  exit() {
    console.log("Thank you for using AddressBloc!");
    process.exit();
  }
}
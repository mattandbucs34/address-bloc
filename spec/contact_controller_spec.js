const ContactController = require('../controllers/ContactController');
const sequelize = require('../db/models/index').sequelize;

//Passes arguments to test ContactController operation
describe("ContactController", () => {

  beforeEach((done) => {
    this.book = new ContactController();

    //#1
    sequelize.sync({force: true}).then((res) => {
      done();
    })
    .catch((err) => {
      done();
    });
  });

  //#2
   describe("#addContact()", () => {
    it("should add a single contact into the book", (done) => {
      this.book.addContact("Alex Worthington", "555-999-4567", "nunya@myob.com")
      .then((contact) => {

        expect(contact.name).toBe("Alex Worthington");
        expect(contact.phone).toBe("555-999-4567");
        expect(contact.email).toBe("nunya@myob.com");
        done();
      })
      .catch((err) => {
        done();
      });
    });
  });

  it("should be defined", () => {
    expect(ContactController).toBeDefined();
  });
});
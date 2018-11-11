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

  //#3
  describe("#getContacts()", () => {
    it("should return an empty array when no contacts are present", (done) => {
      this.book.getContacts()
      .then((contacts) => {
        expect(contacts.length).toBe(0);
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });

    //#4
    it("should return an array of contacts when contacts are present", (done) => {
      this.book.addContact("Wilson Castaway", "555-999-2000", "wildvolleyball@stranded.net")
      .then(() => {
        this.book.getContacts()
        .then((contacts) => {
          expect(contacts.length).toBe(1);
          done();
        });
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });
  });

  //#5 Iterative Search
  describe("search methods", () => {

    const zelda = ["Zelda Smith", "555-221-1986", "linkisnotzelda@nintendo.com"];
    const snake = ["Solid Snake", "100-101-0101", "snake@konami.com"];
    const magus = ["Magus Johnson", "101-100-1010", "magus@squaresoft.net"];
    const alloy = ["Alloy Rodriguez", "111-101-1100", "alloy@guerrilla-games.net"];

    describe("#iterativeSearch()", () => {
      it("should return null when called with an empty array", () => {
        expect(this.book.iterativeSearch([], "Alloy")).toBeNull();
      });

      it("should return null when contact is not found", (done) => {
        this.book.addContact(...zelda)
        .then(() => {
          this.book.getContacts()
          .then((contacts) => {
            expect(this.book.iterativeSearch(contacts, "Alloy Rodriguez")).toBeNull();
            done();
          }).catch((err) => {
            console.log(err);
            done();
          });
        });
      });

      it("should return the contact if found", (done) => {
        this.book.addContact(...alloy)
        .then(() => {
          this.book.addContact(...magus)
          .then(() => {
            this.book.getContacts()
            .then((contacts) => {
              let contact = this.book.iterativeSearch(contacts, "Magus Johnson");
              expect(contact.name).toBe("Magus Johnson");
              expect(contact.phone).toBe("101-100-1010");
              expect(contact.email).toBe("magus@squaresoft.net");
              done();
            }).catch((err) => {
              console.log(err);
              done();
            });
          });
        });
      });
    });

    describe("#binarySearch()", () => {
      function sort(contacts) {
        return contacts.sort((a, b) => {
          if(a.name > b.name)
            return 1;
          else if(a.name < b.name)
            return -1;
          else
            return 0;
        });
      }

      it("should return null when contact is not found", (done) => {
        this.book.addContact(...zelda)
        .then(() => {
          this.book.getContacts()
          .then((contacts) => {
            expect(this.book.binarySearch(sort(contacts), "Alloy Rodriguez")).toBeNull();
            done();
          }).catch((err) => {
            console.log(err);
            done();
          });
        })
      });

      it("should return the contact if found", (done) => {
        this.book.addContact(...alloy).then(() => {
          this.book.addContact(...magus).then(() => {
            this.book.addContact(...zelda).then(() => {
              this.book.addContact(...snake).then(() => {
                let contact = this.book.binarySearch(sort(contacts), "Magus Johnson");
                expect(contact.name).toBe("Magus Johnson");
                expect(contact.phone).toBe("101-100-1010");
                expect(contact.email).toBe("magus@squaresoft.net");
                done();
              }).catch((err) => {
                console.log(err);
                done();
              });
            });
          });
        });
      });

      describe("#search()", () => {
        it("should return null when a contact was not found", (done) => {
          this.book.addContact(...zelda)
          .then(() => {
            this.book.search("Solid Snake")
            .then((contact) => {
              expect(contact).toBeNull();
              done();
            }).catch((err) => {
              console.log(err);
              done();
            });
          });
        });

        it("should return the contact when found", (done) => {
          this.book.addContact(...snake)
          .then(() => {
            this.book.search("Solid Snake")
            .then((contact) => {
              expect(contact).not.toBeNull();
              expect(contact.name).toBe("Solid Snake");
              expect(contact.phone).toBe("100-101-0101");
              expect(contact.email).toBe("snake@konami.com");
              done();
            }).catch((err) => {
              console.log(err);
              done();
            });
          });
        });
      });
    });
  });

  describe("#delete()", () => {

    it("should not remove any contacts that do not match the ID passed", (done) => {
      this.book.addContact("Rick Deckard", "999-555-1212", "null@notnull.com")
      .then(() => {
        this.book.getContacts()
        .then((contacts) => {
          expect(contacts[0].name).toBe("Rick Deckard");
          expect(contacts.length).toBe(1);
          this.book.delete(99)
          .then(() => {
            this.book.getContacts()
            .then((contacts) => {
              expect(contacts.length).toBe(1);
              done();
            }).catch((err) => {
              console.log(err);
              done();
            });
          });
        });
      });
    });

    it("should remove the contact that matches the ID passed", (done) => {
      this.book.addContact("Rick Deckard", "999-555-1212", "null@notnull.com").then((contact) => {
        this.book.getContacts()
        .then((contacts) => {
          expect(contacts[0].name).toBe("Rick Deckard");
          expect(contacts.length).toBe(1);
          this.book.delete(contact.id)
          .then(() => {
            this.book.getContacts()
            .then((contacts) => {
              expect(contacts.length).toBe(0);
              done();
            }).catch((err) => {
              console.log(err);
              done();
            });
          });
        });
      });
    });
  });

  it("should be defined", () => {
    expect(ContactController).toBeDefined();
  });
});
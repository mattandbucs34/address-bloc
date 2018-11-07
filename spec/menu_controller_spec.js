const MenuController = require("../controllers/MenuControllers");

// #1 - call "describe" method and passing "MenuController" as test suite.
describe("MenuController", () => {

  beforeEach(() => {
    this.menu = new MenuController();
  });

/*   describe("#getContactCount()", () => {

// #2 - pass function that implements specs. "getContactCount" should return '0'.
    it("should return 0 when no contacts are in the book.", () => {
      expect(this.menu.getContactCount()).toBe(0);
    });
    it("should return 1 when there is exactly one contact in the book.", () => {
      this.menu.book.addContact("Juan Rodrigo","555-555-1234");
      expect(this.menu.getContactCount()).toBe(1);
    });
  }); */

  describe("#remindMe()", () => {
    // #3 - pass function that tests "remindMe" and should return string "Learning is a life-long pursuit!"
    it("should return string 'Learning is a life-long pursuit!'", () => {
      expect(this.menu.remindMe()).toBe("Learning is a life-long pursuit!");
    });
  });
});
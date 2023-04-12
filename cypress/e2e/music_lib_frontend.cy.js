function makeid(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

describe("Music Library Frontend tests", () => {
  context("my resolution", () => {
    beforeEach(() => {
      cy.viewport(1920, 1080);
    });

    let id = makeid(10);

    it("submit new song", () => {
      cy.visit("http://localhost:3000");
      cy.wait(500);
      cy.get("[data-test='newTitle']").type(`${id} Song`);
      cy.get("[data-test='newArtist']").type(`${id} Artist`);
      cy.get("[data-test='newAlbum']").type(`${id} Album`);
      cy.get("[data-test='newReleaseDate']").type("1980-01-01");
      cy.get("[data-test='newGenre']").type(`${id} Genre`);
      cy.get("[data-test='newRunTime']").type("4:00");
      cy.get("[data-test='submitNew']").click();
    });

    it("creates and displays the added new song", () => {
      cy.visit("http://localhost:3000");
      cy.wait(500);
      cy.contains(`${id} Song`)
        .parent("tr")
        .within(() => {
          cy.contains(`${id} Artist`);
          cy.contains(`${id} Album`);
          cy.contains("1980");
          cy.contains(`${id} Genre`);
          cy.contains("4:00");
        });
    });

    it("deletes the record just added", () => {
      cy.visit("http://localhost:3000");
      cy.wait(500);
      cy.contains(`${id} Song`)
        .parent("tr")
        .within(() => {
          cy.get("[data-test='icon_TD']").click();
        });
      cy.wait(50);
      cy.get("[data-test='delete_button']").click();
    });
  });
});

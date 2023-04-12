describe("Music Library Frontend tests", () => {
  it("submit new song", () => {
    cy.visit("http://localhost:3000");
    cy.get("#newTitle").type("Cypress Test Song");
    cy.get("#newArtist").type("Cypress Test Artist");
    cy.get("#newAlbum").type("Cypress Test Album");
    cy.get("#newReleaseDate").type("1980-1-1");
    cy.get("#newGenre").type("Cypress Test Genre");
    cy.get("#newRunTime").type("4:00");
    cy.get("#submitNew").click();
  });
});

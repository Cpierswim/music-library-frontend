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

    let new_song_id = makeid(10);

    const addSong = () => {
      cy.visit("http://localhost:3000");
      cy.wait(500);
      cy.get("[data-test='newTitle']").type(`${new_song_id} Song`);
      cy.get("[data-test='newArtist']").type(`${new_song_id} Artist`);
      cy.get("[data-test='newAlbum']").type(`${new_song_id} Album`);
      cy.get("[data-test='newReleaseDate']").type("1980-01-01");
      cy.get("[data-test='newGenre']").type(`${new_song_id} Genre`);
      cy.get("[data-test='newRunTime']").type("4:00");
      cy.get("[data-test='submitNew']").click();
    };

    const deleteSong = () => {
      cy.visit("http://localhost:3000");
      cy.wait(500);
      cy.contains(`${new_song_id} Song`)
        .parent("tr")
        .within(() => {
          cy.get("[data-test='icon_TD']").click();
        });
      cy.wait(50);
      cy.get("[data-test='delete_button']").click();
      cy.wait(50);
    };

    const searchForSong = (id, updated_song = false) => {
      cy.visit("http://localhost:3000");
      cy.wait(500);
      updated_song
        ? cy
            .get("[data-test='searchBar']")
            .clear()
            .type(`+artist:"${id} Updated Artist"`)
        : cy
            .get("[data-test='searchBar']")
            .clear()
            .type(`+artist:"${id} Artist"`);
      cy.wait(50);
      cy.get("[data-test='search_button']").click();
      cy.wait(50);
    };

    it("submit new song", () => {
      addSong();
    });

    it("creates and displays the added new song", () => {
      addSong();
      searchForSong(new_song_id);
      cy.contains(`${new_song_id} Song`)
        .parent("tr")
        .within(() => {
          cy.contains(`${new_song_id} Artist`);
          cy.contains(`${new_song_id} Album`);
          cy.contains("1980");
          cy.contains(`${new_song_id} Genre`);
          cy.contains("4:00");
        });
    });

    it("deletes the record just added", () => {
      addSong();
      deleteSong();
    });

    it("updates a song", () => {
      addSong();
      searchForSong(new_song_id);
      cy.contains(`${new_song_id} Song`)
        .parent("tr")
        .within(() => {
          cy.get("[data-test='icon_TD']").click();
        });
      cy.wait(50);
      let updateid = makeid(12);
      cy.get("[data-test='update_title_input']")
        .clear()
        .type(`${updateid} Updated Song`);
      cy.get("[data-test='update_artist_input']")
        .clear()
        .type(`${updateid} Updated Artist`);
      cy.get("[data-test='update_album_input']")
        .clear()
        .type(`${updateid} Updated Album`);
      cy.get("[data-test='update_releaseDate_input']")
        .clear()
        .type("1982-06-22");
      cy.get("[data-test='update_genre_input']")
        .clear()
        .type(`${updateid} Updated Genre`);
      cy.get("[data-test='update_runTime_input']").clear().type("4:30");
      cy.wait(50);
      cy.get("[data-test='update_button']").click();
      cy.wait(500);
      cy.visit("http://localhost:3000");
      cy.wait(500);
      searchForSong(updateid, true);
      cy.contains(`${updateid} Updated Song`)
        .parent("tr")
        .within(() => {
          cy.contains(`${updateid} Updated Artist`);
          cy.contains(`${updateid} Updated Album`);
          cy.contains("1982");
          cy.contains(`${updateid} Updated Genre`);
          cy.contains("4:30");
        });
    });
  });
});

- additional features not in user stories:

  - Search
    - can put a + before something to force it to be in the result
    - can put title: artist: album: genre: before something to search just by that
    - can wrap something in quotes to ignore spaces
  - playlist length is determined on the front end
  - artist: and genre: will both have a lot of duplicates, so options are provided via dropdowns

---

- known issues

  - ~~can only put in each special word once, so "genre:pop genre:indie" to include both of those does not work. Would be a quick fix, but I ran out of time~~ (This was such an easy fix, I went ahead and fixed it after submitting)
  - the dropdowns don't look exactly like I'd like
  - ~~when editing, the runtime has to be set to seconds instead of min:second like I would like because of issues with setting the value to a statful variable~~ (Not pretty, but this is fixed)
  - I know I should have made more components in my huge table component, but it wasn't supposed to be that big, I just kept adding things and didn't refactor them to try and make the deadline. 

---

NOTE - In order to do some of these newer features, I had to update the Music Library API. If you are going to clone this project, you are also going to [need to follow this link](https://github.com/Cpierswim/music_library) and clone that project too.

Also - in that repository, use "chris-pierson-songs-database.sql" to create the database I was using.

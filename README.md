- additional features:

  - Search
    - can put a + before something to force it to be in the result
    - can put title: artist: album: genre: before something to search just by that
    - can wrap something in quotes to ignore spaces
  - playlist length is determined on the front end
  - artist: and genre: will both have a lot of duplicates, so options are provided via dropdowns

- known issues
- can only put in each special word once, so "genre:pop genre:indie" to include both of those does not work. Would be a quick fix, but I ran out of time
- the dropdowns don't look exactly like I'd like
- when editing, the runtime has to be set to seconds instead of min:second like I would like because of issues with setting the value to a statful variable

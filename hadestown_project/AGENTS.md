# Hadestown Project

A setlist for a live concert based on the musical *Hadestown*. Each song has its own page with
chords over the lyrics, the BPM, the song length and a Spotify embed of the song from the
Original Broadway Cast Recording. Spotify embeds play a preview even without a Spotify subscription.

The pages are meant to be read while performing: they auto-scroll in sync with the song length
and have a built-in metronome.

## Files

- `index.html`: the setlist page. It lists the songs grouped in sections, with the length of every song, every section and the total.
- `hadestown_<song_name>.html`: one page per song.
- `src/main.js`: auto-scroll player (play/stop, go to start, ±10 s skip) and metronome.
  Loaded only by the song pages.
- `src/theme.js`: light/dark mode toggle, saved in `localStorage` under `hadestownTheme`.
  Loaded in the `<head>` of every page (setlist and songs).
- `styles/styles.css`: styles for this project only. Shared site styles live in `../shared/styles/`.

## Setlist

| #  | Section           | Song                              | File                                                | Length | BPM |
|----|-------------------|-----------------------------------|-----------------------------------------------------|--------|-----|
| 1  | Intro             | Road to Hell                      | `hadestown_road_to_hell.html`                       | 5:17   | 95  |
| 2  | Upbeat Core       | Livin' it Up on Top               | `hadestown_livin_it_up_on_top.html`                 | 5:29   | 98  |
| 3  | Upbeat Core       | Any Way the Wind Blows            | `hadestown_any_way_the_wind_blows.html`             | 3:45   | 105 |
| 4  | Upbeat Core       | Come Home With Me & Wedding Song  | `hadestown_come_home_with_me_and_wedding_song.html` | 5:20   | 95  |
| 5  | Shift to Darkness | All I've Ever Known               | `hadestown_all_ive_ever_known.html`                 | 4:03   | 120 |
| 6  | Shift to Darkness | Way Down Hadestown                | `hadestown_way_down_hadestown.html`                 | 5:00   | 185 |
| 7  | Shift to Darkness | Our Lady of the Underground       | `hadestown_our_lady_of_the_underground.html`        | 5:24   | 135 |
| 8  | Sadness           | Flowers                           | `hadestown_flowers.html`                            | 3:31   | 85  |
| 9  | Sadness           | If It's True                      | `hadestown_if_its_true.html`                        | 4:13   | 115 |
| 10 | Climax            | Epic II                           | `hadestown_epic_ii.html`                            | 2:26   | 85  |
| 11 | Climax            | Wait for Me (Reprise)             | `hadestown_wait_for_me_reprise.html`                | 3:12   | 92  |

Section lengths: Intro 5:17, Upbeat Core 14:34, Shift to Darkness 14:27, Sadness 7:44,
Climax 5:38. Total: 47:40.

"Come Home With Me & Wedding Song" is a medley of two tracks, so its page has two Spotify embeds.

## Song page structure

Use an existing song page (e.g. `hadestown_epic_ii.html`) as the template. The important parts:

- `<body ... data-song-duration="146">`: song length in **seconds**. `main.js` uses it to set the
  auto-scroll speed so the whole page scrolls by in the length of the song.
- `.spotifyEmbeds` with one `<iframe class="spotifyEmbed">` per track
  (`https://open.spotify.com/embed/track/<track id>?utm_source=generator&amp;theme=0`).
- `<p class="songLength">Length: m:ss</p>`.
- `<p class="songBpm">BPM: 85</p>`: `main.js` parses this number and adds the metronome button.
  If the BPM is unknown, write `BPM: X` and no button is shown.
- `<p class="songLyrics">`: rendered with `white-space: pre` in a monospace font, so **spaces
  matter**: each chord line is aligned with spaces above the lyric syllable where the chord changes.
  Sections are marked like `[Verse 1]`, `[Chorus]`...
- The fixed `.playerControls` buttons at the bottom (copy them as they are).
- The back icon links to `index.html`.

### Chords

Each chord is a `<b>` with a class for its **root note**, which sets its color:

```html
<b class="chordBb">Bbm</b>   <b class="chordDb">Db/C</b>   <b class="chordC">C7</b>
```

- The class only depends on the root: `Dm`, `D7` and `D/F#` all use `chordD`. For slash chords
  the class is the chord's root, not the bass note (`Db/Gb` → `chordDb`).
- Only 12 classes exist and they use flats: `chordA`, `chordBb`, `chordB`, `chordC`, `chordDb`,
  `chordD`, `chordEb`, `chordE`, `chordF`, `chordGb`, `chordG`, `chordAb`. A sharp root uses its
  flat equivalent (`F#` → `chordGb`, `C#` → `chordDb`...).
- Colors are defined in `styles/styles.css` for both dark and light mode.

## Keeping lengths in sync

Lengths come from Spotify and are written by hand in several places. When a song's length changes,
or a song is added, removed or moved, update all of them:

1. `data-song-duration` (seconds) on the song page's `<body>`.
2. `Length: m:ss` on the song page.
3. The `songButtonLength` of the song in `index.html`.
4. The `songSectionLength` of its section in `index.html`.
5. The `Total: m:ss` at the bottom of `index.html`.
6. The setlist table in this file.

## Adding a song

1. Copy an existing song page to `hadestown_<song_name>.html` and fill in the title (both `<title>`
   and `<h1>`), Spotify track id, length, BPM and chords/lyrics.
2. Add an `<a class="songButton">` to the right section in `index.html`.
3. Update the section and total lengths (see above) and the setlist table in this file.
4. Renumber the songs (see below).

## Song numbers

Every song in `index.html` starts with its position in the setlist (`1. Road to Hell`), counting
across sections. When a song is added, removed or moved, renumber all the songs in `index.html` and
in the setlist table in this file.

## Other details

- Sections in the setlist are `<h2 class="songSection sectionXxx">`, each with its own color
  (`sectionIntro`, `sectionUpbeat`, `sectionDarkness`, `sectionSadness`, `sectionClimax`).
- `.wipWarning` (a box on a song page) and `.wipBadge` (a tag next to a song in the setlist) mark
  songs whose chords are still being reviewed. No song uses them right now.
- Any new UI must work in both dark mode (default) and light mode (`.lightMode` on `<html>`).
- Plain HTML/CSS/JS, no build step, served by GitHub Pages. Code uses `var` and plain functions.

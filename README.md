# Fupori website

- App website: https://anastasiiakhmelevskaia.github.io/fupori/
- Privacy policy: https://anastasiiakhmelevskaia.github.io/fupori/privacy/

GitHub Pages publishes static HTML from the `main` branch root. No build tools
or dependencies are required. To preview, open `index.html` in a browser.

## Files

- `index.html`: the app page. Its styles are in `assets/home.css` and its
  interactions (companion playground, mood picker, scroll reveals) in
  `assets/site.js`.
- `privacy/index.html`: the privacy policy.
- `assets/site.css`: shared by both pages. It holds the Fupori design system's
  tokens (the asset-catalog color names, `AppSpacing`, `AppRadius`) and its
  components (`fp-raised`, `fp-outlined`, chips, buttons, progress bar), plus
  the header and footer. A raised surface is something you can press; an
  outlined surface is something you read.
- `assets/meadow.svg`: the hero scene, taken from the App Store header art.
- `assets/companions/`: companion art as SVG, named `<species><Level><Mood>.svg`.
- `assets/screens/`: phone screens cropped from the App Store screenshots.

## App Store link

The "Download" buttons on both pages point at the App Store listing
(search for `apps.apple.com`). The social links are in the "Follow along" row
at the end of `index.html`, and the roadmap is the `#roadmap` section; update
its `is-done`, `is-next` and `is-later` classes as milestones ship.

The former `fupori-privacy` repository redirects its public URLs to this site,
so links already used in the app continue to work.

Use the privacy URL above for future app releases and App Store Connect updates.

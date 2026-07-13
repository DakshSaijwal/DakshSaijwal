# Profile card

`profile_card.svg` (top of the README) is a plain, hand-generated SVG — no
GIF, no GitHub Action, no runtime dependency. It boots a terminal (progress
bar), then reveals an ASCII-art cat and my stats using native SVG
`<animate>` tags (`opacity` fades with staggered `begin` times, `fill="freeze"`
to hold the final state). Because it's vector + browser-interpolated rather
than a baked frame sequence, it plays back perfectly smoothly at any refresh
rate, unlike a low-fps GIF.

## Regenerate

```bash
node assets/build_profile_card.mjs profile_card.svg
```

Edit the `ART_RAW` cat art, `STAT_ROWS` / `CONTACT_ROWS`, colours, or timing
constants (`CAT_STEP`, `ROW_STEP`, `BOOT_DUR`, ...) at the top of the script,
re-run, then commit the new `profile_card.svg`.

No Python/FFmpeg/gifos needed anymore — this replaced that pipeline.

# Background Bhajan (Howler.js)

Add background devotional music to the website using **Howler.js**, with a smooth fade-in effect when the visitor interacts with the page.

## Audio File

Use an authorized copy of **Vepa Chettuku Uyyala** by **Gangaputra Narsing Rao**.

Save the audio file with the following name:

```text
vepa-chettuku-uyyala.mp3
```

Place it in your project's public folder:

```text
public/
└── vepa-chettuku-uyyala.mp3
```

### Music Sources

- [Shazam – Vepa Chettuku Uyyala](https://www.shazam.com/song/1556697241/vepa-chettuku-uyyala)
- [Apple Music – Vepa Chettuku Uyyala](https://music.apple.com/us/song/vepa-chettuku-uyyala/1556697241)

## Playback Behavior

- Use **Howler.js** to manage background audio playback.
- Start playback when the visitor taps or clicks anywhere on the page for the first time.
- Apply a smooth fade-in when playback begins.
- Avoid automatically restarting the music on component re-renders.
- Ensure the audio does not start multiple times.

## Setup Instructions

1. Obtain the audio file from an authorized source.
2. Rename it to `vepa-chettuku-uyyala.mp3`.
3. Place it inside the `public/` directory.
4. Restart the development server.
5. Open the website and tap or click anywhere on the page once.
6. The background bhajan should begin playing with a smooth fade-in.

## Restart Development Server

Stop the running development server and start it again:

```bash
npm run dev
```

**Note:** Browser autoplay policies require a user interaction before audio playback can begin. The first click or tap is used to initiate playback.
// Bold, filled glyphs for the particle field to trace. Only the alpha matters:
// the field samples opaque pixels, so shapes are solid with cut-outs (even-odd).

const svg = (body: string) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="400" height="400">${body}</svg>`,
  )}`;

export const icons = {
  // Padlock with a keyhole.
  lock: svg(
    `<path d="M62 88V64a38 38 0 0 1 76 0v24" fill="none" stroke="#000" stroke-width="18" stroke-linecap="round"/>` +
      `<path fill-rule="evenodd" d="M44 86h112a12 12 0 0 1 12 12v74a12 12 0 0 1-12 12H44a12 12 0 0 1-12-12V98a12 12 0 0 1 12-12zM100 114a14 14 0 0 0-8 25.5V158h16v-18.5A14 14 0 0 0 100 114z"/>`,
  ),
  // Two speech bubbles: the agent, then a person.
  chat: svg(
    `<path fill-rule="evenodd" d="M24 30h104a14 14 0 0 1 14 14v52a14 14 0 0 1-14 14H66l-26 22v-22H24a14 14 0 0 1-14-14V44a14 14 0 0 1 14-14zM48 62a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm28 0a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm28 0a9 9 0 1 0 0 18 9 9 0 0 0 0-18z"/>` +
      `<path d="M158 84h18a14 14 0 0 1 14 14v46a14 14 0 0 1-14 14h-10v20l-24-20H96a14 14 0 0 1-14-14v-18h46a30 30 0 0 0 30-30z"/>`,
  ),
  // Jet, top view.
  plane: svg(
    `<path d="M100 8c9 0 14 12 14 26v46l76 42v20l-76-22v42l22 16v16l-36-10-36 10v-16l22-16v-42l-76 22v-20l76-42V34c0-14 5-26 14-26z"/>`,
  ),
  // Circular arrows around a check: detect, fix, verify.
  heal: svg(
    `<path d="M162 82a64 64 0 0 0-114-24" fill="none" stroke="#000" stroke-width="18" stroke-linecap="round"/>` +
      `<path d="M38 118a64 64 0 0 0 114 24" fill="none" stroke="#000" stroke-width="18" stroke-linecap="round"/>` +
      `<path d="M28 36l8 46 42-20z"/><path d="M172 164l-8-46-42 20z"/>` +
      `<path d="M72 102l20 20 38-40" fill="none" stroke="#000" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/>`,
  ),
  // Heart inside an orbit: a suite built for NGOs.
  heart: svg(
    `<path d="M100 172C46 132 22 104 22 72c0-24 18-42 42-42 15 0 28 8 36 20 8-12 21-20 36-20 24 0 42 18 42 42 0 32-24 60-78 100z"/>`,
  ),
} as const;

export type IconName = keyof typeof icons;

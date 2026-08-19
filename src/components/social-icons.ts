import {
  siFacebook,
  siGithub,
  siInstagram,
  siKeybase,
  siMastodon,
  siSpotify,
  siX,
} from "simple-icons";

export interface SocialIcon {
  /** SVG path data. */
  path: string;
  /** Intrinsic viewBox of the path. */
  width: number;
  height: number;
}

const fromSimpleIcons = (icon: { path: string }): SocialIcon => ({
  path: icon.path,
  width: 24,
  height: 24,
});

/**
 * simple-icons dropped LinkedIn at the brand owner's request, so its glyph is
 * inlined here from Font Awesome Free 6 (`linkedin-in`), which is licensed
 * CC BY 4.0 — https://fontawesome.com/license/free
 */
const linkedin: SocialIcon = {
  path: "M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3M447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2c-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3c94 0 111.28 61.9 111.28 142.3V448z",
  width: 448,
  height: 512,
};

export const socialIcons = {
  facebook: fromSimpleIcons(siFacebook),
  github: fromSimpleIcons(siGithub),
  instagram: fromSimpleIcons(siInstagram),
  keybase: fromSimpleIcons(siKeybase),
  linkedin,
  mastodon: fromSimpleIcons(siMastodon),
  spotify: fromSimpleIcons(siSpotify),
  x: fromSimpleIcons(siX),
} satisfies Record<string, SocialIcon>;

export type SocialIconName = keyof typeof socialIcons;

/**
 * Fits a glyph of any intrinsic size into a centred 14×14 box on the shared
 * 24×24 canvas, so icons from different sets sit consistently in the circle.
 */
export function fitGlyph({ width, height }: SocialIcon) {
  const scale = 14 / Math.max(width, height);
  return {
    scale,
    x: (24 - width * scale) / 2,
    y: (24 - height * scale) / 2,
  };
}

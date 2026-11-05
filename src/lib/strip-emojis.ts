// Global Unicode Emoji & Pictograph sanitizer to ensure 100% professional, emoji-free typography
// Preserves standard typographic punctuation, ©, ®, ™, currency symbols, and multilingual scripts.
const EMOJI_STRIP_REGEX = /(?:\p{Extended_Pictographic}|\p{Emoji_Presentation}|[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}\u{2B55}\u{FE0F}\u{200D}])/gu;

export function stripEmojis(input: string | null | undefined): string {
  if (!input) return '';
  return input
    .replace(EMOJI_STRIP_REGEX, (match) => {
      if (match === '©' || match === '®' || match === '™') return match;
      return '';
    })
    .replace(/≡ƒç¬≡ƒç¼/g, '')
    .replace(/ {2,}/g, ' ')
    .trim();
}

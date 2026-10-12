const lightColors = {
  background: '#F7F3FC',
  text: '#55416F',
  mutedText: '#84758F',
  mint: '#DFF2E7',
  mintText: '#426651',
  mintStrongText: '#284D38',
  lilac: '#EEE5F7',
  surface: '#FFFFFF',
  border: '#E9DFF5',
  cardText: '#59436D',
  cardMuted: '#806A8E',
};

const darkColors: typeof lightColors = {
  background: '#1E1829',

  text: '#FFF7FC',
  mutedText: '#E6D3EF',

  // Very light mint
  mint: '#E8FFF2',
  mintText: '#537663',
  mintStrongText: '#305F46',

  // Very light lavender and pink
  lilac: '#F3ECFF',
  surface: '#FFF4FA',
  border: '#E4D5F2',

  // Purple text inside the light cards
  cardText: '#624A7A',
  cardMuted: '#806C92',
};

export const isDark = false;

export const colors = isDark ? darkColors : lightColors;
import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],

  theme: {
    extend: {}
  },

  daisyui: {
    themes: ['sunset']
  },

  plugins: [require('daisyui')]
} as Config;

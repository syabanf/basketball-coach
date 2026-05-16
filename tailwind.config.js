/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // WIT.ID brand palette (sampled from wit.id)
        brand: {
          50:  '#FFF1F1',
          100: '#FFE0E0',
          200: '#FFB8B8',
          300: '#FA8585',
          400: '#F25C5B',
          500: '#EE3C3B', // Primary WIT red
          600: '#D62524', // Hover / pressed
          700: '#B01C1B', // Deeper red (#ED1C24-aligned)
          800: '#7E1413',
          900: '#4E0C0C'
        },
        // Charcoal / ink ramp — pairs with the WIT red on light surfaces
        navy: {
          50:  '#F4F4F4',
          100: '#EBE8E8',
          200: '#D6D4D4',
          300: '#ABABAB',
          400: '#6E6E6E',
          500: '#4A4A4A',
          600: '#313131', // Body / secondary
          700: '#242424', // Headers / dark surface
          800: '#1A1A1A',
          900: '#111111'  // Sidebar
        },
        ink: {
          DEFAULT: '#242424',
          muted:   '#6E6E6E',
          subtle:  '#9CA0A4'
        },
        surface: {
          DEFAULT: '#FFFFFF',
          alt:     '#F4F4F4', // WIT off-white
          soft:    '#EBE8E8'
        },
        line: '#E2E1E1',
        status: {
          starterBg:    '#DCFCE7',
          starterText:  '#15803D',
          benchBg:      '#FEE2E2',
          benchText:    '#B91C1C',
          rotationBg:   '#FEF3C7',
          rotationText: '#B45309'
        }
      },
      fontFamily: {
        sans: [
          'Inter', 'ui-sans-serif', 'system-ui', '-apple-system',
          'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'
        ]
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.125rem'
      },
      boxShadow: {
        card:  '0 1px 2px rgba(15, 23, 42, 0.04), 0 4px 16px rgba(15, 23, 42, 0.06)',
        pop:   '0 8px 24px rgba(15, 23, 42, 0.12)',
        focus: '0 0 0 3px rgba(238, 60, 59, 0.25)'
      }
    }
  },
  plugins: []
};

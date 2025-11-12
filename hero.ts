import { heroui } from '@heroui/react';

export default heroui({
    themes: {
        light: {
            colors: {
                // Map legacy Bootstrap theme to HeroUI/Tailwind tokens
                background: '#0e0b10',
                foreground: '#c1c2c3',
                primary: {
                    // $theme-colors.primary
                    DEFAULT: '#371c1c',
                    foreground: '#FFFFFF'
                },
                secondary: {
                    // $theme-colors.secondary (also used as success tone)
                    DEFAULT: '#009648',
                    foreground: '#FFFFFF'
                },
                success: {
                    DEFAULT: '#009648',
                    foreground: '#FFFFFF'
                },
                warning: {
                    // $theme-colors.emphasis
                    DEFAULT: '#fbed18',
                    foreground: '#000000'
                },
                focus: '#ffdf14', // $controlled-border-color
                danger: {
                    DEFAULT: '#EF4444',
                    foreground: '#FFFFFF'
                }
            }
        },
        dark: {
            colors: {
                background: '#0e0b10',
                foreground: '#c1c2c3',
                primary: {
                    DEFAULT: '#371c1c',
                    foreground: '#FFFFFF'
                },
                secondary: {
                    DEFAULT: '#009648',
                    foreground: '#FFFFFF'
                },
                success: {
                    DEFAULT: '#009648',
                    foreground: '#FFFFFF'
                },
                warning: {
                    DEFAULT: '#fbed18',
                    foreground: '#000000'
                },
                focus: '#ffdf14',
                danger: {
                    DEFAULT: '#EF4444',
                    foreground: '#FFFFFF'
                }
            }
        }
    },
    layout: {
        radius: {
            small: '4px',
            medium: '6px',
            large: '8px'
        }
    }
});

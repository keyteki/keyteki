import { heroui } from '@heroui/react';

export default heroui({
    themes: {
        light: {
            colors: {
                primary: {
                    DEFAULT: '#3B82F6',
                    foreground: '#FFFFFF'
                },
                secondary: {
                    DEFAULT: '#F97316',
                    foreground: '#FFFFFF'
                },
                success: {
                    DEFAULT: '#10B981',
                    foreground: '#FFFFFF'
                },
                danger: {
                    DEFAULT: '#EF4444',
                    foreground: '#FFFFFF'
                }
            }
        },
        dark: {
            colors: {
                primary: {
                    DEFAULT: '#3B82F6',
                    foreground: '#FFFFFF'
                },
                secondary: {
                    DEFAULT: '#F97316',
                    foreground: '#FFFFFF'
                },
                success: {
                    DEFAULT: '#10B981',
                    foreground: '#FFFFFF'
                },
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

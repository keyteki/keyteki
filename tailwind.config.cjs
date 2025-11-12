const { heroui } = require('@heroui/react');

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './client/**/*.{js,jsx,ts,tsx}',
        './index.html',
        './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}'
    ],
    theme: {
        container: {
            center: true
        },
        extend: {}
    },
    darkMode: 'class',
    plugins: [heroui()]
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          
        "primary": "#AB8DC8",
                  
        "primary-content": "#0b070f",
                  
        "secondary": "#7B688B",
                  
        "secondary-content": "#e3dfe7",
                  
        "accent": "#e879f9",
                  
        "accent-content": "#130515",
                  
        "neutral": "#221D22",
                  
        "neutral-content": "#ceccce",
                  
        "base-100": "#fbede0",
                  
        "base-200": "#dacec3",
                  
        "base-300": "#bab0a6",
                  
        "base-content": "#151412",
                  
        "info": "#60a5fa",
                  
        "info-content": "#030a15",
                  
        "success": "#4ade80",
                  
        "success-content": "#021206",
                  
        "warning": "#fde047",
                  
        "warning-content": "#161202",
                  
        "error": "#fb7185",
                  
        "error-content": "#150406",
          },
        },
      ],
    },
  plugins: [
    require('daisyui'),
  ],
}


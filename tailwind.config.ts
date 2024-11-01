import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1700px",
      },
    },
    fontFamily: {
      geistVf: ["GeistVF", "sans-serif"],
      geistVfMono: ["GeistMonoVF", "monospace"],
    },
    extend: {
      colors: {
        black: "#323031",
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        borderColor: "#6F00FF33",
        verifiedColor: "#35CB1C",
        bgPrimaryShade: "#6F00FF05",
      },
      borderRadius: {
        xs: "1.2rem",
        xsm: "1.4rem",
        sm: "1.6rem",
        smd: "1.8rem",
        md: "2rem",
        lg: "2.2rem",
        xl: "10rem",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontSize: {
        xs: "1.2rem",
        xsm: "1.4rem",
        sm: "1.6rem",
        smd: "1.8rem",
        xmd: "2.1rem",
        md: "2.2rem",
        mdx: "2.4rem",
        lg: "4.2rem",
        xl: "4.6rem",
      },
      space: {
        sm: "1.6rem",
      },
      fontWeight: {},
      lineHeight: {
        "2": "2rem",
        smlg: "2.8rem",
        md: "3rem",
        xl: "5rem",
      },
      spacing: {
        xxs: "0.8rem",
        xs: "1.2rem",
        xsm: "1.4rem",
        sm: "1.6rem",
        smd: "1.8rem",
        slg: "2rem",
        smdlg: "2.4rem",
        md: "3.2rem",
        lg: "4rem",
        xl: "5rem",
        "2xl": "6rem",
      },
      padding: {
        xs: "1.2rem",
        xsm: "1.4rem",
        sm: "1.6rem",
        md: "3.2rem",
      },
      backgroundImage: {
        "search-add-business": "url(/images/search_add_business.png)",
        "single-business": "url(/images/single_busienss.png)",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("tailwind-scrollbar-hide")],
} satisfies Config;

export default config;

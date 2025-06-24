import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";
import animate from "tailwindcss-animate";
import { setupInspiraUI } from "@inspira-ui/plugins";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  safelist: [
    // Essential gray text colors
    'text-gray-100',
    'text-gray-200',
    'text-gray-300',
    'text-gray-400', 
    'text-gray-500',
    'text-gray-600',
    'text-gray-700',
    'text-gray-800',
    'text-gray-900',
    // Dark mode variants
    'dark:text-gray-100',
    'dark:text-gray-200', 
    'dark:text-gray-300',
    'dark:text-gray-400',
    'dark:text-gray-500',
    // Essential background colors
    'bg-gray-50',
    'bg-gray-100',
    'bg-gray-200', 
    'bg-gray-800',
    'bg-gray-900',
    'dark:bg-gray-800',
    'dark:bg-gray-900',
    // Border colors
    'border-gray-200',
    'border-gray-700',
    'dark:border-gray-700',
    // Hover states
    'hover:bg-gray-50',
    'hover:bg-gray-100',
    'hover:bg-gray-700',
    'dark:hover:bg-gray-700',
    'dark:hover:bg-gray-800',
    // Group hover variants  
    'group-hover:text-blue-600',
    'group-hover:text-purple-600',
    'group-hover:text-green-600',
    'group-hover:text-orange-600',
    'group-hover:text-red-600',
    'group-hover:text-yellow-600',
    'group-hover:text-teal-600',
    'group-hover:text-indigo-600',
    'group-hover:text-gray-600',
    // Dark mode group hover
    'dark:group-hover:text-blue-400',
    'dark:group-hover:text-purple-400',
    'dark:group-hover:text-green-400',
    'dark:group-hover:text-orange-400',
    'dark:group-hover:text-red-400', 
    'dark:group-hover:text-yellow-400',
    'dark:group-hover:text-teal-400',
    'dark:group-hover:text-indigo-400',
    'dark:group-hover:text-gray-400',
    // Background color variants with opacity
    'bg-blue-50/60',
    'bg-purple-50/60',
    'bg-green-50/60',
    'bg-orange-50/60', 
    'bg-red-50/60',
    'bg-yellow-50/60',
    'bg-teal-50/60',
    'bg-indigo-50/60',
    'bg-gray-50/60',
    // Dark mode backgrounds with opacity
    'dark:bg-blue-900/20',
    'dark:bg-purple-900/20',
    'dark:bg-green-900/20',
    'dark:bg-orange-900/20',
    'dark:bg-red-900/20',
    'dark:bg-yellow-900/20',
    'dark:bg-teal-900/20',
    'dark:bg-indigo-900/20',
    'dark:bg-gray-800/20',
    // Hover background variants
    'hover:bg-blue-50/80',
    'hover:bg-purple-50/80',
    'hover:bg-green-50/80',
    'hover:bg-orange-50/80',
    'hover:bg-red-50/80',
    'hover:bg-yellow-50/80',
    'hover:bg-teal-50/80',
    'hover:bg-indigo-50/80',
    'hover:bg-gray-50/80',
    // Dark hover variants
    'dark:hover:bg-blue-900/25',
    'dark:hover:bg-purple-900/25',
    'dark:hover:bg-green-900/25',
    'dark:hover:bg-orange-900/25',
    'dark:hover:bg-red-900/25',
    'dark:hover:bg-yellow-900/25',
    'dark:hover:bg-teal-900/25',
    'dark:hover:bg-indigo-900/25',
    'dark:hover:bg-gray-800/25',
    // Border hover variants
    'hover:border-blue-300/50',
    'hover:border-purple-300/50',
    'hover:border-green-300/50',
    'hover:border-orange-300/50',
    'hover:border-red-300/50',
    'hover:border-yellow-300/50',
    'hover:border-teal-300/50',
    'hover:border-indigo-300/50',
    'hover:border-gray-300/50',
    // Dark border hover
    'dark:hover:border-blue-600/50',
    'dark:hover:border-purple-600/50',
    'dark:hover:border-green-600/50',
    'dark:hover:border-orange-600/50',
    'dark:hover:border-red-600/50',
    'dark:hover:border-yellow-600/50',
    'dark:hover:border-teal-600/50',
    'dark:hover:border-indigo-600/50',
    'dark:hover:border-gray-600/50'
  ],
  theme: {
        extend: {
                borderRadius: {
                        lg: 'var(--radius)',
                        md: 'calc(var(--radius) - 2px)',
                        sm: 'calc(var(--radius) - 4px)'
                },
                colors: {
                        background: 'hsl(var(--background))',
                        foreground: 'hsl(var(--foreground))',
                        card: {
                                DEFAULT: 'hsl(var(--card))',
                                foreground: 'hsl(var(--card-foreground))'
                        },
                        popover: {
                                DEFAULT: 'hsl(var(--popover))',
                                foreground: 'hsl(var(--popover-foreground))'
                        },
                        primary: {
                                DEFAULT: 'hsl(var(--primary))',
                                foreground: 'hsl(var(--primary-foreground))',
                                50: '#eff6ff',
                                100: '#dbeafe',
                                200: '#bfdbfe',
                                300: '#93c5fd',
                                400: '#60a5fa',
                                500: '#2563eb',
                                600: '#2563eb',
                                700: '#1d4ed8',
                                800: '#1e40af',
                                900: '#1e3a8a',
                                950: '#172554'
                        },
                        secondary: {
                                DEFAULT: 'hsl(var(--secondary))',
                                foreground: 'hsl(var(--secondary-foreground))'
                        },
                        muted: {
                                DEFAULT: 'hsl(var(--muted))',
                                foreground: 'hsl(var(--muted-foreground))'
                        },
                        accent: {
                                DEFAULT: 'hsl(var(--accent))',
                                foreground: 'hsl(var(--accent-foreground))'
                        },
                        destructive: {
                                DEFAULT: 'hsl(var(--destructive))',
                                foreground: 'hsl(var(--destructive-foreground))'
                        },
                        border: 'hsl(var(--border))',
                        input: 'hsl(var(--input))',
                        ring: 'hsl(var(--ring))',
                        chart: {
                                '1': 'hsl(var(--chart-1))',
                                '2': 'hsl(var(--chart-2))',
                                '3': 'hsl(var(--chart-3))',
                                '4': 'hsl(var(--chart-4))',
                                '5': 'hsl(var(--chart-5))'
                        },
                        sidebar: {
                                DEFAULT: 'hsl(var(--sidebar-background))',
                                foreground: 'hsl(var(--sidebar-foreground))',
                                primary: 'hsl(var(--sidebar-primary))',
                                'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
                                accent: 'hsl(var(--sidebar-accent))',
                                'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
                                border: 'hsl(var(--sidebar-border))',
                                ring: 'hsl(var(--sidebar-ring))'
                        }
                },
                backgroundImage: {
                        "skeleton-gradient": "linear-gradient(270deg, var(--accents-1), var(--accents-2), var(--accents-2), var(--accents-1))"
                },
                keyframes: {
                        'accordion-down': {
                                from: {
                                        height: '0'
                                },
                                to: {
                                        height: 'var(--radix-accordion-content-height)'
                                }
                        },
                        'accordion-up': {
                                from: {
                                        height: 'var(--radix-accordion-content-height)'
                                },
                                to: {
                                        height: '0'
                                }
                        },
                        'shimmer': {
                                '0%': { transform: 'translateX(-100%)' },
                                '100%': { transform: 'translateX(100%)' }
                        },
                        'subtle-spin': {
                                '0%': { 
                                    transform: 'rotate(0deg)' 
                                },
                                '100%': { 
                                    transform: 'rotate(360deg)' 
                                }
                        },
                        'subtle-bounce': {
                                '0%, 100%': { 
                                    transform: 'translateY(0)' 
                                },
                                '50%': { 
                                    transform: 'translateY(-10%)' 
                                }
                        },
                        'fadeIn': {
                                '0%': { 
                                    opacity: '0',
                                    transform: 'translateY(10px)'
                                },
                                '100%': { 
                                    opacity: '1',
                                    transform: 'translateY(0)'
                                }
                        },
                        'pulse-glow': {
                                '0%, 100%': { 
                                    opacity: '0.4'
                                },
                                '50%': { 
                                    opacity: '1'
                                }
                        },
                        'skeletonLoading': {
                                "0%": { backgroundPosition: "200% 0" },
                                "100%": { backgroundPosition: "-200% 0" }
                        }
                },
                animation: {
                        'accordion-down': 'accordion-down 0.2s ease-out',
                        'accordion-up': 'accordion-up 0.2s ease-out',
                        'shimmer': 'shimmer 3s infinite',
                        'subtle-spin': 'subtle-spin 60s linear infinite',
                        'subtle-bounce': 'subtle-bounce 1s ease-in-out infinite',
                        'fadeIn': 'fadeIn 0.5s ease-out forwards',
                        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
                        'skeleton-loading': 'skeletonLoading 8s infinite ease-in-out'
                }
        }
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography"), require("tailwind-scrollbar"), setupInspiraUI, animate], 
} satisfies Config;

/**
 * ESLint Configuration - LaRama Frontend
 * Defines code quality rules and standards for React application
 * Ensures consistent code style and catches potential errors
 */

import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // Global file ignores - exclude build output and dependencies
  globalIgnores(['dist', 'node_modules']),
  
  {
    // Target JavaScript and JSX files
    files: ['**/*.{js,jsx}'],
    
    // Extend recommended configurations
    extends: [
      js.configs.recommended, // JavaScript best practices
      reactHooks.configs['recommended-latest'], // React Hooks rules
      reactRefresh.configs.vite, // Vite hot reload compatibility
    ],
    
    // Language and parser configuration
    languageOptions: {
      ecmaVersion: 2020, // ES2020 features support
      globals: globals.browser, // Browser global variables
      parserOptions: {
        ecmaVersion: 'latest', // Latest ECMAScript features
        ecmaFeatures: { jsx: true }, // JSX syntax support
        sourceType: 'module', // ES6 module system
      },
    },
    
    // Custom linting rules
    rules: {
      // Allow unused variables that start with uppercase (React components)
      'no-unused-vars': ['error', { 
        varsIgnorePattern: '^[A-Z_]',
        argsIgnorePattern: '^_'
      }],
      
      // React specific rules
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': 'warn',
      
      // General code quality rules
      'no-console': 'warn', // Warn about console statements
      'prefer-const': 'error', // Prefer const over let when possible
      'no-var': 'error', // Disallow var declarations
    },
  },
])

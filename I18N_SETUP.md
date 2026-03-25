# Multi-Language Setup (i18n)

Your OmniCare website now supports **French**, **English**, and **Arabic**!

## Installation Required

First, install the required packages:

```bash
cd front
npm install i18next react-i18next i18next-browser-languagedetector
```

## What Was Added

### 1. Translation Files
- `src/i18n/locales/fr.json` - French translations (default)
- `src/i18n/locales/en.json` - English translations
- `src/i18n/locales/ar.json` - Arabic translations (with RTL support)

### 2. Configuration
- `src/i18n/config.ts` - i18next configuration
- `src/main.tsx` - Updated to initialize i18n

### 3. Language Switcher
- `src/components/LanguageSwitcher.tsx` - Globe icon dropdown to switch languages
- Added to Navbar for easy access

## Features

✅ **3 Languages**: French (default), English, Arabic
✅ **Auto-detection**: Detects browser language
✅ **Persistence**: Saves language preference in localStorage
✅ **RTL Support**: Automatically switches to right-to-left for Arabic
✅ **Easy Switching**: Globe icon in navbar

## How to Add Translations to Other Pages

To make other pages translatable, follow this pattern:

### 1. Import useTranslation hook
```typescript
import { useTranslation } from 'react-i18next';
```

### 2. Use the hook in your component
```typescript
export function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('myKey.title')}</h1>
      <p>{t('myKey.description')}</p>
    </div>
  );
}
```

### 3. Add translations to JSON files
Add the keys to all three translation files:

**fr.json:**
```json
{
  "myKey": {
    "title": "Mon Titre",
    "description": "Ma description"
  }
}
```

**en.json:**
```json
{
  "myKey": {
    "title": "My Title",
    "description": "My description"
  }
}
```

**ar.json:**
```json
{
  "myKey": {
    "title": "عنواني",
    "description": "وصفي"
  }
}
```

## Currently Translated

- ✅ Navbar
- ✅ Footer (ready - needs component update)
- ✅ Contact form (ready - needs component update)
- ✅ Pre-inscription form (ready - needs component update)
- ✅ Login page (ready - needs component update)

## Next Steps

1. Install the packages (see above)
2. Test the language switcher
3. Update other components to use translations as needed

## Language Codes

- `fr` - Français (French)
- `en` - English
- `ar` - العربية (Arabic)

The language switcher shows flags:
- 🇫🇷 French
- 🇬🇧 English
- 🇹🇳 Arabic

# ZiggyLol

A company URL shortcut search engine inspired by Meta's bunnylol. Transform your browser's address bar into a command-line interface for quick navigation.

## 🚀 Features

- **Command-based navigation** (e.g., `jira ABC-123`, `docs authentication`)
- **Smart autocomplete** with keyboard navigation
- **Company-specific shortcuts** for Jira, Confluence, Slack, etc.
- **Admin panel** for managing shortcuts (Ctrl+A)
- **Fallback to Google search** for unrecognized commands
- **Responsive design** with modern UI

## 🎯 Usage Examples

- `gh react` → Search GitHub for "react"
- `jira ABC-123` → Go to Jira ticket ABC-123
- `slack general` → Go to #general Slack channel
- `docs api` → Search company docs for "api"
- `unknown command` → Google search fallback

## 🛠 Development

```bash
npm install
npm start
```

## 📦 Deployment

Deploy to GitHub Pages:

```bash
npm run deploy
```

## ⚙️ Browser Setup

Set as default search engine:
- **URL**: `https://d3vinharrington.github.io/ziggylol/?q=%s`
- **Name**: ZiggyLol
- **Shortcut**: ziggy

## 🔧 Customization

1. Press Ctrl+A or click "Manage Shortcuts"
2. Add/edit shortcuts in the admin panel
3. Download updated shortcuts.js
4. Replace in src/ and redeploy

## 🏢 Company Setup

1. Update company name in settings
2. Customize shortcuts for your internal tools
3. Deploy and share with your team

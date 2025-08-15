export const shortcuts = [
  // Development & Code
  { 
    command: 'gh', 
    name: 'GitHub', 
    url: 'https://github.com/search?q={{query}}',
    baseUrl: 'https://github.com',
    description: 'Search GitHub or go to homepage' 
  },
  { 
    command: 'jira', 
    name: 'Jira', 
    url: 'https://{{company}}.atlassian.net/secure/QuickSearch.jspa?searchString={{query}}',
    baseUrl: 'https://{{company}}.atlassian.net',
    description: 'Search Jira tickets' 
  },
  { 
    command: 'conf', 
    name: 'Confluence', 
    url: 'https://{{company}}.atlassian.net/wiki/dosearchsite.action?queryString={{query}}',
    baseUrl: 'https://{{company}}.atlassian.net/wiki',
    description: 'Search Confluence documentation' 
  },
  
  // Communication
  { 
    command: 'slack', 
    name: 'Slack', 
    url: 'https://{{company}}.slack.com/messages/{{query}}',
    baseUrl: 'https://{{company}}.slack.com',
    description: 'Go to Slack channel or search' 
  },
  { 
    command: 'zoom', 
    name: 'Zoom', 
    url: 'https://zoom.us/j/{{query}}',
    baseUrl: 'https://zoom.us',
    description: 'Join Zoom meeting by ID' 
  },
  
  // Productivity
  { 
    command: 'cal', 
    name: 'Calendar', 
    url: 'https://calendar.google.com/calendar/u/0/r/search?q={{query}}',
    baseUrl: 'https://calendar.google.com',
    description: 'Search Google Calendar' 
  },
  { 
    command: 'drive', 
    name: 'Google Drive', 
    url: 'https://drive.google.com/drive/search?q={{query}}',
    baseUrl: 'https://drive.google.com',
    description: 'Search Google Drive' 
  },
  
  // General Search
  { 
    command: 'g', 
    name: 'Google', 
    url: 'https://www.google.com/search?q={{query}}',
    baseUrl: 'https://www.google.com',
    description: 'Google search' 
  },
  { 
    command: 'so', 
    name: 'Stack Overflow', 
    url: 'https://stackoverflow.com/search?q={{query}}',
    baseUrl: 'https://stackoverflow.com',
    description: 'Search Stack Overflow' 
  },
  
  // Documentation
  { 
    command: 'mdn', 
    name: 'MDN', 
    url: 'https://developer.mozilla.org/en-US/search?q={{query}}',
    baseUrl: 'https://developer.mozilla.org',
    description: 'Search MDN documentation' 
  },
  { 
    command: 'docs', 
    name: 'Documentation', 
    url: 'https://{{company}}.atlassian.net/wiki/dosearchsite.action?queryString={{query}}',
    baseUrl: 'https://{{company}}.atlassian.net/wiki',
    description: 'Search company documentation' 
  }
];

export const getShortcutUrl = (command, query = '', companyName = 'yourcompany') => {
  const shortcut = shortcuts.find(s => s.command === command);
  if (!shortcut) return null;
  
  let url = query ? shortcut.url : shortcut.baseUrl;
  url = url.replace('{{query}}', encodeURIComponent(query));
  url = url.replace(/{{company}}/g, companyName);
  
  return url;
};
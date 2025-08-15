import React, { useState, useEffect, useRef } from 'react';
import { shortcuts, getShortcutUrl } from './shortcuts';
import AdminPanel from './AdminPanel';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [companyName, setCompanyName] = useState(
    localStorage.getItem('ziggyCompanyName') || 'yourcompany'
  );
  const [showAdmin, setShowAdmin] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [redirectCommand, setRedirectCommand] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    // Handle URL search parameters first
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    if (query) {
      setInput(query);
      setIsRedirecting(true);
      setRedirectCommand(query);
      
      // Show loading briefly, then redirect
      setTimeout(() => {
        const parts = query.trim().split(' ');
        const command = parts[0];
        const searchQuery = parts.slice(1).join(' ');
        const url = getShortcutUrl(command, searchQuery, companyName);
        
        if (url) {
          window.location.href = url;
        } else {
          window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        }
      }, 500); // Quick but visible loading
    } else {
      // Only focus if not redirecting
      inputRef.current?.focus();
    }
  }, []); // Remove companyName dependency

  // Separate effect for company name changes
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    if (query && !isRedirecting) {
      // Re-trigger redirect if company name changes and we have a query
      setIsRedirecting(true);
      setRedirectCommand(query);
      
      setTimeout(() => {
        const parts = query.trim().split(' ');
        const command = parts[0];
        const searchQuery = parts.slice(1).join(' ');
        const url = getShortcutUrl(command, searchQuery, companyName);
        
        if (url) {
          window.location.href = url;
        } else {
          window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        }
      }, 500);
    }
  }, [companyName, isRedirecting]);

  useEffect(() => {
    localStorage.setItem('ziggyCompanyName', companyName);
  }, [companyName]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);
    setSelectedIndex(-1);

    if (value.trim()) {
      const filtered = shortcuts.filter(shortcut =>
        shortcut.command.toLowerCase().includes(value.toLowerCase()) ||
        shortcut.name.toLowerCase().includes(value.toLowerCase()) ||
        shortcut.description.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 8);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      executeCommand();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Escape') {
      setSuggestions([]);
      setSelectedIndex(-1);
    } else if (e.ctrlKey && e.key === 'a') {
      e.preventDefault();
      setShowAdmin(true);
    }
  };

  const executeCommand = () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    const parts = trimmedInput.split(' ');
    const command = parts[0];
    const query = parts.slice(1).join(' ');

    if (selectedIndex >= 0 && suggestions[selectedIndex]) {
      const selectedShortcut = suggestions[selectedIndex];
      const url = getShortcutUrl(selectedShortcut.command, query, companyName);
      if (url) {
        window.open(url, '_blank');
        return;
      }
    }

    const url = getShortcutUrl(command, query, companyName);
    
    if (url) {
      window.open(url, '_blank');
    } else {
      const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(trimmedInput)}`;
      window.open(googleSearchUrl, '_blank');
    }
  };

  const handleSuggestionClick = (shortcut) => {
    const parts = input.split(' ');
    const query = parts.slice(1).join(' ');
    const url = getShortcutUrl(shortcut.command, query, companyName);
    if (url) {
      window.open(url, '_blank');
    }
  };

  if (isRedirecting) {
    return (
      <div className="loading-page">
        <div className="loading-container">
          <div className="logo">
            <div className="logo-ziggy">Z</div>
            <div className="logo-spinner"></div>
          </div>
          <h2>ZiggyLol</h2>
          <p>Redirecting to: <code>{redirectCommand}</code></p>
          <div className="loading-bar">
            <div className="loading-progress"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="container">
        <div className="header">
          <h1>ZiggyLol</h1>
          <p>Your company's search engine</p>
        </div>

        <div className="search-container">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Enter a command (e.g., 'jira ABC-123' or 'docs authentication')"
            className="search-input"
          />

          {suggestions.length > 0 && (
            <div className="suggestions">
              {suggestions.map((suggestion, index) => (
                <div
                  key={suggestion.command}
                  className={`suggestion ${index === selectedIndex ? 'selected' : ''}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <div className="suggestion-command">{suggestion.command}</div>
                  <div className="suggestion-name">{suggestion.name}</div>
                  <div className="suggestion-description">{suggestion.description}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="help">
          <h3>Quick Commands:</h3>
          <div className="command-grid">
            {shortcuts.slice(0, 12).map(shortcut => (
              <div key={shortcut.command} className="command-item">
                <code>{shortcut.command}</code> - {shortcut.name}
              </div>
            ))}
          </div>
        </div>

        <div className="settings">
          <label>
            Company Name:
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="yourcompany"
              className="company-input"
            />
          </label>
          <button 
            className="admin-btn"
            onClick={() => setShowAdmin(true)}
          >
            Manage Shortcuts
          </button>
        </div>

        <div className="keyboard-shortcuts">
          <p><kbd>Ctrl</kbd> + <kbd>A</kbd> to open admin panel</p>
        </div>
      </div>

      {showAdmin && (
        <AdminPanel 
          onClose={() => setShowAdmin(false)}
          onSave={(updatedShortcuts) => {
            console.log('Updated shortcuts:', updatedShortcuts);
            setShowAdmin(false);
          }}
        />
      )}
    </div>
  );
}

export default App;
import React, { useState } from 'react';
import { shortcuts } from './shortcuts';
import './AdminPanel.css';

function AdminPanel({ onClose, onSave }) {
  const [editedShortcuts, setEditedShortcuts] = useState([...shortcuts]);
  const [newShortcut, setNewShortcut] = useState({
    command: '',
    name: '',
    url: '',
    baseUrl: '',
    description: ''
  });

  const handleShortcutChange = (index, field, value) => {
    const updated = [...editedShortcuts];
    updated[index] = { ...updated[index], [field]: value };
    setEditedShortcuts(updated);
  };

  const handleNewShortcutChange = (field, value) => {
    setNewShortcut({ ...newShortcut, [field]: value });
  };

  const addNewShortcut = () => {
    if (newShortcut.command && newShortcut.name && newShortcut.url) {
      setEditedShortcuts([...editedShortcuts, { ...newShortcut }]);
      setNewShortcut({
        command: '',
        name: '',
        url: '',
        baseUrl: '',
        description: ''
      });
    }
  };

  const removeShortcut = (index) => {
    const updated = editedShortcuts.filter((_, i) => i !== index);
    setEditedShortcuts(updated);
  };

  const saveShortcuts = () => {
    const shortcutsCode = `export const shortcuts = ${JSON.stringify(editedShortcuts, null, 2)};

export const getShortcutUrl = (command, query = '', companyName = 'yourcompany') => {
  const shortcut = shortcuts.find(s => s.command === command);
  if (!shortcut) return null;
  
  let url = query ? shortcut.url : shortcut.baseUrl;
  url = url.replace('{{query}}', encodeURIComponent(query));
  url = url.replace(/{{company}}/g, companyName);
  
  return url;
};`;

    const blob = new Blob([shortcutsCode], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shortcuts.js';
    a.click();
    URL.revokeObjectURL(url);

    if (onSave) onSave(editedShortcuts);
  };

  return (
    <div className="admin-overlay">
      <div className="admin-panel">
        <div className="admin-header">
          <h2>Manage Shortcuts</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="admin-content">
          <div className="shortcuts-list">
            <h3>Existing Shortcuts</h3>
            {editedShortcuts.map((shortcut, index) => (
              <div key={index} className="shortcut-editor">
                <div className="shortcut-row">
                  <input
                    type="text"
                    placeholder="Command"
                    value={shortcut.command}
                    onChange={(e) => handleShortcutChange(index, 'command', e.target.value)}
                    className="input-small"
                  />
                  <input
                    type="text"
                    placeholder="Name"
                    value={shortcut.name}
                    onChange={(e) => handleShortcutChange(index, 'name', e.target.value)}
                    className="input-medium"
                  />
                  <button 
                    className="remove-btn"
                    onClick={() => removeShortcut(index)}
                  >
                    Remove
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="URL with {{query}} placeholder"
                  value={shortcut.url}
                  onChange={(e) => handleShortcutChange(index, 'url', e.target.value)}
                  className="input-full"
                />
                <input
                  type="text"
                  placeholder="Base URL (optional)"
                  value={shortcut.baseUrl}
                  onChange={(e) => handleShortcutChange(index, 'baseUrl', e.target.value)}
                  className="input-full"
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={shortcut.description}
                  onChange={(e) => handleShortcutChange(index, 'description', e.target.value)}
                  className="input-full"
                />
              </div>
            ))}
          </div>

          <div className="add-new-section">
            <h3>Add New Shortcut</h3>
            <div className="shortcut-editor">
              <div className="shortcut-row">
                <input
                  type="text"
                  placeholder="Command"
                  value={newShortcut.command}
                  onChange={(e) => handleNewShortcutChange('command', e.target.value)}
                  className="input-small"
                />
                <input
                  type="text"
                  placeholder="Name"
                  value={newShortcut.name}
                  onChange={(e) => handleNewShortcutChange('name', e.target.value)}
                  className="input-medium"
                />
                <button 
                  className="add-btn"
                  onClick={addNewShortcut}
                >
                  Add
                </button>
              </div>
              <input
                type="text"
                placeholder="URL with {{query}} placeholder (e.g., https://example.com/search?q={{query}})"
                value={newShortcut.url}
                onChange={(e) => handleNewShortcutChange('url', e.target.value)}
                className="input-full"
              />
              <input
                type="text"
                placeholder="Base URL (optional)"
                value={newShortcut.baseUrl}
                onChange={(e) => handleNewShortcutChange('baseUrl', e.target.value)}
                className="input-full"
              />
              <input
                type="text"
                placeholder="Description"
                value={newShortcut.description}
                onChange={(e) => handleNewShortcutChange('description', e.target.value)}
                className="input-full"
              />
            </div>
          </div>

          <div className="admin-actions">
            <button className="save-btn" onClick={saveShortcuts}>
              Download Updated shortcuts.js
            </button>
            <p className="help-text">
              After downloading, replace the shortcuts.js file in your project's src folder and restart the development server.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
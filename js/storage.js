// js/storage.js
// Utility functions for reading/writing history from localStorage
const Storage = {
  getHistory: () => {
    try {
      return JSON.parse(localStorage.getItem('billHistory') || '[]');
    } catch (e) {
      console.warn('Failed to parse billHistory', e);
      return [];
    }
  },
  setHistory: (arr) => {
    localStorage.setItem('billHistory', JSON.stringify(arr));
  },
  clearHistory: () => {
    localStorage.removeItem('billHistory');
  }
};

// expose to global
window.Storage = Storage;

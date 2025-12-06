// js/storage.js
// Utility functions for reading/writing history from localStorage

const HISTORY_KEY = "billHistory";

const Storage = {
  getHistory: () => {
    try {
      return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    } catch (e) {
      console.warn("Failed to parse bill history:", e);
      return [];
    }
  },

  setHistory: (arr) => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(arr));
  },

  clearHistory: () => {
    localStorage.removeItem(HISTORY_KEY);
  }
};

// expose globally
window.Storage = Storage;

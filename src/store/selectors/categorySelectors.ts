import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "store";

export const selectSelectedCategory = (state: RootState) =>
  state.categories.selectedCategory;
export const selectEditMode = (state: RootState) => state.categories.editMode;
export const selectEditingCategory = (state: RootState) =>
  state.categories.editingCategory;
export const selectSearchTerm = (state: RootState) =>
  state.categories.searchTerm;
export const selectAvailableCategories = (state: RootState) =>
  state.categories.availableCategories;

// Combined selectors
export const selectAllCategories = createSelector(
  selectAvailableCategories,
  (state: RootState) => state.notes.notes,
  (availableCategories, notes) => {
    // Get categories from notes
    const noteCategoriesSet = new Set(
      notes
        .filter((note) => note.category)
        .map((note) => note.category as string)
    );

    // Combine with available categories
    const allCategories = new Set([
      ...availableCategories,
      ...noteCategoriesSet,
    ]);

    // Return sorted array
    return Array.from(allCategories).sort();
  }
);

export const selectCategoryLength = (state: RootState) => state.categories.availableCategories.length;

export const selectCategoryStats = (state: RootState) => {
  const notes = state.notes.notes;
  const stats = new Map<string, { count: number; color: string }>();

  const defaultColors: Record<string, string> = {
    Work: "#3b82f6",
    Personal: "#10b981",
    Ideas: "#f59e0b",
    Tasks: "#ef4444",
    Study: "#8b5cf6",
    Travel: "#06b6d4",
    Finance: "#84cc16",
    Health: "#ec4899",
  };

  const getColorForCategory = (category: string) => {
    if (defaultColors[category]) return defaultColors[category];

    const hash = category.split("").reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    const h = Math.abs(hash) % 360;
    return `hsl(${h}, 70%, 60%)`;
  };

  notes.forEach((note) => {
    if (note.category) {
      const category = note.category;
      if (!stats.has(category)) {
        stats.set(category, {
          count: 0,
          color: getColorForCategory(category),
        });
      }
      stats.get(category)!.count++;
    }
  });

  return stats;
};

export const selectFilteredNotes = (state: RootState) => {
  const notes = state.notes.notes;
  const selectedCategory = state.categories.selectedCategory;
  const searchTerm = state.categories.searchTerm;

  let result = [...notes];

  if (selectedCategory) {
    result = result.filter((note) => note.category === selectedCategory);
  }

  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    result = result.filter(
      (note) =>
        note.title.toLowerCase().includes(term) ||
        note.content.toLowerCase().includes(term)
    );
  }

  return result;
};

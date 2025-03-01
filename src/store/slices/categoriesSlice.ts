import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const getSavedCategories = (): string[] => {
  try {
    const savedCategories = localStorage.getItem("categories");
    return savedCategories ? JSON.parse(savedCategories) : [];
  } catch (error) {
    console.error("Failed to parse saved categories:", error);
    return [];
  }
};

interface CategoriesState {
  selectedCategory: string | null;
  editMode: boolean;
  editingCategory: string | null;
  searchTerm: string;
  availableCategories: string[];
}

const initialState: CategoriesState = {
  selectedCategory: null,
  editMode: false,
  editingCategory: null,
  searchTerm: "",
  availableCategories: getSavedCategories(),
};

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    selectCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
    },
    toggleEditMode: (state) => {
      state.editMode = !state.editMode;
      if (!state.editMode) {
        state.editingCategory = null;
      }
    },
    setEditingCategory: (state, action: PayloadAction<string | null>) => {
      state.editingCategory = action.payload;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },

    addCategory: (state, action: PayloadAction<string>) => {
      const category = action.payload.trim();
      if (category && !state.availableCategories.includes(category)) {
        state.availableCategories.push(category);
        // Save to localStorage
        localStorage.setItem(
          "categories",
          JSON.stringify(state.availableCategories)
        );
      }
    },
    renameCategory: (
      state,
      action: PayloadAction<{ oldName: string; newName: string }>
    ) => {
      const { oldName, newName } = action.payload;
      const trimmedNewName = newName.trim();

      if (trimmedNewName && oldName !== trimmedNewName) {
        const index = state.availableCategories.indexOf(oldName);
        if (index !== -1) {
          state.availableCategories[index] = trimmedNewName;

          // Update selected category if needed
          if (state.selectedCategory === oldName) {
            state.selectedCategory = trimmedNewName;
          }

          // Save to localStorage
          localStorage.setItem(
            "categories",
            JSON.stringify(state.availableCategories)
          );
        }
      }
    },

    removeCategory: (state, action: PayloadAction<string>) => {
      const category = action.payload;
      state.availableCategories = state.availableCategories.filter(
        (cat) => cat !== category
      );

      // Clear selected category if removed
      if (state.selectedCategory === category) {
        state.selectedCategory = null;
      }

      // Save to localStorage
      localStorage.setItem(
        "categories",
        JSON.stringify(state.availableCategories)
      );
    },
    syncCategoriesFromNotes: (state, action: PayloadAction<string[]>) => {
      // Get unique categories from notes and merge with saved categories
      const noteCategories = action.payload;
      const uniqueCategories = new Set([
        ...state.availableCategories,
        ...noteCategories,
      ]);
      state.availableCategories = Array.from(uniqueCategories).sort();

      // Save to localStorage
      localStorage.setItem(
        "categories",
        JSON.stringify(state.availableCategories)
      );
    },
  },
});

// Export actions
export const { 
  selectCategory, 
  toggleEditMode, 
  setEditingCategory, 
  setSearchTerm,
  addCategory,
  renameCategory,
  removeCategory,
  syncCategoriesFromNotes
} = categoriesSlice.actions;

export default categoriesSlice.reducer;

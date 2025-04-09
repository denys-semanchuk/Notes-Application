import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { NoteCard } from "components/common/NoteCard";
import { EmptyState } from "components/common/EmptyState";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTags,
  faEdit,
  faTrash,
  faPlus,
  faSave,
  faTimes,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { RootState } from "store";
import { setNoteCategory } from "store/slices/notesSlice";
import {
  selectCategory,
  toggleEditMode,
  setEditingCategory,
  setSearchTerm,
  addCategory,
  renameCategory,
  removeCategory,
  syncCategoriesFromNotes,
} from "store/slices/categoriesSlice";
import "styles/categories.css";
import {
  selectAllCategories,
  selectCategoryStats,
  selectEditingCategory,
  selectEditMode,
  selectSearchTerm,
  selectSelectedCategory,
} from "store/selectors/categorySelectors";
import { selectFilteredNotes } from "store/selectors/noteSelectors";
import { Helmet } from "react-helmet";

export const Categories: React.FC = () => {
  const dispatch = useDispatch();

  const notes = useSelector((state: RootState) => state.notes.notes);
  const selectedCategory = useSelector(selectSelectedCategory);
  const isEditMode = useSelector(selectEditMode);
  const editingCategory = useSelector(selectEditingCategory);
  const searchTerm = useSelector(selectSearchTerm);
  const categories = useSelector(selectAllCategories);
  const categoryStats = useSelector(selectCategoryStats);
  const filteredNotes = useSelector(selectFilteredNotes);

  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  // Sync categories from notes on component mount
  useEffect(() => {
    const categoriesFromNotes = notes
      .filter((note) => note.category)
      .map((note) => note.category as string);

    dispatch(syncCategoriesFromNotes(categoriesFromNotes));
  }, [dispatch, notes]);

  // Handle category selection
  const handleCategoryClick = (category: string) => {
    if (isEditMode) return; // Disable selection in edit mode
    dispatch(selectCategory(category === selectedCategory ? null : category));
  };

  // Handle category rename
  const handleRenameCategory = (oldCategory: string, newCategory: string) => {
    if (!newCategory.trim() || oldCategory === newCategory) {
      dispatch(setEditingCategory(null));
      return;
    }

    // Update Redux store for category name
    dispatch(renameCategory({ oldName: oldCategory, newName: newCategory }));

    // Update notes with this category
    notes.forEach((note) => {
      if (note.category === oldCategory) {
        dispatch(setNoteCategory({ id: note.id, category: newCategory }));
      }
    });

    dispatch(setEditingCategory(null));
  };

  // Handle category deletion
  const handleDeleteCategory = (category: string) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to remove the "${category}" category? This will remove the category from all notes but won't delete the notes themselves.`
    );

    if (confirmDelete) {
      // Remove category from Redux store
      dispatch(removeCategory(category));

      // Remove category from all notes with this category
      notes.forEach((note) => {
        if (note.category === category) {
          dispatch(setNoteCategory({ id: note.id, category: null }));
        }
      });

      // If this was the selected category, clear selection
      if (selectedCategory === category) {
        dispatch(selectCategory(null));
      }
    }
  };

  // Handle adding a new category
  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;

    // Check if category already exists
    if (categories.includes(newCategoryName)) {
      alert("This category already exists.");
      return;
    }

    // Add category to Redux store
    dispatch(addCategory(newCategoryName));

    // Reset UI state
    setIsAddingCategory(false);
    setNewCategoryName("");

    // Select the new category
    dispatch(selectCategory(newCategoryName));
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <>
      <Helmet>
        <title>Categories | QuickQuill</title>
        <meta name="description" content="Manage your note categories" />
      </Helmet>
      <div className="categories-page">
        <motion.div
          className="page-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="title-section">
            <h1>
              <FontAwesomeIcon icon={faTags} className="header-icon" />
              Categories
            </h1>
            <div className="stats-pills">
              <span className="stat-pill total">{notes.length} Notes</span>
              <span className="stat-pill total">
                {categories.length} Categories
              </span>
            </div>
          </div>

          <div className="header-actions">
            <button
              className={`edit-mode-button ${isEditMode ? "active" : ""}`}
              onClick={() => dispatch(toggleEditMode())}
            >
              <FontAwesomeIcon icon={faEdit} />
              {isEditMode ? "Done" : "Edit Categories"}
            </button>
          </div>
        </motion.div>

        <div className="page-content">
          <motion.div
            className="categories-sidebar"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="categories-header">
              <h2>All Categories</h2>
              {isEditMode && (
                <button
                  className="add-category-button"
                  onClick={() => setIsAddingCategory(true)}
                  disabled={isAddingCategory}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              )}
            </div>

            {isAddingCategory && (
              <div className="category-input-container">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="New category name"
                  autoFocus
                  className="category-input"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAddCategory();
                    } else if (e.key === "Escape") {
                      setIsAddingCategory(false);
                      setNewCategoryName("");
                    }
                  }}
                />
                <div className="category-input-actions">
                  <button
                    className="category-input-save"
                    onClick={handleAddCategory}
                  >
                    <FontAwesomeIcon icon={faSave} />
                  </button>
                  <button
                    className="category-input-cancel"
                    onClick={() => {
                      setIsAddingCategory(false);
                      setNewCategoryName("");
                    }}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
              </div>
            )}

            <div className="categories-list">
              {categories.length > 0 ? (
                <motion.ul
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {categories.map((category) => {
                    const stats = categoryStats.get(category);
                    return (
                      <motion.li
                        key={category}
                        variants={itemVariants}
                        className={`category-item ${
                          selectedCategory === category ? "selected" : ""
                        }`}
                        onClick={() => handleCategoryClick(category)}
                      >
                        {editingCategory === category ? (
                          <div className="category-edit-container">
                            <input
                              type="text"
                              defaultValue={category}
                              autoFocus
                              className="category-edit-input"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleRenameCategory(
                                    category,
                                    e.currentTarget.value
                                  );
                                } else if (e.key === "Escape") {
                                  dispatch(setEditingCategory(null));
                                }
                              }}
                            />
                            <div className="category-edit-actions">
                              <button
                                className="category-edit-save"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const input = e.currentTarget.parentElement
                                    ?.previousSibling as HTMLInputElement;
                                  handleRenameCategory(category, input.value);
                                }}
                              >
                                <FontAwesomeIcon icon={faCheck} />
                              </button>
                              <button
                                className="category-edit-cancel"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  dispatch(setEditingCategory(null));
                                }}
                              >
                                <FontAwesomeIcon icon={faTimes} />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div
                              className="category-color"
                              style={{ backgroundColor: stats?.color }}
                            ></div>
                            <span className="category-name">{category}</span>
                            <span className="category-count">
                              {stats?.count || 0}
                            </span>

                            {isEditMode && (
                              <div
                                className="category-actions"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  className="category-action edit"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    dispatch(setEditingCategory(category));
                                  }}
                                >
                                  <FontAwesomeIcon icon={faEdit} />
                                </button>
                                <button
                                  className="category-action delete"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteCategory(category);
                                  }}
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </button>
                              </div>
                            )}
                          </>
                        )}
                      </motion.li>
                    );
                  })}
                </motion.ul>
              ) : (
                <div className="no-categories">
                  <p>No categories found.</p>
                  <button
                    className="create-category-button"
                    onClick={() => setIsAddingCategory(true)}
                  >
                    Create your first category
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          <div className="category-content">
            <div className="category-content-header">
              {selectedCategory ? (
                <>
                  <h2 className="selected-category-name">
                    <span
                      className="category-color-dot"
                      style={{
                        backgroundColor:
                          categoryStats.get(selectedCategory)?.color,
                      }}
                    ></span>
                    {selectedCategory}
                  </h2>
                  <span className="category-note-count">
                    {filteredNotes.length}{" "}
                    {filteredNotes.length === 1 ? "note" : "notes"}
                  </span>
                </>
              ) : (
                <h2>Select a category to see notes</h2>
              )}

              {selectedCategory && (
                <div className="category-search">
                  <input
                    type="text"
                    placeholder="Search in this category..."
                    value={searchTerm}
                    onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                    className="category-search-input"
                  />
                  {searchTerm && (
                    <button
                      className="clear-search"
                      onClick={() => dispatch(setSearchTerm(""))}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  )}
                </div>
              )}
            </div>

            {selectedCategory && (
              <div className="category-notes">
                {filteredNotes.length > 0 ? (
                  <motion.div
                    className="notes-grid"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {filteredNotes.map((note) => (
                      <motion.div
                        key={note.id}
                        variants={itemVariants}
                        className="note-container"
                      >
                        <NoteCard note={note} highlightText={searchTerm} />
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <EmptyState
                    icon="fas fa-folder-open"
                    title={
                      searchTerm
                        ? "No matching notes"
                        : "No notes in this category"
                    }
                    description={
                      searchTerm
                        ? "Try adjusting your search or browsing all notes in this category."
                        : "Notes with this category will appear here."
                    }
                    buttonText={
                      searchTerm ? "Clear Search" : "Browse All Notes"
                    }
                    onButtonClick={() =>
                      searchTerm
                        ? dispatch(setSearchTerm(""))
                        : dispatch(selectCategory(null))
                    }
                  />
                )}
              </div>
            )}

            {!selectedCategory && (
              <div className="categories-overview">
                <EmptyState
                  icon="fas fa-tags"
                  title="Select a Category"
                  description="Choose a category from the sidebar to see your notes organized by category."
                  imageUrl="/images/categories.svg"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

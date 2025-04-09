import React, { useState, useEffect } from "react";
import "styles/home.css";
import { NoteCard } from "components/common/NoteCard";
import { SortNotes } from "components/common/SortNotes";
import { useNotesManagement } from "hooks/useNotesManagement";
import { Outlet, useLocation } from "react-router";
import { motion } from "framer-motion";
import { EmptyState } from "components/common/EmptyState";
import { StatsBar } from "components/common/StatsBar";

export const Home = () => {
  const {
    sortedAndFilteredNotes,
    notes,
    createANote,
    setSearchQuery,
    searchQuery,
  } = useNotesManagement();
  const location = useLocation();
  const isMainRoute = location.pathname === "/";
  const [greeting, setGreeting] = useState("");
  const [showWelcome, setShowWelcome] = useState(false);

  const activeNotes = sortedAndFilteredNotes.filter((note) => !note.isArchived);

  useEffect(() => {
    const hour = new Date().getHours();
    let newGreeting = "";

    if (hour < 12) {
      newGreeting = "Good morning";
    } else if (hour < 18) {
      newGreeting = "Good afternoon";
    } else {
      newGreeting = "Good evening";
    }

    setGreeting(newGreeting);

    const hasVisitedBefore = localStorage.getItem("hasVisitedBefore");
    if (!hasVisitedBefore) {
      setShowWelcome(true);
      localStorage.setItem("hasVisitedBefore", "true");
    }
  }, []);

  const handleDismissWelcome = () => {
    setShowWelcome(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
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
      <title>Home | QuickQuill</title>
      <meta name="description" content="Your notes, organized." />
      <div className="home-page">
        {showWelcome && (
          <motion.div
            className="welcome-banner"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="welcome-content">
              <h2>Welcome to QuickQuill!</h2>
              <p>
                Start organizing your thoughts with smart notes. Create your
                first note to get started.
              </p>
            </div>
            <button className="welcome-dismiss" onClick={handleDismissWelcome}>
              <i className="fas fa-times"></i>
            </button>
          </motion.div>
        )}

        <div className="page-header">
          <div className="greeting-container">
            <h1>{greeting}!</h1>
            {notes.length > 0 && (
              <p className="stats-text">
                You have {notes.length} notes, {activeNotes.length} active
              </p>
            )}
          </div>

          {notes.length > 0 && (
            <div className="action-buttons">
              <button className="quick-action-button" onClick={createANote}>
                <i className="fas fa-plus"></i> New Note
              </button>
            </div>
          )}
        </div>

        {notes.length > 0 && (
          <motion.div
            className="search-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <input
              type="text"
              placeholder="Search notes by title or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button
                className="clear-search"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </motion.div>
        )}

        {notes.length > 0 && <StatsBar notes={notes} />}

        {notes.length === 0 ? (
          <EmptyState
            icon="fas fa-book-open"
            title="No Notes Yet"
            description="Create your first note to get started. Your notes will appear here."
            buttonText="Create Note"
            onButtonClick={createANote}
          />
        ) : (
          <>
            <div className="sort-container">
              <SortNotes />
            </div>

            {!isMainRoute ? (
              <Outlet />
            ) : activeNotes.length > 0 ? (
              <motion.div
                className="notes-grid"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {activeNotes.map((note) => (
                  <motion.div key={note.id} variants={itemVariants}>
                    <NoteCard note={note} />
                  </motion.div>
                ))}
                <motion.div variants={itemVariants} className="add-card">
                  <button className="add-note-card" onClick={createANote}>
                    <i className="fas fa-plus"></i>
                    <span>New Note</span>
                  </button>
                </motion.div>
              </motion.div>
            ) : (
              <div className="no-matches">
                <i className="fas fa-search"></i>
                <p>No notes match your search criteria.</p>
                <button onClick={() => setSearchQuery("")}>Clear Search</button>
              </div>
            )}
          </>
        )}

        <div className="quick-tip">
          <i className="fas fa-lightbulb"></i>
          <div>
            <h4>Pro Tip</h4>
            <p>
              Use keyboard shortcut <kbd>Ctrl</kbd> + <kbd>N</kbd> to quickly
              create a new note.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

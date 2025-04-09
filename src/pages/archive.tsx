import { NoteCard } from "components/common/NoteCard";
import React from "react";
import { useSelector } from "react-redux";
import { selectArchivedNotes } from "store/selectors/noteSelectors";
import "styles/pages/archives.css";
export const Archive = () => {
  const archivedNotes = useSelector(selectArchivedNotes);

  return (
    <>
      <title>Archived Notes | QuickQuill</title>
      <meta name="description" content="Archived Notes" />
      <div>
        <h1>Archived Notes</h1>
        {archivedNotes.map((note) => (
          <NoteCard key={note.id} note={note} />
        ))}
        {archivedNotes.length < 1 && (
          <p className="archive-text">There's no any archived notes</p>
        )}
      </div>
    </>
  );
};

import { NoteCard } from "components/common/NoteCard";
import React from "react";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import { selectArchivedNotes } from "store/selectors/noteSelectors";
import "styles/pages/archives.css";
export const Archive = () => {
  const archivedNotes = useSelector(selectArchivedNotes);

  return (
    <>
      <Helmet>
        <title>Archived Notes | QuickQuill</title>
        <meta name="description" content="Archived Notes" />
      </Helmet>
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

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import ReactMarkdown from 'react-markdown';
import { RootState } from 'store';
import { updateNote } from 'store/slices/notesSlice';

import 'styles/notepad.css';

export const Notepad = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const note = useSelector((state: RootState) => 
    state.notes.notes.find(note => note.id === id)
  );
  const [content, setContent] = useState(note?.content || '');
  const [title, setTitle] = useState(note?.title || '');

  useEffect(() => {
    if (note) {
      setContent(note.content);
      setTitle(note.title);
    }
  }, [note]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    updateNoteState(e.target.value, title);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    updateNoteState(content, e.target.value);
  };

  const updateNoteState = (newContent: string, newTitle: string) => {
    if (note) {
      dispatch(updateNote({
        ...note,
        content: newContent,
        title: newTitle,
        updatedAt: new Date().toISOString()
      }));
    }
  };

  return (
    <div className="notepad-container">
      <div className="editor-section">
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Note title..."
          className="note-title-input"
        />
        <textarea
          value={content}
          onChange={handleContentChange}
          placeholder="Write your markdown here..."
          className="markdown-editor"
        />
      </div>
      <div className="preview-section">
        <h1>{title}</h1>
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
};
import React, { useEffect, useState } from 'react'
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

  useEffect(() => {
    if (note) {
      setContent(note.content);
    }
  }, [note]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    if (note) {
      dispatch(updateNote({
        ...note,
        content: e.target.value,
        updatedAt: new Date().toISOString()
      }));
    }
  };

  return (
    <div className="notepad-container">
      <div className="editor-section">
        <textarea
          value={content}
          onChange={handleChange}
          placeholder="Write your markdown here..."
          className="markdown-editor"
        />
      </div>
      <div className="preview-section">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
};
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { RootState } from 'store';
import { updateNote } from 'store/slices/notesSlice';
import { ImageUpload } from 'components/common/ImageUpload';
import 'styles/notepad.css';

export const Notepad = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const editorRef = useRef<HTMLDivElement>(null);
  const note = useSelector((state: RootState) =>
    state.notes.notes.find(note => note.id === id)
  );
  const [title, setTitle] = useState(note?.title || '');

  useEffect(() => {
    if (note && editorRef.current) {
      editorRef.current.innerHTML = note.content;
      setTitle(note.title);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleContentChange = () => {
    if (editorRef.current) {
      updateNoteState(editorRef.current.innerHTML, title);
    }
  };

  const insertImage = (imageUrl: string) => {
    if (editorRef.current) {
      const img = document.createElement('img');
      img.src = imageUrl;
      img.alt = 'note image';
      editorRef.current.appendChild(img);
      handleContentChange();
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    updateNoteState(note?.content || '', newTitle);
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
        <div className="toolbar">
          <ImageUpload onImageUpload={(images) => images.forEach(insertImage)} />
        </div>
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Note title..."
          className="note-title-input"
        />
        <div
          ref={editorRef}
          contentEditable
          onInput={handleContentChange}
          className="editor-content"
          suppressContentEditableWarning
        />
      </div>
      <div className="preview-section">
        <h1>{title}</h1>
        <div dangerouslySetInnerHTML={{ __html: editorRef.current?.innerHTML || '' }} />
      </div>
    </div>
  );
};
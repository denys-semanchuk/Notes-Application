import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { RootState } from 'store';
import { updateNote } from 'store/slices/notesSlice';

import 'styles/notepad.css';
import { ImageUpload } from 'components/common/ImageUpload';

export const Notepad = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const editorRef = useRef<HTMLDivElement>(null);
  const savedSelectionRef = useRef<Range | null>(null);
  const note = useSelector((state: RootState) =>
    state.notes.notes.find(note => note.id === id)
  );
  const [title, setTitle] = useState(note?.title || '');

  useEffect(() => {
    if (note && editorRef.current) {
      editorRef.current.innerHTML = note.content;
      setTitle(note.title);
    }
  }, []);

  const handleContentChange = (e: React.FormEvent<HTMLDivElement>) => {
    const newContent = e.currentTarget.innerHTML;
    updateNoteState(newContent, title);
  };

  const saveSelection = () => {
    if (editorRef.current) {
      editorRef.current.focus();
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        savedSelectionRef.current = selection.getRangeAt(0).cloneRange();
      }
    }
  };

  const handleEditorClick = () => {
    saveSelection();
  };

  const handleEditorFocus = () => {
    saveSelection();
  };

  const handleOutsideClick = (e: MouseEvent) => {
    if (editorRef.current && !editorRef.current.contains(e.target as Node)) {
      savedSelectionRef.current = null;
    }
  };
  
  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const restoreSelection = () => {
    if (savedSelectionRef.current) {
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(savedSelectionRef.current);
    }
  };

  const insertImage = (imageUrl: string) => {
    console.log(editorRef.current)
    if (editorRef.current) {
      restoreSelection();
      const selection = window.getSelection();
      const range = selection?.getRangeAt(0);
      const img = document.createElement('img');
      img.src = imageUrl;
      img.alt = 'note image';
      
      range?.insertNode(img);
      range?.collapse(false);
      
      updateNoteState(editorRef.current.innerHTML, title);
      editorRef.current.focus();
    }
  };
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    updateNoteState(note?.content!, e.target.value);
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
        <ImageUpload 
            onBeforeUpload={saveSelection}
            onImageUpload={(images) => images.forEach(insertImage)} 
          />
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
          onClick={handleEditorClick}
          onFocus={handleEditorFocus}
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
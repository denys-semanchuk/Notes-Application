import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { RootState } from "store";
import { updateNote } from "store/slices/notesSlice";
import { ImageUpload } from "components/common/ImageUpload";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBold,
  faItalic,
  faUnderline,
  faHeading,
  faList,
  faListOl,
  faQuoteRight,
  faLink,
  faPalette,
  faAlignLeft,
  faAlignCenter,
  faAlignRight,
  faIndent,
  faOutdent,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import "styles/notepad.css";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";

export const Notepad = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const editorRef = useRef<HTMLDivElement>(null);
  const note = useSelector((state: RootState) =>
    state.notes.notes.find((note) => note.id === id)
  );
  const [title, setTitle] = useState(note?.title || "");
  const [isSaved, setIsSaved] = useState(true);
  const [selectedFont, setSelectedFont] = useState("default");
  const [selectedFontSize, setSelectedFontSize] = useState("16px");
  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
    const saveTimer = setTimeout(() => {
      if (!isSaved && editorRef.current) {
        saveNote();
        setIsSaved(true);
      }
    }, 1500);

    return () => clearTimeout(saveTimer);
  }, [isSaved]);

  useEffect(() => {
    if (note && editorRef.current) {
      editorRef.current.innerHTML = note.content || "";
      setTitle(note.title);
    }
  }, []);

  const handleContentChange = () => {
    setIsSaved(false);
  };

  const saveNote = () => {
    if (editorRef.current && note) {
      const newContent = editorRef.current.innerHTML;
      dispatch(
        updateNote({
          ...note,
          content: newContent,
          title,
          updatedAt: new Date().toISOString(),
        })
      );

      setIsSaved(true);
    }
  };

  const insertImage = (imageUrl: string) => {
    if (editorRef.current) {
      document.execCommand("insertImage", false, imageUrl);
      handleContentChange();
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setIsSaved(false);
  };

  const execFormatCommand = (command: string, value: string = "") => {
    document.execCommand(command, false, value);
    handleContentChange();
    editorRef.current?.focus();
  };

  const toggleBold = () => execFormatCommand("bold");
  const toggleItalic = () => execFormatCommand("italic");
  const toggleUnderline = () => execFormatCommand("underline");
  const toggleHeading = (level: number) =>
    execFormatCommand("formatBlock", `<h${level}>`);
  const toggleList = () => execFormatCommand("insertUnorderedList");
  const toggleOrderedList = () => execFormatCommand("insertOrderedList");
  const toggleQuote = () => execFormatCommand("formatBlock", "<blockquote>");
  const addLink = () => {
    const url = prompt("Type URL:");
    if (url) execFormatCommand("createLink", url);
  };

  const changeTextColor = (color: string) => {
    execFormatCommand("foreColor", color);
    setShowColorPicker(false);
  };

  const changeFont = (font: string) => {
    setSelectedFont(font);
    let fontFamily = "";

    switch (font) {
      case "serif":
        fontFamily = "Georgia, serif";
        break;
      case "sans-serif":
        fontFamily = "Arial, Helvetica, sans-serif";
        break;
      case "monospace":
        fontFamily = "Courier New, monospace";
        break;
      case "cursive":
        fontFamily = "Brush Script MT, cursive";
        break;
      default:
        fontFamily = "Inter, system-ui, sans-serif";
    }

    execFormatCommand("fontName", fontFamily);
  };

  const changeFontSize = (size: string) => {
    setSelectedFontSize(size);
    execFormatCommand("fontSize", size);
  };

  const alignText = (alignment: string) => {
    execFormatCommand(`justify${alignment}`);
  };

  const colors = [
    "#000000",
    "#3366FF",
    "#FF0000",
    "#00CC00",
    "#FF9900",
    "#9933CC",
    "#00CCCC",
    "#555555",
  ];

  return (
    <>
      <Helmet>
        <title>{note ? `Edit Note: ${note.title}` : "Create New Note"}</title>
        <meta name="description" content="Notepad for creating and editing notes" />
      </Helmet>
      <div className="notepad-container modern">
        <div className="editor-toolbar">
          <div className="toolbar-section basic">
            <button
              className="toolbar-button"
              onClick={toggleBold}
              title="Bold (Ctrl+B)"
            >
              <FontAwesomeIcon icon={faBold} />
            </button>
            <button
              className="toolbar-button"
              onClick={toggleItalic}
              title="Italic (Ctrl+I)"
            >
              <FontAwesomeIcon icon={faItalic} />
            </button>
            <button
              className="toolbar-button"
              onClick={toggleUnderline}
              title="Underline (Ctrl+U)"
            >
              <FontAwesomeIcon icon={faUnderline} />
            </button>
          </div>

          <div className="toolbar-section formatting">
            <div className="dropdown-container">
              <select
                value={selectedFont}
                onChange={(e) => changeFont(e.target.value)}
                className="select-style"
              >
                <option value="default">Default Font</option>
                <option value="serif">Serif</option>
                <option value="sans-serif">Sans-serif</option>
                <option value="monospace">Monospace</option>
                <option value="cursive">Cursive</option>
              </select>
            </div>

            <div className="dropdown-container">
              <select
                value={selectedFontSize}
                onChange={(e) => changeFontSize(e.target.value)}
                className="select-style"
              >
                <option value="1">Small</option>
                <option value="3">Normal</option>
                <option value="4">Large</option>
                <option value="5">X-Large</option>
                <option value="7">XX-Large</option>
              </select>
            </div>

            <div className="color-picker-container">
              <button
                className="toolbar-button"
                onClick={() => setShowColorPicker(!showColorPicker)}
                title="Text color"
              >
                <FontAwesomeIcon icon={faPalette} />
              </button>

              {showColorPicker && (
                <div className="color-picker-dropdown">
                  <div className="color-palette">
                    {colors.map((color) => (
                      <div
                        key={color}
                        className="color-option"
                        style={{ backgroundColor: color }}
                        onClick={() => changeTextColor(color)}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="toolbar-section alignment">
            <button
              className="toolbar-button"
              onClick={() => alignText("Left")}
              title="Align left"
            >
              <FontAwesomeIcon icon={faAlignLeft} />
            </button>
            <button
              className="toolbar-button"
              onClick={() => alignText("Center")}
              title="Align center"
            >
              <FontAwesomeIcon icon={faAlignCenter} />
            </button>
            <button
              className="toolbar-button"
              onClick={() => alignText("Right")}
              title="Align right"
            >
              <FontAwesomeIcon icon={faAlignRight} />
            </button>
          </div>

          <div className="toolbar-section lists">
            <button
              className="toolbar-button"
              onClick={toggleList}
              title="Bullet list"
            >
              <FontAwesomeIcon icon={faList} />
            </button>
            <button
              className="toolbar-button"
              onClick={toggleOrderedList}
              title="Numbered list"
            >
              <FontAwesomeIcon icon={faListOl} />
            </button>
            <button
              className="toolbar-button"
              onClick={() => execFormatCommand("indent")}
              title="Indent"
            >
              <FontAwesomeIcon icon={faIndent} />
            </button>
            <button
              className="toolbar-button"
              onClick={() => execFormatCommand("outdent")}
              title="Outdent"
            >
              <FontAwesomeIcon icon={faOutdent} />
            </button>
          </div>

          <div className="toolbar-section headings">
            <button
              className="toolbar-button"
              onClick={() => toggleHeading(1)}
              title="Heading 1"
            >
              <FontAwesomeIcon icon={faHeading} /> 1
            </button>
            <button
              className="toolbar-button"
              onClick={() => toggleHeading(2)}
              title="Heading 2"
            >
              <FontAwesomeIcon icon={faHeading} /> 2
            </button>
          </div>

          <div className="toolbar-section misc">
            <button
              className="toolbar-button"
              onClick={toggleQuote}
              title="Quote"
            >
              <FontAwesomeIcon icon={faQuoteRight} />
            </button>
            <button
              className="toolbar-button"
              onClick={addLink}
              title="Insert link"
            >
              <FontAwesomeIcon icon={faLink} />
            </button>
            <ImageUpload
              onImageUpload={(images) => images.forEach(insertImage)}
            />
          </div>

          <div className="toolbar-section save">
            <motion.button
              className={`save-button ${isSaved ? "saved" : "unsaved"}`}
              onClick={saveNote}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FontAwesomeIcon icon={faSave} />
              {isSaved ? " Saved" : " Save"}
            </motion.button>
          </div>
        </div>

        <div className="editor-main">
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
            className="rich-editor-content"
            suppressContentEditableWarning
          />
        </div>
      </div>
    </>
  );
};

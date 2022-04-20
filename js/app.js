import StorageNote from "./StorageNote.js";
import RenderNote from "./RenderNote.js";

StorageNote.generateDummyDate(5);
const renderNote = new RenderNote(StorageNote.getNotes());

renderNote.renderDefaultNotes();
renderNote.listenDeleteNoteEvents();
renderNote.toggleNoteForm();
renderNote.listenAddToNoteEvent();
renderNote.listenEditNoteEvents();
renderNote.updateNote();
renderNote.listenUnArchiveEvent();

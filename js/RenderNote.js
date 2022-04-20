import NoteElementDOM from "./NoteElementDOM.js";
import Note from "./Note.js";
export default class RenderNote {
  constructor(notes) {
    this.notes = notes;
  }

  renderDefaultNotes() {
    let html = ``;
    this.notes.forEach((note) => {
      html += note.htmlNoteTemplate();
    });

    RenderNote.insertToDOM(html, "afterbegin", NoteElementDOM.listContainer);
  }

  static hideElement(element) {
    element.style.display = "none";
  }

  static displaySummaryTable(html) {
    if (NoteElementDOM.summaryListContainer.childElementCount)
      NoteElementDOM.summaryListContainer.innerHTML = "";
    RenderNote.insertToDOM(html, "afterbegin", NoteElementDOM.summaryListContainer);
  }

  static insertToDOM(html, methodInsert, element) {
    element.insertAdjacentHTML(methodInsert, html);
  }

  listenDeleteNoteEvents() {
    Note.delete();
  }

  listenEditNoteEvents() {
    Note.edit();
  }

  listenUnArchiveEvent() {
    Note.unArchive();
  }

  updateNote() {
    NoteElementDOM.updateBtn.addEventListener("click", () => {
      Note.update();
    });
  }

  static deleteNoteFromUI(entry) {
    entry.remove();
  }

  listenAddToNoteEvent() {
    NoteElementDOM.addNoteBtn.addEventListener("click", () => {
      Note.add();
      this.listenDeleteNoteEvents();
      this.listenEditNoteEvents();
      this.listenUnArchiveEvent();
    });
  }

  toggleNoteForm() {
    NoteElementDOM.createBtn.addEventListener("click", () => {
      NoteElementDOM.makeDisabled(".note-btn-edit", true);
      NoteElementDOM.makeDisabled(".create-btn", false);
      NoteElementDOM.noteForm.classList.toggle("note-form--flex");
    });
  }
}
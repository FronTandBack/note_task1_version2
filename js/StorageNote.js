import NoteDate from "./NoteDate.js";
import Note from "./Note.js";
export default class StorageNote {
  static notes = [];

  static generateDummyDate(noteLength) {
    for (let i = 0; i < noteLength; i++) {
      let note = new Note(
        i + 100,
        "Shopping list",
        NoteDate.getDateForNote(),
        {
          icon: `<i class="fa fa-shopping-cart" aria-hidden="true"></i>`,
          type: "Task",
          option: 0,
        },
        "I'm gonna have a dentist appointment on the 3/5/2021, I moved it from 5/5/2021",
        false
      );
      this.notes.push(note);
    }
  }

  static getNotes() {
    return this.notes;
  }

  static getLastNoteId() {
    return this.notes.length ? this.notes[this.notes.length - 1].id : 0;
  }

  static deleteNote(noteId) {
    this.notes = this.notes.filter((note) => note.id !== noteId);
  }

  static addNote(note) {
    this.notes = [...this.notes, note];
  }
}
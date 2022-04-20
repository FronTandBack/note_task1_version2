export default class NoteElementDOM {
  static listContainer = document.querySelector(".note-list");
  static noteForm = document.querySelector(".note-form");
  static createBtn = document.querySelector(".create-note");
  static addNoteBtn = document.getElementById("add-note-btn");
  static title = document.getElementById("note-title-input");
  static date = document.getElementById("note-date-input");
  static content = document.getElementById("note-content");
  static select = document.getElementById("type-category");
  static updateBtn = document.querySelector(".note-btn-edit");
  static summaryListContainer = document.querySelector(".summary-notes-list");

  static makeDisabled(element, flag) {
    document.querySelector(element).disabled = flag;
  }
}
const createNoteBtnNode = document.querySelector(".create-note");
const editNoteBtnNode = document.getElementById("edit-note-btn");
const titleInput = document.getElementById("note-title-input");
const dateInput = document.getElementById("note-date-input");
const noteFormNode = document.querySelector(".note-form");
const noteListNode = document.querySelector(".note-list");
const summaryListNode = document.querySelector(".summary-notes-list");
const archiveBtNote = document.querySelector(".archived");
const contentTextarea = document.getElementById("note-content");

const categories = [
  {
    icon: `<i class="fa fa-shopping-cart" aria-hidden="true"></i>`,
    type: "Task",
    option: 0,
  },
  {
    icon: `<i class="fa fa-android" aria-hidden="true"></i>`,
    type: "Random Thought",
    option: 1,
  },
  {
    icon: `<i class="fa fa-lightbulb-o" aria-hidden="true"></i>`,
    type: "Idea",
    option: 2,
  },
  {
    icon: `<i class="fa fa-quote-right" aria-hidden="true"></i>`,
    type: "Quote",
    option: 3,
  },
];

class NoteElementDOM {
  static listContainer = document.querySelector(".note-list");
  static noteForm = document.querySelector(".note-form");
  static createBtn = document.querySelector(".create-note");
  static addNoteBtn = document.getElementById("add-note-btn");
  static title = document.getElementById("note-title-input");
  static date = document.getElementById("note-date-input");
  static content = document.getElementById("note-content");
  static select = document.getElementById("type-category");
  static updateBtn = document.querySelector(".note-btn-edit");

  static makeDisabled(element, flag) {
    document.querySelector(element).disabled = flag;
  }
}

class NoteDate {
  constructor(date) {
    this.date = date;
  }

  static getDateForNote(date = "") {
    if (!date) {
      return new Date().toLocaleDateString("en-us", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    }


    return new Date(date).toLocaleDateString("en-us", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  }

  static formatForUI(date) {
    let d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }
}

class Note {
  constructor(id, title, created, category, content, archive = false) {
    this.id = id;
    this.title = title;
    this.created = created;
    this.category = category;
    this.content = content;
    this.archive = archive;
    this.editNote = undefined;
  }

  setTitle(title) {
    this.title = title;
  }

  setDate(created) {
    this.created = created;
  }

  setCategory(category) {
    this.category = category;
  }

  setContent(content) {
    this.content = content;
  }

  htmlNoteTemplate() {
    return `<div class="notes-present todo-note" id=${this.id}>
    <div class="icon">
      ${this.category.icon}
    </div>
    <div class="title">${this.title}</div>
    <div class="created">${this.created}</div>
    <div class="category">${this.category.type}</div>
    <div class="content">${this.content}</div>
    <div class="icons">
      <i class="edit-note fa fa-pencil" aria-hidden="true"></i>
      <i id="archive-note" class="fa fa-arrow-circle-down" aria-hidden="true"></i>
      <i class="delete-note fa fa-trash" aria-hidden="true"></i>
    </div>
  </div>`;
  }

  static delete() {
    // NoteElementDOM.listContainer.addEventListener("click", StorageNote.deleteNoteFromUI);
    const deleteBtn = document.querySelectorAll(".delete-note");
    for (let i = 0; i < deleteBtn.length; i++) {
      deleteBtn[i].addEventListener("click", () => {
        const noteElement = deleteBtn[i].parentNode.parentNode;
        const noteId = parseInt(noteElement.id);
        StorageNote.deleteNote(noteId);
        RenderNote.deleteNoteFromUI(noteElement);
      });
    }
  }

  static #validateInputFields(title, date, content) {
    if (!title || !date || !content) {
      return true;
    }

    return false;
  }

  static add() {
    const category = categories[NoteElementDOM.select.selectedIndex];
    const title = NoteElementDOM.title.value;
    const date = NoteDate.getDateForNote(NoteElementDOM.date.value);
    const content = NoteElementDOM.content.value;

    if (Note.#validateInputFields(title, date, content)) return;
    const id = StorageNote.getLastNote().id;
    const note = new Note(id + 1, title, date, category, content, false);
    StorageNote.addNote(note);

    const html = note.htmlNoteTemplate();

    RenderNote.insertToDOM(html, "afterbegin", NoteElementDOM.listContainer);
    // clearInput([titleInput, dateInput]);
  }

  static edit() {
    const editBtn = document.querySelectorAll(".edit-note");

    for (let i = 0; i < editBtn.length; i++) {
      editBtn[i].addEventListener("click", () => {
        NoteElementDOM.noteForm.classList.toggle("note-form--flex");
        NoteElementDOM.makeDisabled(".note-btn-edit", false);
        NoteElementDOM.makeDisabled(".create-btn", true);
        const noteElement = editBtn[i].parentNode.parentNode;
        const noteId = parseInt(noteElement.id);
        // StorageNote.deleteNote(noteId);
        // RenderNote.deleteNoteFromUI(noteDelete);
        this.editNote = StorageNote.notes.find((note) => note.id === noteId);

        this.#recentEntries(this.editNote);

        console.log("edit work!");
      });
    }
  }

  static update() {
    console.log("Work Update");
    const category = categories[NoteElementDOM.select.selectedIndex];
    const title = NoteElementDOM.title.value;
    const date = NoteElementDOM.date.value;
    const content = NoteElementDOM.content.value;

    if (Note.#validateInputFields(title, date, content)) return;
    this.editNote.title = title;
    this.editNote.created = date;
    this.editNote.category = category;
    this.editNote.content = content;

    const newEntries = document.getElementById(this.editNote.id);

    newEntries.children[0].innerHTML = category.icon;
    newEntries.children[1].innerHTML = title;
    newEntries.children[2].innerHTML = NoteDate.getDateForNote(date);
    newEntries.children[3].innerHTML = category.type;
    newEntries.children[4].innerHTML = content;
  }

  static #recentEntries(note) {
    NoteElementDOM.title.value = note.title;
    NoteElementDOM.date.value = NoteDate.formatForUI(note.created);
    NoteElementDOM.select.value = note.category.option;
    NoteElementDOM.content.value = note.content;
  }
}

class StorageNote {
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
        "Tomatoes, bread",
        false
      );
      this.notes.push(note);
    }
  }

  static getNotes() {
    return this.notes;
  }

  static getLastNote() {
    return this.notes.length === 0 ? 0 : this.notes[this.notes.length - 1];
  }

  static deleteNote(noteId) {
    this.notes = this.notes.filter((note) => note.id !== noteId);
  }

  static addNote(note) {
    this.notes = [...this.notes, note];
  }
}

class RenderNote {
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

  static insertToDOM(html, methodInsert, element) {
    element.insertAdjacentHTML(methodInsert, html);
  }

  listenDeleteNoteEvents() {
    Note.delete();
  }

  listenEditNoteEvents() {
    Note.edit();
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

StorageNote.generateDummyDate(5);

const renderNote = new RenderNote(StorageNote.getNotes());

renderNote.renderDefaultNotes();
renderNote.listenDeleteNoteEvents();
renderNote.toggleNoteForm();
renderNote.listenAddToNoteEvent();
renderNote.listenEditNoteEvents();
renderNote.updateNote();

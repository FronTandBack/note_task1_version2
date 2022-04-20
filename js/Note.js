class Note {
  constructor(id, title, created, category, content, archive = false) {
    this.id = id;
    this.title = title;
    this.created = created;
    this.category = category;
    this.content = this.#truncate(content, 30);
    this.archive = archive;
    this.editNote = undefined;
    this.dates = this.#validateDates(content);
    this.setArchive = this.setArchive.bind(this);

    console.log(this.dates);
  }

  #validateDates(text) {
    let dates = NoteDate.validate(text);

    if (!dates) return "";

    return dates.join(", ");
  }

  #truncate(str, n) {
    return str.length > n ? str.substr(0, n - 1) + "&hellip;" : str;
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

  setArchive() {
    this.archive = true;
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
    <div class="dates">${this.dates}</div>
    <div class="icons">
      <i class="edit-note fa fa-pencil" aria-hidden="true"></i>
      <i class="archive-note fa fa-arrow-circle-down" aria-hidden="true"></i>
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
    const id = StorageNote.getLastNoteId();
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
      });
    }
  }

  static update() {
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

  static unArchive() {
    const archiveBtn = document.querySelectorAll(".archive-note");

    for (let i = 0; i < archiveBtn.length; i++) {
      archiveBtn[i].addEventListener("click", () => {
        const noteElement = archiveBtn[i].parentNode.parentNode;
        const noteId = parseInt(noteElement.id);
        const note = StorageNote.notes.find((note) => note.id === noteId);
        RenderNote.hideElement(noteElement);

        note.setArchive();

        let archiveArr = StorageNote.notes.filter((note) => note.archive === true);
        let unArchive = StorageNote.notes.filter((note) => note.archive === false);

        const archives = this.#calcOfSummaryData(archiveArr);
        const actives = this.#calcOfSummaryData(unArchive);

        // console.log("Archive: ", archives, "Active: ", actives);

        let html = ``;
        for (let key in archives) {
          let active = actives[key] ?? 0;
          html += this.#summaryInfoTemplate(key, active, archives[key]);
        }

        RenderNote.displaySummaryTable(html);
      });
    }
  }

  static #calcOfSummaryData(arr) {
    const summary = {};
    for (let i = 0; i < arr.length; i++) {
      categories.forEach((category) => {
        if (category.type === arr[i].category.type) {
          summary[category.type] = summary[category.type] ? ++summary[category.type] : 1;
        }
      });
    }

    return summary;
  }

  static #summaryInfoTemplate(type, active, archive) {
    return `<div class="notes-present todo-note todo-note--bg" id="${type}">
        <div class="icon">
        </div>
        <div class="category">${type}</div>
        <div class="category-active">${active}</div>
        <div class="category-archived">${archive}</div>
      </div>`;
  }
}
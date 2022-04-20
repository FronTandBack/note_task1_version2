export default class NoteDate {
  constructor(date) {
    this.date = date;
  }

  static getDateForNote(date = "") {
    if (!date) {
      return new Date().toLocaleDateString("en-us", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }

    return new Date(date).toLocaleDateString("en-us", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  static validate(text) {
    const pattern = /\d{1,2}\/\d{1,2}\/\d{4}/gm;

    return text.match(pattern);
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

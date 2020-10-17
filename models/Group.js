class Group {
  constructor(title, description, members = [], selected = false) {
    this.id = null;
    this.title = title;
    this.description = description;
    this.members = members;
    this.selected = selected;
  }
}
export default Group;

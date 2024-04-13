class Template {
  constructor(id, createdAt, updatedAt, title, contents, rout, keys, typeTermination,
    numberOfComplaints,
    typesResponsibilities) {
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.title = title;
    this.contents = contents;
    this.rout = rout;
    this.keys = keys;
    this.typeTermination = typeTermination;
    this.numberOfComplaints = numberOfComplaints;
    this.typesResponsibilities = typesResponsibilities;
  }
}

export default Template;

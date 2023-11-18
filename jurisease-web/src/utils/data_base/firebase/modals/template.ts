class Template {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  doc: string;
  rout: string;
  form: string;

  constructor(
    id: string,
    createdAt: string,
    updatedAt: string,
    title: string,
    doc: string,
    rout: string,
    form: string
  ) {
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.title = title;
    this.doc = doc;
    this.rout = rout;
    this.form = form;
  }
}

export default Template;
class Service {
  id: string;
  createdAt: string;
  updatedAt: string;
  image: string;
  link: string;
  title: string;
  description: string;

  constructor(
    id: string,
    createdAt: string,
    updatedAt: string,
    image: string,
    link: string,
    title: string,
    description: string,
  ) {
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.image = image;
    this.link = link;
    this.title = title;
    this.description = description;
  }
}

export default Service;
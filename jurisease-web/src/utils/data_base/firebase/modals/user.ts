export class User {
  uid: string;
  accessToken: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string;
  phoneNumber: string;
  address: Array<string>;
  name: string;
  type: string;
  oab: string;
  acessAdmin: boolean;

  constructor(
    uid: string,
    accessToken: string,
    email: string,
    password: string,
    createdAt: string,
    updatedAt: string,
    lastLoginAt: string,
    phoneNumber: string,
    address: Array<string>,
    name: string,
    type: string,
    oab: string,
    acessAdmin: boolean,
  ) {
    this.uid = uid;
    this.accessToken = accessToken;
    this.email = email;
    this.password = password;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.lastLoginAt = lastLoginAt;
    this.phoneNumber = phoneNumber;
    this.address = address;
    this.name = name;
    this.type = type;
    this.oab = oab;
    this.acessAdmin = acessAdmin;
  }
}

export default User;
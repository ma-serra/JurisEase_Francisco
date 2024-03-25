export class User {
  constructor(
    uid,
    accessToken,
    email,
    createdAt,
    updatedAt,
    lastLoginAt,
    phoneNumber,
    address,
    name,
    type,
    oab,
    acessAdmin,
    permissions,
    state
  ) {
    this.uid = uid;
    this.accessToken = accessToken;
    this.email = email;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.lastLoginAt = lastLoginAt;
    this.phoneNumber = phoneNumber;
    this.address = address;
    this.name = name;
    this.type = type;
    this.oab = oab;
    this.acessAdmin = acessAdmin;
    this.permissions = permissions;
    this.state = state;
  }
}

export default User;

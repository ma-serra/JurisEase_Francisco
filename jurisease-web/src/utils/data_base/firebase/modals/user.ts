class Usuario {
    uid: string;
    accessToken: string;
    email: string;
    password: string; 
    createdAt: string;
    lastLoginAt: string;
    phoneNumber: string;
    address: string;
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
      lastLoginAt: string,
      phoneNumber: string,
      address: string,
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
      this.lastLoginAt = lastLoginAt;
      this.phoneNumber = phoneNumber;
      this.address = address;
      this.name = name;
      this.type = type;
      this.oab = oab;
      this.acessAdmin = acessAdmin;
    }
  }
  
  export default Usuario;
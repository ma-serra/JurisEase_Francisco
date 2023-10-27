class Usuario {
    uid: string;
    accessToken: string;
    email: string;
    password: string; 
    metadata: {
      creationTime: string;
      lastSignInTime: string;
    };
    phoneNumber: string;
    address: string;
    name: string;
  
    constructor(
      uid: string,
      accessToken: string,
      email: string,
      password: string,
      metadata: { creationTime: string, lastSignInTime: string },
      phoneNumber: string,
      address: string,
      name: string
    ) {
      this.uid = uid;
      this.accessToken = accessToken;
      this.email = email;
      this.password = password;
      this.metadata = metadata;
      this.phoneNumber = phoneNumber;
      this.address = address;
      this.name = name;
    }
  }
  
  export default Usuario;
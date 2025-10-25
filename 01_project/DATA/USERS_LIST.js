const USER_LIST = [];

// DEPRECTAED NOW USING MONGOOSE

class User {
  constructor(username, email, dob, password, role = "user") {
    this.username = username;
    this.email = email;
    this.password = password;
    this.dob = dob;
    this.role = role;
  }

  static CreateNewUser({ username, email, dob, password, role }) {
    const user = new User(username, email, dob, password, role);
    USER_LIST.push(user);
    return user;
  }

  static findUserByUsername(username) {
    return USER_LIST.find((user) => user.username == username);
  }
  static findUserByEmail(email) {
    return USER_LIST.find((user) => user.email == email);
  }

  static getPasswordByUsernameAndEmail(username, email) {
    const user = USER_LIST.find(
      (user) => user.username === username && user.email === email
    );
    return user ? user.password : null;
  }

  static getAllUser() {
    return USER_LIST;
  }
}

module.exports = { USER_LIST, User };

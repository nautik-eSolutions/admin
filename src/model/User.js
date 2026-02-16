export default class User {
  constructor(userName, id) {
    this.userName=userName;
    this.id = id
  }

  static fromJson(json) {
    return new User(
      json.userName,
      json.id
    )
  }
}

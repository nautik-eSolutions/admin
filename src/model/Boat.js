export class Boat {
  constructor(name, registryNumber, length, beam, draft, boatType, user) {
    this.name = name;
    this.registryNumber = registryNumber;
    this.length = length;
    this.beam = beam;
    this.draft = draft;
    this.boatType = boatType
    this.user = user;
  }

  static fromJson(json) {
    return new Boat(
      json.name,
      json.registryNumber,
      json.length,
      json.beam,
      json.draft,
      json.boatType,
      json.user

    );
  }
}

export class Boat {
  constructor(name, registryNumber, length, beam, draft, id, boatType, user) {
    this.name = name;
    this.registryNumber = registryNumber;
    this.length = length;
    this.beam = beam;
    this.draft = draft;
    this.id = id;
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
      json.id,
      json.boatType,
      json.user

    );
  }
}

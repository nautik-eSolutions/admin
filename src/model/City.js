export class City {
  constructor(id, name, communityName) {
    this.id = id;
    this.name = name;
    this.communityName = communityName;
  }


  static fromJson(json) {
    return new City(
      json.id,
      json.name,
      json.communityName,

    );
  }
}

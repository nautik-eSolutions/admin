export class ZoneCreate {
  constructor(name, description) {
    this.name = name;
    this.description = description;
  }

  static fromJson(json) {
    return new ZoneCreate(
      json.name,
      json.description,
    );
  }
}

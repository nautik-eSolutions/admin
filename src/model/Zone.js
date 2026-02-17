export class Zone {
  constructor(id, name, description) {
    this.id = id;
    this.name = name;
    this.description = description;
    this._moorings = null;
  }

  static fromJson(json) {
    return new Zone(
      json.id,
      json.name,
      json.description,
    );
  }


  setMoorings(value) {
    this._moorings = value;
  }
}

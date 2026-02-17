export class Mooring {
  constructor(id, number, length, beam) {
    this.id = id;
    this.number = number;
    this.length = length;
    this.beam = beam;
  }

  static fromJson(json) {
    return new Mooring(
      json.id,
      json.number,
      json.mooringCategory.dimensions.maxLength,
      json.mooringCategory.dimensions.maxBeam,

    );
  }
}

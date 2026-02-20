export class Mooring {
  constructor(id, number, length, beam,draft) {
    this.id = id;
    this.number = number;
    this.length = length;
    this.draft =draft;
    this.beam = beam;
  }

  static fromJson(json) {
    return new Mooring(
      json.id,
      json.number,
      json.mooringCategory.dimensions.maxLength,
      json.mooringCategory.dimensions.maxBeam,
      json.mooringCategory.dimensions.maxDraft
    );
  }
}

export class Dimensions {
  constructor(id,length, beam, draft, name) {
    this.id = id;
    this.maxLength = length;
    this.maxBeam = beam;
    this.maxDraft = draft;
    this.name = name;
  }

  static fromJson(json) {
    return new Dimensions(
      json.id,
      json.maxLength,
      json.maxBeam,
      json.maxDraft,
      json.name
    );
  }

  toString() {
    return this.length+"m X "+this.bream+"m X "+this.draft+"m ";
  }

}

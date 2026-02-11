export class Dimensions {
  constructor(id,length, bream, draft) {
    this.id = id;
    this.length = length;
    this.bream = bream;
    this.draft = draft;

  }

  static fromJson(json) {
    return new Dimensions(
      json.id,
      json.maxLength,
      json.maxBeam,
      json.maxDraft
    );
  }

  toString() {
    return this.length+"m X "+this.bream+"m X "+this.draft+"m ";
  }

}

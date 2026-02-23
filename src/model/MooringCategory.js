export class MooringCategory {
  constructor({dimensionsId, id,minPricePerDay, zoneId ,name }) {
    this.id = id
    this.zoneId = zoneId
    this.dimensionsId = dimensionsId
    this.minPricePerDay = minPricePerDay
    this.name = name
  }

  static fromJson(json) {
    return new MooringCategory({
      dimensionsId: json.dimensionsId,
      id: json.id,
      minPricePerDay: json.minPricePerDay,
      zoneId: json.zoneId,
      name:json.name
    })
  }
}

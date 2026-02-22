export class MooringCategory {
  constructor({ id, zoneId, dimensionsId, basePricePerDay }) {
    this.id = id
    this.zoneId = zoneId
    this.dimensionsId = dimensionsId
    this.basePricePerDay = basePricePerDay
  }

  static fromJson(json) {
    return new MooringCategory({
      id: json.id,
      zoneId: json.zone.id,
      dimensionsId: json.dimensions.id,
      basePricePerDay: json.basePricePerDay,
    })
  }
}

export class MooringCategory {
  constructor({dimensionsId, id,minPricePerDay, zoneId ,name ,priceConfigurations}) {
    this.id = id
    this.zoneId = zoneId
    this.dimensionsId = dimensionsId
    this.minPricePerDay = minPricePerDay
    this.priceConfigurations=priceConfigurations
    this.name = name
  }

  static fromJson(json) {
    return new MooringCategory({
      dimensionsId: json.dimensionsId,
      id: json.id,
      minPricePerDay: json.minPricePerDay,
      zoneId: json.zoneId,
      priceConfigurations:json.priceConfigurations,
      name:json.name
    })
  }
}

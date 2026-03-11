export class MooringCategoryInfo {
  constructor({ id,name ,zonePortName, zoneName, dimensionsMaxBeam, dimensionsMaxLength, dimensionsMaxDraft, minPricePerDay, dimensions ,priceConfigurations}) {
    this.id = id
    this.name = name
    this.zonePortName = zonePortName
    this.zoneName = zoneName
    this.dimensionsMaxBeam = dimensionsMaxBeam
    this.dimensionsMaxLength = dimensionsMaxLength
    this.dimensionsMaxDraft = dimensionsMaxDraft
    this.minPricePerDay = minPricePerDay
    this.dimensions = dimensions
    this.priceConfigurations =priceConfigurations
  }

  static fromJson(json) {
    return new MooringCategoryInfo({
      id: json.id,
      name: json.name,
      zonePortName: json.zonePortName,
      zoneName: json.zoneName,
      dimensionsMaxBeam: json.dimensionsMaxBeam,
      dimensionsMaxLength: json.dimensionsMaxLength,
      dimensionsMaxDraft: json.dimensionsMaxDraft,
      minPricePerDay: json.minPricePerDay,
      dimensions: json.dimensions ?? null,
      priceConfigurations:json.priceConfigurations ?? null
    })
  }
}

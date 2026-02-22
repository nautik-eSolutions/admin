export class PriceConfiguration {
  constructor({id, startDate, endDate, minPricePerDay, name}) {
    this.id = id
    this.minPricePerDay = minPricePerDay
    this.startDate = startDate
    this.endDate = endDate
    this.name =  name
  }

  static fromJson(json) {
    return new PriceConfiguration({
      id: json.id,
      minPricePerDay: json.minPricePerDay,
      startDate: json.startDate,
      endDate: json.endDate,
      name:json.name
    })
  }
}

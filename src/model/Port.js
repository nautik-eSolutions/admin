export class Port {
  constructor(id, name, cityName, companyName) {
    this.id = id;
    this.name = name;
    this.cityName = cityName;
    this.companyName = companyName;
  }

   static fromJson(json) {
    return new Port(
      json.id,
      json.name,
      json.cityName,
      json.companyName,);
  }
}

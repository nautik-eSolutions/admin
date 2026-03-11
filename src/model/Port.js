export class Port {
  constructor(
    id,
    name,
    cityName,
    companyName,
    vhfChannel,
    maxBoatLength,
    maxBoatBeam,
    maxBoatDraft,
    totalMoorings,
    fuelStation,
    travelLift,
    crane,
    lon,
    lat,
    phoneNumber,
    email,
    openingHours
  ) {
    this.id = id;
    this.name = name;
    this.cityName = cityName;
    this.companyName = companyName;
    this.vhfChannel = vhfChannel;
    this.maxBoatLength = maxBoatLength;
    this.maxBoatBeam = maxBoatBeam;
    this.maxBoatDraft = maxBoatDraft;
    this.totalMoorings = totalMoorings;
    this.fuelStation = fuelStation;
    this.travelLift = travelLift;
    this.crane = crane;
    this.lon = lon;
    this.lat = lat;
    this.phoneNumber = phoneNumber;
    this.email = email;
    this.openingHours = openingHours;
  }

  static fromJson(json) {
    return new Port(
      json.id,
      json.name,
      json.cityName,
      json.companyName,
      json.vhfChannel,
      json.maxBoatLength,
      json.maxBoatBeam,
      json.maxBoatDraft,
      json.totalMoorings,
      json.fuelStation,
      json.travelLift,
      json.crane,
      json.lon,
      json.lat,
      json.phoneNumber,
      json.email,
      json.openingHours
    );
  }
}

export class Booking{

  constructor(id, startDate, endDate,boatId, boatName,boatRegistryNumber, clientName, clientEmail, bookingStatus, mooringNumber, mooringId){
    this.id = id;
    this.startDate=startDate;
    this.endDate= endDate;
    this.boatId = boatId;
    this.boatName = boatName;
    this.boatRegistryNumber = boatRegistryNumber;
    this.clientName = clientName;
    this.clientEmail = clientEmail;
    this.bookingStatus = bookingStatus;
    this.mooringNumber = mooringNumber;
    this.mooringId = mooringId;
  }
  static fromJson(json) {
    return new Booking(
      json.id,
      json.startDate,
      json.endDate,
      json.boatId,
      json.boatName,
      json.boatRegistryNumber,
      json.clientName,
      json.clientEmail,
      json.bookingStatus,
      json.mooring.number,
      json.mooring.id
    )
  }
}

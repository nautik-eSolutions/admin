export class Booking{

  constructor(id, startDate, endDate,boatId, bookingStatusId, mooringNumber, mooringId){
    this.id = id;
    this.startDate=startDate;
    this.endDate= endDate;
    this.boatId = boatId;
    this.bookingStatusId = bookingStatusId;
    this.mooringNumber = mooringNumber;
    this.mooringId = mooringId;
  }
}

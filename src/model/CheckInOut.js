export class CheckInOut {
  constructor(id, guestName, boatName, mooringNumber, scheduledTime, actualTime, hasArrived, reservationId, checkType) {
    this.id = id;
    this.guestName = guestName;
    this.boatName = boatName;
    this.mooringNumber = mooringNumber;
    this.scheduledTime = scheduledTime;
    this.actualTime = actualTime;
    this.hasArrived = hasArrived;
    this.reservationId = reservationId;
    this.checkType = checkType;
  }

  static fromJson(json) {
    return new CheckInOut(json.id,
      json.guestName, json.boatName,
      json.mooringNumber,
      json.scheduledTime, json.actualTime,
      json.hasArrived ?? false,
      json.reservationId, json.checkType);
  }

  toJson() {
    return {
      id: this.id,
      guestName: this.guestName,
      boatName: this.boatName,
      mooringNumber: this.mooringNumber,
      scheduledTime: this.scheduledTime,
      actualTime: this.actualTime,
      hasArrived: this.hasArrived,
      reservationId: this.reservationId,
      checkType: this.checkType
    };
  }
}

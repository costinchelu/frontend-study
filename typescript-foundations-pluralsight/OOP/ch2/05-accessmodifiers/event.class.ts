export class Event {
  
  //public readonly date: Date;
  private date: Date;
  protected title: string;
  protected venue: string;

  constructor() {
    this.date = new Date();
  }

}

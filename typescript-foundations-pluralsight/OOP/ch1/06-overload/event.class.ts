export class Event {
  title: string;
  date: Date;

  constructor(t: string);
  constructor(d: Date, t: string);
  constructor(td: string | Date, t: string = '') {
    this.title = (typeof(td) === 'string') ? td : t;
    this.date = (td instanceof Date) ? td : new Date();
  }
}

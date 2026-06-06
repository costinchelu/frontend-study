export class Event {
  
  date: Date;
  title: string;
  venue: string;

  toDisplayName(): string {
    return this.title;
  }
  
}

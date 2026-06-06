import { Event } from './event.class';


export class Concert extends Event {
  
  private artist: string;

  constructor(artist: string, venue: string) {
    super();

    this.artist = artist;
    this.venue = venue;
  }

}

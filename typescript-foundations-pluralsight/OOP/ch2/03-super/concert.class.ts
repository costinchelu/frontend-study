import { Event } from './event.class';


export class Concert extends Event {
  
  artist: string;

  constructor(artist: string) {
    super();

    this.artist = artist;
  }
  
}

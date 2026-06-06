import { Event } from './event.class';


export class Concert extends Event {
  
  artist: string;

  toDisplayName(): string {
    if (this.artist === '' || 
        this.artist === undefined) {
      return super.toDisplayName();
    } else {
      return this.artist + ' @ ' +
             this.venue;
    }
  }
  
}

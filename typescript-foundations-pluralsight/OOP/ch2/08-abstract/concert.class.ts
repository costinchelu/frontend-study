import { Event } from './event.class';

export class Concert extends Event {
  
  cancel(): boolean {
    const displayName: string = this.toDisplayName();
    console.error(`Concert tickets for "${displayName}" are non-refundable!`);
    return false;
  }

}

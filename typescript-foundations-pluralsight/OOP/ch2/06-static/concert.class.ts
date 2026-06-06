import { Event } from './event.class';
import { EventType } from './eventtype.enum';

export class Concert extends Event {
  
  static readonly type: EventType = EventType.Concert;

}

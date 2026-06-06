import { IEvent } from './ievent.class';

export class Concert implements IEvent {
  
  cancel(): boolean {
    console.error('Concert tickets are non-refundable!');
    return false;
  }

}

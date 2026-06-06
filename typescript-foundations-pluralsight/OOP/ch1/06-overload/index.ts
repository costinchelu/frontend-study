import { Event } from './event.class';

let events:Event[] = [];

events.push(new Event('Digital Cowboys'));

events.push(new Event(new Date(2027, 5, 13), 'Container Enthusiasm'));

events.forEach(event => 
    console.log(`${event.title} @ ${event.date.toDateString()}`));

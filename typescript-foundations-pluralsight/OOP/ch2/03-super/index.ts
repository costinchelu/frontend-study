import { Concert } from './concert.class';

const concert = new Concert('Digital Cowboys');

concert.venue = 'Pluralsight Arena';

console.log(concert.artist, '@', concert.venue);
import { Concert } from './concert.class';

const concert = new Concert();

concert.title = 'Pluralsight Summit';
//concert.artist = 'Digital Cowboys';
concert.venue = 'Pluralsight Arena';

console.log(concert.toDisplayName());
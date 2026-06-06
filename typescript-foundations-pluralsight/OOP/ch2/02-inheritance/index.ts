import { Concert } from './concert.class';

const concert = new Concert();

concert.artist = 'Network Firewall Squad';
concert.venue = 'Olympic Stadium';

console.log(concert.artist, '@', concert.venue);
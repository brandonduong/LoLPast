import http from '../http-common'

class DataService {
    getCoincidingMatches(data) {
        let link = '/getcoincidingmatches/?'
        const players = data.players;
        console.log(players);
        let playerNum = 1;
        for (let i in players) {
            console.log(i);
            if (players[i]) {
                link += `player${playerNum}=${players[i]}`;
            }
            playerNum += 1;
            if (players[`player${playerNum}`]) {
                link += '&';
            }
        }
        return http.get(link);
    }
}

export default new DataService();

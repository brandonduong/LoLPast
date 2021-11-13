import http from '../http-common'

class DataService {
    getCoincidingMatches(data) {
        let link = '/getcoincidingmatches/?'
        const players = data.players;
        const region = data.region;
        console.log(players);
        let playerNum = 1;
        for (let i in players) {
            console.log(i);
            if (players[i]) {
                link += `player${playerNum}=${players[i]}`;
            }
            playerNum += 1;
            link += '&';
        }

        // Add region to queryStringParameters
        link += `region=${region}`;
        return http.get(link);
    }

    getMatchDetails(data) {
        let link = `/getmatchdetails/?matchId=${data.matchId}`

        return http.get(link);
    }

    getPatch() {
        const patchUrl = 'https://ddragon.leagueoflegends.com/api/versions.json'
        return http.get(patchUrl);
    }
}

export default new DataService();

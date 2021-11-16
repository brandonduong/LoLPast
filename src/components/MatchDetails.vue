<template>
  <div
    v-if="!loading"
    style="width: 99%"
  >
    <div class="row">
      <div class="col">
        {{ new Date(matchInfo['gameCreation']).toDateString() }}
      </div>
      <div class="col">
        {{ getQueueType(matchInfo['queueId']) }}
      </div>
      <div class="col">
        <!-- By riot api, if no gameEndTimeStamp, treat as seconds, else, as ms-->
        <span v-if="matchInfo['gameEndTimestamp']">
          {{ Math.floor(matchInfo['gameDuration'] / 60) }}m
          {{ matchInfo['gameDuration'] - (Math.floor(matchInfo['gameDuration'] / 60)) * 60 }}s
        </span>
        <span v-else>
          {{ Math.floor(matchInfo['gameDuration'] / 60 / 1000) }}m
          {{ Math.floor((matchInfo['gameDuration'] / 1000) - ((Math.floor(matchInfo['gameDuration'] / 60 / 1000))) * 60) }}s
        </span>
      </div>
    </div>

    <div>
      <!-- Blue team headers -->
      <div
        class="row headers flex-nowrap"
        style="color: cornflowerblue"
      >
        <div
          class="col champion"
          style="margin-left: 27px"
        />
        <div
          class="col-2 player-name"
          style="text-align: start"
        >
          Blue Team <div
            v-if="getVictor()"
            style="display: inline-block"
          >
            (Victory)
          </div>
          <div
            v-else
            style="display: inline-block"
          >
            (Defeat)
          </div>
        </div>
        <div class="col-2 kda">
          KDA
        </div>
        <div class="col-1 cs">
          CS
        </div>
        <div class="col-2 damage">
          Damage
        </div>
        <div class="col-2 role">
          Role
        </div>
        <div class="col-2 gold">
          Gold
        </div>
      </div>

      <!-- Blue team info -->
      <div
        v-for="(playerId, index) in allPlayerIds"
        :key="playerId + index"
      >
        <div
          v-if="getPlayerIdIndex(playerId) < 5"
          class="row flex-nowrap"
        >
          <div class="col champion">
            <div class="row">
              <div class="col-6">
                <div>
                  <img
                    :src="getChampIcon(playerId)"
                    :alt="matchInfo.info"
                    width="27"
                    height="27"
                    style="border-radius: 50%;"
                  >
                </div>
              </div>
              <div class="col-6">
                <span
                  class="badge border border-light rounded-circle bg-dark p-1 level"
                >{{ getChampLevel(playerId) }}
                </span>
              </div>
            </div>
          </div>
          <div
            class="col-2 player-name"
            style="text-align:start"
          >
            <a
              data-bs-container="body"
              data-bs-toggle="popover"
              data-bs-placement="right"
              data-bs-trigger="hover"
              :data-bs-content="index"
            >
              <small v-if="unsearchedPlayerIds.includes(playerId)">Player {{ index.slice(6) }}</small>
              <small
                v-else
                class="searched"
              ><em>{{ index }}</em></small>
            </a>
          </div>
          <div class="col-2 kda">
            {{ getKDA(playerId) }}
          </div>
          <div class="col-1 cs">
            {{ getCS(playerId) }}
          </div>
          <div class="col-2 damage">
            {{ getDamageDealtToChampions(playerId) }}
          </div>
          <div class="col-2 role">
            {{ getTeamPosition(playerId) }}
          </div>
          <div class="col-2 gold">
            {{ getGold(playerId) }}
          </div>
        </div>
      </div>
    </div>

    <div>
      <!-- Red team headers -->
      <div
        class="row headers flex-nowrap"
        style="color: indianred"
      >
        <div
          class="col champion"
          style="margin-left: 27px"
        />
        <div
          class="col-2 player-name"
          style="text-align: start"
        >
          Red Team <div
            v-if="!getVictor()"
            style="display: inline-block"
          >
            (Victory)
          </div>
          <div
            v-else
            style="display: inline-block"
          >
            (Defeat)
          </div>
        </div>
        <div class="col-2 kda">
          KDA
        </div>
        <div class="col-1 cs">
          CS
        </div>
        <div class="col-2 damage">
          Damage
        </div>
        <div class="col-2 role">
          Role
        </div>
        <div class="col-2 gold">
          Gold
        </div>
      </div>

      <!-- Red team info -->
      <div
        v-for="(playerId, index) in allPlayerIds"
        :key="playerId + index"
      >
        <div
          v-if="getPlayerIdIndex(playerId) >= 5"
          class="row flex-nowrap"
        >
          <div class="col champion">
            <div class="row">
              <div class="col-6">
                <div>
                  <img
                    :src="getChampIcon(playerId)"
                    :alt="matchInfo.info"
                    width="27"
                    height="27"
                    style="border-radius: 50%;"
                  >
                </div>
              </div>
              <div class="col-6">
                <span
                  class="badge border border-light rounded-circle bg-dark p-1 level"
                >{{ getChampLevel(playerId) }}
                </span>
              </div>
            </div>
          </div>
          <div
            class="col-2 player-name"
            style="text-align:start"
          >
            <a
              data-bs-container="body"
              data-bs-toggle="popover"
              data-bs-placement="right"
              data-bs-trigger="hover"
              :data-bs-content="index"
            >
              <small v-if="unsearchedPlayerIds.includes(playerId)">Player {{ index.slice(6) }}</small>
              <small
                v-else
                class="searched"
              ><em>{{ index }}</em></small>
            </a>
          </div>
          <div class="col-2 kda">
            {{ getKDA(playerId) }}
          </div>
          <div class="col-1 cs">
            {{ getCS(playerId) }}
          </div>
          <div class="col-2 damage">
            {{ getDamageDealtToChampions(playerId) }}
          </div>
          <div class="col-2 role">
            {{ getTeamPosition(playerId) }}
          </div>
          <div class="col-2 gold">
            {{ getGold(playerId) }}
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="loading">
    <div class="card loading-card border-0">
      <div
        class="spinner-border"
        role="status"
      >
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  </div>
</template>

<script>
import { Popover } from 'bootstrap/dist/js/bootstrap.esm.min.js'
import DataService from "../services/DataService";

export default {
  name: "MatchDetails",
  props: {
    playerNames: {
      default: () => {return {}},
      type: Object
    },
    playerIds: {
      default: () => {return {}},
      type: Object
    },
    patch: {
      default: () => {return ''},
      type: String
    },
    matchId: {
      default: () => {return ''},
      type: String
    },
  },
  data() {
    return {
      playerIndex: {},
      allPlayerIds: {},
      unsearchedPlayerIds: [],
      matchMetadata: {},
      matchInfo: {},
      loading: true
    };
  },
  mounted() {
    // Initialize data
    const data = {
      matchId: this.matchId
    };
    DataService.getMatchDetails(data)
        .then(response => {
          // Set all needed data
          console.log(response.data);
          this.matchMetadata = JSON.parse(response.data).metadata;
          this.matchInfo = JSON.parse(response.data).info;
          console.log(this.matchMetadata);
          console.log(this.matchInfo);
          this.loading = false;

          // Initialize Popover
          Array.from(document.querySelectorAll('[data-bs-toggle="popover"]'))
              .forEach(popoverNode => new Popover(popoverNode))

          // Initialize all player ids
          let currentPlayerTotal = Object.keys(this.playerIds).length;

          this.matchMetadata['participants'].forEach((participantId) => {
            if (!Object.values(this.playerIds).includes(participantId)) {
              this.unsearchedPlayerIds.push(participantId);
              this.allPlayerIds[`player${currentPlayerTotal + 1}`] = participantId;
              currentPlayerTotal += 1;
            } else {
              let correspondingName = '';
              Object.keys(this.playerIds).forEach((playerName) => {
                if (this.playerIds[playerName] === participantId) {
                  this.allPlayerIds[playerName] = participantId;
                }
              })
            }
          });
          console.log(this.allPlayerIds);
        })
        .catch(e => {
          console.log(e);
        });
  },
  methods: {
    getPlayerIdIndex(playerId) {
      return Object.values(this.matchMetadata['participants']).indexOf(playerId)
    },
    getChampIcon(playerId) {
      const baseUrl = `https://ddragon.leagueoflegends.com/cdn/${this.patch}/img/champion/`;
      return baseUrl + `${this.matchInfo['participants'][this.getPlayerIdIndex(playerId)]['championName']}.png`
    },
    getKDA(playerId) {
      const kills = this.matchInfo['participants'][this.getPlayerIdIndex(playerId)]['kills'];
      const deaths = this.matchInfo['participants'][this.getPlayerIdIndex(playerId)]['deaths'];
      const assists = this.matchInfo['participants'][this.getPlayerIdIndex(playerId)]['assists'];
      return `${kills}/${deaths}/${assists}`
    },
    getCS(playerId) {
      const minions = this.matchInfo['participants'][this.getPlayerIdIndex(playerId)]['totalMinionsKilled'];
      const neutral = this.matchInfo['participants'][this.getPlayerIdIndex(playerId)]['neutralMinionsKilled'];
      return minions + neutral
    },
    getDamageDealtToChampions(playerId) {
      return this.matchInfo['participants'][this.getPlayerIdIndex(playerId)]['totalDamageDealtToChampions'];
    },
    getTeamPosition(playerId) {
      const teamPosition = this.matchInfo['participants'][this.getPlayerIdIndex(playerId)]['teamPosition'];
      if (teamPosition === 'UTILITY') {
        return 'SUPPORT';
      }
      return teamPosition;
    },
    getGold(playerId) {
      return this.matchInfo['participants'][this.getPlayerIdIndex(playerId)]['goldEarned'];
    },
    getChampLevel(playerId) {
      return this.matchInfo['participants'][this.getPlayerIdIndex(playerId)]['champLevel'];
    },
    isBlueTeamPresent(playerNames) {
      let present = false;
      Object.values(playerNames).forEach((playerName) => {
        present = present || (this.getPlayerIdIndex(this.playerIds[encodeURIComponent(playerName)]) < 5);
      })
      return present;
    },
    isRedTeamPresent(playerNames) {
      let present = false;
      Object.values(playerNames).forEach((playerName) => {
        present = present || (this.getPlayerIdIndex(this.playerIds[encodeURIComponent(playerName)]) >= 5);
      })
      return present;
    },
    getVictor() {
      return this.matchInfo['teams'][0]['win'] // Whether or not blue team won
    },
    getQueueType(queueId) {
      switch (queueId) {
        case 400:
          return 'NORMAL';
        case 420:
          return 'RANKED SOLO/DUO'
        case 440:
          return '5v5 FLEX';
        case 450:
          return 'ARAM';
        case 900:
          return 'URF';

        default:
          return queueId;
      }
    }
  }
}
</script>

<style>
.player-name {
  min-width: 175px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.headers {
  font-weight: bold;
  white-space: nowrap;
}

.kda {
  min-width: 100px;
  white-space: nowrap;
}

.cs {
  min-width: 100px;
  white-space: nowrap;
}

.damage {
  min-width: 100px;
  white-space: nowrap;
}

.role {
  min-width: 100px;
  white-space: nowrap;
}

.gold {
  min-width: 100px;
  white-space: nowrap;
}

.level {
  font-size:10px;
  opacity: 75%;
  width: 21px;
  height: 21px;
}

.searched {
  font-weight: bold;
}
</style>

<template>
  <div>
    <h2
      style="font-weight: bolder; margin-bottom: -6px"
    >
      {{ coincidingMatches.length }} Matches Found
    </h2>
    <small>with
    </small>
    <small style="font-size: 20px; display: block; margin-top: -8px; margin-bottom: -8px">
      <em>
        {{ Object.values(playerNames).join(', ') }}
      </em>
    </small>
  </div>

  <hr>
  <WinrateHeader
    v-if="Object.keys(winrates).length > 0"
    :winrates="winrates"
  />

  <div class="d-grid get-all-matches">
    <div
      v-if="!openingAll && canGetAllMatches()"
      class="btn btn-success"
      @click="getAllMatchDetails()"
    >
      Open All
    </div>
    <div
      v-else-if="openingAll && canGetAllMatches()"
      class="btn btn-danger"
      @click="cancelOpeningAll()"
    >
      Cancel
    </div>
    <div
      v-else-if="!canGetAllMatches()"
      class="btn btn-dark disabled"
    >
      No Matches Left
    </div>
  </div>

  <div
    v-for="(match, index) in coincidingMatches"
    :key="index"
  >
    <div
      class="list-group-item match"
      :style="getStyleForMatchId(match)"
      :data-bs-target="'#collapseTarget'+match"
      data-bs-toggle="collapse"
      @click="getMatchDetails(match)"
    >
      <span style="font-weight: bold;">Match {{ index + 1 }}:</span> {{ match }}
    </div>
    <div
      v-if="matchDetails.includes(match)"
      :id="'collapseTarget'+match"
      class="collapse show py-2 match-details"
    >
      <MatchDetails
        :id="'match-'+match"
        :player-names="playerNames"
        :player-ids="playerIds"
        :patch="patch"
        :match-id="match"
        @fail="handleFailGetMatchDetails"
        @add-winrate="addWinrate"
      />
    </div>
  </div>
</template>

<script>
import DataService from "../services/DataService";
import MatchDetails from "./MatchDetails";
import WinrateHeader from "./WinrateHeader";

export default {
  name: "CoincidingMatches",
  components: {
    WinrateHeader,
    MatchDetails
  },
  props: {
    coincidingMatches: {
      default: () => {return []},
      type: Array
    },
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
    }
  },
  data() {
    return {
      matchDetails: [],
      openingAll: false,
      timers: [],
      lastAutoOpened: 0,
      winrates: {
        /*
        "Qitong": {
          "The Tank Man": {
            "wins": 10,
            "losses": 17
          },
          "The Tank Man2": {
            "wins": 10,
            "losses": 17
          },
          "The Tank Man3": {
            "wins": 10,
            "losses": 17
          },
        },
        "Qitong, Tupy": {
          "The Tank Man, Qitong, Tupy, Qitong, Tupy": {
            "wins": 10,
            "losses": 17
          },
        },
        "The Tank Man": {
          "": {
            "wins": 10,
            "losses": 17
          },
        },
        */
      }
    };
  },
  methods: {
    getMatchDetails(matchId) {
      if (!this.matchDetails.includes(matchId)) {
        this.matchDetails.push(matchId);
      }
    },
    getStyleForMatchId(matchId) {
      if (this.matchDetails.includes(matchId)) {
        return {
          "background-color": '#819de7'
        }
      }
      return {
        "background-color": '#8080ad'
      }
    },
    getAllMatchDetails() {
      // Only check if there are matches available to check
      if (this.canGetAllMatches()) {
        this.openingAll = true;
      }

      // Get upper most manually opened match
      this.coincidingMatches.some((match, index) => {
        if (this.matchDetails.includes(match)) {
          this.lastAutoOpened = index;
        } else {
          return true; // Short circuit .some
        }
      })

      // 1 call per second
      const interval = 1000 // How much time between 2 iterations
      for (let i = this.lastAutoOpened; i < this.coincidingMatches.length; i += 1) {
        this.timers.push(setTimeout(() => {
          if (!this.matchDetails.includes(this.coincidingMatches[i])) {
            this.getMatchDetails(this.coincidingMatches[i]);
          }
          this.lastAutoOpened = i;

          // Check if done
          if (this.lastAutoOpened === this.coincidingMatches.length - 1) {
            this.lastAutoOpened = i + 1;
            this.openingAll = false;
          }
        }, (i - this.lastAutoOpened) * interval))
      }
    },
    canGetAllMatches() {
      console.log(this.lastAutoOpened === this.coincidingMatches.length)
      return !(this.lastAutoOpened === this.coincidingMatches.length)
    },
    cancelOpeningAll() {
      this.openingAll = false;
      this.timers.forEach(id => clearTimeout(id));
    },
    handleFailGetMatchDetails(matchId) {
      console.log(matchId)
      const index = this.matchDetails.indexOf(matchId);
      if (index > -1) {
        this.matchDetails.splice(index, 1);
      }
    },
    addWinrate(winTeam, loseTeam, queueType) {
      const winString = decodeURIComponent(winTeam.join(', '));
      const loseString = decodeURIComponent(loseTeam.join(', '));
      console.log(winString, loseString);

      // If team is not recorded yet
      if (!this.winrates[winString] && !this.winrates[loseString]) {
        // Initialize team data
        if (!winTeam.length) {
          this.winrates[loseString] = {};
          this.winrates[loseString][winString] = {};
          this.winrates[loseString][winString][queueType] = {};
          this.winrates[loseString][winString][queueType]['wins'] = 0;
          this.winrates[loseString][winString][queueType]['losses'] = 1;
        } else if (!loseTeam.length) {
          this.winrates[winString] = {};
          this.winrates[winString][loseString] = {};
          this.winrates[winString][loseString][queueType] = {};
          this.winrates[winString][loseString][queueType]['wins'] = 1;
          this.winrates[winString][loseString][queueType]['losses'] = 0;
        } else {
          this.winrates[winString] = {};
          this.winrates[winString][loseString] = {};
          this.winrates[winString][loseString][queueType] = {};
          this.winrates[winString][loseString][queueType]['wins'] = 1;
          this.winrates[winString][loseString][queueType]['losses'] = 0;
        }
      } else if (this.winrates[winString]) {
        if (this.winrates[winString][loseString][queueType]) {
          this.winrates[winString][loseString][queueType]['wins'] += 1;
        } else {
          // Initialize queue type
          this.winrates[winString][loseString][queueType] = {};
          this.winrates[winString][loseString][queueType]['wins'] = 1;
          this.winrates[winString][loseString][queueType]['losses'] = 0;
        }
      } else if (this.winrates[loseString]) {
        if (this.winrates[loseString][winString][queueType]) {
          this.winrates[loseString][winString][queueType]['losses'] += 1;
        } else {
          // Initialize queue type
          this.winrates[loseString][winString][queueType] = {};
          this.winrates[loseString][winString][queueType]['wins'] = 0;
          this.winrates[loseString][winString][queueType]['losses'] = 1;
        }
      }
      console.log(this.winrates);
    }
  }
}
</script>

<style>
.match-details {
  border-style: solid;
  border-width: 1px;
  border-color: #d7d7d7;
  margin-bottom: 5px;
  margin-top: -5px;
  border-top-width: 0;
  padding-left: 25px;
  overflow-x: auto;
}

.match-details::-webkit-scrollbar {
  background: #f1f1f1;
  height: 10px;
}

/* Track */
.match-details::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
.match-details::-webkit-scrollbar-thumb {
  background: #888;
}

/* Handle on hover */
.match-details::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.match-details::-webkit-scrollbar-thumb:active {
  background: #282828;
}

.match {
  cursor: pointer;
  font-size: 20px;
  margin-bottom: 5px
}

.get-all-matches {
  margin-bottom: 5px;
}
</style>

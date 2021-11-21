<template>
  <h3
    style="font-weight: bolder; margin-bottom: -6px"
  >
    {{ coincidingMatches.length }} Matches Found
  </h3>
  <small style="margin-bottom: -6px">with
  </small>
  <small style="font-size: 20px">
    <em>
      {{ Object.values(playerNames).join(', ') }}
    </em>
  </small>

  <div
    v-if="!openingAll"
    class="btn-success"
    @click="getAllMatchDetails()"
  >
    Open All
  </div>
  <div
    v-if="openingAll"
    class="btn-danger disabled"
    @click="cancelOpeningAll()"
  >
    Cancel
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
      />
    </div>
  </div>
</template>

<script>
import DataService from "../services/DataService";
import MatchDetails from "./MatchDetails";

export default {
  name: "CoincidingMatches",
  components: {
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
      this.openingAll = true;

      // 1 call per second
      const interval = 1000 // How much time between 2 iterations
      for (let i = this.lastAutoOpened; i < this.coincidingMatches.length; i += 1) {
        this.timers.push(setTimeout(() => {
          this.getMatchDetails(this.coincidingMatches[i]);
          this.lastAutoOpened = i;
        }, (i - this.lastAutoOpened) * interval))
      }
    },
    cancelOpeningAll() {
      this.openingAll = false;
      this.timers.forEach(id => clearTimeout(id));
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
</style>

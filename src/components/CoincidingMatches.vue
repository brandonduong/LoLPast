<template>
  <h3
    style="font-weight: bolder; margin-bottom: -6px"
  >
    {{ coincidingMatches.length }} Matches Found
  </h3>
  <small style="margin-bottom: -6px">with
  </small>
  <small>
    <em>
      {{ Object.values(playerNames).join(', ') }}
    </em>
  </small>

  <div
    v-for="(match, index) in coincidingMatches"
    :key="index"
  >
    <div
      class="list-group-item"
      style="margin-bottom: 5px"
      :data-bs-target="'#collapseTarget'+match"
      data-bs-toggle="collapse"
      @click="getMatchDetails(match)"
    >
      <span style="font-weight: bold">Match {{ index + 1 }}:</span> {{ match }}
    </div>
    <div
      v-if="matchDetails[match]"
      :id="'collapseTarget'+match"
      class="collapse show py-2 match-details"
    >
      <MatchDetails
        :player-names="playerNames"
        :player-ids="playerIds"
        :patch="patch"
        :match-info="JSON.parse(matchDetails[match]).info"
        :match-metadata="JSON.parse(matchDetails[match]).metadata"
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
      matchDetails: {}
    };
  },
  methods: {
    getMatchDetails(matchId) {
      if (!this.matchDetails[matchId]) {
        const data = {
          matchId
        };
        DataService.getMatchDetails(data)
            .then(response => {
              console.log(response.data);
              this.matchDetails[matchId] = response.data;
              console.log(this.matchDetails);
            })
            .catch(e => {
              console.log(e);
            });
      }
    },
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
}
</style>

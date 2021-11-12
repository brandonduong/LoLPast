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
      {{ Object.values(JSON.parse(playerNames)).join(', ') }}
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
      <div
        v-if="matchDetails[match]"
        :id="'collapseTarget'+match"
        class="collapse show py-2"
      >
        This is the toggle-able content!
        This is the toggle-able content!
        This is the toggle-able content!This is the toggle-able content!This is the toggle-able content!
        This is the toggle-able content!
        This is the toggle-able content!This is the toggle-able content!This is the toggle-able content!
        This is the toggle-able content!
        This is the toggle-able content!This is the toggle-able content!This is the toggle-able content!
        This is the toggle-able content!
        This is the toggle-able content!This is the toggle-able content!
      </div>
    </div>
  </div>
</template>

<script>
import DataService from "../services/DataService";

export default {
  name: "CoincidingMatches",
  props: {
    coincidingMatches: {
      default: () => {return []},
      type: Array
    },
    playerNames: {
      default: () => {return ''},
      type: String
    },
    playerIds: {
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
    }
  }
}
</script>

<style scoped>

</style>

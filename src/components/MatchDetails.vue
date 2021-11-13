<template>
  <div
    v-for="(playerName, index) in playerNames"
    :key="playerName + index"
    style="text-align:start;"
  >
    <img
      :src="getChampIcon(playerName)"
      :alt="matchInfo.info"
      width="25"
      height="25"
      style="border-radius: 50%"
    >
    <small>{{ playerName }}</small>
  </div>
</template>

<script>
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
    matchInfo: {
      default: () => {return {}},
      type: Object
    },
    matchMetadata: {
      default: () => {return {}},
      type: Object
    },
  },
  data() {
    return {
      playerIndex: {},
    };
  },
  created() {
  },
  methods: {
    getPlayerIdIndex(playerId) {
      return Object.values(this.matchMetadata['participants']).indexOf(playerId)
    },
    getChampIcon(playerName) {
      const baseUrl = `https://ddragon.leagueoflegends.com/cdn/${this.patch}/img/champion/`;
      return baseUrl + `${this.matchInfo['participants'][this.getPlayerIdIndex(this.playerIds[encodeURIComponent(playerName)])]['championName']}.png`
    }
  }
}
</script>

<style scoped>

</style>

<template>
  <div class="container p-1">
    <h2 style="font-weight: bold">
      Team Win Rates
    </h2>
    <div class="row">
      <div
        v-for="(rates, team) in winrates"
        class="col win-rates"
      >
        <div class="card">
          <div class="card-header h3">
            {{ team }}
          </div>
          <div
            class="card-body win-rate"
          >
            <!-- Handle win/loss against other teams -->
            <div
              v-for="(rate, opponent) in rates"
            >
              <div
                v-if="isNaN(rate)"
                class="row flex-nowrap h5"
              >
                <div class="col">
                  <b v-if="opponent">vs. {{ opponent }}</b>
                  <b v-else><em>vs. Others</em></b>
                </div>
                <div
                  class="col-2 my-auto"
                  style="min-width: 125px"
                >
                  <b>Wins:</b> {{ rate['wins'] }}
                </div>
                <div
                  class="col-3 my-auto"
                  style="min-width: 125px"
                >
                  <b>Losses:</b> {{ rate['losses'] }}
                </div>
                <div
                  class="col-4 my-auto"
                  style="min-width: 200px"
                >
                  <b>Win Rate:</b> {{ (rate['wins'] / (rate['wins'] + rate['losses']) * 100).toFixed(2) }} %
                </div>
              </div>
              <hr v-if="Object.keys(rates).indexOf(opponent) !== Object.keys(rates).length - 1">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "WinrateHeader",
  props: {
    winrates: {
      default: () => {
        return {}
      },
      type: Object
    },
  },
}
</script>

<style>
.win-rates {
  margin-bottom: 15px;
}

.card-header {
  background-color: #5a5a7c;
  color: white;
}

.win-rate {
  overflow-x: auto;
  margin-bottom: -5px;
  padding-bottom: 15px
}

.win-rate::-webkit-scrollbar {
  background: #f1f1f1;
  height: 10px;
}

/* Track */
.win-rate::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
.win-rate::-webkit-scrollbar-thumb {
  background: #888;
}

/* Handle on hover */
.win-rate::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.win-rate::-webkit-scrollbar-thumb:active {
  background: #282828;
}
</style>

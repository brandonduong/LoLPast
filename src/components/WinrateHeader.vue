<template>
  <div class="container p-1">
    <div
      style="font-weight: bold"
      class="row justify-content-end h2"
    >
      <div
        class="col-4 text-start"
      >
        <button
          class="btn btn-secondary"
          @click="$emit('new-search')"
        >
          New Search
        </button>
      </div>
      <div class="col-4">
        Team Win Rates
      </div>
      <div class="col-4 text-end">
        <input
          id="filter"
          v-model="filterByQueueType"
          type="checkbox"
          class="btn-check"
        >
        <label
          class="btn btn-outline-dark shadow-none"
          for="filter"
        >Filter By Queue</label>
      </div>
    </div>
    <div class="row">
      <div
        v-for="(rates, team) in winrates"
        :key="team + rates"
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
              :key="opponent + rate"
            >
              <div
                class="row flex-nowrap h5"
              >
                <div class="col my-auto">
                  <b v-if="opponent">vs. {{ opponent }}</b>
                  <b v-else><em>vs. Others</em></b>
                </div>
                <div class="col-10 my-auto">
                  <div
                    v-for="(winrate, queueType) in filter(rate)"
                    :key="opponent + queueType"
                    class="row flex-nowrap h5"
                    style="margin-top: 3px; margin-bottom: 3px"
                  >
                    <div
                      class="col"
                      style="min-width: 160px"
                    >
                      <b>{{ queueType }}</b>
                    </div>
                    <div
                      class="col-2"
                      style="min-width: 125px"
                    >
                      <b>Wins:</b> {{ winrate['wins'] }}
                    </div>
                    <div
                      class="col-2"
                      style="min-width: 125px"
                    >
                      <b>Losses:</b> {{ winrate['losses'] }}
                    </div>
                    <div
                      class="col-4"
                      style="min-width: 210px"
                    >
                      <b>Win Rate:</b> {{ (winrate['wins'] / (winrate['wins'] + winrate['losses']) * 100).toFixed(2) }} %
                    </div>
                  </div>
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
emits: ['new-search'],
  data() {
    return {
      filterByQueueType: false
    }
  },
  methods: {
    filter(rate) {
      if (this.filterByQueueType) {
        return rate;
      } else {
        const filtered = {"OVERALL": { "wins": 0, "losses": 0 }}
        Object.keys(rate).forEach((queueType) => {
          filtered['OVERALL']['wins'] += rate[queueType]['wins'];
          filtered['OVERALL']['losses'] += rate[queueType]['losses'];
        })
        return filtered;
      }
    }
  }
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

.btn-outline-dark {
  border-color: #5a5a7c;
}

.btn-outline-dark:hover, .btn-check:checked+.btn-outline-dark {
  background-color: #5a5a7c !important;
}
</style>

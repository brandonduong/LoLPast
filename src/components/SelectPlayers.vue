<template>
  <div>
    <div
      v-if="!submitted && !loading"
      class="submit-form"
    >
      <div class="form-group card summoner-input">
        <h3
          style="font-weight: bolder"
        >
          Summoner Names
        </h3>
        <div
          v-for="(player, index) in players"
          :key="index"
        >
          <input
            id="{{index}}"
            v-model="players[index]"
            type="text"
            class="form-control summoner-item"
            name="{{index}}"
            :placeholder="'Summoner ' + index.slice(6)"
          >
        </div>
        <div
          class="add-remove-buttons"
          style="text-align:end"
        >
          <button
            v-if="Object.keys(players).length < 10"
            class="btn btn-success add-remove-button shadow-none"
            @click="addPlayer"
          >
            +
          </button>
          <button
            v-if="Object.keys(players).length > 2"
            class="btn btn-danger add-remove-button shadow-none"
            @click="removePlayer"
          >
            -
          </button>
        </div>

        <div class="region-select">
          <h3
            style="font-weight: bolder"
          >
            Regions
          </h3>
          <select
            v-model="region"
            class="form-select"
          >
            <option
              value=""
              selected
              disabled
            >
              Select region...
            </option>
            <option value="na1">
              North America
            </option>
            <option value="kr">
              Korea
            </option>
            <option value="euw1">
              Europe West
            </option>
            <option value="eun1">
              Europe Nordic & East
            </option>
            <option value="jp1">
              Japan
            </option>
            <option value="oc1">
              Oceania
            </option>
            <option value="br1">
              Brazil
            </option>
            <option value="la1">
              LAN
            </option>
            <option value="la2">
              LAS
            </option>
            <option value="ru">
              Russia
            </option>
            <option value="tr1">
              Turkey
            </option>
          </select>
        </div>

        <div class="region-select">
          <h3
            style="font-weight: bolder"
          >
            Check Past Games
          </h3>
          <select
            v-model="limit"
            class="form-select"
          >
            <option
              v-for="limit in possibleLimits()"
              :value="limit"
              selected
            >
              {{ limit }}
            </option>
          </select>
        </div>

        <h5 v-if="errors.length">
          <b>Please correct the following error(s):</b>
          <ul>
            <li
              v-for="error in errors"
              :key="error"
            >
              <span>
                {{ error }}
              </span>
            </li>
          </ul>
        </h5>
        <button
          class="btn btn-secondary shadow-none"
          @click="getCoincidingMatches"
        >
          Search
        </button>
      </div>
    </div>

    <div v-else-if="loading">
      <div class="card loading-card">
        <div
          class="spinner-border"
          role="status"
        >
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>

    <div
      v-else-if="submitted"
      class="card matches"
    >
      <CoincidingMatches
        :coinciding-matches="coincidingMatches"
        :player-names="players"
        :player-ids="puuids"
        :patch="patch"
      />
      <button
        class="btn btn-secondary"
        @click="newSearch"
      >
        New Search
      </button>
    </div>
  </div>
</template>

<script>
import DataService from "../services/DataService";
import CoincidingMatches from "./CoincidingMatches";

export default {
  name: "SelectPlayers",
  components: {
    CoincidingMatches
  },
  data() {
    return {
      players: {
        player1: '',
        player2: '',
      },
      coincidingMatches: [],
      puuids: {},
      submitted: false,
      errors: [],
      region: '',
      patch: '',
      limit: 100,
      loading: false,
    };
  },
  created() {
    DataService.getPatch()
        .then(response => {
          console.log(response.data);
          this.patch = response.data[0];
          console.log(this.patch);
        })
        .catch(e => {
          console.log(e);
        });
  },
  methods: {
    getCoincidingMatches() {
      this.loading = true;
      const errors = new Set([]);

      // If user added a player but didn't give username, don't send request
      for (let player in this.players) {
        if (this.players[player] === '') {
          errors.add('Summoner name is missing.')
        }
      }

      // If no region selected
      if (!this.region) {
        errors.add('Region is missing')
      }

      this.errors = Array.from(errors);

      if (this.errors.length === 0) {
        const data = {
          players: this.players,
          region: this.region,
          limit: this.limit
        };
        console.log(data)
        DataService.getCoincidingMatches(data)
            .then(response => {
              console.log(response.data);
              this.coincidingMatches = response.data.matches;
              this.puuids = response.data.puuids;
              this.submitted = true;
              this.loading = false;
            })
            .catch(e => {
              console.log(e);
            });
      }
    },

    newSearch() {
      this.submitted = false;
      this.coincidingMatches = [];
      this.puuids = []
    },

    addPlayer() {
      const currentPlayerTotal = Object.keys(this.players).length;
      if (currentPlayerTotal < 10) {
        this.players[`player${currentPlayerTotal + 1}`] = '';
      }
      console.log(this.players);
    },

    removePlayer() {
      const currentPlayerTotal = Object.keys(this.players).length;
      if (currentPlayerTotal > 2) {
        delete this.players[`player${currentPlayerTotal}`];
      }
      console.log(this.players);
    },

    possibleLimits() {
      const CHECK_PAST_GAMES_LIMIT = 2000; // From backend
      const limits = [];
      for (let i = 100; i < CHECK_PAST_GAMES_LIMIT; i += 50) {
        if (i * Object.keys(this.players).length <= CHECK_PAST_GAMES_LIMIT) {
          limits.push(i);
        }
      }
      return limits;
    }
  }
}
</script>

<style>
.submit-form {
  max-width: 350px;
  margin: auto;
}

.loading-card {
  height: 340px;
  margin: auto;
}

.add-remove-button {
  width: 35px;
  font-weight: bolder;
  height: 35px;
}

.add-remove-buttons {
  margin-top: -5px;
}

.btn-danger {
  border: darkred;
  background-color: darkred;
}

.btn-success {
  border: darkgreen;
  background-color: darkgreen;
}

.btn-secondary, .btn-secondary:focus {
  background-color: #67678f;
}

.btn-secondary:hover {
  background-color: #5a5a7c;
}

.summoner-input {
  padding: 25px;
}

.matches {
  max-width: 90vw;
  padding: 25px;
  margin: auto auto 25px;
}

.summoner-item {
  margin-bottom: 5px;
}

.region-select {
  margin-bottom: 25px;
}

.limit {
  padding-left: 100px;
  padding-right: 100px;
}

.spinner-border {
  margin: auto;
  width: 5rem;
  height: 5rem;
  color: #5a5a7c;
}
</style>

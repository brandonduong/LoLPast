<template>
  <h1 class="lol-past">
    LoLPast
  </h1>
  <div>
    <div
      v-if="!submitted"
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
            class="btn btn-success add-remove-button"
            @click="addPlayer"
          >
            +
          </button>
          <button
            v-if="Object.keys(players).length > 2"
            class="btn btn-danger add-remove-button"
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
          class="btn btn-success search"
          @click="getCoincidingMatches"
        >
          Search
        </button>
      </div>
    </div>

    <div
      v-else
      class="card matches"
    >
      <CoincidingMatches
        :coinciding-matches="coincidingMatches"
        :player-names="players"
        :player-ids="puuids"
        :patch="patch"
      />
      <button
        class="btn btn-success"
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
      patch: ''
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
          region: this.region
        };
        console.log(data)
        DataService.getCoincidingMatches(data)
            .then(response => {
              console.log(response.data);
              this.coincidingMatches = response.data.matches;
              this.puuids = response.data.puuids;
              this.submitted = true;
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
    }
  }
}
</script>

<style>
.submit-form {
  max-width: 350px;
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

.summoner-input {
  padding: 25px;
}

.matches {
  max-width: 700px;
  padding: 25px;
  margin: auto;
}

.summoner-item {
  margin-bottom: 5px;
}

.region-select {
  margin-bottom: 25px;
}

.lol-past {
  font-weight: bold;
  font-size: 64px;
  font-family: Candara, serif;
}

</style>

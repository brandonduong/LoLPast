<template>
  <div class="submit-form">
    <div v-if="!submitted">
      <div class="form-group card summoner-input">
        <div
          v-for="(player, index) in players"
          :key="index"
        >
          <h3
            for="{{index}}"
            style="font-weight: bolder"
          >Summoner {{ index.slice(6) }}</h3>
          <input
            id="{{index}}"
            v-model="players[index]"
            type="text"
            class="form-control summoner-item"
            name="{{index}}"
            placeholder="Enter summoner name"
          >
        </div>
        <div class="add-remove-buttons" style="text-align:end">
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

    <div v-else>
      <div
        v-for="(match, index) in coincidingMatches"
        :key="index"
      >
        <span>
          Match {{ index + 1 }}: {{ match }}
        </span>
      </div>
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

export default {
  name: "SelectPlayers",
  data() {
    return {
      players: {
        player1: '',
        player2: '',
      },
      coincidingMatches: [],
      submitted: false,
      errors: []
    };
  },
  methods: {
    getCoincidingMatches() {
      const errors = new Set([]);

      // If user added a player but didn't give username, don't send request
      for (let player in this.players) {
        if (this.players[player] === '') {
          errors.add('Summoner name missing.')
        }
      }

      this.errors = Array.from(errors);

      if (this.errors.length === 0) {
        const data = {
          players: this.players,
        };
        console.log(data)
        DataService.getCoincidingMatches(data)
            .then(response => {
              console.log(response.data);
              this.coincidingMatches = response.data;
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
}

.add-remove-button {
  margin-top: -35px;
}

.btn-danger {
  border: darkred;
  background-color: darkred;
}

.summoner-input {
  padding: 25px;
}

.summoner-item {
  margin-bottom: 25px;
}

</style>

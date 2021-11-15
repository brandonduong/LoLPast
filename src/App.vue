<template>
  <div class="body">
    <div id="app">
      <h1 class="lol-past">
        LoLPast
      </h1>
      <!--
      <nav class="navbar navbar-expand navbar-dark bg-dark px-5">
        <div class="container-fluid">
          <router-link
            to="/"
            class="navbar-brand"
          >
            LoLPast
          </router-link>
          <div class="navbar-nav mr-auto">
            <li class="nav-item">
              <router-link
                to="/about"
                class="nav-link"
              >
                About
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                to="/faq"
                class="nav-link"
              >
                FAQ
              </router-link>
            </li>
          </div>
        </div>
      </nav>
      -->

      <div class="container p-1">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #000000;
}

.nav-item {
  font-size: 26px;
}

.navbar-brand {
  font-size: 26px !important;
}

.body {
  padding: 0;
  margin: 0;
  width: 100%;
  min-height: 100vh;
  background-color: #67678f;
}

.lol-past {
  font-weight: bold;
  font-size: 64px;
  font-family: Candara, serif;
  padding-top: 50px;
}
</style>

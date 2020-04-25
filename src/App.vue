<template>
  <div id="app" class="">
    <div v-if="loggedIn">
      <b-navbar class="fixed-top" toggleable="lg" type="dark" variant="dark">
        <b-navbar-brand>Cozy PoS</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item to="/summary">Summary</b-nav-item>
            <b-nav-item to="/transactions">Transaction</b-nav-item>
            <b-nav-item to="/inventory">Inventory</b-nav-item>
            <b-nav-item to="/projects">Projects</b-nav-item>
            <b-nav-item>
              <b-button v-on:click="logout" variant="danger"><b-icon-chevron-left/> Logout</b-button>
            </b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
      <b-container fluid="lg" style="margin-top: 4em">
        <router-view></router-view>
      </b-container>
    </div>
    <div v-else>
      <Login v-bind:loggingIn="loggingIn" @onClickLogin="login" />
    </div>
  </div>
</template>

<script>
import Transaction from './components/Transaction'
import TransactionDetail from './components/TransactionDetail'
import Project from './components/Project'
import ProjectDetail from './components/ProjectDetail'
import Inventory from './components/Inventory'
import InventoryDetail from './components/InventoryDetail'
import StockIn from './components/StockIn'
import VueRouter from 'vue-router'
import Login from './components/Login'
import Summary from './components/Summary'

const routes = [
  { path: '/summary', component: Summary },
  { path: '/transactions', component: Transaction },
  { path: '/transactions/:id', component: TransactionDetail },
  { path: '/inventory', component: Inventory },
  { path: '/inventory/:id', component: InventoryDetail },
  { path: '/projects', component: Project },
  { path: '/projects/:id', component: ProjectDetail },
  { path: '/stock-in/:id', component: StockIn },
]

const router = new VueRouter({
  routes
})

export default {
  name: 'App',
  router,
  data() {
    return {
      loggingIn: false,
      loggedIn: false
    }
  },
  async created() { // Check local storage
    const apiKey = localStorage.getItem('apiKey')
    console.log('apikey:', apiKey)

    if(apiKey !== null) {
      try {
        this.loggingIn = true

        const response = await fetch(`${process.env.VUE_APP_BASE_URL}/check-api-key`, {
          method: 'POST',
          headers: {
            'Content-Type' : 'application/json',
          },
          body: JSON.stringify({api_key: apiKey})
        })

        if(response.status !== 200) {
          this.loggingIn = false
          throw 'Unauthorized. Invalid API key'
        }

        this.loggedIn = true
        this.loggingIn = false
        const data = response.text()
        console.log('data:', data)
      }
      catch(e) {
        console.log(e)
      }
    }
  },
  components: {
    Login
  },
  methods: {
    async login(value) {
      // value: { username, password }
      try {
        this.loggingIn = true

        const response = await fetch(`${process.env.VUE_APP_BASE_URL}/login`, {
          method: 'POST',
          headers: {
            'Content-Type' : 'application/json'
          },
          body: JSON.stringify(value)
        })

        if(response.status !== 200) {
          this.loggingIn = false
          throw 'Error logging in. password incorrect.'
        }

        const key = await response.text()
        localStorage.setItem('apiKey', key)

        this.loggedIn = true
        this.loggingIn = false

        console.log('apikey:', key)

        // alert(`loggin in!, ${JSON.stringify(value)}`)
      }
      catch(e) {
        console.log(e)
      }
    },
    logout() {
      localStorage.setItem('apiKey', null)
      this.loggedIn = false
    }
  }
}
</script>
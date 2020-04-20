<template>
  <div id="app">
    <div v-if="loggedIn">
      <b-navbar class="fixed-top" toggleable="lg" type="dark" variant="dark">
        <b-navbar-brand>Cozy PoS</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item to="/statistics">Statistics</b-nav-item>
            <b-nav-item to="/transactions">Transaction</b-nav-item>
            <b-nav-item to="/inventory">Inventory</b-nav-item>
            <b-nav-item to="/stock-in">Stock In</b-nav-item>
            <b-nav-item to="/projects">Projects</b-nav-item>  
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
      <b-container fluid="lg" style="margin-top: 4em">
        <router-view></router-view>
      </b-container>
    </div>
    <div v-else>
      <Login />
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
import VueRouter from 'vue-router'
import Login from './components/Login'

const routes = [
  { path: '/transactions', component: Transaction },
  { path: '/transactions/:id', component: TransactionDetail },
  { path: '/inventory', component: Inventory },
  { path: '/inventory/:id', component: InventoryDetail },
  { path: '/projects', component: Project },
  { path: '/projects/:id', component: ProjectDetail },
]

const router = new VueRouter({
  routes
})

export default {
  name: 'App',
  router,
  data() {
    return {
      loggedIn: true
    }
  },
  components: {
    Login
  }
}
</script>
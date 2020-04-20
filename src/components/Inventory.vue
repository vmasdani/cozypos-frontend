<template>
  <div>
    <h3 class="text-info">Inventory</h3>
    <div>
      <b-button><b-icon-plus-circle-fill /> Add</b-button>
    </div>
    <div class="my-1">
      Search
      <b-form-input placeholder="Search Item..." v-model="search"></b-form-input>
    </div>
    <div class="my-2">
      <b-list-group>
        <b-list-group-item
          class="border-primary"
          v-for="item in filteredInventory"
          :key="item.id"
          v-bind:to="`/inventory/${item.id}`"
        >
          <div>
            <h5>{{item.name}}</h5>
          </div>
          <div>
            <h6><strong class="text-success">{{formatCurrency(item.price)}}</strong></h6>
          </div>
          <div>{{item.desc}}</div>
          <div class="mt-1 d-flex flex-row align-items-center">
            <div class="bg-info p-1 text-white"><strong>Sold {{item.sold}}/{{item.qty}}</strong></div>
            <div class="ml-2 bg-secondary p-1 text-white"><strong>Rsv. {{item.reserved}}</strong></div>
          </div>
        </b-list-group-item>
      </b-list-group>
    </div>
  </div>
</template>
<script>
import { formatCurrency } from '../helpers'

export default {
  name: 'Inventory',
  data() {
    return {
      search: '',
      inventory: [],
      filteredInventory: []
    }
  },
  created() {
    console.log('inventory created')
    this.fetchInventory()
  },
  methods: {
    async fetchInventory() {
      try {
        const response = await fetch(`${process.env.VUE_APP_BASE_URL}/items`)

        if(response.status !== 200) {
          throw 'Fetching inventory error.'
        }

        const responseJson = await response.json()
        this.inventory = responseJson
        this.filteredInventory = responseJson
      }
      catch(e) {
        console.log(e)
      }
    },
    formatCurrency
  },
  watch: {
    search: function(newSearch) {
      this.filteredInventory = this.inventory.filter(item => item.name.toLowerCase().includes(newSearch))
    }
  }
}
</script>
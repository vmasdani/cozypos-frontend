<template>
  <div>
    <b-button to="/inventory"><b-icon-arrow-left/> Back</b-button>
    <h3 class="text-info">Stock in</h3>
    <div>
      <div class="bg-info text-white p-2 rounded-lg">
        <h4 v-bind="item">{{item ? item.name : ''}}</h4>
        <p v-bind="item">{{item.desc}}</p>
        <h4>In stock: {{item.qty}}</h4>
      </div> 
      <div>Stock in amount:</div>
      <b-form-input type="number" placeholder="Amount..." v-model="stockInAmount"></b-form-input>
      <div class="d-flex my-3">
        <b-button v-on:click="stockIn()">Insert</b-button>
      </div>
    </div>
    <div>
      <h5>Stock in history</h5>
    
      <b-list-group>
        <b-list-group-item
          v-for="stockIn in item.item_stock_ins"
          :key="stockIn.id"
          class="border-primary"
        >
          <div>
            Qty: {{stockIn.qty}}
          </div>
          <div>
            Date: {{stockIn.created_at}}
          </div>
          <div>
            Created by: {{stockIn.pic}}
          </div>
        </b-list-group-item>
      </b-list-group>
    </div>
  </div>
</template>
<script>
export default {
  name: 'StockIn',
  data() {
    return {
      item: {
        name: '',
        item_stock_ins: []
      },
      stockInAmount: ''
    }
  },
  created() {
    this.fetchItemData()
  },
  methods: {
    async fetchItemData() {
      try {
        const id = this.$route.params.id
        const response = await fetch(`${process.env.VUE_APP_BASE_URL}/items/${id}`, {
          headers: {
            'Authorization' : localStorage.getItem('apiKey')
          }
        })

        if(response.status !== 200) {
          throw 'Error fetching item data'
        }

        const item = await response.json()
        this.item = item
      }
      catch(e) {
        console.log(e)
      }
    },
    async stockIn() {
      try {
        const usernameBase64 = localStorage.getItem('apiKey').split(':')[0]

        console.log('split api key:', usernameBase64)
        const username = atob(usernameBase64)

        const response = await fetch(`${process.env.VUE_APP_BASE_URL}/items/stock-in`, {
          method: 'POST',
          headers: {
            'Content-Type' : 'application/json',
            'Authorization' : localStorage.getItem('apiKey')
          },
          body: JSON.stringify({
            item_id: this.item ? this.item.id : 0,
            pic: username,
            qty: parseInt(this.stockInAmount)
          })
        })

        if(response.status !== 201) {
          throw 'Failed creating stock-in.'
        }

        this.$router.push('/inventory')
      }
      catch(e) {
        console.log(e)
      }
    }
  }
}
</script>
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
        <b-button>Insert</b-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'StockIn',
  data() {
    return {
      item: null,
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
        const response = await fetch(`${process.env.VUE_APP_BASE_URL}/items/${id}`)

        if(response.status !== 200) {
          throw 'Error fetching item data'
        }

        const item = await response.json()
        this.item = item
      }
      catch(e) {
        console.log(e)
      }
    }
  }
}
</script>
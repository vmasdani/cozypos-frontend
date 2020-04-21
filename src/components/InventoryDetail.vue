<template>
  <div>
    <div class="my-2">
      <b-button to="/inventory"><b-icon-arrow-left /> Back</b-button>
    </div>
    <h3 class="text-info" v-bind="[newItem]">
      {{newItem ? 'New Item' : 'Edit Item'}}
    </h3>
    <div>
      <div>
        Name
        <b-form-input placeholder="Name..." v-model="item.name"></b-form-input>
      </div>
      <div>
        Description
        <b-form-input placeholder="Description..." v-model="item.desc"></b-form-input>
      </div>
      <div>
        Price
        <b-form-input placeholder="Price..." v-model="item.price"></b-form-input>
      </div>
      <div>
        Item Fund
        <b-form-input placeholder="Item Fund..." v-model="item.manufacturing_price"></b-form-input>
      </div>
      <div class="my-2">
        <b-button variant="primary">Save</b-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'InventoryDetail',
  data() {
    return {
      newItem: false,
      item: {
        name: '',
        desc: '',
        price: '',
        manufacturing_price: '', 
      }
    }
  },
  created() {
    const id = this.$route.params.id

    let parsedId = parseInt(id)
    console.log('parsed id:', parsedId)

    if(isNaN(parsedId)) {
      this.newItem = true
    }
    else {
      this.fetchData(parsedId)
    }
  },
  methods: {
    async fetchData(id) {
      try {
        const response = await fetch(`${process.env.VUE_APP_BASE_URL}/items/${id}`)

        if(response.status !== 200) {
          throw 'Fetching item failed.'
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
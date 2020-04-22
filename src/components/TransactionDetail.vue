<template>
  <div v-bind="project">
    <b-button class="my-2" to="/transactions"><b-icon-arrow-left/> Back</b-button>
    <h5>
      {{newProject ? 'New Transaction' : 'Edit Transaction'}}: {{project.name}}
    </h5>
    <div class="my-2" v-bind="transaction">
      <div class="my-1">
        Cashier: {{transaction.cashier}}
      </div>
      <div class="my-1" v-bind="[formatCurrency]">
        Custom Price: {{formatCurrency(transaction.custom_price)}}
        <b-form-input type="number" placeholder="Custom Price" v-model="transaction.custom_price"></b-form-input>
      </div>
      <div class="my-1">
        <div>
          Type
        </div>
        <b-dropdown v-bind:text="transaction.type">
          <b-dropdown-item v-on:click="setTransactionType('sell')">sell</b-dropdown-item>
          <b-dropdown-item v-on:click="setTransactionType('auction')">auction</b-dropdown-item>
        </b-dropdown>
      </div>
      <div class="border border-primary p-2 my-3">
        <h5 class="d-flex justify-content-center">
          Items:
        </h5>
        <div>
          Item
          <v-select placeholder="Item..." @search="fetchOptions" :options="options" label="name" v-model="selected"></v-select>
        </div>
        <div>
          Qty
          <b-form-input placeholder="Qty" type="number"></b-form-input>
        </div>
        <b-button class="my-2"><b-icon-plus /> Add to List</b-button>
        <b-list-group>

          <b-list-group-item class="bg-light d-flex flex-row bordered border-secondary align-items-center">
            <div>
              <b-button variant="danger"><b-icon-trash2-fill /></b-button>
            </div>
            <div class="ml-2">
              <div>
                1x Item A
              </div>
              <div>
                {{formatCurrency(0)}}
              </div>
            </div>
            
          </b-list-group-item>

          <b-list-group-item class="bg-light d-flex flex-row bordered border-secondary align-items-center">
            <div>
              <b-button variant="danger"><b-icon-trash2-fill /></b-button>
            </div>
            <div class="ml-2">
              <div>
                1x Item B
              </div>
              <div>
                {{formatCurrency(0)}}
              </div>
            </div>
          </b-list-group-item>

        </b-list-group>
        <div class="my-2">
          Grand total:
          <h3>{{formatCurrency(0)}}</h3>
        </div>
      </div>
      <b-button variant="primary"><b-icon-upload/> Save</b-button>
    </div>
  </div>
</template>
<script>
import { formatCurrency } from '../helpers'

export default {
  name: 'TransactionDetail',
  data() {
    return {
      project: null,
      newProject: false,
      transaction: {
        type: 'sell',
        cashier: '',
        custom_price: ''
      },
      grandTotal: 0,
      options: ['Item A', 'Item B'],
      selected: null
    }
  },
  created() {
    console.log(this.$route.params)
    console.log(this.$route.query)

    const projectId = this.$route.query.projectid
    const transactionId = this.$route.params.id

    let parsedTransactionId = parseInt(transactionId)

    console.log('transaction id:', transactionId)
    console.log(parsedTransactionId)

    if(isNaN(parsedTransactionId)) {
      this.newProject = true
      console.log('new transaction')
    }
    else {
      console.log('not new transaction')
      this.fetchTransaction(parsedTransactionId)
    }

    this.fetchProject(projectId)

  },
  methods: {
    async fetchProject(id) {
      try {
        const projectResponse = await fetch(`${process.env.VUE_APP_BASE_URL}/projects/${id}`)

        let project = null
        if(projectResponse.status !== 200) {
          throw 'Fetching project error'
        }

        project = await projectResponse.json()
        this.project = project
      }
      catch(e) {
        console.log(e)
      }
    },
    async fetchTransaction(id) {
      try {
        const transactionResponse = await fetch(`${process.env.VUE_APP_BASE_URL}/transactions/${id}`)

        let transaction = null
        if(transactionResponse.status !== 200) {
          throw 'Fetching project error'
        }

        transaction = await transactionResponse.json()
        this.transaction = transaction
      }
      catch(e) {
        console.log(e)
      }
    },
    setTransactionType(type) {
      this.transaction.type = type
    },
    formatCurrency,
    fetchOptions(search, loading) {
      console.log(search, loading)

      this.options = [
        { name: 'item A' }
      ]
    }
  },
  watch: {
    transaction: function(val) {
      console.log('transaction:', val)
    }
  }
}
</script>

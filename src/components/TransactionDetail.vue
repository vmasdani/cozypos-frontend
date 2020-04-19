<template>
  <div v-bind="project">
    <b-button to="/transactions"><b-icon-arrow-left/> Back</b-button>
    <h5>
      {{newProject ? 'New Transaction' : 'Edit Transaction'}}: {{project.name}}
    </h5>
    <div class="my-2" v-bind="transaction">
      <div class="my-1">
        Cashier
        <b-form-input placeholder="Cashier" v-model="transaction.cashier"></b-form-input>
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
          <b-dropdown-item v-on:click="setTransactionType('stock_in')">stock In</b-dropdown-item>
          <b-dropdown-item v-on:click="setTransactionType('auction')">auction</b-dropdown-item>
        </b-dropdown>
      </div>
      
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
      }
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
    formatCurrency
  },
  watch: {
    transaction: function(val) {
      console.log('transaction:', val)
    }
  }
}
</script>

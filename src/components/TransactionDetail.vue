<template>
  <div v-bind="project">
    <b-button class="my-2" v-on:click="back"><b-icon-arrow-left/> Back</b-button>
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
          Item {{selected ? formatCurrency(selected.price) : ''}}
          <v-select placeholder="Item..." @search="fetchOptions" :options="options" label="name" v-model="selected"></v-select>
        </div>
        <div>
          Qty
          <b-form-input placeholder="Qty" type="number" v-model="inputQty"></b-form-input>
        </div>
        
        <div class="d-flex flex-column">
          <b-button class="my-2" v-on:click="addTransactionToList()">
            <b-icon-plus /> Add to List
          </b-button>
          <div class="ml-2">
            <h4>{{formatCurrency(showItemTotalPrice())}}</h4>
          </div>
        </div>
       
        <b-list-group>
          <b-list-group-item 
            class="bg-light d-flex flex-row bordered border-secondary align-items-center"
            v-for="itemTransaction in transaction.items_transactions"
            :key="itemTransaction.id"
          >
            <div>
              <b-button v-on:click="deleteItemTransaction(itemTransaction.id, itemTransaction.uuid)" variant="danger"><b-icon-trash2-fill /></b-button>
            </div>
            <div class="ml-2">
              <div>
                {{itemTransaction.qty}}x {{itemTransaction.item.name}}
              </div>
              <div>
                {{formatCurrency(itemTransaction.item.price * itemTransaction.qty)}}
              </div>
            </div>
          </b-list-group-item>


          <!-- <b-list-group-item class="bg-light d-flex flex-row bordered border-secondary align-items-center">
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
          </b-list-group-item> -->

        </b-list-group>
        <div class="my-2">
          Grand total:
          <h3>{{formatCurrency(fetchGrandTotal())}}</h3>
        </div>
        <div class="my-2">
          Custom price:
          <h3>{{formatCurrency(transaction.custom_price)}}</h3>
        </div>
      </div>
      <b-button variant="primary" v-on:click="saveTransaction()"><b-icon-upload/> Save</b-button>
    </div>
  </div>
</template>
<script>
import { formatCurrency } from '../helpers'
import { v4 as uuidv4 } from 'uuid'

export default {
  name: 'TransactionDetail',
  data() {
    return {
      project: null,
      newProject: false,
      transaction: {
        uuid: '',
        type: 'sell',
        cashier: '',
        custom_price: '',
        items_transactions: []
      },
      idsToDelete: [],
      grandTotal: 0,
      options: ['Item A', 'Item B'],
      selected: null,
      inputQty: ''
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
    this.fetchOptions('', null)

  },
  methods: {
    async fetchProject(id) {
      try {
        
        const projectResponse = await fetch(`${process.env.VUE_APP_BASE_URL}/projects/${id}`, {
          headers: {
            'Authorization' : localStorage.getItem('apiKey')
          }
        })

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
        const transactionResponse = await fetch(`${process.env.VUE_APP_BASE_URL}/transactions/${id}`, {
          headers: {
            'Authorization' : localStorage.getItem('apiKey')
          }
        })

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
    async fetchOptions(search, loading) {
      console.log(search, loading)
      console.log(`${process.env.VUE_APP_BASE_URL}/items-search?name=${search}`)

      try {
        const response = await fetch(`${process.env.VUE_APP_BASE_URL}/items-search?name=${search}`, {
          headers: {
            'Authorization' : localStorage.getItem('apiKey')
          }
        })

        if(response.status !== 200) {
          throw 'Error fetching items.'
        }

        const itemsJson = await response.json()
        this.options = itemsJson
      }
      catch(e) {
        console.log(e)
      }
      // this.options = [
      //   { name: 'item A' }
      // ]
    },
    showItemTotalPrice() {
      const itemPrice = this.selected ? this.selected.price : 0
      const parsedInputQty = parseInt(this.inputQty)

      const inputQty = isNaN(parsedInputQty) ? 0 : parsedInputQty

      return itemPrice * inputQty
    },
    fetchGrandTotal() {
      let total = 0
      this.transaction.items_transactions.forEach(itemTransaction => total += itemTransaction.qty * itemTransaction.item.price)
    
      return total
    },
    addTransactionToList() {
      if(this.selected === null) {
        alert('Please select an item first!')
        return
      }

      const parsedInputQty = parseInt(this.inputQty)
      const inputQty = isNaN(parsedInputQty) ? 1 : parsedInputQty

      const newItemTransaction = {
        uuid: uuidv4(),
        qty: inputQty,
        item: this.selected
      }

      const newItemTransactions = [...this.transaction.items_transactions, newItemTransaction ]
      this.transaction.items_transactions = newItemTransactions

      this.selected = null
      this.inputQty = ''
    },
    deleteItemTransaction(id, uuid) {
      console.log('uuid:', uuid)

      // Append itemTransaction
      const newItemTransactions = [...this.transaction.items_transactions]
      const itemTransactionIndex = newItemTransactions.findIndex(itemTransaction => itemTransaction.uuid === uuid)

      if(itemTransactionIndex >= 0)
        newItemTransactions.splice(itemTransactionIndex, 1)

      this.transaction.items_transactions = newItemTransactions
    
      // Append idsToDelete
      const newIdsToDelete = [...this.idsToDelete, id]
      this.idsToDelete = newIdsToDelete

      console.log('ids to delete', newIdsToDelete)
    },
    async saveTransaction() {
      const cashierSplit = localStorage.getItem('apiKey').split(':')
      const cashier = cashierSplit.length > 0 ? atob(cashierSplit[0]) : ''

      try {
        // Save transactions
        const response = await fetch(`${process.env.VUE_APP_BASE_URL}/transactions`, {
          method: 'POST',
          headers: {
            'Content-Type' : 'application/json',
            'Authorization' : localStorage.getItem('apiKey')
          },
          body: JSON.stringify({
            ...this.transaction,
            uuid: this.transaction.uuid === '' ? uuidv4() : this.transaction.uuid,
            cashier: this.transaction.cashier === '' ? cashier : this.transaction.cashier,
            project_id: this.project.id,
            custom_price: isNaN(parseInt(this.transaction.custom_price)) ? 0 : parseInt(this.transaction.custom_price), 
            items_transactions: this.transaction.items_transactions.map(itemTransaction => ({
              ...itemTransaction,
              item_id: itemTransaction.item.id
            }))
          })
        })

        if(response.status !== 201) {
          throw 'Error saving transaction'
        }

        // Delete ids
        Promise.all(
          this.idsToDelete.map(async id => {
            const response = await fetch(`${process.env.VUE_APP_BASE_URL}/items-transactions/${id}`, { 
              method: 'DELETE',
              headers: {
                'Authorization' : localStorage.getItem('apiKey')
              } 
            })
            return response.json()
          })
        )
        // this.$router.push('/transactions')
      }
      catch(e) {
        console.log(e)
      }
    },
    back() {
      this.$router.go(-1)
    }
  },
  watch: {
    transaction: function(val) {
      console.log('transaction:', val)
    }
  }
}
</script>

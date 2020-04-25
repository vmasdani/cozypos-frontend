<template>
  <div>
    <h6>Total fund:</h6>
    <h3>{{formatCurrency(summary ? summary.total_fund : 0)}}</h3>
    <h6>Total revenue:</h6>
    <h3>{{formatCurrency(summary ? summary.total_revenue : 0)}}</h3>
    <h6>Total profit:</h6>
    <h3 v-bind:class="`text-${checkProfitColor()}`">
      {{formatCurrency(summary ? summary.total_profit : 0)}}
    </h3>
  </div>
</template>
<script>
import { formatCurrency } from '../helpers'

export default {
  name: 'Summary',
  data() {
    return {
      summary: null
    }
  },
  created() {
    this.fetchSummary()
  },
  methods: {
    formatCurrency,
    async fetchSummary() {
      try {
        const response = await fetch(`${process.env.VUE_APP_BASE_URL}/summary`, {
          headers: {
            'Authorization' : localStorage.getItem('apiKey')
          }
        })

        if(response.status !== 200) {
          throw 'Error fetching summary.'
        }

        const sumJson = await response.json()
        this.summary = sumJson
      }
      catch(e) {
        console.log(e)
      }
    },
    checkProfitColor() {
      return this.summary.profit < 0 ? 'danger' : 'success'
    }
  }
}
</script>
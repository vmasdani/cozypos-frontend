<template>
  <div>
    <b-button to="/projects"><b-icon-arrow-left /> Back</b-button>
    <h1 v-bind="id">This is the project detail page. {{id}}</h1>
  </div>
  
</template>
<script>
export default {
  data() {
    return {
      id: 0
    }
  },
  name: 'ProjectDetail',
  created() {
    this.id = this.$route.params.id
  }
}
</script>
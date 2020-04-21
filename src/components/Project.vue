<template>
  <div>
    <h3 class="text-info">Projects</h3>
    <div class="my-2">
      <b-button to="/projects/new"><b-icon-plus-circle-fill/> Add</b-button>
    </div>
    <div>
      <b-list-group>
        <b-list-group-item 
          class="border-info" 
          v-for="project in projects" 
          :key="project.id"
          v-bind:to="`/projects/${project.id}`"
        >
          <div class="d-flex flex-column justify-content-between" v-bind="[formatCurrency]">
            <h5>{{project.name}}</h5>
            <div>
              Funding: {{formatCurrency(0)}}
            </div>
            <div>
              Revenue: {{formatCurrency(0)}}
            </div>
            <div>
              Profit: {{formatCurrency(0)}}
            </div>
            <div class=" d-flex bg-white">
              <div class="bg-info p-2 text-white">
                <strong>Date: {{new Date(project.date).toISOString().slice(0, 10)}}</strong>
              </div>
            </div>
          </div>
          
        </b-list-group-item>
      </b-list-group>
    </div>
  </div>
</template>
<script>
import { formatCurrency } from '../helpers'

export default {
  name: 'Project',
  data() {
    return {
      projects: []
    }
  },
  created() {
    console.log('project created')
    this.fetchProjects()
  },
  methods: {
    async fetchProjects() {
      try {
        const response = await fetch(`${process.env.VUE_APP_BASE_URL}/projects`)
        
        if(response.status != 200) {
          throw 'Fething project error'
        }
        const projects = await response.json()
        this.projects = projects.filter(project => project.name !== '')
      }
      catch(e) {
        console.log(e)
      }
    },
    formatCurrency
  },
}
</script>
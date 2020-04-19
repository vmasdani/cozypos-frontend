<template>
  <div>
    <h3 class="text-info">Projects</h3>
    <b-spinner variant="success"></b-spinner>
    <div class="my-2">
      <b-button to="/projects/new"><b-icon-plus-circle-fill/> Add</b-button>
    </div>
    <div>
      <b-list-group>
        <b-list-group-item 
          class="bg-light" 
          v-for="project in projects" 
          :key="project.id"
          v-bind:to="`/projects/${project.id}`"
        >
          <div class="d-flex flex-column justify-content-between">
            <h5>{{project.name}}</h5>
            <div>
              Date: {{new Date(project.date).toISOString().slice(0, 10)}}
            </div>
          </div>
          
        </b-list-group-item>
      </b-list-group>
    </div>
  </div>
</template>
<script>
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
    }
  }
}
</script>
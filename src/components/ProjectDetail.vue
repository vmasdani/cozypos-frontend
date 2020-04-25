<template>
  <div>
    <div class="my-2">
      <b-button to="/projects"><b-icon-arrow-left /> Back</b-button>
    </div>
    <h3 class="text-info">
      {{newProject ? 'New Project' : 'Edit Project'}}
    </h3>
    <div>
      <div>
        Name
        <b-form-input placeholder="Name..." v-model="project.name"></b-form-input>
      </div>
      <div>
        Date
        <b-form-datepicker v-model="project.date"></b-form-datepicker>
      </div>
      <b-button class="my-2" variant="primary">Save</b-button>
    </div>
  </div>
  
</template>
<script>
export default {
  data() {
    return {
      newProject: false,
      project: {
        name: '',
        date: ''
      }
    }
  },
  name: 'ProjectDetail',
  created() {
    const id = this.$route.params.id
    const parsedId = parseInt(id)

    if(isNaN(parsedId)) {
      this.newProject = true
    }
    else {
      this.fetchProject(parsedId)
    }
  },
  methods: {
    async fetchProject(id) {
      try {
        const response = await fetch(`${process.env.VUE_APP_BASE_URL}/projects/${id}`, {
          headers: {
            'Authorization' : localStorage.getItem('apiKey')
          }
        })

        if(response.status !== 200) {
          throw 'Error fetching project'
        }

        const project = await response.json()
        project.date = new Date(project.date).toISOString().slice(0, 10)

        this.project = project
      }
      catch(e) {
        console.log(e)
      }
    }
  }
}
</script>
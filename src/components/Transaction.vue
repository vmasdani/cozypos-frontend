<template>
    <div>
      <h2 class="text-primary">Transactions</h2>
      <div class="d-flex">
        <h4>Project:</h4>
        <b-dropdown class="mx-1" v-bind:text="selectedProject ? selectedProject.name : ''">
          <b-dropdown-item 
            v-for="project in projects" 
            :key="project.id"
            v-on:click="setProject(project)"
          >
            {{project.name}}
          </b-dropdown-item>
        </b-dropdown>
      </div>
      <div v-bind="projectDetails">
        <h5>Revenue: {{projectDetails ? formatCurrency(projectDetails.project_revenue) : ''}}</h5>
        <h5>Funding cost: {{projectDetails ? formatCurrency(projectDetails.project_manufacturing_price) : ''}}</h5>
        <h5>Profit: <span class="text-success">{{projectDetails ? formatCurrency(projectDetails.project_revenue - projectDetails.project_manufacturing_price) : ''}}</span></h5>
      </div>
      <div>
        <b-button v-bind:to="`/transactions/new?projectid=${projectDetails.id}`">
          <b-icon-plus-circle-fill/> Add
        </b-button>
        <b-button class="btn-info mx-2"><b-icon-download/> Download Report</b-button>
      </div>
      
      <div class="my-2">
        <b-list-group>
          <b-list-group-item
            v-for="transaction in projectDetails.transactions" 
            :key="transaction.id" 
            class="text-white my-1"
            v-bind:style="{backgroundColor: checkVariant(transaction.type)}"
            v-bind:to="`/transactions/${transaction.id}?projectid=${projectDetails.id}`"
          >
            <div class="d-flex justify-content-between">
              <h5 v-bind="formatCurrency">
                {{transaction.custom_price > 0 ? formatCurrency(transaction.custom_price) : formatCurrency(transaction.total_price)}}
              </h5>
              <div>{{transaction.cashier}}</div>
            </div>
            <div class="d-flex justify-content-between">
              <div>{{transaction.type}}</div>
              <div>{{transaction.created_at}}</div>
            </div>
          </b-list-group-item>
        </b-list-group>
      </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      selectedProject: null,
      projects: [],
      projectDetails: null
    }
  },
  created() {
    console.log('transaction created.')
    this.fetchInitialProject()
  },
  watch: {
    $route(to, from) {
      console.log(to, from)
    }
  },
  methods: {
    async fetchInitialProject() {
      try {
        // Fetch currently available projects
        const projectsResponse = await fetch(`${process.env.VUE_APP_BASE_URL}/projects`)

        if(projectsResponse.status !== 200) {
          throw "Fetching projects failed"
        }
        const projects = await projectsResponse.json()
        console.log('projects:', projects)

        this.projects = projects.filter(data => data.name !== '')

        let selectedProject = null
        
        if(projects.length > 0) {
          selectedProject = projects[0]
        }

        this.selectedProject = selectedProject
        
        // Fetch projects data with transactions
        if(selectedProject !== null) {
          this.fetchProject(selectedProject.id)
        }
      }
      catch(e) {
        console.log(e)
      }
    },
    setProject(project) {
      this.selectedProject = project
      this.fetchProject(project.id)
    },
    async fetchProject(id) {
      try {
        const projectDetailResponse = await fetch(`${process.env.VUE_APP_BASE_URL}/projects/${id}`)
        
        if(projectDetailResponse.status !== 200) {
          throw "Fetching project details failed"
        }

        const projectDetails = await projectDetailResponse.json()
        console.log('project details:', projectDetails)
        
        if(projectDetails != null) {
          this.projectDetails = projectDetails
        } 
      }
      catch(e) {
        console.log(e)
      }
    },
    formatCurrency(number) {
      return new Intl.NumberFormat('de-DE', { style: 'currency',  currency: 'IDR' }).format(number)
    },
    checkVariant(type) {
      switch(type) {
        case 'sell':
          return '#4caf50'
        case 'stock_in':
          return '#00acc1'
        case 'auction':
          return '#ab47bc'
        case 'movement':
          return '#f9a825'
        default:
          return 'white'
      }
    }
  }
}
</script>
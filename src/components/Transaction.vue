<template>
    <div v-if="isLoading">
      <b-spinner variant="primary"></b-spinner>
    </div>
    <div v-else>
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
        <h5 class="my-3">Revenue: <span class="text-success">{{projectDetails ? formatCurrency(projectDetails.project_revenue) : ''}}</span></h5>
        <!-- <h5>Funding cost: {{projectDetails ? formatCurrency(projectDetails.project_manufacturing_price) : ''}}</h5>
        <h5>Profit: <span class="text-success">{{projectDetails ? formatCurrency(projectDetails.project_revenue - projectDetails.project_manufacturing_price) : ''}}</span></h5> -->
      </div>
      <div>
        <b-button v-bind:to="`/transactions/new?projectid=${projectDetails.id}`">
          <b-icon-plus-circle-fill/> Add
        </b-button>
        <b-button class="btn-info mx-2" v-on:click="downloadReport()"><b-icon-download/> Download Report</b-button>
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
      projectDetails: null,
      isLoading: false
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
        this.isLoading = true
        const projectsResponse = await fetch(`${process.env.VUE_APP_BASE_URL}/projects`, {
          headers: {
            'Authorization' : localStorage.getItem('apiKey')
          }
        })

        if(projectsResponse.status !== 200) {
          this.isLoading = false
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

        this.isLoading = false

        // Check route
        const projectId = this.$route.query.projectid
        const parsedProjectId = parseInt(projectId)

        if(!isNaN(parsedProjectId)) {
          const foundProject = projects.find(project => project.id === parsedProjectId)

          if(foundProject !== null)
            this.selectedProject = foundProject
        } 
      }
      catch(e) {
        console.log(e)
      }
    },
    setProject(project) {
      this.selectedProject = project
      this.$router.push(`/transactions?projectid=${project.id}`)
      this.fetchProject(project.id)
    },
    async fetchProject(id) {
      try {
        this.isLoading = true
        const projectDetailResponse = await fetch(`${process.env.VUE_APP_BASE_URL}/projects/${id}`, {
          headers: {
            'Authorization' : localStorage.getItem('apiKey')
          }
        })
        
        if(projectDetailResponse.status !== 200) {
          this.isLoading = false
          throw "Fetching project details failed"
        }

        const projectDetails = await projectDetailResponse.json()
        console.log('project details:', projectDetails)
        
        if(projectDetails != null) {
          this.projectDetails = projectDetails
        } 
        this.isLoading = false
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
    },
    async downloadReport() {
      try {
        const response = await fetch(`${process.env.VUE_APP_BASE_URL}/report?projectid=${this.projectDetails.id}`, {
          headers: {
            'Authorization' : localStorage.getItem('apiKey')
          }  
        })

        if(response.status !== 200) {
          throw 'Failed downloading report.'
        }

        const reportContents = await response.text()

        const blob = new Blob([reportContents], { type: 'text/csv;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `report_${new Date().toISOString()}.csv`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      }
      catch(e) {
        console.log(e)
      }

      
    }
  }
}
</script>
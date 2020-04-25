<template>
  <div class="d-flex bg-dark align-items-center justify-content-center" style="height: 100vh">
    <b-card>
      <div class="d-flex flex-column align-items-center">
        <h3>Cozy PoS Login</h3>

        <b-spinner v-if="loggingIn" variant="primary"></b-spinner>

        <div class="my-2">
          <b-form-input placeholder="Username..." v-model="username"></b-form-input>
        </div>
        
        <div class="my-2">
          <b-form-input placeholder="Password..." v-model="password" type="password"></b-form-input>
        </div>
      
        <div class="my-2">
          <b-button variant="primary" v-on:click="handleLogin()">Login</b-button>
        </div>
      </div>
      
    </b-card>
  </div>
</template>

<script>
export default {
  name: 'Login',
  props: {
    loggingIn: Boolean
  },
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    handleLogin() {
      console.log("loggin in")
      this.$emit('onClickLogin', { username: this.username, password: this.password })
    }
  }
}
</script>
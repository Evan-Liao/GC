<template>
  <div id="app">
    <!-- <keep-alive include="TextList"> -->
    <keep-alive>
    <!-- <keep-alive exclude="Article,OneArticle"> -->
      <router-view  v-if="isRouterAlive"/>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'App',

  created() {
    console.log('asdasd')
  },

  provide (){
     return {
       reload:this.reload
     }
  },
  data () {
    return {
      isRouterAlive: true
    }
  },
  methods: {
    reload () {
      console.log('reload');
      this.isRouterAlive = false
      this.$nextTick(() => (this.isRouterAlive = true))
    }
  }
}
</script>

<style></style>

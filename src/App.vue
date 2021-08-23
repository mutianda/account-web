<template>
  <div id="app" class="main">
    <div id="nav" class="nav">
      <router-link to="/">账单</router-link> |
      <router-link to="/canvas">图表</router-link>
    </div>
    <router-view class="main-view"/>
  </div>
</template>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
  padding: 0;
  margin: 0;
}
body{
  padding: 0;
  margin: 0;
}
#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
  .main-view{
    height: calc(100% - 90px);
  }
</style>

<template>
  <div id="app">
    <el-container>
      <el-header>
        <el-row>
          <el-col
            :span="12"
            style="">
            <a href="#/login">
              <img src="./assets/logo.png" style="float:left;margin:5px;" width="50px;"/>
              <h3>云悠工作室</h3>
            </a>
          </el-col>
          <el-col
            :span="12"
            style="text-align:right">
            <h5 v-if="loginUser">
              <span>
                {{ loginUser.name }}
              </span>
              &nbsp;
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-switch-button"
                circle
                @click="logout"/>
            </h5>
            <h5 v-else>&nbsp;</h5>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <router-view/>
      </el-main>
      <el-footer>
        <el-divider>&copy; 2019 木憧科技</el-divider>
      </el-footer>
    </el-container>
  </div>
</template>
<script>
  import { mapState } from 'vuex'
  export default {
    computed: {
        ...mapState([
        'loginUser'
      ])
    },
    methods: {
      logout () {
        let _this = this
        this.$confirm('确实要退出吗?', '操作确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (!_this.loginUser) {
            return
          }
          _this.$socket.logout()
          _this.$store.commit('logout')
          _this.$router.push({name: 'login'})
        })
      }
    }
  }
</script>
<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
}
.el-header {
  background-color: dimgray;
  color: white;
  text-align: left;
}
.el-header a {
  color:white;
  text-decoration: none;
}
</style>

<template>
  <div class="home">
    <el-row>
      <el-col :offset="3" :span="9">
        <img alt="Vue logo" src="../assets/background.jpg" width="90%;">
      </el-col>
      <el-col :span="6">
        <p style="margin:100px 0px 100px 0px;">云悠工作室是一个远程虚拟办公环境<br>致力于解决团队远程合作的考勤与沟通问题。</p>
        <p>
          <el-input
            v-model="user.loginName"
            style="width:200px;"
            type="text"
            placeholder="请输入用户名"
          />
        </p>
        <p>
          <el-input
            v-model="user.password"
            type="password"
            style="width:200px;"
            placeholder="请输入密码"
            @keyup.enter.native="login"
          />
        </p>    
        <el-button type="primary" @click="login">登录</el-button>
        <el-button type="primary" @click="$router.push({name: 'regist'})">注册</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import api from '@/api.js'
  export default {
    data () {
      return {
        user: {
          loginName: '',
          password: ''
        }
      }
    },
    methods: {
      login: function () {
        let _this = this
        if (!this.user.loginName || this.user.loginName.trim() === '') {
          this.$message.error('请输入用户名!')
          return
        }
        if (this.user.password === '') {
          this.$message.error('请输入密码!')
          return
        }
        api.login({loginName: this.user.loginName, password: this.user.password}).then(token => {
          _this.$store.commit('login', token)
          return api.getCurrentUser()
        }).then(user => {
          _this.$store.commit('user', user)
        //   return api.queryOnlines({codes: [user.srcUser.code]})
        // }).then(online => {
        //   if (online && online.items.length) {
        //     return _this.$confirm('当前用户已经在其它客户端登录，继续登录会导致其从该客户端自动登出，是否继续？')
        //   } else {
        //     return true
        //   }
        // }).then(() => {
        //   return api.getConfig()
        // }).then(config => {
        //   _this.$store.commit('config', config)
        //   if (_this.$socket.login(_this.$store.state.loginUser, _this.$store.state.config.socketServer)) {
        //     _this.$dictSvc.init()
        //     _this.$message.closeAll()
            _this.$router.push({name: 'office'})
        //   }
        }).catch(err => {
          _this.$store.commit('logout')
          if (err.message) {
            _this.$message.error(err.message)
          } else {
            if (err !== 'cancel') {
              _this.$message.error(err)
            }
          }
        })
      }
    }
  }
</script>
<style scoped>
  .home {
    background-color:#F6F6F6;
    padding-top: 100px;
    }
  .el-row {
      margin: 20px;
  }
</style>

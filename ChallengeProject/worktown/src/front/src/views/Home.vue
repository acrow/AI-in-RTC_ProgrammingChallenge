<template>
  <div class="home">
    <el-row>
      <el-col :offset="3" :span="9">
        <img alt="Vue logo" src="../assets/background.jpg" width="90%;">
      </el-col>
      <el-col :span="6">
        <p style="margin:200px 0px 100px 0px;">团队工作站是一个远程虚拟办公环境<br>致力于解决团队远程合作的考勤与沟通问题。</p>
        <el-button type="primary" @click="$router.push({name: 'login'})">登录</el-button>
        <el-button type="primary" @click="$router.push({name: 'regist'})">注册</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

export default {
  // name: 'home',
  // components: {
  //   HelloWorld
  // }
}
</script>
<style scoped>
.home {
  background-color:#F6F6F6;
  padding-top: 100px;
}
</style>
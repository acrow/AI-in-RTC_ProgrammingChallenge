<template>
  <div>
    <el-row>
      <el-col :sm="24" :md="12" :lg="8">
        <el-form :model="user" :rules="rules" ref="userForm" label-width="80px">
          <el-form-item
            label="姓名"
            prop="name">
            <el-input
            v-model="user.name"
            placeholder="请输入用于显示的名称"
            minlength="1"
            maxlength="10"
            show-word-limit
            clearable/>
          </el-form-item>
          <el-form-item
            label="登录名"
            prop="userName">
            <el-input
            v-model="user.userName"
            placeholder="请输入登录名"
            minlength="1"
            maxlength="20"
            show-word-limit
            clearable/>
          </el-form-item>
          <el-form-item
            label="密码"
            prop="password">
            <el-input
            v-model="user.password"
            type="password"
            placeholder="请输入密码"
            minlength="1"
            maxlength="10"
            show-word-limit
            show-password
            clearable/>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="userSave()">保存</el-button>
          </el-form-item>
        </el-form>
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
        name: '',
        userName: '',
        password: ''
      },
      rules: {
        name: [
            {required: true, message: '请输入显示姓名', trigger: 'blur'},
            {min: 1, max: 10, message: '长度在1~10个字符', trigger: 'blur'}
        ],
        userName: [
            {required: true, message: '请输入登录名', trigger: 'blur'},
            {min: 1, max: 20, message: '长度在1~20个字符', trigger: 'blur'}
        ],
        password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 1, max: 10, message: '长度在1~10个字符', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    userSave () {
      let _this = this
      this.$refs.userForm.validate(valid => {
        if (valid) {
          api.queryMember({userName: this.user.userName}).then(rst => {
            if (rst.items && rst.items.length) {
              throw new Error('用户名已经存在，请换一个再试试！')
            }
            return api.saveMember(_this.user)
          }).then( user => {
            _this.$message.success('注册成功，请登录！')
            _this.$router.push({name: 'login'})
          }).catch(err => {
            _this.$message.error(err.message)
          })
        }
      })
    }
  }
}
</script>
<style scoped>

</style>
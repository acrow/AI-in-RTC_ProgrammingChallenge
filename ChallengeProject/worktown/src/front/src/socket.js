
import Vue from 'vue'
import router from './router'
import store from './store'
import api from './api'
import { mapState } from 'vuex'

const MESSAGE_REQUEST = 'REQUEST'
const MESSAGE_CANCEL = 'CANCEL'
const MESSAGE_ACCEPT = 'ACCEPT'
const MESSAGE_REFUSE = 'REFUSE'
const MESSAGE_CLOSE = 'CLOSE'
const MESSAGE_ERROR = 'ERROR'
const MESSAGE_SYNC = 'SYNC'
const MESSAGE_OFF = 'OFF'

const State = {
  Waiting: 0,
  Asking: 1,
  BeAsking: 2,
  Helping: 3,
  BeHelping: 4
}

const socketInit = function (user, server) {
  let host = server || location.host
  let socket = new WebSocket(host + '/doctormanager?code=' + user.code)
  socket.onmessage = socketOnMessage // socket 绑定事件处理
  socket.onclose = e => {
    console.error(e)
    me.$bus.emit('socketOff') // 交给 app.vue 处理
  }
  socket.onerror = e => {
    // console.error(e)
  }
  return socket
}

const socketOnMessage = function (event) {
  let act = /(.*?)\((.*?)\)/.exec(event.data)[1]
  let para = /(.*?)\((.*?)\)/.exec(event.data)[2]
  switch (act) {
  case MESSAGE_REQUEST:
    onRequest(para)
    break
  case MESSAGE_CLOSE:
    onClose(para)
    break
  case MESSAGE_ACCEPT:
    onAccept(para)
    break
  case MESSAGE_REFUSE:
    onRefuse(para)
    break
  case MESSAGE_CANCEL:
    onCancel(para)
    break
  case MESSAGE_ERROR:
    onError(para)
    break
  case MESSAGE_SYNC:
    onSync(para)
    break
  case MESSAGE_OFF:
    onOff(para)
    break
  default:
    this.state = 0
    this.info = '当前没有远程协助。'
    break
  }
}
// 收到请求
const onRequest = function (data) {
  let request = JSON.parse(/,(.*)/.exec(data)[1])
  me.state = State.BeAsking
  api.getTreatment(request.treatmentId).then(treatment => {
    const h = me.$createElement
    me.cfm = me.$confirm(
      h('p', null, [
        '有患者需要您的远程协助, 是否接受协助请求?',
        h('br'),
        ' 请求医院：',
        h('b', null, treatment.requestHospitalName),
        h('br'),
        ' 请求医生：',
        h('b', null, treatment.requestDoctorName),
        h('br'),
        ' 就诊患者：',
        h('b', null, treatment.patientName),
        h('br'),
        ' 请求附言：',
        (request.memo || '无')
      ]),
      '远程协助请求',
      {
        confirmButtonText: '接受',
        cancelButtonText: '拒绝',
        closeOnClickModal: false,
        type: 'warning'
    }).then(() => {
      me.$store.commit('treatmentStart', treatment)
      me.$store.commit('patientLoad', {code: treatment.patientCode, name: treatment.patientName})
      me.accept()
    }).catch(() => {
      me.refuse()
    })
  })
}
// 收到接受
const onAccept = function (data) {
  me.state = State.BeHelping
  if (me.loading) {
    me.loading.close()
  }
  api.updateTreatmentStatus(me.treatment.id, 1).then(rst => {
    me.$store.commit('treatmentStart', rst)
    me.$message.success('提醒，远程协助已经开始！')
    me.$router.isSync = true

    setTimeout(() => { // 调用视频联动
      let path = me.config.videoServer
      if (path.indexOf('?', 0) > 0) {
        path += '&'
      } else {
        path += '?'
      }
      path += 'id=' + data + '&user=' + me.loginUser.name + '&rol=U'
      const url = encodeURI(path)
      console.log(url)
      window.open(url, '_blank')
    }, 1000)
    window.location.href = '#/studio/record'
  })
}
// 收到拒绝
const onRefuse = function (data) {
  me.state = State.Waiting
  me.$message.error('抱歉，对方拒绝了您的请求！')
  if (me.loading) {
    me.loading.close()
  }
}
// 收到结束
const onClose = function (data) {
  me.state = State.Waiting
  me.$store.commit('treatmentStop')
  me.$message.success('提醒，远程协助已经结束！')

  if (window.location.pathname !== '#/treatment') {
    window.location.href = '#/treatment'
  }
}
// 收到取消
const onCancel = function (data) {
  me.state = State.Waiting
  me.$message.success('提醒，远程协助申请已经取消！')
  let current = window.location.href
  window.location.href = window.location.href + '?canceled'
  window.location.href = current
}
// 收到错误
const onError = function (data) {
  if (me.loading && me.loading.visible) {
    me.loading.close()
  }
  me.state = State.Waiting
  me.$message.error(data.split(',')[2])
}
// 收到同步
let syncString = ''
const onSync = function (data) {
  data = data.replace(/（（（（（/g, '(')
  data = data.replace(/）））））/g, ')')
  if (!store.state.allowControl()) {
    let command = {}
    try {
      command = JSON.parse(data)
    } catch (error) {
      try {
        syncString += data
        command = JSON.parse(syncString)
        syncString = ''
      } catch (error) {
        return
      }
    }

    switch (command.action) {
    case 'go':
      me.$router.isSync = true
      me.$router.push({name: command.name, query: command.query})
      break
    case 'sync':
      me.$bus.emit('sync-' + command.name, command)
      break
    default:
      break
    }
  }
}
// 收到掉线
const onOff = function (data) {
  switch (me.state) {
  case State.Asking:
    me.$message.error({message: '不好，对方掉线了，申请被取消！', duration: 0, showClose: true})
    if (me.loading) {
      me.loading.close()
    }
    break
  case State.BeAsking:
    onCancel()
    break
  case State.Helping:
  case State.BeHelping:
    // 必须先删除treatment，否则无法访问api
    let treatmentId = me.$store.state.treatment.id
    me.$store.commit('treatmentStop')
    me.$message.error({message: '不好，对方掉线了，远程协助已经结束！', duration: 0, showClose: true})
    api.updateTreatmentStatus(treatmentId, 3).then(rst => {
    })
    me.state = State.Waiting
    if (window.location.pathname !== '#/err') {
      window.location.href = '#/err'
    }
    break
  default:
    break
  }
  me.state = State.Waiting
}

const me = new Vue({
  router,
  store,
  data () {
    return {
      state: State.Waiting,
      info: '',
      socket: null,
      loading: null,
      treatment: null
    }
  },
  computed: {
    stateName: function () {
      switch (this.state) {
      case State.Asking:
        return '请求中'
      case State.BeAsking:
        return '被请求中'
      case State.Helping:
        return '协助中'
      case State.BeHelping:
        return '被协助中'
      default:
        return '待机中'
      }
    },
    ...mapState([
      'config',
      'loginUser'
    ])
  },
  created: function () {
  },
  methods: {
    install (Vue) {
      Vue.prototype.$socket = this
    },
    login (user, server) { // 登录
      if (!user || !user.code) {
        this.$message.error('当前用户未设置，Socket登录取消!')
        return false
      }
      this.socket = socketInit(user, server)
      return true
    },
    logout () { // 登出
      this.$store.commit('logout')
      try {
        this.socket.close()
        this.socket = null
      } catch (e) {
        console.log(e)
      }
    },
    request (treatment, second, overtimeCallBack) { // 申请
      if (!second) {
        second = 20
      }
      if (!treatment) {
        this.$message.error('实时诊疗主记录未设置，申请取消!')
        return
      } else {
        this.treatment = treatment
      }
      this.$prompt('就诊患者（' + this.treatment.patientName + '），目标医生（' + this.treatment.treatmentDoctorName + ')，请输入请求附言：', '远程协助申请确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /.*/,
        inputErrorMessage: '最多100字。'
      }).then(({ value }) => {
        this.loading = this.$loading({
          lock: true,
          text: '已经向医生（' + this.treatment.treatmentDoctorName + '）发起远程协助申请，请耐心等待回复（' + second + '秒未回复自动退出） ……',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        this.state = State.Asking
        let request = {
          treatmentId: treatment.id,
          memo: value
        }
        this.socketSend(MESSAGE_REQUEST + '(' + treatment.treatmentDoctorCode + ',' + JSON.stringify(request) + ')')
        this.requestTimer = setTimeout(() => {
          if (me.loading && me.loading.visible) {
            this.cancel()
            this.loading.close()
            if (overtimeCallBack) {
              overtimeCallBack()
            }
          }
        }, second * 1000)
      })
    },
    cancel () { // 取消
      if (this.state === State.Asking) {
        this.socketSend(MESSAGE_CANCEL + '()')
        this.state = State.Waiting
      }
    },
    accept () { // 同意
      let _this = this

      if (this.state === State.BeAsking) {
        let meetingId = _this.loginUser.id
        if (_this.config.videoTestMeetingId) {
          meetingId = _this.config.videoTestMeetingId
        }
        this.socketSend(MESSAGE_ACCEPT + '(' + meetingId + ')')
        this.state = State.Helping
        setTimeout(() => { // 调用视频联动
          let path = me.config.videoServer
          if (path.indexOf('?', 0) > 0) {
            path += '&'
          } else {
            path += '?'
          }
          path += 'id=' + meetingId + '&user=' + me.loginUser.name + '&rol=U'
          const url = encodeURI(path)
          console.log(url)
          window.open(url, '_blank')
        }, 1000)
        window.location.href = '#/studio/record'
      }
    },
    refuse () { // 拒绝
      if (this.state === State.BeAsking) {
        this.socketSend(MESSAGE_REFUSE + '()')
        this.state = State.Waiting
      }
    },
    close () { // 完诊
      this.$store.commit('treatmentStop')
      if (this.state === State.Helping || this.state === State.BeHelping) {
        this.socketSend(MESSAGE_CLOSE + '()')
        this.state = State.Waiting
      }
    },
    sync (command) { // 同步
      if (store.state.allowControl()) {
        command = command.replace(/\(/g, '（（（（（')
        command = command.replace(/\)/g, '）））））')
        const size = 6000
        let times = parseInt(command.length / size) + 1
        for (let i = 0; i < times; i++) {
          let cmd = command.substr(i * size, size)
          this.socketSend(MESSAGE_SYNC + '(' + cmd + ')')
        }
      }
    },
    socketSend (msg) { // 发送消息（共通）
      try {
        if (this.socket.readyState === this.socket.OPEN) {
          this.socket.send(msg)
        }
      } catch (err) {
        console.error(err)
      }
    }
  }
})

export default me

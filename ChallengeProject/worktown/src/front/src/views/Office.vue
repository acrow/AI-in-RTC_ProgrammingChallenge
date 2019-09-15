<template>
  <div>
    <el-row>
      <el-col :span="8" :key="member.code" v-for="member in members">
        <el-card :body-style="{ padding: '10px' }" style="margin:10px;">
          <div style="padding: 10px;">
            <b>{{ member.name }}</b> <i class="el-icon-camera"  @click="snap()"/>
          </div>
          <img v-if="!member.isOnline" src="../assets/offline.png">
          <img v-if="member.isOnline && !member.isOpen" src="../assets/inOffice.png">
          <div v-bind:id="member.code" v-show="member.isOnline && member.isOpen" class="image"/>
          <div style="padding: 14px;">
            <div class="bottom clearfix">
              <el-switch
                :disabled="!member.isOnline || member.isChanging"
                v-model="member.isOpen"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="open(member)">
              </el-switch>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <canvas id='pic' style="width:200px;height:200px;display:none;"/>
    <el-input type="textarea" :rows="2" v-model="imgData" />
    <el-input type="textarea" :rows="2" v-model="para" />
  </div>
</template>
<script>  
import api from '@/api.js'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      client: AgoraRTC.createClient({ mode: 'live' }),
      team: null,
      members: [],
      myIndex: 0,
      imgData: null,
      para: null
    }
  },
  computed: {
    ...mapState([
      'loginUser'
    ])
  },
  created () {
    let _this = this
    _this.client.on('peer-online', function (evt) {
      let member = _this.getMember(evt.uid)
      _this.$set(member, 'isOnline', true)
    })
    _this.client.on('peer-leave', function (evt) {
      let member = _this.getMember(evt.uid)
      _this.$set(member, 'isOpen', false)
      _this.$set(member, 'isOnline', false)
    })
    _this.client.on('stream-added', function (evt) {
      var stream = evt.stream;
      console.log("New stream added: " + stream.getId());
      let member = _this.getMember(stream.getId())
      _this.$set(member, 'stream', stream)
      _this.client.subscribe(stream, function (err) {
        console.log("Subscribe stream failed", err)
      })
    })
    _this.client.on("stream-subscribed", function(evt) {
      var stream = evt.stream
      let member = _this.getMember(stream.getId())
      member.stream.play(member.code)
      _this.$set(member, 'isOpen', true)
    })
    _this.client.on("stream-removed", function(evt) {
      var stream = evt.stream
      let member = _this.getMember(stream.getId())
      _this.$set(member, 'stream', null)
      _this.$set(member, 'isOpen', false)
    })
    api.getTeam(this.loginUser.teamCode).then(team => {
      _this.team = team
      return api.queryTeamMembers(_this.loginUser.teamCode)
    }).then( members => {
      _this.members = members.items
      let member = _this.getMember(_this.loginUser.code)
      this.myIndex = member.orderIndex - 1
      member.isOnline = true
      member.isOpen = true
      this.client.init('0cd0b77c887f48c5911eef9bbcf28b4a', () => {
        console.log("AgoraRTC client initialized")
        _this.client.join(null, _this.loginUser.teamCode, _this.loginUser.code, (usrCode) => {
          console.log("user " + usrCode + " join")
          _this.members[_this.myIndex].stream = AgoraRTC.createStream({
            streamID: _this.loginUser.code,
            audio: true,
            video: true,
            screen: false
            })
          _this.members[_this.myIndex].stream.init(() => {
            _this.members[_this.myIndex].stream.play(_this.loginUser.code)
            _this.client.publish(_this.members[_this.myIndex].stream, err => {
              console.log("Publish local stream error: " + err);
            })
          })
        })
      })
    }).catch( err => {
      console.log(err)
    })
  },
  beforeDestroy () {
    this.client.leave()
  },
  methods: {
    getMember(code) {
      for (let i = 0; i < this.members.length; i++) {
        if (this.members[i].code === code) {
          return this.members[i]
        }
      }
    },
    open (member) {
      if ((member.orderIndex - 1)  !== this.myIndex) {
        return
      }
      if (member.isOpen) {
        this.$set(member, 'isChanging', true)
        member.stream.play(member.code)
        this.client.publish(member.stream)
        setTimeout(() => {
          member.isChanging = false
        }, 3000)
      } else {
        this.$set(member, 'isChanging', true)
        this.client.unpublish(member.stream)
        member.stream.stop(err => {
          console.log(err)
        })
        setTimeout(() => {
          member.isChanging = false
        }, 3000)
      }
    },
    snap () {
      let pic = document.getElementById('pic')
      let pc = pic.getContext('2d')
      let video = document.getElementById('video' + this.loginUser.code)
      if (video) {
        pc.drawImage(video, 0, 0, pic.width, pic.height)
        this.imgData = pic.toDataURL("image/png")
        let tm = Math.round(new Date()).toString().substr(0, 10)
        this.imgData = encodeURI('?app_id=2121189674&time_stamp=' + tm + '&nonce_str=123&group_ids=dys&person_id=0001&person_name=郭德纲&tag=无&image=' + this.imgData.substring(22))
      }
      api.proxy(this.imgData).then( rst=> {
        this.para = rst.sign
      })
    }
  }
}
</script>
<style scoped>
.image {
  width: 128px;
  height: 128px;
}
</style>
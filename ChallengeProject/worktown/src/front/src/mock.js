/* eslint-disable no-console */
// 引入mockjs
const Mock = require('mockjs')
// 获取 mock.Random 对象
const Random = Mock.Random
// mock一组数据

const OdmSocketServerPath = 'ws://192.168.0.101:8800'

// 返回值结构
const GetDefaultResult = function (obj, forceObj) {
  let rst = obj
  if (!forceObj) {
    if (obj instanceof Array) {
      rst = {
        pageindex: 1,
        pageSize: 10,
        items: obj
      }
    }
  }
  return {
    code: 0,
    message: '',
    context: rst
  }
}

// ************************** 字典 ************************** /
let groups = [
  {code: 'nk', text: '耐克'},
  {code: 'wk', text: '悟空'},
  {code: 'snk', text: '斯内克'},
  {code: 'gkb', text: '过客帮'},
  {code: 'jyt', text: '加油团'},
  {code: 'hlb', text: '红萝卜'}
]

const getDicts = function (para) {
  let parts = para.url.split('/')
  let dictType = ''
  dictType = parts[3]
  console.log('getDict:' + dictType)
  let result = []
  if (dictType === 'Department') {
    result = groups
  } 
  return GetDefaultResult(result)
}

// ************************** 用户 ************************** /
let members = []
const makeMembers = function () {
  let count = 6; // Random.integer(0, 100)
  for (let i = 0; i < count; i++) {
    let name = Random.cname()
    let member = {
      id: Random.increment(1),
      code: Random.id(), //  Random.csentence( min, max )
      name: name, // Random.cname() 随机生成一个常见的中文姓名
      pic: Random.dataImage('50x50', name.substr(0, 1)), // Random.dataImage( size, text ) 生成一段随机的 Base64 图片编码,
      groupCode: groups[Random.integer(0, groups.length - 1)].code,
    }
    if (members.length === 0) {
      member.code = '0001'
      member.name = '郭德纲'
    }

    if (members.length === 1) {
      member.code = '0002'
      member.name = '于谦'
      member.id = 88025
    }
    members.push(member)
  }
}
makeMembers()

const getMembers = function () {
  return GetDefaultResult(members)
}

const getMember = function (para) {
  let code = para.url.split('/')[3]
  for (let i = 0; i < members.length; i++) {
    const member = members[i]
    if (member.code === code) {
      return GetDefaultResult(member)
    }
  }
  return GetDefaultResult(null)
}

let currentUser = {}
const login = function (para) {
  currentUser = JSON.parse(para.body)
  return GetDefaultResult('eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySW5mbyI6eyJsb2dpbk5hbWUiOiJkb2N0b3IxIiwicGFzc3dvcmQiOiIqIiwiZGlzcGxheU5hbWUiOiLnrqHnkIblkZgiLCJlbmFibGVkIjp0cnVlLCJ1c2VyVHlwZURpY3QiOiIxIiwidHlwZUNvZGUiOiIwN0UxQThBNjVEMDhBRTcwIiwic3JjVXNlciI6eyJpZCI6MTIsImNvZGUiOiIwN0UxQThBNjVEMDhBRTcwIiwibmFtZSI6IueuoeeQhuWRmCIsInBvc2l0aW9uRGljdCI6IjIzMSIsImhvc3BpdGFsQ29kZSI6IkU1MkUzMzZFQjg2QkY4QTQiLCJob3NwaXRhbE5hbWUiOiLnpZ7lqIHmtYvor5XljLvpmaIyIiwiZGVwdENvZGUiOiIwNCIsImRlcHROYW1lIjoi5aSW56eRIn19LCJleHAiOjE1NjcxNzMxNjZ9.V1kgubvMJhz4douKbDgKqOiDPHSPvSExSF24sLv423Q')
}
const token = function (para) {
  return GetDefaultResult('eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySW5mbyI6eyJsb2dpbk5hbWUiOiJkb2N0b3IxIiwicGFzc3dvcmQiOiIqIiwiZGlzcGxheU5hbWUiOiLnrqHnkIblkZgiLCJlbmFibGVkIjp0cnVlLCJ1c2VyVHlwZURpY3QiOiIxIiwidHlwZUNvZGUiOiIwN0UxQThBNjVEMDhBRTcwIiwic3JjVXNlciI6eyJpZCI6MTIsImNvZGUiOiIwN0UxQThBNjVEMDhBRTcwIiwibmFtZSI6IueuoeeQhuWRmCIsInBvc2l0aW9uRGljdCI6IjIzMSIsImhvc3BpdGFsQ29kZSI6IkU1MkUzMzZFQjg2QkY4QTQiLCJob3NwaXRhbE5hbWUiOiLnpZ7lqIHmtYvor5XljLvpmaIyIiwiZGVwdENvZGUiOiIwNCIsImRlcHROYW1lIjoi5aSW56eRIn19LCJleHAiOjE1NjcxNzcwMTd9.fnxzTmSyvAiAWhrezmxiRimax7nvHUbh82Tz6U_omNY')
}
const GetUser = function () {
  if (currentUser.loginName === 'root') {
    return GetDefaultResult(members[0])
  } else {
    return GetDefaultResult(members[1])
  }
}

const GetConfig = function () {
  return GetDefaultResult({
    socketServer: OdmSocketServerPath,
    // videoServer: 'http://spontania.newwaychina.cn/spn/startSession.jsp',
    videoServer: '/static/agora/index.html?appId=0cd0b77c887f48c5911eef9bbcf28b4a',
    defaultPageSize: 20,
    reconnectOverTime: 60
  })
}

const GetOnlines = function (para) {
  let onlines = []
  // doctors.forEach(member => {
  //   if (Random.boolean()) {
  //     onlines.push({
  //       doctorCode: member.code,
  //       status: 'busy'
  //     })
  //   }
  // })
  // onlines.push({
  //   doctorCode: '0001',
  //   status: 'busy'
  // })
  return GetDefaultResult(onlines)
}

// ************************** 团队 ************************** /
const getGroups = function (para) {
  return GetDefaultResult(groups)
}
const getGroup = function (para) {
  return GetDefaultResult(groups[0])
}
const getGroupMembers = function (para) {
  return GetDefaultResult(members)
}

// ************************** 方法匹配 ************************** /
// Mock.mock( url, post/get , 返回的数据)；
Mock.mock(/\/api\/doctor\?.*/, 'get', getMembers)
Mock.mock(/\/api\/doctor\/[0-9]*?/, 'get', getMember)
Mock.mock(/\/api\/online\/docto\/*?/, 'get', GetOnlines)
Mock.mock(/\/api\/dict\/.*?/, 'get', getDicts)
Mock.mock(/\/api\/group$/, 'get', getGroups)
Mock.mock(/\/api\/group\/.*?$/, 'get', getGroup)
Mock.mock(/\/api\/group\/.*?\/members$/, 'get', getGroupMembers)
Mock.mock(/\/api\/login$/, 'post', login)
Mock.mock(/\/api\/login\/currentUser$/, 'get', GetUser)
Mock.mock(/\/api\/login\/config$/, 'get', GetConfig)
Mock.mock(/\/api\/login\/token$/, 'get', token)



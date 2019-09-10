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
let GroupCodes = [
  {code: 'nk', text: '耐克'},
  {code: 'wk', text: '悟空'},
  {code: 'snk', text: '斯内克'},
  {code: 'gkb', text: '过客帮'},
  {code: 'jyt', text: '加油团'},
  {code: 'hlb', text: '红萝卜'}
]

let GenderTypDicts = [
  {code: '0', text: '不限'},
  {code: '1', text: '男'},
  {code: '2', text: '女'}
]

let DoctorTypeDicts = [
  {code: 0, text: '实习医生'},
  {code: 1, text: '普通医生'},
  {code: 2, text: '副主任医师'},
  {code: 3, text: '主任医师'}
]

let TreatmentStatusDicts = [
  {code: '0', text: '未接通'},
  {code: '1', text: '进行中'},
  {code: '2', text: '已结束'},
  {code: '3', text: '已中断'}

]

let MedicalCheckStatusDicts = [
  {code: '0', text: '已开具'},
  {code: '1', text: '已收费'},
  {code: '2', text: '已检查'},
  {code: '3', text: '看结果'}
]
let MedicalCheckTypeDicts = [
  {code: 'jc', text: '检查'},
  {code: 'zl', text: '治疗'},
  {code: 'hy', text: '化验'},
  {code: 'xd', text: '心电图'}]

let DrugTypeDicts = [
  {code: 'xy', text: '西药'},
  {code: 'zcy', text: '中成药'},
  {code: 'zcy', text: '中草药'}]

let DrugFrequencyDicts = [
  {code: 'one', text: '每日1次'},
  {code: 'two', text: '每日2次'},
  {code: 'three', text: '每日3次'}]

let DrugUsageDicts = [
  {code: 'kf', text: '口服'},
  {code: 'zs', text: '注射'},
  {code: 'yf', text: '外敷'}]

let HerbalTypeDicts = [
  {code: 'xy', text: '植物'},
  {code: 'zcy', text: '动物'},
  {code: 'zcy', text: '毒麻'}]

let HerbalDecoctionMethodDicts = [
  {code: 'jf', text: '温水煎服'},
  {code: 'pf', text: '冷水泡服'},
  {code: 'ym', text: '研磨'}]

let HerbalFrequencyDicts = [
  {code: 'one', text: '每日1次'},
  {code: 'two', text: '每日2次'},
  {code: 'three', text: '每日3次'}]

let HerbalUsageDicts = [
  {code: 'kf', text: '口服'},
  {code: 'zs', text: '注射'},
  {code: 'yf', text: '外敷'}]

let DiagnosisTypeDicts = [
  {code: 'xy', text: '西医'},
  {code: 'zy', text: '中医'}
]

let DiagnosisCustomTypeDicts = [
  {code: 'mb', text: '常见慢病三十种'},
  {code: 'zd', text: '重大疾病'},
  {code: 'crb', text: '传染病'}
]

const getDicts = function (para) {
  let parts = para.url.split('/')
  let dictType = ''
  if (parts.length > 4) {
    dictType = parts[2].replace(parts[2][0], parts[2][0].toUpperCase()) + '-' + parts[4]
  } else {
    dictType = parts[3]
  }
  console.log('getDict:' + dictType)
  let result = []
  if (dictType === 'Department') {
    result = GroupCodes
  } else if (dictType === 'Gender') {
    result = GenderTypDicts
  } else if (dictType === 'DoctorPosition') {
    result = DoctorTypeDicts
  } else if (dictType === 'Treatment-Status') {
    result = TreatmentStatusDicts
  } else if (dictType === 'MedicalCheck-Status') {
    result = MedicalCheckStatusDicts
  } else if (dictType === 'MedicalCheck-Type') {
    result = MedicalCheckTypeDicts
  } else if (dictType === 'Drug-Type') {
    result = DrugTypeDicts
  } else if (dictType === 'Drug-Frequency') {
    result = DrugFrequencyDicts
  } else if (dictType === 'Drug-Usage') {
    result = DrugUsageDicts
  } else if (dictType === 'Herbal-DecoctionMethod') {
    result = HerbalDecoctionMethodDicts
  } else if (dictType === 'Herbal-Frequency') {
    result = HerbalFrequencyDicts
  } else if (dictType === 'Herbal-Usage') {
    result = HerbalUsageDicts
  } else if (dictType === 'MedicalRecord-DiagnosisType') {
    result = DiagnosisTypeDicts
  } else if (dictType === 'MedicalRecord-CustomType') {
    result = DiagnosisCustomTypeDicts
  }
  return GetDefaultResult(result)
}

// ************************** 医生 ************************** /
let members = []
const makeMembers = function () {
  let count = Random.integer(0, 100)
  for (let i = 0; i < count; i++) {
    let name = Random.cname()
    let member = {
      id: Random.increment(1),
      code: Random.id(), //  Random.csentence( min, max )
      name: name, // Random.cname() 随机生成一个常见的中文姓名
      pic: Random.dataImage('50x50', name.substr(0, 1)), // Random.dataImage( size, text ) 生成一段随机的 Base64 图片编码,
      positionDict: DoctorTypeDicts[Random.integer(0, DoctorTypeDicts.length - 1)].code,
      groupCode: GroupCodes[Random.integer(0, GroupCodes.length - 1)].code,
      genderDict: GenderTypDicts[Random.integer(1, GenderTypDicts.length - 1)].code,
      hospitalName: Random.cword(2, 10) + '医院',
      hospital: Random.id(),
      odmAddress: OdmSocketServerPath,
      date: Random.date() + ' ' + Random.time() // Random.date()指示生成的日期字符串的格式,默认为yyyy-MM-dd；Random.time() 返回一个随机的时间字符串
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

const getDocs = function () {
  return GetDefaultResult(members)
}

const getDoc = function (para) {
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
  // return GetDefaultResult({
  //   id: Random.integer(1, 10000),
  //   loginName: Random.name(5).split(' ')[2],
  //   password: Random.word(5),
  //   displayName: Random.cname(),
  //   roleDict: '0',
  //   enabled: true,
  //   userType: 1,
  //   typeCode: '123456'
  // })
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

// ************************** 医院 ************************** /
const getHosps = function (para) {
  let count = Random.integer(1, 30)
  let rst = []
  for (let i = 0; i < count; i++) {
    let hos = {
      code: Random.id(),
      text: Random.cword(2, 10),
      level: Random.integer(1, 3)
    }
    rst.push(hos)
  }
  return GetDefaultResult(rst)
}

// ************************** 患者 ************************** /
let patients = []
const makePatients = function () {
  let count = Random.integer(1, 10)
  for (let i = 0; i < count; i++) {
    let name = Random.cname()
    let paitent = {
      id: Random.increment(),
      code: Random.word(10), //  Random.csentence( min, max )
      name: name, // Random.cname() 随机生成一个常见的中文姓名
      pic: Random.dataImage('50x50', name.substr(0, 1)), // Random.dataImage( size, text ) 生成一段随机的 Base64 图片编码,
      city: Random.city(),
      genderDict: GenderTypDicts[Random.integer(1, GenderTypDicts.length - 1)].code,
      charge: '保险',
      insuranceDict: Random.cword(2, 10) + '保险',
      birthday: Random.date()
    }
    patients.push(paitent)
  }
}
makePatients()

const getPatients = function (para) {
  return GetDefaultResult(patients)
}
const getPatient = function (para) {
  return GetDefaultResult(patients[0])
}

// ************************** 主记录 ************************** /
let treatments = []
const makeTreatments = function () {
  let count = Random.integer(3, 10)
  for (let i = 0; i < count; i++) {
    let treat = {
      id: Random.integer(1, 10000),
      statusEnum: Random.integer(0, 3),
      startTime: Random.datetime(),
      endTime: Random.datetime(),
      requestHospitalName: Random.cword(2, 10),
      requestDoctorName: members[0].name,
      treatmentHospitalName: Random.cword(2, 10),
      treatmentDoctorName: Random.cname(),
      patientCode: Random.cword(5),
      patientName: Random.cname(),
      diagnosis: Random.cword(3, 20)
    }
    treatments.push(treat)
  }
  treatments[0].id = 1
  treatments[0].requestDoctorCode = '0001'
  treatments[0].requestDoctorName = '郭德纲'
  treatments[0].treatmentDoctorCode = '0002'
  treatments[0].treatmentDoctorName = '于谦'
}
makeTreatments()

const getTreatments = function (para) {
  return GetDefaultResult(treatments)
}

const getTreatment = function (para) {
  return GetDefaultResult(treatments[0])
}
const saveTreatment = function (para) {
  let treatment = JSON.parse(para.body)
  if (!treatment.statusEnum || treatment.statusEnum < 1) {
    treatment.statusEnum = 1
  }
  if (!treatment.id) {
    treatment.id = 1
    treatments.push(treatment)
  } else {
    for (let index = 0; index < treatments.length; index++) {
      const element = treatments[index]
      if (element.id === treatment.id) {
        treatments.splice(index, 1, treatment)
        break
      }
    }
  }
  return GetDefaultResult(treatment)
}
const updateTreatmentStatus = function (para) {
  return GetDefaultResult(treatments[0])
}
// ************************** 门诊病历 ************************** /
let medicalRecords = []
const getMedicalRecords = function (para) {
  console.log(para)
  let treatmentId = para.url.split('=')[1]
  if (treatmentId === '1') {
    return GetDefaultResult(medicalRecords)
  } else {
    return GetDefaultResult([{
      id: Random.integer(1, 1000),
      treatmentId: treatmentId,
      visitFirst: Random.boolean(),
      chiefComplaints: Random.csentence(),
      presentIllness: Random.csentence(),
      pastHistory: Random.csentence(),
      allergicHistory: Random.csentence(),
      auxiliaryInspection: Random.csentence(),
      doctorAdvice: Random.csentence(),
      sphygmus: Random.integer(10, 200),
      bodyTemperature: Random.integer(20, 80),
      breath: Random.integer(20, 80),
      bloodPressureSystolic: Random.integer(80, 160),
      bloodPressureDiastolic: Random.integer(20, 100)
    }])
  }
}
// const getMedicalRecord = function (para) {
//   return GetDefaultResult(medicalRecords[0])
// }

const saveMedicalRecord = function (para) {
  let rcd = JSON.parse(para.body)
  if (!rcd.id) {
    rcd.id = Random.integer(1, 10000)
    medicalRecords.push(rcd)
  } else {
    medicalRecords[0] = rcd
  }
  return GetDefaultResult(medicalRecords[0])
}

let diseaseStanards = []
const makeDiseaseStanards = function () {
  let count = Random.integer(1, 20)
  for (let i = 0; i < count; i++) {
    let disease = {
      id: Random.integer(1, 10000),
      code: Random.word(15),
      name: Random.cword(2, 15),
      mnemonic: Random.word(1, 10),
      diagnosisTypeDict: DiagnosisTypeDicts[Random.integer(0, 1)].code
    }
    diseaseStanards.push(disease)
  }
}
makeDiseaseStanards()

const getDiseaseStandards = function (para) {
  return GetDefaultResult(diseaseStanards)
}

const getDiseaseStandard = function (para) {
  return GetDefaultResult(diseaseStanards[0])
}

let diagnosiss = []
const makeDiagnosiss = function () {
  let count = 2
  for (let i = 0; i < count; i++) {
    let parentId = Random.integer(0, i)
    let level = 1
    if (parentId) {
      level = 2
    }
    let diagnosis = {
      id: i + 1,
      parentId: parentId,
      diseaseStandardCode: Random.word(15),
      diseaseStandardName: Random.cword(2, 15),
      diseaseStandardMnemonic: Random.word(1, 10),
      diseaseStandardDiagnosisTypeDict: DiagnosisTypeDicts[Random.integer(0, 1)].code,
      diagnosisDate: Random.date(),
      medicalRecordId: Random.integer(1, 10),
      level: level,
      seqNo: Random.integer(0, 2)
    }
    diagnosiss.push(diagnosis)
  }
}
makeDiagnosiss()

const getDiagnosiss = function (para) {
  return GetDefaultResult(diagnosiss)
}

const getDiagnosis = function (para) {
  return GetDefaultResult(diagnosiss[0])
}

const saveDiagnosis = function (para) {
  let diagnosis = JSON.parse(para.body)
  if (!diagnosis.statusEnum) {
    diagnosis.statusEnum = 0
  }
  if (!diagnosis.id) {
    diagnosis.id = diagnosiss.length + 1
    diagnosis.createTime = new Date()
    diagnosiss.push(diagnosis)
  } else {
    for (let index = 0; index < diagnosiss.length; index++) {
      const element = diagnosiss[index]
      if (element.id === diagnosis.id) {
        diagnosiss.splice(index, 1, diagnosis)
        break
      }
    }
  }
  return GetDefaultResult(diagnosis)
}

const delDiagnosis = function (para) {
  let prop = decodeURIComponent(para.url)
  let id = /\/([0-9]+?)$/.exec(prop)[1]
  for (let index = 0; index < diagnosiss.length; index++) {
    const element = diagnosiss[index]
    if (element.id === Number(id)) {
      diagnosiss.splice(index, 1)
      break
    }
  }
  return GetDefaultResult(null)
}

let recordAssists = []
const makeRecordAssists = function () {
  let count = 5
  for (let i = 0; i < count; i++) {
    let assist = {
      id: Random.integer(1, 100000),
      fieldEnum: Random.integer(1, 4),
      assistTypeDict: Random.cword(2, 10),
      name: Random.cword(2, 10),
      content: Random.csentence(2, 50),
      groupCode: GroupCodes[Random.integer(0, 5)].code,
      hospitalCode: Random.integer(1, 40),
      doctorCode: '0002',
      seqNo: Random.integer(100)
    }
    recordAssists.push(assist)
    let assist0 = {
      id: Random.integer(1, 100000),
      fieldEnum: Random.integer(1, 4),
      assistTypeDict: Random.cword(2, 10),
      name: Random.cword(2, 10),
      content: Random.csentence(2, 50),
      groupCode: GroupCodes[Random.integer(0, 5)].code,
      hospitalCode: Random.integer(1, 40),
      doctorCode: null,
      seqNo: Random.integer(100)
    }
    recordAssists.push(assist0)
  }
}
makeRecordAssists()

const getRecordAssists = function (para) {
  let prop = decodeURIComponent(para.url)
  let part = prop.split('?')[1]
  let rst = []
  if (part.indexOf('doctorCode') >= 0) {
    recordAssists.forEach(ass => {
      if (ass.doctorCode) {
        rst.push(ass)
      }
    })
  } else {
    let group = part.split('=')[3].split('&')[0]
    recordAssists.forEach(ass => {
      if (group === ass.groupCode) {
        rst.push(ass)
      }
    })
  }
  return GetDefaultResult(rst)
}

const getRecordAssistTypes = function (para) {
  return GetDefaultResult(GroupCodes)
}

// ************************** 检查检验 ************************** /
let checkStands = []
const makeCheckStands = function () {
  let count = Random.integer(1, 20)
  for (let i = 0; i < count; i++) {
    let check = {
      id: Random.integer(1, 10000),
      code: Random.word(15),
      name: Random.cword(2, 15),
      mnemonic: Random.word(1, 10),
      typeDict: MedicalCheckTypeDicts[Random.integer(0, 3)].code,
      groupCode: GroupCodes[Random.integer(0, 1)].code
    }
    checkStands.push(check)
  }
}
makeCheckStands()

const getMedicalCheckStandards = function (para) {
  return GetDefaultResult(checkStands)
}

const getMedicalCheckStandard = function (para) {
  return GetDefaultResult(checkStands[0])
}

let medicalChecks = []
const makeMedicalChecks = function () {
  let count = Random.integer(1, 20)
  for (let i = 0; i < count; i++) {
    let check = {
      id: Random.integer(1, 100000),
      statusEnum: Random.integer(1, 3),
      standardCode: Random.cword(2, 10),
      standardName: Random.cword(2, 10),
      standardMnemonic: Random.cword(2, 10),
      standardTypeDict: MedicalCheckTypeDicts[Random.integer(0, 3)].code,
      standardGroupCode: GroupCodes[Random.integer(0, 1)].code,
      quantity: Random.integer(1, 2),
      treatmentId: Random.integer(1, 100),
      symptom: Random.cword(20),
      parts: Random.cword(10),
      memo: Random.cword(20),
      createTime: Random.datetime()
    }
    medicalChecks.push(check)
  }
}
makeMedicalChecks()

const getMedicalChecks = function (para) {
  console.log(para)
  return GetDefaultResult(medicalChecks)
}

const saveMedicalCheck = function (para) {
  let check = JSON.parse(para.body)
  if (!check.statusEnum) {
    check.statusEnum = 0
  }
  if (!check.id) {
    check.id = Random.integer(1, 10000)
    check.createTime = new Date()
    medicalChecks.push(check)
  } else {
    for (let index = 0; index < medicalChecks.length; index++) {
      const element = medicalChecks[index]
      if (element.id === check.id) {
        medicalChecks.splice(index, 1, check)
        break
      }
    }
  }
  return GetDefaultResult(check)
}

const delMedicalCheck = function (para) {
  let prop = decodeURIComponent(para.url)
  let id = /\/([0-9]+?)$/.exec(prop)[1]
  for (let index = 0; index < medicalChecks.length; index++) {
    const element = medicalChecks[index]
    if (element.id === Number(id)) {
      medicalChecks.splice(index, 1)
      break
    }
  }
  return GetDefaultResult(null)
}
const copyMedicalCheck = function (para) {
  return GetDefaultResult(medicalChecks[1])
}
// ************************** 药品 ************************** /
let drugStands = []
const makeDrugStands = function () {
  let count = Random.integer(1, 20)
  for (let i = 0; i < count; i++) {
    let check = {
      id: Random.integer(1, 10000),
      code: Random.word(15),
      name: Random.cword(2, 15),
      mnemonic: Random.word(1, 10),
      typeDict: DrugTypeDicts[Random.integer(0, 2)].code,
      dosage: Random.integer(1, 40),
      dosageMin: Random.integer(40, 70),
      dosageMax: Random.integer(70, 100),
      unit: Random.word(1),
      frequencyDict: DrugFrequencyDicts[Random.integer(0, 2)].code,
      usageDict: DrugUsageDicts[Random.integer(0, 2)].code
    }
    drugStands.push(check)
  }
}
makeDrugStands()

const getDrugStandards = function (para) {
  return GetDefaultResult(drugStands)
}

const getDrugStandard = function (para) {
  return GetDefaultResult(drugStands[0])
}

let drugs = []
const makeDrugs = function () {
  let count = Random.integer(1, 20)
  for (let i = 0; i < count; i++) {
    let check = {
      id: Random.integer(1, 100000),
      statusEnum: Random.integer(1, 3),
      standardCode: Random.cword(2, 10),
      standardName: Random.cword(2, 10),
      standardMnemonic: Random.cword(2, 10),
      standardTypeDict: DrugTypeDicts[Random.integer(0, 2)].code,
      standardDosage: Random.integer(1, 40),
      standardUnit: Random.word(1),
      standardUsageDict: DrugUsageDicts[Random.integer(0, 2)].code,
      frequencyDict: DrugFrequencyDicts[Random.integer(0, 2)].code,
      days: Random.integer(1, 30),
      dosage: Random.integer(1, 100),
      treatmentId: Random.integer(1, 100),
      symptom: Random.cword(20),
      parts: Random.cword(10),
      memo: Random.cword(20),
      modifyDate: Random.datetime(),
      groupNo: Random.integer(0, 2)
    }
    drugs.push(check)
  }
}
makeDrugs()

const getDrugs = function (para) {
  console.log(para)
  return GetDefaultResult(drugs)
}

const saveDrug = function (para) {
  let check = JSON.parse(para.body)
  if (!check.statusEnum || check.statusEnum < 1) {
    check.statusEnum = 1
  }
  if (!check.id) {
    check.id = Random.integer(1, 10000)
    check.createTime = new Date()
    drugs.push(check)
  } else {
    for (let index = 0; index < drugs.length; index++) {
      const element = drugs[index]
      if (element.id === check.id) {
        drugs.splice(index, 1, check)
        break
      }
    }
  }
  return GetDefaultResult(check)
}

const delDrug = function (para) {
  let prop = decodeURIComponent(para.url)
  let id = /\/([0-9]+?)$/.exec(prop)[1]
  for (let index = 0; index < drugs.length; index++) {
    const element = drugs[index]
    if (element.id === Number(id)) {
      drugs.splice(index, 1)
      break
    }
  }
  return GetDefaultResult(null)
}
const copyDrug = function (para) {
  return GetDefaultResult(drugs[1])
}

const groupDrug = function (para) {
  return GetDefaultResult(null)
}

let batchs = []
const makeBatchs = function (para) {
  let count = Random.integer(1, 20)
  for (let i = 0; i < count; i++) {
    let batch = {
      id: Random.increment(1),
      name: Random.cword(1, 10),
      doctorCode: Random.integer(0, 1),
      hospitalCode: Random.id(),
      groupCode: GroupCodes[Random.integer(0, 5)].code,
      items: []
    }
    let countItems = Random.integer(1, 20)
    for (let i = 0; i < countItems; i++) {
      let item = {
        id: Random.integer(1, 100000),
        batchId: batch.id,
        standardCode: Random.cword(2, 10),
        standardName: Random.cword(2, 10),
        standardMnemonic: Random.cword(2, 10),
        standardTypeDict: DrugTypeDicts[Random.integer(0, 2)].code,
        standardDosage: Random.integer(1, 40),
        standardUnit: Random.word(1),
        standardUsageDict: DrugUsageDicts[Random.integer(0, 2)].code,
        frequencyDict: DrugFrequencyDicts[Random.integer(0, 2)].code,
        days: Random.integer(1, 30),
        dosage: Random.integer(1, 100),
        treatmentId: Random.integer(1, 100),
        symptom: Random.cword(20),
        parts: Random.cword(10),
        memo: Random.cword(20),
        createDate: Random.datetime(),
        updateDate: Random.datetime()
      }
      batch.items.push(item)
    }
    batchs.push(batch)
  }
}
makeBatchs()

const getBatchs = function (params) {
  let rst = []
  if (params.url.indexOf('doctorCode') >= 0) {
    batchs.forEach(batch => {
      if (batch.doctorCode) {
        rst.push(batch)
      }
    })
  } else if (params.url.indexOf('groupCode') >= 0) {
    let groupCode = params.url.split('groupCode=')[1]
    batchs.forEach(batch => {
      if (batch.groupCode === groupCode) {
        rst.push(batch)
      }
    })
  }
  return GetDefaultResult(rst)
}

const saveBatch = function (params) {
  return GetDefaultResult(batchs[0])
}

const delBatch = function (params) {
  return GetDefaultResult(null)
}

const applyBatch = function (params) {
  let rst = []
  let pars = params.url.split('/')
  let treatId = pars[pars.length - 2]
  let batchId = pars[pars.length - 1]
  for (let i = 0; i < batchs.length; i++) {
    const batch = batchs[i]
    if (batch.id.toString() === batchId.toString()) {
      batch.items.forEach(item => {
        item.treatmentId = treatId
        rst.push(item)
      })
    }
  }
  return GetDefaultResult(rst, true)
}

// ************************** 草药 ************************** /
let herbalStands = []
const makeHerbalStands = function () {
  let count = Random.integer(1, 20)
  for (let i = 0; i < count; i++) {
    let check = {
      id: Random.integer(1, 10000),
      code: Random.word(15),
      name: Random.cword(2, 5),
      mnemonic: Random.word(1, 10),
      typeDict: HerbalTypeDicts[Random.integer(0, 2)].code,
      dosage: Random.integer(1, 40),
      dosageMin: Random.integer(40, 70),
      dosageMax: Random.integer(70, 100),
      unit: Random.word(1),
      frequencyDict: HerbalFrequencyDicts[Random.integer(0, 2)].code,
      usageDict: HerbalUsageDicts[Random.integer(0, 2)].code,
      decoctionMethodDict: HerbalDecoctionMethodDicts[Random.integer(0, 2)].code
    }
    herbalStands.push(check)
  }
}
makeHerbalStands()
const getHerbalStandards = function (para) {
  return GetDefaultResult(herbalStands)
}

const getHerbalStandard = function (para) {
  return GetDefaultResult(herbalStands[0])
}

let herbalRps = []
const makeHerbalRps = function () {
  let count = Random.integer(1, 20)
  for (let i = 0; i < count; i++) {
    let rp = {
      id: Random.integer(1, 100000),
      decoctionMethodDict: HerbalDecoctionMethodDicts[Random.integer(0, 2)].code,
      usageDict: HerbalUsageDicts[Random.integer(0, 2)].code,
      dosage: Random.integer(1, 3),
      unit: Random.word(1),
      frequencyDict: HerbalFrequencyDicts[Random.integer(0, 2)].code,
      quantityPerDay: Random.integer(1, 4),
      days: Random.integer(1, 20),
      treatmentId: Random.integer(1, 100),
      statusEnum: Random.integer(1, 3),
      issueDoctorCode: Random.cword(10),
      issueDoctorName: Random.cname(),
      items: []
    }
    let icount = Random.integer(1, 20)
    for (let j = 0; j < icount; j++) {
      let herbal = {
        id: Random.integer(1, 100000),
        rpId: rp.id,
        standardCode: Random.word(10),
        standardName: Random.cword(2, 5),
        standardMnemonic: Random.word(1, 20),
        standardTypeDict: HerbalTypeDicts[Random.integer(0, 2)].code,
        standardUnit: Random.word(1),
        weight: Random.integer(1, 100),
        decoctionMethodDict: null
      }
      rp.items.push(herbal)
    }
    rp.items[Random.integer(0, rp.items.length - 1)].decoctionMethodDict = HerbalDecoctionMethodDicts[Random.integer(0, 2)].code
    herbalRps.push(rp)
  }
}
makeHerbalRps()

const getHerbalRps = function (para) {
  console.log(para)
  return GetDefaultResult(herbalRps)
}

const getHerbalRp = function (para) {
  let prop = decodeURIComponent(para.url)
  let id = /\/([0-9]+?)$/.exec(prop)[1]
  let rst = {}
  for (let i = 0; i < herbalRps.length; i++) {
    let rp = herbalRps[i]
    if (Number(id) === rp.id) {
      rst = rp
      break
    }
  }
  return GetDefaultResult(rst)
}

const saveHerbalRp = function (para) {
  let rp = JSON.parse(para.body)
  if (!rp.statusEnum || rp.statusEnum < 1) {
    rp.statusEnum = 1
  }
  if (!rp.id) {
    rp.id = Random.integer(1, 10000)
    rp.createTime = new Date()
    herbalRps.push(rp)
  } else {
    for (let index = 0; index < herbalRps.length; index++) {
      const element = herbalRps[index]
      if (element.id === rp.id) {
        herbalRps.splice(index, 1, rp)
        break
      }
    }
  }
  return GetDefaultResult(rp)
}

const delHerbalRp = function (para) {
  let prop = decodeURIComponent(para.url)
  let id = /\/([0-9]+?)$/.exec(prop)[1]
  for (let index = 0; index < herbalRps.length; index++) {
    const element = herbalRps[index]
    if (element.id === Number(id)) {
      herbalRps.splice(index, 1)
      break
    }
  }
  return GetDefaultResult(null)
}

const getHerbals = function (para) {
  console.log(para)
  let id = para.url.split('=')[1]
  let rst = herbalRps[0].items
  herbalRps.forEach(rp => {
    if (rp.id.toString() === id.toString()) {
      if (!rp.items) {
        rp.items = []
      }
      rst = rp.items
      return true
    }
  })
  return GetDefaultResult(rst)
}

const saveHerbal = function (para) {
  let herbal = JSON.parse(para.body)
  if (!herbal.statusEnum || herbal.statusEnum < 1) {
    herbal.statusEnum = 1
  }
  herbalRps.forEach((element) => {
    if (element.id === herbal.rpId) {
      if (!herbal.id) {
        herbal.id = Random.integer(1, 10000)
        herbal.createTime = new Date()
        if (!element.items) {
          element.items = []
        }
        element.items.push(herbal)
      } else {
        for (let index = 0; index < element.items.length; index++) {
          const item = element.items[index]
          if (item.id === herbal.id) {
            element.items.splice(index, 1, herbal)
            break
          }
        }
      }
    }
  })
  return GetDefaultResult(herbal)
}

const delHerbal = function (para) {
  let prop = decodeURIComponent(para.url)
  let id = /\/([0-9]+?)$/.exec(prop)[1]
  herbalRps.forEach((element) => {
    for (let index = 0; index < element.items.length; index++) {
      const item = element.items[index]
      if (item.id === Number(id)) {
        element.items.splice(index, 1)
        break
      }
    }
  })
  return GetDefaultResult(null)
}

let herbalFormulations = []
const makeHerbalFormulations = function () {
  let count = Random.integer(1, 20)
  for (let i = 0; i < count; i++) {
    let rp = {
      id: Random.integer(1, 100000),
      decoctionMethodDict: HerbalDecoctionMethodDicts[Random.integer(0, 2)].code,
      usageDict: HerbalUsageDicts[Random.integer(0, 2)].code,
      dosage: Random.integer(1, 3),
      unit: Random.word(1),
      frequencyDict: HerbalFrequencyDicts[Random.integer(0, 2)].code,
      quantityPerDay: Random.integer(1, 4),
      days: Random.integer(1, 20),
      name: Random.cword(1, 20),
      doctorCode: Random.word(10),
      groupCode: GroupCodes[Random.integer(0, 4)],
      hospitalCode: Random.word(10),
      items: []
    }
    let icount = Random.integer(1, 20)
    for (let j = 0; j < icount; j++) {
      let herbal = {
        id: Random.integer(1, 100000),
        rpId: rp.id,
        standardCode: Random.word(10),
        standardName: Random.cword(2, 5),
        standardMnemonic: Random.word(1, 20),
        standardTypeDict: HerbalTypeDicts[Random.integer(0, 2)].code,
        standardUnit: Random.word(1),
        weight: Random.integer(1, 100),
        usageDict: HerbalUsageDicts[Random.integer(0, 2)].code
      }
      rp.items.push(herbal)
    }
    rp.items[Random.integer(0, rp.items.length - 1)].decoctionMethodDict = HerbalDecoctionMethodDicts[Random.integer(0, 2)].code
    herbalFormulations.push(rp)
  }
}
makeHerbalFormulations()

const getHerbalFormulations = function (para) {
  console.log(para)
  return GetDefaultResult(herbalFormulations)
}

const getHerbalFormulation = function (para) {
  let prop = decodeURIComponent(para.url)
  let id = /\/([0-9]+?)$/.exec(prop)[1]
  let rst = {}
  for (let i = 0; i < herbalFormulations.length; i++) {
    let rp = herbalFormulations[i]
    if (Number(id) === rp.id) {
      rst = rp
      break
    }
  }
  return GetDefaultResult(rst)
}

const saveHerbalFormulation = function (para) {
  let rp = JSON.parse(para.body)
  if (!rp.statusEnum || rp.statusEnum < 1) {
    rp.statusEnum = 1
  }
  if (!rp.id) {
    rp.id = Random.integer(1, 10000)
    rp.createTime = new Date()
    herbalFormulations.push(rp)
  } else {
    for (let index = 0; index < herbalFormulations.length; index++) {
      const element = herbalFormulations[index]
      if (element.id === rp.id) {
        herbalFormulations.splice(index, 1, rp)
        break
      }
    }
  }
  return GetDefaultResult(rp)
}

const delHerbalFormulation = function (para) {
  let prop = decodeURIComponent(para.url)
  let id = /\/([0-9]+?)$/.exec(prop)[1]
  for (let index = 0; index < herbalFormulations.length; index++) {
    const element = herbalFormulations[index]
    if (element.id === Number(id)) {
      herbalFormulations.splice(index, 1)
      break
    }
  }
  return GetDefaultResult(null)
}

// ************************** 方法匹配 ************************** /
// Mock.mock( url, post/get , 返回的数据)；
Mock.mock(/\/api\/doctor\?.*/, 'get', getDocs)
Mock.mock(/\/api\/doctor\/[0-9]*?/, 'get', getDoc)
Mock.mock(/\/api\/online\/docto\/*?/, 'get', GetOnlines)

Mock.mock(/\/api\/dict\/.*?/, 'get', getDicts)
Mock.mock(/\/api\/treatment\/dict\/.*?/, 'get', getDicts)
Mock.mock(/\/api\/medicalCheck\/dict\/.*?/, 'get', getDicts)
Mock.mock(/\/api\/drug\/dict\/.*?/, 'get', getDicts)
Mock.mock(/\/api\/herbal\/dict\/.*?/, 'get', getDicts)
Mock.mock(/\/api\/medicalRecord\/dict\/.*?/, 'get', getDicts)
Mock.mock(/\/api\/dict\?.*/, 'get', getDicts)

Mock.mock(/\/api\/hospital\/.*?\/partner$/, 'get', getHosps)

Mock.mock(/\/api\/patient\/info\?.*/, 'get', getPatients)
Mock.mock(/\/api\/patient\/info\/[0-9]*?/, 'get', getPatient)

Mock.mock(/\/api\/login$/, 'post', login)
Mock.mock(/\/api\/login\/currentUser$/, 'get', GetUser)
Mock.mock(/\/api\/login\/config$/, 'get', GetConfig)
Mock.mock(/\/api\/login\/token$/, 'get', token)

Mock.mock(/\/api\/treatment\?.*/, 'get', getTreatments)
Mock.mock(/\/api\/treatment\/[0-9]*?/, 'get', getTreatment)
Mock.mock(/\/api\/treatment$/, 'post', saveTreatment)
Mock.mock(/\/api\/treatment\/[0-9]*?\/status\/[0-9]*?/, 'put', updateTreatmentStatus)
Mock.mock(/\/api\/treatment\/[0-9]*?/, 'put', saveTreatment)

Mock.mock(/\/api\/medicalRecord\?.*/, 'get', getMedicalRecords)
Mock.mock(/\/api\/medicalRecord$/, 'post', saveMedicalRecord)
Mock.mock(/\/api\/medicalRecord\/[0-9]*?/, 'put', saveMedicalRecord)
Mock.mock(/\/api\/medicalRecord\/diseaseStandard\?.*/, 'get', getDiseaseStandards)
Mock.mock(/\/api\/medicalRecord\/diseaseStandard\/[0-9]*?/, 'get', getDiseaseStandard)
Mock.mock(/\/api\/medicalRecord\/diagnosis\?.*/, 'get', getDiagnosiss)
Mock.mock(/\/api\/medicalRecord\/diagnosis\/[0-9]*?/, 'get', getDiagnosis)
Mock.mock(/\/api\/medicalRecord\/diagnosis$/, 'post', saveDiagnosis)
Mock.mock(/\/api\/medicalRecord\/diagnosis\/[0-9]*?/, 'put', saveDiagnosis)
Mock.mock(/\/api\/medicalRecord\/diagnosis\/[0-9]*?/, 'delete', delDiagnosis)
Mock.mock(/\/api\/medicalRecord\/assist\?.*/, 'get', getRecordAssists)
Mock.mock(/\/api\/medicalRecord\/assistType$/, 'get', getRecordAssistTypes)
Mock.mock(/\/api\/medicalCheck\/standard\?.*/, 'get', getMedicalCheckStandards)
Mock.mock(/\/api\/medicalCheck\/standard\/[0-9]*?/, 'get', getMedicalCheckStandard)
Mock.mock(/\/api\/medicalCheck\/item\?.*/, 'get', getMedicalChecks)
Mock.mock(/\/api\/medicalCheck\/item$/, 'post', saveMedicalCheck)
Mock.mock(/\/api\/medicalCheck\/item\/[0-9]*?/, 'put', saveMedicalCheck)
Mock.mock(/\/api\/medicalCheck\/item\/[0-9]*?/, 'delete', delMedicalCheck)
Mock.mock(/\/api\/medicalCheck\/itemCopy\/[0-9]*?/, 'post', copyMedicalCheck)
Mock.mock(/\/api\/medicalCheck\/itemMerge\/[0-9]*?/, 'put', getMedicalChecks)

Mock.mock(/\/api\/drug\/standard\?.*/, 'get', getDrugStandards)
Mock.mock(/\/api\/drug\/standard\/[0-9]*?/, 'get', getDrugStandard)
Mock.mock(/\/api\/drug\/item\?.*/, 'get', getDrugs)
Mock.mock(/\/api\/drug\/item$/, 'post', saveDrug)
Mock.mock(/\/api\/drug\/item\/[0-9]*?/, 'put', saveDrug)
Mock.mock(/\/api\/drug\/item\/[0-9]*?/, 'delete', delDrug)
Mock.mock(/\/api\/drug\/itemCopy\/[0-9]*?/, 'post', copyDrug)
Mock.mock(/\/api\/drug\/itemGroup\/[0-9]*?/, 'put', groupDrug)
Mock.mock(/\/api\/drug\/itemMerge\/[0-9]*?/, 'put', getDrugs)
Mock.mock(/\/api\/login\/currentUser$/, 'get', GetUser)
Mock.mock(/\/api\/drug\/batch\?.*/, 'get', getBatchs)
Mock.mock(/\/api\/drug\/batch$/, 'post', saveBatch)
Mock.mock(/\/api\/drug\/batch\/[0-9]*?/, 'put', saveBatch)
Mock.mock(/\/api\/drug\/batch\/[0-9]*?/, 'delete', delBatch)
Mock.mock(/\/api\/drug\/batchApply\/[0-9]*?\/[0-9]*?/, 'post', applyBatch)

Mock.mock(/\/api\/herbal\/standard\?.*/, 'get', getHerbalStandards)
Mock.mock(/\/api\/herbal\/standard\/[0-9]*?/, 'get', getHerbalStandard)
Mock.mock(/\/api\/herbal\/item\?.*/, 'get', getHerbals)
Mock.mock(/\/api\/herbal\/item$/, 'post', saveHerbal)
Mock.mock(/\/api\/herbal\/item\/[0-9]*?/, 'put', saveHerbal)
Mock.mock(/\/api\/herbal\/item\/[0-9]*?/, 'delete', delHerbal)
Mock.mock(/\/api\/herbal\/rp\?.*/, 'get', getHerbalRps)
Mock.mock(/\/api\/herbal\/rp\/[0-9]*?/, 'get', getHerbalRp)
Mock.mock(/\/api\/herbal\/rp$/, 'post', saveHerbalRp)
Mock.mock(/\/api\/herbal\/rp\/[0-9]*?/, 'put', saveHerbalRp)
Mock.mock(/\/api\/herbal\/rp\/[0-9]*?/, 'delete', delHerbalRp)
Mock.mock(/\/api\/herbal\/rpCopy\/[0-9]*?\/[0-9]*?/, 'post', saveHerbal)
Mock.mock(/\/api\/herbal\/rpMerge\/[0-9]*?/, 'put', getHerbalRp)
Mock.mock(/\/api\/herbal\/formulation\?.*/, 'get', getHerbalFormulations)
Mock.mock(/\/api\/herbal\/formulation\/[0-9]*?/, 'get', getHerbalFormulation)
Mock.mock(/\/api\/herbal\/formulation$/, 'post', saveHerbalFormulation)
Mock.mock(/\/api\/herbal\/formulation\/[0-9]*?/, 'put', saveHerbalFormulation)
Mock.mock(/\/api\/herbal\/formulation\/[0-9]*?/, 'delete', delHerbalFormulation)

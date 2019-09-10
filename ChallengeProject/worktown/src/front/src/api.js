import axios from 'axios'
import Qs from 'qs'
import socket from '@/socket.js'
import store from '@/store'
import router from '@/router'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

// 请求拦截器
axios.interceptors.request.use(function (config) {
  if (store.state.token) { // 判断是否存在token，如果存在的话，则每个http header都加上token
    config.headers.Authorization = `token ${store.state.token}`
    refreshToken()
  }
  return config
}, function (error) {
  return Promise.reject(error)
})
// 响应拦截器
axios.interceptors.response.use(function (response) {
  return response
}, function (error) {
  if (error.response) {
    switch (error.response.status) {
    case 401:
      // 返回 401 清除token信息并跳转到登录页面
      socket.logout()
      store.commit('logout')
      router.replace({
        path: '/',
        query: {redirect: router.currentRoute.fullPath}
      })
    }
  }
  return Promise.reject(error)
})

let tokenIsRefreshing = false
function refreshToken () {
  // 刷新条件：存在过期时间，当前时间尚未过期，当前时间距离过期不到10分钟
  if (!tokenIsRefreshing && store.state.tokenExp && (new Date() > new Date(Number(store.state.tokenExp) - (1000 * 60 * 10))) && (new Date() < new Date(Number(store.state.tokenExp)))) {
    console.log('刷新token，过期时间' + new Date(store.state.tokenExp))
    tokenIsRefreshing = true
    return new Promise((resolve, reject) => {
      api.token().then(token => {
        store.commit('login', token)
        tokenIsRefreshing = false
        console.log('刷新成功！')
      })
    })
  }
}

// const notTreatmentDoctorErr = new Error('求助者不能操作医师工作站！')

// 封装axios的post请求
export function post (url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, params).then(response => {
      if (response.data.code === 0) {
        resolve(response.data.context)
      } else {
        reject(response.data.message)
      }
    }).catch((error) => {
      reject(error)
    })
  })
}
// 封装axios的get请求
export function get (url, params) {
  return new Promise((resolve, reject) => {
    if (params && params.pageIndex) {
      params.pageIndex -= 1
    }
    axios.get(url, {
      params: params,
      paramsSerializer: params => {
        return Qs.stringify(params, { indices: false })
      }
    }).then(response => {
      if (response.data.code === 0) {
        if (response.data.context.index || response.data.context.index === 0) {
          response.data.context.index += 1
        }
        resolve(response.data.context)
      } else {
        reject(response.data.message)
      }
    }).catch((error) => {
      reject(error)
    })
  })
}
// 封装axios的put请求
export function put (url, params) {
  return new Promise((resolve, reject) => {
    axios.put(url, params).then(response => {
      if (response.data.code === 0) {
        resolve(response.data.context)
      } else {
        reject(response.data.message)
      }
    }).catch((error) => {
      reject(error)
    })
  })
}
// 封装axios的delete请求
export function del (url, params) {
  return new Promise((resolve, reject) => {
    axios.delete(url, params).then(response => {
      if (response.data.code === 0) {
        resolve(response.data.context)
      } else {
        reject(response.data.message)
      }
    }).catch((error) => {
      reject(error)
    })
  })
}

let api = {
  // 登录
  login (params) {
    return post('/api/login', params)
  },
  // 刷新token
  token () {
    return get('/api/login/token')
  },
  // 取得当前配置
  getConfig () {
    return get('/api/login/config', {})
  },
  // 取得当前用户
  getCurrentUser () {
    return get('/api/login/currentUser', {})
  },
  // ================== 患者 ==================
  // 查询患者列表 (查询条件)
  queryPatient (params) {
    return get('/api/patient/info', params)
  },
  // 取得患者 (编码)
  getPatient (code) {
    return get('/api/patient/info/code/' + code, {})
  },
  // ================== 医生 =====================

  // 查询医生列表 (查询条件)
  queryDoctor (params) {
    return get('/api/doctor', params)
  },
  // 取得医生 (编码)
  getDoctor (code) {
    return get('/api/doctor/' + code, {})
  },
  queryOnlines (params) {
    return get('/api/online/doctor', params)
  },
  // ================== 医院 ==================
  // 查询医院的合作者列表 (编码，补充条件)
  queryHospitalPartner (code, params) {
    return get('/api/hospital/' + code + '/partner', params)
  },
  // =================== 字典 ====================
  // 查询字典 (字典类型, 补充条件)
  // 科室： 'CV9900051'
  // 性别： 'GBT22611'
  // 职称： 'CV9900374'
  queryDict (type, params) {
    let parts = type.split('-')
    if (parts.length > 1) {
      return get('/api/' + parts[0].replace(parts[0][0], parts[0][0].toLowerCase()) + '/dict/' + parts[1], params)
    } else {
      return get('/api/dict/' + type, params)
    }
  },
  // =================== 主记录 =================
  // 查询主记录 (查询条件)
  queryTreatment (params) {
    return get('/api/treatment', params)
  },
  // 取得主记录 (ID)
  getTreatment (id) {
    return get('/api/treatment/' + id, {})
  },
  // 保存主记录
  saveTreatment (item) {
    if (item.id) {
      return put('/api/treatment/' + item.id, item)
    } else {
      return post('/api/treatment', item)
    }
  },
  // 更新主记录状态
  updateTreatmentStatus (id, status) {
    return put('/api/treatment/' + id + '/status/' + status)
  },
  // ================== 门诊病历 ==================
  // // 取得门诊病历字典列表 (字典类型, 补充条件)
  // queryMedicalRecordDict (type, params) {
  //   return get('/api/medicalRecord/dict/' + type, params)
  // },
  // 保存门诊病历
  defaultMedicalRecord (item) {
    return put('/api/medicalRecord/defaultMedicalRecord', item)
  },
  // 取得门诊病历 (查询条件)
  queryMedicalRecord (params) {
    return get('/api/medicalRecord', params)
  },
  // 复制门诊病历
  copyMedicalRecord (params) {
    if (params.fieldEnum !== undefined) {
      return put('/api/medicalRecord/copyField/' + params.srcId + '/' + params.destId + '/' + params.fieldEnum)
    } else {
      return put('/api/medicalRecord/copy/' + params.srcId + '/' + params.destId)
    }
  },
  // 保存门诊病历
  saveMedicalRecord (item) {
    if (item.id) {
      return put('/api/medicalRecord/' + item.id, item)
    } else {
      return post('/api/medicalRecord', item)
    }
  },
  // 取得疾病标准编码列表 (查询条件)
  queryDiseaseStadard (params) {
    return get('/api/medicalRecord/diseaseStandard', params)
  },
  // 取得疾病标准编码 (ID)
  getDiseaseStadard (id) {
    return get('/api/medicalRecord/diseaseStanard/' + id, {})
  },
  // 取得诊断项目列表 (查询条件)
  queryDiagnosis (params) {
    return get('/api/medicalRecord/diagnosis', params)
  },
  // 取得诊断项目 (ID)
  getDiagnosis (id) {
    return get('/api/medicalRecord/diagnosis/' + id, {})
  },
  // 保存诊断项目
  saveDiagnosis (item) {
    if (item.id) {
      return put('/api/medicalRecord/diagnosis/' + item.id, item)
    } else {
      return post('/api/medicalRecord/diagnosis', item)
    }
  },
  // 删除诊断项目及其子项目
  delDiagnosis (id) {
    return del('/api/medicalRecord/diagnosis/' + id)
  },
  // 查询辅助输入项列表
  queryMedicalRecordAssist (params) {
    return get('/api/medicalRecord/assist', params)
  },
  // 保存辅助输入项
  saveMedicalRecordAssist (params) {
    if (params.id) {
      return put('/api/medicalRecord/assist/' + params.id, params)
    } else {
      return post('/api/medicalRecord/assist', params)
    }
  },
  // 删除辅助输入项
  delMedicalRecordAssist (id) {
    return del('/api/medicalRecord/assist/' + id)
  },
  // 查询辅助输入项分类列表（暂时不需要）
  queryMedicalRecordAssistType (params) {
    return get('/api/medicalRecord/assistType', params)
  },
  // ================== 检查检验 ==================
  // // 取得检查检验字典列表 (字典类型, 补充条件)
  // // 状态：'Status'
  // // 分类：'Type'
  // queryMedicalCheckDict (type, params) {
  //   return get('/api/medicalCheck/dict/' + type, params)
  // },
  // 取得检查检验编码列表 (查询条件)
  queryMedicalCheckStandard (params) {
    return get('/api/medicalCheck/standard', params)
  },
  // 取得检查检验编码 (ID)
  getMedicalCheckStandard (id) {
    return get('/api/medicalCheck/standard/' + id, {})
  },
  // 取得检查检验项目列表 (查询条件)
  queryMedicalCheckItem (params) {
    return get('/api/medicalCheck/item', params)
  },
  // 保存检查检验项目 (检查检验项目)
  saveMedicalCheckItem (item) {
    if (item.id) {
      return put('/api/medicalCheck/item/' + item.id, item)
    } else {
      return post('/api/medicalCheck/item', item)
    }
  },
  // 删除检查检验项目 (ID)
  delMedicalCheckItem (id) {
    return del('/api/medicalCheck/item/' + id)
  },
  // 拷贝检查检验项目到当前诊疗 (诊疗主记录ID, 检查检验项目ID数组)
  // 返回值为新生成的检查检验项目
  copyMedicalCheckItem (treatmentId, ids) {
    return post('/api/medicalCheck/itemCopy/' + treatmentId, ids)
  },
  // 合并重复的检查检验项目 (诊疗主记录ID)
  // 返回值为合并后的检查检验项目列表
  mergeMedicalCheckItem (treatmentId) {
    return put('/api/medicalCheck/itemMerge/' + treatmentId)
  },
  // ================== 药品处方 ==================
  // // 取得药品分类字典列表 (字典类型, 补充条件)
  // // 分类: 'DrugType'
  // // 用法: 'DrugUsage'
  // queryDrugDict (type, params) {
  //   return get('/api/drug/dict/' + type, params)
  // },
  // 查询药品编码列表 (查询条件)
  queryDrugStandard (params) {
    return get('/api/drug/standard', params)
  },
  // 取得药品编码
  getDrugStandard (id) {
    return get('/api/drug/standard/' + id, {})
  },
  // 查询药品项目 (查询条件)
  queryDrugItem (params) {
    return get('/api/drug/item', params)
  },
  // 保存药品项目
  saveDrugItem (item) {
    if (item.id) {
      return put('/api/drug/item/' + item.id, item)
    } else {
      return post('/api/drug/item', item)
    }
  },
  // 删除药品项目
  delDrugItem (id) {
    return del('/api/drug/item/' + id)
  },
  // 修改药品项目的分组信息 (组号, 药品项目ID数组)
  updateDrugItemGroup (groupNo, ids) {
    return put('/api/drug/itemGroup/' + groupNo, ids)
  },
  // 拷贝药品项目 (主记录ID, 药品项目ID数组)
  // 返回值为新生成的药品项目
  copyDrugItem (treatmentId, ids) {
    return post('/api/drug/itemCopy/' + treatmentId, ids)
  },
  // 合并重复的药品项目 (诊疗主记录ID)
  // 返回值为合并后的药品目列表
  mergeDrugItem (treatmentId) {
    return put('/api/drug/itemMerge/' + treatmentId)
  },
  // 查询药品处方套餐列表 (查询条件)
  queryDrugBatch (params) {
    return get('/api/drug/batch', params)
  },
  // 应用药品处方套餐
  ApplyDrugBatch (treatmentId, batchId) {
    return post('/api/drug/batchApply/' + treatmentId + '/' + batchId, {})
  },
  // 保存药品处方套餐
  saveDrugBatch (params) {
    if (params.id) {
      return put('/api/drug/batch/' + params.id, params)
    } else {
      return post('/api/drug/batch', params)
    }
  },
  // 删除药品处方套餐
  delDrugBatch (id) {
    return del('/api/drug/batch' + '/' + id, {})
  },
  // ================== 草药处方 ==================
  // 查询草药编码列表 (查询条件)
  queryHerbalStandard (params) {
    return get('/api/herbal/standard', params)
  },
  // 取得草药编码
  getHerbalStandard (id) {
    return get('/api/herbal/standard/' + id, {})
  },
  // 查询草药处方 (查询条件)
  queryHerbalRp (params) {
    return get('/api/herbal/rp', params)
  },
  // 取得草药处方
  getHerbalRp (id) {
    return get('/api/herbal/rp/' + id)
  },
  // 保存草药处方
  saveHerbalRp (item) {
    if (!item.id) {
      return post('/api/herbal/rp', item)
    } else {
      return put('/api/herbal/rp/' + item.id, item)
    }
  },
  // 删除草药处方
  delHerbalRp (id) {
    return del('/api/herbal/rp/' + id)
  },
  // 查询草药项目 (查询条件)
  queryHerbalItem (params) {
    return get('/api/herbal/item', params)
  },
  // 保存草药项目
  saveHerbalItem (item) {
    if (item.id) {
      return put('/api/herbal/item/' + item.id, item)
    } else {
      return post('/api/herbal/item', item)
    }
  },
  // 删除草药项目
  delHerbalItem (id) {
    return del('/api/herbal/item/' + id)
  },
  // 拷贝草药处方套餐 (主记录ID, 套餐ID)
  // 返回值为新生成的药品项目列表
  copyHerbalRp (treatmentId, rpId) {
    return post('/api/herbal/rpCopy/' + treatmentId + '/' + rpId, {})
  },
  // 合并处方中的重复细目
  // 返回新的细目列表
  mergeHerbalRp (rpId) {
    return put('/api/herbal/rpMerge/' + rpId)
  },
  // 查询验方列表
  queryHerbalFormulation (params) {
    return get('/api/herbal/formulation', params)
  },
  // 应用验方
  ApplyHerbalFormulation (treatmentId, formulationId) {
    return put('/api/herbal/formulationApply/' + treatmentId + '/' + formulationId, {})
  },
  // 保存验方
  saveHerbalFormulation (params) {
    if (params.id) {
      return put('/api/herbal/formulation/' + params.id, params)
    } else {
      return post('/api/herbal/formulation', params)
    }
  },
  // 删除验方
  delHerbalFormulation (id) {
    return del('/api/herbal/formulation' + '/' + id, {})
  }
}
export default api

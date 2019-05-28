import request from '@/utils/request'

import Cookies from 'js-cookie'
// 验证银豹账号
export function verifyPospalAccount(data, options = {}) {
  return request({
    ...options,
    url: 'UnionPaySigning/VerifyPospalAccount',
    method: 'post',
    data,
  })
}

export function uploadPic(data) {
  return request({
    url: 'UnionPaySigning/UploadPic',
    method: 'post',
    data
  })
}

export function queryBranchBank(data) {
  return request({
    url: 'UnionPaySigning/QueryBranchBank',
    method: 'post',
    data
  }) 
}
// 设置基本信息
export function setBasicInfo(data) {
  return request({
    url: 'UnionPaySigning/SetBasicInfo',
    method: 'post',
    data
  }) 
}
// 设置实名信息
export function setRealUserInfo(data) {
  return request({
    url: 'UnionPaySigning/SetRealUserInfo',
    method: 'post',
    data
  }) 
}

// 设置营业信息
export function setBusinessInfo(data) {
  return request({
    url: 'UnionPaySigning/SetBusinessInfo',
    method: 'post',
    data
  }) 
}

// 设置银行账号信息
export function setBankInfo(data) {
  return request({
    url: 'UnionPaySigning/SetBankInfo',
    method: 'post',
    data
  }) 
}

// 对公账号认证
export function companyAccountVerify(data) {
  return request({
    url: 'UnionPaySigning/CompanyAccountVerify',
    method: 'post',
    data
  }) 
}

// 签约列表
export function querySignRecords(data) {
  return request({
    url: 'UnionPaySigning/QuerySignRecords',
    method: 'post',
    data
  }) 
}

// 重新申请
export function reSgin(data) {
  return request({
    url: 'UnionPaySigning/ReSgin',
    method: 'post',
    data
  }) 
}
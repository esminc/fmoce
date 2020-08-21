/*
Copyright (c) 2020 University of Fukui.  All rights reserved.
Please see the license.gs for the copyright licensing conditions attached to this codebase, including copies of the licenses concerned.
*/

import { facilityOf } from '@/constant'
import * as Service from '@/service'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let global: any

const ROOT_FOLDER_ID  = PropertiesService.getScriptProperties().getProperty('root_folder_id')
const ASSIGNED_LECTURE_SHEET_ID = PropertiesService.getScriptProperties().getProperty('assigned_lecture_sheet_id')

const doGet = () => {
  const prop = PropertiesService.getScriptProperties().getProperty('maintenance_progress(true/false)')
  const templateFileName = prop === 'true' ? 'sorry' : 'index'
  const template = HtmlService.createTemplateFromFile(templateFileName).evaluate()
  template
    .setTitle('F.MOCE教員アプリ')
  return template
}

const getMyMailAddress = () => {
  const user = Session.getActiveUser()
  return user.getEmail()
}

const getClasses = (params: {identifier: string}): {
  subject: string,
  lecture: string,
  classPackageFolderUrl: string,
  minutesPaperFormUrl: string,
  isAttendance: boolean,
  published: 0 | 1
}[] => {
  console.log('getClasses ', params.identifier)

  const facility = facilityOf(params.identifier)

  const subjectService = new Service.SubjectService(ASSIGNED_LECTURE_SHEET_ID)
  const classPackageService = new Service.ClassPackageService(ROOT_FOLDER_ID)

  const subjects = subjectService.getSubjectsByGrade(facility, getMyMailAddress())
  const classPackages = classPackageService.getClassPackages(facility, subjects)

  console.log(subjects)
  console.log(classPackages)

  return classPackages.map(_ => {
    return {
      subject: _.subject,
      lecture: _.lecture,
      classPackageFolderUrl: _.classPackageFolderUrl,
      minutesPaperFormUrl: _.minutesPaperFormUrl,
      isAttendance: _.isAttendance,
      published: _.published
    }
  })
}

const setReady = (params: {
  identifier: string,
  classPackageUrl: string
}) => {
  const facility = facilityOf(params.identifier)
  const classPackageService = new Service.ClassPackageService(ROOT_FOLDER_ID)
  classPackageService.setReady(facility, params.classPackageUrl)
}

const setPrivate = (params: {
  identifier: string,
  classPackageUrl: string
}) => {
  const facility = facilityOf(params.identifier)
  const classPackageService = new Service.ClassPackageService(ROOT_FOLDER_ID)
  classPackageService.setPrivate(facility, params.classPackageUrl)
}


global.doGet = doGet
global.getMyMailAddress = getMyMailAddress
global.getClasses = getClasses
global.setReady = setReady
global.setPrivate = setPrivate

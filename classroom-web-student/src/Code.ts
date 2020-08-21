/*
Copyright (c) 2020 University of Fukui.  All rights reserved.
Please see the license.gs for the copyright licensing conditions attached to this codebase, including copies of the licenses concerned.
*/

import * as Service from '@/service'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let global: any

const ROOT_FOLDER_ID  = PropertiesService.getScriptProperties().getProperty('root_folder_id')
const STUDENTS_SHEET_ID = PropertiesService.getScriptProperties().getProperty('students_sheet_id')

const doGet = () => {
  const prop = PropertiesService.getScriptProperties().getProperty('maintenance_progress(true/false)')
  const templateFileName = prop === 'true' ? 'sorry' : 'index'
  const template = HtmlService.createTemplateFromFile(templateFileName).evaluate()
  template
    .setTitle('F.MOCE学生アプリ')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
  return template
}

const getMyMailAddress = () => {
  const user = Session.getActiveUser()
  return user.getEmail()
}

const getClasses = (): {
  subject: string,
  lecture: string,
  classPackageFolderUrl: string,
  minutesPaperFormUrl: string
}[] => {
  const mailAddress = getMyMailAddress()
  console.log('accessed by ', mailAddress)

  const studentService = new Service.StudentService(STUDENTS_SHEET_ID)
  const classPackageService = new Service.ClassPackageService(ROOT_FOLDER_ID)

  const grades = studentService.getGradesByMailAddress(mailAddress)
  console.log('students, ',grades)

  const classPackages = classPackageService.getClassPackagesByGrades(grades)
  console.log('classPackages, ', classPackages)

  return classPackages
    .map(_ => {
      return {
        subject: _.subject,
        lecture: _.lecture,
        classPackageFolderUrl: _.classPackageFolderUrl,
        minutesPaperFormUrl: _.minutesPaperFormUrl
      }
    })
}

global.doGet = doGet
global.getMyMailAddress = getMyMailAddress
global.getClasses = getClasses

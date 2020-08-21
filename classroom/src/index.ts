/*
Copyright (c) 2020 University of Fukui.  All rights reserved.
Please see the license.gs for the copyright licensing conditions attached to this codebase, including copies of the licenses concerned.
*/

import * as Service from '@/service'
import type * as Constant from '@/constant'
import type { CreateLectureFoldersResult } from '@/service/SchoolClassService'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let global: any

// カスタムメニューをつくる
const onOpen = () => {
  SpreadsheetApp
    .getActiveSpreadsheet()
    .addMenu('カスタムメニュー', [
      {name: '連携する', functionName: 'setProperties'},
      {name: 'トリガーを作成する', functionName: 'createLectureTitleTriggers'},
    ])
}

// 講義名同期のトリガーを自動で作る
const createLectureTitleTriggers = (): void => {
  [
    'sync1', 'sync2', 'sync3', 'sync4', 'sync5','sync6'
  ].forEach((_, index) => {
    // sync1~3は2時に、sync4~6は3時に実行する。実行時間の制限のため
    const hour = index < 4 ? 2 : 3
    ScriptApp
      .newTrigger(_)
      .timeBased()
      .atHour(hour)
      .everyDays(1)
      .create()
  })
}

// 必要なプロパティを設定する
const setProperties = (): void => {
  const rootFolderUrl = Browser.inputBox('ルートフォルダのURLを入力してください。')
  const studentsSpreadSheetUrl = Browser.inputBox('学生一覧スプレッドシートのURLを入力してください。※末尾の /edit 以降は削除してください。')
  const minutesPaperFormUrl = Browser.inputBox('ミニッツペーパーのURLを入力してください。※末尾の /edit 以降は削除してください。')

  const extractIdFromUrl = (url: string) => {
    return url.match(/[^/]+$/g)[0]
  }
  PropertiesService.getScriptProperties().setProperty('root_folder_id', extractIdFromUrl(rootFolderUrl))
  PropertiesService.getScriptProperties().setProperty('students_sheet_id', extractIdFromUrl(studentsSpreadSheetUrl))
  PropertiesService.getScriptProperties().setProperty('minutes_paper_form_id', extractIdFromUrl(minutesPaperFormUrl))
}

const ROOT_FOLDER_ID  = PropertiesService.getScriptProperties().getProperty('root_folder_id')
const STUDENTS_SHEET_ID = PropertiesService.getScriptProperties().getProperty('students_sheet_id')
const MINUTES_PAPER_FORM_ID = PropertiesService.getScriptProperties().getProperty('minutes_paper_form_id')

const createClassroomPackageFolders = (): void => {
  try {
    const schoolClassService = new Service.SchoolClassService(ROOT_FOLDER_ID)
    const timeTableService = new Service.TimeTableService(ROOT_FOLDER_ID)
  
    // 学年を取得する
    const grade = schoolClassService.getGradeTitle()

    console.log(`createFolders for ${grade}`)

    // 学年のフォルダを作成する
    const gradeFolder = schoolClassService.createGradeFolder(grade)

    // 授業パッケージ用のフォルダを作成する
    const classPackageRootFolder = schoolClassService.createClassPackageRootFolder(gradeFolder)

    // 講義を取得する
    const schoolClasses = schoolClassService.findSchoolClasses()
    schoolClasses.forEach(schoolClass => console.log(schoolClass.subject, JSON.stringify(schoolClass.lectures)))

    // 時間割表を作成する
    const timeTable = timeTableService.createTimeTable(grade)

    // 科目フォルダとコンテンツフォルダを作成する
    let createLectureFoldersResults: CreateLectureFoldersResult[] = []
    schoolClasses.forEach(schoolClass => {
      const subjectFolder = schoolClassService.createSubjectFolder(classPackageRootFolder, schoolClass)
      const results = schoolClassService.createLectureFolders(subjectFolder, schoolClass)
      createLectureFoldersResults = createLectureFoldersResults.concat(results)
    })
    // 時間割表にコンテンツのリンクを追記
    timeTableService.registerContentsLinkRow(timeTable, createLectureFoldersResults)
  } catch(e) {
    console.log('例外発生', e)
    // TODO どこかで失敗したら、ルートフォルダを消す
  }
}

const createMinutesPaperFolders = () => {
  try {
    const schoolClassService = new Service.SchoolClassService(ROOT_FOLDER_ID)
    const timeTableService = new Service.TimeTableService(ROOT_FOLDER_ID)
    const minutesPaperService = new Service.MinutesPaperService(ROOT_FOLDER_ID, MINUTES_PAPER_FORM_ID)

    const grade = schoolClassService.getGradeTitle()
    const gradeFolder = minutesPaperService.createGradeFolder(grade)

    const minutesPaperRootFolder = minutesPaperService.createMinutesPaperRootFolder(gradeFolder)

    const schoolClasses = schoolClassService.findSchoolClasses()
    schoolClasses.forEach(schoolClass => console.log(schoolClass.subject, JSON.stringify(schoolClass.lectures)))

    const timeTable = timeTableService.findTimeTable(grade)
    if(!timeTable) return

    schoolClasses.forEach(schoolClass => {
      const subjectFolder = minutesPaperService.createSubjectFolder(minutesPaperRootFolder, schoolClass)
      schoolClass.lectures.forEach(lecture => {
        const result = minutesPaperService.createMinutesPapers(subjectFolder, lecture.name)
        if(result) timeTableService.registerMinutesPaperLinkRow(timeTable!, schoolClass.subject, lecture.name, result)
      })
    })
  } catch(e) {
    console.log('例外発生', e)
  }
}

const sync1 = () => {
  syncLectureTitle(1)
}

const sync2 = () => {
  syncLectureTitle(2)
}

const sync3 = () => {
  syncLectureTitle(3)
}

const sync4 = () => {
  syncLectureTitle(4)
}

const sync5 = () => {
  syncLectureTitle(5)
}

const sync6 = () => {
  syncLectureTitle(6)
}

const syncLectureTitle = (grade: Constant.Grade) => {
  try {
    const timeTableService = new Service.TimeTableService(ROOT_FOLDER_ID)
    timeTableService.syncLectureName(grade)
  } catch(e) {
    console.log('例外発生', e)
  }
}

global.createClassroomPackageFolders = createClassroomPackageFolders
global.createMinutesPaperFolders = createMinutesPaperFolders
global.sync1 = sync1
global.sync2 = sync2
global.sync3 = sync3
global.sync4 = sync4
global.sync5 = sync5
global.sync6 = sync6
global.onOpen = onOpen
global.createLectureTitleTriggers = createLectureTitleTriggers
global.setProperties = setProperties

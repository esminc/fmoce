/*
Copyright (c) 2020 University of Fukui.  All rights reserved.
Please see the license.gs for the copyright licensing conditions attached to this codebase, including copies of the licenses concerned.
*/
function setup() {
  const healthCheckSheetUrl = '健康管理スプレッドシートのURLを入力してください。※末尾の /edit 以降は削除してください。'
  /**
   * スプレッドシートのURLの末尾に注意してください。
   * OK: https://docs.google.com/spreadsheets/d/1234567890abcdefg1234567890abcdefg1234567890
   * NG: https://docs.google.com/spreadsheets/d/1234567890abcdefg1234567890abcdefg1234567890/edit#gid=0
   */

  // これより以下は編集しないでください。
  const extractIdFromUrl = (url) => {
    return url.match(/[^/]+$/g)[0]
  }
  PropertiesService.getScriptProperties().setProperty('health_check_sheet_id', extractIdFromUrl(healthCheckSheetUrl))
}

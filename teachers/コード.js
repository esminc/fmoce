/*
Copyright (c) 2020 University of Fukui.  All rights reserved.
Please see the license.gs for the copyright licensing conditions attached to this codebase, including copies of the licenses concerned.
*/

var logsheet = SpreadsheetApp.getActive().getSheetByName("log");
var url = PropertiesService.getScriptProperties().getProperty('root_folder_url');

function onOpen() {
  SpreadsheetApp
    .getActiveSpreadsheet()
    .addMenu('カスタムメニュー', [
      {name: '連携する', functionName: 'setProperties'},
      {name: '編集権限登録', functionName: 'main'}
    ]);
}

function setProperties() {
  var rootFolderUrl = Browser.inputBox('ルートフォルダのURLを入力してください。');
  PropertiesService.getScriptProperties().setProperty('root_folder_url', rootFolderUrl);
}

function main(){
  var date = new Date();
  logsheet.appendRow([Utilities.formatDate( date, 'Asia/Tokyo', 'yyyy/MM/dd HH:mm:ss'), "start"]);
  
  var ss = SpreadsheetApp.getActive();
  var editortable = ss.getSheetByName("担当教員一覧").getDataRange().getValues();
  var IDsheet = ss.getSheetByName("対象科目ID");
  var rootfolder;
  try{
    rootfolder = DriveApp.getFolderById(url.match(/[^/]+$/g)[0]);
  }catch(e){
    Browser.msgBox("初期設定シートにルートフォルダURLを記載ください");
    return;
  }
  
  for(var i = editortable.length-1; 0 < i; i--){
    var err = false;
    
    if(editortable[i][3] != ""){
      continue;
    }
    if(editortable[i][2] == ""){
      continue;
    }
    
    var grade = editortable[i][0];
    var subject = editortable[i][1];

    var gradefolders = rootfolder.getFoldersByName(grade + "年生");
    var gradefolder;
    if(gradefolders.hasNext()){
      gradefolder = gradefolders.next();
    }else{
      Browser.msgBox("正しい学年を入力してください");
      return;
    }
    
    var studentfolders = gradefolder.getFoldersByName("学生");
    var studentfolder;
    if(studentfolders.hasNext()){
      studentfolder = studentfolders.next();
    }else{
      Browser.msgBox("学年フォルダ配下が想定しているフォルダ構造ではありません");
      return;
    }
    
    var teacherfolders = gradefolder.getFoldersByName("教員");
    var teacherfolder;
    if(teacherfolders.hasNext()){
      teacherfolder = teacherfolders.next()
    }else{
      Browser.msgBox("学年フォルダ配下が想定しているフォルダ構造ではありません");
      return;    
    }
    
    var subjectfolders = studentfolder.getFoldersByName(subject);
    var subjectfolder;
    if(subjectfolders.hasNext()){
      subjectfolder = subjectfolders.next();
    }else{
      Browser.msgBox("正しい科目名を入力してください");
      return;    
    }
    
    var minutepaperfolders = teacherfolder.getFoldersByName(subject);
    var minutepaperfolder;
    
    if(minutepaperfolders.hasNext()){
      minutepaperfolder = minutepaperfolders.next()
    }else{
      Browser.msgBox("正しい科目名を入力してください");
      return;    
    }

    try {
      Drive.Permissions.insert({
        'role': 'writer',
        'type': 'user',
        'value': editortable[i][2]
      }, subjectfolder.getId(), {
        'sendNotificationEmails': 'false'
      });
      logsheet.appendRow(["suc", subjectfolder.getId(), editortable[i][2]]);
      
    }
    catch (e) {
      logsheet.appendRow(["err", subjectfolder.getId(), editortable[i][2]]);
      err = true;
    } 

    try {
      Drive.Permissions.insert({
        'role': 'writer',
        'type': 'user',
        'value': editortable[i][2]
      }, minutepaperfolder.getId(), {
        'sendNotificationEmails': 'false'
      });
      logsheet.appendRow(["suc", minutepaperfolder.getId(), editortable[i][2]]);

    }
    catch (e) {
      logsheet.appendRow(["err", minutepaperfolder.getId(), editortable[i][2]]);
      err = true;
    } 
    
    if(err){
      ss.getSheetByName("担当教員一覧").getRange(i+1, 4).setValue("NG");
    }else{
      ss.getSheetByName("担当教員一覧").getRange(i+1, 4).setValue("OK");
    }
  }
  
  var date = new Date();
  logsheet.appendRow([Utilities.formatDate( date, 'Asia/Tokyo', 'yyyy/MM/dd HH:mm:ss'), "end"]);
  SpreadsheetApp.flush();
  
}

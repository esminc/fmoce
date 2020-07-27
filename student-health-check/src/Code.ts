import * as Service from '@service/index'

const HEALTH_CHECK_SHEET_ID = PropertiesService.getScriptProperties().getProperty('health_check_sheet_id')

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let global: any

const doGet = () => {
  const prop = PropertiesService.getScriptProperties().getProperty('maintenance_progress(true/false)')
  const templateFileName = prop === 'true' ? 'sorry' : 'index'
  const template = HtmlService.createTemplateFromFile(templateFileName).evaluate()
  template
    .setTitle('健康管理')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
  return template
}

const getMyMailAddress = (): string => {
  const mockMailAddress = PropertiesService.getScriptProperties().getProperty('mock-mail-address')
  if(mockMailAddress) return mockMailAddress

  const user = Session.getActiveUser()
  return user.getEmail()
}

const getHealthCheck = (): Service.HealthCheck[] => {
  const mailAddress = getMyMailAddress()
  const service = new Service.HealthCheckServiceImpl(HEALTH_CHECK_SHEET_ID)

  const result = service.findByMailAddress(mailAddress)
  console.log(result)
  return result
}

global.doGet = doGet
global.getMyMailAddress = getMyMailAddress
global.getHealthCheck = getHealthCheck

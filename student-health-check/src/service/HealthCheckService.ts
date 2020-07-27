export type HealthCheck = {
  timestamp: string
  temp: number
}

export interface HealthCheckService {
  findByMailAddress: (mailAddress: string) => HealthCheck[]
}

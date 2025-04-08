export interface ReportData {
    image: string
    severityLevel: number
    comment: string
    location: {
      latitude: number
      longitude: number
      accuracy?: number
    }
  }
  
  
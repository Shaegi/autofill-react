export type Champ = {
    name: string
    id: string 
    key: string
    chestGranted: boolean
    lanes: { 
      type: string
      probability: number
    }[]
    title: string 
    info: {
      difficulty: number
    }
    layout: {
      key: string | null
      splashArtOffset: number | null
    }
    skins: {
      name: string
      id: string
      num: number
    }[]
    totalConfirmedCount: number
    confirmedCount:  {
      count: number
      lane: Lane
    }
    masteryPoints: number | null
    masteryLevel: number | null
    probability?: number | null
    roles: string[]
    tags: String[]
  }
  
export enum Lane  {
    TOP = 'LANE_TYPE_TOP',
    JUNGLE = 'LANE_TYPE_JUNGLE',
    MID = 'LANE_TYPE_MID',
    BOT = 'LANE_TYPE_ADC',
    SUPPORT = 'LANE_TYPE_SUPPORT'
  }
  
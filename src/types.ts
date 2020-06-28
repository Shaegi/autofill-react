export type Champ = {
    name: string
    id: string 
    lanes: string[]
    title: string
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
  
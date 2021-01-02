import { gql } from "apollo-boost"
import ChampsFragment from './ChampFragment'
import { Champ, Lane, Role } from "../types"

export const ChampsQuery = gql`
  query Champs ($summoner: SummonerInformation) {
      champs(summoner: $summoner) {
        profile {
          gamesAnalyzed
          lanes {
            type
            count
          }
          roles {
            type
            count
          }
          playedChamps {
            id
            lanes {
              type 
              count
            }
          }
        }
        champs {
          ...Champ
        }
      }
    }
    ${ChampsFragment}
`

type SummonerProfile = {
  gamesAnalyzed: number
  lanes: {
    type: Lane
    count: number
  }[]
  roles: {
    type: Role
    count: number
  }[]
  playedChamps: {
    id: string
    lanes: {
      type: Lane
      count: number
    }[]
  }[]
}

export type ChampsQueryResponse = {
    champs: {
      champs: Champ[]
      profile?: SummonerProfile

    }
}
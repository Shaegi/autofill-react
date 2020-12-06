import { gql } from "apollo-boost"
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
          name
          key
          title
          chestGranted
          title
          masteryLevel
          masteryPoints
          totalConfirmedCount
          confirmedCount {
            count
            lane
          }
          info {
            difficulty
          }
          skins {
            name
            num
            id
          }
          layout {
            key
            splashArtOffset
          }
          id
          roles
          tags
          lanes {
            type
            probability
          }
          probability
        }
      }
    }
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
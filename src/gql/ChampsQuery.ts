import { gql } from "apollo-boost"
import { Champ } from "../types"

export const ChampsQuery = gql`
  query Champs ($summoner: SummonerInformation) {
      champs(summoner: $summoner) {
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
`

export type ChampsQueryResponse = {
    champs: Champ[]
}
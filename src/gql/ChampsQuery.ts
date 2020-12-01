import { gql } from "apollo-boost"
import { Champ } from "../types"

export const ChampsQuery = gql`
  query Champs ($summonerName: String) {
      champs(summonerName: $summonerName) {
        name
        key
        title
        chestGranted
        title
        masteryLevel
        masteryPoints
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
import { gql } from "apollo-boost";

export default gql`fragment ChampCount on Champ {
    __typename
    id
    totalConfirmedCount
    confirmedCount {
      count
      lane
    }
  }
`
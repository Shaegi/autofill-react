import { gql } from "apollo-boost";

export default gql`
    fragment Champ on Champ {
        name
        key
        title
        chestGranted
        version
        title
        masteryLevel
        masteryPoints
        totalConfirmedCount
        confirmedCount {
            count
            score
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
`
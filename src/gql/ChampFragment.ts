import { gql } from "apollo-boost";

export const RuneStatFragment = gql`
fragment RuneStat on RuneStat {
    primary {
        keyStone
        perk1
        perk2
        perk3
    }
    secondary {
        perk1
        perk2
    }
}
`

export const ItemStatFragment = gql`
    fragment ItemStat on ItemStat {
        highestWinrate 
        mostPopular 
    }
`

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
            highestWinrateRunes {
                value {
                    ...RuneStat
                }
            }
            mostPopularRunes {
                value {
                    ...RuneStat
                }
            }
            buildStats {
                trinket {
                    ...ItemStat
                }
                item0 {
                    ...ItemStat
                }
                item1 {
                    ...ItemStat
                }
                item2 {
                    ...ItemStat
                }
                item3 {
                    ...ItemStat
                }
                item4 {
                    ...ItemStat
                }
                item5 {
                    ...ItemStat
                }
            }
            highestWinrateSummonerSpells {
                value {
                    name
                    id
                    image
                }
            }
            mostPopularSummonerSpells {
                value {
                    name
                    id
                    image
                }
            }
            highestWinrateSkillOrder {
                value
            }
            mostPopularSkillOrder {
                value
            }
        }
        probability
       
    }
    ${ItemStatFragment}
    ${RuneStatFragment}
`
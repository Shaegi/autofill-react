    import React from 'react'
import styled from 'styled-components'
import { Champ } from '../../../../types'
import { StatsType } from '../Guides'

type WrapperProps = {}

const Wrapper = styled.div<WrapperProps>``

export type SummonerSpellsPanelProps = {
    stats: Champ['lanes'][number]
    type: StatsType
}

const SummonerSpellsPanel:React.FC<SummonerSpellsPanelProps> = props => {
    const { stats,type } = props
    const stat =  (type === StatsType.HIGHEST_WINRATE ? stats.highestWinrateSummonerSpells : stats.mostPopularSummonerSpells).value
    return <Wrapper>
        {stat.map(spell => {
            return <div>{spell}</div>
        })}
    </Wrapper>
}

export default SummonerSpellsPanel

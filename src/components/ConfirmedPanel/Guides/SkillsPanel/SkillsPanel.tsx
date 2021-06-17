import React from 'react'
import styled from 'styled-components'
import { Champ } from '../../../../types'
import { StatsType } from '../Guides'

type WrapperProps = {}

const Wrapper = styled.div<WrapperProps>`
    display: flex;
    flex-direction: column;
    gap: ${p => p.theme.size.xxs};

    .row {
        display: flex;
        gap: ${p => p.theme.size.xxs};
        > div {
            border-radius: 4px;
            height: ${p => p.theme.size.m};
            width: ${p => p.theme.size.m};
            line-height: ${p => p.theme.size.s};
            font-size: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: rgba(255,255,255, 0.6);
        }
    }

    .row:not(.head-row) {
        > div {
            color: ${p => p.theme.color.primary};
            background: rgba(0,0,0,.7);
        }
    }
`

export type SkillsPanelProps = {
    stats: Champ['lanes'][number]
    type: StatsType
}

const SkillsPanel:React.FC<SkillsPanelProps> = props => {
    const {stats, type } = props
    const skilled = (type === StatsType.HIGHEST_WINRATE ? stats.highestWinrateSkillOrder : stats.mostPopularSkillOrder).value
    return <Wrapper>
        <div className='row head-row'>{[...new Array(18)].map((v, i) => {
            return <div><span>{i + 1}</span></div>
        })}</div>
        <SkillRow skilled={skilled} id={1} name='Q' />
        <SkillRow skilled={skilled} id={2} name='W' />
        <SkillRow skilled={skilled} id={3} name='E' />
        <SkillRow skilled={skilled} id={4} name='R' />
    </Wrapper>
}

type SkillRowProps = {
    skilled: number[]
    id: number
    name: string
}

const SkillRow: React.FC<SkillRowProps> = (props) => {
    const { skilled, id, name } = props
    return <div className='row'>{[...new Array(18)].map((v, i) => {
        return <div><span>{skilled[i] === id ? name : null}</span></div>
    })}</div>
}

export default SkillsPanel

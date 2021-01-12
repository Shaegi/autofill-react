import React, { useCallback } from 'react'
import styled from 'styled-components'
import { Champ, Lane } from '../types'
import CasinoSharpIcon from '@material-ui/icons/CasinoSharp'


const Wrapper = styled.div<{ confirmed: boolean}>`
    width: ${p => p.confirmed  ?0 : 20}vw;
    max-width: ${p => p.confirmed  ?0 : 20}vw;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    white-space: nowrap;
    opacity: ${p => p.confirmed ? 0 : 1};
    box-sizing: border-box;
    :hover {
        border: 1px solid ${p =>p.theme.color.primary};
    }
    transition: all .7s ease-in-out, background-position-x 0s ease, background-image 0s ease, border 0s ease;
    .start-over-button {
        display: flex;
        align-items: center;
        width: 100%;
        justify-content: center;
        border: 1px solid ${p => p.theme.color.primary};
        padding: ${p =>p.theme.size.s} 0;
        margin-top: ${p => p.theme.size.xl};
        font-size: 1.3em;
        user-select: none;

        svg {
            margin-right: ${p => p.theme.size.xxs};
        }

        :hover {
            background: ${p => p.theme.color.primary}40;
        }
    }

    .content {
        display: flex;

    }

    .title {
        display: block;
        color: ${p => p.theme.color.primary};
    }
`

const mapLaneToLabel: Record<Lane, string> = {
    [Lane.BOT]: 'Bot',
    [Lane.JUNGLE]: 'Jungle',
    [Lane.MID]: 'Mid',
    [Lane.SUPPORT]: 'Support',
    [Lane.TOP]: 'Top'
}

type EmptyLaneProps = {
    lane: Lane
    confirmed: boolean
    rolledChamps: Champ[]
    onResetLane: (lane: Lane) => void
}

const EmptyLane: React.FC<EmptyLaneProps> = props => {
    const { lane, onResetLane, rolledChamps, confirmed } = props
    const handleResetLane = useCallback(() => {
        onResetLane(lane)
    }, [lane, onResetLane])

    return <Wrapper confirmed={confirmed}>
        <div>
            <h2 className='title'>All {rolledChamps.length} {mapLaneToLabel[lane]} champs rolled</h2>
            <button onClick={handleResetLane} className='start-over-button'>
                <CasinoSharpIcon  fontSize='large' />
                Start over
            </button>
        </div>
    </Wrapper>
}

export default EmptyLane
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo } from 'react'
import styled, { useTheme } from 'styled-components'
import { Champ } from '../../../types'
import CircleScore, { CircleDataPoint } from './CircleScore'
import LockIcon from '@material-ui/icons/Lock';
import { getLaneName, laneToColorMap } from '../../../util';

type WrapperProps = {}

const Wrapper = styled.div<WrapperProps>`
    display: flex;
    justify-content: space-around;
    background: rgba(255,255,255,0.1);
    border-radius: 10px;
    padding: 16px;
    width: 100%;
    max-width: 100%;
    overflow: hidden;

    .single-score {
        font-size: 1.5em;
        font-weight: bolder;
    }

    .mastery-wrapper {
        display: flex;
        flex-direction: column;

        img {
            height: 50%;
        }

        .score {
            font-size: 1.3em;
        }
        > span {
            margin-top: ${p => p.theme.size.xxs};
            width: 100%;
            text-align: center;
        }
    }
`

const formatNumber = (number: number) => {
    const stringNum = Number(number).toLocaleString("en-US")
    const split = stringNum.split(',')
    if(number > 1000000) {
        // e.g. 1.323.000 to 1.32M 
        return split[0] + ',' + split[1].slice(0, 2) + 'm'
    }
    if(number > 10000) {
        // e.g. 15700 to 15k 
        return split[0] + ',' + split[1].slice(0, 2) + 'k'
    }
    return number
}

export type ScoresProps = {
    champ: Champ
    hasSummoner: boolean
}

const Scores:React.FC<ScoresProps> = props => {
    const { champ, hasSummoner } = props
    const theme: any = useTheme()

    const lanesDataPoints = useMemo(() => {
        const totalCount = champ.totalConfirmedCount
        return champ.confirmedCount.reduce<CircleDataPoint[]>((acc, curr) => {
            acc.push({
                title: getLaneName(curr.lane),
                color: laneToColorMap[curr.lane],
                value: curr.count / totalCount * 100
            })
            return acc
        }, [])
    }, [champ]) 


    const difficultyDataPoints = useMemo(() => {
        const maxDifficulty = 10
        const champDifficulty = champ.info.difficulty / maxDifficulty * 100
        const dataPoints: CircleDataPoint[] = [
            {
                title: '',
                value: 100 - champDifficulty,
                color: theme.color.primary + '40'
            },
            {
                title: '',
            value: champDifficulty,
            color: theme.color.primary
        }] 
        return dataPoints
    }, [champ])

    return <Wrapper>
        <CircleScore label='Times picked' dataPoints={lanesDataPoints}>
            <span className='single-score'>{formatNumber(champ.totalConfirmedCount)}</span>
        </CircleScore>
        <CircleScore label='Difficulty' dataPoints={difficultyDataPoints}>
            <span className='single-score'> {`${champ.info.difficulty}/10`}</span>
        </CircleScore>
        <CircleScore label='Mastery'>
            <div className='mastery-wrapper'>
                {hasSummoner ? <>
                    <img src={`./mastery/mastery_level${(champ.masteryLevel || 0) > 1 ? champ.masteryLevel : 0}.png`} className='mastery-level-img' alt='mastery-level-img' />
                    <span className='score'>{champ.masteryPoints && formatNumber(champ.masteryPoints)}</span>
                </> : <>
                    <LockIcon />
                </>}
                
            </div>
        </CircleScore>
        <CircleScore label='Score'>
            <span className='single-score'>{formatNumber(Math.round((champ.probability || 0) * 100))}</span>
        </CircleScore>
    </Wrapper>
}

export default Scores

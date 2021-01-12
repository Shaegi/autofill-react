import React from 'react'
import styled, { useTheme } from 'styled-components'
import { PieChart } from 'react-minimal-pie-chart';
import ScoreHint from './ScoreHint';

type WrapperProps = {
    size?: string
}

const size = '7vw'

const Wrapper = styled.div<WrapperProps>`
    height: 100%;
    display: flex;
    justify-content: center;

    flex-direction: column;
    .headline {
        display: flex;
        justify-content: center;
        .label {
            margin-bottom: ${p => p.theme.size.m};
        }

        .score-hint {
            margin-left: ${p => p.theme.size.s};
        }
    }

    .circle {
        width: ${p => p.size || size};
        height: ${p => p.size || size};
        display: grid;
        align-items: center;
        justify-content: center;

        > svg, .circle-content {
            grid-column: 1;
            grid-row: 1;
        }

        .circle-content {
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
`
export type CircleDataPoint = {
    title: string
    value: number
    color: string
}

export type CircleScoreProps = {
    label: React.ReactNode
    dataPoints?: CircleDataPoint[]
    title?: string
    hint?: React.ReactNode
    size?: string
    pieProps?: Record<string, any>
}

const CircleScore:React.FC<CircleScoreProps> = props => {
    const theme: any = useTheme()
    const { children, label, dataPoints = [{value: 100, color: theme.color.primary}], size, title, hint, pieProps } = props
    return <Wrapper title={title} size={size}>

        <div className='headline'>
            <span className='label'>
                {label}
            </span>
            {hint  && <ScoreHint>{hint}</ScoreHint>}
        </div>
        <div className='circle'>
            <PieChart 
                data={dataPoints}
                lineWidth={10}
                {...pieProps}
            />
            <div className='circle-content'>
                {children}
            </div>
        </div>
    </Wrapper>
}

export default CircleScore

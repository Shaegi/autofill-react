import React from 'react'
import styled, { useTheme } from 'styled-components'
import { PieChart } from 'react-minimal-pie-chart';

type WrapperProps = {}

const Wrapper = styled.div<WrapperProps>`
    height: 100%;
    display: flex;

    flex-direction: column;

    .label {
        text-align: center;
        margin-bottom: ${p => p.theme.size.m};
    }

    .circle {
        width: 7vw;
        height: 7vw;
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
}

const CircleScore:React.FC<CircleScoreProps> = props => {
    const theme: any = useTheme()
    const { children, label, dataPoints = [{value: 100, color: theme.color.primary}] } = props
    return <Wrapper>
        <span className='label'>
            {label}
        </span>
        <div className='circle'>
            <PieChart 
                data={dataPoints}
                lineWidth={10}
            />
            <div className='circle-content'>
                {children}
            </div>
        </div>
    </Wrapper>
}

export default CircleScore

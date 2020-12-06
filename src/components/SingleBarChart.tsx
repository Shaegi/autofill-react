import { Tooltip } from '@material-ui/core'
import React, { useLayoutEffect, useMemo, useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import tinyColor from 'tinycolor2'

const Wrapper = styled.div`
    ul {
        display: flex;
        max-width: 100%;
        list-style: none;
    }

    .single-bar-chart-title {
        font-size: 1.1em;
        margin-bottom: ${p => p.theme.size.xs};
        }
`

type DataPoint = {
    label: string
    percentage: number
    color: string
}

export type SingleBarChartProps = {
    dataPoints: DataPoint[]
    title: string
    className?: string
    hidePercentageInBar?: boolean
}


const SingleBarChart: React.FC<SingleBarChartProps> = props => {
    const { title, hidePercentageInBar } = props
    return <Wrapper className='single-bar-chart-wrapper'> 
        <span className='single-bar-chart-title'>{title}</span>
        <ul className='single-bar-chart-chart-wrapper'>
            {props.dataPoints.map(dataPoint => {
                return <DataPointRenderer dataPoint={dataPoint} hidePercentageInBar={hidePercentageInBar} />
            })}
        </ul>
    </Wrapper>
}

type StyledDataPointProps = DataPoint & {
    hasPopover?: boolean
    textColor: string
    isOverflowing?: boolean
}

const StyledDataPoint = styled.li<StyledDataPointProps>`
    width: ${p => p.percentage}%;
    background: ${p => p.color};
    height: 20px;
    text-align: center;
    line-height: 19px;
    overflow: hidden;
    position: relative;    
    ${p => p.hasPopover && css`
        cursor: pointer;
        &:hover {
            opacity: 0.75;
        }

    `}
    > span {
        padding: 0 ${p => p.theme.size.xs};
        opacity: ${p => p.isOverflowing ? 0 : 1};
        max-width: 100%;
        white-space: nowrap; 
        text-overflow: ellipsis;
        color: ${p => '#' + p.textColor};
    }
`

type DataPointRendererProps = {
    dataPoint: DataPoint
    hidePercentageInBar?: boolean
}

const DataPointRenderer: React.FC<DataPointRendererProps> = props => {
    const { hidePercentageInBar, dataPoint: { percentage, label, color }, dataPoint } = props
    const listItemRef = useRef<HTMLLIElement>(null)
    const labelRef = useRef<HTMLSpanElement>(null)
    const [isOverflowing, setIsOverflowing] = useState(false)

    const textColor = useMemo(() => {
        return tinyColor.mostReadable(color, ["grey", "lightgrey", "#EFFFFA"],{includeFallbackColors:true,level:"AA",size:"small"}).toHex()
    }, [color])
    

    useLayoutEffect(() => {
        if((labelRef.current?.offsetWidth|| 0 )> (listItemRef.current?.offsetWidth || 0)) {
            setIsOverflowing(true)
        } else {
            setIsOverflowing(false)
        }
    }, [props])

    const resolvedLabel = `${Math.round(percentage)}% ${label}`

    const hasPopover = !(!isOverflowing && !hidePercentageInBar)

    const content = <StyledDataPoint {...dataPoint} ref={listItemRef} isOverflowing={isOverflowing} hasPopover={hasPopover} textColor={textColor}> 
        <span ref={labelRef}>{hidePercentageInBar ? label : resolvedLabel}</span>
    </StyledDataPoint>

    if(!hasPopover) {
        return content
    } 

    return <Tooltip arrow title={resolvedLabel}>
        {content}
    </Tooltip>
} 

export default SingleBarChart
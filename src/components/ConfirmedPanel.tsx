import React, { useState, useEffect, useRef } from 'react'
import { Champ } from '../types'
import styled, { css, keyframes } from 'styled-components'
import { ConfirmedChampState } from '../App'

type WrapperProps = {
    hide: boolean
    delay: number
}


const Wrapper = styled.div<WrapperProps>`
    width: 60%; 
    position: absolute;
    left: 40%;
    background: black;
    height: 100%;
    opacity: 1;
    pointer-events: all;
    transition: 1s all ease-in-out;
    transition-delay: ${p => p.delay}ms;

    > .innerWrapper {
        color: white;
        h1 {
            color: ${p => p.theme.color.primary};
            margin-bottom: 0;
        }

        h2 {
            margin: 0;
        }
    }

    ${p => p.hide && css`
        opacity: 0;   
        transition-delay: none;
        pointer-events: none;
    `}

    .close {
        padding: ${p => p.theme.size.m};
        border: 1px solid ${p => p.theme.color.primary};
    }
`

type ConfirmedPanelProps = {
    confirmedState: ConfirmedChampState
    onUnConfirm: () => void
}

const ConfirmedPanel: React.FC<ConfirmedPanelProps> = (props) => {
    const { onUnConfirm: onUnconfirmed } = props
    const [delay, setDelay] = useState(500)

    const [champ, setChamp] = useState<Champ | null>(props.confirmedState ? props.confirmedState.champ : null)

    useEffect(() => {
        if(props.confirmedState) {
            setChamp(props.confirmedState.champ)
        } 
    }, [props.confirmedState])

    useEffect(() => {
        const set = (num: number) => {
            setTimeout(() => {
                setDelay(num)
            }, 500)
        }
        if(!!props.confirmedState) {
            set(0)
        } else {
            set(500)
        }
    }, [!!props.confirmedState])

    return <Wrapper hide={!props.confirmedState} delay={delay}>
        {champ && <div className='innerWrapper'>
        <button onClick={onUnconfirmed} className='close'>
            Close
        </button>
        <h1>{champ.name}</h1>
        <h2>{champ.title}</h2>
        </div>}
        
    </Wrapper>
}

export default ConfirmedPanel
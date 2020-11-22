import React from 'react'
import styled, { css } from 'styled-components'
import CloseIcon from '@material-ui/icons/Close';

type WrapperProps = {
    show: boolean
}

const Wrapper = styled.div<WrapperProps>`
    height: 100vh;
    width: 100%;
    color: ${p => p.theme.color.primary};
    z-index: 3;
    background: rgba(0,0,0, 0.9);
    top: 0;
    transform: translateX(100%);
    ${p => p.show && css`
        transform: translateX(0);
    `}
    transition: .4s all ease-in-out;
    position: absolute;
`

export type AutofillStatsProps = {
    show: boolean
    onHide: () => void
}

const SkinSelect: React.FC<AutofillStatsProps> = props => {
    const { show, onHide } = props
    return <Wrapper show={show}>
        Stats
        <div className='controls'>
            <button onClick={onHide}>
                <CloseIcon />
                Close
            </button>
        </div>
    </Wrapper>
}


export default SkinSelect
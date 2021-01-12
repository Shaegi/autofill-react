import { Popover } from '@material-ui/core'
import React, {  useState } from 'react'
import styled, {createGlobalStyle} from 'styled-components'

const Global  = createGlobalStyle<any>`
    .MuiPaper-root {
        max-width: 200px !important;
        padding: ${p => p.theme.size.xs};
        background: ${p => p.theme.color.background};
        color: ${p => p.theme.color.primary} !important; 
        border: 1px solid ${p => p.theme.color.primary} !important;
    }
`

type WrapperProps = {}

const Wrapper = styled.div<WrapperProps>`
    button {
        border: 1px solid ${p => p.theme.color.primary} !important;
        border-radius: 50%;
        height: 20px;
        width: 20px;

        :hover {
            background: rgba(255,255,255, 0.1);
        }
    }
`

export type ScoreHintProps = {
}

const ScoreHint:React.FC<ScoreHintProps> = props => {
    const [target, setTarget] = useState<HTMLButtonElement | null>(null)
    const [open, setOpen] = useState(false)
    return <Wrapper className='score-hint'>
        <Global />
        <button ref={setTarget} onClick={() => setOpen(true)}>?</button>
        <Popover
            open={open}
            anchorEl={target}
            onClose={() => setOpen(false)}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
        >
            {props.children}
        </Popover>
    </Wrapper>
}

export default ScoreHint

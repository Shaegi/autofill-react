import React from 'react'
import styled from 'styled-components'
import { CircularProgress } from '@material-ui/core'

const Wrapper = styled.div`
    width: 100vw;
    height: 100vh;
    background: black;
    display: flex;
    justify-content: center;
    align-items: center;
    
    > div {
        color: ${p => p.theme.color.primary};
    }
`

const SplashScreen: React.FC = () => {
    return <Wrapper>
        <CircularProgress size="15vh" />
    </Wrapper>
}


export default SplashScreen
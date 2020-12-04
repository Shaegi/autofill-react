import React from 'react'
import styled from 'styled-components'
import CloseIcon from '@material-ui/icons/Close';
import { SummonerInformation } from '../App'


const Wrapper = styled.div`
    min-height: 20vh;
    display: flex;
    flex-direction: row;
    .logout-button {
        border: 1px solid red;
        color: red;
        display: flex;
        align-items: center;
        padding: ${p => p.theme.size.s} ${p => p.theme.size.xs};
    }
    .footer {
        align-self: flex-end;
    }
`

type ProfileProps = {
    confirmedSummoner: SummonerInformation
    resetConfirmedSummoner: () => void
    hide: () => void
}

const Profile: React.FC<ProfileProps> = (props) => {
    const { resetConfirmedSummoner, confirmedSummoner, hide} = props
    return <Wrapper>
        <button onClick={hide} className='close'><CloseIcon /></button>
        <div>
            <h3>Hi {confirmedSummoner.name}</h3>
            <div className='content'>
            </div>
        </div>
        <div className='footer'>
            <button className='logout-button' onClick={resetConfirmedSummoner}>
                <CloseIcon />
                <span>Logout</span>
            </button>
        </div>
    </Wrapper>
}


export default Profile

import React, { useCallback, useRef, useState } from 'react'
import styled from 'styled-components'
import ModalButton, { ModalButtonApi } from '../ModalButton'
import PersonIcon from '@material-ui/icons/Person';
import Profile from './Profile';
import LoginSummonerName from './LoginSummonerName';
import { SummonerInformation } from '../../App';

type WrapperProps = {}

const Wrapper = styled.div<WrapperProps>`

    .expander {
        height: 58px;
    }
    .visibleWrapper {
        .summoner-profile {
            width: 30vw;
        }
    }
`

export type SummonerProfileProps = {
    confirmedSummoner?: SummonerInformation | null
    hide: boolean
    onConfirm: (summonerInformation: SummonerInformation | null) => void
}

const SummonerProfile:React.FC<SummonerProfileProps> = props => {
    const { confirmedSummoner, hide: shouldHide, onConfirm } = props
    const [visible, setVisible] = useState(false)

    const modalButtonRef = useRef<ModalButtonApi>(null)
    const hasEnteredName = !!confirmedSummoner?.name

    const hide = useCallback(() => {
        modalButtonRef.current?.hide()
    }, [])

    const setPreventHide = useCallback((prevent) => {
        modalButtonRef.current?.setPreventHide(prevent)
    }, [])

    const handleResetConfirmedSummoner = useCallback(() => {
        onConfirm(null)
        hide()
    }, [hide, onConfirm])

    const handleConfirm: SummonerProfileProps['onConfirm'] = useCallback((summoner) => {
        hide()
        onConfirm(summoner)
    },[onConfirm, hide]) 

    return <Wrapper>
        <ModalButton
            onVisibleChange={setVisible}
            hide={shouldHide}
            ref={modalButtonRef}
            renderModal={confirmedSummoner ? <Profile hide={hide} resetConfirmedSummoner={handleResetConfirmedSummoner} confirmedSummoner={confirmedSummoner}  /> : <LoginSummonerName visible={visible} setPreventHide={setPreventHide} onConfirm={handleConfirm} hide={hide} />}
            renderButton={hasEnteredName ? <div className='confirmed'><PersonIcon /><span>{confirmedSummoner?.name}</span></div> : <span>Enter Summoner Name</span>}
        />
    </Wrapper>
}

export default SummonerProfile

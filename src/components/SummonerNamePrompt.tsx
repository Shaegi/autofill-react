import React, { useState, useCallback, useEffect, useRef } from 'react'
import styled, { css } from 'styled-components'
import PersonIcon from '@material-ui/icons/Person';
import { Backdrop } from '@material-ui/core';
import { SummonerInformation } from '../App';
import LoginSummonerName from './LoginSummonerName';
import Profile from './Profile';

const SummonerNamePromptWrapper = styled.div<{ show: boolean, shouldHide: boolean }>`

  transition: 0.2s all ease-in-out;

  ${p => p.show ? css`
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
    width: 20vw;
    height: 20vh;
  ` : css`
    top: 0%;
    left: 50%;
    transform: translateX(-50%);
    ${p.shouldHide && css`
      transition: 0.5s all ease-in-out;
      transform: translateX(-50%) translateY(-200px);
    
    `}
  `}
 

  position: fixed;
  z-index: 10;
  color: ${p => p.theme.color.primary};

  .hintAndErrorSection {
    height: 1.5em;
    overflow: hidden;
    position: relative;
  }

 

  .visibleWrapper {
    background: ${p => p.theme.color.background};
    border-radius: 4px;
    position: relative;
    padding: ${p => p.theme.size.m};
    border: 1px solid ${p => p.theme.color.primary};
    .close {
        position: absolute;
        right: 12px;
        top: 12px;
        cursor: pointer;
        svg {
          color: ${p => p.theme.color.primary};
        }
    }

    .content-wrapper {
      display: flex;
      align-items: center;
    }

    select, input {
      border: 1px solid ${p => p.theme.color.primary};
      background: transparent;
      outline: none;
      color: ${p => p.theme.color.primary};
      padding: 0 ${p => p.theme.size.m};
      box-sizing: border-box;
      height: 45px;
    }

    select {
      margin-left: ${p => p.theme.size.s};
    }

    .search-button {
      box-sizing: border-box;
      margin-left: ${p => p.theme.size.m};
      padding: ${p => p.theme.size.m};
      height: 45px;
      border: 1px solid ${p => p.theme.color.primary};
    }
  }



  .expander {
    border-radius: 2px;
    background: ${p => p.theme.color.background};
    padding: ${p => p.theme.size.m};
    border: 1px solid ${p => p.theme.color.primary};

    .confirmed {
      display: flex;
      align-items: center;
    }
  }
`


type EnterSummonerNamePromptProps = {
  onConfirm: (summonerInformation: SummonerInformation | null) => void
  hide: boolean
  confirmedSummoner?: SummonerInformation | null
}

const EnterSummonerNamePrompt: React.FC<EnterSummonerNamePromptProps> = props => {
  const { onConfirm, confirmedSummoner, hide: shouldHide } = props
  const [visible, setShow] = useState(false)
  const [preventHide, setPreventHide] = useState(false)


  const hide = useCallback(() => {
    setShow(false)
  }, [])

  const show = useCallback(() => {
    setShow(true)
  }, [])


  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (visible && inputRef.current) {
      inputRef.current.focus()
    }
  }, [visible])

  const hasEnteredName = !!confirmedSummoner?.name

  const handleConfirm: EnterSummonerNamePromptProps['onConfirm'] = useCallback((summoner) => {
      hide()
      onConfirm(summoner)
  },[onConfirm, hide])

  const handleResetConfirmedSummoner = useCallback(() => {
    onConfirm(null)
    hide()
  }, [hide, onConfirm]) 

  return <>
    {visible && <Backdrop open style={{ zIndex: 9 }} onClick={() => !preventHide && hide()} />}
    <SummonerNamePromptWrapper show={visible}  shouldHide={shouldHide}>
      {visible ?
        <>
          <div className='visibleWrapper'> 
            {confirmedSummoner ? <Profile hide={hide} resetConfirmedSummoner={handleResetConfirmedSummoner} confirmedSummoner={confirmedSummoner}  /> : <LoginSummonerName setPreventHide={setPreventHide} onConfirm={handleConfirm} hide={hide} />}
          </div>
          </> : <>
          <button className='expander' onClick={show}>{hasEnteredName ? <div className='confirmed'><PersonIcon /><span>{confirmedSummoner?.name}</span></div> : <span>Enter Summoner Name</span>}</button>
        </>
      }
    </SummonerNamePromptWrapper>
  </>
}




export default EnterSummonerNamePrompt
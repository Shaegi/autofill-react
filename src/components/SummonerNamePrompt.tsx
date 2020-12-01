import React, { useState, useCallback, useEffect, useRef, useContext } from 'react'
import styled, { css, ThemeContext } from 'styled-components'
import PersonIcon from '@material-ui/icons/Person';
import CloseIcon from '@material-ui/icons/Close';
import { Backdrop, CircularProgress } from '@material-ui/core';
import { useApolloClient } from '@apollo/react-hooks';
import { ChampsQuery } from '../gql/ChampsQuery';

const SummonerNamePromptWrapper = styled.div<{ show: boolean, showHint: boolean, error: boolean, shouldHide: boolean }>`

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

  .error {
    transform: translateY(-50px);
    position: absolute;
    top: 0;
    ${p => p.error && css`
      transform: translateY(0);
    `}
    transition: 0.2s all ease-in-out;
    color: ${p => p.theme.color.error};
  }

  .hint {
    position: absolute;
    transition: .2s all ease-in-out;
    top: 0;
    transform: translateY(-50px);
    ${p => p.showHint && css`
      transform: translateY(0);
    `}
  }

  .visibleWrapper {
    background: black;
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
    input {
      border: 1px solid ${p => p.theme.color.primary};
      background: black;
      outline: none;
      color: ${p => p.theme.color.primary};
      padding: ${p => p.theme.size.m};
    }

    .search-button {
      margin-left: ${p => p.theme.size.xs};
      padding: ${p => p.theme.size.m};
      border: 1px solid ${p => p.theme.color.primary};
    }
  }

  .loader {
    display: flex;
    align-items: center;
    span {
      margin-left: ${p => p.theme.size.xs};
    }
  }

  .expander {
    background: black;
    padding: ${p => p.theme.size.m};
    border: 1px solid ${p => p.theme.color.primary};

    .confirmed {
      display: flex;
      align-items: center;
    }
  }
`

type EnterSummonerNamePromptProps = {
  onConfirm: (name: string) => void
  hide: boolean
  confirmedName?: string | null
}

const EnterSummonerNamePrompt: React.FC<EnterSummonerNamePromptProps> = props => {
  const { onConfirm, confirmedName, hide: shouldHide } = props
  const [visible, setShow] = useState(false)
  const [inputValue, setInputValue] = useState(confirmedName || '')
  const [confirmLoading, setConfirmLoading] = useState(false)

  useEffect(() => {
    setInputValue(confirmedName || '')
  }, [confirmedName])

  const hide = useCallback(() => {
    setShow(false)
    setInputValue(confirmedName || '')
  }, [confirmedName])
  const show = useCallback(() => {
    setShow(true)
  }, [])

  const [errorName, setError] = useState<string | null>(null)
  const [showMinLengthHint, setShowMinLengthHint] = useState(false)

  const client = useApolloClient()

  const handleInputChange = useCallback((ev: React.ChangeEvent) => {
    ev.target instanceof HTMLInputElement &&
      setInputValue(ev.target.value)
  }, [])


  const handleConfirm = useCallback(() => {
    if(inputValue.length === 0) {
      setShowMinLengthHint(true)
      return
    }
    const focus = () => {
      if(inputRef.current) {
        inputRef.current.focus()
      }
    }

    if(inputRef.current && inputRef.current.checkValidity()) {
      setConfirmLoading(true)
      client.query({ query: ChampsQuery, variables: { summonerName: inputValue} }).then(() => {
        setConfirmLoading(false)
        onConfirm(inputValue)
        hide()
      }).catch(er => {
        setConfirmLoading(false)
        setError(inputValue)
        focus()
      })
    } else {
      setShowMinLengthHint(true)
      focus()
    }
  }, [client, hide, inputValue, onConfirm])

  const handleKeydown = useCallback((ev: React.KeyboardEvent<HTMLInputElement>) => {
    setShowMinLengthHint(false)
    setError(null)
    // enter
    if (ev.keyCode === 13) {
      handleConfirm()
    } else if (ev.keyCode === 27) {
      // escape
      hide()
    }
  }, [handleConfirm, hide])

  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (visible && inputRef.current) {
      inputRef.current.focus()
    }
  }, [visible])

  const hasEnteredName = !!confirmedName

  const theme = useContext(ThemeContext)


  return <>
    {visible && <Backdrop open style={{ zIndex: 9 }} onClick={confirmLoading ? undefined:  hide} />}
    <SummonerNamePromptWrapper show={visible} error={!!errorName} showHint={showMinLengthHint} shouldHide={shouldHide}>
      {visible ?
        <>
          <div className='visibleWrapper'>
          {confirmLoading ? <div className='loader'>
              <CircularProgress color={theme.color.primary} />
              <span>Loading summoner data</span>
            </div> : <>
              <h2>Enter your Summoner Name</h2>
              <button onClick={hide} className='close'><CloseIcon /></button>
              <div className='hintAndErrorSection'>
                <div className='error'>Could not find any summoner with name: {errorName}</div>
                <div className='hint'>At least 3 characters</div>
              </div>
              <div>
                <input ref={inputRef} value={inputValue} onChange={handleInputChange} minLength={3} onKeyDown={handleKeydown} />
                <button className='search-button' onClick={handleConfirm}>Search</button>
              </div>
            </>}
          </div></> : <>
          <button className='expander' onClick={show}>{hasEnteredName ? <div className='confirmed'><PersonIcon /><span>{confirmedName}</span></div> : <span>Enter Summoner Name</span>}</button>
        </>

      }

    </SummonerNamePromptWrapper>
  </>
}


export default EnterSummonerNamePrompt
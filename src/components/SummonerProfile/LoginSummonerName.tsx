import { useApolloClient } from '@apollo/react-hooks'
import { CircularProgress } from '@material-ui/core'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import styled, { css, ThemeContext } from 'styled-components'
import { SummonerInformation } from '../../App'
import CloseIcon from '@material-ui/icons/Close';
import { ChampsQuery } from '../../gql/ChampsQuery'

const Wrapper = styled.div<{showHint: boolean, error: boolean, loading: boolean }>`
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

  .loader {
    display: flex;
    align-items: center;
    justify-content: center;
    span {
      margin-left: ${p => p.theme.size.m};
    }
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

`


const availableServers = [
    {label: 'EUW', key: 'euw1'},
    {label: 'NA', key: 'na1'},
    {label: 'EUN', key: 'eun1'},
    {label: 'LATIN 1', key: 'la1'},
    {label: 'LATIN 2', key: 'la2'},
    {label: 'JP', key: 'jp1'},
    {label: 'KR', key: 'kr1'},
    {label: 'OC', key: 'oc1'},
    {label: 'RU', key: 'ru'},
    {label: 'TR', key: 'tr1'},
    {label: 'BR', key: 'br1'},
  ]
  

type LoginSummonerNameProps = {
    onConfirm: (summoner: SummonerInformation) => void
    setPreventHide: (preventHide: boolean) => void
    hide: () => void
    visible: boolean
  }
  
  const LoginSummonerName: React.FC<LoginSummonerNameProps> = (props) => {
    const {  onConfirm, setPreventHide, visible } = props
    const [inputValue, setInputValue] = useState('')
    const [selectedServer, setSelectedServer] = useState(availableServers[0].key)
    const [errorName, setError] = useState<string | null>(null)
    const [confirmLoading, setConfirmLoading] = useState(false)
    const theme = useContext(ThemeContext)
    const inputRef = useRef<HTMLInputElement>(null)
    const client = useApolloClient()
    const [showMinLengthHint, setShowMinLengthHint] = useState(false)

    const hide = useCallback(() => {
        setInputValue('')
        setSelectedServer(availableServers[0].key)
        props.hide()
      }, [props])
  
    const handleServerSelectChange = useCallback((ev: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedServer(ev.target.value)
    }, [])

    const focus = useCallback(() => {
      if(inputRef.current) {
        inputRef.current.focus()
      }
    }, [])

    useEffect(() => {
      setTimeout(() => {
        visible && focus()
      }, 300)
    }, [visible, focus])
  
    const handleConfirm = useCallback(() => {
      if(inputValue.length === 0) {
        setShowMinLengthHint(true)
        return
      }
  
      if(inputRef.current && inputRef.current.checkValidity()) {
        setConfirmLoading(true)
        setPreventHide(true)
        client.query({ query: ChampsQuery, variables: { summoner: {
          server: selectedServer,
          name: inputValue
        }} }).then(() => {
          setConfirmLoading(false)
          setPreventHide(false)
          onConfirm({
            name: inputValue,
            server: selectedServer
          })
        }).catch(er => {
          setPreventHide(false)
          setConfirmLoading(false)
          setError(inputValue)
          focus()
        })
      } else {
        setShowMinLengthHint(true)
        focus()
      }
    }, [client, focus, inputValue, onConfirm, selectedServer, setPreventHide])
  
    useEffect(() => {
      focus()
    }, [focus])
    
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
    
  
    const handleInputChange = useCallback((ev: React.ChangeEvent) => {
      ev.target instanceof HTMLInputElement &&
        setInputValue(ev.target.value)
    }, [])
  
    return <Wrapper error={!!errorName} showHint={showMinLengthHint} loading={confirmLoading}>
    { confirmLoading ? <div className='loader'>
        <CircularProgress color={theme.color.primary} />
        <span>Loading summoner data</span>
      </div> : <>
        <h2>Enter your Summoner Name</h2>
        <button onClick={hide} className='close'><CloseIcon /></button>
        <div className='hintAndErrorSection'>
          <div className='error'>Could not find any summoner with name: {errorName}</div>
          <div className='hint'>At least 3 characters</div>
        </div>
        <div className='content-wrapper'>
          <input ref={inputRef} value={inputValue} onChange={handleInputChange} minLength={3} onKeyDown={handleKeydown} />
          <select  onChange={handleServerSelectChange} value={selectedServer}>
            {availableServers.map(server => {
              return <option value={server.key} key={server.key}>
                {server.label}
              </option>
            })}
          </select>
          <button className='search-button' onClick={handleConfirm}>Search</button>
        </div>
      </>}
      </Wrapper>
  }
  
  export default LoginSummonerName
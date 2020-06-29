import React, { useCallback, useState, useContext, useEffect, useRef, useMemo } from 'react'
import styled, { useTheme, ThemeContext, createGlobalStyle, css } from 'styled-components'
import CheckSharpIcon from '@material-ui/icons/CheckSharp'
import CasinoSharpIcon from '@material-ui/icons/CasinoSharp'
import { Lane, Champ } from '../types'
import { CircularProgress } from '@material-ui/core'
import { ConfirmedChampState } from '../App'

type StyledSplashImageProps = {
    hovered: boolean
    left: number
    hide: boolean
    isConfirmed?: boolean
    width: number
    selectedIndex?: number |null
    imgSrc: string
  }
  
  const StyledSplashImage = styled.div<StyledSplashImageProps>`
    max-width: ${p => p.width}vw;
    width: ${p => p.width}vw;   
    min-width: ${p => p.width}vw;
    overflow: hidden;
    opacity: ${p => p.hide ? 0 : 1};
    height: 100vh;
    background-repeat: no-repeat;
    background-size: cover;
    background-position-x: 70%;
    background-image: url(${p => p.imgSrc});
    transition: all .7s ease-in-out;
    position: relative;

    .hidden {
      height: 0;
      width: 0;
    }

    .loader {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      div {
        color: ${p => p.theme.color.primary};
      }
    }
  
  
    &::after {
      content: '';
      position: absolute;
      top: 0;
      pointer-events: none;
      left: 0;
      width: calc(100% - 2px);
      height: calc(100% - 2px);
      border: 1px solid ${p => p.hovered ? p.theme.color.primary : 'transparent'};
    }
  
    .reroll, .confirm {
      position: absolute;
      bottom: 0;
  
      > div {
        display: flex; 
        justify-content: center;
        flex-direction: column;
        align-items: center;
        font-weight: 500;
        font-size: 1.5em;
        svg {
          font-size: 4em;
          color: ${p => p.theme.color.primary}; 
        }
      }
      height: 50%;
      cursor: pointer;
      justify-content: center;
      width: 100%;
      display: flex;
      align-items: center;
      &:hover {
        background: rgba(255,255,255,0.3);
      }
    }
  
    .confirm {
      top: 0;
    }
  `
  
  const RoleImage = styled.img<{ show: boolean}>`
    position: absolute;
    top: 50%;
    opacity: ${p => p.show ? 1 : 0};
    transition: 150ms all ease;
    left: 50%;
    pointer-events: none;
    user-select: none;
    -webkit-user-drag: none;
    -webkit-user-select: none;
    transform: translate(-50%, -50%);
  `
  

export type SplashImageProps = {
    role: Lane
    index: number
    confirmedChampState: ConfirmedChampState | null
    champ: Champ
    onRoll: (role: Lane) => void
    onConfirm: (role: Lane, champ: Champ, index: number) => void
  }
  
  
  const SplashImage: React.FC<SplashImageProps> = props => {
    const { champ, role, onRoll, onConfirm, confirmedChampState, index } = props
    const [hovered, setHovered] = useState(false)
    const imgSrc = `http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champ.id}_0.jpg`
  
    const handleRoll = useCallback(() => {
      onRoll(role)
    }, [role, onRoll])
  
    const handleConfirm = useCallback(() => {
      onConfirm(role, champ, index)
    },[champ, onConfirm])

    const loadedRef = useRef<string | null>(null)
    
    const [loading, setLoading] = useState(true)

    useEffect(() => {
      // sometimes img is already loaded before effect has been called. Therefore we remember last loaded champ.id, if its the same, img already has been loaded
      if(loadedRef.current !== champ.id) {
        setLoading(true)
      }
      loadedRef.current = null
    }, [champ.id])

    const handleLoaded = useCallback(() => {
      loadedRef.current = champ.id
      setLoading(false)
    }, [setLoading, champ])

    const isConfirmed = confirmedChampState && confirmedChampState.champ.id === champ.id && confirmedChampState.role === role

    // useEffect(() => {
    //   const calc = () => {
    //     setWidth(isConfirmed ? window.innerWidth * .4 : window.innerWidth / 5)
    //   }
    //   window.addEventListener('resize', calc)
    //   return () => window.removeEventListener('resize', calc)
    // }, [isConfirmed])


    useEffect(() => {
      if(isConfirmed) {
        setHovered(false)
      }
    }, [isConfirmed])

    const handleMouseEnter = useCallback(() => {
      if(!isConfirmed) {
        setHovered(true)
      }
    }, [isConfirmed])
    const handleMouseLeave = useCallback(() => {
      if(!isConfirmed) {
        setHovered(false)
      }
    }, [isConfirmed])

    const wrapperRef = useRef<HTMLDivElement>(null)

    const [leftOffset, setLeftOffset] = useState(0)

    useEffect(() => {
      const calcLeftOffset = () => {
        if(wrapperRef.current) {
          const rect = wrapperRef.current.getBoundingClientRect()
          if(wrapperRef.current.offsetLeft !== 0){
            setLeftOffset(-(wrapperRef.current.offsetLeft - rect.width * 0.5))
          } 
        }
      }
      calcLeftOffset()
      window.addEventListener('resize', calcLeftOffset)

      return () =>  {
        window.removeEventListener('resize', calcLeftOffset)
      }
    }, [isConfirmed])

    console.log(confirmedChampState, isConfirmed, !!confirmedChampState && !isConfirmed)
    const width = useMemo(() => {
      if(confirmedChampState) {
        if(isConfirmed) {
          return 40
        } else if(index > confirmedChampState.roleIndex) {
          return 20
        } 
        return 0
      }

      return 20
    }, [confirmedChampState])
    
    
    return <StyledSplashImage ref={wrapperRef} selectedIndex={confirmedChampState && confirmedChampState.roleIndex} hovered={hovered} width={width} onMouseEnter={handleMouseEnter} isConfirmed={!!isConfirmed} hide={!!confirmedChampState && !isConfirmed} onMouseLeave={handleMouseLeave} imgSrc={imgSrc} left={isConfirmed ? leftOffset : 0}>
        {hovered ? <><div className='reroll' onClick={handleRoll}>
          <div>
            <CasinoSharpIcon  fontSize='large' />
          </div>
        </div>
        <div className='confirm' onClick={handleConfirm}>
          <div>
          <CheckSharpIcon  />
          </div>
          </div></> : null}
        {!isConfirmed && <RoleImage alt="" src={`${role}_icon.png`} className='role_img' show={!hovered} />}
        {loading && <div className='loader'>
          <CircularProgress  size={100} />
        </div>}
        <img className='hidden' src={imgSrc} onLoad={handleLoaded}  />
      </StyledSplashImage>
  }

  export default React.memo(SplashImage)
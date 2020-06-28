import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components'
import EnterSummonerNamePrompt from './components/SummonerNamePrompt';
import SplashImage, { SplashImageProps } from './components/SplashImage';
import { Lane, Champ } from './types';
import useRollState from './behaviour/useRoleState';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import SplashScreen from './components/SplashScreen';
import ConfirmedPanel from './components/ConfirmedPanel';


const StyledApp = styled.div`
  display: flex;
  max-width: 100vw;
  overflow: hidden;
  max-height: 100vh;
  height: 100%;
  background: black;

  button {
    outline: none;
    cursor: pointer;
    color: ${p => p.theme.color.primary};
    border: none; 
    background: inherit;
  }
`



const BottomBarWrapper = styled.div`  
  position: fixed;
  bottom: ${p => p.theme.vspace.l};
  display: flex;
  right: ${p => p.theme.hspace.l};
  button {
    height: ${p => p.theme.size['3xl']};
    width: ${p => p.theme.size['3xl']};
    border-radius: 50%;
    font-size: 1.5em;
    display: flex;
    align-items:center;
    justify-content: center;
    cursor: pointer;
    outline: none;
    background: ${ p => p.theme.color.primary};
    border: none;
    &:hover {
      box-shadow: 2px 2px #000;
    }
  }
  button + button {
    margin-left: ${p => p.theme.hspace.xs};
  }

  .help {
    font-weight: bold;
  }
` 

const BottomBar: React.FC = props => {
  return <BottomBarWrapper>
    <button className='help'>
      ?
    </button>
    <button className='filter'>
      <img src={'filter_alt-24px.svg'} alt='filter' />
    </button>
  </BottomBarWrapper>
}

type DataProviderProps = {
  summonerName?: string
}

export const ChampsQuery = gql`
  query Champs ($summonerName: String) {
      champs(summonerName: $summonerName) {
        name
        title
        chestGranted
        title
        masteryLevel
        masteryPoints
        info {
          difficulty
        }
        id
        roles
        tags
        lanes
        probability
      }
    }
`



const DataProvider: React.FC<DataProviderProps> = props => {
    const [confirmedName, setConfirmedName] = useState<string | null>("")
    const { data, loading } = useQuery(ChampsQuery, { 
    variables: {
      summonerName: confirmedName
    }
  })

  if(loading || !data) {
    return <SplashScreen />
  }

  return <App 
    onSummonerNameChange={setConfirmedName}
    confirmedName={confirmedName}
    champs={data.champs}
  />
}


type AppProps = {
  champs: Champ[]
  confirmedName: string | null
  onSummonerNameChange: (name: string) => void
}


const App: React.FC<AppProps> = (props) => {
  const { champs, onSummonerNameChange, confirmedName } = props
  const { rollState, onRoll, onRollAllLanes } = useRollState(champs)
  const [confirmedChamp, setConfirmedChamp] = useState<Champ | null>(null)

  useEffect(() => {
    onRollAllLanes()
  }, [confirmedName])

  console.log(rollState)


  const handleConfirm = useCallback<SplashImageProps['onConfirm']>((champ) => {
    setConfirmedChamp(champ)
  }, []) 

  const handleUnConfirm = useCallback(() => {
    setConfirmedChamp(null)
  }, [])

  return (
    <StyledApp>
      <EnterSummonerNamePrompt onConfirm={onSummonerNameChange} confirmedName={confirmedName} hide={!!confirmedChamp} />
      <SplashImage  champ={rollState[Lane.TOP]} role={Lane.TOP} onRoll={onRoll} onConfirm={handleConfirm} confirmedChamp={confirmedChamp}  />
      <SplashImage champ={rollState[Lane.JUNGLE]}  role={Lane.JUNGLE}  onRoll={onRoll} onConfirm={handleConfirm} confirmedChamp={confirmedChamp}/>
      <SplashImage champ={rollState[Lane.MID]}  role={Lane.MID}  onRoll={onRoll} onConfirm={handleConfirm} confirmedChamp={confirmedChamp}/>
      <SplashImage champ={rollState[Lane.BOT]} role={Lane.BOT}  onRoll={onRoll} onConfirm={handleConfirm} confirmedChamp={confirmedChamp}/>
      <SplashImage champ={rollState[Lane.SUPPORT]} role={Lane.SUPPORT}  onRoll={onRoll} onConfirm={handleConfirm} confirmedChamp={confirmedChamp}/>
      <ConfirmedPanel champ={confirmedChamp} onUnConfirm={handleUnConfirm} />
      {/* <BottomBar /> */}
    </StyledApp>
  )
}

export default DataProvider;

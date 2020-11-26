import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components'
import EnterSummonerNamePrompt from './components/SummonerNamePrompt';
import SplashImage, { SplashImageProps } from './components/SplashImage';
import { Lane, Champ } from './types';
import useRollState from './behaviour/useRoleState';
import { useQuery,  useApolloClient } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import SplashScreen from './components/SplashScreen';
import ConfirmedPanel from './components/ConfirmedPanel';
import EmptyLane from './components/EmptyLane';


const StyledApp = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  max-width: 100vw;
  overflow: hidden;
  max-height: 100vh;
  height: 100%;
  background: black;

  .MuiCircularProgress-root {
    color: ${p => p.theme.color.primary};
  }

  button {
    outline: none;
    cursor: pointer;
    color: ${p => p.theme.color.primary};
    border: none; 
    background: inherit;
  }

  .endorsement {
    color: ${p => p.theme.color.primary};
    position: absolute;
    bottom: ${p => p.theme.size.xs};
    right: ${p => p.theme.size.xs};
    z-index: 4;
  }
`
type DataProviderProps = {
  summonerName?: string
}

export const ChampsQuery = gql`
  query Champs ($summonerName: String) {
      champs(summonerName: $summonerName) {
        name
        key
        title
        chestGranted
        title
        masteryLevel
        masteryPoints
        info {
          difficulty
        }
        skins {
          name
          num
          id
        }
        layout {
          key
          splashArtOffset
        }
        id
        roles
        tags
        lanes {
          type
          probability
        }
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

export type ConfirmedChampState = {
  champ: Champ,
  role: Lane,
  roleIndex: number
} | null


const SelectChampMutation = gql`
mutation selectChamp($input: SelectChampInput) {
  selectChamp(input: $input)
}
`

const App: React.FC<AppProps> = (props) => {
  const { champs, onSummonerNameChange, confirmedName } = props
  const { rollState, onRoll, onResetAllLanes: onRollAllLanes, emptyLanes, onResetLane, alreadyRolledChampsState } = useRollState(champs)
  const [confirmedChampState, setConfirmedChamp] = useState<ConfirmedChampState>(null)

  const client = useApolloClient()

  useEffect(() => {
    if(confirmedName) {
      onRollAllLanes()
    }
  }, [confirmedName, onRollAllLanes])

  const handleConfirm = useCallback<SplashImageProps['onConfirm']>((role, champ, index) => {

    client.mutate({
      mutation: SelectChampMutation, variables: {
        input: {
          championId: champ.id,
          summonerName: confirmedName,
          lane: role
        }
      }
    })

    setConfirmedChamp({
      champ,
      role,
      roleIndex: index
    })
  }, [client, confirmedName]) 

  const handleUnConfirm = useCallback(() => {
    setConfirmedChamp(null)
  }, [])

  return (
    <StyledApp>
      <EnterSummonerNamePrompt onConfirm={onSummonerNameChange} confirmedName={confirmedName} hide={!!confirmedChampState} />
      {Object.values(Lane).map((lane, index) => {
        if(emptyLanes.includes(lane)) {
          return <EmptyLane key={lane} lane={lane} onResetLane={onResetLane} rolledChamps={alreadyRolledChampsState[lane]} confirmed={!!confirmedChampState?.champ}  />
        }
        return <SplashImage isLoggedIn={!!confirmedName} key={lane} champ={rollState[lane]} role={lane} onRoll={onRoll} onConfirm={handleConfirm} confirmedChampState={confirmedChampState} index={index} />
      })}
      <ConfirmedPanel confirmedState={confirmedChampState} onUnConfirm={handleUnConfirm} />
      <div className='endorsement'>
        Autofill isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc.
      </div>
    </StyledApp>
  )
}

export default DataProvider;

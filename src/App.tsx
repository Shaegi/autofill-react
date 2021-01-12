import React, { useState, useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components'
import SplashImage, { SplashImageProps } from './components/SplashImage';
import { Lane, Champ } from './types';
import useRollState from './behaviour/useRoleState';
import { useApolloClient } from '@apollo/react-hooks';
import ConfirmedPanel from './components/ConfirmedPanel/ConfirmedPanel';
import EmptyLane from './components/EmptyLane';
import { SelectChampMutation, SelectChampMutationResponse } from './gql/SelectChampMutation';
import ChampCountFragment from './gql/ChampCountFragment';
import Filter from './components/Filter';
import SummonerProfile from './components/SummonerProfile/SummonerProfile';


const StyledApp = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  max-width: 100vw;
  overflow: hidden;
  max-height: 100vh;
  height: 100%;
  background: ${p => p.theme.color.background};

  .top-bar {
    position: absolute;
    z-index: 99;
    top: 0%;
    gap: 16px;
    justify-content: center;
    display: flex;
    width: 100%;
  }

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

export type SummonerInformation = {
  name: string
  server: string
}

type AppProps = {
  champs: Champ[]
  confirmedSummoner?: SummonerInformation | null
  onSummonerChange: (summoner: SummonerInformation | null) => void
}


export type ConfirmedChampState = {
  champ: Champ,
  role: Lane,
  roleIndex: number
} | null

const App: React.FC<AppProps> = (props) => {
  const { champs, onSummonerChange, confirmedSummoner } = props
  const { rollState, onRoll, onResetAllLanes: onRollAllLanes, emptyLanes, onResetLane, alreadyRolledChampsState, persistFilter, filter } = useRollState(champs)
  const [confirmedChampState, setConfirmedChamp] = useState<ConfirmedChampState>(null)
  const skipFirstRoll = useRef(true)
  const alreadyConfirmedChampIds = useRef<string[]>([])

  const client = useApolloClient()

  useEffect(() => {
    if(confirmedChampState) {
      setConfirmedChamp(p => p ? ({
        ...p,
        champ: rollState[p.role] 
      }) : null)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rollState])

  useEffect(() => {
    if(skipFirstRoll.current) {
      skipFirstRoll.current = false
    } else {
      onRollAllLanes()
    }
    
  }, [confirmedSummoner, onRollAllLanes])

  const handleConfirmChamp = useCallback<SplashImageProps['onConfirm']>((role, champ, index) => {
    // prevent double confirms
    if(alreadyConfirmedChampIds.current.some(id => champ.id === id)) {
      
    
    alreadyConfirmedChampIds.current.push(champ.id)

    client.mutate<SelectChampMutationResponse>({
      mutation: SelectChampMutation, variables: {
        input: {
          championId: champ.id,
          summonerName: confirmedSummoner?.name,
          lane: role
        }
      },
      optimisticResponse: {
        selectChamp: true
      },
      update: (cache, res) => {
        const cacheId = `Champ:` + champ.id
        const data = cache.readFragment<Champ>({
          id: cacheId,
          fragment: ChampCountFragment
        })
        if(data) {
          const nextData = {
            ...data,
            totalConfirmedCount: data.totalConfirmedCount + 1,
            confirmedCount: data.confirmedCount.map(count => {
              if(count.lane === role) {
                return {
                  ...count,
                  count: count.count + 1
                }
              }
              return count
            })
          }
          cache.writeFragment({
            id: cacheId,
            data: nextData,
            fragment: ChampCountFragment
          })
        }
      }
    })
  } 
  setConfirmedChamp({
      champ,
      role,
      roleIndex: index
    })
  }, [client, confirmedSummoner]) 

  const handleUnConfirmChamp = useCallback(() => {
    setConfirmedChamp(null)
  }, [])

  return (
    <StyledApp>
      <div className='top-bar'>
        <SummonerProfile 
          onConfirm={onSummonerChange}
          confirmedSummoner={confirmedSummoner}
          hide={!!confirmedChampState}
        />
        <Filter champs={champs} persistFilter={persistFilter} initialFilter={filter} />
      </div>
      {Object.values(Lane).map((lane, index) => {
        if(emptyLanes.includes(lane)) {
          return <EmptyLane key={lane} lane={lane} onResetLane={onResetLane} rolledChamps={alreadyRolledChampsState[lane]} confirmed={!!confirmedChampState?.champ}  />
        }
        return <SplashImage isLoggedIn={!!confirmedSummoner} key={lane} champ={rollState[lane]} role={lane} onRoll={onRoll} onConfirm={handleConfirmChamp} confirmedChampState={confirmedChampState} index={index} />
      })}
      <ConfirmedPanel confirmedSummoner={confirmedSummoner} confirmedState={confirmedChampState} onUnConfirm={handleUnConfirmChamp} />
      <div className='endorsement'>
        Autofill isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc.
      </div>
    </StyledApp>
  )
}

export default App

import { useQuery } from '@apollo/react-hooks'
import React from 'react'
import App, { SummonerInformation } from './App'
import usePersistedState from './behaviour/usePersistedState'
import SplashScreen from './components/SplashScreen'
import { ChampsQuery, ChampsQueryResponse } from './gql/ChampsQuery'

type DataProviderProps = {
}
const DataContainer: React.FC<DataProviderProps> = props => {
    const {state: confirmedSummoner, setState: setConfirmedSummoner} = usePersistedState<SummonerInformation | null>('summoner', null)
    const { data, loading } = useQuery<ChampsQueryResponse>(ChampsQuery, { 
        variables: {
        summoner: confirmedSummoner
        },
        onError: () => {
            setConfirmedSummoner(null)
        }
    })

    if(loading || !data?.champs.champs) {
        return <SplashScreen />
    }

    return <App 
        onSummonerChange={setConfirmedSummoner}
        confirmedSummoner={confirmedSummoner}
        champs={data.champs.champs}
    />
}

export default DataContainer
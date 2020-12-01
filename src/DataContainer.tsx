import { useQuery } from '@apollo/react-hooks'
import React, { useState } from 'react'
import App from './App'
import SplashScreen from './components/SplashScreen'
import { ChampsQuery } from './gql/ChampsQuery'

type DataProviderProps = {
    summonerName?: string
}
const DataContainer: React.FC<DataProviderProps> = props => {
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

export default DataContainer
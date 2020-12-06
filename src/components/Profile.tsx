import React, { useMemo } from 'react'
import styled, { useTheme } from 'styled-components'
import CloseIcon from '@material-ui/icons/Close';
import { SummonerInformation } from '../App'
import SingleBarChart from './SingleBarChart';
import { useQuery } from '@apollo/react-hooks';
import { ChampsQuery, ChampsQueryResponse } from '../gql/ChampsQuery';
import { Lane, Role } from '../types'

const laneToColorMap: Record<Lane, string> = {
    [Lane.BOT]: '#A30B37',
    [Lane.JUNGLE]: '#8FC0A9',
    [Lane.TOP]: '#690375',
    [Lane.MID]: '#0E0E52',
    [Lane.SUPPORT]: '#FCCA46'
}

const roleToColorMap: Record<Role, string> = {
    [Role.MARKSMAN]: '#F17F29',
    [Role.TANK]: '#8FC0A9',
    [Role.FIGHTER]: '#690375',
    [Role.MAGE]: '#0E0E52 ',
    [Role.SUPPORT]: '#FCCA46',
    [Role.ASSASSIN]: '#A30B37'
}

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .logout-button {
        border: 1px solid red;
        color: red;
        display: flex;
        align-items: center;
        padding: ${p => p.theme.size.s} ${p => p.theme.size.xs};
    }

    .single-bar-chart-wrapper {
        margin-top: ${p => p.theme.size.s};
    }

    .footer {
        margin-top: ${p => p.theme.size.s};
        display: flex;
        justify-content: flex-end;
    }
`

const getLaneName = (lane: Lane) => {
    let resolved = lane.replace('LANE_TYPE_', '')

    return resolved[0] + resolved.substr(1).toLowerCase()
}

type ProfileProps = {
    confirmedSummoner: SummonerInformation
    resetConfirmedSummoner: () => void
    hide: () => void
}

const Profile: React.FC<ProfileProps> = (props) => {
    const { resetConfirmedSummoner, confirmedSummoner, hide} = props
    const theme: any = useTheme()

    const { data } = useQuery<ChampsQueryResponse>(ChampsQuery, { variables: {
        summoner: confirmedSummoner
    }})

    const profile = data?.champs.profile

    const lanesDataPoints = useMemo(() => {
        if(!profile?.lanes) {
            return []
        }
        const totalCount = profile.lanes.reduce((acc, curr) => acc + curr.count, 0)

        return profile.lanes.map(lane => ({
            color: laneToColorMap[lane.type],
            label: getLaneName(lane.type),
            percentage: lane.count / totalCount * 100
        }))
    }, [profile])

    const rolesDataPoints = useMemo(() => {
        if(!profile?.roles) {
            return []
        }
        const totalCount = profile.roles.reduce((acc, curr) => acc + curr.count, 0)

        return profile.roles.map(role => ({
            color: roleToColorMap[role.type],
            label: role.type,
            percentage: role.count / totalCount * 100
        }))
    }, [profile])

    const champsDataPoints = useMemo(() => {
        if(!profile?.playedChamps) {
            return []
        }
        const totalCount = profile?.playedChamps.reduce((acc, curr) => acc + (curr.lanes.reduce((acc, curr) => acc + curr.count, 0)), 0)

        return profile?.playedChamps.map((champ, i) => {
            const fullChamp = data?.champs.champs.find(c => c.key === champ.id) 
            return {
                label: fullChamp?.name || 'Default',
                color: i % 2 === 0 ? theme.color.primary : 'white',
                percentage: champ.lanes.reduce((acc, curr) => acc + curr.count, 0) / totalCount * 100
            }
        })
    }, [data, profile, theme.color.primary])

    if(!profile) {
        return null
    }

    return <Wrapper>
        <button onClick={hide} className='close'><CloseIcon /></button>
        <div>
            <h3>Hi {confirmedSummoner.name}</h3>
            <div className='content'>
                Total games analyzed: {profile.gamesAnalyzed}
                <SingleBarChart dataPoints={lanesDataPoints} title='Lanes' />
                <SingleBarChart dataPoints={rolesDataPoints} title='Roles' />
                <SingleBarChart dataPoints={champsDataPoints} title='Champs' hidePercentageInBar={true} />
            </div>
        </div>
        <div className='footer'>
            <button className='logout-button' onClick={resetConfirmedSummoner}>
                <CloseIcon />
                <span>Logout</span>
            </button>
        </div>
    </Wrapper>
}


export default Profile

import React, { useMemo } from 'react'
import styled from 'styled-components'
import CloseIcon from '@material-ui/icons/Close';
import { useQuery } from '@apollo/react-hooks';
import CircleScore from '../ConfirmedPanel/scores/CircleScore';
import { SummonerInformation } from '../../App';
import { ChampsQuery, ChampsQueryResponse } from '../../gql/ChampsQuery';
import { getLaneName, laneToColorMap, roleToColorMap } from '../../util';

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

    .stats {
        margin: ${p => p.theme.size.s} 0;
        height: 17vh;
        align-items: center;
        justify-content: space-around;
        border-radius: 4px;
        display: flex;
        width: 100%;
        .circle {
            text {
                font-size: 0.8em;
                fill: white
            }
        }
        background: rgba(255,255,255, 0.1);
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

type ProfileProps = {
    confirmedSummoner: SummonerInformation
    resetConfirmedSummoner: () => void
    hide: () => void
}

const Profile: React.FC<ProfileProps> = (props) => {
    const { resetConfirmedSummoner, confirmedSummoner, hide} = props

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
            title: getLaneName(lane.type),
            value: lane.count / totalCount * 100
        }))
    }, [profile])

    const rolesDataPoints = useMemo(() => {
        if(!profile?.roles) {
            return []
        }
        const totalCount = profile.roles.reduce((acc, curr) => acc + curr.count, 0)

        return profile.roles.map(role => ({
            color: roleToColorMap[role.type],
            title: role.type,
            value: role.count / totalCount * 100
        }))
    }, [profile])

    const champsDataPoints = useMemo(() => {
        if(!profile?.playedChamps) {
            return []
        }
        const totalCount = profile?.playedChamps.reduce((acc, curr) => acc + (curr.lanes.reduce((acc, curr) => acc + curr.count, 0)), 0)

        return profile?.playedChamps.map((champ, i) => {
            const fullChamp = data?.champs.champs.find(c => c.key === champ.id) 

            const value = champ.lanes.reduce((acc, curr) => acc + curr.count, 0) / totalCount * 100
            const colorValues = Object.values(roleToColorMap)
            return {
                title: (fullChamp?.name || 'Default') + ` ${Math.round(value)}%` ,
                color: colorValues[i % Object.values(roleToColorMap).length],
                value
            }
        })
    }, [data, profile])

    if(!profile) {
        return null
    }

    return <Wrapper>
        <button onClick={hide} className='close'><CloseIcon /></button>
        <div>
            <h3>Hi {confirmedSummoner.name}</h3>
            <div className='content'>
                Total games analyzed: {profile.gamesAnalyzed}
                <div className='stats'>
                    <CircleScore 
                        size='6vw'
                        label='Lanes'
                        dataPoints={lanesDataPoints}
                        pieProps={{
                            label:({ dataEntry }: any) => {
                                const rounded = Math.round(dataEntry.value) 
                                if(rounded < 10) {
                                    return null
                                }
                                return rounded + '%'
                            },
                            lineWidth: undefined
                        }}
                    />
                    <CircleScore 
                        size='6vw'
                        label='Roles'
                        dataPoints={rolesDataPoints}
                        pieProps={{
                            label:({ dataEntry }: any) => {
                                const rounded = Math.round(dataEntry.value) 
                                if(rounded < 10) {
                                    return null
                                }
                                return rounded + '%'
                            },
                            lineWidth: undefined
                        }}
                    />
                    <CircleScore 
                        size='6vw'
                        label='Champs'
                        dataPoints={champsDataPoints}
                        pieProps={{
                            lineWidth: undefined
                        }}
                    />
                </div>
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

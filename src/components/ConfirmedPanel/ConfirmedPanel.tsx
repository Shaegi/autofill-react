import  React, { useState, useEffect, useMemo } from 'react'
import styled, { css } from 'styled-components'
import { ConfirmedChampState, SummonerInformation } from '../../App'
import CloseIcon from '@material-ui/icons/Close';
import LockIcon from '@material-ui/icons/Lock';
// import TimelineIcon from '@material-ui/icons/Timeline';
import BuildPreview from '../BuildPreview';
import DifficultyBar from './DifficultyBar';
import SkinSelect from './SkinSelect/SkinSelect';
import EmojiEmotionsOutlinedIcon from '@material-ui/icons/EmojiEmotionsOutlined';
import { Champ } from '../../types';
import SingleBarChart, { SingleBarChartDataPoint} from '../SingleBarChart'
import { getLaneName, laneToColorMap } from '../../util';

type WrapperProps = {
    hide: boolean
    delay: number
}


const Wrapper = styled.div<WrapperProps>`
    width: 60%; 
    position: absolute;
    left: 40%;
    background: black;
    height: 100%;
    opacity: 1;
    pointer-events: all;
    transform: translate(0vw);
    transition: .8s all ease-in-out;
    will-change: transform;

    ${p => p.hide && css`
        pointer-events: none;
        transform: translate(100vw);
    `}

    > .innerWrapper {
        color: white;
        position: relative;
        height: 100%;
        .title {
            color: black;
            display: inline-flex;
            padding: ${p => p.theme.size.l} ${p => p.theme.size.xl};
            background: rgba(255,255,255,0.8);
            /* background: rgba(11, 198, 227, .85); */
            flex-direction: column;
            position: relative;
            transition: 1s all ease-in-out;
            transition-delay: 0.3s;
            z-index: 4;
            transform: translate(-50%, 20%);

            ${p => p.hide && css`
                transform: translate(50%, 20%);
            `}

            .titleBorder {
                clip-path: polygon(100% 100%, -200% 100%, 100% -200%);
                position: absolute;
                left: 0px;
                top: 0px;

                /* border: 1px solid ${p => p.theme.color.primary}; */
                border: 1px solid ${p => p.theme.color.primary};
                transform: translate(10px, 10px);
                width: 100%;
                height: 100%;
            }
            h1 {
                margin: 0;
                font-size: 6em;
            }

            h2 {
                margin: 0;
            }


            
            .tags {
                position: absolute;
                padding-inline-start: 0;
                padding: ${p => p.theme.size.s};
                top: 50%;
                display: flex;
                align-items: center;
                background: rgba(255,255,255,0.85);
                list-style: none;
                font-weight: 700;
                font-size: 2em;
                transform: translateY(10vh);
                li + li {
                    padding-left: ${p => p.theme.size.s};
                }
            }    
        }

        .content  {
                position: absolute; 
                right: 0;
                top: 0;
                
                .stats {
                    max-width: 30vw;
                    margin-top: ${p => p.theme.size.m};
                    .your-history-wrapper {
                        .mastery {
                            margin-top: ${p => p.theme.size.xs};
                            display: flex;
                            align-items: center;
                            font-size: 30px;
                            line-height: 100%;
                            .mastery-points {
                                margin-left: ${p => p.theme.size.m};
                            }
                            .mastery-level-img {
                                height: 48px;
                            }
                        }
                    }
                }
        }
    }

    .locked-message {
        display: flex;
        align-items: center;
    }

    

    .autofillStatsToggle {
        height:  100%;
        position: absolute;
        right: 0;
        top: 0;
        background: rgba(255,255,255,0.6);  

        > span {
            position: absolute;
            top: 50%;
            transform: rotate(90deg);
        }
    }

    .controls {
        position: absolute;
        right: ${p => p.theme.size["3xl"]};
        display: flex;
        flex-direction: column;
        bottom: 10%;
        > button {
            padding: ${p => p.theme.size.l};
            display: inline-flex;
            align-items: center;
            > svg {
                height: 2.5em;
                width: 2.5em;
            }
            font-size: 2.5em;
            border: 1px solid ${p => p.theme.color.primary};

            :hover {
                background: rgba(255,255,255,0.3);
            }
        }

        button + button {
            margin-top: ${p => p.theme.size.m};
        }
    }
`

type ConfirmedPanelProps = {
    confirmedSummoner?: SummonerInformation | null
    confirmedState: ConfirmedChampState
    onUnConfirm: () => void
}

const ConfirmedPanel: React.FC<ConfirmedPanelProps> = (props) => {
    const { onUnConfirm: onUnconfirmed, confirmedSummoner } = props
    const [delay, setDelay] = useState(500)

    // do this so we can have an animation on cancel
    const [persistedConfirmState, setPersistedConfirmState] = useState<ConfirmedChampState | null>(props.confirmedState ? props.confirmedState : null)

    useEffect(() => {
        if(props.confirmedState) {
            setPersistedConfirmState(props.confirmedState)
        } 
    }, [props.confirmedState])

    useEffect(() => {
        const set = (num: number) => {
                setDelay(num)
        }
        if(!!props.confirmedState) {
            set(0)
        } else {
            set(500)
        }
    }, [props.confirmedState])
    const [showSkinSelect, setShowSkinSelect] = useState(false)
    let champ: Champ | null = null
    
    if(persistedConfirmState) {
        champ = persistedConfirmState.champ
    }
    
    const lanesDataPoints = useMemo(() => {
        if(!champ) {
            return []
        } else {
            const totalCount = champ.totalConfirmedCount
            return champ.confirmedCount.reduce<SingleBarChartDataPoint[]>((acc, curr) => {
                acc.push({
                    label: getLaneName(curr.lane),
                    color: laneToColorMap[curr.lane],
                    percentage: curr.count / totalCount * 100
                })
                return acc
            }, [])
        }
    }, [champ]) 

    return <Wrapper hide={!props.confirmedState} delay={delay}>
        {champ && persistedConfirmState && <> 
        <div className='innerWrapper'>
        <div className='title'> 
            <div className='titleBorder' />
            <h1>{champ.name}</h1>
            <h2>{champ.title}</h2>
            <ul className='tags'>
                {champ.tags.map(tag => {
                    return <li>{tag}</li>
                })}
            </ul>
        </div>
        <div className='content'>
            <div className='guides'>
                <BuildPreview champ={champ} lane={persistedConfirmState.role} />
            </div>
            <div className='champion-stats stats'>
                <h2>Champion Stats</h2>
                <div>
                    <h3>Difficulty</h3>
                    <DifficultyBar difficulty={champ.info.difficulty} />   
                </div>
            </div>
            <div className='your-stats stats'>
                <h2>Your Stats</h2>
                {confirmedSummoner ? <div className='your-history-wrapper'>
                        <div className='mastery'>
                            <img src={`./mastery/mastery_level${(champ.masteryLevel || 0) > 1 ? champ.masteryLevel : 0}.png`} className='mastery-level-img' alt='mastery-level-img' />
                            <div className='mastery-points'>
                                {new Intl.NumberFormat().format(champ.masteryPoints || 0)} MP
                            </div>
                        </div>
                    </div> : <div className='locked-message'>
                        <LockIcon />
                        Enter SummonerName to unlock your champ stats
                    </div>}
                <div>
            </div>
            <div className='autofill-stats stats'>
                <h2>Autofill Stats</h2> 
                    <div>
                        <h3>Total Times picked</h3>
                        <div>
                            <div>
                                <SingleBarChart dataPoints={lanesDataPoints} title='Lanes' />
                            </div>
                            <div>
                                <span>Picked </span> {champ.totalConfirmedCount || 0} times across all lanes.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className='controls'>
            <button onClick={() => setShowSkinSelect(true)}>
                <EmojiEmotionsOutlinedIcon />   
                Skins
            </button>
            <button onClick={onUnconfirmed} className='close'>
                <CloseIcon />
                Close
            </button>
        </div>
        </div>
        {champ && <SkinSelect champ={champ}  show={showSkinSelect} onHide={() => setShowSkinSelect(false)} />}
        </>
        }
    </Wrapper>
}



export default ConfirmedPanel
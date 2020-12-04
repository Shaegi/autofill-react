import React, { useState, useEffect } from 'react'
import styled, { css } from 'styled-components'
import { ConfirmedChampState } from '../../App'
import CloseIcon from '@material-ui/icons/Close';
import LockIcon from '@material-ui/icons/Lock';
import TimelineIcon from '@material-ui/icons/Timeline';
import AutofillStats from './AutofillStats';
import BuildPreview from '../BuildPreview';
import DifficultyBar from './DifficultyBar';
import SkinSelect from './SkinSelect/SkinSelect';

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
    transition: 1s all ease-in-out;

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
        }
    }

    ${p => p.hide && css`
        opacity: 0;   
        transition-delay: none;
        pointer-events: none;
        transform: translate(50vw);
    `}

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
        right: 10%;
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
        }

        button + button {
            margin-top: ${p => p.theme.size.m};
        }
    }
`

type ConfirmedPanelProps = {
    confirmedSummoner?: string
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


    const [showAutofillStats, setShowAutofillStats] = useState(false)
    const [showSkinSelect, setShowSkinSelect] = useState(false)

    let champ = null

    if(persistedConfirmState) {
        champ = persistedConfirmState.champ
    }


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
            <div className='stats'>
                <h3>Difficulty</h3>
                <DifficultyBar difficulty={champ.info.difficulty} />   
            </div>
            <div className='yourHistory'>
                <h3>Your History</h3>
                {confirmedSummoner ? <div>
                        MasteryPoints: ${champ.masteryPoints}
                        MasteryLevel: ${champ.masteryLevel}
                    </div> : <div>
                        <LockIcon />
                        Enter SummonerName to unlock your champ stats
                    </div>}
                <div>
                    <h3>Times picked:</h3>
                        <div>
                            <span>Total:</span> {champ.totalConfirmedCount}
                        </div>
                    </div>
            </div>
        </div>
        <div className='controls'>
            <button onClick={() => setShowAutofillStats(true)}>
                <TimelineIcon />
                Autofill stats
            </button>
            <button onClick={() => setShowSkinSelect(true)}>
                <TimelineIcon />
                Skins
            </button>
            <button onClick={onUnconfirmed} className='close'>
                <CloseIcon />
                Close
            </button>
        </div>
        </div>
        <AutofillStats  show={showAutofillStats} onHide={() => setShowAutofillStats(false)} />
        <SkinSelect champ={champ}  show={showSkinSelect} onHide={() => setShowSkinSelect(false)} />
        </>
        }
    </Wrapper>
}



export default ConfirmedPanel
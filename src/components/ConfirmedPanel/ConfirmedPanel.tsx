import  React, { useState, useEffect } from 'react'
import styled, { css } from 'styled-components'
import { ConfirmedChampState, SummonerInformation } from '../../App'
import CloseIcon from '@material-ui/icons/Close';
import SkinSelect from './SkinSelect/SkinSelect';
import EmojiEmotionsOutlinedIcon from '@material-ui/icons/EmojiEmotionsOutlined';
import { Champ } from '../../types';
import Scores from './scores/Scores';
import Guides from './Guides/Guides';

type WrapperProps = {
    hide: boolean
    delay: number
}


const Wrapper = styled.div<WrapperProps>`
    width: 60%; 
    position: absolute;
    left: 40%;
    background: ${p => p.theme.color.background};
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

        > .content  {
                display: flex;
                height: calc(100% - 40px);
                flex-direction: column;
                justify-content: space-between;
                position: absolute; 
                right: ${p => p.theme.size.m};
                overflow: hidden;
                top: 0;
                margin-bottom: ${p => p.theme.size.xl};

                .guides {
                    flex-grow: 1;
                    margin-bottom: ${p => p.theme.size.m};
                }
                
                .scores {
                    display: flex;
                    margin-top: ${p => p.theme.size.m};
                }
        }
    }

    .controls {
        margin-top: ${p => p.theme.size.m};
        display: flex;
        width: 100%;
        align-items: flex-end;
        justify-content: flex-end;

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
            margin-left: ${p => p.theme.size.m};
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
                {/* <BuildPreview champ={champ} lane={persistedConfirmState.role} /> */}
                <Guides champ={champ} lane={persistedConfirmState.role} />
            </div>
            <div className='scores'>
                <Scores champ={champ} hasSummoner={!!confirmedSummoner} lane={persistedConfirmState.role} />
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
        </div>
        {champ && <SkinSelect champ={champ}  show={showSkinSelect} onHide={() => setShowSkinSelect(false)} />}
        </>
        }
    </Wrapper>
}



export default ConfirmedPanel
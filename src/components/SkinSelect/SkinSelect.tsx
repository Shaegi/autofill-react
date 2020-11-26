import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import CloseIcon from '@material-ui/icons/Close';
import { Champ } from '../../types';
import Skin from './Skin';
import { Casino as CasinoIcon } from '@material-ui/icons';

type WrapperProps = {
    show: boolean
    confirmed: boolean
    spinning?: boolean
    rolledSkin?: number
}

const Wrapper = styled.div<WrapperProps>`
    height: 100vh;
    width: 100%;
    color: ${p => p.theme.color.primary};
    z-index: 3;
    background: rgba(0,0,0, 0.9);
    top: 0;
    transform: translateX(100%);
    ${p => p.show && css`
        transform: translateX(0);
    `}
    transition: .4s all ease-in-out;
    position: absolute;

    .content {
        display: flex;
        justify-content: ${p => p.confirmed ? 'center' : 'flex-end'};

        > div  {
            display: flex;
            flex-direction: column;

            h1 {
                text-align: center;
                width: 100%;
            }
        }
    }

    > .controls {
        flex-direction: row !important;
        button {
            margin-right: ${p => p.theme.size.s};
        }

        button + button {
            margin: 0 !important;
        }
    }

    .carousel-wrapper {
        max-height: 100vh;
    }

    .selected-skins {
        display: flex;
        width: 20vw;
        flex-wrap: wrap;
        list-style: none;
        transition: .5s all ease-out;
        will-change: transform;
        transform: translateY(0);
        ${p => p.spinning && css`
            transform: translateY(-100%) translateY(100vh) translateY(${((p.rolledSkin || 0) * 15) - 15 - 50}vh);
        `}
        
        li {
            box-sizing: border-box;
            height: 15vh;
            > img {
                height: 100%;
            }
        }
    }

    .available-skins {
        padding-top: ${p => p.theme.size.xs};
        display: flex;
        flex-wrap: wrap;
        list-style: none;
        max-height: 70vh;
        overflow: auto;
        width: 45vw;
        cursor: pointer;
        gap: ${p => p.theme.size.xs};

        img {
            width: 14vw;
        }
    }
`

export type SkinSelectProps = {
    show: boolean
    champ: Champ
    onHide: () => void
}


const SkinSelect: React.FC<SkinSelectProps> = props => {
    const { show, onHide, champ } = props

    const [ownedSkins, setOwnedSkins] = useState<number[]>(champ.skins.map(s => s.num))
    const [confirmed, setConfirmed] = useState(false)
    const [spinning, setSpinning] = useState(false)
    const [skinRolled, setRolledSkin] = useState<number | null>(null)
    const filteredSkins = champ.skins.filter(skin => ownedSkins.includes(skin.num))

    const handleConfirm = useCallback(() => {
        setConfirmed(true)
        setRolledSkin(Math.floor(Math.random() * filteredSkins.length))
    }, [filteredSkins.length])

    const handleSkinClick = useCallback((skin: Champ['skins'][number]) => {
        setOwnedSkins(p => {
            const next = [...p].filter(s => s !== skin.num)
            if(p.length === next.length) {
                next.push(skin.num)
            }
            return next
        })
    }, [])
    const carouselCount = 200
    const offset = 15

    useEffect(() => {
        if(!show) {
            setConfirmed(false)
            setSpinning(false)
        } else {
            setOwnedSkins(champ.skins.map(s => s.num))
        }
    }, [champ.skins, show])

    console.log(skinRolled)


    useLayoutEffect(() => {
        if(confirmed) {
            setTimeout(() => {
                setSpinning(true)
            }, 200)
        }
    }, [confirmed])

    console.log(skinRolled)

    if(confirmed && skinRolled) {
        return <Wrapper show={show} confirmed={confirmed} spinning={spinning} rolledSkin={skinRolled + offset}>
            <div className='content'>
                <div className='carousel-wrapper'>
                    <ul className='selected-skins'>
                        {Array.from(Array(carouselCount).keys()).reduce<any[]>((acc, curr, i) => [...acc, filteredSkins[i % filteredSkins.length]], []).map((skin, index) => {
                            const rolled = index === carouselCount - skinRolled - offset
                            return <Skin  champ={champ} active={rolled} rolled={rolled} skin={skin} onClick={handleSkinClick} />
                        })}
                    </ul>
                </div>
            </div>
            <div className='controls'>
            <button onClick={onHide}>
                <CloseIcon />
                Close
            </button>
        </div>
        </Wrapper>
    }

    return <Wrapper show={show} confirmed={confirmed}>
        <div className='content'>
            <div>
                <h1>Select the skins you own</h1>
                <ul className='available-skins'>
                    {champ.skins.map(skin => <Skin champ={champ} active={ownedSkins.includes(skin.num)} skin={skin} onClick={handleSkinClick} />)}
                </ul>
            </div>
        </div>
        <div className='controls'>
            <button onClick={handleConfirm}>
                <CasinoIcon />
                Confirm
            </button>
            <button onClick={onHide}>
                <CloseIcon />
                Close
            </button>
        </div>
    </Wrapper>
}

export default SkinSelect
import React, { useCallback, useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import { Champ } from '../../types'

const getSkinUrl = (champId: Champ['id'], num: number) => `http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champId}_${num}.jpg`
const getTransformedName = (name: string) => name.substr(0, 1).toUpperCase() + name.slice(1)

const Wrapper = styled.li<{ active: boolean, rolled?: boolean, highlight?: boolean }>`
    border: 1px solid transparent;
    ${p => p.active && css`
        border-color: ${p.theme.color.primary};
    `}
    ${p => p.rolled && css`
        border-width: 3px;
    `}

    transition: 1s all ease-in-out;

    ${p => p.highlight && css`
        transform: scale(2);
    `}
`

type SkinProps = {
    champ: Champ
    skin: Champ['skins'][number]
    active: boolean
    rolled?: boolean
    onClick?: (skin: SkinProps['skin']) => void
}

const Skin: React.FC<SkinProps> = props => {
    const { champ, skin, onClick, active, rolled } = props
    const transformName = getTransformedName(skin.name)
    const url = getSkinUrl(champ.id, skin.num)
    const handleClick = useCallback(() => {
        onClick?.(skin)
    }, [onClick, skin])

    const [highlight, setHighlight] = useState(false)

    useEffect(() => {
        if(rolled) {
            setTimeout(() => {
                setHighlight(true)
            }, 400)
        }
    }, [rolled])

    return <Wrapper key={skin.id} onClick={handleClick} highlight={highlight} active={active} rolled={rolled}>
        <img src={url} alt={transformName} title={transformName} />
    </Wrapper>
}

export default Skin
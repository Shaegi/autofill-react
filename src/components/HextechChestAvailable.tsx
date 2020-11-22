import React from 'react'
import classNames from 'classnames'
import styled from 'styled-components'
import { Champ } from '../types'
const Wrapper = styled.div`
    > div {
        position: relative;
        .hextech-chest-available-logged-in-indicator {
            position: absolute;
            top: 50%;
            line-height: 24px;
            color: white;
            font-weight: bold;
            left: 50%;
            transform: translate(-50%, -50%);
        }
        }
        .hextech-chest-available {
        height: 24px;
        filter: opacity(0.3);
        &.isAvailable {
            filter: none;
        }
    }
`

export type HextechChestAvailableProps = {
    isLoggedIn?: boolean
    champ: Champ
}

const HextechChestAvailable: React.FC<HextechChestAvailableProps> = props => {
    const { champ, isLoggedIn } = props

    return <Wrapper className='hextech-chest-available-wrapper'>
    <div>
      {!isLoggedIn && <span className='hextech-chest-available-logged-in-indicator'>?</span>}
      <img src='./hextechChest.PNG' className={classNames('hextech-chest-available', { 'isAvailable': champ.chestGranted === false })} title={!isLoggedIn ? 'Enter summoner name to unlock' : ''} alt="hextech-chest indicator" />
    </div>
  </Wrapper>
}

export default HextechChestAvailable

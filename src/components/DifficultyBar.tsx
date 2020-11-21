import React from 'react'
import styled from 'styled-components'
import classnames from 'classnames'

const MAX_DIFFICULTY = 10


type DifficultyBarProps = {
    difficulty: number
}

type DifficultyBarWrapperProps = {
}

const Wrapper = styled.div<DifficultyBarWrapperProps>`
    width: 20vw;
    height: 30px;
    display: flex;
    border: 1px solid ${p => p.theme.color.primary};

    

    .difficulty {
        width: 100%;
        flex-grow: 1;
        &.active {
            background: ${p => p.theme.color.primary}40;
        }
    }

    .difficulty + .difficulty {
        border-left: 1px solid ${p => p.theme.color.primary};
    }
`

const DifficultyBar: React.FC<DifficultyBarProps> = props => {
    return <Wrapper>
        {(new Array(MAX_DIFFICULTY)).fill("").map((n, index) => {
            return <div key={String(index)} className={classnames(['difficulty', { active: index < props.difficulty }])} />
        })}
    </Wrapper>
}

export default DifficultyBar

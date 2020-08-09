import React from 'react'
import { Champ } from '../../types'

export type ProBuildsProps = {
    champ: Champ
}

const ProBuilds: React.FC<ProBuildsProps> = props => {
    const {champ } = props
    return <>
    <a href={`https://www.probuilds.net/champions/details/${champ.key}`} target={'__blank'}>
        ProBuilds.net
    </a>
    <iframe src={`https://www.probuilds.net/champions/details/${champ.key}`} width={'20vw'} />
    </>
}

export default ProBuilds
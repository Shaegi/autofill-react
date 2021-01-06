import React, { useState, useCallback, useEffect } from 'react'
import { Tabs, Tab, CircularProgress } from '@material-ui/core'
import { Champ, Lane } from '../types'
import styled from 'styled-components'

const getProBuildsUrl = (champ: Champ) => {
    return `https://www.probuilds.net/champions/details/${champ.key}`
}

const laneToOPGGUrlParamMap = {
    [Lane.BOT]: 'bot',
    [Lane.TOP]: 'top',
    [Lane.JUNGLE]: 'jungle',
    [Lane.MID]: 'mid',
    [Lane.SUPPORT]: 'support'
}


const getOPGGUrl = (champ: Champ, lane: Lane) => {
    return `https://op.gg/champion/${champ.name.toLowerCase()}/statistics/${laneToOPGGUrlParamMap}`
}

const Iframe = styled.iframe`
    height: 30vh;
    width: 50vw;
`



type TabPanelProps = {
    index: number   
    value: number
    url: string
}

const TabPanelWrapper = styled.div` 
    height: 100%;
    width: 50vw;
    margin-top: 8px;
    position: relative;
    background: rgba(255,255,255,0.1);

    .loader {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        > div {
            height: 100px !important;
            width:  100px !important;
        }
    } 


    > iframe {
            border: none;
        height: 100%;
        width: 100%;
    }
`

const TabPanel: React.FC<TabPanelProps> = (props) => {
    const { index, value, url } = props
    const [loading, setLoading] = useState(false)


    useEffect(() => {
        if(index === value) {
            setLoading(true)
        }
    },[index, value])

    if(index !== value) {
        return null
    }
    return <TabPanelWrapper>
        {loading && <div className='loader'><CircularProgress /></div>}
        <Iframe src={url} onLoad={() => {
            setLoading(false)
        }}/>    
    </TabPanelWrapper>
}

const Wrapper = styled.div`
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    margin-top: ${p => p.theme.size.s};
    .MuiTab-root {
        font-weight: bold;
    }
    .Mui-selected {
        color: white;
    }
    .MuiTabs-indicator  {
        background-repeat: none;
        transform: translateY(-4px);
        background: radial-gradient(#e3cea3 0%, transparent 82%);
    }
`

export type BuildPreviewProps = {
    champ: Champ
    lane: Lane
}

const BuildPreview: React.FC<BuildPreviewProps> = props => {
    const { champ, lane } = props
    const [value, setValue] = useState(0)

    const handleChange = useCallback((event: any, value: any) => {
        setValue(value)
    }, [])

    return <Wrapper key={champ.key}>
        <Tabs value={value} onChange={handleChange}>
            <Tab label="OP.gg" />
            <Tab label="ProBuilds.net" />
        </Tabs>
        <TabPanel value={value} index={0} url={getOPGGUrl(champ, lane)} />
        <TabPanel value={value} index={1} url={getProBuildsUrl(champ)} />
    </Wrapper>
}


export default BuildPreview
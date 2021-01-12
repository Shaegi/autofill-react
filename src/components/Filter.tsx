/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import ModalButton from './ModalButton'
import { Champ } from '../types'
import classNames from 'classnames'
import { RollFilter } from '../behaviour/useRoleState'
import ScoreHint from './ConfirmedPanel/scores/ScoreHint'

type WrapperProps = {}

const Wrapper = styled.div<WrapperProps>`
    .filter-modal {
        width: 50vw;
        max-height: 70vh;
        min-height: 50vh;
        overflow: hidden;
        display: flex;
        flex-direction: column;

        .headline-row {
            display: flex;
            align-items: center;

            h2, .score-hint {
                margin-right: ${p => p.theme.size.s};
            }
        }

        .tag-list, .champ-list {
            display: flex;
            flex-wrap: wrap;
            list-style: none;
            max-height: 100%;
            gap: ${p => p.theme.size.xs};
            width: 100%;
            overflow: auto;
        }

        .tag-list {
            display: flex;
            flex-shrink: 0;
            margin-bottom: ${p => p.theme.size.m};
            margin-top: ${p => p.theme.size.xxs};

            li {
                color: white;
                cursor: pointer;
                background: ${p => p.theme.color.primary};
                padding: ${p => p.theme.size.xxs};
                
                &.disabled {
                    background: grey;
                }
            }
        }
        
        .champ-list {
            li {
                position: relative;
                cursor: pointer;
                width: calc(7.5% - 8px);
                min-height: 40px;
                -webkit-user-drag: none;
                user-select: none;

                img {
                    -webkit-user-drag: none;
                    user-select: none;
                }
                img {
                    width: 100%;
                }
                gap: 8px;
                &.disabled {
                    img {
                        filter: grayscale(10);

                    }

                    &::after {
                        content: "";
                        height: 97%;
                        width: 3px;
                        transform-origin:center;
                        transform: skew(-45deg);
                        position: absolute;
                        box-shadow: 2px 2px 2px black;
                        background: lightcoral;
                        left: 50%;
                        top: 0;
                    }
                }
            }
        }
    }
`

export type FilterProps = {
    champs: Champ[]
    initialFilter: RollFilter
    persistFilter: (filter: RollFilter) => void
}



const Filter:React.FC<FilterProps> = props => {
    const { champs, persistFilter, initialFilter } = props
    const filterChangedRef = useRef(false)
    const wasAlreadyVisibleRef = useRef(false)
    const [filter, setFilter] = useState<RollFilter>(initialFilter)
    const [visible, setVisible] = useState(false)

    const handleVisibleChange = useCallback((visible) => {
        if(!visible && filterChangedRef.current) {
            persistFilter(filter)
        }
        setVisible(visible)
        if(visible) {
            wasAlreadyVisibleRef.current = true
        }
        filterChangedRef.current = false
    }, [filter])

    const handleChampClick = useCallback((champ: Champ) => {
        filterChangedRef.current = true

        setFilter(prev => {
            const next = {...prev}
            next.champs = prev.champs.filter(k => k.id !== champ.id)
            if(next.champs.length === prev.champs.length) {
                next.champs.push(champ)
            }
            return next
        })
    }, [])

    const handleTagClick = useCallback((tag: string) => {
        filterChangedRef.current = true

        setFilter(prev => {
            const next = {...prev}
            next.tags = prev.tags.filter(k => k !== tag)
            if(next.tags.length === prev.tags.length) {
                next.tags.push(tag)
            }
            return next
        })
    }, [])

    const tags = useMemo(() => {
        return champs.reduce<string[]>((acc, curr) => {
            curr.tags.forEach(tag => {
                if(!acc.some(t => t === tag)) {
                    acc.push(tag)
                }
            })
            return acc
        }, [])
    }, [champs.length])

    const resetFilter = () => {
        filterChangedRef.current = true
        setFilter({
            champs:[],
            tags: []
        })
    }


    return <Wrapper>
            <ModalButton 
                renderButton={<span>Filter</span>}
                onVisibleChange={handleVisibleChange}
                renderModal={<div className='filter-modal'>
                    <div className='headline-row'>
                        <h2>Filter</h2>
                        <ScoreHint>Filter a champ/tag will put the filtered champ at the end of the list.</ScoreHint>
                        {(filter.champs.length > 0 || filter.tags.length > 0) && <button className='reset-filter' onClick={resetFilter}>
                            Reset Filter
                        </button>}
                    </div>
                    <ul className='tag-list'>
                        {tags.map(tag => 
                            <li onClick={() => handleTagClick(tag)} className={classNames('tag', { disabled: filter.tags.some(k => k === tag) })}>{tag}</li>
                        )}
                    </ul>
                    {(visible || wasAlreadyVisibleRef.current) && <ul className='champ-list'>
                        {champs.map(champ => {
                            return <li 
                                onClick={() => handleChampClick(champ)} 
                                key={champ.id} 
                                className={classNames('champ', { disabled: filter.champs.some(k => k.id === champ.id) })}
                            >
                                <img alt={`champ-avatar for ${champ.name}`} src={`http://ddragon.leagueoflegends.com/cdn/${champ.version}/img/champion/${champ.id}.png`} />   
                            </li>
                        })}
                    </ul>}
                </div>}
            />
        </Wrapper>
}

export default Filter

/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback,  useEffect, useRef, useMemo } from "react"
import { Lane, Champ } from "../types"
import usePersistedState from "./usePersistedState"


const getRoleChamps = (allChamps: Champ[], lane: Lane) => {
    console.log(allChamps.filter(champ =>  champ.lanes.some(l => l.type === lane)))
    // get all champs with selected role within role array
    return allChamps.filter(champ =>  champ.lanes.some(l => l.type === lane)).map(c =>  {
        const laneInfo = c.lanes.find(l => l.type === lane)
        const resolvedProbability = c.probability ? c.probability  * 100 : laneInfo?.probability || 1

        return {
        ...c,
        // multiple probability with 10 to get more concrete numbers
        probability: resolvedProbability
    }}).filter(Boolean)
}

const getRandomChamp = (champs: RoleChamps, lane: Lane, alreadyRolledChamps: Champ[] = [], filter: RollFilter): Champ => {

    const getRandArr = (champs: RoleChamps) => {
        return champs.filter(champ => !alreadyRolledChamps.some(c => c.key === champ.key)).reduce<string[]>((acc, curr) => {
            const rounded = Math.round(curr.probability)
            for(let i = 0; i < rounded; i++) {
                acc.push(curr.id)
            }
            return acc
        }, [])
    }

    const { wantedChamps, unwantedChamps } = champs.reduce<{ wantedChamps: RoleChamps, unwantedChamps: RoleChamps }>((acc, curr) => {
        const shouldFilter = filter.champs.some(c => c.id === curr.id) || filter.tags.some(tag => curr.tags.some(t => t === tag))
        if(shouldFilter) {
            acc.unwantedChamps.push(curr)
        } else {
            acc.wantedChamps.push(curr)
        }
        return acc
    }, { wantedChamps: [], unwantedChamps: [] })

    const wantedChampsRandomArr = getRandArr(wantedChamps)
    const randomArr = wantedChampsRandomArr.length > 0 ? wantedChampsRandomArr :  getRandArr(unwantedChamps)

    const randomChampId = randomArr[Math.floor(Math.random() * randomArr.length)]

    return champs.find(c => c.id === randomChampId)!

}

export type RollState = Record<Lane, Champ>
export type RoleChamps = (Champ  & { probability: number})[]
type AlreadyRolledChampsState = Record<Lane, Champ[]>
export type RollFilter = {
    champs: Champ[],
    tags: string[]
}

const getInitialRoleState = (champs: Record<Lane, RoleChamps>, filter: RollFilter): RollState => {
    return Object.values(Lane).reduce<RollState>((acc, curr) => {
        acc[curr] = getRandomChamp(champs[curr], curr, [], filter)
        return acc
    }, {} as RollState)
}

const getInitialAlreadyRolledState = (roleState: RollState) => {
    return Object.keys(roleState).reduce<any>((acc, curr) => ({...acc, [curr]: [roleState[curr as keyof typeof roleState]]}), {})
}

const getInitialRoleChamps = (champs: Champ[]) => {
    return Object.values(Lane).reduce<Record<string, RoleChamps>>((acc, curr) => {
        acc[curr] = getRoleChamps(champs, curr)
        return acc
    }, {} as any)
}

const useRollState = (champs: Champ[]) => {
    const [roleChamps, setRoleChamps] = useState(() => getInitialRoleChamps(champs))
    const [filter, setFilter] = usePersistedState<RollFilter>('filter', { champs: [], tags: [] })
    const [rollState, setRollState] = useState<RollState>(() => getInitialRoleState(roleChamps, filter))
    const [alreadyRolledChamps, setAlreadyRolledChamps] = useState<AlreadyRolledChampsState>(getInitialAlreadyRolledState(rollState))
    const mounted = useRef(false)

    console.log(roleChamps, rollState)


    useEffect(() => {
        setRoleChamps(getInitialRoleChamps(champs))
    }, [])

    useEffect(() => {
        if(!mounted.current) {
            return
        }
    }, [champs])

    const handleResetAllLanes = useCallback(() => {
        const roleState = getInitialRoleState(roleChamps, filter)
        setRollState(roleState)
        setAlreadyRolledChamps(getInitialAlreadyRolledState(roleState))
    }, [roleChamps, filter])

    const handlePersistFilter = useCallback((filter: RollFilter) => {
        setFilter(filter)
    }, [])


    useEffect(() => {
        handleResetAllLanes()
    }, [handleResetAllLanes, roleChamps, filter])

    const handleRoll = useCallback((role: Lane) => {
        setAlreadyRolledChamps(prevAlreadyRolledChamps => {
            const nextChamp = getRandomChamp(roleChamps[role], role, prevAlreadyRolledChamps[role], filter)
            setRollState(prev => {
                const next = {...prev, [role]: nextChamp}
                return next
            })
            return {
                ...prevAlreadyRolledChamps, [role]: [...prevAlreadyRolledChamps[role], nextChamp]
            }
        })
      }, [roleChamps,filter])


    const handleResetLane = useCallback((role: Lane) => {
        setAlreadyRolledChamps(prev => ({...prev, [role]: []}))
        handleRoll(role)
    }, [handleRoll])

    useEffect(() => {
        mounted.current = true
    }, [])

    const resolvedRollState = useMemo(() => {
        console.log(champs)
        return Object.keys(rollState).reduce<RollState>((acc, curr) => {
            acc[curr as keyof RollState] = champs.find(c => c.id === rollState[curr as keyof RollState]?.id) || rollState[curr as keyof RollState]
            return acc
        }, {} as RollState)
    }, [champs, rollState])

    return {
        rollState: resolvedRollState,
        emptyLanes: Object.values(Lane).filter(lane => roleChamps[lane].length === alreadyRolledChamps[lane].length),
        alreadyRolledChampsState: alreadyRolledChamps,
        onRoll: handleRoll,
        onResetAllLanes: handleResetAllLanes,
        onResetLane: handleResetLane,
        filter,
        persistFilter: handlePersistFilter
    }
}

export default useRollState
import { useState, useCallback,  useEffect } from "react"
import { Lane, Champ } from "../types"


const getRoleChamps = (allChamps: Champ[], lane: Lane) => {
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

const getRandomChamp = (champs: RoleChamps, lane: Lane, alreadyRolledChamps: Champ[] = []): Champ => {
    const randomArr = champs.filter(champ => !alreadyRolledChamps.some(c => c.key === champ.key)).reduce<string[]>((acc, curr) => {
        const rounded = Math.round(curr.probability)
        for(let i = 0; i < rounded; i++) {
            acc.push(curr.id)
        }
        return acc
    }, [])

    const randomChampId = randomArr[Math.floor(Math.random() * randomArr.length)]

    return champs.find(c => c.id === randomChampId)!

}

export type RoleState = Record<Lane, Champ>
export type RoleChamps = ReturnType<typeof getRoleChamps>
type AlreadyRolledChampsState = Record<Lane, Champ[]>

const getInitialRoleState = (champs: Record<Lane, RoleChamps>): RoleState => {
    return Object.values(Lane).reduce<RoleState>((acc, curr) => {
        acc[curr] = getRandomChamp(champs[curr], curr)
        return acc
    }, {} as RoleState)
}

const getInitialAlreadyRolledState = (roleState: RoleState) => {
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
    const [rollState, setRoleState] = useState<RoleState>(() => getInitialRoleState(roleChamps))
    const [alreadyRolledChamps, setAlreadyRolledChamps] = useState<AlreadyRolledChampsState>(getInitialAlreadyRolledState(rollState))

    useEffect(() => {
        setRoleChamps(getInitialRoleChamps(champs))
    }, [champs])

    const handleResetAllLanes = useCallback(() => {
        const roleState = getInitialRoleState(roleChamps)
        setRoleState(roleState)
        setAlreadyRolledChamps(getInitialAlreadyRolledState(roleState))
    }, [roleChamps])


    useEffect(() => {
        handleResetAllLanes()
    }, [handleResetAllLanes, roleChamps])

    const handleRoll = useCallback((role: Lane) => {
        setAlreadyRolledChamps(prevAlreadyRolledChamps => {
            const nextChamp = getRandomChamp(roleChamps[role], role, prevAlreadyRolledChamps[role])
            setRoleState(prev => {
                const next = {...prev, [role]: nextChamp}
                return next
            })
            return {
                ...prevAlreadyRolledChamps, [role]: [...prevAlreadyRolledChamps[role], nextChamp]
            }
        })
      }, [roleChamps])


    const handleResetLane = useCallback((role: Lane) => {
        setAlreadyRolledChamps(prev => ({...prev, [role]: []}))
        handleRoll(role)
    }, [handleRoll])

    return {
        rollState,
        emptyLanes: Object.values(Lane).filter(lane => roleChamps[lane].length === alreadyRolledChamps[lane].length),
        alreadyRolledChampsState: alreadyRolledChamps,
        onRoll: handleRoll,
        onResetAllLanes: handleResetAllLanes,
        onResetLane: handleResetLane
    }
}

export default useRollState
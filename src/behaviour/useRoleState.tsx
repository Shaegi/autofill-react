import { useState, useCallback } from "react"
import { Lane, Champ } from "../types"


const getRandomChamp = (champs: Champ[], lane: Lane): Champ => {
    let maxProbability = 0
    // get all champs with selected role within role array
    const resolvedChamps = champs.filter(champ => champ.lanes.some(l => l.type === lane)).map(c =>  {
        const laneInfo = c.lanes.find(l => l.type === lane)
        const resolvedProbability = c.probability ? c.probability  * 100 : laneInfo && (laneInfo.probability) || 1
        // add up probability to get max 
        maxProbability += resolvedProbability
        return {
        ...c,
        // multiple probability with 10 to get more concrete numbers
        probability: resolvedProbability
    }}).filter(Boolean)

    const randomArr = resolvedChamps.reduce<string[]>((acc, curr) => {
        const rounded = Math.round(curr.probability)
        for(let i = 0; i < rounded; i++) {
            acc.push(curr.id)
        }
        return acc
    }, [])

    const randomChampId = randomArr[Math.floor(Math.random() * randomArr.length)]

    return resolvedChamps.find(c => c.id === randomChampId)!

}

export type RoleState = Record<Lane, Champ>

const getInitialState = (champs: Champ[]): RoleState => {
    return Object.values(Lane).reduce<RoleState>((acc, curr) => {
        acc[curr] = getRandomChamp(champs, curr)
        return acc
    }, {} as RoleState)
}

const useRollState = (champs: Champ[]) => {
    const [rollState, setRoleState] = useState<RoleState>(getInitialState(champs))

    const handleRoll = useCallback((role: Lane) => {
        setRoleState(prev => ({...prev, [role]: getRandomChamp(champs, role)}))
      }, [champs])

    const handleRollAllLanes = useCallback(() => {
        setRoleState(getInitialState(champs))
    }, [champs])

    return {
        rollState,
        onRoll: handleRoll,
        onRollAllLanes: handleRollAllLanes
    }
}

export default useRollState
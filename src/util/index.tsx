import { Lane, Role } from "../types"

export const laneToColorMap: Record<Lane, string> = {
    [Lane.BOT]: '#A30B37',
    [Lane.JUNGLE]: '#8FC0A9',
    [Lane.TOP]: '#690375',
    [Lane.MID]: '#0E0E52',
    [Lane.SUPPORT]: '#FCCA46'
}

export const roleToColorMap: Record<Role, string> = {
    [Role.MARKSMAN]: '#F17F29',
    [Role.TANK]: '#8FC0A9',
    [Role.FIGHTER]: '#690375',
    [Role.MAGE]: '#0E0E52 ',
    [Role.SUPPORT]: '#FCCA46',
    [Role.ASSASSIN]: '#A30B37'
}

export const getLaneName = (lane: Lane) => {
    let resolved = lane.replace('LANE_TYPE_', '')

    return resolved[0] + resolved.substr(1).toLowerCase()
}
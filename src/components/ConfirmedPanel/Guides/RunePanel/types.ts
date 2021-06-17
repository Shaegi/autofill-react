export type RuneTree = {
    id: number
    key: string
    icon: string
    name: string
    slots: {
        runes: Rune[]
    }[]
}

export type Rune = {
    id: number
    key: string
    icon: string
    name: string
    shortDesc: string
}

export type StructureType = RuneTree[]
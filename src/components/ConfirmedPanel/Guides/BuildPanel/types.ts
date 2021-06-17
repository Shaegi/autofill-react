export type Item = {
    name: string
    description: string
    plaintext: string,
    image: {
        full: string,
        sprite: string
        group: string
    }
}

export type ItemStructure = {
    type: string,
    version: string
    data: Record<string, Item>
}
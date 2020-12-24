
const sizes = {
    xxs: 4,
    xs: 8,
    s: 12,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 40,
    '3xl': 52
}

const generateSizes = () => {
return Object.keys(sizes).reduce<Record<string, any>>((acc, curr) => {
    if(!acc.raw) {
    acc.raw = {}
    }
    const value = sizes[curr as keyof typeof sizes]
    acc.raw[curr] = value
    acc[curr] = value + 'px'
    return acc
}, {})
}

const theme = {
color: {
    primary: "#c8aa6e",
    primaryLight: "#e3cea3",
    error: 'red'
},
size: generateSizes(),
hspace: generateSizes(),
vspace: generateSizes()
}

export default theme
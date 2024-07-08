import { ListTemplate } from '@editablejs/models'

const toABC = (num: number): string => {
    return num <= 26
        ? String.fromCharCode(num + 64).toLowerCase()
        : toABC(~~((num - 1) / 26)) + toABC(num % 26 || 26)
}

const toABCUp = (num: number): string => {
    return num <= 26
        ? String.fromCharCode(num + 64).toUpperCase()
        : toABC(~~((num - 1) / 26)) + toABC(num % 26 || 26)
}

const toRoman = (num: number) => {
    let map: Record<number, string> = {
        1: 'I',
        5: 'V',
        10: 'X',
        50: 'L',
        100: 'C',
        500: 'D',
        1000: 'M',
    }
    let digits = 1
    let result = ''
    while (num) {
        let current = num % 10
        if (current < 4) {
            result = map[digits].repeat(current) + result
        } else if (current === 4) {
            result = map[digits] + map[digits * 5] + result
        } else if (current > 4 && current < 9) {
            result = map[digits * 5] + map[digits].repeat(current - 5) + result
        } else {
            result = map[digits] + map[digits * 10] + result
        }
        digits *= 10
        num = Math.trunc(num / 10)
    }
    return result
}

const toRomanLow = (num: number) => {
    let map: Record<number, string> = {
        1: 'i',
        5: 'v',
        10: 'x',
        50: 'l',
        100: 'c',
        500: 'd',
        1000: 'm',
    }
    let digits = 1
    let result = ''
    while (num) {
        let current = num % 10
        if (current < 4) {
            result = map[digits].repeat(current) + result
        } else if (current === 4) {
            result = map[digits] + map[digits * 5] + result
        } else if (current > 4 && current < 9) {
            result = map[digits * 5] + map[digits].repeat(current - 5) + result
        } else {
            result = map[digits] + map[digits * 10] + result
        }
        digits *= 10
        num = Math.trunc(num / 10)
    }
    return result
}


const toGreece = (num: number): string => {
    const p = 'αβγδεζηθικλμνξοπρστυφχψω';
    return num <= p.length ? p[num - 1] : toGreece(~~((num - 1) / p.length)) + toGreece(num % p.length || p.length)
}
export const OrderedListTemplates: ListTemplate[] = [
    {
        key: 'default',
        depth: 6,
        render: ({ start, level }) => {
            const l = level % 6
            switch (l) {
                case 1:
                    return { type: 'a', text: `${toABC(start)}.` }
                case 2:
                    return { type: 'α', text: `${toGreece(start)}.` }
                case 3:
                    return { type: 'i', text: `${toRomanLow(start)}.` }
                case 4:
                    return { type: 'A', text: `${toABCUp(start)}.` }
                case 5:
                    return { type: 'I', text: `${toRoman(start)}.` }
                default:
                    return { type: '1', text: `${start}.` }
            }
        },
    },
]

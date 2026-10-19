import { describe, expect, it } from 'vitest'
import {
  add,
  compare,
  formatExact,
  fraction,
  mul,
  parseDecimal,
  toDecimalString,
  toExactString,
} from '../../../shared/domain/saw/fraction.js'

describe('fraction — aritmetika rasional eksak', () => {
  it('mengurai desimal number/string menjadi pecahan tersederhanakan', () => {
    expect(toExactString(parseDecimal(0.3))).toBe('3/10')
    expect(toExactString(parseDecimal('0.30'))).toBe('3/10')
    expect(toExactString(parseDecimal('1500000'))).toBe('1500000/1')
    expect(toExactString(parseDecimal('-2.5'))).toBe('-5/2')
    expect(toExactString(parseDecimal(1e-7))).toBe('1/10000000')
    expect(toExactString(parseDecimal('2.5e3'))).toBe('2500/1')
  })

  it('nilai kosong atau tidak valid menghasilkan null, tidak pernah nol', () => {
    for (const input of [null, undefined, '', '   ', 'abc', '1,5', Number.NaN, Infinity, -Infinity, {}, [], true]) {
      expect(parseDecimal(input)).toBeNull()
    }
  })

  it('0.1 + 0.2 tepat sama dengan 0.3 (tanpa galat floating-point)', () => {
    const sum = add(parseDecimal('0.1'), parseDecimal('0.2'))
    expect(compare(sum, parseDecimal('0.3'))).toBe(0)
    expect(0.1 + 0.2).not.toBe(0.3) // pembanding: double memang tidak eksak
  })

  it('pembulatan hanya untuk presentasi (half away from zero)', () => {
    expect(toDecimalString(fraction(193n, 300n), 4)).toBe('0.6433')
    expect(toDecimalString(fraction(2n, 3n), 4)).toBe('0.6667')
    expect(toDecimalString(fraction(1n, 8n), 2)).toBe('0.13')
    expect(toDecimalString(fraction(-1n, 8n), 2)).toBe('-0.13')
    expect(toDecimalString(fraction(-1n, 1000n), 2)).toBe('0.00')
    expect(toDecimalString(fraction(5n, 1n), 0)).toBe('5')
    expect(formatExact('193/300', 6)).toBe('0.643333')
    expect(formatExact('rusak', 2)).toBe('—')
  })

  it('perkalian dan penyederhanaan', () => {
    expect(toExactString(mul(parseDecimal('0.30'), fraction(2n, 3n)))).toBe('1/5')
  })

  it('penyebut nol ditolak', () => {
    expect(() => fraction(1n, 0n)).toThrow(RangeError)
  })
})

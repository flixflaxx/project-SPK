/**
 * Aritmetika rasional eksak berbasis BigInt untuk domain SAW.
 *
 * Alasan: PRD §6.3 mewajibkan presisi internal yang cukup dan larangan pembulatan
 * sebelum agregasi. Dengan pecahan eksak, normalisasi, kontribusi, dan nilai V tidak
 * mengalami galat floating-point, sehingga deteksi nilai seri (tie) dan tie-break
 * bersifat deterministik. Pembulatan hanya dilakukan oleh `toDecimalString` untuk presentasi.
 *
 * Modul ini murni: tanpa I/O, tanpa React/Express/Prisma.
 */

const DECIMAL_PATTERN = /^([+-])?(\d+)(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/

/**
 * @typedef {Object} Fraction
 * @property {bigint} n Pembilang (bertanda).
 * @property {bigint} d Penyebut (selalu > 0).
 */

/** @param {bigint} a @param {bigint} b @returns {bigint} */
function gcd(a, b) {
  let x = a < 0n ? -a : a
  let y = b < 0n ? -b : b
  while (y !== 0n) {
    const t = x % y
    x = y
    y = t
  }
  return x
}

/**
 * Membuat pecahan tersederhanakan.
 * @param {bigint} n
 * @param {bigint} d
 * @returns {Fraction}
 */
export function fraction(n, d = 1n) {
  if (d === 0n) throw new RangeError('Penyebut pecahan tidak boleh nol.')
  let num = n
  let den = d
  if (den < 0n) {
    num = -num
    den = -den
  }
  const g = gcd(num, den) || 1n
  return Object.freeze({ n: num / g, d: den / g })
}

export const ZERO = fraction(0n)
export const ONE = fraction(1n)

/**
 * Mengurai angka desimal (number atau string) menjadi pecahan eksak.
 * Mengembalikan `null` bila input bukan angka desimal hingga yang valid.
 * Nilai kosong (`null`, `undefined`, `''`) juga menghasilkan `null` — bukan nol.
 *
 * @param {unknown} value
 * @returns {Fraction | null}
 */
export function parseDecimal(value) {
  let text
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) return null
    text = String(value)
  } else if (typeof value === 'string') {
    text = value.trim()
    if (text === '') return null
  } else {
    return null
  }
  const match = DECIMAL_PATTERN.exec(text)
  if (!match) return null
  const [, sign, intPart, fracPart = '', expPart = '0'] = match
  const exp = Number.parseInt(expPart, 10)
  if (!Number.isSafeInteger(exp) || Math.abs(exp) > 400) return null
  let num = BigInt(intPart + fracPart)
  let den = 10n ** BigInt(fracPart.length)
  if (exp > 0) num *= 10n ** BigInt(exp)
  if (exp < 0) den *= 10n ** BigInt(-exp)
  if (sign === '-') num = -num
  return fraction(num, den)
}

/** @param {Fraction} a @param {Fraction} b */
export const add = (a, b) => fraction(a.n * b.d + b.n * a.d, a.d * b.d)
/** @param {Fraction} a @param {Fraction} b */
export const sub = (a, b) => fraction(a.n * b.d - b.n * a.d, a.d * b.d)
/** @param {Fraction} a @param {Fraction} b */
export const mul = (a, b) => fraction(a.n * b.n, a.d * b.d)
/** @param {Fraction} a @param {Fraction} b */
export function div(a, b) {
  if (b.n === 0n) throw new RangeError('Pembagian dengan nol.')
  return fraction(a.n * b.d, a.d * b.n)
}

/**
 * @param {Fraction} a
 * @param {Fraction} b
 * @returns {-1 | 0 | 1}
 */
export function compare(a, b) {
  const left = a.n * b.d
  const right = b.n * a.d
  if (left === right) return 0
  return left < right ? -1 : 1
}

/** @param {Fraction} a */
export const isPositive = (a) => a.n > 0n
/** @param {Fraction} a */
export const isNegative = (a) => a.n < 0n
/** @param {Fraction} a */
export const isZero = (a) => a.n === 0n
/** @param {Fraction} a */
export const abs = (a) => (a.n < 0n ? fraction(-a.n, a.d) : a)

/**
 * Representasi desimal untuk presentasi (round half away from zero).
 * @param {Fraction} a
 * @param {number} digits jumlah digit di belakang koma (0..30)
 * @returns {string}
 */
export function toDecimalString(a, digits = 6) {
  if (!Number.isInteger(digits) || digits < 0 || digits > 30) {
    throw new RangeError('digits harus bilangan bulat 0..30')
  }
  const negative = a.n < 0n
  const n = negative ? -a.n : a.n
  const scale = 10n ** BigInt(digits)
  let scaled = (n * scale) / a.d
  const remainder = (n * scale) % a.d
  if (remainder * 2n >= a.d) scaled += 1n
  const raw = scaled.toString().padStart(digits + 1, '0')
  const intPart = raw.slice(0, raw.length - digits)
  const fracPart = digits > 0 ? '.' + raw.slice(raw.length - digits) : ''
  const isZeroResult = scaled === 0n
  return (negative && !isZeroResult ? '-' : '') + intPart + fracPart
}

/**
 * Konversi ke number (double) untuk visualisasi. Jangan dipakai untuk perbandingan/ranking.
 * @param {Fraction} a
 */
export function toNumber(a) {
  return Number(toDecimalString(a, 17))
}

/** Serialisasi eksak "n/d" untuk snapshot/audit. @param {Fraction} a */
export function toExactString(a) {
  return `${a.n}/${a.d}`
}

/**
 * Mengurai string eksak "n/d" kembali menjadi pecahan. Mengembalikan null bila format salah.
 * @param {string} text
 * @returns {Fraction | null}
 */
export function parseExactString(text) {
  const match = /^(-?\d+)\/(\d+)$/.exec(String(text))
  if (!match || match[2] === '0' || /^0+$/.test(match[2])) return null
  return fraction(BigInt(match[1]), BigInt(match[2]))
}

/**
 * Membulatkan string eksak "n/d" untuk presentasi. Pembulatan HANYA dilakukan di sini.
 * @param {string} exact
 * @param {number} [digits]
 * @returns {string}
 */
export function formatExact(exact, digits = 4) {
  const parsed = parseExactString(exact)
  return parsed ? toDecimalString(parsed, digits) : '—'
}

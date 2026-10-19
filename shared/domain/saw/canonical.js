/**
 * Serialisasi JSON kanonik (kunci objek diurutkan) untuk snapshot run.
 * Hasil string identik untuk input yang setara, sehingga lapisan infrastruktur dapat
 * menghitung hash (mis. SHA-256) atas snapshot tanpa ambiguitas urutan kunci.
 * Hashing sengaja tidak dilakukan di sini agar domain tetap murni dan lintas-platform.
 *
 * @param {unknown} value
 * @returns {string}
 */
export function canonicalJson(value) {
  if (value === null || typeof value !== 'object') {
    if (typeof value === 'number' && !Number.isFinite(value)) {
      throw new TypeError('Snapshot tidak boleh berisi angka tak hingga/NaN.')
    }
    if (typeof value === 'bigint') return JSON.stringify(value.toString())
    if (value === undefined) return 'null'
    return JSON.stringify(value)
  }
  if (Array.isArray(value)) return `[${value.map((item) => canonicalJson(item)).join(',')}]`
  const keys = Object.keys(value)
    .filter((key) => /** @type {Record<string, unknown>} */ (value)[key] !== undefined)
    .sort()
  return `{${keys.map((key) => `${JSON.stringify(key)}:${canonicalJson(/** @type {Record<string, unknown>} */ (value)[key])}`).join(',')}}`
}

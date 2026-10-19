import { expect } from 'vitest'
import { SawValidationError } from '../../shared/domain/saw/errors.js'

/**
 * Menjalankan `fn`, memastikan melempar SawValidationError, dan mengembalikan issues-nya.
 * @param {() => unknown} fn
 * @returns {ReadonlyArray<import('../../shared/domain/saw/errors.js').SawIssue>}
 */
export function captureSawIssues(fn) {
  try {
    fn()
  } catch (error) {
    expect(error).toBeInstanceOf(SawValidationError)
    return /** @type {SawValidationError} */ (error).issues
  }
  throw new Error('Diharapkan SawValidationError, tetapi fungsi tidak melempar error.')
}

/**
 * @param {ReadonlyArray<{ code: string }>} issues
 * @returns {string[]}
 */
export const codesOf = (issues) => issues.map((issue) => issue.code)

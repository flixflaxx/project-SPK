/**
 * Domain SAW murni — tidak bergantung pada React, Express, Prisma, atau I/O apa pun.
 * Dipakai oleh frontend preview (simulasi lokal) dan kelak oleh service backend.
 */
export { ALGORITHM_VERSION, CRITERION_TYPES, TIE_BREAK_RULE, PRESENTATION_DIGITS } from './constants.js'
export { SAW_ERROR_CODES, SAW_ERROR_MESSAGES, SawValidationError, makeIssue } from './errors.js'
export { validateCriteriaVersion, assertValidCriteriaVersion } from './criteria.js'
export { selectEligibleCandidates, isMissingValue } from './eligibility.js'
export { calculateSaw } from './calculate.js'
export { buildCalculationRun } from './run.js'
export { canonicalJson } from './canonical.js'
export { formatExact, parseDecimal, toDecimalString, toExactString } from './fraction.js'

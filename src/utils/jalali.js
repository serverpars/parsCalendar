/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

const PERSIAN_UNICODE_EXTENSION = 'u-ca-persian'
const DEFAULT_PERSIAN_LOCALE = 'fa-IR'
const DEFAULT_PERSIAN_CALENDAR_LOCALE = `${DEFAULT_PERSIAN_LOCALE}-${PERSIAN_UNICODE_EXTENSION}`
const DEFAULT_PERSIAN_LATIN_CALENDAR_LOCALE = `${DEFAULT_PERSIAN_LOCALE}-${PERSIAN_UNICODE_EXTENSION}-nu-latn`

const JALALI_MONTH_OFFSETS = [
0,
31,
62,
93,
124,
155,
186,
216,
246,
276,
306,
336,
]

let cachedPersianLatnFormatter = null

/**
 * Normalizes locale identifiers for easier comparison.
 *
 * @param {string} locale
 * @return {string}
 */
function normalizeLocale(locale) {
        return locale
                .replace(/_/g, '-')
                .toLowerCase()
                .trim()
}

/**
 * Checks whether a locale should use the Jalali (Persian) calendar.
 *
 * @param {string | undefined | null} locale
 * @return {boolean}
 */
export function isPersianLocale(locale) {
        if (!locale) {
                return false
        }

        const normalized = normalizeLocale(String(locale))

        if (normalized === 'fa') {
                return true
        }

        if (normalized.startsWith('fa-')) {
                return true
        }

        return normalized.includes(PERSIAN_UNICODE_EXTENSION)
}

/**
 * Formats a date with the Persian (Jalali) calendar.
 *
 * @param {Date | string | number} value Date value to format
 * @param {object} [options]
 * @param {boolean} [options.includeTime=false] Whether the time portion should be included
 * @return {string}
 */
function ensureDate(value) {
        if (value instanceof Date) {
                return Number.isNaN(value.getTime()) ? null : value
        }

        const date = new Date(value)

        return Number.isNaN(date.getTime()) ? null : date
}

function formatWithIntl(value, options) {
        const date = ensureDate(value)

        if (!date) {
                return ''
        }

        try {
                return new Intl.DateTimeFormat(DEFAULT_PERSIAN_CALENDAR_LOCALE, options).format(date)
        } catch (error) {
                return date.toLocaleString(DEFAULT_PERSIAN_LOCALE, options)
        }
}

export function formatJalaliDate(value, { includeTime = false } = {}) {
        const baseOptions = {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
        }

        if (includeTime) {
                Object.assign(baseOptions, {
                        hour: '2-digit',
                        minute: '2-digit',
                        hourCycle: 'h23',
                })
        }

return formatWithIntl(value, baseOptions)
}

export function formatJalaliMonthYear(value) {
        return formatWithIntl(value, {
                year: 'numeric',
                month: 'long',
        })
}

export function formatJalaliYear(value) {
        return formatWithIntl(value, {
                year: 'numeric',
        })
}

export function formatJalaliDateNumeric(value) {
        return formatWithIntl(value, {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
        })
}

export function formatJalaliDateShort(value) {
        return formatWithIntl(value, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
        })
}

export function formatJalaliTime(value) {
        return formatWithIntl(value, {
                hour: '2-digit',
                minute: '2-digit',
                hourCycle: 'h23',
        })
}

export function formatJalaliWeekday(value, { width = 'long' } = {}) {
        const validWidths = new Set(['long', 'short', 'narrow'])
        const normalizedWidth = validWidths.has(width) ? width : 'long'

        return formatWithIntl(value, {
                weekday: normalizedWidth,
        })
}

function getPersianLatnFormatter() {
        if (cachedPersianLatnFormatter !== null) {
                return cachedPersianLatnFormatter
        }

        try {
                cachedPersianLatnFormatter = new Intl.DateTimeFormat(DEFAULT_PERSIAN_LATIN_CALENDAR_LOCALE, {
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                })
        } catch (error) {
                cachedPersianLatnFormatter = undefined
        }

        return cachedPersianLatnFormatter
}

function getJalaliParts(date) {
        const formatter = getPersianLatnFormatter()

        if (!formatter || typeof formatter.formatToParts !== 'function') {
                return null
        }

        const parts = formatter.formatToParts(date)

        const year = Number.parseInt(parts.find((part) => part.type === 'year')?.value ?? '', 10)
        const month = Number.parseInt(parts.find((part) => part.type === 'month')?.value ?? '', 10)
        const day = Number.parseInt(parts.find((part) => part.type === 'day')?.value ?? '', 10)

        if ([year, month, day].some(Number.isNaN)) {
                return null
        }

        return {
                year,
                month,
                day,
        }
}

function getJalaliDayOfYear(month, day) {
        if (month < 1 || month > 12) {
                return NaN
        }

        const offset = JALALI_MONTH_OFFSETS[month - 1]

        if (typeof offset !== 'number') {
                return NaN
        }

        return offset + day
}

export function getJalaliWeekInfo(value) {
        const date = ensureDate(value)

        if (!date) {
                return {
                        year: NaN,
                        week: NaN,
                }
        }

        const parts = getJalaliParts(date)

        if (!parts) {
                return {
                        year: NaN,
                        week: NaN,
                }
        }

        const dayOfYear = getJalaliDayOfYear(parts.month, parts.day)

        if (Number.isNaN(dayOfYear)) {
                return {
                        year: NaN,
                        week: NaN,
                }
        }

        const week = Math.max(1, Math.ceil(dayOfYear / 7))

        return {
                year: parts.year,
                week,
        }
}

export function formatJalaliNumber(value) {
        if (typeof value !== 'number' || Number.isNaN(value)) {
                return ''
        }

        try {
                return new Intl.NumberFormat(DEFAULT_PERSIAN_LOCALE).format(value)
        } catch (error) {
                return String(value)
        }
}

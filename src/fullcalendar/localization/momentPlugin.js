/**
 * SPDX-FileCopyrightText: 2020 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import moment from '@nextcloud/moment'
import { createPlugin } from '@fullcalendar/core'
import useSettingsStore from '../../store/settings.js'
import {
        formatJalaliDate,
        formatJalaliDateNumeric,
        formatJalaliDateShort,
        formatJalaliTime,
        formatJalaliWeekday,
        isPersianLocale,
} from '@/utils/jalali.js'

/**
 * Creates a new moment object using the locale from the global Pinia store
 *
 * @param {object[]} data FullCalendar object containing the date etc.
 * @param {number[]} data.array Input data to initialize moment
 * @return {moment.Moment}
 */
const momentFactory = ({ array }, locale) => {
        return moment(array).locale(locale)
}

function getDateFromArgPart(part) {
        if (!part) {
                return null
        }

        if (part.marker instanceof Date) {
                return new Date(part.marker.getTime())
        }

        if (part.date instanceof Date) {
                return new Date(part.date.getTime())
        }

        if (Array.isArray(part.array)) {
                const [
                        year,
                        month = 0,
                        day = 1,
                        hour = 0,
                        minute = 0,
                        second = 0,
                        millisecond = 0,
                ] = part.array

                const date = new Date(year, month, day, hour, minute, second, millisecond)

                if (Number.isNaN(date.getTime())) {
                        return null
                }

                return date
        }

        return null
}

function formatPersianToken(cmdStr, date) {
        switch (cmdStr) {
        case 'LT':
                return formatJalaliTime(date)
        case 'll':
                return formatJalaliDateShort(date)
        case 'l':
        case 'L':
                return formatJalaliDateNumeric(date)
        case 'LL':
                return formatJalaliDate(date)
        case 'ddd':
                return formatJalaliWeekday(date, { width: 'short' })
        case 'dddd':
                return formatJalaliWeekday(date, { width: 'long' })
        default:
                return null
        }
}

function formatPersianSingle(cmdStr, date) {
        if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
                return null
        }

        if (cmdStr === 'ddd l') {
                const weekday = formatJalaliWeekday(date, { width: 'short' })
                const numeric = formatJalaliDateNumeric(date)

                if (!weekday || !numeric) {
                        return null
                }

                return `${weekday} ${numeric}`
        }

        if (cmdStr === 'LL, dddd') {
                const longDate = formatJalaliDate(date)
                const weekday = formatJalaliWeekday(date, { width: 'long' })

                if (longDate && weekday) {
                        return `${longDate}، ${weekday}`
                }

                return longDate || weekday || null
        }

        return formatPersianToken(cmdStr, date)
}

function formatPersianRange(cmdStr, arg) {
        const startDate = getDateFromArgPart(arg.start)

        if (!startDate) {
                return null
        }

        const formattedStart = formatPersianSingle(cmdStr, startDate)

        if (formattedStart === null) {
                return null
        }

        if (!arg.end) {
                return formattedStart
        }

        const endDate = getDateFromArgPart(arg.end)

        if (!endDate) {
                return formattedStart
        }

        const formattedEnd = formatPersianSingle(cmdStr, endDate)

        if (formattedEnd === null) {
                return null
        }

        if (formattedStart === formattedEnd) {
                return formattedStart
        }

        const separator = typeof arg.defaultSeparator === 'string' ? arg.defaultSeparator : ' – '

        return `${formattedStart}${separator}${formattedEnd}`
}

/**
 * Formats a date with given cmdStr
 *
 * @param {string} cmdStr The formatting string
 * @param {object} arg An Object containing the date, etc.
 * @return {function(string, string):string} cmdFormatter function
 */
const cmdFormatter = (cmdStr, arg) => {
        // With our specific DateFormattingConfig,
        // cmdStr will always be a moment parsable string
        // like LT, etc.
        //
        // No need to manually parse it.
        //
        // This is not the case, if you use the standard FC
        // formatting config.

        const settingsStore = useSettingsStore()
        const locale = settingsStore.momentLocale

        if (isPersianLocale(locale)) {
                const persianFormatted = formatPersianRange(cmdStr, arg)

                if (typeof persianFormatted === 'string') {
                        return persianFormatted
                }
        }

        // If arg.end is defined, this is a time-range
        if (arg.end) {
                const start = momentFactory(arg.start, locale).format(cmdStr)
                const end = momentFactory(arg.end, locale).format(cmdStr)

                if (start === end) {
                        return start
                }

                return start + arg.defaultSeparator + end
        }

        return momentFactory(arg.start, locale).format(cmdStr)
}

export default createPlugin({
        name: '@nextcloud/moment-plugin',
        cmdFormatter,
})

export { cmdFormatter }

/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import moment from '@nextcloud/moment'
import { createPinia, setActivePinia } from 'pinia'

import { cmdFormatter } from '../../../../../src/fullcalendar/localization/momentPlugin.js'
import useSettingsStore from '../../../../../src/store/settings.js'

jest.mock('@fullcalendar/core', () => ({
        createPlugin: jest.fn(() => ({})),
}))

describe('fullcalendar/localization/momentPlugin', () => {
        beforeEach(() => {
                setActivePinia(createPinia())
        })

        const buildArgs = ({ startArray, endArray = undefined, separator = ' - ' }) => {
                const arg = {
                        start: { array: startArray },
                        defaultSeparator: separator,
                }

                if (endArray) {
                        arg.end = { array: endArray }
                }

                return arg
        }

        it('formats single Persian values with Jalali calendar tokens', () => {
                const settingsStore = useSettingsStore()
                settingsStore.momentLocale = 'fa-IR'

                const arg = buildArgs({ startArray: [2024, 0, 15, 10, 30] })

                expect(cmdFormatter('LT', arg)).toBe('۱۰:۳۰')
                expect(cmdFormatter('ll', arg)).toBe('۲۵ دی ۱۴۰۲')
                expect(cmdFormatter('ddd l', arg)).toBe('دوشنبه ۱۴۰۲/۱۰/۲۵')
                expect(cmdFormatter('LL, dddd', arg)).toBe('۲۵ دی ۱۴۰۲، دوشنبه')
        })

        it('formats Persian ranges with localized separators', () => {
                const settingsStore = useSettingsStore()
                settingsStore.momentLocale = 'fa'

                const arg = buildArgs({
                        startArray: [2024, 0, 15, 10, 30],
                        endArray: [2024, 0, 15, 12, 0],
                })

                expect(cmdFormatter('LT', arg)).toBe('۱۰:۳۰ - ۱۲:۰۰')
        })

        it('falls back to moment for non-Persian locales', () => {
                const settingsStore = useSettingsStore()
                settingsStore.momentLocale = 'en'

                const arg = buildArgs({ startArray: [2024, 0, 15, 10, 30] })
                const expected = moment([2024, 0, 15, 10, 30]).locale('en').format('LT')

                expect(cmdFormatter('LT', arg)).toBe(expected)
        })
})

/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import dateRangeFormat from "../../../../src/filters/dateRangeFormat.js";
import { translate } from '@nextcloud/l10n'

jest.mock('@nextcloud/l10n')

describe('format/dateRangeFormat test suite', () => {

        beforeEach(() => {
                translate.mockClear()

                translate
                        .mockImplementation((app, str, params = {}) => str
                                .replace('{number}', params.number ?? '{number}')
                                .replace('{year}', params.year ?? '{year}'))
        })

        it('should provide a format for day view', () => {
                const date = new Date(2019, 0, 1, 0, 0, 0, 0)
                expect(dateRangeFormat(date, 'timeGridDay', 'de')).toMatchSnapshot()
        })

        it('should provide a Jalali format for day view when locale is Persian', () => {
                const date = new Date(2019, 0, 1, 0, 0, 0, 0)
                expect(dateRangeFormat(date, 'timeGridDay', 'fa')).toMatchSnapshot()
        })

        it('should provide a format for week view', () => {

                const date = new Date(2019, 0, 1, 0, 0, 0, 0)
                expect(dateRangeFormat(date, 'timeGridWeek', 'de')).toMatchSnapshot()
        })

        it('should provide a Jalali format for week view when locale is Persian', () => {

                const date = new Date(2019, 0, 1, 0, 0, 0, 0)
                expect(dateRangeFormat(date, 'timeGridWeek', 'fa')).toMatchSnapshot()
        })

        it('should provide a format for month view', () => {
                const date = new Date(2019, 0, 1, 0, 0, 0, 0)
                expect(dateRangeFormat(date, 'dayGridMonth', 'de')).toMatchSnapshot()
        })

        it('should provide a Jalali format for month view when locale is Persian', () => {
                const date = new Date(2019, 0, 1, 0, 0, 0, 0)
                expect(dateRangeFormat(date, 'dayGridMonth', 'fa')).toMatchSnapshot()
        })

        it('should provide month as fallback for unknown view', () => {
                const date = new Date(2019, 0, 1, 0, 0, 0, 0)
                expect(dateRangeFormat(date, 'fooBarUnknownView', 'de')).toMatchSnapshot()
        })

        it('should provide Jalali month as fallback for unknown view when locale is Persian', () => {
                const date = new Date(2019, 0, 1, 0, 0, 0, 0)
                expect(dateRangeFormat(date, 'fooBarUnknownView', 'fa')).toMatchSnapshot()
        })

})

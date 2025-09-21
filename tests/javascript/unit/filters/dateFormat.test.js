/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import dateFormat from "../../../../src/filters/dateFormat.js";

describe('format/dateFormat test suite', () => {

        it('should format an all-day date', () => {
                const date = new Date(2019, 0, 1, 0, 0, 0, 0)
                expect(dateFormat(date, true, 'de')).toMatchSnapshot()
        })

        it('should format a timed date', () => {
                const date = new Date(2019, 0, 1, 0, 0, 0, 0)
                expect(dateFormat(date, false, 'de')).toMatchSnapshot()
        })

        it('should format an all-day date in Persian locale', () => {
                const date = new Date(2019, 2, 21, 0, 0, 0, 0)
                expect(dateFormat(date, true, 'fa')).toMatchSnapshot()
        })

        it('should format a timed date in Persian locale', () => {
                const date = new Date(2019, 2, 21, 18, 30, 0, 0)
                expect(dateFormat(date, false, 'fa')).toMatchSnapshot()
        })

})

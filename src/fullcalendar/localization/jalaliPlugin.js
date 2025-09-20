/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { createPlugin } from '@fullcalendar/core'
import moment from '@nextcloud/moment'

const jalaliPlugin = createPlugin({
	name: 'jalaali',
	calendarSystem: {
		parse(str) {
			const m = moment.jMoment(str, 'jYYYY/jM/jD')
			if (m.isValid()) {
				return m.toDate()
			}
			return null
		},
		format(date, formatStr) {
			return moment.jMoment(date).format(formatStr)
		},
		getMarkerYear(date) {
			return moment.jMoment(date).jYear()
		},
		getMarkerMonth(date) {
			return moment.jMoment(date).jMonth()
		},
		getMarkerDay(date) {
			return moment.jMoment(date).jDate()
		},
		getDaysInMonth(date) {
			return moment.jDaysInMonth(date.jYear(), date.jMonth())
		},
		getMonths(year) {
			return moment.jMonths()
		},
		add(date, val, unit) {
			return moment.jMoment(date).add(val, unit).toDate()
		},
		subtract(date, val, unit) {
			return moment.jMoment(date).subtract(val, unit).toDate()
		},
		getStartOfWeek(date) {
			return moment.jMoment(date).startOf('week').toDate()
		},
		getDayOfWeek(date) {
			return moment.jMoment(date).day()
		},
	},
})

export default jalaliPlugin

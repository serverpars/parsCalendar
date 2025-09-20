<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<PersianDatePicker
		:value="date"
		:min="minimumDate"
		:max="maximumDate"
		:type="type"
		:editable="true"
		:alt-field-class-name="['date-time-picker']"
		format="YYYY-MM-DD"
		display-format="jYYYY-jMM-jDD"
		alt-format="YYYY-MM-DD"
		placeholder="Select a date"
		@input="change"
	/>
</template>

<script>
import PersianDatePicker from 'vue-persian-datetime-picker'
import { mapStores } from 'pinia'

import useDavRestrictionsStore from '../../store/davRestrictions.js'
import debounce from 'debounce'

export default {
	name: 'DatePicker',
	components: {
		PersianDatePicker,
	},
	props: {
		date: {
			type: Date,
			required: true,
		},
		prefix: {
			type: String,
			default: null,
		},
		min: {
			type: Date,
			default: null,
		},
		max: {
			type: Date,
			default: null,
		},
		type: {
			type: String,
			default: 'date',
		},
	},
	computed: {
		...mapStores(useDavRestrictionsStore),
		/**
		 * The earliest date a user is allowed to pick in the timezone
		 *
		 * @return {Date}
		 */
		minimumDate() {
			return this.min || new Date(this.davRestrictionsStore.minimumDate)
		},
		/**
		 * The latest date a user is allowed to pick in the timezone
		 *
		 * @return {Date}
		 */
		maximumDate() {
			return this.max || new Date(this.davRestrictionsStore.maximumDate)
		},
	},
	methods: {
		/**
		 * Emits a change event for the Date
		 *
		 * @param {Date} date The new Date object
		 */
		change: debounce(function(date) {
			if (this.disabledDate(date)) {
				return
			}

			this.$emit('change', date)
		}, 200),
		/**
		 * Whether or not the date is acceptable
		 *
		 * @param {Date} date The date to compare to
		 * @return {boolean}
		 */
		disabledDate(date) {
			return date < this.minimumDate || date > this.maximumDate
		},
	},
}
</script>

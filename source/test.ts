import { deepEqual } from 'assert-helpers'
import kava from 'kava'
import { json } from './index.js'

kava.suite('@bevry/json', function (suite, test) {
	test('works as expected', function () {
		const expected = {
			a: 1,
			b: 'b',
			c: {
				ca: 1,
				cb: 'b',
			},
			d: [
				1,
				'b',
				{
					da: 1,
					db: 'b',
				},
			],
			e: new Set([1, 'b']),
			f: new Map<number, string>([[1, 'b']]),
		}
		const actual = json(expected)
		deepEqual(actual, expected, 'was as expected')
	})
})

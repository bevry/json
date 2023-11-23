// external
import { deepEqual } from 'assert-helpers'
import kava from 'kava'
import promiseErrback from 'promise-errback'

// builtin
import { tmpdir } from 'os'
import { join } from 'path'

// local
import { json, readJSON, writeJSON, deleteJSON } from './index.js'

kava.suite('@bevry/json', function (suite, test) {
	test('serializing works as expected', function () {
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
	test('fs works as expected', function (done) {
		promiseErrback(
			Promise.resolve().then(async function () {
				const tmp = join(tmpdir(), `bevry-json-${Math.random()}.txt`)
				await deleteJSON(tmp) // ensure it does not exist, should not fail if it does not exist
				const data = { a: 1 }
				await writeJSON(tmp, data)
				deepEqual(await readJSON(tmp), data, 'has the data we expected')
				await deleteJSON(tmp)
			}),
			done
		)
	})
})

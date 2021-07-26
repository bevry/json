// external
import { readFile, writeFile } from 'fs'

/** Help the JSON parser serialize the object to JSON string. */
function replacer(key: string, value: any) {
	if (value instanceof Set) {
		return {
			dataType: 'Set',
			value: Array.from(value.values()),
		}
	} else if (value instanceof Map) {
		return {
			dataType: 'Map',
			value: Array.from(value.entries()),
		}
	} else {
		return value
	}
}

/** Help the JSON parser deserialize the JSON string. */
function reviver(key: string, value: any) {
	if (typeof value === 'object' && value !== null) {
		if (value.dataType === 'Set') {
			return new Set(value.value)
		} else if (value.dataType === 'Map') {
			return new Map(value.value)
		}
	}
	return value
}

/** Clone/dereference a JSON object. */
export function json(data: any) {
	return fromJSON(toJSON(data))
}

/** Deserialize a JSON object. */
export function fromJSON(data: any) {
	return JSON.parse(data, reviver)
}

/** Serialize a JSON object. */
export function toJSON(data: any) {
	return JSON.stringify(data, replacer, '  ')
}

/** Write a JSON file that will be serialized with {@link toJSON}. */
export function writeJSON(path: string, data: any) {
	return new Promise(function (resolve, reject) {
		writeFile(path, toJSON(data), function (err) {
			if (err) return reject(err)
			resolve(null)
		})
	})
}

/** Read a JSON file that was serialized with {@link toJSON}. */
export async function readJSON(
	path: string,
	encoding: BufferEncoding = 'utf8'
) {
	return new Promise(function (resolve, reject) {
		readFile(path, encoding, function (err, data) {
			if (err) return reject(err)
			resolve(fromJSON(data))
		})
	})
}

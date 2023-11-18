// external
import Errlop from 'errlop'
import read from '@bevry/fs-read'
import write from '@bevry/fs-write'
import unlink from '@bevry/fs-unlink'

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
export function json<T>(data: T): T {
	return fromJSON(toJSON(data))
}

/** Deserialize a JSON object. */
export function fromJSON<T>(data: string): T {
	try {
		return JSON.parse(data, reviver)
	} catch (err: any) {
		throw new Errlop(`failed to deserialize the json `, err)
	}
}

/** Serialize a JSON object. */
export function toJSON<T>(data: T): string {
	try {
		return JSON.stringify(data, replacer, '  ')
	} catch (err: any) {
		throw new Errlop(`failed to serialize the json `, err)
	}
}

/** Write a JSON file that will be serialized with {@link toJSON}. */
export async function writeJSON<T>(path: string, data: T): Promise<void> {
	try {
		const contents = toJSON<T>(data)
		await write(path, contents)
	} catch (err: any) {
		throw new Errlop(`failed to write the json for the file: ${path}`, err)
	}
}

/** Read a JSON file that was serialized with {@link toJSON}. */
export async function readJSON<T>(path: string): Promise<T> {
	try {
		const data = await read(path)
		return fromJSON<T>(data)
	} catch (err: any) {
		throw new Errlop(`failed to read the json for the file: ${path}`, err)
	}
}

/** Delete a JSON file. */
export function deleteJSON(path: string): Promise<void> {
	return unlink(path)
}

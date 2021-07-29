// external
import { readFile, writeFile, deleteFile } from '@bevry/file'

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
	return JSON.parse(data, reviver)
}

/** Serialize a JSON object. */
export function toJSON<T>(data: T): string {
	return JSON.stringify(data, replacer, '  ')
}

/** Write a JSON file that will be serialized with {@link toJSON}. */
export async function writeJSON<T>(path: string, data: T): Promise<void> {
	const contents = toJSON<T>(data)
	await writeFile(path, contents)
}

/** Read a JSON file that was serialized with {@link toJSON}. */
export async function readJSON<T>(path: string): Promise<T> {
	const data = await readFile(path)
	return fromJSON<T>(data)
}

/** Delete a JSON file. */
export function deleteJSON(path: string): Promise<void> {
	return deleteFile(path)
}

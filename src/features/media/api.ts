import axios from '@/axios'

const FILENAME_REGEX = /([^/]+\.(jpg|jpeg|png|gif|bmp|webp))/

function getContentType(filename: string): string {
	const ext = filename.split('.').pop()?.toLowerCase()
	const types: Record<string, string> = {
		jpg: 'image/jpeg',
		jpeg: 'image/jpeg',
		png: 'image/png',
		gif: 'image/gif',
		webp: 'image/webp'
	}
	return types[ext ?? ''] ?? 'application/octet-stream'
}

function extractFilename(url: string): string {
	const match = FILENAME_REGEX.exec(url)
	return match?.[0] ?? ''
}

export const mediaApi = {
	getPresignedUrls: async (filenames: string[]) => {
		const { data } = await axios.post<{ urls: string[] }>(
			'/v1/media/presigned-url',
			{ filenames }
		)
		return data.urls
	},
	uploadToS3: async (presignedUrl: string, file: File) => {
		await axios.put(presignedUrl, file, {
			headers: {
				'Content-Type': getContentType(file.name),
				Accept: '*/*'
			}
		})
	},
	registerMedia: async (filename: string, url: string) => {
		const { data } = await axios.post<{ id: string }>('/v1/media', {
			filename,
			url,
			type: getContentType(filename)
		})
		return data.id
	},
	/** Full upload flow: get presigned URLs -> upload to S3 -> register media -> return media IDs */
	uploadFiles: async (files: File[]) => {
		const filenames = files.map((f) => f.name)
		const presignedUrls = await mediaApi.getPresignedUrls(filenames)

		// Upload all files to S3 in parallel
		await Promise.all(
			files.map((file, i) => mediaApi.uploadToS3(presignedUrls[i], file))
		)

		// Register all media in parallel
		const mediaIds = await Promise.all(
			files.map((file, i) =>
				mediaApi.registerMedia(
					file.name,
					extractFilename(presignedUrls[i])
				)
			)
		)

		return mediaIds
	}
}

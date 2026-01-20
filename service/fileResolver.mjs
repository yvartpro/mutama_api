import db from "../model/index.mjs"

const File = db.File

/**
 * Resolves file IDs into full File objects.
 * @param {number|number[]} ids - A single ID or an array of IDs.
 * @returns {Promise<object|object[]>} - Full File object(s).
 */
export const resolveFiles = async (ids) => {
  if (!ids) return null

  let parsedIds = ids
  if (typeof ids === 'string') {
    try {
      parsedIds = JSON.parse(ids)
    } catch (e) {
      // Not a JSON string, likely a single ID string
      parsedIds = ids
    }
  }

  if (Array.isArray(parsedIds)) {
    if (parsedIds.length === 0) return []

    // Extract actual IDs for querying
    const queryIds = parsedIds.map(id => (typeof id === 'object' && id !== null) ? id.id : id).filter(Boolean)

    const files = await File.findAll({
      where: { id: queryIds },
      attributes: ['id', 'url', 'type', 'description', 'optimized', 'alt']
    })

    // Return resolved files in the original order
    return parsedIds.map(id => {
      const targetId = (typeof id === 'object' && id !== null) ? id.id : id
      return files.find(f => f.id === targetId)
    }).filter(Boolean)
  }

  const singleId = (typeof parsedIds === 'object' && parsedIds !== null) ? parsedIds.id : parsedIds
  return await File.findByPk(singleId, {
    attributes: ['id', 'url', 'type', 'description', 'optimized', 'alt']
  })
}

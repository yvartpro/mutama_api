import db from "../model/index.mjs"

const File = db.File

/**
 * Resolves file IDs into full File objects.
 * @param {number|number[]} ids - A single ID or an array of IDs.
 * @returns {Promise<object|object[]>} - Full File object(s).
 */
export const resolveFiles = async (ids) => {
  if (!ids) return null

  if (Array.isArray(ids)) {
    const files = await File.findAll({
      where: { id: ids },
      attributes: ['id', 'url', 'type', 'description', 'optimized', 'alt']
    })
    // Sort files to match the order of IDs if needed
    return ids.map(id => files.find(f => f.id === id)).filter(Boolean)
  }

  return await File.findByPk(ids, {
    attributes: ['id', 'url', 'type', 'description', 'optimized', 'alt']
  })
}

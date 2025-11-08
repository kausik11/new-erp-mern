// src/utils/pagination.js

/**
 * Generic pagination helper for Mongoose models
 * @param {Model} model - Mongoose model
 * @param {Object} query - Filter query (e.g., { deletedAt: null })
 * @param {number} page - Page number (1-based)
 * @param {number} limit - Items per page
 * @param {string|Array} populate - Field(s) to populate
 * @returns {Promise<{ data: Array, meta: Object }>}
 */
export const paginate = async (model, query = {}, page = 1, limit = 10, populate = "") => {
  const skip = (page - 1) * limit;
  const total = await model.countDocuments(query);
  const data = await model
    .find(query)
    .skip(skip)
    .limit(limit)
    .populate(populate);

  return {
    data,
    meta: {
      page: +page,
      limit: +limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};
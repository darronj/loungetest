const { ViewQuery, bucket } = require('couchbase');

const applyQueryOptions = (query, options = null) => {
  if (options && options.limit) {
    query = query.limit(options.limit);
  }
  if (options && options.skip) {
    query = query.skip(options.skip);
  }
  if (options && options.range) {
    query = query.range(
      options.range.start,
      options.range.end,
      options.range.inclusive_end || true
    );
  }
  if (options && options.group_level) {
    query = query.group_level(options.group_level);
  }
  if (options && options.reduce) {
    query = query.reduce(options.reduce);
  }
  return query;
};

const getDocIds = (model, options) => {
  return new Promise((resolve, reject) => {
    const doc_type = model.modelName.toLowerCase();
    const range = {
      start: [doc_type, 'a'],
      end: [doc_type, 'zzzz'],
      inclusive_end: false
    };
    options = {
      ...options,
      range
    };
    // const range = null;
    let query = ViewQuery.from('doc_type', 'doc_type');
    query = applyQueryOptions(query, options);

    if (options && options.skip) {
      query = query.skip(options.skip);
    }
    if (options && options.limit) {
      query = query.limit(options.limit);
    }

    model.db.bucket.query(query, (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res.map(r => r.key[1]));
    });
  });
};

const getAllModeledDocs = async (model, populateOptions, options) => {
  return getDocIds(model, options).then(ids =>
    model.findById(ids, populateOptions)
  );
};

module.exports = {
  getDocIds,
  getAllModeledDocs
};

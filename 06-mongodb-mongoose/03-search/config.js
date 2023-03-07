module.exports = {
  mongodb: {
    uri: (process.env.NODE_ENV === 'test' ?
      'mongodb://localhost/6-module-3-task' :
      'mongodb://127.0.0.1/any-shop'),
  },
};

const defaultPattern = /web\/client\/utils\/__tests__\/.*-test\.jsx?$/;
const smokePattern = process.env.MAPSTORE_SMOKE_TEST_PATTERN
    ? new RegExp(process.env.MAPSTORE_SMOKE_TEST_PATTERN)
    : defaultPattern;

const context = require.context('../web', true, smokePattern);
context.keys().forEach(context);
module.exports = context;


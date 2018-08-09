const pluralize = require('pluralize');

const LABEL_ERROR = 'error';
const LABEL_WARNING = 'warning';

module.exports = {
    labels: {
        ERROR: LABEL_ERROR,
        WARNING: LABEL_WARNING,
        ERRORS: pluralize(LABEL_ERROR),
        WARNINGS: pluralize(LABEL_WARNING)
    }
};

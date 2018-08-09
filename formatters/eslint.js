const pluralize = require('pluralize');
const format = require('../helpers/format');
const { labels } = require('../helpers/constants');

module.exports = (files) => {
    const notifications = [];
    const messages = {
        files: {}
    };
    messages[labels.ERRORS] = 0;
    messages[labels.WARNINGS] = 0;

    files.forEach((file) => {
        messages.files[file.filePath] = {
            messages: []
        };
        messages.files[file.filePath][labels.ERRORS] = 0;
        messages.files[file.filePath][labels.WARNINGS] = 0;

        file.messages.forEach((message) => {
            const severity = message.severity === 1 ? labels.WARNING : labels.ERROR;

            // Add message
            messages.files[file.filePath].messages.push({
                line: message.line,
                column: message.column,
                severity: severity,
                rule: message.ruleId,
                description: message.message.replace(/\.$/, '')
            });

            // Update count
            messages.files[file.filePath][pluralize(severity)]++;
            messages[pluralize(severity)]++;
        });
    });

    return format(messages, notifications, 'eslint');
};

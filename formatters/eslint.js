var pluralize = require('pluralize');

var format = require('../helpers/format'),
    labels = require('../helpers/constants').labels;

module.exports = function(files) {
    var notifications = [];
    var messages = {
        files: {}
    };
    messages[labels.ERRORS] = 0;
    messages[labels.WARNINGS] = 0;

    files.forEach(function(file) {
        messages.files[file.filePath] = {
            messages: []
        };
        messages.files[file.filePath][labels.ERRORS] = 0;
        messages.files[file.filePath][labels.WARNINGS] = 0;

        file.messages.forEach(function(message) {
            var severity = message.severity === 1 ? labels.WARNING : labels.ERROR;

            // Add message
            messages.files[file.filePath].messages.push({
                line: message.line,
                column: message.column,
                severity: severity,
                rule: message.ruleId,
                description: message.message.replace(/\.$/, '') // Removes trailing dot
            });

            // Update count
            messages.files[file.filePath][pluralize(severity)]++;
            messages[pluralize(severity)]++;
        });
    });

    return format(messages, notifications, 'eslint');
};

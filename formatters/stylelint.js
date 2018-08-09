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
        if ( file.warnings.length ) {
            messages.files[file.source] = {
                messages: []
            };
            messages.files[file.source][labels.ERRORS] = 0;
            messages.files[file.source][labels.WARNINGS] = 0;

            file.warnings.forEach(function(message) {
                // Add message
                messages.files[file.source].messages.push({
                    line: message.line,
                    column: message.column,
                    severity: message.severity,
                    rule: message.rule,
                    description: message.text.replace('(' + message.rule + ')', '').trim() // Remove rule from description
                });

                // Update count
                messages.files[file.source][pluralize(message.severity)]++;
                messages[pluralize(message.severity)]++;
            });
        }

        if ( file.deprecations.length ) {
            notifications.push(...file.deprecations.map((deprecation) => {
                return `${deprecation.text} (${deprecation.reference})`;
            }));
        }

        if ( file.invalidOptionWarnings.length ) {
            notifications.push(...file.invalidOptionWarnings.map((invalidOptionWarning) => {
                return invalidOptionWarning.text;
            }));
        }
    });

    return format(messages, notifications.filter((item, pos, self) => self.indexOf(item) === pos), 'stylelint');
};

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
            notifications = notifications.concat(file.deprecations.map(function(deprecation) {
                return deprecation.text + ' (' + deprecation.reference + ')';
            }));
        }

        if ( file.invalidOptionWarnings.length ) {
            notifications = notifications.concat(file.invalidOptionWarnings.map(function(invalidOptionWarning) {
                return invalidOptionWarning.text;
            }));
        }
    });

    // Remove duplicates from notifications
    notifications = notifications.filter(function(item, pos, self) {
        return self.indexOf(item) == pos;
    });

    return format(messages, notifications, 'stylelint');
};

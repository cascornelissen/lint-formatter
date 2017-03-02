var pad = require('pad'),
    path = require('path'),
    chalk = require('chalk'),
    pluralize = require('pluralize');

var labels = require('./constants').labels;

module.exports = function(obj, notifications, linter) {
    if ( obj !== Object(obj) ) {
        return '';
    }

    // Result array that will be used to generate output
    var result = [chalk.reset(' ')];

    // Linter-specific pre-commands
    switch ( linter.toLowerCase() ) {
        case 'eslint':
            // Remove redudant '__TYPE__ in __PATH__' that's always added by ESLint and can't be disabled
            result.push('\033[2A\r\x1b[K\033[1A\r\x1b[K'); // Removes last 2 lines
            break;
    }

    // Determine width of each column
    // This allows us to align all columns in de output correctly to improve readability
    var columns = Object.keys(obj.files).reduce(function(seq, key) {
        var file = obj.files[key];

        file.messages.forEach(function(message) {
            var positionLength = (message.line + ':' + message.column).length;
            if ( positionLength > seq.position ) {
                seq.position = positionLength;
            }

            if ( message.column.toString().length > seq.column ) {
                seq.column = message.column.toString().length;
            }

            if ( message.description && message.description.length > seq.description ) {
                seq.description = message.description.length;
            }

            if ( message.rule && message.rule.length > seq.rule ) {
                seq.rule = message.rule.length;
            }
        });

        return seq;
    }, {
        position: 1,
        column: 0,
        severity: 1,
        description: 0,
        rule: 0
    });

    // Extra padding for certain columns to improve readability
    columns.position += 1;
    columns.description += 2;

    // process.stdout.columns is not always filled (i.e. when it's run without a console)
    var stdOutColumns = process.stdout.columns || 80;

    // Calculate max-width of a description (based on the width of the console, the width of other columns, and the gutter)
    var descriptionMaxLength = stdOutColumns - columns.position - columns.severity - columns.rule - (Object.keys(columns).length + 1);
    if ( !descriptionMaxLength || isNaN(descriptionMaxLength) ) {
        descriptionMaxLength = 80;
    }

    // Parse messages that were passed via `obj`
    Object.keys(obj.files).forEach(function(key) {
        var file = obj.files[key];

        // Show headers if there are errors and/or warnings
        if ( file[labels.ERRORS] ) {
            result.push(chalk.red(file[labels.ERRORS] + ' ' + pluralize(labels.ERROR, file[labels.ERRORS]).toUpperCase() + ' in ./' + path.relative(process.cwd(), key)));
        }
        if ( file[labels.WARNINGS] ) {
            result.push(chalk.yellow(file[labels.WARNINGS] + ' ' + pluralize(labels.WARNING, file[labels.WARNINGS]).toUpperCase() + ' in ./' + path.relative(process.cwd(), key)));
        }

        // Loop through all files and add the line(s) to the result array
        file.messages.forEach(function(message) {
            var severityLine = message.severity === labels.ERROR
                ? chalk.red(pad('!', columns.severity))
                : chalk.yellow(pad('?', columns.severity));

            // Multiline descriptions
            // Some descriptions are very long and result in the output looking messed up,
            // to fix this we split descriptions based on descriptionMaxLength
            var description = message.description.match(new RegExp('.{1,' + descriptionMaxLength + '}', 'g'));

            // Add the line to our resulting object
            // Each column gets padded to improve readability by aligning items
            result.push([
                chalk.gray(pad(columns.position, message.line + ':' + pad(message.column.toString(), columns.column))), // Line number + column
                severityLine, // Severity of the message
                (message.description ? chalk.reset(pad(description[0], Math.min(columns.description, descriptionMaxLength))) : ''), // First line of the description
                (message.rule ? chalk.gray(pad('(' + message.rule + ')', columns.rule)) : '') // Identifier of the rule
            ].join(' '));

            // Add lines for multiline descriptions
            for ( var i = 1; i < description.length; i++ ) {
                result.push(new Array(columns.position + columns.severity + 3).join(' ') + description[i]); // 3 stands for the third column
            }
        });

        // Add newline and reset styles
        result.push(chalk.reset(' '));
    });

    // Notifications
    // Optional array of extra messages (such as deprecation notices) can be passed to format() as the second parameter
    if ( notifications.length ) {
        result.push(chalk.gray(' NOTIFICATIONS - ' + linter.toUpperCase()));
        notifications.forEach(function(notification) {
            result.push(chalk.reset(' ' + notification));
        });
        result.push(chalk.reset(' '));
    }

    return result.join('\n');
}

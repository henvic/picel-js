'use strict';

var header,
    content;

header = '\nusage: gulp <command>\n\n' +
    'The most commonly used gh tasks are:';

content = {
    'lint': 'Lint code',
    'complexity': 'Show code complexity analysis summary',
    'unit': 'Run unit tests and create code coverage report in HTML',
    'test': 'Run all code quality tools',
    'coverage-report': 'Open code coverage report',
    'watch': 'Watch for any changes and run linting and tests'
};

function help() {
    var output = '',
        spacing = 0,
        methods;

    methods = Object.keys(content);

    methods.forEach(function(item) {
        if (spacing < item.length) {
            spacing = item.length + 1;
        }
    });

    methods.forEach(function(item) {
        output += '  ' + item +
            new Array(spacing - item.length + 2).join(' ') +
            content[item] + '\n';
    });

    console.log([header, output].join('\n'));
}

module.exports = help;

# Lint Formatter
Formatter for linter output with support for [multiple linters](#support). Format all your different linter outputs in the same consistent way to improve readability and findability.

## Installation
Install the module via [Yarn][yarn]/[NPM][npm]:

```bash
# Yarn
yarn add --dev lint-formatter

# NPM
npm install --save-dev lint-formatter
```

Supply the correct function to the linter, see the [support table](#support) for links to documentation for specific loaders and plugins.

## Support <a name="support"></a>
The following linters are supported. Feel free to submit a PR if you have fixes or want to add support for another linter.

Linter                 | Exported key | Documentation
:--------------------- | :----------- | :-------------------
[ESLint](eslint)       | `.eslint`	  | [`eslint-loader`][formatter-eslint-loader]
[Stylelint](stylelint) | `.stylelint` | [`stylelint-webpack-plugin`][formatter-stylelint-webpack-plugin], [`stylelint-bare-webpack-plugin`][formatter-stylelint-bare-webpack-plugin]


[yarn]: https://yarnpkg.com/
[npm]: http://npmjs.com/
[eslint]: http://eslint.org/
[stylelint]: https://stylelint.io/

[formatter-eslint-loader]: https://github.com/MoOx/eslint-loader#formatter-default-eslint-stylish-formatter
[formatter-stylelint-webpack-plugin]: https://github.com/JaKXz/stylelint-webpack-plugin#options
[formatter-stylelint-bare-webpack-plugin]: https://github.com/freshheads/stylelint-bare-webpack-plugin#options

const postcss = require('postcss')

module.exports = postcss.plugin('postcss-unit', (opts) => {
    opts = opts || {};
    const defaultOpts = {
        unitToConvert: 'px',
        targetUnit: 'rpx',
        convertFunction: num => num,
        unitPrecision: 3,
        minValue: 0,
        mediaQuery: false
    };

    if (Array.isArray(opts)) {
        opts.forEach((opt, index) => {
            opts[index] = Object.assign({}, defaultOpts, opt);
        });
    } else {
        opts = [Object.assign({}, defaultOpts, opts)];
    }

    opts.forEach(opt => {
        opt.__regexp__ = new RegExp(`(\\d*\\.?\\d+)${opt.unitToConvert}` , 'ig');
    });

    const replace = (value, opt) => {
        return value.replace(opt.__regexp__, (match, num) => {
            if (!num || num <= opt.minValue) return match;

            let targetNum = opt.convertFunction(+num);
            if (~targetNum.toString().indexOf('.')) {
                targetNum = targetNum.toFixed(opt.unitPrecision);
            }

            return targetNum + opt.targetUnit;
        });
    };

    return (root, result) => {
        root.walkDecls(decl => {
            opts.forEach((opt) => {
                if (!~decl.value.indexOf(opt.unitToConvert)) return;
                decl.value = replace(decl.value, opt);
            });
        });

        if (opts.mediaQuery) {
            root.walkAtRules(rule => {
                opts.forEach((opt) => {
                    if (!~rule.params.indexOf(opt.unitToConvert)) return;
                    rule.params = replace(rule.params, opt);
                });
            });
        }
    }
})

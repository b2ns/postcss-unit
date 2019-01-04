const postcss = require('postcss')

module.exports = postcss.plugin('postcss-unit', opts => {
    opts = opts || {};
    const defaultOpts = {
        from: 'px',
        to: 'rpx',
        convert: num => num,
        precision: 3,
        minValue: 0,
        mediaQuery: false
    };

    if (!Array.isArray(opts)) {
        opts = [opts];
    }
    opts.forEach((opt, index) => {
        opts[index] = Object.assign({}, defaultOpts, opt);
        opts[index].__regexp__ = new RegExp(`(\\d*\\.?\\d+)${opts[index].from}` , 'ig');
    });

    const replace = (value, opt) => {
        return value.replace(opt.__regexp__, (match, num) => {
            if (!num || num <= opt.minValue) return match;

            let targetNum = opt.convert(+num);
            // if is decimal, apply precision
            if (~targetNum.toString().indexOf('.') && opt.precision >= 0) {
                targetNum = targetNum.toFixed(opt.precision);
            }

            return targetNum + opt.to;
        });
    };

    return (root, result) => {
        opts.forEach(opt => {
            root.walkDecls(decl => {
                if (!~decl.value.indexOf(opt.from)) return;
                decl.value = replace(decl.value, opt);
            });

            if (opt.mediaQuery) {
                root.walkAtRules(rule => {
                    if (!~rule.params.indexOf(opt.from)) return;
                    rule.params = replace(rule.params, opt);
                });
            }
        });
    }
})

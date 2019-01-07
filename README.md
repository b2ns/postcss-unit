# postcss-unit

Unlike other postcss plugins only dealing with specific unit (px2rem, px2vw, px2rpx, ...), this one convert **any unit** in css as long as you provide *the convert funtcion* !!!

## Install

```shell
$ npm install postcss-unit --save-dev
```

## Usage

Like all other postcss plugins, you may use it with Webpack, Gulp, Grunt or other workflow, please refer [this](https://github.com/postcss/postcss)

## Example

### Default options

```javascript
// with default options
{
    from: 'px',
    to: 'rpx',
    convert: num => num, // function to convert the matched number
    precision: 3, // negative (-1) to leave the number as it is
    minValue: 0, // number not less than this will be converted
    mediaQuery: false,  // enable conversion in @media query
    propWhiteList: [], // string or regexp
    selectorBlackList: [] // string or regexp
}

```

```css
/* input */
.border-bottom {
    padding: 0 20px;
    border-bottom: 1px solid;
}

/* output */
.border-bottom {
    padding: 0 20rpx;
    border-bottom: 1rpx solid;
}
```

### Multi options


```javascript
// give an array of optins to do multi convert at the same time
[{
    from: 'px',
    to: 'vw',
    convert: num => num / 7.5,
    precision: 5,
    minValue: 1,
    mediaQuery: true,
    selectorBlackList: ['.ignore']
}, {
    from: 'em',
    to: 'rem',
    precision: -1,
    propWhiteList: [/font-.*/gi],
}, {
    from: 'cm',
    to: 'mm',
    convert: num => num * 10
}]
```

```css
/* input */
@media screen and (max-width: 768px) {
    h1 {
        height: 10em;
        margin: 20cm 100mm;
        padding: 5px 1px;
        font-size: 1.5em;
        line-height: 1.25;
    }
    body .ignore h2 {
        padding: 5px 1px;
    }
}

/* output */
@media screen and (max-width: 102.40000vw) {
    h1 {
        height: 10em;
        margin: 200mm 100mm;
        padding: 0.66667vw 1px;
        font-size: 1.5rem;
        line-height: 1.25;
    }
    body .ignore h2 {
        padding: 5px 1px;
    }
}

```

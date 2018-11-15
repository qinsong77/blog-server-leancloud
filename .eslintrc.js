module.exports = {
    "extends": ["eslint:recommended", "airbnb-base/legacy"],
    "rules": {
        // enable additional rules
        "indent": ["error", 4],
        "linebreak-style": ["error", "unix"],
        "quotes": ["error", "double"],
        // 关闭语句强制分号结尾
        "semi": [0],
        // override default options for rules from base configurations
        "comma-dangle": ["error", "only-multiline"],
        "no-cond-assign": ["error", "always"],

        // disable rules from base configurations
        "no-console": "off",
        "no-unused-vars": [2, {
            // 允许声明未使用变量
            "vars": "local",
            // 参数不检查
            "args": "none"
        }],
    },
    "parserOptions": {
        "ecmaVersion": 2017
    },

    "env": {
        "es6": true
    }
}

module.exports = {
    roots: ['./dist'],
    transform: {
        "^.+\\.jsx?$": "babel-jest",
        '^.+\\.tsx?$': 'ts-jest'
    },
    transformIgnorePatterns: ['<rootDir>/node_modules/'],
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.js?$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    moduleNameMapper: {
        "\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/fileMock.js",
        '@dc-extension-rich-text/(.+)$': '<rootDir>/../$1/src',
    },
    globals: {
        'ts-jest': {
        }
    }
};

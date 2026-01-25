export default {
    globals: {
        UrlFetchApp: {},
        console: {},
        PropertiesService: {},
        OAuth2: {},
        CacheService: {},
        ContentService: {},
        ScriptApp: {},
        LockService: {},
        Utilities: {},
    },
    moduleDirectories: [
        'node_modules',
    ],
    moduleFileExtensions: [
        'js',
        'json',
        'ts',
        'tsx',
    ],
    preset: 'ts-jest',
    testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
    testEnvironment: 'node',
    transform: {
        '^.+\\.tsx?$': ['ts-jest', { diagnostics: false }],
    },
};
module.exports = {
    roots: ["<rootDir>/src"],
    transform: {
        "^.+\\.tsx?$": "ts-jest",
    },
    testRegex: ["./_tests/.*(?<!\\.helper|\\.setup)\\.tsx?"], // Any ts or tsx file in a _tests folder that doesn't end with .helper.ts
    verbose: true,
    globals: {
        "ts-jest": {
            tsConfig: "tsconfig.json",
            diagnostics: false,
        },
    },
    coverageReporters: ["json", "html-spa", "text"],
    coveragePathIgnorePatterns: [".helper."],
    coverageDirectory: ".coverage",
    automock: false,
    moduleFileExtensions: ["ts", "tsx", "js"],
    transformIgnorePatterns: [],
    testEnvironment: "node",
};

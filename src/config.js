/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';

const path = require('path');
const jestPreset = require('@lwc/jest-preset');
const { PROJECT_ROOT, getModulePaths } = require('./utils/project.js');

function getCoveragePaths() {
    const modulePaths = getModulePaths();
    return modulePaths
        .map((p) => {
            // convert back to forward slashes here on Windows for Jest to be happy
            const prefix = p.replace(/\\/g, '/');
            return [
                // Note no `*.js` here - Jest will not find `.js` files unless you use a bare `*`
                prefix + '/**/*',
                // Specifically exclude HTML/CSS files since Jest doesn't understand the syntax
                '!' + prefix + '/**/*.html',
                '!' + prefix + '/**/*.css',
            ];
        })
        .flat();
}

const jestConfig = {
    rootDir: PROJECT_ROOT,
    moduleFileExtensions: ['js', 'html'],
    testEnvironment: jestPreset.testEnvironment || 'jsdom',
    transform: {
        '^.+\\.(js|html|css)$': require.resolve('@lwc/jest-transformer'),
    },
    transformIgnorePatterns: [
        '/node_modules/(?!(.*@salesforce/sfdx-lwc-jest/src/lightning-stubs)/)',
    ],
    setupFilesAfterEnv: jestPreset.setupFilesAfterEnv || [],
    resolver: path.resolve(__dirname, './resolver.js'),
    testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/test/specs/'],
    collectCoverageFrom: getCoveragePaths(),
    snapshotSerializers: [require.resolve('@lwc/jest-serializer')],
};

const expectedApiVersion = '59.0';

module.exports = { jestConfig, expectedApiVersion };

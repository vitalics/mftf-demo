import { PerformanceObserver } from 'perf_hooks';
import { browser, Config } from 'protractor';

import { environment } from './environment';

export const obs = new PerformanceObserver((list) => {
    list.getEntries().forEach((entrie) => {
        const casted: any = entrie;
        console.dir(`${casted[0].__proto__.constructor.name}.${entrie.name} ${entrie.duration} ms`);
    });
});

const { mobileConfig } = environment;
export let config: Config = {
    baseUrl: 'https://epam.com',

    capabilities: {
        browserName: 'chrome',
        chromeOptions: {
            args: ['--disable-popup-blocking', '--disable-translate'],
            // mobileEmulation: {
            //     deviceName: 'Pixel 2',
            // },
        },
        // deviceName: mobileConfig.DEVICE_NAME,
        deviceName: 'emulator-5554',
        // platformVersion: mobileConfig.PLATFORM_VERSION,
        shardTestFiles: true,
    },
    // These are various cucumber compiler options
    cucumberOpts: {
        compiler: 'ts:ts-node/register',
        format: ['pretty', 'json:reports/report.json'],
        require: ['../../src/stepdefinitions/*.ts'],
        // tags help us execute specific scenarios of feature files
        tags: '',
    },
    directConnect: true,
    
    framework: 'custom',
    frameworkPath: require.resolve('protractor-cucumber-framework'),
    // This utility function helps prepare our scripts with required actions like browser maximize
    onPrepare: () => {
        obs.observe({ entryTypes: ['function'] });

        browser.waitForAngularEnabled(false);
        browser.ignoreSynchronization = true;
        browser.driver.manage().window().setSize(1024, 768);
    },
    // tslint:disable-next-line:object-literal-sort-keys
    onComplete: () => {
        obs.disconnect();
        browser.quit();
    },

    specs: [
        '../../src/features/*.feature',
    ],

    plugins: [
    ],

    // tslint:disable-next-line:object-literal-sort-keys
    webDriverLogDir: './logs',
    getPageTimeout: 2000000,
};

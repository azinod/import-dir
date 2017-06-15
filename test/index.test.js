const importDir = require('../index');
const expect = require('expect');
const importedDirObj = importDir();

describe('The importDir function', () => {
    it('should import all files from the CURRENT directory RECURSIVELY, including MODULE FOLDERS, using CAMELCASE names', () => {
        const importedDirObj = importDir();

        try {
            expect(importedDirObj.module1String).toBe('I am module1-string.js');
            expect(importedDirObj.module2Number).toBe(2);
            expect(importedDirObj.module3Object.module).toBe(3);
            expect(importedDirObj.module4Function()).toBe(4);
            expect(importedDirObj.module5Folder).toBe(5);
            expect(importedDirObj.subfolderWithJavascriptFiles.recursiveModule1String).toBe('I am recursive-module1-string.js')
            expect(importedDirObj.subfolderWithJavascriptFiles.recursiveModule2Number).toBe(2);
            expect(importedDirObj.subfolderWithJavascriptFiles.recursiveModule3Object.module).toBe(3);
            expect(importedDirObj.subfolderWithJavascriptFiles.recursiveModule4Function()).toBe(4);
            expect(importedDirObj.subfolderWithJavascriptFiles.recursiveModule5Folder).toBe(5);
        } catch (e) {
            console.log('\n Object being imported:\n');
            console.log(importedDirObj);
            throw (e);
        };
    });

    it('should import all files from the TARGET directory RECURSIVELY, including MODULE FOLDERS, using CAMELCASE names', () => {
        const importedDirObj = importDir({dir: './subfolder-with-javascript-files'});

        try {
            expect(importedDirObj.recursiveModule1String).toBe('I am recursive-module1-string.js')
            expect(importedDirObj.recursiveModule2Number).toBe(2);
            expect(importedDirObj.recursiveModule3Object.module).toBe(3);
            expect(importedDirObj.recursiveModule4Function()).toBe(4);
            expect(importedDirObj.recursiveModule5Folder).toBe(5);
        } catch (e) {
            console.log('\n Object being imported:\n');
            console.log(importedDirObj);
            throw (e);
        };
    });

    it('should import all files from the CURRENT directory RECURSIVELY, EXCEPT MODULE FOLDERS, using CAMELCASE names', () => {
        const importedDirObj = importDir({moduleFolders: false});

        try {
            expect(importedDirObj.module1String).toBe('I am module1-string.js');
            expect(importedDirObj.module2Number).toBe(2);
            expect(importedDirObj.module3Object.module).toBe(3);
            expect(importedDirObj.module4Function()).toBe(4);
            expect(importedDirObj.subfolderWithJavascriptFiles.recursiveModule1String).toBe('I am recursive-module1-string.js')
            expect(importedDirObj.subfolderWithJavascriptFiles.recursiveModule2Number).toBe(2);
            expect(importedDirObj.subfolderWithJavascriptFiles.recursiveModule3Object.module).toBe(3);
            expect(importedDirObj.subfolderWithJavascriptFiles.recursiveModule4Function()).toBe(4);
        } catch (e) {
            console.log('\n Object being imported:\n');
            console.log(importedDirObj);
            throw (e);
        };
    });

    it('should import all files from the CURRENT directory NON-RECURSIVELY, including MODULE FOLDERS, using CAMELCASE names', () => {
        const importedDirObj = importDir({recursive: false});

        try {
            expect(importedDirObj.module1String).toBe('I am module1-string.js');
            expect(importedDirObj.module2Number).toBe(2);
            expect(importedDirObj.module3Object.module).toBe(3);
            expect(importedDirObj.module4Function()).toBe(4);
            expect(importedDirObj.module5Folder).toBe(5);
        } catch (e) {
            console.log('\n Object being imported:\n');
            console.log(importedDirObj);
            throw (e);
        };
    });

    it('should import all files from the CURRENT directory RECURSIVELY, including MODULE FOLDERS, WITHOUT CAMELCASE names', () => {
        const importedDirObj = importDir({camelcase: false});

        try {
            expect(importedDirObj['module1-string']).toBe('I am module1-string.js');
            expect(importedDirObj['module2-number']).toBe(2);
            expect(importedDirObj['module3-object'].module).toBe(3);
            expect(importedDirObj['module4-function']()).toBe(4);
            expect(importedDirObj['module5-folder']).toBe(5);
            expect(importedDirObj['subfolder-with-javascript-files']['recursive-module1-string']).toBe('I am recursive-module1-string.js');
            expect(importedDirObj['subfolder-with-javascript-files']['recursive-module2-number']).toBe(2);
            expect(importedDirObj['subfolder-with-javascript-files']['recursive-module3-object'].module).toBe(3);
            expect(importedDirObj['subfolder-with-javascript-files']['recursive-module4-function']()).toBe(4);
            expect(importedDirObj['subfolder-with-javascript-files']['recursive-module5-folder']).toBe(5);
        } catch (e) {
            console.log('\n Object being imported:\n');
            console.log(importedDirObj);
            throw (e);
        };
    });

    it('should import all files from the CURRENT directory that DO NOT MATCH the IGNORE regexp pattern RECURSIVELY, including MODULE FOLDERS, WITHOUT CAMELCASE names', () => {
        const importedDirObj = importDir({camelcase: false, ignore: /object|module5/});

        try {
            expect(importedDirObj['module1-string']).toBe('I am module1-string.js');
            expect(importedDirObj['module2-number']).toBe(2);
            //expect(importedDirObj['module3-object'].module).toBe(3);
            expect(importedDirObj['module4-function']()).toBe(4);
            //expect(importedDirObj['module5-folder']).toBe(5);
            expect(importedDirObj['subfolder-with-javascript-files']['recursive-module1-string']).toBe('I am recursive-module1-string.js');
            expect(importedDirObj['subfolder-with-javascript-files']['recursive-module2-number']).toBe(2);
            //expect(importedDirObj['subfolder-with-javascript-files']['recursive-module3-object'].module).toBe(3);
            expect(importedDirObj['subfolder-with-javascript-files']['recursive-module4-function']()).toBe(4);
            //expect(importedDirObj['subfolder-with-javascript-files']['recursive-module5-folder']).toBe(5);
        } catch (e) {
            console.log('\n Object being imported:\n');
            console.log(importedDirObj);
            throw (e);
        };
    });
});

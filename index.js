const fs = require('fs');
const path = require('path');
const camelcaseKeys = require('camelcase-keys');
const isEmptyObject = require('is-empty-object');
const acceptedExtensions = require('./accepted-extensions.json').map(item => '.' + item);

//get path for the file that is calling the function
let currentFileAbsolute = module.parent.filename;

//since node caches modules when they are required,
//we need to delete cache for this module to be reused
delete require.cache[__filename];

/**
 * This module will import all importable files from a target directory and
 * pack them into a single Object. The filenames will be used as property names
 * and their values will be the actual module that is exported from the file.
 *
 * If the file is a .js file, but does not have an export statement, then
 * it will be ignored and skipped.
 *
 * By default, it will also look for index.js on subfolders of the imported
 * directory and assign that as modules in a similar fashion, using the folder
 * name as property name and the exported module from index.js as value. If the
 * folder does not contain an index.js, it will run recursively by default.
 *
 * @author Bruno Donizetti (azinod@gmail.com)
 *
 * @param {any} OBJECT
 * @desc
 *  dir STRING = directory to be imported
 *  recursive BOOLEAN = whether it should run recursively on the target dir
 *
 * @returns OBJECT
 *
 */

const importDir = ({
    dir,
    ignore,
    moduleFolders = true,
    recursive = true,
    camelcase = true
} = {}) => {

    const currentDir = path.dirname(module.parent.filename);
    const normalizedDir = dir ? path.resolve(currentDir, dir) : currentDir;
    const folderContents = fs.readdirSync(normalizedDir);

    //process the array of contents on the dir
    const importedDirObj = folderContents.reduce((result, item) => {

        const itemPath = path.join(normalizedDir, item);
        //if current item is the caller file, then ignore it
        //or if matches the pattern to be ignored, then ignore it also
        //or if moduleFolder is disabled, and file is an index.js
        if (currentFileAbsolute === itemPath || (ignore && ignore.test(item)) || (!moduleFolders && item === 'index.js')) {
            return result;
        }

        const itemIsDirectory = fs.statSync(itemPath).isDirectory();

        //if item is a folder/directory, we try the stuff below...
        if (itemIsDirectory) {
            try {
                //if the item is a directory and we have moduleFolders enabled,
                //then we try to import the index.js from it, else we throw an error
                if (moduleFolders) {
                    const importedModule = require(path.resolve(itemPath, 'index.js'));
                    if (!isEmptyObject(importedModule)) {
                        result[item] = importedModule;
                    }

                } else {
                    throw ('Module folder check is disabled.');
                }
            }

            //if it the folder is not a module, or moduleFolder is disabled,
            //then we check if recursive is enabled, and if so we run the
            //import function recursively on the folder being checked
            catch (e) {
                if (recursive) {
                    const importedModule = importDir({
                        dir: itemPath,
                        ignore,
                        moduleFolders,
                        recursive,
                        camelcase
                    });

                    if (!isEmptyObject(importedModule)) {
                        result[item] = importedModule;
                    }
                }
            };
        }

        //if it is a file and not a directory, we check if file extension is part of the accepted extensions
        else if (acceptedExtensions.includes(path.extname(item))) {
            try {
                //require the file and check if we got anything, else throw an error
                const importedModule = require(itemPath);
                if (isEmptyObject(importedModule)) {
                    throw 'ignored';
                }

                //if we are here, then we have a valid module.
                //in this case, we add it to the resulting object,
                //with the property name being the filename
                const propName = path.basename(item, path.extname(item));
                result[propName] = importedModule;
            } catch (e) {
                //Silently catch any errors here
                if (e !== 'ignored') {
                    console.error(e);
                }
            };
        }

        return result;
    }, {});

    return camelcase ? camelcaseKeys(importedDirObj, {
        deep: true
    }) : importedDirObj;
};

module.exports = importDir;

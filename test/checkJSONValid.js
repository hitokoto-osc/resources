// This is a Node.js script to check whether the json files of JSON dir are valid

// import modules
const fs = require('fs')
const path = require('path')

const rootDir = path.join(__dirname, '../')

console.log('Check whether JSON files in JSON dir are valid.')

// Step 1: generate files map...
function readDir (path) {
    const files = fs.readdirSync(path.join(rootDir, './json'))
    if (files.length <= 0) return
    const map = []
    for (const file of path) {
        const filePath = path.join(path, './', file)
        const stat = fs.statSync(filePath)
        if (stat.isDirectory()) {
            const subDirFiles = readDir(filePath)
            if (subDirFiles.length > 0) {
                map.concat(subDirFiles)
            }
        } else {
            map.push(filePath)
        }
    }
    return map
}
const JSONFiles = readDir(path.join(rootDir, './json'))
if (JSONFiles.length <= 0) {
    console.log('Not found json files, test skipped')
    process.exit(0)
}

// Step 2: valid JSON file
const errors = []
try {
    for (const file of JSONFiles) {
        console.log('test: ' + file)
        if (file.substr(-5, 5) !== '.json') {
            console.log('The file is not a json file, skipped')
            continue
        }
        // DO Test
        try {
            JSON.parse(fs.readFileSync(file, {
                encoding: 'utf8'
            }))    
        } catch (e) {
            errors.push(['test: ' + file + ' failed', e])   
        }
    }
} catch (e) {
    errors.push(['unknown failure', e])
}

if (errors.length > 0) {
    console.error('test failed, found ' + errors.length + ' errors, show the below:')
    errors.forEach(e => {
        console.error(e[0])
        console.error(e[1])
    })
} else {
    console.log('test successfully.')
}

const css = require('css')
const fs = require('fs')

const findElements = /<(\w+?)[ />\n]/g
const findClasses = /className=["'](.+?)["']/g
const findIds = /id=["'](.+?)['"]/g

const readFile = (fileName) => {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, 'utf8', (err, data) => {
      err ? reject(err) : resolve({ data: data, fileName: fileName })
    })
  })
}

let classMapping = {}
let usedClasses = []

// converts number from base 10 to base valid.length (26)
// using the valid characters instead of integers as the string

let baseGenInt = 0
const genName = () => {
  // valid css names must satisfy this /-?[_a-zA-Z]+[_a-zA-Z0-9-]*/ regex
  // and are case-insensitive. Using just the lowercase alphabet will work fine
  // but we could add complicated logic to also use [0-9A-Z_-]
  const valid ='abcdefghijklmnopqrstuvwxyz'
  const len = valid.length
  let genInt = baseGenInt++

  let name = ""
  do {
    let index = genInt % len
    genInt = Math.floor(genInt / len)
    name += valid[index]
  } while (genInt)

  return name
}

const getClasses = (re, line, nameFunc, type) => {
  let newLine = line
  let match = re.exec(line)
  while (match) {
    let element = match[1]
    element = element.split(' ')
    let replacement = ''

    for (let i = 0; i < element.length; ++i) {
      let splitElement = element[i]
      // make note of any used classes
      if(!classMapping[splitElement]) {
        classMapping[splitElement] = {
          name: nameFunc(splitElement),
          type: type,
        }
      }
      if (replacement.length > 0) {
        replacement += ' '
      }
      replacement += classMapping[splitElement].name
    }
    // replace the classes in the line with new names
    if (type !== 'element') {
      let start = match.index
      let end = match[0].length + start

      replacement = `${type}=\"${replacement}\"`
      newLine = newLine.replace(line.substring(start, end), replacement)
    }
    match = re.exec(line)
  }
  return newLine
}

const parseReact = (fileData) => {
  console.log("Parsing '" + fileData.fileName + "'")
  let lines = fileData.data.split('\n')
  for (let i = 0; i < lines.length; ++i) {
    let line = lines[i]

    getClasses(findElements, line, (x) => x, 'element')
    line = getClasses(findClasses, line, genName, 'className')
    line = getClasses(findIds, line, genName, 'id')
    lines[i] = line
  }
  return { data: lines, fileName: fileData.fileName }
}

const writeReact = (fileData) => {
  return new Promise((resolve, reject) => {
    let fileName = fileData.fileName
    console.log("Re-writing js file: '" + fileName + "'")
    let file = fileData.data.join('\n')
    fs.writeFile(fileName, file, (err, data) => {
      err ? reject(err) : resolve(data)
    })
  })
}

let tree = {
  type: "stylesheet",
  stylesheet: {
    rules: []
  }
}

const recurseCss = (data, node) => {
  let type = data.type
  if (!type) {
    return
  }

  switch (type) {
    case "stylesheet":
      for (let i = 0; i < data.stylesheet.rules.length; ++i) {
        recurseCss(data.stylesheet.rules[i], tree.stylesheet.rules)
      }
      break
    case "rule":
      let added = false
      let useSelectors = []

      // for all selectors
      for (let i = 0; i < data.selectors.length; ++i) {
        let selector = data.selectors[i]

        // split selector
        let splitSelector = selector.split(/[ \.#]/)
        for (let k = 0; k < splitSelector.length; ++k) {
          added = false
          let current = splitSelector[k].split(':')[0]

          if(!current || current === '>') continue

          // for all known classes
          for (let j = 0; j < usedClasses.length; ++j) {
            let usedClass = usedClasses[j]

            if (usedClass === current ||
              current === 'body' ||
              current === '*') {
              added = true
              break
            }
          }
          // make sure every element in the selector is used, otherwise skip it
          if (!added) {
            break
          }
        }

        if (added) {
          let replacedSelector = selector
          for (let i = 0; i < usedClasses.length; ++i) {
            let usedClass = usedClasses[i]

            let re = new RegExp(`\\b${usedClass}\\b`)
            replacedSelector = replacedSelector.replace(re, classMapping[usedClass].name)
          }
          console.log("replacing", selector, "with", replacedSelector)
          useSelectors.push(replacedSelector)
        }
      }
      // only copy the selectors we actually reference
      if(useSelectors.length > 0) {
        data.selectors = useSelectors
        node.push(data)
      }
      break
    case "media":
      let media = {
        type: type,
        media: data.media,
        rules: []
      }
      for (let i = 0; i < data.rules.length; ++i) {
        recurseCss(data.rules[i], media.rules)
      }
      node.push(media)
      break
    case "font-face":
      node.push(data)
      break
    default:
      // console.log(type)
  }
}

const parseCss = (fileData) => {
  console.log("Parsing '" + fileData.fileName + "'")
  let parsed = css.parse(fileData.data)
  recurseCss(parsed, tree)
}


let reactFiles = []
let cssFiles = []

const readDir = (dirname) => {
  console.log(dirname)
  let files = fs.readdirSync(dirname)

  for (let i = 0; i < files.length; ++i) {
    let file = dirname + '/' + files[i]
    if (file.includes('node_modules')
      || file.includes('dist')
      || file.includes('webpack')
    ) {
      continue
    } else if (file.endsWith('.js')) {
      reactFiles.push(file)
    } else if (file.endsWith('.css')) {
      cssFiles.push(file)
    } else if (!file.includes('.')) {
      readDir(file)
    }
  }
}

readDir("toBuild")

let reactPromises = []
for (let i = 0; i < reactFiles.length; ++i) {
  let fileName = reactFiles[i]
  reactPromises.push(
    readFile(fileName)
      .then((data) => parseReact(data))
      .then((data) => writeReact(data))
  )
}

let cssPromises = []
for (let i = 0; i < cssFiles.length; ++i) {
  cssPromises.push(
    readFile(cssFiles[i])
  )
}

Promise.all(reactPromises)
.then(() => {
  for (let key in classMapping) {
    if (classMapping.hasOwnProperty(key)) {
      usedClasses.push(key)
    }
  }
})
.then(() => Promise.all(cssPromises)
  .then((files) => {
    for (let i = 0; i < files.length; ++i) {
      parseCss(files[i])
    }
  })
)
.then(() => {
  return new Promise((resolve, reject) => {
    console.log("Wrote mangled css to 'style.css'")
    fs.writeFile('toBuild/style.css', css.stringify(tree), (err, data) => {
      err ? reject(err) : resolve(data)
    })
  })
})
.then(() => {
  return new Promise((resolve, reject) => {
    console.log("CSS mapping written to 'classMapping.json'")
    fs.writeFile('classMapping.json', JSON.stringify(classMapping, null, '  '), (err, data) => {
      err ? reject(err) : resolve(data)
    })
  })
})

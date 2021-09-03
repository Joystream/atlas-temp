// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

module.exports = {
  template: componentTemplate,
  indexTemplate: indexTemplate,
  typescript: true,
  svgo: true,
  prettier: true,
  svgoConfig: {
    plugins: [{ removeViewBox: false }],
  },
}

const comment = '// THIS FILE WAS AUTOGENERATED BY SVGR. DO NOT MODIFY IT MANUALLY'

function componentTemplate({ template }, opts, { imports, componentName, jsx }) {
  const plugins = ['jsx']
  if (opts.typescript) {
    plugins.push('typescript')
  }

  const typeScriptTpl = template.smart({ plugins, preserveComments: true })
  return typeScriptTpl.ast`
    ${comment}
    ${imports}
    
    export const ${componentName} = (props: React.SVGProps<SVGSVGElement>) => ${jsx}
  `
}

function indexTemplate(filePaths) {
  const exportEntries = filePaths.map((filePath) => {
    const basename = path.basename(filePath, path.extname(filePath))
    return `export * from './${basename}'`
  })
  return comment + exportEntries.join('\n') + '\n'
}

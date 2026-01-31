/**
 * Code Editor Module
 * Extensible syntax highlighting and code execution for onURL.space
 */

// Shared token patterns for C-like languages
const cLikePatterns = [
  { type: 'comment', re: /\/\/[^\n]*/y },
  { type: 'comment', re: /\/\*[\s\S]*?\*\//y },
  { type: 'string', re: /"(?:[^"\\]|\\.)*"/y },
  { type: 'string', re: /'(?:[^'\\]|\\.)*'/y },
  { type: 'string', re: /\`(?:[^\`\\]|\\.)*\`/y },
  { type: 'regex', re: /\/(?![*/])(?:[^\\/\n]|\\.)+\/[gimsuy]*/y },
  { type: 'number', re: /\b(?:0x[\da-fA-F]+|0b[01]+|0o[0-7]+|\d+\.?\d*(?:e[+-]?\d+)?)\b/y },
  { type: 'operator', re: /[+\-*/%=<>!&|^~?:]+|\.{3}/y },
  { type: 'word', re: /[a-zA-Z_$][\w$]*/y },
  { type: 'punctuation', re: /[{}()\[\];,.]/y },
  { type: 'whitespace', re: /\s+/y },
]

// Base JS keywords and builtins (shared between JS and TS)
const jsKeywords = [
  'async', 'await', 'break', 'case', 'catch', 'class', 'const', 'continue',
  'debugger', 'default', 'delete', 'do', 'else', 'export', 'extends', 'finally',
  'for', 'function', 'if', 'import', 'in', 'instanceof', 'let', 'new', 'of',
  'return', 'static', 'super', 'switch', 'this', 'throw', 'try', 'typeof',
  'var', 'void', 'while', 'with', 'yield', 'true', 'false', 'null', 'undefined'
]

const jsBuiltins = [
  'console', 'window', 'document', 'Array', 'Object', 'String', 'Number',
  'Boolean', 'Function', 'Symbol', 'Map', 'Set', 'WeakMap', 'WeakSet',
  'Promise', 'Proxy', 'Reflect', 'JSON', 'Math', 'Date', 'RegExp', 'Error',
  'TypeError', 'SyntaxError', 'ReferenceError', 'parseInt', 'parseFloat',
  'isNaN', 'isFinite', 'encodeURI', 'decodeURI', 'setTimeout', 'setInterval',
  'clearTimeout', 'clearInterval', 'fetch', 'URL', 'URLSearchParams',
  'TextEncoder', 'TextDecoder', 'Blob', 'File', 'FileReader', 'FormData',
  'XMLHttpRequest', 'WebSocket', 'localStorage', 'sessionStorage',
  'Uint8Array', 'Int8Array', 'Uint16Array', 'Int16Array', 'Uint32Array',
  'Int32Array', 'Float32Array', 'Float64Array', 'ArrayBuffer', 'DataView'
]

// Language configurations
const languages = {
  javascript: {
    name: 'JavaScript',
    aliases: ['js', 'javascript'],
    runnable: true,
    keywords: new Set(jsKeywords),
    builtins: new Set(jsBuiltins),
    tokenPatterns: cLikePatterns
  },
  typescript: {
    name: 'TypeScript',
    aliases: ['ts', 'typescript'],
    runnable: true,
    keywords: new Set([
      ...jsKeywords,
      'type', 'interface', 'enum', 'namespace', 'module', 'declare', 'abstract',
      'implements', 'private', 'protected', 'public', 'readonly', 'as', 'is',
      'keyof', 'infer', 'never', 'unknown', 'any'
    ]),
    builtins: new Set([
      ...jsBuiltins,
      'Partial', 'Required', 'Readonly', 'Record', 'Pick', 'Omit', 'Exclude',
      'Extract', 'NonNullable', 'Parameters', 'ReturnType', 'InstanceType'
    ]),
    tokenPatterns: [
      ...cLikePatterns.slice(0, -2),
      { type: 'punctuation', re: /[{}()\[\];,.<>]/y },
      { type: 'whitespace', re: /\s+/y },
    ]
  },
  python: {
    name: 'Python',
    aliases: ['py', 'python', 'python3'],
    runnable: false,
    keywords: new Set([
      'False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await',
      'break', 'class', 'continue', 'def', 'del', 'elif', 'else', 'except',
      'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is',
      'lambda', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return', 'try',
      'while', 'with', 'yield'
    ]),
    builtins: new Set([
      'abs', 'all', 'any', 'bin', 'bool', 'bytes', 'callable', 'chr',
      'classmethod', 'compile', 'complex', 'dict', 'dir', 'divmod',
      'enumerate', 'eval', 'exec', 'filter', 'float', 'format', 'frozenset',
      'getattr', 'globals', 'hasattr', 'hash', 'help', 'hex', 'id', 'input',
      'int', 'isinstance', 'issubclass', 'iter', 'len', 'list', 'locals',
      'map', 'max', 'min', 'next', 'object', 'oct', 'open', 'ord', 'pow',
      'print', 'property', 'range', 'repr', 'reversed', 'round', 'set',
      'setattr', 'slice', 'sorted', 'staticmethod', 'str', 'sum', 'super',
      'tuple', 'type', 'vars', 'zip', 'self'
    ]),
    tokenPatterns: [
      { type: 'comment', re: /#[^\n]*/y },
      { type: 'string', re: /"""[\s\S]*?"""/y },
      { type: 'string', re: /'''[\s\S]*?'''/y },
      { type: 'string', re: /f?"(?:[^"\\]|\\.)*"/y },
      { type: 'string', re: /f?'(?:[^'\\]|\\.)*'/y },
      { type: 'number', re: /\b(?:0x[\da-fA-F]+|0b[01]+|0o[0-7]+|\d+\.?\d*(?:e[+-]?\d+)?j?)\b/y },
      { type: 'operator', re: /[+\-*/%=<>!&|^~@:]+/y },
      { type: 'word', re: /[a-zA-Z_]\w*/y },
      { type: 'punctuation', re: /[{}()\[\];,.]/y },
      { type: 'whitespace', re: /\s+/y },
    ]
  },
  html: {
    name: 'HTML',
    aliases: ['html', 'htm'],
    runnable: false,
    tokenPatterns: [
      { type: 'comment', re: /<!--[\s\S]*?-->/y },
      { type: 'tag', re: /<\/?[a-zA-Z][a-zA-Z0-9-]*(?:\s+[^>]*)?\/?>/y },
      { type: 'string', re: /"[^"]*"|'[^']*'/y },
      { type: 'whitespace', re: /\s+/y },
    ]
  },
  css: {
    name: 'CSS',
    aliases: ['css'],
    runnable: false,
    keywords: new Set(['important', 'inherit', 'initial', 'unset', 'revert']),
    tokenPatterns: [
      { type: 'comment', re: /\/\*[\s\S]*?\*\//y },
      { type: 'string', re: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/y },
      { type: 'number', re: /\b\d+\.?\d*(?:px|em|rem|%|vh|vw|deg|s|ms)?\b/y },
      { type: 'selector', re: /[.#]?[a-zA-Z_-][a-zA-Z0-9_-]*/y },
      { type: 'operator', re: /[:;{}(),>+~*]/y },
      { type: 'whitespace', re: /\s+/y },
    ]
  },
  json: {
    name: 'JSON',
    aliases: ['json'],
    runnable: false,
    keywords: new Set(['true', 'false', 'null']),
    tokenPatterns: [
      { type: 'string', re: /"(?:[^"\\]|\\.)*"/y },
      { type: 'number', re: /-?\b\d+\.?\d*(?:e[+-]?\d+)?\b/y },
      { type: 'keyword', re: /\b(?:true|false|null)\b/y },
      { type: 'punctuation', re: /[{}\[\]:,]/y },
      { type: 'whitespace', re: /\s+/y },
    ]
  },
  markdown: {
    name: 'Markdown',
    aliases: ['md', 'markdown'],
    runnable: false,
    tokenPatterns: [
      { type: 'heading', re: /^#{1,6}\s+.+$/my },
      { type: 'code', re: /\`[^\`\n]+\`/y },
      { type: 'bold', re: /\*\*[^*]+\*\*/y },
      { type: 'italic', re: /\*[^*]+\*/y },
      { type: 'link', re: /\[[^\]]+\]\([^)]+\)/y },
      { type: 'whitespace', re: /\s+/y },
    ]
  },
  shell: {
    name: 'Shell',
    aliases: ['sh', 'bash', 'zsh', 'shell'],
    runnable: false,
    keywords: new Set([
      'if', 'then', 'else', 'elif', 'fi', 'case', 'esac', 'for', 'while',
      'do', 'done', 'in', 'function', 'return', 'exit', 'export', 'local',
      'readonly', 'shift', 'until', 'select'
    ]),
    builtins: new Set([
      'echo', 'cd', 'pwd', 'ls', 'cat', 'grep', 'sed', 'awk', 'find',
      'mkdir', 'rm', 'cp', 'mv', 'chmod', 'chown', 'curl', 'wget',
      'source', 'alias', 'unalias', 'set', 'unset', 'test'
    ]),
    tokenPatterns: [
      { type: 'comment', re: /#[^\n]*/y },
      { type: 'string', re: /"(?:[^"\\]|\\.)*"|'[^']*'/y },
      { type: 'variable', re: /\$(?:[a-zA-Z_][a-zA-Z0-9_]*|\{[^}]+\})/y },
      { type: 'number', re: /\b\d+\b/y },
      { type: 'word', re: /[a-zA-Z_][a-zA-Z0-9_-]*/y },
      { type: 'operator', re: /[|&;<>()]/y },
      { type: 'whitespace', re: /\s+/y },
    ]
  },
  sql: {
    name: 'SQL',
    aliases: ['sql'],
    runnable: false,
    keywords: new Set([
      'select', 'from', 'where', 'and', 'or', 'not', 'in', 'like', 'between',
      'is', 'null', 'as', 'join', 'inner', 'left', 'right', 'outer', 'on',
      'group', 'by', 'having', 'order', 'asc', 'desc', 'limit', 'offset',
      'insert', 'into', 'values', 'update', 'set', 'delete', 'create',
      'table', 'drop', 'alter', 'add', 'column', 'index', 'primary', 'key',
      'foreign', 'references', 'unique', 'default', 'constraint', 'distinct',
      'union', 'all', 'case', 'when', 'then', 'else', 'end', 'exists', 'true', 'false'
    ]),
    builtins: new Set([
      'count', 'sum', 'avg', 'min', 'max', 'coalesce', 'nullif', 'cast',
      'convert', 'concat', 'substring', 'length', 'upper', 'lower', 'trim',
      'now', 'date', 'time', 'timestamp', 'int', 'varchar', 'text', 'boolean'
    ]),
    tokenPatterns: [
      { type: 'comment', re: /--[^\n]*/y },
      { type: 'comment', re: /\/\*[\s\S]*?\*\//y },
      { type: 'string', re: /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"/y },
      { type: 'number', re: /\b\d+\.?\d*\b/y },
      { type: 'word', re: /[a-zA-Z_][a-zA-Z0-9_]*/y },
      { type: 'operator', re: /[=<>!+\-*/%]/y },
      { type: 'punctuation', re: /[();,.*]/y },
      { type: 'whitespace', re: /\s+/y },
    ]
  }
}

// Build alias lookup map for O(1) language resolution
const aliasMap = new Map()
for (const [key, config] of Object.entries(languages)) {
  for (const alias of config.aliases) {
    aliasMap.set(alias, config)
  }
}

// Token type to CSS class mapping
const tokenClassMap = {
  comment: 'ce-comment',
  string: 'ce-string',
  number: 'ce-number',
  regex: 'ce-regex',
  operator: 'ce-operator',
  keyword: 'ce-keyword',
  tag: 'ce-tag',
  selector: 'ce-selector',
  heading: 'ce-heading',
  code: 'ce-code',
  bold: 'ce-bold',
  italic: 'ce-italic',
  link: 'ce-link',
  variable: 'ce-variable',
}

// Reusable SVG icons
const icons = {
  copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
  copied: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>',
  run: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
}

// Get language config by alias - O(1) lookup
function getLanguageConfig(alias) {
  return alias ? aliasMap.get(alias.toLowerCase()) ?? null : null
}

// Check if a language is supported for syntax highlighting
function isLanguageSupported(alias) {
  return getLanguageConfig(alias) !== null
}

// Check if a language can be run in browser
function isLanguageRunnable(alias) {
  return getLanguageConfig(alias)?.runnable ?? false
}

// Optimized HTML escape - single pass with replace map
const escapeMap = { '&': '&amp;', '<': '&lt;', '>': '&gt;' }
const escapeRe = /[&<>]/g
function escapeHtml(s) {
  return s.replace(escapeRe, c => escapeMap[c])
}

// Highlight code based on language
function highlightCode(code, langAlias) {
  const config = getLanguageConfig(langAlias)
  
  if (!config?.tokenPatterns) {
    return escapeHtml(code)
  }

  const parts = []
  let i = 0
  const { tokenPatterns, keywords, builtins } = config
  const len = code.length

  while (i < len) {
    let matched = false
    
    for (const pat of tokenPatterns) {
      pat.re.lastIndex = i
      const match = pat.re.exec(code)
      
      if (match && match.index === i) {
        const token = match[0]
        let className = tokenClassMap[pat.type]

        // Handle word tokens (keywords, builtins, functions)
        if (pat.type === 'word') {
          const lowerToken = token.toLowerCase()
          if (keywords?.has(token) || keywords?.has(lowerToken)) {
            className = 'ce-keyword'
          } else if (builtins?.has(token) || builtins?.has(lowerToken)) {
            className = 'ce-builtin'
          } else if (i + token.length < len && code[i + token.length] === '(') {
            className = 'ce-function'
          }
        }

        parts.push(className 
          ? '<span class="' + className + '">' + escapeHtml(token) + '</span>' 
          : escapeHtml(token))
        i += token.length
        matched = true
        break
      }
    }
    
    if (!matched) {
      parts.push(escapeHtml(code[i]))
      i++
    }
  }
  
  return parts.join('')
}

// Strip TypeScript type annotations for execution
function stripTypeAnnotations(code) {
  return code
    .replace(/:\s*[A-Za-z<>[\]|&,\s]+(?=[,)\]=;])/g, '')
    .replace(/\bas\s+[A-Za-z<>[\]|&]+/g, '')
    .replace(/<[A-Za-z<>[\]|&,\s]+>(?=\()/g, '')
    .replace(/^(interface|type)\s+.*$/gm, '')
}

// Execute JavaScript/TypeScript code
function executeCode(code, langAlias, outputContent) {
  const logs = []
  const customConsole = {
    log: (...args) => logs.push({ type: 'log', args }),
    error: (...args) => logs.push({ type: 'error', args }),
    warn: (...args) => logs.push({ type: 'warn', args }),
    info: (...args) => logs.push({ type: 'info', args }),
    clear: () => { logs.length = 0 },
  }

  try {
    const executableCode = (langAlias === 'ts' || langAlias === 'typescript')
      ? stripTypeAnnotations(code)
      : code

    new Function('console', executableCode)(customConsole)

    if (logs.length === 0) {
      logs.push({ type: 'info', args: ['✓ Code executed successfully (no output)'] })
    }
  } catch (err) {
    logs.push({ type: 'error', args: [err.toString()] })
  }

  // Batch DOM updates with fragment
  const frag = document.createDocumentFragment()
  for (const { type, args } of logs) {
    const line = document.createElement('div')
    line.className = type
    line.textContent = args.map(arg => 
      typeof arg === 'object' 
        ? ((() => { try { return JSON.stringify(arg, null, 2) } catch { return String(arg) } })())
        : String(arg)
    ).join(' ')
    frag.appendChild(line)
  }
  outputContent.appendChild(frag)
}

// Create output area element
function createOutputArea(onClear) {
  const output = document.createElement('div')
  output.className = 'code-editor-output'
  output.style.display = 'none'

  const header = document.createElement('div')
  header.className = 'code-editor-output-header'

  const label = document.createElement('span')
  label.textContent = 'Output'

  const clearBtn = document.createElement('button')
  clearBtn.className = 'code-editor-output-clear'
  clearBtn.textContent = 'Clear'
  clearBtn.onclick = e => {
    e.stopPropagation()
    onClear()
  }

  header.append(label, clearBtn)

  const content = document.createElement('div')
  content.className = 'code-editor-output-content'

  output.append(header, content)
  
  return { output, content }
}

// Debounce utility
function debounce(ms, fn) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), ms)
  }
}

// Create code editor element
function createCodeEditor(rawCode, saveCallback) {
  const langMatch = rawCode.match(/^\`\`\`(\w*)/)
  const langAlias = langMatch?.[1] || ''
  const firstNewline = rawCode.indexOf('\n')
  const codeBody = rawCode.slice(firstNewline + 1, -4).trim()

  const langConfig = getLanguageConfig(langAlias)

  // Create container
  const container = document.createElement('div')
  container.className = 'code-editor'
  container.contentEditable = 'false'
  container.dataset.raw = rawCode

  // State
  let currentLangAlias = langAlias
  let output = null
  let outputContent = null

  // Create language selector
  const langSelect = document.createElement('select')
  langSelect.className = 'code-editor-lang-select'
  langSelect.title = 'Change language'

  const plainOption = document.createElement('option')
  plainOption.value = ''
  plainOption.textContent = 'Plain Text'
  plainOption.selected = !langConfig
  langSelect.appendChild(plainOption)

  for (const config of Object.values(languages)) {
    const option = document.createElement('option')
    option.value = config.aliases[0]
    option.textContent = config.name
    option.selected = config.aliases.includes(langAlias.toLowerCase())
    langSelect.appendChild(option)
  }

  // Create textarea and highlight
  const textarea = document.createElement('textarea')
  textarea.className = 'code-editor-textarea'
  textarea.value = codeBody
  textarea.spellcheck = false
  textarea.autocomplete = 'off'
  textarea.autocapitalize = 'off'

  const highlight = document.createElement('pre')
  highlight.className = 'code-editor-highlight'
  highlight.innerHTML = highlightCode(codeBody, langAlias)

  // Create buttons
  const copyBtn = document.createElement('button')
  copyBtn.className = 'code-editor-btn copy'
  copyBtn.innerHTML = icons.copy + 'Copy'

  let runBtn = null
  
  const createRunBtn = () => {
    const btn = document.createElement('button')
    btn.className = 'code-editor-btn run'
    btn.innerHTML = icons.run + 'Run'
    btn.onclick = e => {
      e.stopPropagation()
      if (!output) {
        const outputArea = createOutputArea(() => {
          output.style.display = 'none'
          outputContent.innerHTML = ''
        })
        output = outputArea.output
        outputContent = outputArea.content
        container.appendChild(output)
      }
      output.style.display = 'block'
      outputContent.innerHTML = ''
      executeCode(textarea.value, currentLangAlias, outputContent)
    }
    return btn
  }

  // Actions container
  const actions = document.createElement('div')
  actions.className = 'code-editor-actions'
  actions.appendChild(copyBtn)
  
  if (isLanguageRunnable(langAlias)) {
    runBtn = createRunBtn()
    actions.appendChild(runBtn)
    
    // Pre-create output area for runnable languages
    const outputArea = createOutputArea(() => {
      output.style.display = 'none'
      outputContent.innerHTML = ''
    })
    output = outputArea.output
    outputContent = outputArea.content
  }

  // Update run button based on language
  const updateRunButton = (newLangAlias) => {
    const canRun = isLanguageRunnable(newLangAlias)
    if (canRun && !runBtn) {
      runBtn = createRunBtn()
      actions.appendChild(runBtn)
    } else if (!canRun && runBtn) {
      runBtn.remove()
      runBtn = null
      if (output) output.style.display = 'none'
    }
  }

  // Sync function for updates
  const updateRaw = () => {
    container.dataset.raw = '\`\`\`' + currentLangAlias + '\n' + textarea.value + '\n\`\`\`'
  }

  // Event handlers
  const debouncedSave = saveCallback ? debounce(500, saveCallback) : null

  langSelect.onchange = () => {
    currentLangAlias = langSelect.value
    highlight.innerHTML = highlightCode(textarea.value, currentLangAlias)
    updateRaw()
    updateRunButton(currentLangAlias)
    saveCallback?.()
  }

  textarea.oninput = () => {
    // Auto-resize
    textarea.style.height = 'auto'
    textarea.style.height = textarea.scrollHeight + 'px'
    // Update highlight
    highlight.innerHTML = highlightCode(textarea.value, currentLangAlias)
    // Update raw
    updateRaw()
    // Save
    debouncedSave?.()
  }

  textarea.onscroll = () => {
    highlight.scrollTop = textarea.scrollTop
    highlight.scrollLeft = textarea.scrollLeft
  }

  copyBtn.onclick = async e => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(textarea.value)
      copyBtn.innerHTML = icons.copied + 'Copied!'
      setTimeout(() => { copyBtn.innerHTML = icons.copy + 'Copy' }, 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // Prevent parent editor from handling events
  const stopProp = e => e.stopPropagation()
  container.addEventListener('click', stopProp)
  container.addEventListener('mousedown', stopProp)
  container.addEventListener('keydown', stopProp)
  container.addEventListener('keyup', stopProp)
  container.addEventListener('input', stopProp)

  // Build DOM structure
  const header = document.createElement('div')
  header.className = 'code-editor-header'
  header.append(langSelect, actions)

  const body = document.createElement('div')
  body.className = 'code-editor-body'
  body.append(highlight, textarea)

  container.append(header, body)
  if (output) container.appendChild(output)

  // Set initial height
  const lineCount = codeBody.split('\n').length
  const initialHeight = Math.max(80, lineCount * 21 + 24)
  textarea.style.height = initialHeight + 'px'

  return container
}

// Check if raw code should use code editor
function shouldUseCodeEditor(rawCode) {
  return /^\`\`\`\w*/i.test(rawCode)
}

// Export for use in main app
window.CodeEditor = {
  create: createCodeEditor,
  highlight: highlightCode,
  isSupported: isLanguageSupported,
  isRunnable: isLanguageRunnable,
  getConfig: getLanguageConfig,
  shouldUse: shouldUseCodeEditor,
  languages
}

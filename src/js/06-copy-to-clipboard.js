;(function () {
  'use strict'
  ;[].slice.call(document.querySelectorAll('.doc pre.highlight, .doc .literalblock pre')).forEach(function (pre) {
    var code, language, lang, copy, toast, toolbox
    if (pre.classList.contains('highlight')) {
      code = pre.querySelector('code')
      if ((language = code.dataset.lang) && language !== 'console') {
        ;(lang = document.createElement('span')).className = 'code-lang'
        lang.appendChild(document.createTextNode(language))
      }
    } else if (pre.innerText.startsWith('$ ')) {
      var block = pre.parentNode.parentNode
      block.classList.remove('literalblock')
      block.classList.add('listingblock')
      pre.classList.add('highlightjs')
      pre.classList.add('highlight')
      ;(code = document.createElement('code')).className = 'language-console hljs'
      code.dataset.lang = 'console'
      code.appendChild(pre.firstChild)
      pre.appendChild(code)
    } else {
      return
    }
    ;(copy = document.createElement('button')).className = 'copy-button'
    copy.setAttribute('title', 'Copy to clipboard')
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('aria-hidden', 'true')
    svg.setAttribute('class', 'copy-icon')
    svg.setAttribute('viewBox', '0 0 16 16')
    var use = document.createElementNS('http://www.w3.org/2000/svg', 'use')
    use.setAttribute('href', window.uiRootPath + '/img/octicons.svg#clippy-16')
    svg.appendChild(use)
    copy.appendChild(svg)
    ;(toast = document.createElement('span')).className = 'copy-toast'
    toast.appendChild(document.createTextNode('Copied!'))
    copy.appendChild(toast)
    ;(toolbox = document.createElement('div')).className = 'code-toolbox'
    if (lang) toolbox.appendChild(lang)
    toolbox.appendChild(copy)
    pre.appendChild(toolbox)
    copy.addEventListener('click', writeToClipboard.bind(copy, code))
  })

  function extractCommands (text) {
    var cmdRx = /^\$ (\S[^\\\n]*(\\\n(?!\$ )[^\\\n]*)*)(?=\n|$)/gm
    var cleanupRx = /( )? *\\\n */g
    var cmds = []
    var m
    while ((m = cmdRx.exec(text))) cmds.push(m[1].replace(cleanupRx, '$1'))
    return cmds.join(' && ')
  }

  function writeToClipboard (code) {
    var text = code.innerText
    if (code.dataset.lang === 'console' && text.startsWith('$ ')) text = extractCommands(text)
    window.navigator.clipboard.writeText(text).then(
      function () {
        this.classList.add('clicked')
        this.offsetHeight // eslint-disable-line no-unused-expressions
        this.classList.remove('clicked')
      }.bind(this),
      function () {}
    )
  }
})()
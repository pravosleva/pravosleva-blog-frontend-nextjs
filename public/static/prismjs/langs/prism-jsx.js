!(function (i) {
  var t = i.util.clone(i.languages.javascript)
  ;(i.languages.jsx = i.languages.extend('markup', t)),
    (i.languages.jsx.tag.pattern = /<\/?(?:[\w.:-]+\s*(?:\s+(?:[\w.:$-]+(?:=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s{'">=]+|\{(?:\{(?:\{[^{}]*\}|[^{}])*\}|[^{}])+\}))?|\{\s*\.{3}\s*[a-z_$][\w$]*(?:\.[a-z_$][\w$]*)*\s*\}))*\s*\/?)?>/i),
    (i.languages.jsx.tag.inside.tag.pattern = /^<\/?[^\s>\/]*/i),
    (i.languages.jsx.tag.inside['attr-value'].pattern = /=(?!\{)(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">]+)/i),
    (i.languages.jsx.tag.inside.tag.inside['class-name'] = /^[A-Z]\w*(?:\.[A-Z]\w*)*$/),
    i.languages.insertBefore(
      'inside',
      'attr-name',
      {
        spread: {
          pattern: /\{\s*\.{3}\s*[a-z_$][\w$]*(?:\.[a-z_$][\w$]*)*\s*\}/,
          inside: { punctuation: /\.{3}|[{}.]/, 'attr-value': /\w+/ },
        },
      },
      i.languages.jsx.tag
    ),
    i.languages.insertBefore(
      'inside',
      'attr-value',
      {
        script: {
          pattern: /=(?:\{(?:\{(?:\{[^{}]*\}|[^{}])*\}|[^{}])+\})/i,
          inside: { 'script-punctuation': { pattern: /^=(?={)/, alias: 'punctuation' }, rest: i.languages.jsx },
          alias: 'language-javascript',
        },
      },
      i.languages.jsx.tag
    )
  var o = function (t) {
      return t ? ('string' == typeof t ? t : 'string' == typeof t.content ? t.content : t.content.map(o).join('')) : ''
    },
    p = function (t) {
      for (var n = [], e = 0; e < t.length; e++) {
        var a = t[e],
          s = !1
        if (
          ('string' != typeof a &&
            ('tag' === a.type && a.content[0] && 'tag' === a.content[0].type
              ? '</' === a.content[0].content[0].content
                ? 0 < n.length && n[n.length - 1].tagName === o(a.content[0].content[1]) && n.pop()
                : '/>' === a.content[a.content.length - 1].content ||
                  n.push({ tagName: o(a.content[0].content[1]), openedBraces: 0 })
              : 0 < n.length && 'punctuation' === a.type && '{' === a.content
              ? n[n.length - 1].openedBraces++
              : 0 < n.length && 0 < n[n.length - 1].openedBraces && 'punctuation' === a.type && '}' === a.content
              ? n[n.length - 1].openedBraces--
              : (s = !0)),
          (s || 'string' == typeof a) && 0 < n.length && 0 === n[n.length - 1].openedBraces)
        ) {
          var g = o(a)
          e < t.length - 1 &&
            ('string' == typeof t[e + 1] || 'plain-text' === t[e + 1].type) &&
            ((g += o(t[e + 1])), t.splice(e + 1, 1)),
            0 < e &&
              ('string' == typeof t[e - 1] || 'plain-text' === t[e - 1].type) &&
              ((g = o(t[e - 1]) + g), t.splice(e - 1, 1), e--),
            (t[e] = new i.Token('plain-text', g, null, g))
        }
        a.content && 'string' != typeof a.content && p(a.content)
      }
    }
  i.hooks.add('after-tokenize', function (t) {
    ;('jsx' !== t.language && 'tsx' !== t.language) || p(t.tokens)
  })
})(Prism)

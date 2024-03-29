!(function (s) {
  function a(e, s) {
    return e.replace(/<<(\d+)>>/g, function (e, n) {
      return '(?:' + s[+n] + ')'
    })
  }
  function t(e, n, s) {
    return RegExp(a(e, n), s || '')
  }
  function e(e, n) {
    for (var s = 0; s < n; s++)
      e = e.replace(/<<self>>/g, function () {
        return '(?:' + e + ')'
      })
    return e.replace(/<<self>>/g, '[^\\s\\S]')
  }
  var n = 'bool byte char decimal double dynamic float int long object sbyte short string uint ulong ushort var void',
    i = 'class enum interface struct',
    r =
      'add alias ascending async await by descending from get global group into join let nameof notnull on orderby partial remove select set unmanaged value when where where',
    o =
      'abstract as base break case catch checked const continue default delegate do else event explicit extern finally fixed for foreach goto if implicit in internal is lock namespace new null operator out override params private protected public readonly ref return sealed sizeof stackalloc static switch this throw try typeof unchecked unsafe using virtual volatile while yield'
  function l(e) {
    return '\\b(?:' + e.trim().replace(/ /g, '|') + ')\\b'
  }
  var d = l(i),
    p = RegExp(l(n + ' ' + i + ' ' + r + ' ' + o)),
    c = l(i + ' ' + r + ' ' + o),
    u = l(n + ' ' + i + ' ' + o),
    g = e('<(?:[^<>;=+\\-*/%&|^]|<<self>>)*>', 2),
    b = e('\\((?:[^()]|<<self>>)*\\)', 2),
    h = '@?\\b[A-Za-z_]\\w*\\b',
    f = a('<<0>>(?:\\s*<<1>>)?', [h, g]),
    m = a('(?!<<0>>)<<1>>(?:\\s*\\.\\s*<<1>>)*', [c, f]),
    k = '\\[\\s*(?:,\\s*)*\\]',
    y = a('(?:<<0>>|<<1>>)(?:\\s*(?:\\?\\s*)?<<2>>)*(?:\\s*\\?)?', [
      a('\\(<<0>>+(?:,<<0>>+)+\\)', [a('[^,()<>[\\];=+\\-*/%&|^]|<<0>>|<<1>>|<<2>>', [g, b, k])]),
      m,
      k,
    ]),
    w = { keyword: p, punctuation: /[<>()?,.:[\]]/ },
    v = "'(?:[^\r\n'\\\\]|\\\\.|\\\\[Uux][\\da-fA-F]{1,8})'",
    x = '"(?:\\\\.|[^\\\\"\r\n])*"'
  ;(s.languages.csharp = s.languages.extend('clike', {
    string: [
      { pattern: t('(^|[^$\\\\])<<0>>', ['@"(?:""|\\\\[^]|[^\\\\"])*"(?!")']), lookbehind: !0, greedy: !0 },
      { pattern: t('(^|[^@$\\\\])<<0>>', [x]), lookbehind: !0, greedy: !0 },
      { pattern: RegExp(v), greedy: !0, alias: 'character' },
    ],
    'class-name': [
      { pattern: t('(\\busing\\s+static\\s+)<<0>>(?=\\s*;)', [m]), lookbehind: !0, inside: w },
      { pattern: t('(\\busing\\s+<<0>>\\s*=\\s*)<<1>>(?=\\s*;)', [h, y]), lookbehind: !0, inside: w },
      { pattern: t('(\\busing\\s+)<<0>>(?=\\s*=)', [h]), lookbehind: !0 },
      { pattern: t('(\\b<<0>>\\s+)<<1>>', [d, f]), lookbehind: !0, inside: w },
      { pattern: t('(\\bcatch\\s*\\(\\s*)<<0>>', [m]), lookbehind: !0, inside: w },
      { pattern: t('(\\bwhere\\s+)<<0>>', [h]), lookbehind: !0 },
      { pattern: t('(\\b(?:is|as)\\s+)<<0>>', [y]), lookbehind: !0, inside: w },
      { pattern: t('\\b<<0>>(?=\\s+(?!<<1>>)<<2>>(?:\\s*[=,;:{)\\]]|\\s+in))', [y, u, h]), inside: w },
    ],
    keyword: p,
    number: /(?:\b0(?:x[\da-f_]*[\da-f]|b[01_]*[01])|(?:\B\.\d+(?:_+\d+)*|\b\d+(?:_+\d+)*(?:\.\d+(?:_+\d+)*)?)(?:e[-+]?\d+(?:_+\d+)*)?)(?:ul|lu|[dflmu])?\b/i,
    operator: />>=?|<<=?|[-=]>|([-+&|])\1|~|\?\?=?|[-+*/%&|^!=<>]=?/,
    punctuation: /\?\.?|::|[{}[\];(),.:]/,
  })),
    s.languages.insertBefore('csharp', 'number', { range: { pattern: /\.\./, alias: 'operator' } }),
    s.languages.insertBefore('csharp', 'punctuation', {
      'named-parameter': { pattern: t('([(,]\\s*)<<0>>(?=\\s*:)', [h]), lookbehind: !0, alias: 'punctuation' },
    }),
    s.languages.insertBefore('csharp', 'class-name', {
      namespace: {
        pattern: t('(\\b(?:namespace|using)\\s+)<<0>>(?:\\s*\\.\\s*<<0>>)*(?=\\s*[;{])', [h]),
        lookbehind: !0,
        inside: { punctuation: /\./ },
      },
      'type-expression': {
        pattern: t('(\\b(?:default|typeof|sizeof)\\s*\\(\\s*)(?:[^()\\s]|\\s(?!\\s*\\))|<<0>>)*(?=\\s*\\))', [b]),
        lookbehind: !0,
        alias: 'class-name',
        inside: w,
      },
      'return-type': {
        pattern: t('<<0>>(?=\\s+(?:<<1>>\\s*(?:=>|[({]|\\.\\s*this\\s*\\[)|this\\s*\\[))', [y, m]),
        inside: w,
        alias: 'class-name',
      },
      'constructor-invocation': {
        pattern: t('(\\bnew\\s+)<<0>>(?=\\s*[[({])', [y]),
        lookbehind: !0,
        inside: w,
        alias: 'class-name',
      },
      'generic-method': {
        pattern: t('<<0>>\\s*<<1>>(?=\\s*\\()', [h, g]),
        inside: { function: t('^<<0>>', [h]), generic: { pattern: RegExp(g), alias: 'class-name', inside: w } },
      },
      'type-list': {
        pattern: t(
          '\\b((?:<<0>>\\s+<<1>>|where\\s+<<2>>)\\s*:\\s*)(?:<<3>>|<<4>>)(?:\\s*,\\s*(?:<<3>>|<<4>>))*(?=\\s*(?:where|[{;]|=>|$))',
          [d, f, h, y, p.source]
        ),
        lookbehind: !0,
        inside: { keyword: p, 'class-name': { pattern: RegExp(y), greedy: !0, inside: w }, punctuation: /,/ },
      },
      preprocessor: {
        pattern: /(^\s*)#.*/m,
        lookbehind: !0,
        alias: 'property',
        inside: {
          directive: {
            pattern: /(\s*#)\b(?:define|elif|else|endif|endregion|error|if|line|pragma|region|undef|warning)\b/,
            lookbehind: !0,
            alias: 'keyword',
          },
        },
      },
    })
  var $ = x + '|' + v,
    _ = a('/(?![*/])|//[^\r\n]*[\r\n]|/\\*(?:[^*]|\\*(?!/))*\\*/|<<0>>', [$]),
    B = e(a('[^"\'/()]|<<0>>|\\(<<self>>*\\)', [_]), 2),
    E = '\\b(?:assembly|event|field|method|module|param|property|return|type)\\b',
    R = a('<<0>>(?:\\s*\\(<<1>>*\\))?', [m, B])
  s.languages.insertBefore('csharp', 'class-name', {
    attribute: {
      pattern: t('((?:^|[^\\s\\w>)?])\\s*\\[\\s*)(?:<<0>>\\s*:\\s*)?<<1>>(?:\\s*,\\s*<<1>>)*(?=\\s*\\])', [E, R]),
      lookbehind: !0,
      greedy: !0,
      inside: {
        target: { pattern: t('^<<0>>(?=\\s*:)', [E]), alias: 'keyword' },
        'attribute-arguments': { pattern: t('\\(<<0>>*\\)', [B]), inside: s.languages.csharp },
        'class-name': { pattern: RegExp(m), inside: { punctuation: /\./ } },
        punctuation: /[:,]/,
      },
    },
  })
  var P = ':[^}\r\n]+',
    z = e(a('[^"\'/()]|<<0>>|\\(<<self>>*\\)', [_]), 2),
    S = a('\\{(?!\\{)(?:(?![}:])<<0>>)*<<1>>?\\}', [z, P]),
    j = e(a('[^"\'/()]|/(?!\\*)|/\\*(?:[^*]|\\*(?!/))*\\*/|<<0>>|\\(<<self>>*\\)', [$]), 2),
    A = a('\\{(?!\\{)(?:(?![}:])<<0>>)*<<1>>?\\}', [j, P])
  function F(e, n) {
    return {
      interpolation: {
        pattern: t('((?:^|[^{])(?:\\{\\{)*)<<0>>', [e]),
        lookbehind: !0,
        inside: {
          'format-string': {
            pattern: t('(^\\{(?:(?![}:])<<0>>)*)<<1>>(?=\\}$)', [n, P]),
            lookbehind: !0,
            inside: { punctuation: /^:/ },
          },
          punctuation: /^\{|\}$/,
          expression: { pattern: /[\s\S]+/, alias: 'language-csharp', inside: s.languages.csharp },
        },
      },
      string: /[\s\S]+/,
    }
  }
  s.languages.insertBefore('csharp', 'string', {
    'interpolation-string': [
      {
        pattern: t('(^|[^\\\\])(?:\\$@|@\\$)"(?:""|\\\\[^]|\\{\\{|<<0>>|[^\\\\{"])*"', [S]),
        lookbehind: !0,
        greedy: !0,
        inside: F(S, z),
      },
      {
        pattern: t('(^|[^@\\\\])\\$"(?:\\\\.|\\{\\{|<<0>>|[^\\\\"{])*"', [A]),
        lookbehind: !0,
        greedy: !0,
        inside: F(A, j),
      },
    ],
  })
})(Prism),
  (Prism.languages.dotnet = Prism.languages.cs = Prism.languages.csharp)

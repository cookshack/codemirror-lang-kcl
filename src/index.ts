// Code mirror language implementation for KCL.

import {
  LRLanguage,
  LanguageSupport,
  indentNodeProp,
  continuedIndent,
  delimitedIndent,
  foldNodeProp,
  foldInside,
} from '@codemirror/language'
// @ts-ignore: No types available
import { parser } from './syntax.grammar'

export const KclLanguage = LRLanguage.define({
  name: 'kcl',
  parser: parser.configure({
    props: [
      indentNodeProp.add({
        Body: delimitedIndent({ closing: '}' }),
        BlockComment: () => null,
        'Statement Property': continuedIndent({ except: /^{/ }),
      }),
      foldNodeProp.add({
        'Body ArrayExpression ObjectExpression': foldInside,
        BlockComment(tree) {
          return { from: tree.from + 2, to: tree.to - 2 }
        },
        PipeExpression(tree) {
          return { from: tree.firstChild!.to, to: tree.to }
        },
      }),
    ],
  }),
  languageData: {
    commentTokens: { line: '//', block: { open: '/*', close: '*/' } },
  },
})

export function kcl() {
  return new LanguageSupport(KclLanguage)
}

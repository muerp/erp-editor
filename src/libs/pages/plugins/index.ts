import { Editable } from '@editablejs/editor'
import { MarkEditor, MarkOptions, withMark } from '@editablejs/plugin-mark'
import { FontSizeEditor, FontSizeOptions, withFontSize } from '@editablejs/plugin-font/size'
import { FontColorEditor, FontColorOptions, withFontColor } from '@editablejs/plugin-font/color'
import {
  BackgroundColorEditor,
  BackgroundColorOptions,
  withBackgroundColor,
} from '@editablejs/plugin-font/background-color'
import { HeadingEditor, HeadingOptions, withHeading } from '@editablejs/plugin-heading'
import { BlockquoteOptions, withBlockquote, BlockquoteEditor } from '@editablejs/plugin-blockquote'
import { IndentEditor, IndentOptions, withIndent } from '@editablejs/plugin-indent'
import {
  OrderedListOptions,
  withOrderedList,
  OrderedListEditor,
  UnorderedListOptions,
  withUnorderedList,
  UnorderedListEditor,
  TaskListOptions,
  withTaskList,
  TaskListEditor,
} from './list'
// } from '@editablejs/plugin-list'
import { TableOptions, TableEditor, withTable } from '@editablejs/plugin-table'
import { LinkOptions, LinkEditor, withLink } from '@editablejs/plugin-link'
import { ImageOptions, ImageEditor, withImage } from '@editablejs/plugin-image'
// import { HrOptions, HrEditor, withHr } from '@editablejs/plugin-hr'
import { HrOptions, HrEditor, withHr } from './hr'
import { AlignOptions, AlignEditor, withAlign } from '@editablejs/plugin-alignment'
import { LeadingOptions, LeadingEditor, withLeading } from '@editablejs/plugin-leading'
import { MentionOptions, MentionEditor, withMention } from '@editablejs/plugin-mention'
import { CodeBlockOptions, CodeBlockEditor, withCodeBlock } from '@editablejs/plugin-codeblock'
import {
  ContextMenuEditor,
  ContextMenuOptions,
  // withContextMenu,
} from '@editablejs/plugin-context-menu'

import { DocxEditor, DocxOptions, withDocx } from './docx'
import { MathMLEditor, withMathML } from './math'
import { SectionEditor, SectionOptions, withSection } from './section'
import { withDocxRun, DocxRunOptions, DocxRunEditor } from './docx-run'
import { DocxArticleEditor, DocxArticleOptions, withDocxArticle, } from './docx-article'
import { DocxHeaderEditor, DocxHeaderOptions, withDocxHeader } from './docx-header'
import { ClearFormatEditor, withClearFormat } from './clear-format'
import { FontFamilyEditor, FontFamilyOptions, withFontFamily } from './font/family'
import { MarginEditor, MarginOptions, withMargin } from './margin'
export interface PluginOptions {
  contextMenu?: ContextMenuOptions
  mark?: MarkOptions
  fontSize?: FontSizeOptions
  fontColor?: FontColorOptions
  fontFamily?: FontFamilyOptions
  backgroundColor?: BackgroundColorOptions
  margin?: MarginOptions
  heading?: HeadingOptions
  blockquote?: BlockquoteOptions
  orderedList?: OrderedListOptions
  unorderedList?: UnorderedListOptions
  taskList?: TaskListOptions
  indent?: IndentOptions
  table?: TableOptions
  link?: LinkOptions
  image?: ImageOptions
  hr?: HrOptions
  align?: AlignOptions
  leading?: LeadingOptions
  mention?: MentionOptions
  codeBlock?: CodeBlockOptions
  doxc?: DocxOptions
  section?: SectionOptions
  docxSpan?: DocxRunOptions,
  docxHeader?: DocxHeaderOptions,
  docxArticle?: DocxArticleOptions
}

export const withPlugins = <T extends Editable>(editor: T, options: PluginOptions = {}) => {
  // let newEditor = withContextMenu(editor)
  let newEditor = withIndent(editor, options.indent)
  newEditor = withMark(newEditor, options.mark)
  newEditor = withFontSize(newEditor, options.fontSize)
  newEditor = withFontColor(newEditor, options.fontColor)
  newEditor = withFontFamily(newEditor, options.fontFamily)
  newEditor = withBackgroundColor(newEditor, options.backgroundColor)
  newEditor = withMargin(newEditor, options.margin)
  newEditor = withHeading(newEditor, options.heading)
  newEditor = withBlockquote(newEditor, options.blockquote)
  newEditor = withOrderedList(newEditor, options.orderedList)
  newEditor = withUnorderedList(newEditor, options.unorderedList)
  newEditor = withTaskList(newEditor, options.taskList)
  newEditor = withTable(newEditor, options.table)
  newEditor = withLink(newEditor, options.link)
  newEditor = withImage(newEditor, options.image)
  newEditor = withHr(newEditor, options.hr)
  newEditor = withAlign(newEditor, options.align)
  newEditor = withLeading(newEditor, options.leading)
  newEditor = withMention(newEditor, options.mention)
  newEditor = withCodeBlock(newEditor, options.codeBlock)
  newEditor = withDocx(newEditor, options.doxc)
  newEditor = withMathML(newEditor, {})
  newEditor = withSection(newEditor, options.section)
  newEditor = withDocxRun(newEditor, options.section)
  newEditor = withDocxHeader(newEditor, options.section)
  newEditor = withDocxArticle(newEditor, options.section)
  newEditor = withClearFormat(newEditor)
  
  return newEditor as T &
    ContextMenuEditor &
    MarkEditor &
    HeadingEditor &
    FontSizeEditor &
    BlockquoteEditor &
    OrderedListEditor &
    IndentEditor &
    UnorderedListEditor &
    TaskListEditor &
    TableEditor &
    LinkEditor &
    ImageEditor &
    HrEditor &
    AlignEditor &
    LeadingEditor &
    FontColorEditor &
    FontFamilyEditor &
    BackgroundColorEditor &
    MarginEditor &
    MentionEditor &
    CodeBlockEditor &
    DocxEditor &
    MathMLEditor &
    SectionEditor &
    DocxRunEditor &
    DocxHeaderEditor &
    DocxArticleEditor &
    ClearFormatEditor
}

export * from '@editablejs/plugin-mark'
export * from '@editablejs/plugin-font/size'
export * from '@editablejs/plugin-font/color'
export * from '@editablejs/plugin-font/background-color'
export * from '@editablejs/plugin-heading'
export * from '@editablejs/plugin-blockquote'
export * from '@editablejs/plugin-indent'
export * from '@editablejs/plugin-table'
export * from '@editablejs/plugin-context-menu'
export * from '@editablejs/plugin-link'
export * from '@editablejs/plugin-image'
export * from '@editablejs/plugin-hr'
export * from '@editablejs/plugin-alignment'
export * from '@editablejs/plugin-leading'
export * from '@editablejs/plugin-mention'
export * from '@editablejs/plugin-codeblock'
export * from './font/family'
export * from './list'
export * from './toolbar'

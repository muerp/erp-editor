export const isMac = (navigator.userAgent.indexOf('Mac')>=0)? true:false;
const MKey = isMac? '⌘':'Ctrl'
export interface ShortcutItem {
    key: string,
    text: string,
    title: string
}
export const ShortcutKey: {[key: string]: ShortcutItem} = {
    'cmd+b': {
        key: 'bold',
        text: MKey+'B',
        title: `粗体 (${MKey}B)`
    },
    'cmd+2': {
        key: 'significance',
        text: MKey+'2',
        title: `非常重要 (${MKey}2)`
    },
    'cmd+1': {
        key: 'significance-content',
        text: MKey+'1',
        title: `重要内容 (${MKey}1)`
    },
    'cmd+i': {
        key: 'italic',
        text: MKey+'I',
        title: `斜体 (${MKey}I)`
    },
    'cmd+u': {
        key: 'underline',
        text: MKey+'U',
        title: `下划线 (${MKey}U)`
    },
    'cmd+alt+ç': {
        key: 'color',
        text: MKey+'⌥C',
        title: `字体颜色 (${MKey}⌥C)`
    },
    'cmd+alt+˙': { key: 'background', text: MKey+'⌥H', title: `字体颜色 (${MKey}⌥H)` },
    'cmd+4': { key: 'cc', text: MKey+'⌥4', title: `出处 (${MKey}4)` },
    'cmd+]': { key: 'indent', text: MKey+']', title:`增加缩进量 (${MKey}])` },
    'cmd+k': { key: 'link', text: MKey+'K', title: `插入超链接 (${MKey}K)` },
    'cmd+z': { key: 'undo', text: MKey+'Z', title: `撤消 (${MKey}Z)` },
    'cmd+shift+z': { key: 'redo', text: MKey+'⇧Z', title: `恢复 (${MKey}⇧Z)` },
    'cmd+shift+7': { key: 'ordered', text: MKey+'⇧7', title: `有序列表（${MKey}⇧7）`  },
    'cmd+shift+8': { key: 'unordered', text: MKey+'⇧8', title: `无序列表（${MKey}⇧7）` },
    'cmd+shift+9': { key: 'check-list', text: MKey+'⇧9', title: `任务列表（${MKey}⇧7）`  },
    'cmd+\\': { key: 'clear', text: MKey+'\\', title: `清除格式(${MKey}\\)` },
}
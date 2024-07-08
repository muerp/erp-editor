import React, { FC, useCallback, useMemo, useRef, useState } from "react";
import { TextArea } from "./TextArea"
import { FormulaContent } from "./FormulaContent";
import { TabItem, Tabs } from "./Tabs";
import { SymbolContent } from "./SymbolContent";
import { FORMULA_LIST, SYMBOL_LIST } from "./latex";
import { Button } from "../../../components";
import { Modal } from "./Modal";
import { useMathViewer } from "../hooks/use-math-viewer";
import { useViewerVisible } from "../hooks/use-viewer-visible";
import { SlotComponentProps, useEditable } from "@editablejs/editor";
import { MathMLEditor } from "..";
import { useMathLatex } from "../hooks/use-math-latex";
import { useMathUpdateAt } from "../hooks/use-math-update-at";

export interface MathViewerProps extends SlotComponentProps {}

const tabs: TabItem[] = [
    { label: '常用符号', key: 'symbol' },
    { label: '预置公式', key: 'formula' },
]
const formulaList = FORMULA_LIST
const symbolTabs = SYMBOL_LIST.map(item => ({
    label: item.label,
    key: item.type,
}))


export const MathViewer: FC<MathViewerProps> = React.memo(() => {
    const textAreaRef = useRef<any>(null)
    const [toolbarState, setToolbarState] = useState<string>('symbol')
    const [selectedSymbolKey, setSelectedSymbolKey] = useState(SYMBOL_LIST[0].type);

    const viewer = useMathViewer()
    const [visible] = useViewerVisible()
    const [latex, setLatex] = useMathLatex()
    const [at] = useMathUpdateAt()
    
    const symbolPool = useMemo(() => {
        const selectedSymbol = SYMBOL_LIST.find(item => item.type === selectedSymbolKey)
        return selectedSymbol?.children || []
    }, [selectedSymbolKey])

    const insertSymbol = (latex: string) => {
        if (!textAreaRef) return
        textAreaRef.current.focus()
        document.execCommand('insertText', false, latex)
    }
    
    const editor = useEditable();
    const onSubmit = useCallback(()=> {
        if (latex) {
            if (at) {
                MathMLEditor.update(editor, at, {latex} )
            } else {
                MathMLEditor.insert(editor, latex)
            }
            viewer.close()
        }
    }, [at, editor, latex, viewer])
    if (!visible) return undefined;
    return (
        <Modal  className="math-dialog" width="880px">
            <div className="latex-editor">
                <div className="container">
                    <div className="left">
                        <div className="input-area">
                            <TextArea value={latex} placeholder="输入 LaTeX 公式" ref={textAreaRef}
                                onChange={(e) => {
                                    setLatex((e.target as HTMLInputElement).value)
                                }} />
                        </div>
                        <div className="preview">
                            {!latex ? <div className="placeholder">公式预览</div> :
                                <div className="preview-content">
                                    <FormulaContent
                                        width={518}
                                        height={138}
                                        latex={latex}
                                    />
                                </div>}

                        </div>
                    </div>
                    <div className="right">
                        <Tabs
                            tabs={tabs}
                            value={toolbarState}
                            card
                            onChange={key => {
                                setToolbarState(key)
                            }}
                        />
                        <div className="content">
                            {
                                toolbarState === 'symbol' ?
                                    <div className="symbol">
                                        <Tabs
                                            tabs={symbolTabs}
                                            value={selectedSymbolKey}
                                            spaceBetween={true}
                                            tabsStyle={{ margin: '10px 10px 0' }}
                                            onChange={key => setSelectedSymbolKey(key)}
                                        />

                                        <div className="symbol-pool">
                                            {
                                                symbolPool.map(item => (
                                                    <div className="symbol-item"
                                                        key={item.latex}
                                                        onClick={() => {
                                                            insertSymbol(item.latex)
                                                        }}>
                                                        <SymbolContent latex={item.latex} />
                                                    </div>

                                                ))
                                            }
                                        </div>
                                    </div> :
                                    <div className="formula">
                                        {
                                            formulaList.map(item => (
                                                <div className="formula-item" key={item.label}>
                                                    <div className="formula-title">{item.label}</div>
                                                    <div className="formula-item-content" onClick={() => {
                                                        setLatex(item.latex);
                                                    }}>
                                                        <FormulaContent width={236} height={60} latex={item.latex} />
                                                    </div>
                                                </div>
                                            ))
                                        }

                                    </div>
                            }
                        </div>
                    </div>
                </div>
                <div className="footer">
                    <Button onClick={() => { viewer.close() }}>取消</Button>
                    <Button type="primary" onClick={onSubmit} > 确定</Button >
                </div >
            </div >
        </Modal>
    )
})

MathViewer.displayName = 'MathViewer'
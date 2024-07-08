import React, { forwardRef, useImperativeHandle } from "react";
import { HistoryRecordEditorOptions, HistoryRecordInfo } from "./interface";
import { createEditor } from './createHistoryEditor'
import { useHistoryRecord } from './useHistoryRecord'
import { Button, DragView, SvgIcon } from "../../../../libs/pages/components";
import { moment } from "../../../../libs/pages/utils";
import { ErpEditor } from "../../../../libs";
import { Node } from "@editablejs/models";
import * as Y from 'yjs'
import { bufferToOps } from "./yjs-events";
interface HistoryComponentProps extends HistoryRecordEditorOptions {
    className?: string
    theme?: string
    onClose?: () => void
}
export const HistoryComponent = forwardRef(({ className, theme, onClose, ...props }: HistoryComponentProps, ref) => {
    const editor = React.useMemo(() => {
        const editor = createEditor(props)
        return editor;
    }, [props.articleId])
    const records = useHistoryRecord(editor);
    const [curRecord, setCurRecord] = React.useState<HistoryRecordInfo>();
    React.useEffect(() => {
        editor.getMore().then(ops => {
            changeRecord(ops[0], 0);
        })
    }, [editor])
    React.useEffect(() => {
        console.log('历史记录:', records)
    }, [records])

    const scrollRef = React.useRef<HTMLDivElement>(null);
    const onScroll = React.useCallback(() => {
        if (!scrollRef.current) return;
        const sh = scrollRef.current.scrollHeight;
        const top = scrollRef.current.scrollTop;
        if (top + scrollRef.current.offsetHeight > sh - 50) {
            editor.getMore();
        }
    }, [editor])
    const [initValue, setInitValue] = React.useState<Node[]>([]);

    const documentRef = React.useRef<{ document: Y.Doc, apply: any }>();
    const changeRecord = React.useCallback(async (item: HistoryRecordInfo, idx: number) => {
        if (!documentRef.current?.document) return;
        const ops = idx === 0 ? [item] : records.slice(0, idx + 1);
        const adds = await bufferToOps(ops.map(op => op.buffer));
        setInitValue(adds);
        setCurRecord(item);
    }, [records])

    const onRecover = React.useCallback(async () => {
        if (!curRecord) return;
        const list = records.slice(0, curRecord.clock + 1).map(r => r.buffer);
        console.log(list)
        await editor.recover(list);
        onClose && onClose();
    }, [curRecord, editor])

    useImperativeHandle(ref, () => ({

    }))

    return (
        <div className={`article-history${className ? ' ' + className : ''}`}>
            <div className="history-left">
                <div className="article-history-header">
                    <Button className="history-back"
                        onClick={() => {
                            onClose && onClose();
                        }}>
                        <SvgIcon iconClass="back2"></SvgIcon>
                        返回文档
                    </Button>
                    <div className="flex-1 d-center">
                        <Button className="history-recover" onClick={onRecover}>
                            还原此文档
                        </Button>
                    </div>
                </div >
                <div className="history-left-inner">
                    {
                        // initValue && initValue.length > 0 &&
                        <ErpEditor ref={documentRef} className="dox-direction-top dox-viewer history-editor-viewer"
                            readOnly={true}
                            articleId={props.articleId}
                            disabledCollaborative={true}
                            initValue={initValue}
                            theme={theme || 'dark'}
                            wss={props.wss || ''} />
                    }
                </div>
            </div>
            <DragView className="history-right"
                direction="left"
                width={300}
                minWidth={200}>
                <div className="article-history-header">
                    <span className="history-label">历史记录</span>
                </div>
                <div className="scroll-bar" ref={scrollRef} onScroll={onScroll}>
                    <ul className="article-history-list">
                        {
                            records.map((item, idx) => (
                                <li key={item.time + '-' + idx}
                                    className={`${curRecord && curRecord.time === item.time ? 'active' : ''}`}
                                    onClick={() => {
                                        changeRecord(item, idx);
                                    }}>
                                    <div className="ah-content">
                                        <div className="history-time">{moment('y-m-d H:m:s', item.time)}</div>
                                        <div className="history-title">{item.content}</div>
                                    </div>
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </DragView>
        </div>
    )
})
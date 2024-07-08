import * as React from 'react'
import { useStore } from "zustand";
import shallow from 'zustand/shallow'
import { HistoryRecordEditor } from './interface';
import { getHistoryRecordStore } from './store';

export const useHistoryRecord = (editor: HistoryRecordEditor) => {
    const store = React.useMemo(()=> {
        return getHistoryRecordStore(editor);
    }, [editor])
    return useStore(
        store,
        ({ records }) => {
          return records
        },
        shallow,
      )
}
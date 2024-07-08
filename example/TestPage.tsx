import { useEffect, useRef, useState } from "react";
import { EditorVersion, HistoryComponent, ErpEditor } from "../src/libs";
import { Button } from "../src/libs/pages/components";
import React from "react";
interface TestPageProps {
  initValue?: any;
}
const localInfo = localStorage.getItem("__info_test");
const testMap = {
  test: {
    id: "65c249026a44babb6c96bc3c",
    content: '<p>sdsfsfsf</p>'
  },
  article7: {
    id: "article7",
    content:
      '<p>fds<a href="http://baidu.com"></a><span style="color: rgb(60, 55, 59); background-color: rgb(244, 230, 185); border-radius: 4px; font-weight: bold;"><a href="http://baidu.com">fsdsdffsdfs</a></span></p><h1>Heade 1</h1><h2>Heade 2</h2><h3>Heade 3</h3><h4>Heade4</h4><p><s>fsdffsdf</s></p><p><span style="color: rgb(222, 78, 78); font-weight: bold;">fsdfdsffsdf</span></p><p><span style="font-size: 48px;">fsfsfffdsfds</span></p><p><span style="font-size: 18px; color: rgb(44, 130, 201);">fsdfsfs</span></p><p><strong>fsfsdfsdfds</strong></p><p><br></p><p><span style="color: rgb(60, 55, 59); background-color: rgb(244, 230, 185); border-radius: 4px; font-weight: bold;">fd</span></p><p><img data-src="https://moxingshu.oss-cn-shanghai.aliyuncs.com/image/b5527854b376484491bdbddd101b308f"></p><p><img data-src="https://moxingshu.oss-cn-shanghai.aliyuncs.com/image/6b8aeb94a90646ecac5d2f177490aed4.jpeg" style="width: 160px;"></p><p>sf</p><p>sf</p><p>sdff</p><p>s</p><p>fs</p><p>df</p><p>sd</p><p><br></p><p>sd</p><p>fs</p><p>df</p><p>sd</p><p>fs</p><p>df</p><p>sdf</p><p>sdf</p><p>sd</p>',
  },
  article8: {
    id: "room-name",
    content: "<p>fdsfdsfsf</p><p>fdsfsfsfsdfds</p><p>fdsf</p><p>sdfsdfsdfsdfsdfsdfsdfdsfsdfd</p><p>fdsfsdfdsfsdfsfsfdsfsd</p><p>sdfsfdsfsdfsdfsdfsdfsdfsdfdsfdsfsdfsdfsd</p><p>fdsfdsfdsfsdfsdfdsfdsfsdfsdfdsfdsfsdfsdfsdfsdfsdfsafsdfasfasdfasfdsadfsadfasdfsafasfdsadfsaddfsaasfdsfdsfdsfsdfsdfdsffdsfsdfsdfsdfsdfsafsfsfasfsafasfsafsafasfsafafasfsaffdsfsddfsfsfsdabc</p>",
  },
  article9: {
    id: "article9",
    content: "<p>fdsfdsfsf</p><p>fdsfsfsfsdfds</p><p>fdsf</p><p>sdfsdfsdfsdfsdfsdfsdfdsfsdfd</p><p>fdsfsdfdsfsdfsfsfdsfsd</p><p>sdfsfdsfsdfsdfsdfsdfsdfsdfdsfdsfsdfsdfsd</p><p>fdsfdsfdsfsdfsdfdsfdsfsdfsdfdsfdsfsdfsdfsdfsdfsdfsafsdfasfasdfasfdsadfsadfasdfsafasfdsadfsaddfsaasfdsfdsfdsfsdfsdfdsffdsfsdfsdfsdfsdfsafsfsfasfsafasfsafsafasfsafafasfsaffdsfsddfsfsfsdabc</p>",
  },
  article10: {
    id: "article10",
    content: "<p>slot3</p>",
  },
};
export const TestPage = (_: TestPageProps) => {
  const [title, setTitle] = useState("Test titlecdscsdsfdsfdstitle");
  const [info, setInfo] = useState(
    localInfo ? JSON.parse(localInfo) : testMap.test
  );
  const [fontlist, setFontList] = useState([
    { id: "sss", isfouce: false, sort: 0, tip: "ssss" },
    { id: "sss", isfouce: false, sort: 0, tip: "ssss1" },
    { id: "sss", isfouce: false, sort: 0, tip: "ssss2" },
    { id: "sss", isfouce: false, sort: 0, tip: "ssss3" },
    { id: "sss", isfouce: false, sort: 0, tip: "ssss4ssss4ssss4ssss4ssss4" },
    { id: "sss", isfouce: false, sort: 0, tip: "ssss4ssss4ssss4ssss4ssss4" },
    { id: "sss", isfouce: false, sort: 0, tip: "ssss4ssss4ssss4ssss4ssss4" },
    { id: "sss", isfouce: false, sort: 0, tip: "ssss4ssss4ssss4ssss4ssss4" },
    { id: "sss", isfouce: false, sort: 0, tip: "ssss4ssss4ssss4ssss4ssss4" },
    { id: "sss", isfouce: false, sort: 0, tip: "ssss4ssss4ssss4ssss4ssss4" },
  ]);
  const [toolbarAp, setToolbarAp] = useState<"none" | "top" | "bottom">("top");
  const [theme, setTheme] = useState("dark");
  useEffect(() => {
    localStorage.setItem("__info_" + info.id, JSON.stringify(info));
  }, [info]);
  const playgroundRef = useRef<any>(null)
  const [showHistory, setShowHistory] = useState(false);
  const onHistory = () => {
    setShowHistory(true);
  }
  const [articleId, setArticleId] = useState('65b5fa867204f017c68ded86')
  useEffect(() => {
    setTimeout(() => {
      setTitle('6598143ba728d8218190dcd9')
    }, 1000);
  }, [])
  const [isMobile] = useState(false);
  return (
    <div className={`test-clou${' theme-'+theme}`}>
      {
        !isMobile && <>
          {showHistory && <div className="erp-history"><HistoryComponent
            token="dddd"
            articleId={articleId}
            wss="ws://localhost:12003"
            url="http://localhost:12003/v1/history"
            onClose={() => {
              setShowHistory(false);
            }} /></div>}
          <div className="test-toolbar">
            <Button
              onClick={() => {
                setToolbarAp(
                  toolbarAp === "none"
                    ? "top"
                    : toolbarAp === "top"
                      ? "bottom"
                      : "none"
                );
              }}
            >
              工具栏隐藏{toolbarAp}
            </Button>
            <Button
              onClick={() => {
                setFontList([
                  ...fontlist,
                  { id: "sdd", isfouce: false, sort: 2, tip: "ddddddd" },
                ]);
              }}
            >
              出处
            </Button>
            <Button
              onClick={() => {
                setTheme(theme === "light" ? "dark" : "light");
              }}
            >
              主题(theme)
            </Button>
            <Button
              onClick={() => {
                setArticleId(articleId === '6598143ba728d8218190dcd9' ? '65b5fa867204f017c68ded86' : '6598143ba728d8218190dcd9')
              }}
            >
              切换文档
            </Button>
            <Button
              onClick={() => {
                onHistory();
              }}
            >
              历史记录
            </Button>
          </div>
          <div className={`d-cccc`} style={{ flex: 1 }}>
            {!showHistory && <ErpEditor ref={playgroundRef}
              className="dox-viewer"
              onChangeTitle={(title) => setTitle(title)}
              // readOnly={true}
              onChange={() => {
                // console.log(e)
              }}
              wss="ws://localhost:12003"
              onConvertFinished={() => {
                const newInfo = { ...info };
                newInfo.exts = EditorVersion;
                setInfo(newInfo);
              }}
              articleId={articleId}
              showCloseButton={false}
              user={{ name: Date.now() + "-s", avatar: "" }}
              theme={theme}
              fontList={fontlist}
              isPasteText={true}
              title={title}
              toolbarDirection={toolbarAp}
              initValue={info.content}
              isHtml={true}
              onChangeToolbar={(type: string, value?: any) => {
                console.log("00==", type, value);
              }}
            />}
          </div>
        </>
      }

      {isMobile && <div className="d-cccc" style={{ flex: 1 }}>
        <ErpEditor ref={playgroundRef}
          className="dox-viewer"
          onChangeTitle={(title) => setTitle(title)}
          onChange={(e) => {
            // console.log(e)
          }}
          wss="wss://yjs.moxingshu.cn"
          onConvertFinished={() => {
            const newInfo = { ...info };
            newInfo.exts = EditorVersion;
            setInfo(newInfo);
          }}
          articleId={articleId}
          user={{ name: Date.now() + "-s", avatar: "" }}
          theme={theme}
          fontList={fontlist}
          isPasteText={true}
          title={title}
          toolbarDirection={toolbarAp}
          isHtml={true}
          onChangeToolbar={(type: string, value?: any) => {
            console.log("00==", type, value);
          }}
          hideToolbar={true}
          isMobile={true}
        />
      </div>}
    </div>
  );
};
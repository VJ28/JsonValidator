import React, { useRef, useState } from "react";
import "./App.css";

function RenderArray({ keyName, value, tabClass }) {
  const [isExpanded, setExpand] = useState(false);
  return (
    <div className={tabClass}>
      <div onClick={() => setExpand(!isExpanded)}>
        {keyName}: array({value.length})
      </div>
      {isExpanded &&
        value.map((x, index) => (
          <div key={x} className={isExpanded ? "block tab1" : "tab1"}>
            {index}: {x}
          </div>
        ))}
    </div>
  );
}

function renderObject(obj, arr, tabSpaces) {
  Object.keys(obj).map((x) => {
    if (Array.isArray(obj[x])) {
      arr.push(
        <RenderArray
          key={x}
          keyName={x}
          value={obj[x]}
          tabClass={"tab" + tabSpaces}
        />
      );
    } else if (typeof obj[x] == "object") {
      arr.push(<div>{x}: object</div>);
      renderObject(obj[x], arr, tabSpaces + 1);
    } else
      arr.push(
        <div key={obj[x]} className={"tab" + tabSpaces}>
          {x}: {obj[x]}
        </div>
      );
  });
}

function App() {
  const inputRef = useRef();
  const [error, setError] = useState("");
  const [output, setOutput] = useState("");
  const [treeView, setTreeState] = useState({
    showTreeView: false,
    treeData: null,
  });
  const handleClick = () => {
    try {
      let json = inputRef.current.value;
      console.log(json);
      let formattedJSON = JSON.parse(json);
      setOutput(JSON.stringify(formattedJSON, null, 4));
      setTreeState({ showTreeView: false });
    } catch (ex) {
      setError(ex.message);
    }
  };
  const showTree = () => {
    try {
      let json = inputRef.current.value;
      let formattedJSON = JSON.parse(json);
      let arr = [];
      renderObject(formattedJSON, arr, 0);
      setTreeState({ showTreeView: true, treeData: arr });
    } catch (ex) {
      setError(ex.message);
    }
  };
  const copyJson = () => {
    var copyText = document.getElementById("formattedJson").textContent;
    const textArea = document.createElement("textarea");
    textArea.textContent = copyText;
    document.body.append(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    alert("Copied the text: " + textArea.textContent);
  };
  return (
    <div className="App">
      <div className="flex">
        <textarea
          className="inputBox"
          ref={inputRef}
          cols={20}
          rows={10}
        ></textarea>
        <div>
          <div className="btn" onClick={handleClick}>
            Parse
          </div>
          <div className="btn" onClick={showTree}>
            Tree Viewer
          </div>
          {output && <button onClick={copyJson}>Copy JSON</button>}
        </div>
        {treeView.showTreeView ? (
          <div className="output">{treeView.treeData}</div>
        ) : (
          <pre id="formattedJson" className="output">
            {output ? output : null}
          </pre>
        )}
      </div>
      {error && <div>{error}</div>}
    </div>
  );
}

export default App;

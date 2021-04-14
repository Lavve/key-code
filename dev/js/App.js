'use strict';

import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';

const App = () => {
  const [altKey, setAltKey] = useState(false);
  const [shiftKey, setShiftKey] = useState(false);
  const [ctrlKey, setCtrlKey] = useState(false);
  const [code, setCode] = useState('\u00a0');
  const [key, setKey] = useState('\u00a0');
  const [which, setWhich] = useState('\u00a0');
  const [keyPressed, setKeyPressed] = useState(false);
  const [copy, setCopy] = useState(false);

  let copyTimer = null;

  const keyClick = (e, type) => {
    e.stopPropagation();
    let text = '';

    console.log(e.currentTarget);

    switch (type) {
      case 'code':
        text = code;
        break;
      case 'key':
        text = key;
        break;
      case 'which':
        text = which;
        break;
    }

    setCopy(false);

    if (keyPressed) {
      navigator.clipboard.writeText(text).then(
        function () {
          setCopy(true);
        },
        function () {
          setCopy(false);
        }
      );
    }
  };

  const md = (e) => {
    e.currentTarget.classList.add('down');
  };

  const mu = (e) => {
    e.currentTarget.classList.remove('down');
  };

  useEffect(() => {
    if (copy) {
      if (copyTimer) {
        clearTimeout(copyTimer);
      }

      copyTimer = setTimeout(() => {
        setCopy(false);
      }, 3500);
    }
    return () => {
      clearTimeout(copyTimer);
    };
  }, [copy]);

  useEffect(() => {
    document.addEventListener('keydown', (e) => {
      e.preventDefault();

      setKeyPressed(true);

      setCode(e.code);
      setKey(e.key);
      setWhich(e.which);

      setAltKey(e.altKey || e.code === 'AltRight');
      setShiftKey(e.shiftKey);
      setCtrlKey(e.ctrlKey);
    });

    document.addEventListener('keyup', (e) => {
      e.preventDefault();

      setAltKey(false);
      setShiftKey(false);
      setCtrlKey(false);
    });
  }, []);

  return (
    <div className="app">
      <div className="keys__wrapper">
        <div
          className={`key ${keyPressed ? 'key-copy' : ''}`}
          onClick={(e) => keyClick(e, 'code')}
          onMouseDown={(e) => md(e)}
          onMouseUp={(e) => mu(e)}
        >
          <span className="key__label">e.code</span>
          {code}
        </div>
        <div className="keys__block">
          <div
            className={`key ${keyPressed ? 'key-copy' : ''}`}
            onClick={(e) => keyClick(e, 'key')}
            onMouseDown={(e) => md(e)}
            onMouseUp={(e) => mu(e)}
          >
            <span className="key__label">e.key</span>
            {key}
          </div>
          <div
            className={`key ${keyPressed ? 'key-copy' : ''}`}
            onClick={(e) => keyClick(e, 'which')}
            onMouseDown={(e) => md(e)}
            onMouseUp={(e) => mu(e)}
          >
            <span className="key__label">e.which</span>
            {which}
          </div>
        </div>
        <div className="keys__block keys__funcs">
          <div className={`key ${shiftKey ? 'on' : ''}`}>Shift</div>
          <div className={`key ${ctrlKey ? 'on' : ''}`}>Ctrl</div>
          <div className={`key ${altKey ? 'on' : ''}`}>Alt</div>
        </div>
      </div>
      <div className={`notice ${copy ? 'on' : ''}`}>Text copied to clipboard!</div>
      <div className={`notice ${!keyPressed ? 'on' : ''}`}>Press any key</div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('app'));

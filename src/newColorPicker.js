const ColorPicker = function ColorPicker(defaultColor = 'rgba(255, 0, 0, 1)') {
  let obj = {};
  let onchange;
  let panel = createColorPicker();
  console.log(panel);
  let doc = document.createElement('div');
  doc.style.cssText = `width: 50px;height: 20px`;
  doc.style.backgroundColor = defaultColor;
  doc.addEventListener('mousedown', function (e) {
    e.stopPropagation();
    panel.onchange = function (color) {
      doc.style.backgroundColor = color;
      onchange && onchange.call(obj, color);
    };
    panel.getElement().style.cssText = `position: fixed; z-index: 1000000; top: ${doc.getBoundingClientRect().bottom}px; left: ${doc.getBoundingClientRect().left}px`;
    document.body.appendChild(panel.getElement());
    document.addEventListener('mousedown', function (e) {
      panel.remove();
      document.removeEventListener('mousedown', arguments.callee);
    });
  });

  function setColor(color) {

  }

  function getElement() {
    return doc;
  }

  function remove() {
    doc.remove();
  }

  Object.defineProperties(obj, {
    getElement: {
      value: getElement,
      writable: false,
      configurable: false,
      enumerable: true
    },
    remove: {
      value: remove,
      writable: false,
      configurable: false,
      enumerable: true
    },
    onchange: {
      get () {
        return onchange;
      },
      set (value) {
        onchange = value;
      }
    }
  })
  return obj;
};

const getSingle = function (fn) {
  let res;
  let self = this;
  return function () {
    if (res) {
      return res;
    } else {
      return res = fn.apply(self, arguments);
    }
  }
};


const createColorPicker = getSingle(function createColorPicker() {
  let obj = {};
  let hsva, rgba;
  let onchange;
  const config = {
    width: 280,
    height: 180,
    barWidth: 12
  };
  let colorPicker = getNewDocument('div', ['cp-colorPicker']);
  let
    colorPickerPanel = getNewDocument('div', ['cp-colorPickerPanel'], {}),
    colorSvPanel = getNewDocument('div', ['cp-colorSvPanel']),
    svPanel = getNewDocument('div', ['cp-svPanel'], {
      style: {
        width: `${config.width}px`,
        height: `${config.height}px`,
        'background-color': `rgb(255, 0, 0)`
      }
    }),
    svPanelWhite = getNewDocument('div', ['cp-svPanelWhite'], {
      style: {
        'width': `${config.width}px`,
        'height': `${config.height}px`,
        'background': 'linear-gradient(90deg,#fff,hsva(0,0%,100%,0))'
      }
    }),
    svPanelBlack = getNewDocument('div', ['cp-svPanelBlack'], {
      style: {
        'width': `${config.width}px`,
        'height': `${config.height}px`,
        'background': 'linear-gradient(0deg,#000,transparent)'
      }
    }),
    svPanelCursor = getNewDocument('div', ['cp-svPanelCursor'], {
      style: {
        top: 0,
        left: `${config.width}px`
      }
    }),
    hueSlider = getNewDocument('div', ['cp-hueSlider'], {
      style: {
        'width': `${config.barWidth}px`,
        'height': `${config.height}px`,
        // 'background': 'linear-gradient(0deg,#000,transparent)'
      }
    }),
    hueBar = getNewDocument('div', ['cp-hueBar'], {}),
    hueThumb = getNewDocument('div', ['cp-hueBarThumb'], {}),
    opacitySlider = getNewDocument('div', ['cp-opacitySlider'], {
      style: {
        'width': `${config.width}px`,
        'height': `${config.barWidth}px`,
      }
    }),
    opacityBar = getNewDocument('div', ['cp-opacityBar'], {
      style: {
        'background': `linear-gradient(to left, rgba(19, 206, 102, 0) 0%, rgb(255, 0, 0) 100%)`
      }
    }),
    opacityThumb = getNewDocument('div', ['cp-opacityThumb']),
    dropDownBtns = getNewDocument('div', ['cp-dropDownBtns']),
    colorInfo = getNewDocument('input', ['cp-colorInfo'], {
      value: rgba,
      setAttribute: {readonly: true}
    }),
    confirmButton = getNewDocument('button', ['cp-confirmBtn'], {
      innerText: '确定'
    });
  appendChildren(hueSlider, hueBar, hueThumb);
  appendChildren(opacitySlider, opacityBar, opacityThumb);
  appendChildren(dropDownBtns, colorInfo, confirmButton);
  appendChildren(svPanel, svPanelWhite, svPanelBlack, svPanelCursor);
  appendChildren(colorSvPanel, svPanel, hueSlider);
  appendChildren(colorPickerPanel, colorSvPanel, opacitySlider, dropDownBtns);
  appendChildren(colorPicker, colorPickerPanel);


  confirmButton.addEventListener('mousedown', function (e) {
    e.preventDefault();
    e.stopPropagation();
    colorPicker.remove();
  });

  hueSlider.addEventListener('mousedown', function(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    if (ev.target !== hueThumb) {
      hueThumb.style.top = ev.offsetY + 'px';
    }
    let initPos = hueThumb.offsetTop;
    colorChange();
    let move = function (e) {
      let pos = initPos + e.clientY - ev.clientY;
      if (pos <= 0) {
        pos = 0;
      } else if (pos >= config.height) {
        pos = config.height;
      }
      hueThumb.style.top = pos + 'px';
      colorChange();
    };
    let up = function (e) {
      e.stopPropagation();
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);
    };
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
  });

  opacitySlider.addEventListener('mousedown', function (ev) {
    ev.preventDefault();
    ev.stopPropagation();
    if (ev.target !== opacityThumb) {
      opacityThumb.style.left = ev.offsetX + 'px';
    }
    let initPos = opacityThumb.offsetLeft;
    colorChange();
    let move = function (e) {
      e.preventDefault();
      e.stopPropagation();
      let pos = initPos + e.clientX - ev.clientX;
      if (pos <= 0) {
        pos = 0;
      } else if (pos >= config.width) {
        pos = config.width;
      }
      opacityThumb.style.left = pos + 'px';
      colorChange();
    };
    let up = function (e) {
      e.stopPropagation();
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);
    };
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
  });

  svPanel.addEventListener('mousedown', function(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    console.log(ev.offsetX, ev.offsetY);
    if (ev.target !== svPanelCursor) {
      svPanelCursor.style.left = ev.offsetX + 'px';
      svPanelCursor.style.top = ev.offsetY + 'px';
    }
    let initPosX = svPanelCursor.offsetLeft;
    let initPosY = svPanelCursor.offsetTop;
    colorChange();
    let move = function (e) {
      let x = initPosX + e.clientX - ev.clientX;
      let y = initPosY + e.clientY - ev.clientY;
      if (x <= 0) {
        x = 0;
      } else if (x >= config.width) {
        x = config.width;
      }

      if (y <= 0) {
        y = 0;
      } else if (y >= config.height) {
        y = config.height;
      }
      svPanelCursor.style.left = x + 'px';
      svPanelCursor.style.top = y + 'px';
      colorChange();
    };
    let up =  function (e) {
      e.stopPropagation();
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);
    };
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
  });

  // 监听颜色改变事件
  function colorChange() {
    let hue = Math.round(hueThumb.offsetTop / config.height * 360);
    let opacity = Math.round((1 - opacityThumb.offsetLeft / config.width) * 100) / 100;
    let saturation = Math.round(svPanelCursor.offsetLeft / config.width * 100);
    let brightness = Math.round((1 - svPanelCursor.offsetTop / config.height) * 100) / 100;
    let lightness = Math.round(0.5 * brightness * (2 - saturation / 100) * 100);
    let r, g, b;
    [r, g, b] = HSVA2RGBA(hue, saturation / 100, brightness);
    [r, g, b] = [Math.round(r), Math.round(g), Math.round(b)];
    // 改变svPanel显示的颜色
    svPanel.style.backgroundColor = `hsl(${hue}, 100%, 50%)`;
    // 改变透明度选择条的颜色
    opacityBar.style.background = `linear-gradient(to left, rgba(19, 206, 102, 0) 0%, hsl(${hue}, 100%, 50%) 100%)`;
    hsva = `hsva(${hue}, ${saturation}%, ${lightness}%, ${opacity})`;
    rgba = `rgba(${r}, ${g}, ${b}, ${opacity})`;
    colorInfo.value = hsva;
    onchange && onchange.call(obj, rgba);
  }

  function getElement () {
    return colorPicker;
  }

  function remove() {
    colorPicker.remove();
  }
  Object.defineProperties(obj, {
    hsv: {
      get () {
        return hsva;
      },
      set (value) {
        hsva = value;
      }
    },
    rgba: {
      get () {
        return rgba;
      },
      set (value) {
        rgba = value;

      }
    },
    getElement: {
      value: getElement,
      writable: false,
      configurable: false,
      enumerable: true
    },
    remove: {
      value: remove,
      writable: false,
      configurable: false,
      enumerable: true
    },
    onchange: {
      get () {
        return onchange;
      },
      set (value) {
        if (Object.prototype.toString.call(value) === '[object Function]') {
          onchange = value;
        }
      }
    }
  });
  return obj;
});


let getNewDocument = function (tagName, classList, attributesObject, xmlNS) {
  if (!tagName) throw new Error('no TagName');
  let doc = !xmlNS && document.createElement(tagName) || document.createElementNS(xmlNS, tagName);
  if (classList)
    if (typeof classList === 'string')
      doc.classList.add(classList);
    else
      doc.classList.add(...classList);
  if (attributesObject)
    for (let key in attributesObject) {
      if (attributesObject.hasOwnProperty(key)) {
        let type = Object.prototype.toString.call(attributesObject[key]);
        if (type === '[object Object]') {
          for (let i in attributesObject[key]) {
            if (attributesObject[key].hasOwnProperty(i)) {
              if (key === 'setAttribute') {
                doc[key](i, attributesObject[key][i]);
              } else {
                doc[key][i] = attributesObject[key][i];
              }
            }
          }
        } else {
          doc[key] = attributesObject[key];
        }
      }
    }
  return doc;
};

let appendChildren = function (father, ...children) {
  if (!father) {
    throw new Error('no father element');
  } else {
    for (let child of children) {
      father.appendChild(child);
    }
  }
}

//获取元素的纵坐标（相对于窗口）

function HSVA2RGBA(h, s, v, a) {
  let c = v * s,
    x = c * (1 - Math.abs((h / 60) % 2 - 1)),
    m = v - c;
  let _r, _g, _b, r, g, b;
  switch (true) {
    case (h >= 0 && h <= 60):
      [_r, _g, _b] = [c, x, 0];
      break;
    case (h >= 60 && h <= 120):
      [_r, _g, _b] = [x, c, 0];
      break;
    case (h >= 120 && h <= 180):
      [_r, _g, _b] = [0, c, x];
      break;
    case (h >= 180 && h <= 240):
      [_r, _g, _b] = [0, x, c];
      break;
    case (h >= 240 && h <= 300):
      [_r, _g, _b] = [x, 0, c];
      break;
    case (h >= 300 && h <= 360):
      [_r, _g, _b] = [c, 0, x];
      break;
  }
  [r, g, b] = [(_r + m) * 255, (_g + m) * 255, (_b + m) * 255];
  return [r, g, b, a];
}

function RGBA2HSVA (r, g, b, a, type = 'hsv') {
  let h, s, v, l;
  let max = Math.max(r, g, b);
  let min = Math.min(r, g, b);
  if (max === min) {
    h = 0;
  } else if (max === r && g >= b) {
    h = 60 * ((g - b) / (max - min)) + 0;
  } else if (max === r && g < b) {
    h = 60 * ((g - b) / (max - min)) + 360;
  } else if (max === g) {
    h = 60 * ((b - r) / (max - min)) + 120;
  } else if (max === b) {
    h = 60 * ((r - g) / (max - min)) + 240;
  }
  if (type === 'hsv') {
    v = max;
    if (max === 0) {
      s = 0;
    } else {
      s = 1 - min / max;
    }
    return [h, s, v, a];
  } else {
    l = 0.5 * (max + min);
    if (l === 0 || max === min) {
      s = 0;
    } else if (l >= 0 && l <= 0.5) {
      s = (max - min) / (2 * l);
    } else if (l > 0.5) {
      s = (max - min) / (2 - 2 * l);
    }
    return [h, s, l, a];
  }
}
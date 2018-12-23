const
  OPEN = 1,
  CLOSE = 0;

class OldColorPicker {
  constructor(node, config) {
    this.root = node;
    this.status = CLOSE;
    if (config) {
      this.config = {
        width: config.width || 280,
        height: config.height || 180,
        barWidth: 12
      };
    } else {
      this.config = {
        width: 280,
        height: 180,
        barWidth: 12
      };
    }

    this.hsla = 'hsla(0,100%, 50%, 1)';
    this.rgba = 'rgba(255, 0, 0, 1)';
    this.dep = null;
    this.init();
  }

  init() {
    let vm = this;
    let colorPicker = getNewDocument('div', ['cp-colorPicker']);
    let thumbnail = getNewDocument('div', ['cp-thumbnail']),
      displayColor = getNewDocument('div', ['cp-displayColor'], {
        style: {
          background: this.hsla
        }
      });
    let
      colorPickerPanel = getNewDocument('div', ['cp-colorPickerPanel'], {
        style: {
          display: 'none'
        }
      }),
      colorSvPanel = getNewDocument('div', ['cp-colorSvPanel']),
      svPanel = getNewDocument('div', ['cp-svPanel'], {
        style: {
          width: `${this.config.width}px`,
          height: `${this.config.height}px`,
          'background-color': `rgb(255, 0, 0)`
        }
      }),
      svPanelWhite = getNewDocument('div', ['cp-svPanelWhite'], {
        style: {
          'width': `${this.config.width}px`,
          'height': `${this.config.height}px`,
          'background': 'linear-gradient(90deg,#fff,hsla(0,0%,100%,0))'
        }
      }),
      svPanelBlack = getNewDocument('div', ['cp-svPanelBlack'], {
        style: {
          'width': `${this.config.width}px`,
          'height': `${this.config.height}px`,
          'background': 'linear-gradient(0deg,#000,transparent)'
        }
      }),
      svPanelCursor = getNewDocument('div', ['cp-svPanelCursor'], {
        style: {
          top: 0,
          left: `${this.config.width}px`
        }
      }),
      hueSlider = getNewDocument('div', ['cp-hueSlider'], {
        style: {
          'width': `${this.config.barWidth}px`,
          'height': `${this.config.height}px`,
          // 'background': 'linear-gradient(0deg,#000,transparent)'
        }
      }),
      hueBar = getNewDocument('div', ['cp-hueBar'], {}),
      hueThumb = getNewDocument('div', ['cp-hueBarThumb'], {}),
      opacitySlider = getNewDocument('div', ['cp-opacitySlider'], {
        style: {
          'width': `${this.config.width}px`,
          'height': `${this.config.barWidth}px`,
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
        value: this.rgba,
        setAttribute: {readonly: true}
      }),
      confirmButton = getNewDocument('button', ['cp-confirmBtn'], {
        innerText: '确定'
      });
    appendChildren(thumbnail, displayColor);
    appendChildren(hueSlider, hueBar, hueThumb);
    appendChildren(opacitySlider, opacityBar, opacityThumb);
    appendChildren(dropDownBtns, colorInfo, confirmButton);
    appendChildren(svPanel, svPanelWhite, svPanelBlack, svPanelCursor);
    appendChildren(colorSvPanel, svPanel, hueSlider);
    appendChildren(colorPickerPanel, colorSvPanel, opacitySlider, dropDownBtns);
    appendChildren(colorPicker, thumbnail, colorPickerPanel);
    this.root.appendChild(colorPicker);

    // let COLOR_CHANGE = new CustomEvent('colorchange', {detail: this.hsla});
    confirmButton.onmousedown = function(e) {
      e.preventDefault();
      e.stopPropagation();
      closePanel();
    }

    hueSlider.onmousedown = function (ev) {
      ev.preventDefault();
      ev.stopPropagation();
      if (ev.target !== hueThumb) {
        hueThumb.style.top = ev.offsetY + 'px';
      }
      let initPos = hueThumb.offsetTop;
      // document.dispatchEvent(COLOR_CHANGE);
      colorChange();
      document.onmousemove = function (e) {
        let pos = initPos + e.clientY - ev.clientY;
        if (pos <= 0) {
          pos = 0;
        } else if (pos >= vm.config.height) {
          pos = vm.config.height;
        }
        hueThumb.style.top = pos + 'px';
        // document.dispatchEvent(COLOR_CHANGE);
        colorChange();
      };
      document.onmouseup = function (e) {
        document.onmousemove = null;
        document.onmouseup = null;
      }
    };

    opacitySlider.onmousedown = function (ev) {
      ev.preventDefault();
      ev.stopPropagation();
      if (ev.target !== opacityThumb) {
        opacityThumb.style.left = ev.offsetX + 'px';
      }
      let initPos = opacityThumb.offsetLeft;
      // document.dispatchEvent(COLOR_CHANGE);
      colorChange();
      document.onmousemove = function (e) {
        e.preventDefault();
        e.stopPropagation();
        let pos = initPos + e.clientX - ev.clientX;
        if (pos <= 0) {
          pos = 0;
        } else if (pos >= vm.config.width) {
          pos = vm.config.width;
        }
        opacityThumb.style.left = pos + 'px';
        colorChange();
      };
      document.onmouseup = function (e) {
        document.onmousemove = null;
        document.onmouseup = null;
      }
    };

    svPanel.onmousedown = function (ev) {
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
      document.onmousemove = function (e) {
        let x = initPosX + e.clientX - ev.clientX;
        let y = initPosY + e.clientY - ev.clientY;
        if (x <= 0) {
          x = 0;
        } else if (x >= vm.config.width) {
          x = vm.config.width;
        }

        if (y <= 0) {
          y = 0;
        } else if (y >= vm.config.height) {
          y = vm.config.height;
        }
        svPanelCursor.style.left = x + 'px';
        svPanelCursor.style.top = y + 'px';
        colorChange();
      };
      document.onmouseup = function (e) {
        document.onmousemove = null;
        document.onmouseup = null;
      }
    };
    // toggle svPanel
    function closePanel() {
      colorPickerPanel.style.display = 'none';
      vm.status = CLOSE;
    }
    thumbnail.addEventListener('mousedown', function(e) {
      e.preventDefault();
      e.stopPropagation();
      if (vm.status) {
        closePanel();
      } else {
        colorPickerPanel.style.display = 'block';
        let left = getLeft(colorPickerPanel);
        let top = getTop(colorPickerPanel);
        let windowWidth = window.innerWidth,
          windowHeight = window.innerHeight;
        let cpWidth = colorPickerPanel.offsetWidth,
          cpHeight = colorPickerPanel.offsetHeight;
        if (left > windowWidth - cpWidth) {
          colorPickerPanel.style.transform = `translateX(-${cpWidth - windowWidth + left}px)`;
        }
        if (top > windowHeight - cpHeight) {
          colorPickerPanel.style.bottom = thumbnail.offsetHeight + 'px';
        }
        vm.status = OPEN;
      }
    });

    document.addEventListener('mousedown', function (e) {
      closePanel();
    });
    // 监听颜色改变事件
    function colorChange () {
      let hue = Math.round(hueThumb.offsetTop / vm.config.height * 360);
      let opacity = Math.round((1 - opacityThumb.offsetLeft / config.width * 1) * 100) / 100;
      let saturation = Math.round(svPanelCursor.offsetLeft / vm.config.width * 100);
      let brightness = Math.round((1 - svPanelCursor.offsetTop / vm.config.height) * 100) / 100;
      let lightness = Math.round(0.5 * brightness * (2 - saturation / 100) * 100);
      let r, g, b;
      [r, g, b] = HSVA2RGBA(hue, saturation / 100, brightness);
      [r, g, b] = [Math.round(r), Math.round(g), Math.round(b)];
      // 改变svPanel显示的颜色
      svPanel.style.backgroundColor = `hsl(${hue}, 100%, 50%)`;
      // 改变透明度选择条的颜色
      opacityBar.style.background = `linear-gradient(to left, rgba(19, 206, 102, 0) 0%, hsl(${hue}, 100%, 50%) 100%)`;
      vm.hsla = `hsla(${hue}, ${saturation}%, ${lightness}%, ${opacity})`;
      vm.rgba = `rgba(${r}, ${g}, ${b}, ${opacity})`;
      displayColor.style.background = vm.hsla;
      colorInfo.value = vm.rgba;
      let COLOR_CHANGE = new CustomEvent('change', {detail: vm.rgba});
      // 抛出值
      vm.root.dispatchEvent(COLOR_CHANGE);

      if (typeof vm.dep === 'function') {
        vm.dep(vm.rgba);
      }
    }
  }
  register(callback) {
    this.dep = callback;
  }
}

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
      let type = Object.prototype.toString.call(attributesObject[key]);
      if (type === '[object Object]') {
        for (let i in attributesObject[key]) {
          if (key === 'setAttribute') {
            doc[key](i, attributesObject[key][i]);
          } else {
            doc[key][i] = attributesObject[key][i];
          }
        }
      } else {
        doc[key] = attributesObject[key];
      }
    }

  return doc;
}

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
function getTop(e) {
  var offset = e.offsetTop;
  if(e.offsetParent != null) offset += getTop(e.offsetParent);
  return offset;
}

function getLeft(e) {
  var offset = e.offsetLeft;
  if(e.offsetParent != null) offset += getLeft(e.offsetParent);
  return offset;
}

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


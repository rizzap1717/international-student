/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@popperjs/core/lib/createPopper.js":
/*!*********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/createPopper.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createPopper: () => (/* binding */ createPopper),
/* harmony export */   detectOverflow: () => (/* reexport safe */ _utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_8__["default"]),
/* harmony export */   popperGenerator: () => (/* binding */ popperGenerator)
/* harmony export */ });
/* harmony import */ var _dom_utils_getCompositeRect_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./dom-utils/getCompositeRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getCompositeRect.js");
/* harmony import */ var _dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./dom-utils/getLayoutRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js");
/* harmony import */ var _dom_utils_listScrollParents_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dom-utils/listScrollParents.js */ "./node_modules/@popperjs/core/lib/dom-utils/listScrollParents.js");
/* harmony import */ var _dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./dom-utils/getOffsetParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js");
/* harmony import */ var _utils_orderModifiers_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/orderModifiers.js */ "./node_modules/@popperjs/core/lib/utils/orderModifiers.js");
/* harmony import */ var _utils_debounce_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./utils/debounce.js */ "./node_modules/@popperjs/core/lib/utils/debounce.js");
/* harmony import */ var _utils_mergeByName_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils/mergeByName.js */ "./node_modules/@popperjs/core/lib/utils/mergeByName.js");
/* harmony import */ var _utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./utils/detectOverflow.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dom-utils/instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");









var DEFAULT_OPTIONS = {
  placement: 'bottom',
  modifiers: [],
  strategy: 'absolute'
};

function areValidElements() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return !args.some(function (element) {
    return !(element && typeof element.getBoundingClientRect === 'function');
  });
}

function popperGenerator(generatorOptions) {
  if (generatorOptions === void 0) {
    generatorOptions = {};
  }

  var _generatorOptions = generatorOptions,
      _generatorOptions$def = _generatorOptions.defaultModifiers,
      defaultModifiers = _generatorOptions$def === void 0 ? [] : _generatorOptions$def,
      _generatorOptions$def2 = _generatorOptions.defaultOptions,
      defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
  return function createPopper(reference, popper, options) {
    if (options === void 0) {
      options = defaultOptions;
    }

    var state = {
      placement: 'bottom',
      orderedModifiers: [],
      options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
      modifiersData: {},
      elements: {
        reference: reference,
        popper: popper
      },
      attributes: {},
      styles: {}
    };
    var effectCleanupFns = [];
    var isDestroyed = false;
    var instance = {
      state: state,
      setOptions: function setOptions(setOptionsAction) {
        var options = typeof setOptionsAction === 'function' ? setOptionsAction(state.options) : setOptionsAction;
        cleanupModifierEffects();
        state.options = Object.assign({}, defaultOptions, state.options, options);
        state.scrollParents = {
          reference: (0,_dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isElement)(reference) ? (0,_dom_utils_listScrollParents_js__WEBPACK_IMPORTED_MODULE_1__["default"])(reference) : reference.contextElement ? (0,_dom_utils_listScrollParents_js__WEBPACK_IMPORTED_MODULE_1__["default"])(reference.contextElement) : [],
          popper: (0,_dom_utils_listScrollParents_js__WEBPACK_IMPORTED_MODULE_1__["default"])(popper)
        }; // Orders the modifiers based on their dependencies and `phase`
        // properties

        var orderedModifiers = (0,_utils_orderModifiers_js__WEBPACK_IMPORTED_MODULE_2__["default"])((0,_utils_mergeByName_js__WEBPACK_IMPORTED_MODULE_3__["default"])([].concat(defaultModifiers, state.options.modifiers))); // Strip out disabled modifiers

        state.orderedModifiers = orderedModifiers.filter(function (m) {
          return m.enabled;
        });
        runModifierEffects();
        return instance.update();
      },
      // Sync update – it will always be executed, even if not necessary. This
      // is useful for low frequency updates where sync behavior simplifies the
      // logic.
      // For high frequency updates (e.g. `resize` and `scroll` events), always
      // prefer the async Popper#update method
      forceUpdate: function forceUpdate() {
        if (isDestroyed) {
          return;
        }

        var _state$elements = state.elements,
            reference = _state$elements.reference,
            popper = _state$elements.popper; // Don't proceed if `reference` or `popper` are not valid elements
        // anymore

        if (!areValidElements(reference, popper)) {
          return;
        } // Store the reference and popper rects to be read by modifiers


        state.rects = {
          reference: (0,_dom_utils_getCompositeRect_js__WEBPACK_IMPORTED_MODULE_4__["default"])(reference, (0,_dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_5__["default"])(popper), state.options.strategy === 'fixed'),
          popper: (0,_dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_6__["default"])(popper)
        }; // Modifiers have the ability to reset the current update cycle. The
        // most common use case for this is the `flip` modifier changing the
        // placement, which then needs to re-run all the modifiers, because the
        // logic was previously ran for the previous placement and is therefore
        // stale/incorrect

        state.reset = false;
        state.placement = state.options.placement; // On each update cycle, the `modifiersData` property for each modifier
        // is filled with the initial data specified by the modifier. This means
        // it doesn't persist and is fresh on each update.
        // To ensure persistent data, use `${name}#persistent`

        state.orderedModifiers.forEach(function (modifier) {
          return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
        });

        for (var index = 0; index < state.orderedModifiers.length; index++) {
          if (state.reset === true) {
            state.reset = false;
            index = -1;
            continue;
          }

          var _state$orderedModifie = state.orderedModifiers[index],
              fn = _state$orderedModifie.fn,
              _state$orderedModifie2 = _state$orderedModifie.options,
              _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2,
              name = _state$orderedModifie.name;

          if (typeof fn === 'function') {
            state = fn({
              state: state,
              options: _options,
              name: name,
              instance: instance
            }) || state;
          }
        }
      },
      // Async and optimistically optimized update – it will not be executed if
      // not necessary (debounced to run at most once-per-tick)
      update: (0,_utils_debounce_js__WEBPACK_IMPORTED_MODULE_7__["default"])(function () {
        return new Promise(function (resolve) {
          instance.forceUpdate();
          resolve(state);
        });
      }),
      destroy: function destroy() {
        cleanupModifierEffects();
        isDestroyed = true;
      }
    };

    if (!areValidElements(reference, popper)) {
      return instance;
    }

    instance.setOptions(options).then(function (state) {
      if (!isDestroyed && options.onFirstUpdate) {
        options.onFirstUpdate(state);
      }
    }); // Modifiers have the ability to execute arbitrary code before the first
    // update cycle runs. They will be executed in the same order as the update
    // cycle. This is useful when a modifier adds some persistent data that
    // other modifiers need to use, but the modifier is run after the dependent
    // one.

    function runModifierEffects() {
      state.orderedModifiers.forEach(function (_ref) {
        var name = _ref.name,
            _ref$options = _ref.options,
            options = _ref$options === void 0 ? {} : _ref$options,
            effect = _ref.effect;

        if (typeof effect === 'function') {
          var cleanupFn = effect({
            state: state,
            name: name,
            instance: instance,
            options: options
          });

          var noopFn = function noopFn() {};

          effectCleanupFns.push(cleanupFn || noopFn);
        }
      });
    }

    function cleanupModifierEffects() {
      effectCleanupFns.forEach(function (fn) {
        return fn();
      });
      effectCleanupFns = [];
    }

    return instance;
  };
}
var createPopper = /*#__PURE__*/popperGenerator(); // eslint-disable-next-line import/no-unused-modules



/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/contains.js":
/*!***************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/contains.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ contains)
/* harmony export */ });
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");

function contains(parent, child) {
  var rootNode = child.getRootNode && child.getRootNode(); // First, attempt with faster native method

  if (parent.contains(child)) {
    return true;
  } // then fallback to custom implementation with Shadow DOM support
  else if (rootNode && (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isShadowRoot)(rootNode)) {
      var next = child;

      do {
        if (next && parent.isSameNode(next)) {
          return true;
        } // $FlowFixMe[prop-missing]: need a better way to handle this...


        next = next.parentNode || next.host;
      } while (next);
    } // Give up, the result is false


  return false;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getBoundingClientRect)
/* harmony export */ });
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
/* harmony import */ var _isLayoutViewport_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./isLayoutViewport.js */ "./node_modules/@popperjs/core/lib/dom-utils/isLayoutViewport.js");




function getBoundingClientRect(element, includeScale, isFixedStrategy) {
  if (includeScale === void 0) {
    includeScale = false;
  }

  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }

  var clientRect = element.getBoundingClientRect();
  var scaleX = 1;
  var scaleY = 1;

  if (includeScale && (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element)) {
    scaleX = element.offsetWidth > 0 ? (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_1__.round)(clientRect.width) / element.offsetWidth || 1 : 1;
    scaleY = element.offsetHeight > 0 ? (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_1__.round)(clientRect.height) / element.offsetHeight || 1 : 1;
  }

  var _ref = (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isElement)(element) ? (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_2__["default"])(element) : window,
      visualViewport = _ref.visualViewport;

  var addVisualOffsets = !(0,_isLayoutViewport_js__WEBPACK_IMPORTED_MODULE_3__["default"])() && isFixedStrategy;
  var x = (clientRect.left + (addVisualOffsets && visualViewport ? visualViewport.offsetLeft : 0)) / scaleX;
  var y = (clientRect.top + (addVisualOffsets && visualViewport ? visualViewport.offsetTop : 0)) / scaleY;
  var width = clientRect.width / scaleX;
  var height = clientRect.height / scaleY;
  return {
    width: width,
    height: height,
    top: y,
    right: x + width,
    bottom: y + height,
    left: x,
    x: x,
    y: y
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getClippingRect.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getClippingRect.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getClippingRect)
/* harmony export */ });
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _getViewportRect_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getViewportRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getViewportRect.js");
/* harmony import */ var _getDocumentRect_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./getDocumentRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentRect.js");
/* harmony import */ var _listScrollParents_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./listScrollParents.js */ "./node_modules/@popperjs/core/lib/dom-utils/listScrollParents.js");
/* harmony import */ var _getOffsetParent_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./getOffsetParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js");
/* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _getComputedStyle_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./getComputedStyle.js */ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js");
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getBoundingClientRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js");
/* harmony import */ var _getParentNode_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./getParentNode.js */ "./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js");
/* harmony import */ var _contains_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./contains.js */ "./node_modules/@popperjs/core/lib/dom-utils/contains.js");
/* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
/* harmony import */ var _utils_rectToClientRect_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/rectToClientRect.js */ "./node_modules/@popperjs/core/lib/utils/rectToClientRect.js");
/* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");















function getInnerBoundingClientRect(element, strategy) {
  var rect = (0,_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element, false, strategy === 'fixed');
  rect.top = rect.top + element.clientTop;
  rect.left = rect.left + element.clientLeft;
  rect.bottom = rect.top + element.clientHeight;
  rect.right = rect.left + element.clientWidth;
  rect.width = element.clientWidth;
  rect.height = element.clientHeight;
  rect.x = rect.left;
  rect.y = rect.top;
  return rect;
}

function getClientRectFromMixedType(element, clippingParent, strategy) {
  return clippingParent === _enums_js__WEBPACK_IMPORTED_MODULE_1__.viewport ? (0,_utils_rectToClientRect_js__WEBPACK_IMPORTED_MODULE_2__["default"])((0,_getViewportRect_js__WEBPACK_IMPORTED_MODULE_3__["default"])(element, strategy)) : (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_4__.isElement)(clippingParent) ? getInnerBoundingClientRect(clippingParent, strategy) : (0,_utils_rectToClientRect_js__WEBPACK_IMPORTED_MODULE_2__["default"])((0,_getDocumentRect_js__WEBPACK_IMPORTED_MODULE_5__["default"])((0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_6__["default"])(element)));
} // A "clipping parent" is an overflowable container with the characteristic of
// clipping (or hiding) overflowing elements with a position different from
// `initial`


function getClippingParents(element) {
  var clippingParents = (0,_listScrollParents_js__WEBPACK_IMPORTED_MODULE_7__["default"])((0,_getParentNode_js__WEBPACK_IMPORTED_MODULE_8__["default"])(element));
  var canEscapeClipping = ['absolute', 'fixed'].indexOf((0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_9__["default"])(element).position) >= 0;
  var clipperElement = canEscapeClipping && (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_4__.isHTMLElement)(element) ? (0,_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_10__["default"])(element) : element;

  if (!(0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_4__.isElement)(clipperElement)) {
    return [];
  } // $FlowFixMe[incompatible-return]: https://github.com/facebook/flow/issues/1414


  return clippingParents.filter(function (clippingParent) {
    return (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_4__.isElement)(clippingParent) && (0,_contains_js__WEBPACK_IMPORTED_MODULE_11__["default"])(clippingParent, clipperElement) && (0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_12__["default"])(clippingParent) !== 'body';
  });
} // Gets the maximum area that the element is visible in due to any number of
// clipping parents


function getClippingRect(element, boundary, rootBoundary, strategy) {
  var mainClippingParents = boundary === 'clippingParents' ? getClippingParents(element) : [].concat(boundary);
  var clippingParents = [].concat(mainClippingParents, [rootBoundary]);
  var firstClippingParent = clippingParents[0];
  var clippingRect = clippingParents.reduce(function (accRect, clippingParent) {
    var rect = getClientRectFromMixedType(element, clippingParent, strategy);
    accRect.top = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_13__.max)(rect.top, accRect.top);
    accRect.right = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_13__.min)(rect.right, accRect.right);
    accRect.bottom = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_13__.min)(rect.bottom, accRect.bottom);
    accRect.left = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_13__.max)(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromMixedType(element, firstClippingParent, strategy));
  clippingRect.width = clippingRect.right - clippingRect.left;
  clippingRect.height = clippingRect.bottom - clippingRect.top;
  clippingRect.x = clippingRect.left;
  clippingRect.y = clippingRect.top;
  return clippingRect;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getCompositeRect.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getCompositeRect.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getCompositeRect)
/* harmony export */ });
/* harmony import */ var _getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getBoundingClientRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js");
/* harmony import */ var _getNodeScroll_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./getNodeScroll.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeScroll.js");
/* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./getWindowScrollBarX.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js");
/* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _isScrollParent_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./isScrollParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js");
/* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");









function isElementScaled(element) {
  var rect = element.getBoundingClientRect();
  var scaleX = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_0__.round)(rect.width) / element.offsetWidth || 1;
  var scaleY = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_0__.round)(rect.height) / element.offsetHeight || 1;
  return scaleX !== 1 || scaleY !== 1;
} // Returns the composite rect of an element relative to its offsetParent.
// Composite means it takes into account transforms as well as layout.


function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
  if (isFixed === void 0) {
    isFixed = false;
  }

  var isOffsetParentAnElement = (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_1__.isHTMLElement)(offsetParent);
  var offsetParentIsScaled = (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_1__.isHTMLElement)(offsetParent) && isElementScaled(offsetParent);
  var documentElement = (0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(offsetParent);
  var rect = (0,_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_3__["default"])(elementOrVirtualElement, offsetParentIsScaled, isFixed);
  var scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  var offsets = {
    x: 0,
    y: 0
  };

  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if ((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_4__["default"])(offsetParent) !== 'body' || // https://github.com/popperjs/popper-core/issues/1078
    (0,_isScrollParent_js__WEBPACK_IMPORTED_MODULE_5__["default"])(documentElement)) {
      scroll = (0,_getNodeScroll_js__WEBPACK_IMPORTED_MODULE_6__["default"])(offsetParent);
    }

    if ((0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_1__.isHTMLElement)(offsetParent)) {
      offsets = (0,_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_3__["default"])(offsetParent, true);
      offsets.x += offsetParent.clientLeft;
      offsets.y += offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = (0,_getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_7__["default"])(documentElement);
    }
  }

  return {
    x: rect.left + scroll.scrollLeft - offsets.x,
    y: rect.top + scroll.scrollTop - offsets.y,
    width: rect.width,
    height: rect.height
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getComputedStyle)
/* harmony export */ });
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");

function getComputedStyle(element) {
  return (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element).getComputedStyle(element);
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getDocumentElement)
/* harmony export */ });
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");

function getDocumentElement(element) {
  // $FlowFixMe[incompatible-return]: assume body is always available
  return (((0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isElement)(element) ? element.ownerDocument : // $FlowFixMe[prop-missing]
  element.document) || window.document).documentElement;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentRect.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getDocumentRect.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getDocumentRect)
/* harmony export */ });
/* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _getComputedStyle_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./getComputedStyle.js */ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js");
/* harmony import */ var _getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getWindowScrollBarX.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js");
/* harmony import */ var _getWindowScroll_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getWindowScroll.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js");
/* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");




 // Gets the entire size of the scrollable document area, even extending outside
// of the `<html>` and `<body>` rect bounds if horizontally scrollable

function getDocumentRect(element) {
  var _element$ownerDocumen;

  var html = (0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element);
  var winScroll = (0,_getWindowScroll_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element);
  var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
  var width = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_2__.max)(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
  var height = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_2__.max)(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
  var x = -winScroll.scrollLeft + (0,_getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_3__["default"])(element);
  var y = -winScroll.scrollTop;

  if ((0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_4__["default"])(body || html).direction === 'rtl') {
    x += (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_2__.max)(html.clientWidth, body ? body.clientWidth : 0) - width;
  }

  return {
    width: width,
    height: height,
    x: x,
    y: y
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getHTMLElementScroll.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getHTMLElementScroll.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getHTMLElementScroll)
/* harmony export */ });
function getHTMLElementScroll(element) {
  return {
    scrollLeft: element.scrollLeft,
    scrollTop: element.scrollTop
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js":
/*!********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getLayoutRect)
/* harmony export */ });
/* harmony import */ var _getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getBoundingClientRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js");
 // Returns the layout rect of an element relative to its offsetParent. Layout
// means it doesn't take into account transforms.

function getLayoutRect(element) {
  var clientRect = (0,_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element); // Use the clientRect sizes if it's not been transformed.
  // Fixes https://github.com/popperjs/popper-core/issues/1223

  var width = element.offsetWidth;
  var height = element.offsetHeight;

  if (Math.abs(clientRect.width - width) <= 1) {
    width = clientRect.width;
  }

  if (Math.abs(clientRect.height - height) <= 1) {
    height = clientRect.height;
  }

  return {
    x: element.offsetLeft,
    y: element.offsetTop,
    width: width,
    height: height
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js":
/*!******************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getNodeName)
/* harmony export */ });
function getNodeName(element) {
  return element ? (element.nodeName || '').toLowerCase() : null;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getNodeScroll.js":
/*!********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getNodeScroll.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getNodeScroll)
/* harmony export */ });
/* harmony import */ var _getWindowScroll_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getWindowScroll.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js");
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _getHTMLElementScroll_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getHTMLElementScroll.js */ "./node_modules/@popperjs/core/lib/dom-utils/getHTMLElementScroll.js");




function getNodeScroll(node) {
  if (node === (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node) || !(0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_1__.isHTMLElement)(node)) {
    return (0,_getWindowScroll_js__WEBPACK_IMPORTED_MODULE_2__["default"])(node);
  } else {
    return (0,_getHTMLElementScroll_js__WEBPACK_IMPORTED_MODULE_3__["default"])(node);
  }
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getOffsetParent)
/* harmony export */ });
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
/* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
/* harmony import */ var _getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getComputedStyle.js */ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js");
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _isTableElement_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./isTableElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/isTableElement.js");
/* harmony import */ var _getParentNode_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getParentNode.js */ "./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js");
/* harmony import */ var _utils_userAgent_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/userAgent.js */ "./node_modules/@popperjs/core/lib/utils/userAgent.js");








function getTrueOffsetParent(element) {
  if (!(0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element) || // https://github.com/popperjs/popper-core/issues/837
  (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element).position === 'fixed') {
    return null;
  }

  return element.offsetParent;
} // `.offsetParent` reports `null` for fixed elements, while absolute elements
// return the containing block


function getContainingBlock(element) {
  var isFirefox = /firefox/i.test((0,_utils_userAgent_js__WEBPACK_IMPORTED_MODULE_2__["default"])());
  var isIE = /Trident/i.test((0,_utils_userAgent_js__WEBPACK_IMPORTED_MODULE_2__["default"])());

  if (isIE && (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element)) {
    // In IE 9, 10 and 11 fixed elements containing block is always established by the viewport
    var elementCss = (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element);

    if (elementCss.position === 'fixed') {
      return null;
    }
  }

  var currentNode = (0,_getParentNode_js__WEBPACK_IMPORTED_MODULE_3__["default"])(element);

  if ((0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isShadowRoot)(currentNode)) {
    currentNode = currentNode.host;
  }

  while ((0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(currentNode) && ['html', 'body'].indexOf((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_4__["default"])(currentNode)) < 0) {
    var css = (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__["default"])(currentNode); // This is non-exhaustive but covers the most common CSS properties that
    // create a containing block.
    // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block

    if (css.transform !== 'none' || css.perspective !== 'none' || css.contain === 'paint' || ['transform', 'perspective'].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === 'filter' || isFirefox && css.filter && css.filter !== 'none') {
      return currentNode;
    } else {
      currentNode = currentNode.parentNode;
    }
  }

  return null;
} // Gets the closest ancestor positioned element. Handles some edge cases,
// such as table ancestors and cross browser bugs.


function getOffsetParent(element) {
  var window = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_5__["default"])(element);
  var offsetParent = getTrueOffsetParent(element);

  while (offsetParent && (0,_isTableElement_js__WEBPACK_IMPORTED_MODULE_6__["default"])(offsetParent) && (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__["default"])(offsetParent).position === 'static') {
    offsetParent = getTrueOffsetParent(offsetParent);
  }

  if (offsetParent && ((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_4__["default"])(offsetParent) === 'html' || (0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_4__["default"])(offsetParent) === 'body' && (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__["default"])(offsetParent).position === 'static')) {
    return window;
  }

  return offsetParent || getContainingBlock(element) || window;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js":
/*!********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getParentNode)
/* harmony export */ });
/* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
/* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");



function getParentNode(element) {
  if ((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element) === 'html') {
    return element;
  }

  return (// this is a quicker (but less type safe) way to save quite some bytes from the bundle
    // $FlowFixMe[incompatible-return]
    // $FlowFixMe[prop-missing]
    element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
    element.parentNode || ( // DOM Element detected
    (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_1__.isShadowRoot)(element) ? element.host : null) || // ShadowRoot detected
    // $FlowFixMe[incompatible-call]: HTMLElement is a Node
    (0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(element) // fallback

  );
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getScrollParent.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getScrollParent.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getScrollParent)
/* harmony export */ });
/* harmony import */ var _getParentNode_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getParentNode.js */ "./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js");
/* harmony import */ var _isScrollParent_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isScrollParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js");
/* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");




function getScrollParent(node) {
  if (['html', 'body', '#document'].indexOf((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node)) >= 0) {
    // $FlowFixMe[incompatible-return]: assume body is always available
    return node.ownerDocument.body;
  }

  if ((0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_1__.isHTMLElement)(node) && (0,_isScrollParent_js__WEBPACK_IMPORTED_MODULE_2__["default"])(node)) {
    return node;
  }

  return getScrollParent((0,_getParentNode_js__WEBPACK_IMPORTED_MODULE_3__["default"])(node));
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getViewportRect.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getViewportRect.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getViewportRect)
/* harmony export */ });
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
/* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getWindowScrollBarX.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js");
/* harmony import */ var _isLayoutViewport_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isLayoutViewport.js */ "./node_modules/@popperjs/core/lib/dom-utils/isLayoutViewport.js");




function getViewportRect(element, strategy) {
  var win = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element);
  var html = (0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element);
  var visualViewport = win.visualViewport;
  var width = html.clientWidth;
  var height = html.clientHeight;
  var x = 0;
  var y = 0;

  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    var layoutViewport = (0,_isLayoutViewport_js__WEBPACK_IMPORTED_MODULE_2__["default"])();

    if (layoutViewport || !layoutViewport && strategy === 'fixed') {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }

  return {
    width: width,
    height: height,
    x: x + (0,_getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_3__["default"])(element),
    y: y
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js":
/*!****************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getWindow.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getWindow)
/* harmony export */ });
function getWindow(node) {
  if (node == null) {
    return window;
  }

  if (node.toString() !== '[object Window]') {
    var ownerDocument = node.ownerDocument;
    return ownerDocument ? ownerDocument.defaultView || window : window;
  }

  return node;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getWindowScroll)
/* harmony export */ });
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");

function getWindowScroll(node) {
  var win = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node);
  var scrollLeft = win.pageXOffset;
  var scrollTop = win.pageYOffset;
  return {
    scrollLeft: scrollLeft,
    scrollTop: scrollTop
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getWindowScrollBarX)
/* harmony export */ });
/* harmony import */ var _getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getBoundingClientRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js");
/* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _getWindowScroll_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getWindowScroll.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js");



function getWindowScrollBarX(element) {
  // If <html> has a CSS width greater than the viewport, then this will be
  // incorrect for RTL.
  // Popper 1 is broken in this case and never had a bug report so let's assume
  // it's not an issue. I don't think anyone ever specifies width on <html>
  // anyway.
  // Browsers where the left scrollbar doesn't cause an issue report `0` for
  // this (e.g. Edge 2019, IE11, Safari)
  return (0,_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__["default"])((0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element)).left + (0,_getWindowScroll_js__WEBPACK_IMPORTED_MODULE_2__["default"])(element).scrollLeft;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isElement: () => (/* binding */ isElement),
/* harmony export */   isHTMLElement: () => (/* binding */ isHTMLElement),
/* harmony export */   isShadowRoot: () => (/* binding */ isShadowRoot)
/* harmony export */ });
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");


function isElement(node) {
  var OwnElement = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node).Element;
  return node instanceof OwnElement || node instanceof Element;
}

function isHTMLElement(node) {
  var OwnElement = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node).HTMLElement;
  return node instanceof OwnElement || node instanceof HTMLElement;
}

function isShadowRoot(node) {
  // IE 11 has no ShadowRoot
  if (typeof ShadowRoot === 'undefined') {
    return false;
  }

  var OwnElement = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node).ShadowRoot;
  return node instanceof OwnElement || node instanceof ShadowRoot;
}



/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/isLayoutViewport.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/isLayoutViewport.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isLayoutViewport)
/* harmony export */ });
/* harmony import */ var _utils_userAgent_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/userAgent.js */ "./node_modules/@popperjs/core/lib/utils/userAgent.js");

function isLayoutViewport() {
  return !/^((?!chrome|android).)*safari/i.test((0,_utils_userAgent_js__WEBPACK_IMPORTED_MODULE_0__["default"])());
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isScrollParent)
/* harmony export */ });
/* harmony import */ var _getComputedStyle_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getComputedStyle.js */ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js");

function isScrollParent(element) {
  // Firefox wants us to check `-x` and `-y` variations as well
  var _getComputedStyle = (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element),
      overflow = _getComputedStyle.overflow,
      overflowX = _getComputedStyle.overflowX,
      overflowY = _getComputedStyle.overflowY;

  return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/isTableElement.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/isTableElement.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isTableElement)
/* harmony export */ });
/* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");

function isTableElement(element) {
  return ['table', 'td', 'th'].indexOf((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element)) >= 0;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/listScrollParents.js":
/*!************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/listScrollParents.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ listScrollParents)
/* harmony export */ });
/* harmony import */ var _getScrollParent_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getScrollParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getScrollParent.js");
/* harmony import */ var _getParentNode_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getParentNode.js */ "./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js");
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
/* harmony import */ var _isScrollParent_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isScrollParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js");




/*
given a DOM element, return the list of all scroll parents, up the list of ancesors
until we get to the top window object. This list is what we attach scroll listeners
to, because if any of these parent elements scroll, we'll need to re-calculate the
reference element's position.
*/

function listScrollParents(element, list) {
  var _element$ownerDocumen;

  if (list === void 0) {
    list = [];
  }

  var scrollParent = (0,_getScrollParent_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element);
  var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
  var win = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_1__["default"])(scrollParent);
  var target = isBody ? [win].concat(win.visualViewport || [], (0,_isScrollParent_js__WEBPACK_IMPORTED_MODULE_2__["default"])(scrollParent) ? scrollParent : []) : scrollParent;
  var updatedList = list.concat(target);
  return isBody ? updatedList : // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
  updatedList.concat(listScrollParents((0,_getParentNode_js__WEBPACK_IMPORTED_MODULE_3__["default"])(target)));
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/enums.js":
/*!**************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/enums.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   afterMain: () => (/* binding */ afterMain),
/* harmony export */   afterRead: () => (/* binding */ afterRead),
/* harmony export */   afterWrite: () => (/* binding */ afterWrite),
/* harmony export */   auto: () => (/* binding */ auto),
/* harmony export */   basePlacements: () => (/* binding */ basePlacements),
/* harmony export */   beforeMain: () => (/* binding */ beforeMain),
/* harmony export */   beforeRead: () => (/* binding */ beforeRead),
/* harmony export */   beforeWrite: () => (/* binding */ beforeWrite),
/* harmony export */   bottom: () => (/* binding */ bottom),
/* harmony export */   clippingParents: () => (/* binding */ clippingParents),
/* harmony export */   end: () => (/* binding */ end),
/* harmony export */   left: () => (/* binding */ left),
/* harmony export */   main: () => (/* binding */ main),
/* harmony export */   modifierPhases: () => (/* binding */ modifierPhases),
/* harmony export */   placements: () => (/* binding */ placements),
/* harmony export */   popper: () => (/* binding */ popper),
/* harmony export */   read: () => (/* binding */ read),
/* harmony export */   reference: () => (/* binding */ reference),
/* harmony export */   right: () => (/* binding */ right),
/* harmony export */   start: () => (/* binding */ start),
/* harmony export */   top: () => (/* binding */ top),
/* harmony export */   variationPlacements: () => (/* binding */ variationPlacements),
/* harmony export */   viewport: () => (/* binding */ viewport),
/* harmony export */   write: () => (/* binding */ write)
/* harmony export */ });
var top = 'top';
var bottom = 'bottom';
var right = 'right';
var left = 'left';
var auto = 'auto';
var basePlacements = [top, bottom, right, left];
var start = 'start';
var end = 'end';
var clippingParents = 'clippingParents';
var viewport = 'viewport';
var popper = 'popper';
var reference = 'reference';
var variationPlacements = /*#__PURE__*/basePlacements.reduce(function (acc, placement) {
  return acc.concat([placement + "-" + start, placement + "-" + end]);
}, []);
var placements = /*#__PURE__*/[].concat(basePlacements, [auto]).reduce(function (acc, placement) {
  return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
}, []); // modifiers that need to read the DOM

var beforeRead = 'beforeRead';
var read = 'read';
var afterRead = 'afterRead'; // pure-logic modifiers

var beforeMain = 'beforeMain';
var main = 'main';
var afterMain = 'afterMain'; // modifier with the purpose to write to the DOM (or write into a framework state)

var beforeWrite = 'beforeWrite';
var write = 'write';
var afterWrite = 'afterWrite';
var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/index.js":
/*!**************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/index.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   afterMain: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.afterMain),
/* harmony export */   afterRead: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.afterRead),
/* harmony export */   afterWrite: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.afterWrite),
/* harmony export */   applyStyles: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__.applyStyles),
/* harmony export */   arrow: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__.arrow),
/* harmony export */   auto: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.auto),
/* harmony export */   basePlacements: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.basePlacements),
/* harmony export */   beforeMain: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.beforeMain),
/* harmony export */   beforeRead: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.beforeRead),
/* harmony export */   beforeWrite: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.beforeWrite),
/* harmony export */   bottom: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.bottom),
/* harmony export */   clippingParents: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.clippingParents),
/* harmony export */   computeStyles: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__.computeStyles),
/* harmony export */   createPopper: () => (/* reexport safe */ _popper_js__WEBPACK_IMPORTED_MODULE_4__.createPopper),
/* harmony export */   createPopperBase: () => (/* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_2__.createPopper),
/* harmony export */   createPopperLite: () => (/* reexport safe */ _popper_lite_js__WEBPACK_IMPORTED_MODULE_5__.createPopper),
/* harmony export */   detectOverflow: () => (/* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_3__["default"]),
/* harmony export */   end: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.end),
/* harmony export */   eventListeners: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__.eventListeners),
/* harmony export */   flip: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__.flip),
/* harmony export */   hide: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__.hide),
/* harmony export */   left: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.left),
/* harmony export */   main: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.main),
/* harmony export */   modifierPhases: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.modifierPhases),
/* harmony export */   offset: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__.offset),
/* harmony export */   placements: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.placements),
/* harmony export */   popper: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.popper),
/* harmony export */   popperGenerator: () => (/* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_2__.popperGenerator),
/* harmony export */   popperOffsets: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__.popperOffsets),
/* harmony export */   preventOverflow: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__.preventOverflow),
/* harmony export */   read: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.read),
/* harmony export */   reference: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.reference),
/* harmony export */   right: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.right),
/* harmony export */   start: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.start),
/* harmony export */   top: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.top),
/* harmony export */   variationPlacements: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.variationPlacements),
/* harmony export */   viewport: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.viewport),
/* harmony export */   write: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.write)
/* harmony export */ });
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modifiers/index.js */ "./node_modules/@popperjs/core/lib/modifiers/index.js");
/* harmony import */ var _createPopper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./createPopper.js */ "./node_modules/@popperjs/core/lib/createPopper.js");
/* harmony import */ var _createPopper_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./createPopper.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _popper_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./popper.js */ "./node_modules/@popperjs/core/lib/popper.js");
/* harmony import */ var _popper_lite_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./popper-lite.js */ "./node_modules/@popperjs/core/lib/popper-lite.js");

 // eslint-disable-next-line import/no-unused-modules

 // eslint-disable-next-line import/no-unused-modules

 // eslint-disable-next-line import/no-unused-modules



/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/applyStyles.js":
/*!******************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/applyStyles.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _dom_utils_getNodeName_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../dom-utils/getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
/* harmony import */ var _dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../dom-utils/instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");

 // This modifier takes the styles prepared by the `computeStyles` modifier
// and applies them to the HTMLElements such as popper and arrow

function applyStyles(_ref) {
  var state = _ref.state;
  Object.keys(state.elements).forEach(function (name) {
    var style = state.styles[name] || {};
    var attributes = state.attributes[name] || {};
    var element = state.elements[name]; // arrow is optional + virtual elements

    if (!(0,_dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element) || !(0,_dom_utils_getNodeName_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element)) {
      return;
    } // Flow doesn't support to extend this property, but it's the most
    // effective way to apply styles to an HTMLElement
    // $FlowFixMe[cannot-write]


    Object.assign(element.style, style);
    Object.keys(attributes).forEach(function (name) {
      var value = attributes[name];

      if (value === false) {
        element.removeAttribute(name);
      } else {
        element.setAttribute(name, value === true ? '' : value);
      }
    });
  });
}

function effect(_ref2) {
  var state = _ref2.state;
  var initialStyles = {
    popper: {
      position: state.options.strategy,
      left: '0',
      top: '0',
      margin: '0'
    },
    arrow: {
      position: 'absolute'
    },
    reference: {}
  };
  Object.assign(state.elements.popper.style, initialStyles.popper);
  state.styles = initialStyles;

  if (state.elements.arrow) {
    Object.assign(state.elements.arrow.style, initialStyles.arrow);
  }

  return function () {
    Object.keys(state.elements).forEach(function (name) {
      var element = state.elements[name];
      var attributes = state.attributes[name] || {};
      var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]); // Set all values to an empty string to unset them

      var style = styleProperties.reduce(function (style, property) {
        style[property] = '';
        return style;
      }, {}); // arrow is optional + virtual elements

      if (!(0,_dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element) || !(0,_dom_utils_getNodeName_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element)) {
        return;
      }

      Object.assign(element.style, style);
      Object.keys(attributes).forEach(function (attribute) {
        element.removeAttribute(attribute);
      });
    });
  };
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'applyStyles',
  enabled: true,
  phase: 'write',
  fn: applyStyles,
  effect: effect,
  requires: ['computeStyles']
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/arrow.js":
/*!************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/arrow.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../dom-utils/getLayoutRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js");
/* harmony import */ var _dom_utils_contains_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../dom-utils/contains.js */ "./node_modules/@popperjs/core/lib/dom-utils/contains.js");
/* harmony import */ var _dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../dom-utils/getOffsetParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js");
/* harmony import */ var _utils_getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/getMainAxisFromPlacement.js */ "./node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js");
/* harmony import */ var _utils_within_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/within.js */ "./node_modules/@popperjs/core/lib/utils/within.js");
/* harmony import */ var _utils_mergePaddingObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/mergePaddingObject.js */ "./node_modules/@popperjs/core/lib/utils/mergePaddingObject.js");
/* harmony import */ var _utils_expandToHashMap_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/expandToHashMap.js */ "./node_modules/@popperjs/core/lib/utils/expandToHashMap.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");








 // eslint-disable-next-line import/no-unused-modules

var toPaddingObject = function toPaddingObject(padding, state) {
  padding = typeof padding === 'function' ? padding(Object.assign({}, state.rects, {
    placement: state.placement
  })) : padding;
  return (0,_utils_mergePaddingObject_js__WEBPACK_IMPORTED_MODULE_0__["default"])(typeof padding !== 'number' ? padding : (0,_utils_expandToHashMap_js__WEBPACK_IMPORTED_MODULE_1__["default"])(padding, _enums_js__WEBPACK_IMPORTED_MODULE_2__.basePlacements));
};

function arrow(_ref) {
  var _state$modifiersData$;

  var state = _ref.state,
      name = _ref.name,
      options = _ref.options;
  var arrowElement = state.elements.arrow;
  var popperOffsets = state.modifiersData.popperOffsets;
  var basePlacement = (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(state.placement);
  var axis = (0,_utils_getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_4__["default"])(basePlacement);
  var isVertical = [_enums_js__WEBPACK_IMPORTED_MODULE_2__.left, _enums_js__WEBPACK_IMPORTED_MODULE_2__.right].indexOf(basePlacement) >= 0;
  var len = isVertical ? 'height' : 'width';

  if (!arrowElement || !popperOffsets) {
    return;
  }

  var paddingObject = toPaddingObject(options.padding, state);
  var arrowRect = (0,_dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_5__["default"])(arrowElement);
  var minProp = axis === 'y' ? _enums_js__WEBPACK_IMPORTED_MODULE_2__.top : _enums_js__WEBPACK_IMPORTED_MODULE_2__.left;
  var maxProp = axis === 'y' ? _enums_js__WEBPACK_IMPORTED_MODULE_2__.bottom : _enums_js__WEBPACK_IMPORTED_MODULE_2__.right;
  var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets[axis] - state.rects.popper[len];
  var startDiff = popperOffsets[axis] - state.rects.reference[axis];
  var arrowOffsetParent = (0,_dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_6__["default"])(arrowElement);
  var clientSize = arrowOffsetParent ? axis === 'y' ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
  var centerToReference = endDiff / 2 - startDiff / 2; // Make sure the arrow doesn't overflow the popper if the center point is
  // outside of the popper bounds

  var min = paddingObject[minProp];
  var max = clientSize - arrowRect[len] - paddingObject[maxProp];
  var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
  var offset = (0,_utils_within_js__WEBPACK_IMPORTED_MODULE_7__.within)(min, center, max); // Prevents breaking syntax highlighting...

  var axisProp = axis;
  state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset, _state$modifiersData$.centerOffset = offset - center, _state$modifiersData$);
}

function effect(_ref2) {
  var state = _ref2.state,
      options = _ref2.options;
  var _options$element = options.element,
      arrowElement = _options$element === void 0 ? '[data-popper-arrow]' : _options$element;

  if (arrowElement == null) {
    return;
  } // CSS selector


  if (typeof arrowElement === 'string') {
    arrowElement = state.elements.popper.querySelector(arrowElement);

    if (!arrowElement) {
      return;
    }
  }

  if (!(0,_dom_utils_contains_js__WEBPACK_IMPORTED_MODULE_8__["default"])(state.elements.popper, arrowElement)) {
    return;
  }

  state.elements.arrow = arrowElement;
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'arrow',
  enabled: true,
  phase: 'main',
  fn: arrow,
  effect: effect,
  requires: ['popperOffsets'],
  requiresIfExists: ['preventOverflow']
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/computeStyles.js":
/*!********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/computeStyles.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   mapToStyles: () => (/* binding */ mapToStyles)
/* harmony export */ });
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../dom-utils/getOffsetParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js");
/* harmony import */ var _dom_utils_getWindow_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../dom-utils/getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
/* harmony import */ var _dom_utils_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../dom-utils/getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _dom_utils_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../dom-utils/getComputedStyle.js */ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js");
/* harmony import */ var _utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils/getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _utils_getVariation_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/getVariation.js */ "./node_modules/@popperjs/core/lib/utils/getVariation.js");
/* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");







 // eslint-disable-next-line import/no-unused-modules

var unsetSides = {
  top: 'auto',
  right: 'auto',
  bottom: 'auto',
  left: 'auto'
}; // Round the offsets to the nearest suitable subpixel based on the DPR.
// Zooming can change the DPR, but it seems to report a value that will
// cleanly divide the values into the appropriate subpixels.

function roundOffsetsByDPR(_ref, win) {
  var x = _ref.x,
      y = _ref.y;
  var dpr = win.devicePixelRatio || 1;
  return {
    x: (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_0__.round)(x * dpr) / dpr || 0,
    y: (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_0__.round)(y * dpr) / dpr || 0
  };
}

function mapToStyles(_ref2) {
  var _Object$assign2;

  var popper = _ref2.popper,
      popperRect = _ref2.popperRect,
      placement = _ref2.placement,
      variation = _ref2.variation,
      offsets = _ref2.offsets,
      position = _ref2.position,
      gpuAcceleration = _ref2.gpuAcceleration,
      adaptive = _ref2.adaptive,
      roundOffsets = _ref2.roundOffsets,
      isFixed = _ref2.isFixed;
  var _offsets$x = offsets.x,
      x = _offsets$x === void 0 ? 0 : _offsets$x,
      _offsets$y = offsets.y,
      y = _offsets$y === void 0 ? 0 : _offsets$y;

  var _ref3 = typeof roundOffsets === 'function' ? roundOffsets({
    x: x,
    y: y
  }) : {
    x: x,
    y: y
  };

  x = _ref3.x;
  y = _ref3.y;
  var hasX = offsets.hasOwnProperty('x');
  var hasY = offsets.hasOwnProperty('y');
  var sideX = _enums_js__WEBPACK_IMPORTED_MODULE_1__.left;
  var sideY = _enums_js__WEBPACK_IMPORTED_MODULE_1__.top;
  var win = window;

  if (adaptive) {
    var offsetParent = (0,_dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_2__["default"])(popper);
    var heightProp = 'clientHeight';
    var widthProp = 'clientWidth';

    if (offsetParent === (0,_dom_utils_getWindow_js__WEBPACK_IMPORTED_MODULE_3__["default"])(popper)) {
      offsetParent = (0,_dom_utils_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_4__["default"])(popper);

      if ((0,_dom_utils_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_5__["default"])(offsetParent).position !== 'static' && position === 'absolute') {
        heightProp = 'scrollHeight';
        widthProp = 'scrollWidth';
      }
    } // $FlowFixMe[incompatible-cast]: force type refinement, we compare offsetParent with window above, but Flow doesn't detect it


    offsetParent = offsetParent;

    if (placement === _enums_js__WEBPACK_IMPORTED_MODULE_1__.top || (placement === _enums_js__WEBPACK_IMPORTED_MODULE_1__.left || placement === _enums_js__WEBPACK_IMPORTED_MODULE_1__.right) && variation === _enums_js__WEBPACK_IMPORTED_MODULE_1__.end) {
      sideY = _enums_js__WEBPACK_IMPORTED_MODULE_1__.bottom;
      var offsetY = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.height : // $FlowFixMe[prop-missing]
      offsetParent[heightProp];
      y -= offsetY - popperRect.height;
      y *= gpuAcceleration ? 1 : -1;
    }

    if (placement === _enums_js__WEBPACK_IMPORTED_MODULE_1__.left || (placement === _enums_js__WEBPACK_IMPORTED_MODULE_1__.top || placement === _enums_js__WEBPACK_IMPORTED_MODULE_1__.bottom) && variation === _enums_js__WEBPACK_IMPORTED_MODULE_1__.end) {
      sideX = _enums_js__WEBPACK_IMPORTED_MODULE_1__.right;
      var offsetX = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.width : // $FlowFixMe[prop-missing]
      offsetParent[widthProp];
      x -= offsetX - popperRect.width;
      x *= gpuAcceleration ? 1 : -1;
    }
  }

  var commonStyles = Object.assign({
    position: position
  }, adaptive && unsetSides);

  var _ref4 = roundOffsets === true ? roundOffsetsByDPR({
    x: x,
    y: y
  }, (0,_dom_utils_getWindow_js__WEBPACK_IMPORTED_MODULE_3__["default"])(popper)) : {
    x: x,
    y: y
  };

  x = _ref4.x;
  y = _ref4.y;

  if (gpuAcceleration) {
    var _Object$assign;

    return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? '0' : '', _Object$assign[sideX] = hasX ? '0' : '', _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
  }

  return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : '', _Object$assign2[sideX] = hasX ? x + "px" : '', _Object$assign2.transform = '', _Object$assign2));
}

function computeStyles(_ref5) {
  var state = _ref5.state,
      options = _ref5.options;
  var _options$gpuAccelerat = options.gpuAcceleration,
      gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat,
      _options$adaptive = options.adaptive,
      adaptive = _options$adaptive === void 0 ? true : _options$adaptive,
      _options$roundOffsets = options.roundOffsets,
      roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;
  var commonStyles = {
    placement: (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_6__["default"])(state.placement),
    variation: (0,_utils_getVariation_js__WEBPACK_IMPORTED_MODULE_7__["default"])(state.placement),
    popper: state.elements.popper,
    popperRect: state.rects.popper,
    gpuAcceleration: gpuAcceleration,
    isFixed: state.options.strategy === 'fixed'
  };

  if (state.modifiersData.popperOffsets != null) {
    state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.popperOffsets,
      position: state.options.strategy,
      adaptive: adaptive,
      roundOffsets: roundOffsets
    })));
  }

  if (state.modifiersData.arrow != null) {
    state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.arrow,
      position: 'absolute',
      adaptive: false,
      roundOffsets: roundOffsets
    })));
  }

  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    'data-popper-placement': state.placement
  });
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'computeStyles',
  enabled: true,
  phase: 'beforeWrite',
  fn: computeStyles,
  data: {}
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/eventListeners.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/eventListeners.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _dom_utils_getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../dom-utils/getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
 // eslint-disable-next-line import/no-unused-modules

var passive = {
  passive: true
};

function effect(_ref) {
  var state = _ref.state,
      instance = _ref.instance,
      options = _ref.options;
  var _options$scroll = options.scroll,
      scroll = _options$scroll === void 0 ? true : _options$scroll,
      _options$resize = options.resize,
      resize = _options$resize === void 0 ? true : _options$resize;
  var window = (0,_dom_utils_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(state.elements.popper);
  var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);

  if (scroll) {
    scrollParents.forEach(function (scrollParent) {
      scrollParent.addEventListener('scroll', instance.update, passive);
    });
  }

  if (resize) {
    window.addEventListener('resize', instance.update, passive);
  }

  return function () {
    if (scroll) {
      scrollParents.forEach(function (scrollParent) {
        scrollParent.removeEventListener('scroll', instance.update, passive);
      });
    }

    if (resize) {
      window.removeEventListener('resize', instance.update, passive);
    }
  };
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'eventListeners',
  enabled: true,
  phase: 'write',
  fn: function fn() {},
  effect: effect,
  data: {}
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/flip.js":
/*!***********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/flip.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_getOppositePlacement_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/getOppositePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getOppositePlacement.js");
/* harmony import */ var _utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _utils_getOppositeVariationPlacement_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/getOppositeVariationPlacement.js */ "./node_modules/@popperjs/core/lib/utils/getOppositeVariationPlacement.js");
/* harmony import */ var _utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils/detectOverflow.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _utils_computeAutoPlacement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/computeAutoPlacement.js */ "./node_modules/@popperjs/core/lib/utils/computeAutoPlacement.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _utils_getVariation_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/getVariation.js */ "./node_modules/@popperjs/core/lib/utils/getVariation.js");






 // eslint-disable-next-line import/no-unused-modules

function getExpandedFallbackPlacements(placement) {
  if ((0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(placement) === _enums_js__WEBPACK_IMPORTED_MODULE_1__.auto) {
    return [];
  }

  var oppositePlacement = (0,_utils_getOppositePlacement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(placement);
  return [(0,_utils_getOppositeVariationPlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(placement), oppositePlacement, (0,_utils_getOppositeVariationPlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(oppositePlacement)];
}

function flip(_ref) {
  var state = _ref.state,
      options = _ref.options,
      name = _ref.name;

  if (state.modifiersData[name]._skip) {
    return;
  }

  var _options$mainAxis = options.mainAxis,
      checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
      _options$altAxis = options.altAxis,
      checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis,
      specifiedFallbackPlacements = options.fallbackPlacements,
      padding = options.padding,
      boundary = options.boundary,
      rootBoundary = options.rootBoundary,
      altBoundary = options.altBoundary,
      _options$flipVariatio = options.flipVariations,
      flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio,
      allowedAutoPlacements = options.allowedAutoPlacements;
  var preferredPlacement = state.options.placement;
  var basePlacement = (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(preferredPlacement);
  var isBasePlacement = basePlacement === preferredPlacement;
  var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [(0,_utils_getOppositePlacement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
  var placements = [preferredPlacement].concat(fallbackPlacements).reduce(function (acc, placement) {
    return acc.concat((0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(placement) === _enums_js__WEBPACK_IMPORTED_MODULE_1__.auto ? (0,_utils_computeAutoPlacement_js__WEBPACK_IMPORTED_MODULE_4__["default"])(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      padding: padding,
      flipVariations: flipVariations,
      allowedAutoPlacements: allowedAutoPlacements
    }) : placement);
  }, []);
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var checksMap = new Map();
  var makeFallbackChecks = true;
  var firstFittingPlacement = placements[0];

  for (var i = 0; i < placements.length; i++) {
    var placement = placements[i];

    var _basePlacement = (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(placement);

    var isStartVariation = (0,_utils_getVariation_js__WEBPACK_IMPORTED_MODULE_5__["default"])(placement) === _enums_js__WEBPACK_IMPORTED_MODULE_1__.start;
    var isVertical = [_enums_js__WEBPACK_IMPORTED_MODULE_1__.top, _enums_js__WEBPACK_IMPORTED_MODULE_1__.bottom].indexOf(_basePlacement) >= 0;
    var len = isVertical ? 'width' : 'height';
    var overflow = (0,_utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_6__["default"])(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      altBoundary: altBoundary,
      padding: padding
    });
    var mainVariationSide = isVertical ? isStartVariation ? _enums_js__WEBPACK_IMPORTED_MODULE_1__.right : _enums_js__WEBPACK_IMPORTED_MODULE_1__.left : isStartVariation ? _enums_js__WEBPACK_IMPORTED_MODULE_1__.bottom : _enums_js__WEBPACK_IMPORTED_MODULE_1__.top;

    if (referenceRect[len] > popperRect[len]) {
      mainVariationSide = (0,_utils_getOppositePlacement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(mainVariationSide);
    }

    var altVariationSide = (0,_utils_getOppositePlacement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(mainVariationSide);
    var checks = [];

    if (checkMainAxis) {
      checks.push(overflow[_basePlacement] <= 0);
    }

    if (checkAltAxis) {
      checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
    }

    if (checks.every(function (check) {
      return check;
    })) {
      firstFittingPlacement = placement;
      makeFallbackChecks = false;
      break;
    }

    checksMap.set(placement, checks);
  }

  if (makeFallbackChecks) {
    // `2` may be desired in some cases – research later
    var numberOfChecks = flipVariations ? 3 : 1;

    var _loop = function _loop(_i) {
      var fittingPlacement = placements.find(function (placement) {
        var checks = checksMap.get(placement);

        if (checks) {
          return checks.slice(0, _i).every(function (check) {
            return check;
          });
        }
      });

      if (fittingPlacement) {
        firstFittingPlacement = fittingPlacement;
        return "break";
      }
    };

    for (var _i = numberOfChecks; _i > 0; _i--) {
      var _ret = _loop(_i);

      if (_ret === "break") break;
    }
  }

  if (state.placement !== firstFittingPlacement) {
    state.modifiersData[name]._skip = true;
    state.placement = firstFittingPlacement;
    state.reset = true;
  }
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'flip',
  enabled: true,
  phase: 'main',
  fn: flip,
  requiresIfExists: ['offset'],
  data: {
    _skip: false
  }
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/hide.js":
/*!***********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/hide.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/detectOverflow.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");



function getSideOffsets(overflow, rect, preventedOffsets) {
  if (preventedOffsets === void 0) {
    preventedOffsets = {
      x: 0,
      y: 0
    };
  }

  return {
    top: overflow.top - rect.height - preventedOffsets.y,
    right: overflow.right - rect.width + preventedOffsets.x,
    bottom: overflow.bottom - rect.height + preventedOffsets.y,
    left: overflow.left - rect.width - preventedOffsets.x
  };
}

function isAnySideFullyClipped(overflow) {
  return [_enums_js__WEBPACK_IMPORTED_MODULE_0__.top, _enums_js__WEBPACK_IMPORTED_MODULE_0__.right, _enums_js__WEBPACK_IMPORTED_MODULE_0__.bottom, _enums_js__WEBPACK_IMPORTED_MODULE_0__.left].some(function (side) {
    return overflow[side] >= 0;
  });
}

function hide(_ref) {
  var state = _ref.state,
      name = _ref.name;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var preventedOffsets = state.modifiersData.preventOverflow;
  var referenceOverflow = (0,_utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_1__["default"])(state, {
    elementContext: 'reference'
  });
  var popperAltOverflow = (0,_utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_1__["default"])(state, {
    altBoundary: true
  });
  var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
  var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
  var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
  var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
  state.modifiersData[name] = {
    referenceClippingOffsets: referenceClippingOffsets,
    popperEscapeOffsets: popperEscapeOffsets,
    isReferenceHidden: isReferenceHidden,
    hasPopperEscaped: hasPopperEscaped
  };
  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    'data-popper-reference-hidden': isReferenceHidden,
    'data-popper-escaped': hasPopperEscaped
  });
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'hide',
  enabled: true,
  phase: 'main',
  requiresIfExists: ['preventOverflow'],
  fn: hide
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/index.js":
/*!************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/index.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   applyStyles: () => (/* reexport safe */ _applyStyles_js__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   arrow: () => (/* reexport safe */ _arrow_js__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   computeStyles: () => (/* reexport safe */ _computeStyles_js__WEBPACK_IMPORTED_MODULE_2__["default"]),
/* harmony export */   eventListeners: () => (/* reexport safe */ _eventListeners_js__WEBPACK_IMPORTED_MODULE_3__["default"]),
/* harmony export */   flip: () => (/* reexport safe */ _flip_js__WEBPACK_IMPORTED_MODULE_4__["default"]),
/* harmony export */   hide: () => (/* reexport safe */ _hide_js__WEBPACK_IMPORTED_MODULE_5__["default"]),
/* harmony export */   offset: () => (/* reexport safe */ _offset_js__WEBPACK_IMPORTED_MODULE_6__["default"]),
/* harmony export */   popperOffsets: () => (/* reexport safe */ _popperOffsets_js__WEBPACK_IMPORTED_MODULE_7__["default"]),
/* harmony export */   preventOverflow: () => (/* reexport safe */ _preventOverflow_js__WEBPACK_IMPORTED_MODULE_8__["default"])
/* harmony export */ });
/* harmony import */ var _applyStyles_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./applyStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/applyStyles.js");
/* harmony import */ var _arrow_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./arrow.js */ "./node_modules/@popperjs/core/lib/modifiers/arrow.js");
/* harmony import */ var _computeStyles_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./computeStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/computeStyles.js");
/* harmony import */ var _eventListeners_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./eventListeners.js */ "./node_modules/@popperjs/core/lib/modifiers/eventListeners.js");
/* harmony import */ var _flip_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./flip.js */ "./node_modules/@popperjs/core/lib/modifiers/flip.js");
/* harmony import */ var _hide_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./hide.js */ "./node_modules/@popperjs/core/lib/modifiers/hide.js");
/* harmony import */ var _offset_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./offset.js */ "./node_modules/@popperjs/core/lib/modifiers/offset.js");
/* harmony import */ var _popperOffsets_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./popperOffsets.js */ "./node_modules/@popperjs/core/lib/modifiers/popperOffsets.js");
/* harmony import */ var _preventOverflow_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./preventOverflow.js */ "./node_modules/@popperjs/core/lib/modifiers/preventOverflow.js");










/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/offset.js":
/*!*************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/offset.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   distanceAndSkiddingToXY: () => (/* binding */ distanceAndSkiddingToXY)
/* harmony export */ });
/* harmony import */ var _utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");

 // eslint-disable-next-line import/no-unused-modules

function distanceAndSkiddingToXY(placement, rects, offset) {
  var basePlacement = (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(placement);
  var invertDistance = [_enums_js__WEBPACK_IMPORTED_MODULE_1__.left, _enums_js__WEBPACK_IMPORTED_MODULE_1__.top].indexOf(basePlacement) >= 0 ? -1 : 1;

  var _ref = typeof offset === 'function' ? offset(Object.assign({}, rects, {
    placement: placement
  })) : offset,
      skidding = _ref[0],
      distance = _ref[1];

  skidding = skidding || 0;
  distance = (distance || 0) * invertDistance;
  return [_enums_js__WEBPACK_IMPORTED_MODULE_1__.left, _enums_js__WEBPACK_IMPORTED_MODULE_1__.right].indexOf(basePlacement) >= 0 ? {
    x: distance,
    y: skidding
  } : {
    x: skidding,
    y: distance
  };
}

function offset(_ref2) {
  var state = _ref2.state,
      options = _ref2.options,
      name = _ref2.name;
  var _options$offset = options.offset,
      offset = _options$offset === void 0 ? [0, 0] : _options$offset;
  var data = _enums_js__WEBPACK_IMPORTED_MODULE_1__.placements.reduce(function (acc, placement) {
    acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset);
    return acc;
  }, {});
  var _data$state$placement = data[state.placement],
      x = _data$state$placement.x,
      y = _data$state$placement.y;

  if (state.modifiersData.popperOffsets != null) {
    state.modifiersData.popperOffsets.x += x;
    state.modifiersData.popperOffsets.y += y;
  }

  state.modifiersData[name] = data;
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'offset',
  enabled: true,
  phase: 'main',
  requires: ['popperOffsets'],
  fn: offset
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/popperOffsets.js":
/*!********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/popperOffsets.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_computeOffsets_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/computeOffsets.js */ "./node_modules/@popperjs/core/lib/utils/computeOffsets.js");


function popperOffsets(_ref) {
  var state = _ref.state,
      name = _ref.name;
  // Offsets are the actual position the popper needs to have to be
  // properly positioned near its reference element
  // This is the most basic placement, and will be adjusted by
  // the modifiers in the next step
  state.modifiersData[name] = (0,_utils_computeOffsets_js__WEBPACK_IMPORTED_MODULE_0__["default"])({
    reference: state.rects.reference,
    element: state.rects.popper,
    strategy: 'absolute',
    placement: state.placement
  });
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'popperOffsets',
  enabled: true,
  phase: 'read',
  fn: popperOffsets,
  data: {}
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/preventOverflow.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/preventOverflow.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _utils_getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/getMainAxisFromPlacement.js */ "./node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js");
/* harmony import */ var _utils_getAltAxis_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/getAltAxis.js */ "./node_modules/@popperjs/core/lib/utils/getAltAxis.js");
/* harmony import */ var _utils_within_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../utils/within.js */ "./node_modules/@popperjs/core/lib/utils/within.js");
/* harmony import */ var _dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../dom-utils/getLayoutRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js");
/* harmony import */ var _dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../dom-utils/getOffsetParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js");
/* harmony import */ var _utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/detectOverflow.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _utils_getVariation_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/getVariation.js */ "./node_modules/@popperjs/core/lib/utils/getVariation.js");
/* harmony import */ var _utils_getFreshSideObject_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/getFreshSideObject.js */ "./node_modules/@popperjs/core/lib/utils/getFreshSideObject.js");
/* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");












function preventOverflow(_ref) {
  var state = _ref.state,
      options = _ref.options,
      name = _ref.name;
  var _options$mainAxis = options.mainAxis,
      checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
      _options$altAxis = options.altAxis,
      checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis,
      boundary = options.boundary,
      rootBoundary = options.rootBoundary,
      altBoundary = options.altBoundary,
      padding = options.padding,
      _options$tether = options.tether,
      tether = _options$tether === void 0 ? true : _options$tether,
      _options$tetherOffset = options.tetherOffset,
      tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
  var overflow = (0,_utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(state, {
    boundary: boundary,
    rootBoundary: rootBoundary,
    padding: padding,
    altBoundary: altBoundary
  });
  var basePlacement = (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_1__["default"])(state.placement);
  var variation = (0,_utils_getVariation_js__WEBPACK_IMPORTED_MODULE_2__["default"])(state.placement);
  var isBasePlacement = !variation;
  var mainAxis = (0,_utils_getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(basePlacement);
  var altAxis = (0,_utils_getAltAxis_js__WEBPACK_IMPORTED_MODULE_4__["default"])(mainAxis);
  var popperOffsets = state.modifiersData.popperOffsets;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var tetherOffsetValue = typeof tetherOffset === 'function' ? tetherOffset(Object.assign({}, state.rects, {
    placement: state.placement
  })) : tetherOffset;
  var normalizedTetherOffsetValue = typeof tetherOffsetValue === 'number' ? {
    mainAxis: tetherOffsetValue,
    altAxis: tetherOffsetValue
  } : Object.assign({
    mainAxis: 0,
    altAxis: 0
  }, tetherOffsetValue);
  var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
  var data = {
    x: 0,
    y: 0
  };

  if (!popperOffsets) {
    return;
  }

  if (checkMainAxis) {
    var _offsetModifierState$;

    var mainSide = mainAxis === 'y' ? _enums_js__WEBPACK_IMPORTED_MODULE_5__.top : _enums_js__WEBPACK_IMPORTED_MODULE_5__.left;
    var altSide = mainAxis === 'y' ? _enums_js__WEBPACK_IMPORTED_MODULE_5__.bottom : _enums_js__WEBPACK_IMPORTED_MODULE_5__.right;
    var len = mainAxis === 'y' ? 'height' : 'width';
    var offset = popperOffsets[mainAxis];
    var min = offset + overflow[mainSide];
    var max = offset - overflow[altSide];
    var additive = tether ? -popperRect[len] / 2 : 0;
    var minLen = variation === _enums_js__WEBPACK_IMPORTED_MODULE_5__.start ? referenceRect[len] : popperRect[len];
    var maxLen = variation === _enums_js__WEBPACK_IMPORTED_MODULE_5__.start ? -popperRect[len] : -referenceRect[len]; // We need to include the arrow in the calculation so the arrow doesn't go
    // outside the reference bounds

    var arrowElement = state.elements.arrow;
    var arrowRect = tether && arrowElement ? (0,_dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_6__["default"])(arrowElement) : {
      width: 0,
      height: 0
    };
    var arrowPaddingObject = state.modifiersData['arrow#persistent'] ? state.modifiersData['arrow#persistent'].padding : (0,_utils_getFreshSideObject_js__WEBPACK_IMPORTED_MODULE_7__["default"])();
    var arrowPaddingMin = arrowPaddingObject[mainSide];
    var arrowPaddingMax = arrowPaddingObject[altSide]; // If the reference length is smaller than the arrow length, we don't want
    // to include its full size in the calculation. If the reference is small
    // and near the edge of a boundary, the popper can overflow even if the
    // reference is not overflowing as well (e.g. virtual elements with no
    // width or height)

    var arrowLen = (0,_utils_within_js__WEBPACK_IMPORTED_MODULE_8__.within)(0, referenceRect[len], arrowRect[len]);
    var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
    var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
    var arrowOffsetParent = state.elements.arrow && (0,_dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_9__["default"])(state.elements.arrow);
    var clientOffset = arrowOffsetParent ? mainAxis === 'y' ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
    var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
    var tetherMin = offset + minOffset - offsetModifierValue - clientOffset;
    var tetherMax = offset + maxOffset - offsetModifierValue;
    var preventedOffset = (0,_utils_within_js__WEBPACK_IMPORTED_MODULE_8__.within)(tether ? (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_10__.min)(min, tetherMin) : min, offset, tether ? (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_10__.max)(max, tetherMax) : max);
    popperOffsets[mainAxis] = preventedOffset;
    data[mainAxis] = preventedOffset - offset;
  }

  if (checkAltAxis) {
    var _offsetModifierState$2;

    var _mainSide = mainAxis === 'x' ? _enums_js__WEBPACK_IMPORTED_MODULE_5__.top : _enums_js__WEBPACK_IMPORTED_MODULE_5__.left;

    var _altSide = mainAxis === 'x' ? _enums_js__WEBPACK_IMPORTED_MODULE_5__.bottom : _enums_js__WEBPACK_IMPORTED_MODULE_5__.right;

    var _offset = popperOffsets[altAxis];

    var _len = altAxis === 'y' ? 'height' : 'width';

    var _min = _offset + overflow[_mainSide];

    var _max = _offset - overflow[_altSide];

    var isOriginSide = [_enums_js__WEBPACK_IMPORTED_MODULE_5__.top, _enums_js__WEBPACK_IMPORTED_MODULE_5__.left].indexOf(basePlacement) !== -1;

    var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;

    var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;

    var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;

    var _preventedOffset = tether && isOriginSide ? (0,_utils_within_js__WEBPACK_IMPORTED_MODULE_8__.withinMaxClamp)(_tetherMin, _offset, _tetherMax) : (0,_utils_within_js__WEBPACK_IMPORTED_MODULE_8__.within)(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);

    popperOffsets[altAxis] = _preventedOffset;
    data[altAxis] = _preventedOffset - _offset;
  }

  state.modifiersData[name] = data;
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'preventOverflow',
  enabled: true,
  phase: 'main',
  fn: preventOverflow,
  requiresIfExists: ['offset']
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/popper-lite.js":
/*!********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/popper-lite.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createPopper: () => (/* binding */ createPopper),
/* harmony export */   defaultModifiers: () => (/* binding */ defaultModifiers),
/* harmony export */   detectOverflow: () => (/* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_5__["default"]),
/* harmony export */   popperGenerator: () => (/* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_4__.popperGenerator)
/* harmony export */ });
/* harmony import */ var _createPopper_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./createPopper.js */ "./node_modules/@popperjs/core/lib/createPopper.js");
/* harmony import */ var _createPopper_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./createPopper.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _modifiers_eventListeners_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modifiers/eventListeners.js */ "./node_modules/@popperjs/core/lib/modifiers/eventListeners.js");
/* harmony import */ var _modifiers_popperOffsets_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modifiers/popperOffsets.js */ "./node_modules/@popperjs/core/lib/modifiers/popperOffsets.js");
/* harmony import */ var _modifiers_computeStyles_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modifiers/computeStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/computeStyles.js");
/* harmony import */ var _modifiers_applyStyles_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modifiers/applyStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/applyStyles.js");





var defaultModifiers = [_modifiers_eventListeners_js__WEBPACK_IMPORTED_MODULE_0__["default"], _modifiers_popperOffsets_js__WEBPACK_IMPORTED_MODULE_1__["default"], _modifiers_computeStyles_js__WEBPACK_IMPORTED_MODULE_2__["default"], _modifiers_applyStyles_js__WEBPACK_IMPORTED_MODULE_3__["default"]];
var createPopper = /*#__PURE__*/(0,_createPopper_js__WEBPACK_IMPORTED_MODULE_4__.popperGenerator)({
  defaultModifiers: defaultModifiers
}); // eslint-disable-next-line import/no-unused-modules



/***/ }),

/***/ "./node_modules/@popperjs/core/lib/popper.js":
/*!***************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/popper.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   applyStyles: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.applyStyles),
/* harmony export */   arrow: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.arrow),
/* harmony export */   computeStyles: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.computeStyles),
/* harmony export */   createPopper: () => (/* binding */ createPopper),
/* harmony export */   createPopperLite: () => (/* reexport safe */ _popper_lite_js__WEBPACK_IMPORTED_MODULE_11__.createPopper),
/* harmony export */   defaultModifiers: () => (/* binding */ defaultModifiers),
/* harmony export */   detectOverflow: () => (/* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_10__["default"]),
/* harmony export */   eventListeners: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.eventListeners),
/* harmony export */   flip: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.flip),
/* harmony export */   hide: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.hide),
/* harmony export */   offset: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.offset),
/* harmony export */   popperGenerator: () => (/* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_9__.popperGenerator),
/* harmony export */   popperOffsets: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.popperOffsets),
/* harmony export */   preventOverflow: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.preventOverflow)
/* harmony export */ });
/* harmony import */ var _createPopper_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./createPopper.js */ "./node_modules/@popperjs/core/lib/createPopper.js");
/* harmony import */ var _createPopper_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./createPopper.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _modifiers_eventListeners_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modifiers/eventListeners.js */ "./node_modules/@popperjs/core/lib/modifiers/eventListeners.js");
/* harmony import */ var _modifiers_popperOffsets_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modifiers/popperOffsets.js */ "./node_modules/@popperjs/core/lib/modifiers/popperOffsets.js");
/* harmony import */ var _modifiers_computeStyles_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modifiers/computeStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/computeStyles.js");
/* harmony import */ var _modifiers_applyStyles_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modifiers/applyStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/applyStyles.js");
/* harmony import */ var _modifiers_offset_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./modifiers/offset.js */ "./node_modules/@popperjs/core/lib/modifiers/offset.js");
/* harmony import */ var _modifiers_flip_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./modifiers/flip.js */ "./node_modules/@popperjs/core/lib/modifiers/flip.js");
/* harmony import */ var _modifiers_preventOverflow_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./modifiers/preventOverflow.js */ "./node_modules/@popperjs/core/lib/modifiers/preventOverflow.js");
/* harmony import */ var _modifiers_arrow_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./modifiers/arrow.js */ "./node_modules/@popperjs/core/lib/modifiers/arrow.js");
/* harmony import */ var _modifiers_hide_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./modifiers/hide.js */ "./node_modules/@popperjs/core/lib/modifiers/hide.js");
/* harmony import */ var _popper_lite_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./popper-lite.js */ "./node_modules/@popperjs/core/lib/popper-lite.js");
/* harmony import */ var _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./modifiers/index.js */ "./node_modules/@popperjs/core/lib/modifiers/index.js");










var defaultModifiers = [_modifiers_eventListeners_js__WEBPACK_IMPORTED_MODULE_0__["default"], _modifiers_popperOffsets_js__WEBPACK_IMPORTED_MODULE_1__["default"], _modifiers_computeStyles_js__WEBPACK_IMPORTED_MODULE_2__["default"], _modifiers_applyStyles_js__WEBPACK_IMPORTED_MODULE_3__["default"], _modifiers_offset_js__WEBPACK_IMPORTED_MODULE_4__["default"], _modifiers_flip_js__WEBPACK_IMPORTED_MODULE_5__["default"], _modifiers_preventOverflow_js__WEBPACK_IMPORTED_MODULE_6__["default"], _modifiers_arrow_js__WEBPACK_IMPORTED_MODULE_7__["default"], _modifiers_hide_js__WEBPACK_IMPORTED_MODULE_8__["default"]];
var createPopper = /*#__PURE__*/(0,_createPopper_js__WEBPACK_IMPORTED_MODULE_9__.popperGenerator)({
  defaultModifiers: defaultModifiers
}); // eslint-disable-next-line import/no-unused-modules

 // eslint-disable-next-line import/no-unused-modules

 // eslint-disable-next-line import/no-unused-modules



/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/computeAutoPlacement.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/computeAutoPlacement.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ computeAutoPlacement)
/* harmony export */ });
/* harmony import */ var _getVariation_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getVariation.js */ "./node_modules/@popperjs/core/lib/utils/getVariation.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _detectOverflow_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./detectOverflow.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _getBasePlacement_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");




function computeAutoPlacement(state, options) {
  if (options === void 0) {
    options = {};
  }

  var _options = options,
      placement = _options.placement,
      boundary = _options.boundary,
      rootBoundary = _options.rootBoundary,
      padding = _options.padding,
      flipVariations = _options.flipVariations,
      _options$allowedAutoP = _options.allowedAutoPlacements,
      allowedAutoPlacements = _options$allowedAutoP === void 0 ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.placements : _options$allowedAutoP;
  var variation = (0,_getVariation_js__WEBPACK_IMPORTED_MODULE_1__["default"])(placement);
  var placements = variation ? flipVariations ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.variationPlacements : _enums_js__WEBPACK_IMPORTED_MODULE_0__.variationPlacements.filter(function (placement) {
    return (0,_getVariation_js__WEBPACK_IMPORTED_MODULE_1__["default"])(placement) === variation;
  }) : _enums_js__WEBPACK_IMPORTED_MODULE_0__.basePlacements;
  var allowedPlacements = placements.filter(function (placement) {
    return allowedAutoPlacements.indexOf(placement) >= 0;
  });

  if (allowedPlacements.length === 0) {
    allowedPlacements = placements;
  } // $FlowFixMe[incompatible-type]: Flow seems to have problems with two array unions...


  var overflows = allowedPlacements.reduce(function (acc, placement) {
    acc[placement] = (0,_detectOverflow_js__WEBPACK_IMPORTED_MODULE_2__["default"])(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      padding: padding
    })[(0,_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(placement)];
    return acc;
  }, {});
  return Object.keys(overflows).sort(function (a, b) {
    return overflows[a] - overflows[b];
  });
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/computeOffsets.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/computeOffsets.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ computeOffsets)
/* harmony export */ });
/* harmony import */ var _getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _getVariation_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getVariation.js */ "./node_modules/@popperjs/core/lib/utils/getVariation.js");
/* harmony import */ var _getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getMainAxisFromPlacement.js */ "./node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");




function computeOffsets(_ref) {
  var reference = _ref.reference,
      element = _ref.element,
      placement = _ref.placement;
  var basePlacement = placement ? (0,_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(placement) : null;
  var variation = placement ? (0,_getVariation_js__WEBPACK_IMPORTED_MODULE_1__["default"])(placement) : null;
  var commonX = reference.x + reference.width / 2 - element.width / 2;
  var commonY = reference.y + reference.height / 2 - element.height / 2;
  var offsets;

  switch (basePlacement) {
    case _enums_js__WEBPACK_IMPORTED_MODULE_2__.top:
      offsets = {
        x: commonX,
        y: reference.y - element.height
      };
      break;

    case _enums_js__WEBPACK_IMPORTED_MODULE_2__.bottom:
      offsets = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;

    case _enums_js__WEBPACK_IMPORTED_MODULE_2__.right:
      offsets = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;

    case _enums_js__WEBPACK_IMPORTED_MODULE_2__.left:
      offsets = {
        x: reference.x - element.width,
        y: commonY
      };
      break;

    default:
      offsets = {
        x: reference.x,
        y: reference.y
      };
  }

  var mainAxis = basePlacement ? (0,_getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(basePlacement) : null;

  if (mainAxis != null) {
    var len = mainAxis === 'y' ? 'height' : 'width';

    switch (variation) {
      case _enums_js__WEBPACK_IMPORTED_MODULE_2__.start:
        offsets[mainAxis] = offsets[mainAxis] - (reference[len] / 2 - element[len] / 2);
        break;

      case _enums_js__WEBPACK_IMPORTED_MODULE_2__.end:
        offsets[mainAxis] = offsets[mainAxis] + (reference[len] / 2 - element[len] / 2);
        break;

      default:
    }
  }

  return offsets;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/debounce.js":
/*!***********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/debounce.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ debounce)
/* harmony export */ });
function debounce(fn) {
  var pending;
  return function () {
    if (!pending) {
      pending = new Promise(function (resolve) {
        Promise.resolve().then(function () {
          pending = undefined;
          resolve(fn());
        });
      });
    }

    return pending;
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/detectOverflow.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ detectOverflow)
/* harmony export */ });
/* harmony import */ var _dom_utils_getClippingRect_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../dom-utils/getClippingRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getClippingRect.js");
/* harmony import */ var _dom_utils_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../dom-utils/getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _dom_utils_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../dom-utils/getBoundingClientRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js");
/* harmony import */ var _computeOffsets_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./computeOffsets.js */ "./node_modules/@popperjs/core/lib/utils/computeOffsets.js");
/* harmony import */ var _rectToClientRect_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./rectToClientRect.js */ "./node_modules/@popperjs/core/lib/utils/rectToClientRect.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../dom-utils/instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _mergePaddingObject_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mergePaddingObject.js */ "./node_modules/@popperjs/core/lib/utils/mergePaddingObject.js");
/* harmony import */ var _expandToHashMap_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./expandToHashMap.js */ "./node_modules/@popperjs/core/lib/utils/expandToHashMap.js");








 // eslint-disable-next-line import/no-unused-modules

function detectOverflow(state, options) {
  if (options === void 0) {
    options = {};
  }

  var _options = options,
      _options$placement = _options.placement,
      placement = _options$placement === void 0 ? state.placement : _options$placement,
      _options$strategy = _options.strategy,
      strategy = _options$strategy === void 0 ? state.strategy : _options$strategy,
      _options$boundary = _options.boundary,
      boundary = _options$boundary === void 0 ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.clippingParents : _options$boundary,
      _options$rootBoundary = _options.rootBoundary,
      rootBoundary = _options$rootBoundary === void 0 ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.viewport : _options$rootBoundary,
      _options$elementConte = _options.elementContext,
      elementContext = _options$elementConte === void 0 ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.popper : _options$elementConte,
      _options$altBoundary = _options.altBoundary,
      altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary,
      _options$padding = _options.padding,
      padding = _options$padding === void 0 ? 0 : _options$padding;
  var paddingObject = (0,_mergePaddingObject_js__WEBPACK_IMPORTED_MODULE_1__["default"])(typeof padding !== 'number' ? padding : (0,_expandToHashMap_js__WEBPACK_IMPORTED_MODULE_2__["default"])(padding, _enums_js__WEBPACK_IMPORTED_MODULE_0__.basePlacements));
  var altContext = elementContext === _enums_js__WEBPACK_IMPORTED_MODULE_0__.popper ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.reference : _enums_js__WEBPACK_IMPORTED_MODULE_0__.popper;
  var popperRect = state.rects.popper;
  var element = state.elements[altBoundary ? altContext : elementContext];
  var clippingClientRect = (0,_dom_utils_getClippingRect_js__WEBPACK_IMPORTED_MODULE_3__["default"])((0,_dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_4__.isElement)(element) ? element : element.contextElement || (0,_dom_utils_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_5__["default"])(state.elements.popper), boundary, rootBoundary, strategy);
  var referenceClientRect = (0,_dom_utils_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_6__["default"])(state.elements.reference);
  var popperOffsets = (0,_computeOffsets_js__WEBPACK_IMPORTED_MODULE_7__["default"])({
    reference: referenceClientRect,
    element: popperRect,
    strategy: 'absolute',
    placement: placement
  });
  var popperClientRect = (0,_rectToClientRect_js__WEBPACK_IMPORTED_MODULE_8__["default"])(Object.assign({}, popperRect, popperOffsets));
  var elementClientRect = elementContext === _enums_js__WEBPACK_IMPORTED_MODULE_0__.popper ? popperClientRect : referenceClientRect; // positive = overflowing the clipping rect
  // 0 or negative = within the clipping rect

  var overflowOffsets = {
    top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
    bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
    left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
    right: elementClientRect.right - clippingClientRect.right + paddingObject.right
  };
  var offsetData = state.modifiersData.offset; // Offsets can be applied only to the popper element

  if (elementContext === _enums_js__WEBPACK_IMPORTED_MODULE_0__.popper && offsetData) {
    var offset = offsetData[placement];
    Object.keys(overflowOffsets).forEach(function (key) {
      var multiply = [_enums_js__WEBPACK_IMPORTED_MODULE_0__.right, _enums_js__WEBPACK_IMPORTED_MODULE_0__.bottom].indexOf(key) >= 0 ? 1 : -1;
      var axis = [_enums_js__WEBPACK_IMPORTED_MODULE_0__.top, _enums_js__WEBPACK_IMPORTED_MODULE_0__.bottom].indexOf(key) >= 0 ? 'y' : 'x';
      overflowOffsets[key] += offset[axis] * multiply;
    });
  }

  return overflowOffsets;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/expandToHashMap.js":
/*!******************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/expandToHashMap.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ expandToHashMap)
/* harmony export */ });
function expandToHashMap(value, keys) {
  return keys.reduce(function (hashMap, key) {
    hashMap[key] = value;
    return hashMap;
  }, {});
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getAltAxis.js":
/*!*************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getAltAxis.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getAltAxis)
/* harmony export */ });
function getAltAxis(axis) {
  return axis === 'x' ? 'y' : 'x';
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getBasePlacement.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getBasePlacement)
/* harmony export */ });

function getBasePlacement(placement) {
  return placement.split('-')[0];
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getFreshSideObject.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getFreshSideObject.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getFreshSideObject)
/* harmony export */ });
function getFreshSideObject() {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getMainAxisFromPlacement)
/* harmony export */ });
function getMainAxisFromPlacement(placement) {
  return ['top', 'bottom'].indexOf(placement) >= 0 ? 'x' : 'y';
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getOppositePlacement.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getOppositePlacement.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getOppositePlacement)
/* harmony export */ });
var hash = {
  left: 'right',
  right: 'left',
  bottom: 'top',
  top: 'bottom'
};
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, function (matched) {
    return hash[matched];
  });
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getOppositeVariationPlacement.js":
/*!********************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getOppositeVariationPlacement.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getOppositeVariationPlacement)
/* harmony export */ });
var hash = {
  start: 'end',
  end: 'start'
};
function getOppositeVariationPlacement(placement) {
  return placement.replace(/start|end/g, function (matched) {
    return hash[matched];
  });
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getVariation.js":
/*!***************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getVariation.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getVariation)
/* harmony export */ });
function getVariation(placement) {
  return placement.split('-')[1];
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/math.js":
/*!*******************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/math.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   max: () => (/* binding */ max),
/* harmony export */   min: () => (/* binding */ min),
/* harmony export */   round: () => (/* binding */ round)
/* harmony export */ });
var max = Math.max;
var min = Math.min;
var round = Math.round;

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/mergeByName.js":
/*!**************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/mergeByName.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ mergeByName)
/* harmony export */ });
function mergeByName(modifiers) {
  var merged = modifiers.reduce(function (merged, current) {
    var existing = merged[current.name];
    merged[current.name] = existing ? Object.assign({}, existing, current, {
      options: Object.assign({}, existing.options, current.options),
      data: Object.assign({}, existing.data, current.data)
    }) : current;
    return merged;
  }, {}); // IE11 does not support Object.values

  return Object.keys(merged).map(function (key) {
    return merged[key];
  });
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/mergePaddingObject.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/mergePaddingObject.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ mergePaddingObject)
/* harmony export */ });
/* harmony import */ var _getFreshSideObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getFreshSideObject.js */ "./node_modules/@popperjs/core/lib/utils/getFreshSideObject.js");

function mergePaddingObject(paddingObject) {
  return Object.assign({}, (0,_getFreshSideObject_js__WEBPACK_IMPORTED_MODULE_0__["default"])(), paddingObject);
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/orderModifiers.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/orderModifiers.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ orderModifiers)
/* harmony export */ });
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
 // source: https://stackoverflow.com/questions/49875255

function order(modifiers) {
  var map = new Map();
  var visited = new Set();
  var result = [];
  modifiers.forEach(function (modifier) {
    map.set(modifier.name, modifier);
  }); // On visiting object, check for its dependencies and visit them recursively

  function sort(modifier) {
    visited.add(modifier.name);
    var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
    requires.forEach(function (dep) {
      if (!visited.has(dep)) {
        var depModifier = map.get(dep);

        if (depModifier) {
          sort(depModifier);
        }
      }
    });
    result.push(modifier);
  }

  modifiers.forEach(function (modifier) {
    if (!visited.has(modifier.name)) {
      // check for visited object
      sort(modifier);
    }
  });
  return result;
}

function orderModifiers(modifiers) {
  // order based on dependencies
  var orderedModifiers = order(modifiers); // order based on phase

  return _enums_js__WEBPACK_IMPORTED_MODULE_0__.modifierPhases.reduce(function (acc, phase) {
    return acc.concat(orderedModifiers.filter(function (modifier) {
      return modifier.phase === phase;
    }));
  }, []);
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/rectToClientRect.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/rectToClientRect.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ rectToClientRect)
/* harmony export */ });
function rectToClientRect(rect) {
  return Object.assign({}, rect, {
    left: rect.x,
    top: rect.y,
    right: rect.x + rect.width,
    bottom: rect.y + rect.height
  });
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/userAgent.js":
/*!************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/userAgent.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getUAString)
/* harmony export */ });
function getUAString() {
  var uaData = navigator.userAgentData;

  if (uaData != null && uaData.brands && Array.isArray(uaData.brands)) {
    return uaData.brands.map(function (item) {
      return item.brand + "/" + item.version;
    }).join(' ');
  }

  return navigator.userAgent;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/within.js":
/*!*********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/within.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   within: () => (/* binding */ within),
/* harmony export */   withinMaxClamp: () => (/* binding */ withinMaxClamp)
/* harmony export */ });
/* harmony import */ var _math_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");

function within(min, value, max) {
  return (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.max)(min, (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.min)(value, max));
}
function withinMaxClamp(min, value, max) {
  var v = within(min, value, max);
  return v > max ? max : v;
}

/***/ }),

/***/ "./node_modules/axios/index.js":
/*!*************************************!*\
  !*** ./node_modules/axios/index.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(/*! ./lib/axios */ "./node_modules/axios/lib/axios.js");

/***/ }),

/***/ "./node_modules/axios/lib/adapters/xhr.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/adapters/xhr.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var settle = __webpack_require__(/*! ./../core/settle */ "./node_modules/axios/lib/core/settle.js");
var cookies = __webpack_require__(/*! ./../helpers/cookies */ "./node_modules/axios/lib/helpers/cookies.js");
var buildURL = __webpack_require__(/*! ./../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var buildFullPath = __webpack_require__(/*! ../core/buildFullPath */ "./node_modules/axios/lib/core/buildFullPath.js");
var parseHeaders = __webpack_require__(/*! ./../helpers/parseHeaders */ "./node_modules/axios/lib/helpers/parseHeaders.js");
var isURLSameOrigin = __webpack_require__(/*! ./../helpers/isURLSameOrigin */ "./node_modules/axios/lib/helpers/isURLSameOrigin.js");
var createError = __webpack_require__(/*! ../core/createError */ "./node_modules/axios/lib/core/createError.js");
var defaults = __webpack_require__(/*! ../defaults */ "./node_modules/axios/lib/defaults.js");
var Cancel = __webpack_require__(/*! ../cancel/Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;
    var responseType = config.responseType;
    var onCanceled;
    function done() {
      if (config.cancelToken) {
        config.cancelToken.unsubscribe(onCanceled);
      }

      if (config.signal) {
        config.signal.removeEventListener('abort', onCanceled);
      }
    }

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    function onloadend() {
      if (!request) {
        return;
      }
      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !responseType || responseType === 'text' ||  responseType === 'json' ?
        request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(function _resolve(value) {
        resolve(value);
        done();
      }, function _reject(err) {
        reject(err);
        done();
      }, response);

      // Clean up request
      request = null;
    }

    if ('onloadend' in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }
        // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'
        setTimeout(onloadend);
      };
    }

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = config.timeout ? 'timeout of ' + config.timeout + 'ms exceeded' : 'timeout exceeded';
      var transitional = config.transitional || defaults.transitional;
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(
        timeoutErrorMessage,
        config,
        transitional.clarifyTimeoutError ? 'ETIMEDOUT' : 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (responseType && responseType !== 'json') {
      request.responseType = config.responseType;
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken || config.signal) {
      // Handle cancellation
      // eslint-disable-next-line func-names
      onCanceled = function(cancel) {
        if (!request) {
          return;
        }
        reject(!cancel || (cancel && cancel.type) ? new Cancel('canceled') : cancel);
        request.abort();
        request = null;
      };

      config.cancelToken && config.cancelToken.subscribe(onCanceled);
      if (config.signal) {
        config.signal.aborted ? onCanceled() : config.signal.addEventListener('abort', onCanceled);
      }
    }

    if (!requestData) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/axios.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/axios.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");
var Axios = __webpack_require__(/*! ./core/Axios */ "./node_modules/axios/lib/core/Axios.js");
var mergeConfig = __webpack_require__(/*! ./core/mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");
var defaults = __webpack_require__(/*! ./defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  // Factory for creating new instances
  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig(defaultConfig, instanceConfig));
  };

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__(/*! ./cancel/Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");
axios.CancelToken = __webpack_require__(/*! ./cancel/CancelToken */ "./node_modules/axios/lib/cancel/CancelToken.js");
axios.isCancel = __webpack_require__(/*! ./cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");
axios.VERSION = (__webpack_require__(/*! ./env/data */ "./node_modules/axios/lib/env/data.js").version);

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(/*! ./helpers/spread */ "./node_modules/axios/lib/helpers/spread.js");

// Expose isAxiosError
axios.isAxiosError = __webpack_require__(/*! ./helpers/isAxiosError */ "./node_modules/axios/lib/helpers/isAxiosError.js");

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports["default"] = axios;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/Cancel.js":
/*!*************************************************!*\
  !*** ./node_modules/axios/lib/cancel/Cancel.js ***!
  \*************************************************/
/***/ ((module) => {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/CancelToken.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/cancel/CancelToken.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var Cancel = __webpack_require__(/*! ./Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;

  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;

  // eslint-disable-next-line func-names
  this.promise.then(function(cancel) {
    if (!token._listeners) return;

    var i;
    var l = token._listeners.length;

    for (i = 0; i < l; i++) {
      token._listeners[i](cancel);
    }
    token._listeners = null;
  });

  // eslint-disable-next-line func-names
  this.promise.then = function(onfulfilled) {
    var _resolve;
    // eslint-disable-next-line func-names
    var promise = new Promise(function(resolve) {
      token.subscribe(resolve);
      _resolve = resolve;
    }).then(onfulfilled);

    promise.cancel = function reject() {
      token.unsubscribe(_resolve);
    };

    return promise;
  };

  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Subscribe to the cancel signal
 */

CancelToken.prototype.subscribe = function subscribe(listener) {
  if (this.reason) {
    listener(this.reason);
    return;
  }

  if (this._listeners) {
    this._listeners.push(listener);
  } else {
    this._listeners = [listener];
  }
};

/**
 * Unsubscribe from the cancel signal
 */

CancelToken.prototype.unsubscribe = function unsubscribe(listener) {
  if (!this._listeners) {
    return;
  }
  var index = this._listeners.indexOf(listener);
  if (index !== -1) {
    this._listeners.splice(index, 1);
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/isCancel.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/cancel/isCancel.js ***!
  \***************************************************/
/***/ ((module) => {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/Axios.js":
/*!**********************************************!*\
  !*** ./node_modules/axios/lib/core/Axios.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var buildURL = __webpack_require__(/*! ../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var InterceptorManager = __webpack_require__(/*! ./InterceptorManager */ "./node_modules/axios/lib/core/InterceptorManager.js");
var dispatchRequest = __webpack_require__(/*! ./dispatchRequest */ "./node_modules/axios/lib/core/dispatchRequest.js");
var mergeConfig = __webpack_require__(/*! ./mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");
var validator = __webpack_require__(/*! ../helpers/validator */ "./node_modules/axios/lib/helpers/validator.js");

var validators = validator.validators;
/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(configOrUrl, config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof configOrUrl === 'string') {
    config = config || {};
    config.url = configOrUrl;
  } else {
    config = configOrUrl || {};
  }

  if (!config.url) {
    throw new Error('Provided config url is not valid');
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  var transitional = config.transitional;

  if (transitional !== undefined) {
    validator.assertOptions(transitional, {
      silentJSONParsing: validators.transitional(validators.boolean),
      forcedJSONParsing: validators.transitional(validators.boolean),
      clarifyTimeoutError: validators.transitional(validators.boolean)
    }, false);
  }

  // filter out skipped interceptors
  var requestInterceptorChain = [];
  var synchronousRequestInterceptors = true;
  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
      return;
    }

    synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

    requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  var responseInterceptorChain = [];
  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
  });

  var promise;

  if (!synchronousRequestInterceptors) {
    var chain = [dispatchRequest, undefined];

    Array.prototype.unshift.apply(chain, requestInterceptorChain);
    chain = chain.concat(responseInterceptorChain);

    promise = Promise.resolve(config);
    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }

    return promise;
  }


  var newConfig = config;
  while (requestInterceptorChain.length) {
    var onFulfilled = requestInterceptorChain.shift();
    var onRejected = requestInterceptorChain.shift();
    try {
      newConfig = onFulfilled(newConfig);
    } catch (error) {
      onRejected(error);
      break;
    }
  }

  try {
    promise = dispatchRequest(newConfig);
  } catch (error) {
    return Promise.reject(error);
  }

  while (responseInterceptorChain.length) {
    promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  if (!config.url) {
    throw new Error('Provided config url is not valid');
  }
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: (config || {}).data
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),

/***/ "./node_modules/axios/lib/core/InterceptorManager.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/core/InterceptorManager.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected, options) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected,
    synchronous: options ? options.synchronous : false,
    runWhen: options ? options.runWhen : null
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),

/***/ "./node_modules/axios/lib/core/buildFullPath.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/buildFullPath.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var isAbsoluteURL = __webpack_require__(/*! ../helpers/isAbsoluteURL */ "./node_modules/axios/lib/helpers/isAbsoluteURL.js");
var combineURLs = __webpack_require__(/*! ../helpers/combineURLs */ "./node_modules/axios/lib/helpers/combineURLs.js");

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/createError.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/createError.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var enhanceError = __webpack_require__(/*! ./enhanceError */ "./node_modules/axios/lib/core/enhanceError.js");

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/dispatchRequest.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/core/dispatchRequest.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var transformData = __webpack_require__(/*! ./transformData */ "./node_modules/axios/lib/core/transformData.js");
var isCancel = __webpack_require__(/*! ../cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");
var defaults = __webpack_require__(/*! ../defaults */ "./node_modules/axios/lib/defaults.js");
var Cancel = __webpack_require__(/*! ../cancel/Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }

  if (config.signal && config.signal.aborted) {
    throw new Cancel('canceled');
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData.call(
    config,
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData.call(
      config,
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/core/enhanceError.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/core/enhanceError.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code,
      status: this.response && this.response.status ? this.response.status : null
    };
  };
  return error;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/mergeConfig.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/mergeConfig.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  function getMergedValue(target, source) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge(target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  // eslint-disable-next-line consistent-return
  function mergeDeepProperties(prop) {
    if (!utils.isUndefined(config2[prop])) {
      return getMergedValue(config1[prop], config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      return getMergedValue(undefined, config1[prop]);
    }
  }

  // eslint-disable-next-line consistent-return
  function valueFromConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      return getMergedValue(undefined, config2[prop]);
    }
  }

  // eslint-disable-next-line consistent-return
  function defaultToConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      return getMergedValue(undefined, config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      return getMergedValue(undefined, config1[prop]);
    }
  }

  // eslint-disable-next-line consistent-return
  function mergeDirectKeys(prop) {
    if (prop in config2) {
      return getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      return getMergedValue(undefined, config1[prop]);
    }
  }

  var mergeMap = {
    'url': valueFromConfig2,
    'method': valueFromConfig2,
    'data': valueFromConfig2,
    'baseURL': defaultToConfig2,
    'transformRequest': defaultToConfig2,
    'transformResponse': defaultToConfig2,
    'paramsSerializer': defaultToConfig2,
    'timeout': defaultToConfig2,
    'timeoutMessage': defaultToConfig2,
    'withCredentials': defaultToConfig2,
    'adapter': defaultToConfig2,
    'responseType': defaultToConfig2,
    'xsrfCookieName': defaultToConfig2,
    'xsrfHeaderName': defaultToConfig2,
    'onUploadProgress': defaultToConfig2,
    'onDownloadProgress': defaultToConfig2,
    'decompress': defaultToConfig2,
    'maxContentLength': defaultToConfig2,
    'maxBodyLength': defaultToConfig2,
    'transport': defaultToConfig2,
    'httpAgent': defaultToConfig2,
    'httpsAgent': defaultToConfig2,
    'cancelToken': defaultToConfig2,
    'socketPath': defaultToConfig2,
    'responseEncoding': defaultToConfig2,
    'validateStatus': mergeDirectKeys
  };

  utils.forEach(Object.keys(config1).concat(Object.keys(config2)), function computeConfigValue(prop) {
    var merge = mergeMap[prop] || mergeDeepProperties;
    var configValue = merge(prop);
    (utils.isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
  });

  return config;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/settle.js":
/*!***********************************************!*\
  !*** ./node_modules/axios/lib/core/settle.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var createError = __webpack_require__(/*! ./createError */ "./node_modules/axios/lib/core/createError.js");

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),

/***/ "./node_modules/axios/lib/core/transformData.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/transformData.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var defaults = __webpack_require__(/*! ./../defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  var context = this || defaults;
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn.call(context, data, headers);
  });

  return data;
};


/***/ }),

/***/ "./node_modules/axios/lib/defaults.js":
/*!********************************************!*\
  !*** ./node_modules/axios/lib/defaults.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var process = __webpack_require__(/*! process/browser.js */ "./node_modules/process/browser.js");


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var normalizeHeaderName = __webpack_require__(/*! ./helpers/normalizeHeaderName */ "./node_modules/axios/lib/helpers/normalizeHeaderName.js");
var enhanceError = __webpack_require__(/*! ./core/enhanceError */ "./node_modules/axios/lib/core/enhanceError.js");

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(/*! ./adapters/xhr */ "./node_modules/axios/lib/adapters/xhr.js");
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = __webpack_require__(/*! ./adapters/http */ "./node_modules/axios/lib/adapters/xhr.js");
  }
  return adapter;
}

function stringifySafely(rawValue, parser, encoder) {
  if (utils.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils.trim(rawValue);
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e;
      }
    }
  }

  return (encoder || JSON.stringify)(rawValue);
}

var defaults = {

  transitional: {
    silentJSONParsing: true,
    forcedJSONParsing: true,
    clarifyTimeoutError: false
  },

  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');

    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data) || (headers && headers['Content-Type'] === 'application/json')) {
      setContentTypeIfUnset(headers, 'application/json');
      return stringifySafely(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    var transitional = this.transitional || defaults.transitional;
    var silentJSONParsing = transitional && transitional.silentJSONParsing;
    var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    var strictJSONParsing = !silentJSONParsing && this.responseType === 'json';

    if (strictJSONParsing || (forcedJSONParsing && utils.isString(data) && data.length)) {
      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw enhanceError(e, this, 'E_JSON_PARSE');
          }
          throw e;
        }
      }
    }

    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },

  headers: {
    common: {
      'Accept': 'application/json, text/plain, */*'
    }
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;


/***/ }),

/***/ "./node_modules/axios/lib/env/data.js":
/*!********************************************!*\
  !*** ./node_modules/axios/lib/env/data.js ***!
  \********************************************/
/***/ ((module) => {

module.exports = {
  "version": "0.25.0"
};

/***/ }),

/***/ "./node_modules/axios/lib/helpers/bind.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/bind.js ***!
  \************************************************/
/***/ ((module) => {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/buildURL.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/buildURL.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/combineURLs.js":
/*!*******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/combineURLs.js ***!
  \*******************************************************/
/***/ ((module) => {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/cookies.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/helpers/cookies.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAbsoluteURL.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAbsoluteURL.js ***!
  \*********************************************************/
/***/ ((module) => {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAxiosError.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAxiosError.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
module.exports = function isAxiosError(payload) {
  return utils.isObject(payload) && (payload.isAxiosError === true);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isURLSameOrigin.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isURLSameOrigin.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/normalizeHeaderName.js":
/*!***************************************************************!*\
  !*** ./node_modules/axios/lib/helpers/normalizeHeaderName.js ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/parseHeaders.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/parseHeaders.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/spread.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/helpers/spread.js ***!
  \**************************************************/
/***/ ((module) => {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/validator.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/validator.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var VERSION = (__webpack_require__(/*! ../env/data */ "./node_modules/axios/lib/env/data.js").version);

var validators = {};

// eslint-disable-next-line func-names
['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach(function(type, i) {
  validators[type] = function validator(thing) {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
  };
});

var deprecatedWarnings = {};

/**
 * Transitional option validator
 * @param {function|boolean?} validator - set to false if the transitional option has been removed
 * @param {string?} version - deprecated version / removed since version
 * @param {string?} message - some message with additional info
 * @returns {function}
 */
validators.transitional = function transitional(validator, version, message) {
  function formatMessage(opt, desc) {
    return '[Axios v' + VERSION + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
  }

  // eslint-disable-next-line func-names
  return function(value, opt, opts) {
    if (validator === false) {
      throw new Error(formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')));
    }

    if (version && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      // eslint-disable-next-line no-console
      console.warn(
        formatMessage(
          opt,
          ' has been deprecated since v' + version + ' and will be removed in the near future'
        )
      );
    }

    return validator ? validator(value, opt, opts) : true;
  };
};

/**
 * Assert object's properties type
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 */

function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== 'object') {
    throw new TypeError('options must be an object');
  }
  var keys = Object.keys(options);
  var i = keys.length;
  while (i-- > 0) {
    var opt = keys[i];
    var validator = schema[opt];
    if (validator) {
      var value = options[opt];
      var result = value === undefined || validator(value, opt, options);
      if (result !== true) {
        throw new TypeError('option ' + opt + ' must be ' + result);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw Error('Unknown option ' + opt);
    }
  }
}

module.exports = {
  assertOptions: assertOptions,
  validators: validators
};


/***/ }),

/***/ "./node_modules/axios/lib/utils.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/utils.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return Array.isArray(val);
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return toString.call(val) === '[object FormData]';
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (isArrayBuffer(val.buffer));
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
  if (toString.call(val) !== '[object Object]') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return toString.call(val) === '[object URLSearchParams]';
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM
};


/***/ }),

/***/ "./resources/js/app.js":
/*!*****************************!*\
  !*** ./resources/js/app.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var filepond__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! filepond */ "./node_modules/filepond/dist/filepond.js");
/* harmony import */ var filepond__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(filepond__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var filepond_dist_filepond_min_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! filepond/dist/filepond.min.css */ "./node_modules/filepond/dist/filepond.min.css");
/* harmony import */ var filepond_plugin_file_validate_type__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! filepond-plugin-file-validate-type */ "./node_modules/filepond-plugin-file-validate-type/dist/filepond-plugin-file-validate-type.js");
/* harmony import */ var filepond_plugin_file_validate_type__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(filepond_plugin_file_validate_type__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var filepond_plugin_file_validate_size__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! filepond-plugin-file-validate-size */ "./node_modules/filepond-plugin-file-validate-size/dist/filepond-plugin-file-validate-size.js");
/* harmony import */ var filepond_plugin_file_validate_size__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(filepond_plugin_file_validate_size__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var filepond_plugin_image_preview__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! filepond-plugin-image-preview */ "./node_modules/filepond-plugin-image-preview/dist/filepond-plugin-image-preview.js");
/* harmony import */ var filepond_plugin_image_preview__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(filepond_plugin_image_preview__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var filepond_plugin_image_preview_dist_filepond_plugin_image_preview_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css */ "./node_modules/filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css");
__webpack_require__(/*! ./bootstrap */ "./resources/js/bootstrap.js");

// Import FilePond



// (Opsional) Import plugin yang dibutuhkan





// Daftarkan plugin
filepond__WEBPACK_IMPORTED_MODULE_0__.registerPlugin((filepond_plugin_file_validate_type__WEBPACK_IMPORTED_MODULE_2___default()), (filepond_plugin_file_validate_size__WEBPACK_IMPORTED_MODULE_3___default()), (filepond_plugin_image_preview__WEBPACK_IMPORTED_MODULE_4___default()));

// Inisialisasi FilePond
document.addEventListener('DOMContentLoaded', function () {
  filepond__WEBPACK_IMPORTED_MODULE_0__.create(document.querySelector('input[type="file"]'));
});

/***/ }),

/***/ "./resources/js/bootstrap.js":
/*!***********************************!*\
  !*** ./resources/js/bootstrap.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var bootstrap__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! bootstrap */ "./node_modules/bootstrap/dist/js/bootstrap.esm.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_1__);


/**
 * We'll load the axios HTTP library which allows us to easily issue requests
 * to our Laravel back-end. This library automatically handles sending the
 * CSRF token as a header based on the value of the "XSRF" token cookie.
 */


window.axios = (axios__WEBPACK_IMPORTED_MODULE_1___default());
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allows your team to easily build robust real-time web applications.
 */

// import Echo from 'laravel-echo';

// import Pusher from 'pusher-js';
// window.Pusher = Pusher;

// window.Echo = new Echo({
//     broadcaster: 'pusher',
//     key: import.meta.env.VITE_PUSHER_APP_KEY,
//     cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER ?? 'mt1',
//     wsHost: import.meta.env.VITE_PUSHER_HOST ?? `ws-${import.meta.env.VITE_PUSHER_APP_CLUSTER}.pusher.com`,
//     wsPort: import.meta.env.VITE_PUSHER_PORT ?? 80,
//     wssPort: import.meta.env.VITE_PUSHER_PORT ?? 443,
//     forceTLS: (import.meta.env.VITE_PUSHER_SCHEME ?? 'https') === 'https',
//     enabledTransports: ['ws', 'wss'],
// });

/***/ }),

/***/ "./node_modules/bootstrap/dist/js/bootstrap.esm.js":
/*!*********************************************************!*\
  !*** ./node_modules/bootstrap/dist/js/bootstrap.esm.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Alert: () => (/* binding */ Alert),
/* harmony export */   Button: () => (/* binding */ Button),
/* harmony export */   Carousel: () => (/* binding */ Carousel),
/* harmony export */   Collapse: () => (/* binding */ Collapse),
/* harmony export */   Dropdown: () => (/* binding */ Dropdown),
/* harmony export */   Modal: () => (/* binding */ Modal),
/* harmony export */   Offcanvas: () => (/* binding */ Offcanvas),
/* harmony export */   Popover: () => (/* binding */ Popover),
/* harmony export */   ScrollSpy: () => (/* binding */ ScrollSpy),
/* harmony export */   Tab: () => (/* binding */ Tab),
/* harmony export */   Toast: () => (/* binding */ Toast),
/* harmony export */   Tooltip: () => (/* binding */ Tooltip)
/* harmony export */ });
/* harmony import */ var _popperjs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @popperjs/core */ "./node_modules/@popperjs/core/lib/index.js");
/* harmony import */ var _popperjs_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @popperjs/core */ "./node_modules/@popperjs/core/lib/popper.js");
/*!
  * Bootstrap v5.3.3 (https://getbootstrap.com/)
  * Copyright 2011-2024 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */


/**
 * --------------------------------------------------------------------------
 * Bootstrap dom/data.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

/**
 * Constants
 */

const elementMap = new Map();
const Data = {
  set(element, key, instance) {
    if (!elementMap.has(element)) {
      elementMap.set(element, new Map());
    }
    const instanceMap = elementMap.get(element);

    // make it clear we only want one instance per element
    // can be removed later when multiple key/instances are fine to be used
    if (!instanceMap.has(key) && instanceMap.size !== 0) {
      // eslint-disable-next-line no-console
      console.error(`Bootstrap doesn't allow more than one instance per element. Bound instance: ${Array.from(instanceMap.keys())[0]}.`);
      return;
    }
    instanceMap.set(key, instance);
  },
  get(element, key) {
    if (elementMap.has(element)) {
      return elementMap.get(element).get(key) || null;
    }
    return null;
  },
  remove(element, key) {
    if (!elementMap.has(element)) {
      return;
    }
    const instanceMap = elementMap.get(element);
    instanceMap.delete(key);

    // free up element references if there are no instances left for an element
    if (instanceMap.size === 0) {
      elementMap.delete(element);
    }
  }
};

/**
 * --------------------------------------------------------------------------
 * Bootstrap util/index.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

const MAX_UID = 1000000;
const MILLISECONDS_MULTIPLIER = 1000;
const TRANSITION_END = 'transitionend';

/**
 * Properly escape IDs selectors to handle weird IDs
 * @param {string} selector
 * @returns {string}
 */
const parseSelector = selector => {
  if (selector && window.CSS && window.CSS.escape) {
    // document.querySelector needs escaping to handle IDs (html5+) containing for instance /
    selector = selector.replace(/#([^\s"#']+)/g, (match, id) => `#${CSS.escape(id)}`);
  }
  return selector;
};

// Shout-out Angus Croll (https://goo.gl/pxwQGp)
const toType = object => {
  if (object === null || object === undefined) {
    return `${object}`;
  }
  return Object.prototype.toString.call(object).match(/\s([a-z]+)/i)[1].toLowerCase();
};

/**
 * Public Util API
 */

const getUID = prefix => {
  do {
    prefix += Math.floor(Math.random() * MAX_UID);
  } while (document.getElementById(prefix));
  return prefix;
};
const getTransitionDurationFromElement = element => {
  if (!element) {
    return 0;
  }

  // Get transition-duration of the element
  let {
    transitionDuration,
    transitionDelay
  } = window.getComputedStyle(element);
  const floatTransitionDuration = Number.parseFloat(transitionDuration);
  const floatTransitionDelay = Number.parseFloat(transitionDelay);

  // Return 0 if element or transition duration is not found
  if (!floatTransitionDuration && !floatTransitionDelay) {
    return 0;
  }

  // If multiple durations are defined, take the first
  transitionDuration = transitionDuration.split(',')[0];
  transitionDelay = transitionDelay.split(',')[0];
  return (Number.parseFloat(transitionDuration) + Number.parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER;
};
const triggerTransitionEnd = element => {
  element.dispatchEvent(new Event(TRANSITION_END));
};
const isElement = object => {
  if (!object || typeof object !== 'object') {
    return false;
  }
  if (typeof object.jquery !== 'undefined') {
    object = object[0];
  }
  return typeof object.nodeType !== 'undefined';
};
const getElement = object => {
  // it's a jQuery object or a node element
  if (isElement(object)) {
    return object.jquery ? object[0] : object;
  }
  if (typeof object === 'string' && object.length > 0) {
    return document.querySelector(parseSelector(object));
  }
  return null;
};
const isVisible = element => {
  if (!isElement(element) || element.getClientRects().length === 0) {
    return false;
  }
  const elementIsVisible = getComputedStyle(element).getPropertyValue('visibility') === 'visible';
  // Handle `details` element as its content may falsie appear visible when it is closed
  const closedDetails = element.closest('details:not([open])');
  if (!closedDetails) {
    return elementIsVisible;
  }
  if (closedDetails !== element) {
    const summary = element.closest('summary');
    if (summary && summary.parentNode !== closedDetails) {
      return false;
    }
    if (summary === null) {
      return false;
    }
  }
  return elementIsVisible;
};
const isDisabled = element => {
  if (!element || element.nodeType !== Node.ELEMENT_NODE) {
    return true;
  }
  if (element.classList.contains('disabled')) {
    return true;
  }
  if (typeof element.disabled !== 'undefined') {
    return element.disabled;
  }
  return element.hasAttribute('disabled') && element.getAttribute('disabled') !== 'false';
};
const findShadowRoot = element => {
  if (!document.documentElement.attachShadow) {
    return null;
  }

  // Can find the shadow root otherwise it'll return the document
  if (typeof element.getRootNode === 'function') {
    const root = element.getRootNode();
    return root instanceof ShadowRoot ? root : null;
  }
  if (element instanceof ShadowRoot) {
    return element;
  }

  // when we don't find a shadow root
  if (!element.parentNode) {
    return null;
  }
  return findShadowRoot(element.parentNode);
};
const noop = () => {};

/**
 * Trick to restart an element's animation
 *
 * @param {HTMLElement} element
 * @return void
 *
 * @see https://www.charistheo.io/blog/2021/02/restart-a-css-animation-with-javascript/#restarting-a-css-animation
 */
const reflow = element => {
  element.offsetHeight; // eslint-disable-line no-unused-expressions
};
const getjQuery = () => {
  if (window.jQuery && !document.body.hasAttribute('data-bs-no-jquery')) {
    return window.jQuery;
  }
  return null;
};
const DOMContentLoadedCallbacks = [];
const onDOMContentLoaded = callback => {
  if (document.readyState === 'loading') {
    // add listener on the first call when the document is in loading state
    if (!DOMContentLoadedCallbacks.length) {
      document.addEventListener('DOMContentLoaded', () => {
        for (const callback of DOMContentLoadedCallbacks) {
          callback();
        }
      });
    }
    DOMContentLoadedCallbacks.push(callback);
  } else {
    callback();
  }
};
const isRTL = () => document.documentElement.dir === 'rtl';
const defineJQueryPlugin = plugin => {
  onDOMContentLoaded(() => {
    const $ = getjQuery();
    /* istanbul ignore if */
    if ($) {
      const name = plugin.NAME;
      const JQUERY_NO_CONFLICT = $.fn[name];
      $.fn[name] = plugin.jQueryInterface;
      $.fn[name].Constructor = plugin;
      $.fn[name].noConflict = () => {
        $.fn[name] = JQUERY_NO_CONFLICT;
        return plugin.jQueryInterface;
      };
    }
  });
};
const execute = (possibleCallback, args = [], defaultValue = possibleCallback) => {
  return typeof possibleCallback === 'function' ? possibleCallback(...args) : defaultValue;
};
const executeAfterTransition = (callback, transitionElement, waitForTransition = true) => {
  if (!waitForTransition) {
    execute(callback);
    return;
  }
  const durationPadding = 5;
  const emulatedDuration = getTransitionDurationFromElement(transitionElement) + durationPadding;
  let called = false;
  const handler = ({
    target
  }) => {
    if (target !== transitionElement) {
      return;
    }
    called = true;
    transitionElement.removeEventListener(TRANSITION_END, handler);
    execute(callback);
  };
  transitionElement.addEventListener(TRANSITION_END, handler);
  setTimeout(() => {
    if (!called) {
      triggerTransitionEnd(transitionElement);
    }
  }, emulatedDuration);
};

/**
 * Return the previous/next element of a list.
 *
 * @param {array} list    The list of elements
 * @param activeElement   The active element
 * @param shouldGetNext   Choose to get next or previous element
 * @param isCycleAllowed
 * @return {Element|elem} The proper element
 */
const getNextActiveElement = (list, activeElement, shouldGetNext, isCycleAllowed) => {
  const listLength = list.length;
  let index = list.indexOf(activeElement);

  // if the element does not exist in the list return an element
  // depending on the direction and if cycle is allowed
  if (index === -1) {
    return !shouldGetNext && isCycleAllowed ? list[listLength - 1] : list[0];
  }
  index += shouldGetNext ? 1 : -1;
  if (isCycleAllowed) {
    index = (index + listLength) % listLength;
  }
  return list[Math.max(0, Math.min(index, listLength - 1))];
};

/**
 * --------------------------------------------------------------------------
 * Bootstrap dom/event-handler.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const namespaceRegex = /[^.]*(?=\..*)\.|.*/;
const stripNameRegex = /\..*/;
const stripUidRegex = /::\d+$/;
const eventRegistry = {}; // Events storage
let uidEvent = 1;
const customEvents = {
  mouseenter: 'mouseover',
  mouseleave: 'mouseout'
};
const nativeEvents = new Set(['click', 'dblclick', 'mouseup', 'mousedown', 'contextmenu', 'mousewheel', 'DOMMouseScroll', 'mouseover', 'mouseout', 'mousemove', 'selectstart', 'selectend', 'keydown', 'keypress', 'keyup', 'orientationchange', 'touchstart', 'touchmove', 'touchend', 'touchcancel', 'pointerdown', 'pointermove', 'pointerup', 'pointerleave', 'pointercancel', 'gesturestart', 'gesturechange', 'gestureend', 'focus', 'blur', 'change', 'reset', 'select', 'submit', 'focusin', 'focusout', 'load', 'unload', 'beforeunload', 'resize', 'move', 'DOMContentLoaded', 'readystatechange', 'error', 'abort', 'scroll']);

/**
 * Private methods
 */

function makeEventUid(element, uid) {
  return uid && `${uid}::${uidEvent++}` || element.uidEvent || uidEvent++;
}
function getElementEvents(element) {
  const uid = makeEventUid(element);
  element.uidEvent = uid;
  eventRegistry[uid] = eventRegistry[uid] || {};
  return eventRegistry[uid];
}
function bootstrapHandler(element, fn) {
  return function handler(event) {
    hydrateObj(event, {
      delegateTarget: element
    });
    if (handler.oneOff) {
      EventHandler.off(element, event.type, fn);
    }
    return fn.apply(element, [event]);
  };
}
function bootstrapDelegationHandler(element, selector, fn) {
  return function handler(event) {
    const domElements = element.querySelectorAll(selector);
    for (let {
      target
    } = event; target && target !== this; target = target.parentNode) {
      for (const domElement of domElements) {
        if (domElement !== target) {
          continue;
        }
        hydrateObj(event, {
          delegateTarget: target
        });
        if (handler.oneOff) {
          EventHandler.off(element, event.type, selector, fn);
        }
        return fn.apply(target, [event]);
      }
    }
  };
}
function findHandler(events, callable, delegationSelector = null) {
  return Object.values(events).find(event => event.callable === callable && event.delegationSelector === delegationSelector);
}
function normalizeParameters(originalTypeEvent, handler, delegationFunction) {
  const isDelegated = typeof handler === 'string';
  // TODO: tooltip passes `false` instead of selector, so we need to check
  const callable = isDelegated ? delegationFunction : handler || delegationFunction;
  let typeEvent = getTypeEvent(originalTypeEvent);
  if (!nativeEvents.has(typeEvent)) {
    typeEvent = originalTypeEvent;
  }
  return [isDelegated, callable, typeEvent];
}
function addHandler(element, originalTypeEvent, handler, delegationFunction, oneOff) {
  if (typeof originalTypeEvent !== 'string' || !element) {
    return;
  }
  let [isDelegated, callable, typeEvent] = normalizeParameters(originalTypeEvent, handler, delegationFunction);

  // in case of mouseenter or mouseleave wrap the handler within a function that checks for its DOM position
  // this prevents the handler from being dispatched the same way as mouseover or mouseout does
  if (originalTypeEvent in customEvents) {
    const wrapFunction = fn => {
      return function (event) {
        if (!event.relatedTarget || event.relatedTarget !== event.delegateTarget && !event.delegateTarget.contains(event.relatedTarget)) {
          return fn.call(this, event);
        }
      };
    };
    callable = wrapFunction(callable);
  }
  const events = getElementEvents(element);
  const handlers = events[typeEvent] || (events[typeEvent] = {});
  const previousFunction = findHandler(handlers, callable, isDelegated ? handler : null);
  if (previousFunction) {
    previousFunction.oneOff = previousFunction.oneOff && oneOff;
    return;
  }
  const uid = makeEventUid(callable, originalTypeEvent.replace(namespaceRegex, ''));
  const fn = isDelegated ? bootstrapDelegationHandler(element, handler, callable) : bootstrapHandler(element, callable);
  fn.delegationSelector = isDelegated ? handler : null;
  fn.callable = callable;
  fn.oneOff = oneOff;
  fn.uidEvent = uid;
  handlers[uid] = fn;
  element.addEventListener(typeEvent, fn, isDelegated);
}
function removeHandler(element, events, typeEvent, handler, delegationSelector) {
  const fn = findHandler(events[typeEvent], handler, delegationSelector);
  if (!fn) {
    return;
  }
  element.removeEventListener(typeEvent, fn, Boolean(delegationSelector));
  delete events[typeEvent][fn.uidEvent];
}
function removeNamespacedHandlers(element, events, typeEvent, namespace) {
  const storeElementEvent = events[typeEvent] || {};
  for (const [handlerKey, event] of Object.entries(storeElementEvent)) {
    if (handlerKey.includes(namespace)) {
      removeHandler(element, events, typeEvent, event.callable, event.delegationSelector);
    }
  }
}
function getTypeEvent(event) {
  // allow to get the native events from namespaced events ('click.bs.button' --> 'click')
  event = event.replace(stripNameRegex, '');
  return customEvents[event] || event;
}
const EventHandler = {
  on(element, event, handler, delegationFunction) {
    addHandler(element, event, handler, delegationFunction, false);
  },
  one(element, event, handler, delegationFunction) {
    addHandler(element, event, handler, delegationFunction, true);
  },
  off(element, originalTypeEvent, handler, delegationFunction) {
    if (typeof originalTypeEvent !== 'string' || !element) {
      return;
    }
    const [isDelegated, callable, typeEvent] = normalizeParameters(originalTypeEvent, handler, delegationFunction);
    const inNamespace = typeEvent !== originalTypeEvent;
    const events = getElementEvents(element);
    const storeElementEvent = events[typeEvent] || {};
    const isNamespace = originalTypeEvent.startsWith('.');
    if (typeof callable !== 'undefined') {
      // Simplest case: handler is passed, remove that listener ONLY.
      if (!Object.keys(storeElementEvent).length) {
        return;
      }
      removeHandler(element, events, typeEvent, callable, isDelegated ? handler : null);
      return;
    }
    if (isNamespace) {
      for (const elementEvent of Object.keys(events)) {
        removeNamespacedHandlers(element, events, elementEvent, originalTypeEvent.slice(1));
      }
    }
    for (const [keyHandlers, event] of Object.entries(storeElementEvent)) {
      const handlerKey = keyHandlers.replace(stripUidRegex, '');
      if (!inNamespace || originalTypeEvent.includes(handlerKey)) {
        removeHandler(element, events, typeEvent, event.callable, event.delegationSelector);
      }
    }
  },
  trigger(element, event, args) {
    if (typeof event !== 'string' || !element) {
      return null;
    }
    const $ = getjQuery();
    const typeEvent = getTypeEvent(event);
    const inNamespace = event !== typeEvent;
    let jQueryEvent = null;
    let bubbles = true;
    let nativeDispatch = true;
    let defaultPrevented = false;
    if (inNamespace && $) {
      jQueryEvent = $.Event(event, args);
      $(element).trigger(jQueryEvent);
      bubbles = !jQueryEvent.isPropagationStopped();
      nativeDispatch = !jQueryEvent.isImmediatePropagationStopped();
      defaultPrevented = jQueryEvent.isDefaultPrevented();
    }
    const evt = hydrateObj(new Event(event, {
      bubbles,
      cancelable: true
    }), args);
    if (defaultPrevented) {
      evt.preventDefault();
    }
    if (nativeDispatch) {
      element.dispatchEvent(evt);
    }
    if (evt.defaultPrevented && jQueryEvent) {
      jQueryEvent.preventDefault();
    }
    return evt;
  }
};
function hydrateObj(obj, meta = {}) {
  for (const [key, value] of Object.entries(meta)) {
    try {
      obj[key] = value;
    } catch (_unused) {
      Object.defineProperty(obj, key, {
        configurable: true,
        get() {
          return value;
        }
      });
    }
  }
  return obj;
}

/**
 * --------------------------------------------------------------------------
 * Bootstrap dom/manipulator.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

function normalizeData(value) {
  if (value === 'true') {
    return true;
  }
  if (value === 'false') {
    return false;
  }
  if (value === Number(value).toString()) {
    return Number(value);
  }
  if (value === '' || value === 'null') {
    return null;
  }
  if (typeof value !== 'string') {
    return value;
  }
  try {
    return JSON.parse(decodeURIComponent(value));
  } catch (_unused) {
    return value;
  }
}
function normalizeDataKey(key) {
  return key.replace(/[A-Z]/g, chr => `-${chr.toLowerCase()}`);
}
const Manipulator = {
  setDataAttribute(element, key, value) {
    element.setAttribute(`data-bs-${normalizeDataKey(key)}`, value);
  },
  removeDataAttribute(element, key) {
    element.removeAttribute(`data-bs-${normalizeDataKey(key)}`);
  },
  getDataAttributes(element) {
    if (!element) {
      return {};
    }
    const attributes = {};
    const bsKeys = Object.keys(element.dataset).filter(key => key.startsWith('bs') && !key.startsWith('bsConfig'));
    for (const key of bsKeys) {
      let pureKey = key.replace(/^bs/, '');
      pureKey = pureKey.charAt(0).toLowerCase() + pureKey.slice(1, pureKey.length);
      attributes[pureKey] = normalizeData(element.dataset[key]);
    }
    return attributes;
  },
  getDataAttribute(element, key) {
    return normalizeData(element.getAttribute(`data-bs-${normalizeDataKey(key)}`));
  }
};

/**
 * --------------------------------------------------------------------------
 * Bootstrap util/config.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Class definition
 */

class Config {
  // Getters
  static get Default() {
    return {};
  }
  static get DefaultType() {
    return {};
  }
  static get NAME() {
    throw new Error('You have to implement the static method "NAME", for each component!');
  }
  _getConfig(config) {
    config = this._mergeConfigObj(config);
    config = this._configAfterMerge(config);
    this._typeCheckConfig(config);
    return config;
  }
  _configAfterMerge(config) {
    return config;
  }
  _mergeConfigObj(config, element) {
    const jsonConfig = isElement(element) ? Manipulator.getDataAttribute(element, 'config') : {}; // try to parse

    return {
      ...this.constructor.Default,
      ...(typeof jsonConfig === 'object' ? jsonConfig : {}),
      ...(isElement(element) ? Manipulator.getDataAttributes(element) : {}),
      ...(typeof config === 'object' ? config : {})
    };
  }
  _typeCheckConfig(config, configTypes = this.constructor.DefaultType) {
    for (const [property, expectedTypes] of Object.entries(configTypes)) {
      const value = config[property];
      const valueType = isElement(value) ? 'element' : toType(value);
      if (!new RegExp(expectedTypes).test(valueType)) {
        throw new TypeError(`${this.constructor.NAME.toUpperCase()}: Option "${property}" provided type "${valueType}" but expected type "${expectedTypes}".`);
      }
    }
  }
}

/**
 * --------------------------------------------------------------------------
 * Bootstrap base-component.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const VERSION = '5.3.3';

/**
 * Class definition
 */

class BaseComponent extends Config {
  constructor(element, config) {
    super();
    element = getElement(element);
    if (!element) {
      return;
    }
    this._element = element;
    this._config = this._getConfig(config);
    Data.set(this._element, this.constructor.DATA_KEY, this);
  }

  // Public
  dispose() {
    Data.remove(this._element, this.constructor.DATA_KEY);
    EventHandler.off(this._element, this.constructor.EVENT_KEY);
    for (const propertyName of Object.getOwnPropertyNames(this)) {
      this[propertyName] = null;
    }
  }
  _queueCallback(callback, element, isAnimated = true) {
    executeAfterTransition(callback, element, isAnimated);
  }
  _getConfig(config) {
    config = this._mergeConfigObj(config, this._element);
    config = this._configAfterMerge(config);
    this._typeCheckConfig(config);
    return config;
  }

  // Static
  static getInstance(element) {
    return Data.get(getElement(element), this.DATA_KEY);
  }
  static getOrCreateInstance(element, config = {}) {
    return this.getInstance(element) || new this(element, typeof config === 'object' ? config : null);
  }
  static get VERSION() {
    return VERSION;
  }
  static get DATA_KEY() {
    return `bs.${this.NAME}`;
  }
  static get EVENT_KEY() {
    return `.${this.DATA_KEY}`;
  }
  static eventName(name) {
    return `${name}${this.EVENT_KEY}`;
  }
}

/**
 * --------------------------------------------------------------------------
 * Bootstrap dom/selector-engine.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

const getSelector = element => {
  let selector = element.getAttribute('data-bs-target');
  if (!selector || selector === '#') {
    let hrefAttribute = element.getAttribute('href');

    // The only valid content that could double as a selector are IDs or classes,
    // so everything starting with `#` or `.`. If a "real" URL is used as the selector,
    // `document.querySelector` will rightfully complain it is invalid.
    // See https://github.com/twbs/bootstrap/issues/32273
    if (!hrefAttribute || !hrefAttribute.includes('#') && !hrefAttribute.startsWith('.')) {
      return null;
    }

    // Just in case some CMS puts out a full URL with the anchor appended
    if (hrefAttribute.includes('#') && !hrefAttribute.startsWith('#')) {
      hrefAttribute = `#${hrefAttribute.split('#')[1]}`;
    }
    selector = hrefAttribute && hrefAttribute !== '#' ? hrefAttribute.trim() : null;
  }
  return selector ? selector.split(',').map(sel => parseSelector(sel)).join(',') : null;
};
const SelectorEngine = {
  find(selector, element = document.documentElement) {
    return [].concat(...Element.prototype.querySelectorAll.call(element, selector));
  },
  findOne(selector, element = document.documentElement) {
    return Element.prototype.querySelector.call(element, selector);
  },
  children(element, selector) {
    return [].concat(...element.children).filter(child => child.matches(selector));
  },
  parents(element, selector) {
    const parents = [];
    let ancestor = element.parentNode.closest(selector);
    while (ancestor) {
      parents.push(ancestor);
      ancestor = ancestor.parentNode.closest(selector);
    }
    return parents;
  },
  prev(element, selector) {
    let previous = element.previousElementSibling;
    while (previous) {
      if (previous.matches(selector)) {
        return [previous];
      }
      previous = previous.previousElementSibling;
    }
    return [];
  },
  // TODO: this is now unused; remove later along with prev()
  next(element, selector) {
    let next = element.nextElementSibling;
    while (next) {
      if (next.matches(selector)) {
        return [next];
      }
      next = next.nextElementSibling;
    }
    return [];
  },
  focusableChildren(element) {
    const focusables = ['a', 'button', 'input', 'textarea', 'select', 'details', '[tabindex]', '[contenteditable="true"]'].map(selector => `${selector}:not([tabindex^="-"])`).join(',');
    return this.find(focusables, element).filter(el => !isDisabled(el) && isVisible(el));
  },
  getSelectorFromElement(element) {
    const selector = getSelector(element);
    if (selector) {
      return SelectorEngine.findOne(selector) ? selector : null;
    }
    return null;
  },
  getElementFromSelector(element) {
    const selector = getSelector(element);
    return selector ? SelectorEngine.findOne(selector) : null;
  },
  getMultipleElementsFromSelector(element) {
    const selector = getSelector(element);
    return selector ? SelectorEngine.find(selector) : [];
  }
};

/**
 * --------------------------------------------------------------------------
 * Bootstrap util/component-functions.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

const enableDismissTrigger = (component, method = 'hide') => {
  const clickEvent = `click.dismiss${component.EVENT_KEY}`;
  const name = component.NAME;
  EventHandler.on(document, clickEvent, `[data-bs-dismiss="${name}"]`, function (event) {
    if (['A', 'AREA'].includes(this.tagName)) {
      event.preventDefault();
    }
    if (isDisabled(this)) {
      return;
    }
    const target = SelectorEngine.getElementFromSelector(this) || this.closest(`.${name}`);
    const instance = component.getOrCreateInstance(target);

    // Method argument is left, for Alert and only, as it doesn't implement the 'hide' method
    instance[method]();
  });
};

/**
 * --------------------------------------------------------------------------
 * Bootstrap alert.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME$f = 'alert';
const DATA_KEY$a = 'bs.alert';
const EVENT_KEY$b = `.${DATA_KEY$a}`;
const EVENT_CLOSE = `close${EVENT_KEY$b}`;
const EVENT_CLOSED = `closed${EVENT_KEY$b}`;
const CLASS_NAME_FADE$5 = 'fade';
const CLASS_NAME_SHOW$8 = 'show';

/**
 * Class definition
 */

class Alert extends BaseComponent {
  // Getters
  static get NAME() {
    return NAME$f;
  }

  // Public
  close() {
    const closeEvent = EventHandler.trigger(this._element, EVENT_CLOSE);
    if (closeEvent.defaultPrevented) {
      return;
    }
    this._element.classList.remove(CLASS_NAME_SHOW$8);
    const isAnimated = this._element.classList.contains(CLASS_NAME_FADE$5);
    this._queueCallback(() => this._destroyElement(), this._element, isAnimated);
  }

  // Private
  _destroyElement() {
    this._element.remove();
    EventHandler.trigger(this._element, EVENT_CLOSED);
    this.dispose();
  }

  // Static
  static jQueryInterface(config) {
    return this.each(function () {
      const data = Alert.getOrCreateInstance(this);
      if (typeof config !== 'string') {
        return;
      }
      if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
        throw new TypeError(`No method named "${config}"`);
      }
      data[config](this);
    });
  }
}

/**
 * Data API implementation
 */

enableDismissTrigger(Alert, 'close');

/**
 * jQuery
 */

defineJQueryPlugin(Alert);

/**
 * --------------------------------------------------------------------------
 * Bootstrap button.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME$e = 'button';
const DATA_KEY$9 = 'bs.button';
const EVENT_KEY$a = `.${DATA_KEY$9}`;
const DATA_API_KEY$6 = '.data-api';
const CLASS_NAME_ACTIVE$3 = 'active';
const SELECTOR_DATA_TOGGLE$5 = '[data-bs-toggle="button"]';
const EVENT_CLICK_DATA_API$6 = `click${EVENT_KEY$a}${DATA_API_KEY$6}`;

/**
 * Class definition
 */

class Button extends BaseComponent {
  // Getters
  static get NAME() {
    return NAME$e;
  }

  // Public
  toggle() {
    // Toggle class and sync the `aria-pressed` attribute with the return value of the `.toggle()` method
    this._element.setAttribute('aria-pressed', this._element.classList.toggle(CLASS_NAME_ACTIVE$3));
  }

  // Static
  static jQueryInterface(config) {
    return this.each(function () {
      const data = Button.getOrCreateInstance(this);
      if (config === 'toggle') {
        data[config]();
      }
    });
  }
}

/**
 * Data API implementation
 */

EventHandler.on(document, EVENT_CLICK_DATA_API$6, SELECTOR_DATA_TOGGLE$5, event => {
  event.preventDefault();
  const button = event.target.closest(SELECTOR_DATA_TOGGLE$5);
  const data = Button.getOrCreateInstance(button);
  data.toggle();
});

/**
 * jQuery
 */

defineJQueryPlugin(Button);

/**
 * --------------------------------------------------------------------------
 * Bootstrap util/swipe.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME$d = 'swipe';
const EVENT_KEY$9 = '.bs.swipe';
const EVENT_TOUCHSTART = `touchstart${EVENT_KEY$9}`;
const EVENT_TOUCHMOVE = `touchmove${EVENT_KEY$9}`;
const EVENT_TOUCHEND = `touchend${EVENT_KEY$9}`;
const EVENT_POINTERDOWN = `pointerdown${EVENT_KEY$9}`;
const EVENT_POINTERUP = `pointerup${EVENT_KEY$9}`;
const POINTER_TYPE_TOUCH = 'touch';
const POINTER_TYPE_PEN = 'pen';
const CLASS_NAME_POINTER_EVENT = 'pointer-event';
const SWIPE_THRESHOLD = 40;
const Default$c = {
  endCallback: null,
  leftCallback: null,
  rightCallback: null
};
const DefaultType$c = {
  endCallback: '(function|null)',
  leftCallback: '(function|null)',
  rightCallback: '(function|null)'
};

/**
 * Class definition
 */

class Swipe extends Config {
  constructor(element, config) {
    super();
    this._element = element;
    if (!element || !Swipe.isSupported()) {
      return;
    }
    this._config = this._getConfig(config);
    this._deltaX = 0;
    this._supportPointerEvents = Boolean(window.PointerEvent);
    this._initEvents();
  }

  // Getters
  static get Default() {
    return Default$c;
  }
  static get DefaultType() {
    return DefaultType$c;
  }
  static get NAME() {
    return NAME$d;
  }

  // Public
  dispose() {
    EventHandler.off(this._element, EVENT_KEY$9);
  }

  // Private
  _start(event) {
    if (!this._supportPointerEvents) {
      this._deltaX = event.touches[0].clientX;
      return;
    }
    if (this._eventIsPointerPenTouch(event)) {
      this._deltaX = event.clientX;
    }
  }
  _end(event) {
    if (this._eventIsPointerPenTouch(event)) {
      this._deltaX = event.clientX - this._deltaX;
    }
    this._handleSwipe();
    execute(this._config.endCallback);
  }
  _move(event) {
    this._deltaX = event.touches && event.touches.length > 1 ? 0 : event.touches[0].clientX - this._deltaX;
  }
  _handleSwipe() {
    const absDeltaX = Math.abs(this._deltaX);
    if (absDeltaX <= SWIPE_THRESHOLD) {
      return;
    }
    const direction = absDeltaX / this._deltaX;
    this._deltaX = 0;
    if (!direction) {
      return;
    }
    execute(direction > 0 ? this._config.rightCallback : this._config.leftCallback);
  }
  _initEvents() {
    if (this._supportPointerEvents) {
      EventHandler.on(this._element, EVENT_POINTERDOWN, event => this._start(event));
      EventHandler.on(this._element, EVENT_POINTERUP, event => this._end(event));
      this._element.classList.add(CLASS_NAME_POINTER_EVENT);
    } else {
      EventHandler.on(this._element, EVENT_TOUCHSTART, event => this._start(event));
      EventHandler.on(this._element, EVENT_TOUCHMOVE, event => this._move(event));
      EventHandler.on(this._element, EVENT_TOUCHEND, event => this._end(event));
    }
  }
  _eventIsPointerPenTouch(event) {
    return this._supportPointerEvents && (event.pointerType === POINTER_TYPE_PEN || event.pointerType === POINTER_TYPE_TOUCH);
  }

  // Static
  static isSupported() {
    return 'ontouchstart' in document.documentElement || navigator.maxTouchPoints > 0;
  }
}

/**
 * --------------------------------------------------------------------------
 * Bootstrap carousel.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME$c = 'carousel';
const DATA_KEY$8 = 'bs.carousel';
const EVENT_KEY$8 = `.${DATA_KEY$8}`;
const DATA_API_KEY$5 = '.data-api';
const ARROW_LEFT_KEY$1 = 'ArrowLeft';
const ARROW_RIGHT_KEY$1 = 'ArrowRight';
const TOUCHEVENT_COMPAT_WAIT = 500; // Time for mouse compat events to fire after touch

const ORDER_NEXT = 'next';
const ORDER_PREV = 'prev';
const DIRECTION_LEFT = 'left';
const DIRECTION_RIGHT = 'right';
const EVENT_SLIDE = `slide${EVENT_KEY$8}`;
const EVENT_SLID = `slid${EVENT_KEY$8}`;
const EVENT_KEYDOWN$1 = `keydown${EVENT_KEY$8}`;
const EVENT_MOUSEENTER$1 = `mouseenter${EVENT_KEY$8}`;
const EVENT_MOUSELEAVE$1 = `mouseleave${EVENT_KEY$8}`;
const EVENT_DRAG_START = `dragstart${EVENT_KEY$8}`;
const EVENT_LOAD_DATA_API$3 = `load${EVENT_KEY$8}${DATA_API_KEY$5}`;
const EVENT_CLICK_DATA_API$5 = `click${EVENT_KEY$8}${DATA_API_KEY$5}`;
const CLASS_NAME_CAROUSEL = 'carousel';
const CLASS_NAME_ACTIVE$2 = 'active';
const CLASS_NAME_SLIDE = 'slide';
const CLASS_NAME_END = 'carousel-item-end';
const CLASS_NAME_START = 'carousel-item-start';
const CLASS_NAME_NEXT = 'carousel-item-next';
const CLASS_NAME_PREV = 'carousel-item-prev';
const SELECTOR_ACTIVE = '.active';
const SELECTOR_ITEM = '.carousel-item';
const SELECTOR_ACTIVE_ITEM = SELECTOR_ACTIVE + SELECTOR_ITEM;
const SELECTOR_ITEM_IMG = '.carousel-item img';
const SELECTOR_INDICATORS = '.carousel-indicators';
const SELECTOR_DATA_SLIDE = '[data-bs-slide], [data-bs-slide-to]';
const SELECTOR_DATA_RIDE = '[data-bs-ride="carousel"]';
const KEY_TO_DIRECTION = {
  [ARROW_LEFT_KEY$1]: DIRECTION_RIGHT,
  [ARROW_RIGHT_KEY$1]: DIRECTION_LEFT
};
const Default$b = {
  interval: 5000,
  keyboard: true,
  pause: 'hover',
  ride: false,
  touch: true,
  wrap: true
};
const DefaultType$b = {
  interval: '(number|boolean)',
  // TODO:v6 remove boolean support
  keyboard: 'boolean',
  pause: '(string|boolean)',
  ride: '(boolean|string)',
  touch: 'boolean',
  wrap: 'boolean'
};

/**
 * Class definition
 */

class Carousel extends BaseComponent {
  constructor(element, config) {
    super(element, config);
    this._interval = null;
    this._activeElement = null;
    this._isSliding = false;
    this.touchTimeout = null;
    this._swipeHelper = null;
    this._indicatorsElement = SelectorEngine.findOne(SELECTOR_INDICATORS, this._element);
    this._addEventListeners();
    if (this._config.ride === CLASS_NAME_CAROUSEL) {
      this.cycle();
    }
  }

  // Getters
  static get Default() {
    return Default$b;
  }
  static get DefaultType() {
    return DefaultType$b;
  }
  static get NAME() {
    return NAME$c;
  }

  // Public
  next() {
    this._slide(ORDER_NEXT);
  }
  nextWhenVisible() {
    // FIXME TODO use `document.visibilityState`
    // Don't call next when the page isn't visible
    // or the carousel or its parent isn't visible
    if (!document.hidden && isVisible(this._element)) {
      this.next();
    }
  }
  prev() {
    this._slide(ORDER_PREV);
  }
  pause() {
    if (this._isSliding) {
      triggerTransitionEnd(this._element);
    }
    this._clearInterval();
  }
  cycle() {
    this._clearInterval();
    this._updateInterval();
    this._interval = setInterval(() => this.nextWhenVisible(), this._config.interval);
  }
  _maybeEnableCycle() {
    if (!this._config.ride) {
      return;
    }
    if (this._isSliding) {
      EventHandler.one(this._element, EVENT_SLID, () => this.cycle());
      return;
    }
    this.cycle();
  }
  to(index) {
    const items = this._getItems();
    if (index > items.length - 1 || index < 0) {
      return;
    }
    if (this._isSliding) {
      EventHandler.one(this._element, EVENT_SLID, () => this.to(index));
      return;
    }
    const activeIndex = this._getItemIndex(this._getActive());
    if (activeIndex === index) {
      return;
    }
    const order = index > activeIndex ? ORDER_NEXT : ORDER_PREV;
    this._slide(order, items[index]);
  }
  dispose() {
    if (this._swipeHelper) {
      this._swipeHelper.dispose();
    }
    super.dispose();
  }

  // Private
  _configAfterMerge(config) {
    config.defaultInterval = config.interval;
    return config;
  }
  _addEventListeners() {
    if (this._config.keyboard) {
      EventHandler.on(this._element, EVENT_KEYDOWN$1, event => this._keydown(event));
    }
    if (this._config.pause === 'hover') {
      EventHandler.on(this._element, EVENT_MOUSEENTER$1, () => this.pause());
      EventHandler.on(this._element, EVENT_MOUSELEAVE$1, () => this._maybeEnableCycle());
    }
    if (this._config.touch && Swipe.isSupported()) {
      this._addTouchEventListeners();
    }
  }
  _addTouchEventListeners() {
    for (const img of SelectorEngine.find(SELECTOR_ITEM_IMG, this._element)) {
      EventHandler.on(img, EVENT_DRAG_START, event => event.preventDefault());
    }
    const endCallBack = () => {
      if (this._config.pause !== 'hover') {
        return;
      }

      // If it's a touch-enabled device, mouseenter/leave are fired as
      // part of the mouse compatibility events on first tap - the carousel
      // would stop cycling until user tapped out of it;
      // here, we listen for touchend, explicitly pause the carousel
      // (as if it's the second time we tap on it, mouseenter compat event
      // is NOT fired) and after a timeout (to allow for mouse compatibility
      // events to fire) we explicitly restart cycling

      this.pause();
      if (this.touchTimeout) {
        clearTimeout(this.touchTimeout);
      }
      this.touchTimeout = setTimeout(() => this._maybeEnableCycle(), TOUCHEVENT_COMPAT_WAIT + this._config.interval);
    };
    const swipeConfig = {
      leftCallback: () => this._slide(this._directionToOrder(DIRECTION_LEFT)),
      rightCallback: () => this._slide(this._directionToOrder(DIRECTION_RIGHT)),
      endCallback: endCallBack
    };
    this._swipeHelper = new Swipe(this._element, swipeConfig);
  }
  _keydown(event) {
    if (/input|textarea/i.test(event.target.tagName)) {
      return;
    }
    const direction = KEY_TO_DIRECTION[event.key];
    if (direction) {
      event.preventDefault();
      this._slide(this._directionToOrder(direction));
    }
  }
  _getItemIndex(element) {
    return this._getItems().indexOf(element);
  }
  _setActiveIndicatorElement(index) {
    if (!this._indicatorsElement) {
      return;
    }
    const activeIndicator = SelectorEngine.findOne(SELECTOR_ACTIVE, this._indicatorsElement);
    activeIndicator.classList.remove(CLASS_NAME_ACTIVE$2);
    activeIndicator.removeAttribute('aria-current');
    const newActiveIndicator = SelectorEngine.findOne(`[data-bs-slide-to="${index}"]`, this._indicatorsElement);
    if (newActiveIndicator) {
      newActiveIndicator.classList.add(CLASS_NAME_ACTIVE$2);
      newActiveIndicator.setAttribute('aria-current', 'true');
    }
  }
  _updateInterval() {
    const element = this._activeElement || this._getActive();
    if (!element) {
      return;
    }
    const elementInterval = Number.parseInt(element.getAttribute('data-bs-interval'), 10);
    this._config.interval = elementInterval || this._config.defaultInterval;
  }
  _slide(order, element = null) {
    if (this._isSliding) {
      return;
    }
    const activeElement = this._getActive();
    const isNext = order === ORDER_NEXT;
    const nextElement = element || getNextActiveElement(this._getItems(), activeElement, isNext, this._config.wrap);
    if (nextElement === activeElement) {
      return;
    }
    const nextElementIndex = this._getItemIndex(nextElement);
    const triggerEvent = eventName => {
      return EventHandler.trigger(this._element, eventName, {
        relatedTarget: nextElement,
        direction: this._orderToDirection(order),
        from: this._getItemIndex(activeElement),
        to: nextElementIndex
      });
    };
    const slideEvent = triggerEvent(EVENT_SLIDE);
    if (slideEvent.defaultPrevented) {
      return;
    }
    if (!activeElement || !nextElement) {
      // Some weirdness is happening, so we bail
      // TODO: change tests that use empty divs to avoid this check
      return;
    }
    const isCycling = Boolean(this._interval);
    this.pause();
    this._isSliding = true;
    this._setActiveIndicatorElement(nextElementIndex);
    this._activeElement = nextElement;
    const directionalClassName = isNext ? CLASS_NAME_START : CLASS_NAME_END;
    const orderClassName = isNext ? CLASS_NAME_NEXT : CLASS_NAME_PREV;
    nextElement.classList.add(orderClassName);
    reflow(nextElement);
    activeElement.classList.add(directionalClassName);
    nextElement.classList.add(directionalClassName);
    const completeCallBack = () => {
      nextElement.classList.remove(directionalClassName, orderClassName);
      nextElement.classList.add(CLASS_NAME_ACTIVE$2);
      activeElement.classList.remove(CLASS_NAME_ACTIVE$2, orderClassName, directionalClassName);
      this._isSliding = false;
      triggerEvent(EVENT_SLID);
    };
    this._queueCallback(completeCallBack, activeElement, this._isAnimated());
    if (isCycling) {
      this.cycle();
    }
  }
  _isAnimated() {
    return this._element.classList.contains(CLASS_NAME_SLIDE);
  }
  _getActive() {
    return SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element);
  }
  _getItems() {
    return SelectorEngine.find(SELECTOR_ITEM, this._element);
  }
  _clearInterval() {
    if (this._interval) {
      clearInterval(this._interval);
      this._interval = null;
    }
  }
  _directionToOrder(direction) {
    if (isRTL()) {
      return direction === DIRECTION_LEFT ? ORDER_PREV : ORDER_NEXT;
    }
    return direction === DIRECTION_LEFT ? ORDER_NEXT : ORDER_PREV;
  }
  _orderToDirection(order) {
    if (isRTL()) {
      return order === ORDER_PREV ? DIRECTION_LEFT : DIRECTION_RIGHT;
    }
    return order === ORDER_PREV ? DIRECTION_RIGHT : DIRECTION_LEFT;
  }

  // Static
  static jQueryInterface(config) {
    return this.each(function () {
      const data = Carousel.getOrCreateInstance(this, config);
      if (typeof config === 'number') {
        data.to(config);
        return;
      }
      if (typeof config === 'string') {
        if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
          throw new TypeError(`No method named "${config}"`);
        }
        data[config]();
      }
    });
  }
}

/**
 * Data API implementation
 */

EventHandler.on(document, EVENT_CLICK_DATA_API$5, SELECTOR_DATA_SLIDE, function (event) {
  const target = SelectorEngine.getElementFromSelector(this);
  if (!target || !target.classList.contains(CLASS_NAME_CAROUSEL)) {
    return;
  }
  event.preventDefault();
  const carousel = Carousel.getOrCreateInstance(target);
  const slideIndex = this.getAttribute('data-bs-slide-to');
  if (slideIndex) {
    carousel.to(slideIndex);
    carousel._maybeEnableCycle();
    return;
  }
  if (Manipulator.getDataAttribute(this, 'slide') === 'next') {
    carousel.next();
    carousel._maybeEnableCycle();
    return;
  }
  carousel.prev();
  carousel._maybeEnableCycle();
});
EventHandler.on(window, EVENT_LOAD_DATA_API$3, () => {
  const carousels = SelectorEngine.find(SELECTOR_DATA_RIDE);
  for (const carousel of carousels) {
    Carousel.getOrCreateInstance(carousel);
  }
});

/**
 * jQuery
 */

defineJQueryPlugin(Carousel);

/**
 * --------------------------------------------------------------------------
 * Bootstrap collapse.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME$b = 'collapse';
const DATA_KEY$7 = 'bs.collapse';
const EVENT_KEY$7 = `.${DATA_KEY$7}`;
const DATA_API_KEY$4 = '.data-api';
const EVENT_SHOW$6 = `show${EVENT_KEY$7}`;
const EVENT_SHOWN$6 = `shown${EVENT_KEY$7}`;
const EVENT_HIDE$6 = `hide${EVENT_KEY$7}`;
const EVENT_HIDDEN$6 = `hidden${EVENT_KEY$7}`;
const EVENT_CLICK_DATA_API$4 = `click${EVENT_KEY$7}${DATA_API_KEY$4}`;
const CLASS_NAME_SHOW$7 = 'show';
const CLASS_NAME_COLLAPSE = 'collapse';
const CLASS_NAME_COLLAPSING = 'collapsing';
const CLASS_NAME_COLLAPSED = 'collapsed';
const CLASS_NAME_DEEPER_CHILDREN = `:scope .${CLASS_NAME_COLLAPSE} .${CLASS_NAME_COLLAPSE}`;
const CLASS_NAME_HORIZONTAL = 'collapse-horizontal';
const WIDTH = 'width';
const HEIGHT = 'height';
const SELECTOR_ACTIVES = '.collapse.show, .collapse.collapsing';
const SELECTOR_DATA_TOGGLE$4 = '[data-bs-toggle="collapse"]';
const Default$a = {
  parent: null,
  toggle: true
};
const DefaultType$a = {
  parent: '(null|element)',
  toggle: 'boolean'
};

/**
 * Class definition
 */

class Collapse extends BaseComponent {
  constructor(element, config) {
    super(element, config);
    this._isTransitioning = false;
    this._triggerArray = [];
    const toggleList = SelectorEngine.find(SELECTOR_DATA_TOGGLE$4);
    for (const elem of toggleList) {
      const selector = SelectorEngine.getSelectorFromElement(elem);
      const filterElement = SelectorEngine.find(selector).filter(foundElement => foundElement === this._element);
      if (selector !== null && filterElement.length) {
        this._triggerArray.push(elem);
      }
    }
    this._initializeChildren();
    if (!this._config.parent) {
      this._addAriaAndCollapsedClass(this._triggerArray, this._isShown());
    }
    if (this._config.toggle) {
      this.toggle();
    }
  }

  // Getters
  static get Default() {
    return Default$a;
  }
  static get DefaultType() {
    return DefaultType$a;
  }
  static get NAME() {
    return NAME$b;
  }

  // Public
  toggle() {
    if (this._isShown()) {
      this.hide();
    } else {
      this.show();
    }
  }
  show() {
    if (this._isTransitioning || this._isShown()) {
      return;
    }
    let activeChildren = [];

    // find active children
    if (this._config.parent) {
      activeChildren = this._getFirstLevelChildren(SELECTOR_ACTIVES).filter(element => element !== this._element).map(element => Collapse.getOrCreateInstance(element, {
        toggle: false
      }));
    }
    if (activeChildren.length && activeChildren[0]._isTransitioning) {
      return;
    }
    const startEvent = EventHandler.trigger(this._element, EVENT_SHOW$6);
    if (startEvent.defaultPrevented) {
      return;
    }
    for (const activeInstance of activeChildren) {
      activeInstance.hide();
    }
    const dimension = this._getDimension();
    this._element.classList.remove(CLASS_NAME_COLLAPSE);
    this._element.classList.add(CLASS_NAME_COLLAPSING);
    this._element.style[dimension] = 0;
    this._addAriaAndCollapsedClass(this._triggerArray, true);
    this._isTransitioning = true;
    const complete = () => {
      this._isTransitioning = false;
      this._element.classList.remove(CLASS_NAME_COLLAPSING);
      this._element.classList.add(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW$7);
      this._element.style[dimension] = '';
      EventHandler.trigger(this._element, EVENT_SHOWN$6);
    };
    const capitalizedDimension = dimension[0].toUpperCase() + dimension.slice(1);
    const scrollSize = `scroll${capitalizedDimension}`;
    this._queueCallback(complete, this._element, true);
    this._element.style[dimension] = `${this._element[scrollSize]}px`;
  }
  hide() {
    if (this._isTransitioning || !this._isShown()) {
      return;
    }
    const startEvent = EventHandler.trigger(this._element, EVENT_HIDE$6);
    if (startEvent.defaultPrevented) {
      return;
    }
    const dimension = this._getDimension();
    this._element.style[dimension] = `${this._element.getBoundingClientRect()[dimension]}px`;
    reflow(this._element);
    this._element.classList.add(CLASS_NAME_COLLAPSING);
    this._element.classList.remove(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW$7);
    for (const trigger of this._triggerArray) {
      const element = SelectorEngine.getElementFromSelector(trigger);
      if (element && !this._isShown(element)) {
        this._addAriaAndCollapsedClass([trigger], false);
      }
    }
    this._isTransitioning = true;
    const complete = () => {
      this._isTransitioning = false;
      this._element.classList.remove(CLASS_NAME_COLLAPSING);
      this._element.classList.add(CLASS_NAME_COLLAPSE);
      EventHandler.trigger(this._element, EVENT_HIDDEN$6);
    };
    this._element.style[dimension] = '';
    this._queueCallback(complete, this._element, true);
  }
  _isShown(element = this._element) {
    return element.classList.contains(CLASS_NAME_SHOW$7);
  }

  // Private
  _configAfterMerge(config) {
    config.toggle = Boolean(config.toggle); // Coerce string values
    config.parent = getElement(config.parent);
    return config;
  }
  _getDimension() {
    return this._element.classList.contains(CLASS_NAME_HORIZONTAL) ? WIDTH : HEIGHT;
  }
  _initializeChildren() {
    if (!this._config.parent) {
      return;
    }
    const children = this._getFirstLevelChildren(SELECTOR_DATA_TOGGLE$4);
    for (const element of children) {
      const selected = SelectorEngine.getElementFromSelector(element);
      if (selected) {
        this._addAriaAndCollapsedClass([element], this._isShown(selected));
      }
    }
  }
  _getFirstLevelChildren(selector) {
    const children = SelectorEngine.find(CLASS_NAME_DEEPER_CHILDREN, this._config.parent);
    // remove children if greater depth
    return SelectorEngine.find(selector, this._config.parent).filter(element => !children.includes(element));
  }
  _addAriaAndCollapsedClass(triggerArray, isOpen) {
    if (!triggerArray.length) {
      return;
    }
    for (const element of triggerArray) {
      element.classList.toggle(CLASS_NAME_COLLAPSED, !isOpen);
      element.setAttribute('aria-expanded', isOpen);
    }
  }

  // Static
  static jQueryInterface(config) {
    const _config = {};
    if (typeof config === 'string' && /show|hide/.test(config)) {
      _config.toggle = false;
    }
    return this.each(function () {
      const data = Collapse.getOrCreateInstance(this, _config);
      if (typeof config === 'string') {
        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`);
        }
        data[config]();
      }
    });
  }
}

/**
 * Data API implementation
 */

EventHandler.on(document, EVENT_CLICK_DATA_API$4, SELECTOR_DATA_TOGGLE$4, function (event) {
  // preventDefault only for <a> elements (which change the URL) not inside the collapsible element
  if (event.target.tagName === 'A' || event.delegateTarget && event.delegateTarget.tagName === 'A') {
    event.preventDefault();
  }
  for (const element of SelectorEngine.getMultipleElementsFromSelector(this)) {
    Collapse.getOrCreateInstance(element, {
      toggle: false
    }).toggle();
  }
});

/**
 * jQuery
 */

defineJQueryPlugin(Collapse);

/**
 * --------------------------------------------------------------------------
 * Bootstrap dropdown.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME$a = 'dropdown';
const DATA_KEY$6 = 'bs.dropdown';
const EVENT_KEY$6 = `.${DATA_KEY$6}`;
const DATA_API_KEY$3 = '.data-api';
const ESCAPE_KEY$2 = 'Escape';
const TAB_KEY$1 = 'Tab';
const ARROW_UP_KEY$1 = 'ArrowUp';
const ARROW_DOWN_KEY$1 = 'ArrowDown';
const RIGHT_MOUSE_BUTTON = 2; // MouseEvent.button value for the secondary button, usually the right button

const EVENT_HIDE$5 = `hide${EVENT_KEY$6}`;
const EVENT_HIDDEN$5 = `hidden${EVENT_KEY$6}`;
const EVENT_SHOW$5 = `show${EVENT_KEY$6}`;
const EVENT_SHOWN$5 = `shown${EVENT_KEY$6}`;
const EVENT_CLICK_DATA_API$3 = `click${EVENT_KEY$6}${DATA_API_KEY$3}`;
const EVENT_KEYDOWN_DATA_API = `keydown${EVENT_KEY$6}${DATA_API_KEY$3}`;
const EVENT_KEYUP_DATA_API = `keyup${EVENT_KEY$6}${DATA_API_KEY$3}`;
const CLASS_NAME_SHOW$6 = 'show';
const CLASS_NAME_DROPUP = 'dropup';
const CLASS_NAME_DROPEND = 'dropend';
const CLASS_NAME_DROPSTART = 'dropstart';
const CLASS_NAME_DROPUP_CENTER = 'dropup-center';
const CLASS_NAME_DROPDOWN_CENTER = 'dropdown-center';
const SELECTOR_DATA_TOGGLE$3 = '[data-bs-toggle="dropdown"]:not(.disabled):not(:disabled)';
const SELECTOR_DATA_TOGGLE_SHOWN = `${SELECTOR_DATA_TOGGLE$3}.${CLASS_NAME_SHOW$6}`;
const SELECTOR_MENU = '.dropdown-menu';
const SELECTOR_NAVBAR = '.navbar';
const SELECTOR_NAVBAR_NAV = '.navbar-nav';
const SELECTOR_VISIBLE_ITEMS = '.dropdown-menu .dropdown-item:not(.disabled):not(:disabled)';
const PLACEMENT_TOP = isRTL() ? 'top-end' : 'top-start';
const PLACEMENT_TOPEND = isRTL() ? 'top-start' : 'top-end';
const PLACEMENT_BOTTOM = isRTL() ? 'bottom-end' : 'bottom-start';
const PLACEMENT_BOTTOMEND = isRTL() ? 'bottom-start' : 'bottom-end';
const PLACEMENT_RIGHT = isRTL() ? 'left-start' : 'right-start';
const PLACEMENT_LEFT = isRTL() ? 'right-start' : 'left-start';
const PLACEMENT_TOPCENTER = 'top';
const PLACEMENT_BOTTOMCENTER = 'bottom';
const Default$9 = {
  autoClose: true,
  boundary: 'clippingParents',
  display: 'dynamic',
  offset: [0, 2],
  popperConfig: null,
  reference: 'toggle'
};
const DefaultType$9 = {
  autoClose: '(boolean|string)',
  boundary: '(string|element)',
  display: 'string',
  offset: '(array|string|function)',
  popperConfig: '(null|object|function)',
  reference: '(string|element|object)'
};

/**
 * Class definition
 */

class Dropdown extends BaseComponent {
  constructor(element, config) {
    super(element, config);
    this._popper = null;
    this._parent = this._element.parentNode; // dropdown wrapper
    // TODO: v6 revert #37011 & change markup https://getbootstrap.com/docs/5.3/forms/input-group/
    this._menu = SelectorEngine.next(this._element, SELECTOR_MENU)[0] || SelectorEngine.prev(this._element, SELECTOR_MENU)[0] || SelectorEngine.findOne(SELECTOR_MENU, this._parent);
    this._inNavbar = this._detectNavbar();
  }

  // Getters
  static get Default() {
    return Default$9;
  }
  static get DefaultType() {
    return DefaultType$9;
  }
  static get NAME() {
    return NAME$a;
  }

  // Public
  toggle() {
    return this._isShown() ? this.hide() : this.show();
  }
  show() {
    if (isDisabled(this._element) || this._isShown()) {
      return;
    }
    const relatedTarget = {
      relatedTarget: this._element
    };
    const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$5, relatedTarget);
    if (showEvent.defaultPrevented) {
      return;
    }
    this._createPopper();

    // If this is a touch-enabled device we add extra
    // empty mouseover listeners to the body's immediate children;
    // only needed because of broken event delegation on iOS
    // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
    if ('ontouchstart' in document.documentElement && !this._parent.closest(SELECTOR_NAVBAR_NAV)) {
      for (const element of [].concat(...document.body.children)) {
        EventHandler.on(element, 'mouseover', noop);
      }
    }
    this._element.focus();
    this._element.setAttribute('aria-expanded', true);
    this._menu.classList.add(CLASS_NAME_SHOW$6);
    this._element.classList.add(CLASS_NAME_SHOW$6);
    EventHandler.trigger(this._element, EVENT_SHOWN$5, relatedTarget);
  }
  hide() {
    if (isDisabled(this._element) || !this._isShown()) {
      return;
    }
    const relatedTarget = {
      relatedTarget: this._element
    };
    this._completeHide(relatedTarget);
  }
  dispose() {
    if (this._popper) {
      this._popper.destroy();
    }
    super.dispose();
  }
  update() {
    this._inNavbar = this._detectNavbar();
    if (this._popper) {
      this._popper.update();
    }
  }

  // Private
  _completeHide(relatedTarget) {
    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$5, relatedTarget);
    if (hideEvent.defaultPrevented) {
      return;
    }

    // If this is a touch-enabled device we remove the extra
    // empty mouseover listeners we added for iOS support
    if ('ontouchstart' in document.documentElement) {
      for (const element of [].concat(...document.body.children)) {
        EventHandler.off(element, 'mouseover', noop);
      }
    }
    if (this._popper) {
      this._popper.destroy();
    }
    this._menu.classList.remove(CLASS_NAME_SHOW$6);
    this._element.classList.remove(CLASS_NAME_SHOW$6);
    this._element.setAttribute('aria-expanded', 'false');
    Manipulator.removeDataAttribute(this._menu, 'popper');
    EventHandler.trigger(this._element, EVENT_HIDDEN$5, relatedTarget);
  }
  _getConfig(config) {
    config = super._getConfig(config);
    if (typeof config.reference === 'object' && !isElement(config.reference) && typeof config.reference.getBoundingClientRect !== 'function') {
      // Popper virtual elements require a getBoundingClientRect method
      throw new TypeError(`${NAME$a.toUpperCase()}: Option "reference" provided type "object" without a required "getBoundingClientRect" method.`);
    }
    return config;
  }
  _createPopper() {
    if (typeof _popperjs_core__WEBPACK_IMPORTED_MODULE_0__ === 'undefined') {
      throw new TypeError('Bootstrap\'s dropdowns require Popper (https://popper.js.org)');
    }
    let referenceElement = this._element;
    if (this._config.reference === 'parent') {
      referenceElement = this._parent;
    } else if (isElement(this._config.reference)) {
      referenceElement = getElement(this._config.reference);
    } else if (typeof this._config.reference === 'object') {
      referenceElement = this._config.reference;
    }
    const popperConfig = this._getPopperConfig();
    this._popper = _popperjs_core__WEBPACK_IMPORTED_MODULE_1__.createPopper(referenceElement, this._menu, popperConfig);
  }
  _isShown() {
    return this._menu.classList.contains(CLASS_NAME_SHOW$6);
  }
  _getPlacement() {
    const parentDropdown = this._parent;
    if (parentDropdown.classList.contains(CLASS_NAME_DROPEND)) {
      return PLACEMENT_RIGHT;
    }
    if (parentDropdown.classList.contains(CLASS_NAME_DROPSTART)) {
      return PLACEMENT_LEFT;
    }
    if (parentDropdown.classList.contains(CLASS_NAME_DROPUP_CENTER)) {
      return PLACEMENT_TOPCENTER;
    }
    if (parentDropdown.classList.contains(CLASS_NAME_DROPDOWN_CENTER)) {
      return PLACEMENT_BOTTOMCENTER;
    }

    // We need to trim the value because custom properties can also include spaces
    const isEnd = getComputedStyle(this._menu).getPropertyValue('--bs-position').trim() === 'end';
    if (parentDropdown.classList.contains(CLASS_NAME_DROPUP)) {
      return isEnd ? PLACEMENT_TOPEND : PLACEMENT_TOP;
    }
    return isEnd ? PLACEMENT_BOTTOMEND : PLACEMENT_BOTTOM;
  }
  _detectNavbar() {
    return this._element.closest(SELECTOR_NAVBAR) !== null;
  }
  _getOffset() {
    const {
      offset
    } = this._config;
    if (typeof offset === 'string') {
      return offset.split(',').map(value => Number.parseInt(value, 10));
    }
    if (typeof offset === 'function') {
      return popperData => offset(popperData, this._element);
    }
    return offset;
  }
  _getPopperConfig() {
    const defaultBsPopperConfig = {
      placement: this._getPlacement(),
      modifiers: [{
        name: 'preventOverflow',
        options: {
          boundary: this._config.boundary
        }
      }, {
        name: 'offset',
        options: {
          offset: this._getOffset()
        }
      }]
    };

    // Disable Popper if we have a static display or Dropdown is in Navbar
    if (this._inNavbar || this._config.display === 'static') {
      Manipulator.setDataAttribute(this._menu, 'popper', 'static'); // TODO: v6 remove
      defaultBsPopperConfig.modifiers = [{
        name: 'applyStyles',
        enabled: false
      }];
    }
    return {
      ...defaultBsPopperConfig,
      ...execute(this._config.popperConfig, [defaultBsPopperConfig])
    };
  }
  _selectMenuItem({
    key,
    target
  }) {
    const items = SelectorEngine.find(SELECTOR_VISIBLE_ITEMS, this._menu).filter(element => isVisible(element));
    if (!items.length) {
      return;
    }

    // if target isn't included in items (e.g. when expanding the dropdown)
    // allow cycling to get the last item in case key equals ARROW_UP_KEY
    getNextActiveElement(items, target, key === ARROW_DOWN_KEY$1, !items.includes(target)).focus();
  }

  // Static
  static jQueryInterface(config) {
    return this.each(function () {
      const data = Dropdown.getOrCreateInstance(this, config);
      if (typeof config !== 'string') {
        return;
      }
      if (typeof data[config] === 'undefined') {
        throw new TypeError(`No method named "${config}"`);
      }
      data[config]();
    });
  }
  static clearMenus(event) {
    if (event.button === RIGHT_MOUSE_BUTTON || event.type === 'keyup' && event.key !== TAB_KEY$1) {
      return;
    }
    const openToggles = SelectorEngine.find(SELECTOR_DATA_TOGGLE_SHOWN);
    for (const toggle of openToggles) {
      const context = Dropdown.getInstance(toggle);
      if (!context || context._config.autoClose === false) {
        continue;
      }
      const composedPath = event.composedPath();
      const isMenuTarget = composedPath.includes(context._menu);
      if (composedPath.includes(context._element) || context._config.autoClose === 'inside' && !isMenuTarget || context._config.autoClose === 'outside' && isMenuTarget) {
        continue;
      }

      // Tab navigation through the dropdown menu or events from contained inputs shouldn't close the menu
      if (context._menu.contains(event.target) && (event.type === 'keyup' && event.key === TAB_KEY$1 || /input|select|option|textarea|form/i.test(event.target.tagName))) {
        continue;
      }
      const relatedTarget = {
        relatedTarget: context._element
      };
      if (event.type === 'click') {
        relatedTarget.clickEvent = event;
      }
      context._completeHide(relatedTarget);
    }
  }
  static dataApiKeydownHandler(event) {
    // If not an UP | DOWN | ESCAPE key => not a dropdown command
    // If input/textarea && if key is other than ESCAPE => not a dropdown command

    const isInput = /input|textarea/i.test(event.target.tagName);
    const isEscapeEvent = event.key === ESCAPE_KEY$2;
    const isUpOrDownEvent = [ARROW_UP_KEY$1, ARROW_DOWN_KEY$1].includes(event.key);
    if (!isUpOrDownEvent && !isEscapeEvent) {
      return;
    }
    if (isInput && !isEscapeEvent) {
      return;
    }
    event.preventDefault();

    // TODO: v6 revert #37011 & change markup https://getbootstrap.com/docs/5.3/forms/input-group/
    const getToggleButton = this.matches(SELECTOR_DATA_TOGGLE$3) ? this : SelectorEngine.prev(this, SELECTOR_DATA_TOGGLE$3)[0] || SelectorEngine.next(this, SELECTOR_DATA_TOGGLE$3)[0] || SelectorEngine.findOne(SELECTOR_DATA_TOGGLE$3, event.delegateTarget.parentNode);
    const instance = Dropdown.getOrCreateInstance(getToggleButton);
    if (isUpOrDownEvent) {
      event.stopPropagation();
      instance.show();
      instance._selectMenuItem(event);
      return;
    }
    if (instance._isShown()) {
      // else is escape and we check if it is shown
      event.stopPropagation();
      instance.hide();
      getToggleButton.focus();
    }
  }
}

/**
 * Data API implementation
 */

EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_DATA_TOGGLE$3, Dropdown.dataApiKeydownHandler);
EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_MENU, Dropdown.dataApiKeydownHandler);
EventHandler.on(document, EVENT_CLICK_DATA_API$3, Dropdown.clearMenus);
EventHandler.on(document, EVENT_KEYUP_DATA_API, Dropdown.clearMenus);
EventHandler.on(document, EVENT_CLICK_DATA_API$3, SELECTOR_DATA_TOGGLE$3, function (event) {
  event.preventDefault();
  Dropdown.getOrCreateInstance(this).toggle();
});

/**
 * jQuery
 */

defineJQueryPlugin(Dropdown);

/**
 * --------------------------------------------------------------------------
 * Bootstrap util/backdrop.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME$9 = 'backdrop';
const CLASS_NAME_FADE$4 = 'fade';
const CLASS_NAME_SHOW$5 = 'show';
const EVENT_MOUSEDOWN = `mousedown.bs.${NAME$9}`;
const Default$8 = {
  className: 'modal-backdrop',
  clickCallback: null,
  isAnimated: false,
  isVisible: true,
  // if false, we use the backdrop helper without adding any element to the dom
  rootElement: 'body' // give the choice to place backdrop under different elements
};
const DefaultType$8 = {
  className: 'string',
  clickCallback: '(function|null)',
  isAnimated: 'boolean',
  isVisible: 'boolean',
  rootElement: '(element|string)'
};

/**
 * Class definition
 */

class Backdrop extends Config {
  constructor(config) {
    super();
    this._config = this._getConfig(config);
    this._isAppended = false;
    this._element = null;
  }

  // Getters
  static get Default() {
    return Default$8;
  }
  static get DefaultType() {
    return DefaultType$8;
  }
  static get NAME() {
    return NAME$9;
  }

  // Public
  show(callback) {
    if (!this._config.isVisible) {
      execute(callback);
      return;
    }
    this._append();
    const element = this._getElement();
    if (this._config.isAnimated) {
      reflow(element);
    }
    element.classList.add(CLASS_NAME_SHOW$5);
    this._emulateAnimation(() => {
      execute(callback);
    });
  }
  hide(callback) {
    if (!this._config.isVisible) {
      execute(callback);
      return;
    }
    this._getElement().classList.remove(CLASS_NAME_SHOW$5);
    this._emulateAnimation(() => {
      this.dispose();
      execute(callback);
    });
  }
  dispose() {
    if (!this._isAppended) {
      return;
    }
    EventHandler.off(this._element, EVENT_MOUSEDOWN);
    this._element.remove();
    this._isAppended = false;
  }

  // Private
  _getElement() {
    if (!this._element) {
      const backdrop = document.createElement('div');
      backdrop.className = this._config.className;
      if (this._config.isAnimated) {
        backdrop.classList.add(CLASS_NAME_FADE$4);
      }
      this._element = backdrop;
    }
    return this._element;
  }
  _configAfterMerge(config) {
    // use getElement() with the default "body" to get a fresh Element on each instantiation
    config.rootElement = getElement(config.rootElement);
    return config;
  }
  _append() {
    if (this._isAppended) {
      return;
    }
    const element = this._getElement();
    this._config.rootElement.append(element);
    EventHandler.on(element, EVENT_MOUSEDOWN, () => {
      execute(this._config.clickCallback);
    });
    this._isAppended = true;
  }
  _emulateAnimation(callback) {
    executeAfterTransition(callback, this._getElement(), this._config.isAnimated);
  }
}

/**
 * --------------------------------------------------------------------------
 * Bootstrap util/focustrap.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME$8 = 'focustrap';
const DATA_KEY$5 = 'bs.focustrap';
const EVENT_KEY$5 = `.${DATA_KEY$5}`;
const EVENT_FOCUSIN$2 = `focusin${EVENT_KEY$5}`;
const EVENT_KEYDOWN_TAB = `keydown.tab${EVENT_KEY$5}`;
const TAB_KEY = 'Tab';
const TAB_NAV_FORWARD = 'forward';
const TAB_NAV_BACKWARD = 'backward';
const Default$7 = {
  autofocus: true,
  trapElement: null // The element to trap focus inside of
};
const DefaultType$7 = {
  autofocus: 'boolean',
  trapElement: 'element'
};

/**
 * Class definition
 */

class FocusTrap extends Config {
  constructor(config) {
    super();
    this._config = this._getConfig(config);
    this._isActive = false;
    this._lastTabNavDirection = null;
  }

  // Getters
  static get Default() {
    return Default$7;
  }
  static get DefaultType() {
    return DefaultType$7;
  }
  static get NAME() {
    return NAME$8;
  }

  // Public
  activate() {
    if (this._isActive) {
      return;
    }
    if (this._config.autofocus) {
      this._config.trapElement.focus();
    }
    EventHandler.off(document, EVENT_KEY$5); // guard against infinite focus loop
    EventHandler.on(document, EVENT_FOCUSIN$2, event => this._handleFocusin(event));
    EventHandler.on(document, EVENT_KEYDOWN_TAB, event => this._handleKeydown(event));
    this._isActive = true;
  }
  deactivate() {
    if (!this._isActive) {
      return;
    }
    this._isActive = false;
    EventHandler.off(document, EVENT_KEY$5);
  }

  // Private
  _handleFocusin(event) {
    const {
      trapElement
    } = this._config;
    if (event.target === document || event.target === trapElement || trapElement.contains(event.target)) {
      return;
    }
    const elements = SelectorEngine.focusableChildren(trapElement);
    if (elements.length === 0) {
      trapElement.focus();
    } else if (this._lastTabNavDirection === TAB_NAV_BACKWARD) {
      elements[elements.length - 1].focus();
    } else {
      elements[0].focus();
    }
  }
  _handleKeydown(event) {
    if (event.key !== TAB_KEY) {
      return;
    }
    this._lastTabNavDirection = event.shiftKey ? TAB_NAV_BACKWARD : TAB_NAV_FORWARD;
  }
}

/**
 * --------------------------------------------------------------------------
 * Bootstrap util/scrollBar.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const SELECTOR_FIXED_CONTENT = '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top';
const SELECTOR_STICKY_CONTENT = '.sticky-top';
const PROPERTY_PADDING = 'padding-right';
const PROPERTY_MARGIN = 'margin-right';

/**
 * Class definition
 */

class ScrollBarHelper {
  constructor() {
    this._element = document.body;
  }

  // Public
  getWidth() {
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth#usage_notes
    const documentWidth = document.documentElement.clientWidth;
    return Math.abs(window.innerWidth - documentWidth);
  }
  hide() {
    const width = this.getWidth();
    this._disableOverFlow();
    // give padding to element to balance the hidden scrollbar width
    this._setElementAttributes(this._element, PROPERTY_PADDING, calculatedValue => calculatedValue + width);
    // trick: We adjust positive paddingRight and negative marginRight to sticky-top elements to keep showing fullwidth
    this._setElementAttributes(SELECTOR_FIXED_CONTENT, PROPERTY_PADDING, calculatedValue => calculatedValue + width);
    this._setElementAttributes(SELECTOR_STICKY_CONTENT, PROPERTY_MARGIN, calculatedValue => calculatedValue - width);
  }
  reset() {
    this._resetElementAttributes(this._element, 'overflow');
    this._resetElementAttributes(this._element, PROPERTY_PADDING);
    this._resetElementAttributes(SELECTOR_FIXED_CONTENT, PROPERTY_PADDING);
    this._resetElementAttributes(SELECTOR_STICKY_CONTENT, PROPERTY_MARGIN);
  }
  isOverflowing() {
    return this.getWidth() > 0;
  }

  // Private
  _disableOverFlow() {
    this._saveInitialAttribute(this._element, 'overflow');
    this._element.style.overflow = 'hidden';
  }
  _setElementAttributes(selector, styleProperty, callback) {
    const scrollbarWidth = this.getWidth();
    const manipulationCallBack = element => {
      if (element !== this._element && window.innerWidth > element.clientWidth + scrollbarWidth) {
        return;
      }
      this._saveInitialAttribute(element, styleProperty);
      const calculatedValue = window.getComputedStyle(element).getPropertyValue(styleProperty);
      element.style.setProperty(styleProperty, `${callback(Number.parseFloat(calculatedValue))}px`);
    };
    this._applyManipulationCallback(selector, manipulationCallBack);
  }
  _saveInitialAttribute(element, styleProperty) {
    const actualValue = element.style.getPropertyValue(styleProperty);
    if (actualValue) {
      Manipulator.setDataAttribute(element, styleProperty, actualValue);
    }
  }
  _resetElementAttributes(selector, styleProperty) {
    const manipulationCallBack = element => {
      const value = Manipulator.getDataAttribute(element, styleProperty);
      // We only want to remove the property if the value is `null`; the value can also be zero
      if (value === null) {
        element.style.removeProperty(styleProperty);
        return;
      }
      Manipulator.removeDataAttribute(element, styleProperty);
      element.style.setProperty(styleProperty, value);
    };
    this._applyManipulationCallback(selector, manipulationCallBack);
  }
  _applyManipulationCallback(selector, callBack) {
    if (isElement(selector)) {
      callBack(selector);
      return;
    }
    for (const sel of SelectorEngine.find(selector, this._element)) {
      callBack(sel);
    }
  }
}

/**
 * --------------------------------------------------------------------------
 * Bootstrap modal.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME$7 = 'modal';
const DATA_KEY$4 = 'bs.modal';
const EVENT_KEY$4 = `.${DATA_KEY$4}`;
const DATA_API_KEY$2 = '.data-api';
const ESCAPE_KEY$1 = 'Escape';
const EVENT_HIDE$4 = `hide${EVENT_KEY$4}`;
const EVENT_HIDE_PREVENTED$1 = `hidePrevented${EVENT_KEY$4}`;
const EVENT_HIDDEN$4 = `hidden${EVENT_KEY$4}`;
const EVENT_SHOW$4 = `show${EVENT_KEY$4}`;
const EVENT_SHOWN$4 = `shown${EVENT_KEY$4}`;
const EVENT_RESIZE$1 = `resize${EVENT_KEY$4}`;
const EVENT_CLICK_DISMISS = `click.dismiss${EVENT_KEY$4}`;
const EVENT_MOUSEDOWN_DISMISS = `mousedown.dismiss${EVENT_KEY$4}`;
const EVENT_KEYDOWN_DISMISS$1 = `keydown.dismiss${EVENT_KEY$4}`;
const EVENT_CLICK_DATA_API$2 = `click${EVENT_KEY$4}${DATA_API_KEY$2}`;
const CLASS_NAME_OPEN = 'modal-open';
const CLASS_NAME_FADE$3 = 'fade';
const CLASS_NAME_SHOW$4 = 'show';
const CLASS_NAME_STATIC = 'modal-static';
const OPEN_SELECTOR$1 = '.modal.show';
const SELECTOR_DIALOG = '.modal-dialog';
const SELECTOR_MODAL_BODY = '.modal-body';
const SELECTOR_DATA_TOGGLE$2 = '[data-bs-toggle="modal"]';
const Default$6 = {
  backdrop: true,
  focus: true,
  keyboard: true
};
const DefaultType$6 = {
  backdrop: '(boolean|string)',
  focus: 'boolean',
  keyboard: 'boolean'
};

/**
 * Class definition
 */

class Modal extends BaseComponent {
  constructor(element, config) {
    super(element, config);
    this._dialog = SelectorEngine.findOne(SELECTOR_DIALOG, this._element);
    this._backdrop = this._initializeBackDrop();
    this._focustrap = this._initializeFocusTrap();
    this._isShown = false;
    this._isTransitioning = false;
    this._scrollBar = new ScrollBarHelper();
    this._addEventListeners();
  }

  // Getters
  static get Default() {
    return Default$6;
  }
  static get DefaultType() {
    return DefaultType$6;
  }
  static get NAME() {
    return NAME$7;
  }

  // Public
  toggle(relatedTarget) {
    return this._isShown ? this.hide() : this.show(relatedTarget);
  }
  show(relatedTarget) {
    if (this._isShown || this._isTransitioning) {
      return;
    }
    const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$4, {
      relatedTarget
    });
    if (showEvent.defaultPrevented) {
      return;
    }
    this._isShown = true;
    this._isTransitioning = true;
    this._scrollBar.hide();
    document.body.classList.add(CLASS_NAME_OPEN);
    this._adjustDialog();
    this._backdrop.show(() => this._showElement(relatedTarget));
  }
  hide() {
    if (!this._isShown || this._isTransitioning) {
      return;
    }
    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$4);
    if (hideEvent.defaultPrevented) {
      return;
    }
    this._isShown = false;
    this._isTransitioning = true;
    this._focustrap.deactivate();
    this._element.classList.remove(CLASS_NAME_SHOW$4);
    this._queueCallback(() => this._hideModal(), this._element, this._isAnimated());
  }
  dispose() {
    EventHandler.off(window, EVENT_KEY$4);
    EventHandler.off(this._dialog, EVENT_KEY$4);
    this._backdrop.dispose();
    this._focustrap.deactivate();
    super.dispose();
  }
  handleUpdate() {
    this._adjustDialog();
  }

  // Private
  _initializeBackDrop() {
    return new Backdrop({
      isVisible: Boolean(this._config.backdrop),
      // 'static' option will be translated to true, and booleans will keep their value,
      isAnimated: this._isAnimated()
    });
  }
  _initializeFocusTrap() {
    return new FocusTrap({
      trapElement: this._element
    });
  }
  _showElement(relatedTarget) {
    // try to append dynamic modal
    if (!document.body.contains(this._element)) {
      document.body.append(this._element);
    }
    this._element.style.display = 'block';
    this._element.removeAttribute('aria-hidden');
    this._element.setAttribute('aria-modal', true);
    this._element.setAttribute('role', 'dialog');
    this._element.scrollTop = 0;
    const modalBody = SelectorEngine.findOne(SELECTOR_MODAL_BODY, this._dialog);
    if (modalBody) {
      modalBody.scrollTop = 0;
    }
    reflow(this._element);
    this._element.classList.add(CLASS_NAME_SHOW$4);
    const transitionComplete = () => {
      if (this._config.focus) {
        this._focustrap.activate();
      }
      this._isTransitioning = false;
      EventHandler.trigger(this._element, EVENT_SHOWN$4, {
        relatedTarget
      });
    };
    this._queueCallback(transitionComplete, this._dialog, this._isAnimated());
  }
  _addEventListeners() {
    EventHandler.on(this._element, EVENT_KEYDOWN_DISMISS$1, event => {
      if (event.key !== ESCAPE_KEY$1) {
        return;
      }
      if (this._config.keyboard) {
        this.hide();
        return;
      }
      this._triggerBackdropTransition();
    });
    EventHandler.on(window, EVENT_RESIZE$1, () => {
      if (this._isShown && !this._isTransitioning) {
        this._adjustDialog();
      }
    });
    EventHandler.on(this._element, EVENT_MOUSEDOWN_DISMISS, event => {
      // a bad trick to segregate clicks that may start inside dialog but end outside, and avoid listen to scrollbar clicks
      EventHandler.one(this._element, EVENT_CLICK_DISMISS, event2 => {
        if (this._element !== event.target || this._element !== event2.target) {
          return;
        }
        if (this._config.backdrop === 'static') {
          this._triggerBackdropTransition();
          return;
        }
        if (this._config.backdrop) {
          this.hide();
        }
      });
    });
  }
  _hideModal() {
    this._element.style.display = 'none';
    this._element.setAttribute('aria-hidden', true);
    this._element.removeAttribute('aria-modal');
    this._element.removeAttribute('role');
    this._isTransitioning = false;
    this._backdrop.hide(() => {
      document.body.classList.remove(CLASS_NAME_OPEN);
      this._resetAdjustments();
      this._scrollBar.reset();
      EventHandler.trigger(this._element, EVENT_HIDDEN$4);
    });
  }
  _isAnimated() {
    return this._element.classList.contains(CLASS_NAME_FADE$3);
  }
  _triggerBackdropTransition() {
    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED$1);
    if (hideEvent.defaultPrevented) {
      return;
    }
    const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;
    const initialOverflowY = this._element.style.overflowY;
    // return if the following background transition hasn't yet completed
    if (initialOverflowY === 'hidden' || this._element.classList.contains(CLASS_NAME_STATIC)) {
      return;
    }
    if (!isModalOverflowing) {
      this._element.style.overflowY = 'hidden';
    }
    this._element.classList.add(CLASS_NAME_STATIC);
    this._queueCallback(() => {
      this._element.classList.remove(CLASS_NAME_STATIC);
      this._queueCallback(() => {
        this._element.style.overflowY = initialOverflowY;
      }, this._dialog);
    }, this._dialog);
    this._element.focus();
  }

  /**
   * The following methods are used to handle overflowing modals
   */

  _adjustDialog() {
    const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;
    const scrollbarWidth = this._scrollBar.getWidth();
    const isBodyOverflowing = scrollbarWidth > 0;
    if (isBodyOverflowing && !isModalOverflowing) {
      const property = isRTL() ? 'paddingLeft' : 'paddingRight';
      this._element.style[property] = `${scrollbarWidth}px`;
    }
    if (!isBodyOverflowing && isModalOverflowing) {
      const property = isRTL() ? 'paddingRight' : 'paddingLeft';
      this._element.style[property] = `${scrollbarWidth}px`;
    }
  }
  _resetAdjustments() {
    this._element.style.paddingLeft = '';
    this._element.style.paddingRight = '';
  }

  // Static
  static jQueryInterface(config, relatedTarget) {
    return this.each(function () {
      const data = Modal.getOrCreateInstance(this, config);
      if (typeof config !== 'string') {
        return;
      }
      if (typeof data[config] === 'undefined') {
        throw new TypeError(`No method named "${config}"`);
      }
      data[config](relatedTarget);
    });
  }
}

/**
 * Data API implementation
 */

EventHandler.on(document, EVENT_CLICK_DATA_API$2, SELECTOR_DATA_TOGGLE$2, function (event) {
  const target = SelectorEngine.getElementFromSelector(this);
  if (['A', 'AREA'].includes(this.tagName)) {
    event.preventDefault();
  }
  EventHandler.one(target, EVENT_SHOW$4, showEvent => {
    if (showEvent.defaultPrevented) {
      // only register focus restorer if modal will actually get shown
      return;
    }
    EventHandler.one(target, EVENT_HIDDEN$4, () => {
      if (isVisible(this)) {
        this.focus();
      }
    });
  });

  // avoid conflict when clicking modal toggler while another one is open
  const alreadyOpen = SelectorEngine.findOne(OPEN_SELECTOR$1);
  if (alreadyOpen) {
    Modal.getInstance(alreadyOpen).hide();
  }
  const data = Modal.getOrCreateInstance(target);
  data.toggle(this);
});
enableDismissTrigger(Modal);

/**
 * jQuery
 */

defineJQueryPlugin(Modal);

/**
 * --------------------------------------------------------------------------
 * Bootstrap offcanvas.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME$6 = 'offcanvas';
const DATA_KEY$3 = 'bs.offcanvas';
const EVENT_KEY$3 = `.${DATA_KEY$3}`;
const DATA_API_KEY$1 = '.data-api';
const EVENT_LOAD_DATA_API$2 = `load${EVENT_KEY$3}${DATA_API_KEY$1}`;
const ESCAPE_KEY = 'Escape';
const CLASS_NAME_SHOW$3 = 'show';
const CLASS_NAME_SHOWING$1 = 'showing';
const CLASS_NAME_HIDING = 'hiding';
const CLASS_NAME_BACKDROP = 'offcanvas-backdrop';
const OPEN_SELECTOR = '.offcanvas.show';
const EVENT_SHOW$3 = `show${EVENT_KEY$3}`;
const EVENT_SHOWN$3 = `shown${EVENT_KEY$3}`;
const EVENT_HIDE$3 = `hide${EVENT_KEY$3}`;
const EVENT_HIDE_PREVENTED = `hidePrevented${EVENT_KEY$3}`;
const EVENT_HIDDEN$3 = `hidden${EVENT_KEY$3}`;
const EVENT_RESIZE = `resize${EVENT_KEY$3}`;
const EVENT_CLICK_DATA_API$1 = `click${EVENT_KEY$3}${DATA_API_KEY$1}`;
const EVENT_KEYDOWN_DISMISS = `keydown.dismiss${EVENT_KEY$3}`;
const SELECTOR_DATA_TOGGLE$1 = '[data-bs-toggle="offcanvas"]';
const Default$5 = {
  backdrop: true,
  keyboard: true,
  scroll: false
};
const DefaultType$5 = {
  backdrop: '(boolean|string)',
  keyboard: 'boolean',
  scroll: 'boolean'
};

/**
 * Class definition
 */

class Offcanvas extends BaseComponent {
  constructor(element, config) {
    super(element, config);
    this._isShown = false;
    this._backdrop = this._initializeBackDrop();
    this._focustrap = this._initializeFocusTrap();
    this._addEventListeners();
  }

  // Getters
  static get Default() {
    return Default$5;
  }
  static get DefaultType() {
    return DefaultType$5;
  }
  static get NAME() {
    return NAME$6;
  }

  // Public
  toggle(relatedTarget) {
    return this._isShown ? this.hide() : this.show(relatedTarget);
  }
  show(relatedTarget) {
    if (this._isShown) {
      return;
    }
    const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$3, {
      relatedTarget
    });
    if (showEvent.defaultPrevented) {
      return;
    }
    this._isShown = true;
    this._backdrop.show();
    if (!this._config.scroll) {
      new ScrollBarHelper().hide();
    }
    this._element.setAttribute('aria-modal', true);
    this._element.setAttribute('role', 'dialog');
    this._element.classList.add(CLASS_NAME_SHOWING$1);
    const completeCallBack = () => {
      if (!this._config.scroll || this._config.backdrop) {
        this._focustrap.activate();
      }
      this._element.classList.add(CLASS_NAME_SHOW$3);
      this._element.classList.remove(CLASS_NAME_SHOWING$1);
      EventHandler.trigger(this._element, EVENT_SHOWN$3, {
        relatedTarget
      });
    };
    this._queueCallback(completeCallBack, this._element, true);
  }
  hide() {
    if (!this._isShown) {
      return;
    }
    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$3);
    if (hideEvent.defaultPrevented) {
      return;
    }
    this._focustrap.deactivate();
    this._element.blur();
    this._isShown = false;
    this._element.classList.add(CLASS_NAME_HIDING);
    this._backdrop.hide();
    const completeCallback = () => {
      this._element.classList.remove(CLASS_NAME_SHOW$3, CLASS_NAME_HIDING);
      this._element.removeAttribute('aria-modal');
      this._element.removeAttribute('role');
      if (!this._config.scroll) {
        new ScrollBarHelper().reset();
      }
      EventHandler.trigger(this._element, EVENT_HIDDEN$3);
    };
    this._queueCallback(completeCallback, this._element, true);
  }
  dispose() {
    this._backdrop.dispose();
    this._focustrap.deactivate();
    super.dispose();
  }

  // Private
  _initializeBackDrop() {
    const clickCallback = () => {
      if (this._config.backdrop === 'static') {
        EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED);
        return;
      }
      this.hide();
    };

    // 'static' option will be translated to true, and booleans will keep their value
    const isVisible = Boolean(this._config.backdrop);
    return new Backdrop({
      className: CLASS_NAME_BACKDROP,
      isVisible,
      isAnimated: true,
      rootElement: this._element.parentNode,
      clickCallback: isVisible ? clickCallback : null
    });
  }
  _initializeFocusTrap() {
    return new FocusTrap({
      trapElement: this._element
    });
  }
  _addEventListeners() {
    EventHandler.on(this._element, EVENT_KEYDOWN_DISMISS, event => {
      if (event.key !== ESCAPE_KEY) {
        return;
      }
      if (this._config.keyboard) {
        this.hide();
        return;
      }
      EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED);
    });
  }

  // Static
  static jQueryInterface(config) {
    return this.each(function () {
      const data = Offcanvas.getOrCreateInstance(this, config);
      if (typeof config !== 'string') {
        return;
      }
      if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
        throw new TypeError(`No method named "${config}"`);
      }
      data[config](this);
    });
  }
}

/**
 * Data API implementation
 */

EventHandler.on(document, EVENT_CLICK_DATA_API$1, SELECTOR_DATA_TOGGLE$1, function (event) {
  const target = SelectorEngine.getElementFromSelector(this);
  if (['A', 'AREA'].includes(this.tagName)) {
    event.preventDefault();
  }
  if (isDisabled(this)) {
    return;
  }
  EventHandler.one(target, EVENT_HIDDEN$3, () => {
    // focus on trigger when it is closed
    if (isVisible(this)) {
      this.focus();
    }
  });

  // avoid conflict when clicking a toggler of an offcanvas, while another is open
  const alreadyOpen = SelectorEngine.findOne(OPEN_SELECTOR);
  if (alreadyOpen && alreadyOpen !== target) {
    Offcanvas.getInstance(alreadyOpen).hide();
  }
  const data = Offcanvas.getOrCreateInstance(target);
  data.toggle(this);
});
EventHandler.on(window, EVENT_LOAD_DATA_API$2, () => {
  for (const selector of SelectorEngine.find(OPEN_SELECTOR)) {
    Offcanvas.getOrCreateInstance(selector).show();
  }
});
EventHandler.on(window, EVENT_RESIZE, () => {
  for (const element of SelectorEngine.find('[aria-modal][class*=show][class*=offcanvas-]')) {
    if (getComputedStyle(element).position !== 'fixed') {
      Offcanvas.getOrCreateInstance(element).hide();
    }
  }
});
enableDismissTrigger(Offcanvas);

/**
 * jQuery
 */

defineJQueryPlugin(Offcanvas);

/**
 * --------------------------------------------------------------------------
 * Bootstrap util/sanitizer.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

// js-docs-start allow-list
const ARIA_ATTRIBUTE_PATTERN = /^aria-[\w-]*$/i;
const DefaultAllowlist = {
  // Global attributes allowed on any supplied element below.
  '*': ['class', 'dir', 'id', 'lang', 'role', ARIA_ATTRIBUTE_PATTERN],
  a: ['target', 'href', 'title', 'rel'],
  area: [],
  b: [],
  br: [],
  col: [],
  code: [],
  dd: [],
  div: [],
  dl: [],
  dt: [],
  em: [],
  hr: [],
  h1: [],
  h2: [],
  h3: [],
  h4: [],
  h5: [],
  h6: [],
  i: [],
  img: ['src', 'srcset', 'alt', 'title', 'width', 'height'],
  li: [],
  ol: [],
  p: [],
  pre: [],
  s: [],
  small: [],
  span: [],
  sub: [],
  sup: [],
  strong: [],
  u: [],
  ul: []
};
// js-docs-end allow-list

const uriAttributes = new Set(['background', 'cite', 'href', 'itemtype', 'longdesc', 'poster', 'src', 'xlink:href']);

/**
 * A pattern that recognizes URLs that are safe wrt. XSS in URL navigation
 * contexts.
 *
 * Shout-out to Angular https://github.com/angular/angular/blob/15.2.8/packages/core/src/sanitization/url_sanitizer.ts#L38
 */
// eslint-disable-next-line unicorn/better-regex
const SAFE_URL_PATTERN = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:/?#]*(?:[/?#]|$))/i;
const allowedAttribute = (attribute, allowedAttributeList) => {
  const attributeName = attribute.nodeName.toLowerCase();
  if (allowedAttributeList.includes(attributeName)) {
    if (uriAttributes.has(attributeName)) {
      return Boolean(SAFE_URL_PATTERN.test(attribute.nodeValue));
    }
    return true;
  }

  // Check if a regular expression validates the attribute.
  return allowedAttributeList.filter(attributeRegex => attributeRegex instanceof RegExp).some(regex => regex.test(attributeName));
};
function sanitizeHtml(unsafeHtml, allowList, sanitizeFunction) {
  if (!unsafeHtml.length) {
    return unsafeHtml;
  }
  if (sanitizeFunction && typeof sanitizeFunction === 'function') {
    return sanitizeFunction(unsafeHtml);
  }
  const domParser = new window.DOMParser();
  const createdDocument = domParser.parseFromString(unsafeHtml, 'text/html');
  const elements = [].concat(...createdDocument.body.querySelectorAll('*'));
  for (const element of elements) {
    const elementName = element.nodeName.toLowerCase();
    if (!Object.keys(allowList).includes(elementName)) {
      element.remove();
      continue;
    }
    const attributeList = [].concat(...element.attributes);
    const allowedAttributes = [].concat(allowList['*'] || [], allowList[elementName] || []);
    for (const attribute of attributeList) {
      if (!allowedAttribute(attribute, allowedAttributes)) {
        element.removeAttribute(attribute.nodeName);
      }
    }
  }
  return createdDocument.body.innerHTML;
}

/**
 * --------------------------------------------------------------------------
 * Bootstrap util/template-factory.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME$5 = 'TemplateFactory';
const Default$4 = {
  allowList: DefaultAllowlist,
  content: {},
  // { selector : text ,  selector2 : text2 , }
  extraClass: '',
  html: false,
  sanitize: true,
  sanitizeFn: null,
  template: '<div></div>'
};
const DefaultType$4 = {
  allowList: 'object',
  content: 'object',
  extraClass: '(string|function)',
  html: 'boolean',
  sanitize: 'boolean',
  sanitizeFn: '(null|function)',
  template: 'string'
};
const DefaultContentType = {
  entry: '(string|element|function|null)',
  selector: '(string|element)'
};

/**
 * Class definition
 */

class TemplateFactory extends Config {
  constructor(config) {
    super();
    this._config = this._getConfig(config);
  }

  // Getters
  static get Default() {
    return Default$4;
  }
  static get DefaultType() {
    return DefaultType$4;
  }
  static get NAME() {
    return NAME$5;
  }

  // Public
  getContent() {
    return Object.values(this._config.content).map(config => this._resolvePossibleFunction(config)).filter(Boolean);
  }
  hasContent() {
    return this.getContent().length > 0;
  }
  changeContent(content) {
    this._checkContent(content);
    this._config.content = {
      ...this._config.content,
      ...content
    };
    return this;
  }
  toHtml() {
    const templateWrapper = document.createElement('div');
    templateWrapper.innerHTML = this._maybeSanitize(this._config.template);
    for (const [selector, text] of Object.entries(this._config.content)) {
      this._setContent(templateWrapper, text, selector);
    }
    const template = templateWrapper.children[0];
    const extraClass = this._resolvePossibleFunction(this._config.extraClass);
    if (extraClass) {
      template.classList.add(...extraClass.split(' '));
    }
    return template;
  }

  // Private
  _typeCheckConfig(config) {
    super._typeCheckConfig(config);
    this._checkContent(config.content);
  }
  _checkContent(arg) {
    for (const [selector, content] of Object.entries(arg)) {
      super._typeCheckConfig({
        selector,
        entry: content
      }, DefaultContentType);
    }
  }
  _setContent(template, content, selector) {
    const templateElement = SelectorEngine.findOne(selector, template);
    if (!templateElement) {
      return;
    }
    content = this._resolvePossibleFunction(content);
    if (!content) {
      templateElement.remove();
      return;
    }
    if (isElement(content)) {
      this._putElementInTemplate(getElement(content), templateElement);
      return;
    }
    if (this._config.html) {
      templateElement.innerHTML = this._maybeSanitize(content);
      return;
    }
    templateElement.textContent = content;
  }
  _maybeSanitize(arg) {
    return this._config.sanitize ? sanitizeHtml(arg, this._config.allowList, this._config.sanitizeFn) : arg;
  }
  _resolvePossibleFunction(arg) {
    return execute(arg, [this]);
  }
  _putElementInTemplate(element, templateElement) {
    if (this._config.html) {
      templateElement.innerHTML = '';
      templateElement.append(element);
      return;
    }
    templateElement.textContent = element.textContent;
  }
}

/**
 * --------------------------------------------------------------------------
 * Bootstrap tooltip.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME$4 = 'tooltip';
const DISALLOWED_ATTRIBUTES = new Set(['sanitize', 'allowList', 'sanitizeFn']);
const CLASS_NAME_FADE$2 = 'fade';
const CLASS_NAME_MODAL = 'modal';
const CLASS_NAME_SHOW$2 = 'show';
const SELECTOR_TOOLTIP_INNER = '.tooltip-inner';
const SELECTOR_MODAL = `.${CLASS_NAME_MODAL}`;
const EVENT_MODAL_HIDE = 'hide.bs.modal';
const TRIGGER_HOVER = 'hover';
const TRIGGER_FOCUS = 'focus';
const TRIGGER_CLICK = 'click';
const TRIGGER_MANUAL = 'manual';
const EVENT_HIDE$2 = 'hide';
const EVENT_HIDDEN$2 = 'hidden';
const EVENT_SHOW$2 = 'show';
const EVENT_SHOWN$2 = 'shown';
const EVENT_INSERTED = 'inserted';
const EVENT_CLICK$1 = 'click';
const EVENT_FOCUSIN$1 = 'focusin';
const EVENT_FOCUSOUT$1 = 'focusout';
const EVENT_MOUSEENTER = 'mouseenter';
const EVENT_MOUSELEAVE = 'mouseleave';
const AttachmentMap = {
  AUTO: 'auto',
  TOP: 'top',
  RIGHT: isRTL() ? 'left' : 'right',
  BOTTOM: 'bottom',
  LEFT: isRTL() ? 'right' : 'left'
};
const Default$3 = {
  allowList: DefaultAllowlist,
  animation: true,
  boundary: 'clippingParents',
  container: false,
  customClass: '',
  delay: 0,
  fallbackPlacements: ['top', 'right', 'bottom', 'left'],
  html: false,
  offset: [0, 6],
  placement: 'top',
  popperConfig: null,
  sanitize: true,
  sanitizeFn: null,
  selector: false,
  template: '<div class="tooltip" role="tooltip">' + '<div class="tooltip-arrow"></div>' + '<div class="tooltip-inner"></div>' + '</div>',
  title: '',
  trigger: 'hover focus'
};
const DefaultType$3 = {
  allowList: 'object',
  animation: 'boolean',
  boundary: '(string|element)',
  container: '(string|element|boolean)',
  customClass: '(string|function)',
  delay: '(number|object)',
  fallbackPlacements: 'array',
  html: 'boolean',
  offset: '(array|string|function)',
  placement: '(string|function)',
  popperConfig: '(null|object|function)',
  sanitize: 'boolean',
  sanitizeFn: '(null|function)',
  selector: '(string|boolean)',
  template: 'string',
  title: '(string|element|function)',
  trigger: 'string'
};

/**
 * Class definition
 */

class Tooltip extends BaseComponent {
  constructor(element, config) {
    if (typeof _popperjs_core__WEBPACK_IMPORTED_MODULE_0__ === 'undefined') {
      throw new TypeError('Bootstrap\'s tooltips require Popper (https://popper.js.org)');
    }
    super(element, config);

    // Private
    this._isEnabled = true;
    this._timeout = 0;
    this._isHovered = null;
    this._activeTrigger = {};
    this._popper = null;
    this._templateFactory = null;
    this._newContent = null;

    // Protected
    this.tip = null;
    this._setListeners();
    if (!this._config.selector) {
      this._fixTitle();
    }
  }

  // Getters
  static get Default() {
    return Default$3;
  }
  static get DefaultType() {
    return DefaultType$3;
  }
  static get NAME() {
    return NAME$4;
  }

  // Public
  enable() {
    this._isEnabled = true;
  }
  disable() {
    this._isEnabled = false;
  }
  toggleEnabled() {
    this._isEnabled = !this._isEnabled;
  }
  toggle() {
    if (!this._isEnabled) {
      return;
    }
    this._activeTrigger.click = !this._activeTrigger.click;
    if (this._isShown()) {
      this._leave();
      return;
    }
    this._enter();
  }
  dispose() {
    clearTimeout(this._timeout);
    EventHandler.off(this._element.closest(SELECTOR_MODAL), EVENT_MODAL_HIDE, this._hideModalHandler);
    if (this._element.getAttribute('data-bs-original-title')) {
      this._element.setAttribute('title', this._element.getAttribute('data-bs-original-title'));
    }
    this._disposePopper();
    super.dispose();
  }
  show() {
    if (this._element.style.display === 'none') {
      throw new Error('Please use show on visible elements');
    }
    if (!(this._isWithContent() && this._isEnabled)) {
      return;
    }
    const showEvent = EventHandler.trigger(this._element, this.constructor.eventName(EVENT_SHOW$2));
    const shadowRoot = findShadowRoot(this._element);
    const isInTheDom = (shadowRoot || this._element.ownerDocument.documentElement).contains(this._element);
    if (showEvent.defaultPrevented || !isInTheDom) {
      return;
    }

    // TODO: v6 remove this or make it optional
    this._disposePopper();
    const tip = this._getTipElement();
    this._element.setAttribute('aria-describedby', tip.getAttribute('id'));
    const {
      container
    } = this._config;
    if (!this._element.ownerDocument.documentElement.contains(this.tip)) {
      container.append(tip);
      EventHandler.trigger(this._element, this.constructor.eventName(EVENT_INSERTED));
    }
    this._popper = this._createPopper(tip);
    tip.classList.add(CLASS_NAME_SHOW$2);

    // If this is a touch-enabled device we add extra
    // empty mouseover listeners to the body's immediate children;
    // only needed because of broken event delegation on iOS
    // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
    if ('ontouchstart' in document.documentElement) {
      for (const element of [].concat(...document.body.children)) {
        EventHandler.on(element, 'mouseover', noop);
      }
    }
    const complete = () => {
      EventHandler.trigger(this._element, this.constructor.eventName(EVENT_SHOWN$2));
      if (this._isHovered === false) {
        this._leave();
      }
      this._isHovered = false;
    };
    this._queueCallback(complete, this.tip, this._isAnimated());
  }
  hide() {
    if (!this._isShown()) {
      return;
    }
    const hideEvent = EventHandler.trigger(this._element, this.constructor.eventName(EVENT_HIDE$2));
    if (hideEvent.defaultPrevented) {
      return;
    }
    const tip = this._getTipElement();
    tip.classList.remove(CLASS_NAME_SHOW$2);

    // If this is a touch-enabled device we remove the extra
    // empty mouseover listeners we added for iOS support
    if ('ontouchstart' in document.documentElement) {
      for (const element of [].concat(...document.body.children)) {
        EventHandler.off(element, 'mouseover', noop);
      }
    }
    this._activeTrigger[TRIGGER_CLICK] = false;
    this._activeTrigger[TRIGGER_FOCUS] = false;
    this._activeTrigger[TRIGGER_HOVER] = false;
    this._isHovered = null; // it is a trick to support manual triggering

    const complete = () => {
      if (this._isWithActiveTrigger()) {
        return;
      }
      if (!this._isHovered) {
        this._disposePopper();
      }
      this._element.removeAttribute('aria-describedby');
      EventHandler.trigger(this._element, this.constructor.eventName(EVENT_HIDDEN$2));
    };
    this._queueCallback(complete, this.tip, this._isAnimated());
  }
  update() {
    if (this._popper) {
      this._popper.update();
    }
  }

  // Protected
  _isWithContent() {
    return Boolean(this._getTitle());
  }
  _getTipElement() {
    if (!this.tip) {
      this.tip = this._createTipElement(this._newContent || this._getContentForTemplate());
    }
    return this.tip;
  }
  _createTipElement(content) {
    const tip = this._getTemplateFactory(content).toHtml();

    // TODO: remove this check in v6
    if (!tip) {
      return null;
    }
    tip.classList.remove(CLASS_NAME_FADE$2, CLASS_NAME_SHOW$2);
    // TODO: v6 the following can be achieved with CSS only
    tip.classList.add(`bs-${this.constructor.NAME}-auto`);
    const tipId = getUID(this.constructor.NAME).toString();
    tip.setAttribute('id', tipId);
    if (this._isAnimated()) {
      tip.classList.add(CLASS_NAME_FADE$2);
    }
    return tip;
  }
  setContent(content) {
    this._newContent = content;
    if (this._isShown()) {
      this._disposePopper();
      this.show();
    }
  }
  _getTemplateFactory(content) {
    if (this._templateFactory) {
      this._templateFactory.changeContent(content);
    } else {
      this._templateFactory = new TemplateFactory({
        ...this._config,
        // the `content` var has to be after `this._config`
        // to override config.content in case of popover
        content,
        extraClass: this._resolvePossibleFunction(this._config.customClass)
      });
    }
    return this._templateFactory;
  }
  _getContentForTemplate() {
    return {
      [SELECTOR_TOOLTIP_INNER]: this._getTitle()
    };
  }
  _getTitle() {
    return this._resolvePossibleFunction(this._config.title) || this._element.getAttribute('data-bs-original-title');
  }

  // Private
  _initializeOnDelegatedTarget(event) {
    return this.constructor.getOrCreateInstance(event.delegateTarget, this._getDelegateConfig());
  }
  _isAnimated() {
    return this._config.animation || this.tip && this.tip.classList.contains(CLASS_NAME_FADE$2);
  }
  _isShown() {
    return this.tip && this.tip.classList.contains(CLASS_NAME_SHOW$2);
  }
  _createPopper(tip) {
    const placement = execute(this._config.placement, [this, tip, this._element]);
    const attachment = AttachmentMap[placement.toUpperCase()];
    return _popperjs_core__WEBPACK_IMPORTED_MODULE_1__.createPopper(this._element, tip, this._getPopperConfig(attachment));
  }
  _getOffset() {
    const {
      offset
    } = this._config;
    if (typeof offset === 'string') {
      return offset.split(',').map(value => Number.parseInt(value, 10));
    }
    if (typeof offset === 'function') {
      return popperData => offset(popperData, this._element);
    }
    return offset;
  }
  _resolvePossibleFunction(arg) {
    return execute(arg, [this._element]);
  }
  _getPopperConfig(attachment) {
    const defaultBsPopperConfig = {
      placement: attachment,
      modifiers: [{
        name: 'flip',
        options: {
          fallbackPlacements: this._config.fallbackPlacements
        }
      }, {
        name: 'offset',
        options: {
          offset: this._getOffset()
        }
      }, {
        name: 'preventOverflow',
        options: {
          boundary: this._config.boundary
        }
      }, {
        name: 'arrow',
        options: {
          element: `.${this.constructor.NAME}-arrow`
        }
      }, {
        name: 'preSetPlacement',
        enabled: true,
        phase: 'beforeMain',
        fn: data => {
          // Pre-set Popper's placement attribute in order to read the arrow sizes properly.
          // Otherwise, Popper mixes up the width and height dimensions since the initial arrow style is for top placement
          this._getTipElement().setAttribute('data-popper-placement', data.state.placement);
        }
      }]
    };
    return {
      ...defaultBsPopperConfig,
      ...execute(this._config.popperConfig, [defaultBsPopperConfig])
    };
  }
  _setListeners() {
    const triggers = this._config.trigger.split(' ');
    for (const trigger of triggers) {
      if (trigger === 'click') {
        EventHandler.on(this._element, this.constructor.eventName(EVENT_CLICK$1), this._config.selector, event => {
          const context = this._initializeOnDelegatedTarget(event);
          context.toggle();
        });
      } else if (trigger !== TRIGGER_MANUAL) {
        const eventIn = trigger === TRIGGER_HOVER ? this.constructor.eventName(EVENT_MOUSEENTER) : this.constructor.eventName(EVENT_FOCUSIN$1);
        const eventOut = trigger === TRIGGER_HOVER ? this.constructor.eventName(EVENT_MOUSELEAVE) : this.constructor.eventName(EVENT_FOCUSOUT$1);
        EventHandler.on(this._element, eventIn, this._config.selector, event => {
          const context = this._initializeOnDelegatedTarget(event);
          context._activeTrigger[event.type === 'focusin' ? TRIGGER_FOCUS : TRIGGER_HOVER] = true;
          context._enter();
        });
        EventHandler.on(this._element, eventOut, this._config.selector, event => {
          const context = this._initializeOnDelegatedTarget(event);
          context._activeTrigger[event.type === 'focusout' ? TRIGGER_FOCUS : TRIGGER_HOVER] = context._element.contains(event.relatedTarget);
          context._leave();
        });
      }
    }
    this._hideModalHandler = () => {
      if (this._element) {
        this.hide();
      }
    };
    EventHandler.on(this._element.closest(SELECTOR_MODAL), EVENT_MODAL_HIDE, this._hideModalHandler);
  }
  _fixTitle() {
    const title = this._element.getAttribute('title');
    if (!title) {
      return;
    }
    if (!this._element.getAttribute('aria-label') && !this._element.textContent.trim()) {
      this._element.setAttribute('aria-label', title);
    }
    this._element.setAttribute('data-bs-original-title', title); // DO NOT USE IT. Is only for backwards compatibility
    this._element.removeAttribute('title');
  }
  _enter() {
    if (this._isShown() || this._isHovered) {
      this._isHovered = true;
      return;
    }
    this._isHovered = true;
    this._setTimeout(() => {
      if (this._isHovered) {
        this.show();
      }
    }, this._config.delay.show);
  }
  _leave() {
    if (this._isWithActiveTrigger()) {
      return;
    }
    this._isHovered = false;
    this._setTimeout(() => {
      if (!this._isHovered) {
        this.hide();
      }
    }, this._config.delay.hide);
  }
  _setTimeout(handler, timeout) {
    clearTimeout(this._timeout);
    this._timeout = setTimeout(handler, timeout);
  }
  _isWithActiveTrigger() {
    return Object.values(this._activeTrigger).includes(true);
  }
  _getConfig(config) {
    const dataAttributes = Manipulator.getDataAttributes(this._element);
    for (const dataAttribute of Object.keys(dataAttributes)) {
      if (DISALLOWED_ATTRIBUTES.has(dataAttribute)) {
        delete dataAttributes[dataAttribute];
      }
    }
    config = {
      ...dataAttributes,
      ...(typeof config === 'object' && config ? config : {})
    };
    config = this._mergeConfigObj(config);
    config = this._configAfterMerge(config);
    this._typeCheckConfig(config);
    return config;
  }
  _configAfterMerge(config) {
    config.container = config.container === false ? document.body : getElement(config.container);
    if (typeof config.delay === 'number') {
      config.delay = {
        show: config.delay,
        hide: config.delay
      };
    }
    if (typeof config.title === 'number') {
      config.title = config.title.toString();
    }
    if (typeof config.content === 'number') {
      config.content = config.content.toString();
    }
    return config;
  }
  _getDelegateConfig() {
    const config = {};
    for (const [key, value] of Object.entries(this._config)) {
      if (this.constructor.Default[key] !== value) {
        config[key] = value;
      }
    }
    config.selector = false;
    config.trigger = 'manual';

    // In the future can be replaced with:
    // const keysWithDifferentValues = Object.entries(this._config).filter(entry => this.constructor.Default[entry[0]] !== this._config[entry[0]])
    // `Object.fromEntries(keysWithDifferentValues)`
    return config;
  }
  _disposePopper() {
    if (this._popper) {
      this._popper.destroy();
      this._popper = null;
    }
    if (this.tip) {
      this.tip.remove();
      this.tip = null;
    }
  }

  // Static
  static jQueryInterface(config) {
    return this.each(function () {
      const data = Tooltip.getOrCreateInstance(this, config);
      if (typeof config !== 'string') {
        return;
      }
      if (typeof data[config] === 'undefined') {
        throw new TypeError(`No method named "${config}"`);
      }
      data[config]();
    });
  }
}

/**
 * jQuery
 */

defineJQueryPlugin(Tooltip);

/**
 * --------------------------------------------------------------------------
 * Bootstrap popover.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME$3 = 'popover';
const SELECTOR_TITLE = '.popover-header';
const SELECTOR_CONTENT = '.popover-body';
const Default$2 = {
  ...Tooltip.Default,
  content: '',
  offset: [0, 8],
  placement: 'right',
  template: '<div class="popover" role="tooltip">' + '<div class="popover-arrow"></div>' + '<h3 class="popover-header"></h3>' + '<div class="popover-body"></div>' + '</div>',
  trigger: 'click'
};
const DefaultType$2 = {
  ...Tooltip.DefaultType,
  content: '(null|string|element|function)'
};

/**
 * Class definition
 */

class Popover extends Tooltip {
  // Getters
  static get Default() {
    return Default$2;
  }
  static get DefaultType() {
    return DefaultType$2;
  }
  static get NAME() {
    return NAME$3;
  }

  // Overrides
  _isWithContent() {
    return this._getTitle() || this._getContent();
  }

  // Private
  _getContentForTemplate() {
    return {
      [SELECTOR_TITLE]: this._getTitle(),
      [SELECTOR_CONTENT]: this._getContent()
    };
  }
  _getContent() {
    return this._resolvePossibleFunction(this._config.content);
  }

  // Static
  static jQueryInterface(config) {
    return this.each(function () {
      const data = Popover.getOrCreateInstance(this, config);
      if (typeof config !== 'string') {
        return;
      }
      if (typeof data[config] === 'undefined') {
        throw new TypeError(`No method named "${config}"`);
      }
      data[config]();
    });
  }
}

/**
 * jQuery
 */

defineJQueryPlugin(Popover);

/**
 * --------------------------------------------------------------------------
 * Bootstrap scrollspy.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME$2 = 'scrollspy';
const DATA_KEY$2 = 'bs.scrollspy';
const EVENT_KEY$2 = `.${DATA_KEY$2}`;
const DATA_API_KEY = '.data-api';
const EVENT_ACTIVATE = `activate${EVENT_KEY$2}`;
const EVENT_CLICK = `click${EVENT_KEY$2}`;
const EVENT_LOAD_DATA_API$1 = `load${EVENT_KEY$2}${DATA_API_KEY}`;
const CLASS_NAME_DROPDOWN_ITEM = 'dropdown-item';
const CLASS_NAME_ACTIVE$1 = 'active';
const SELECTOR_DATA_SPY = '[data-bs-spy="scroll"]';
const SELECTOR_TARGET_LINKS = '[href]';
const SELECTOR_NAV_LIST_GROUP = '.nav, .list-group';
const SELECTOR_NAV_LINKS = '.nav-link';
const SELECTOR_NAV_ITEMS = '.nav-item';
const SELECTOR_LIST_ITEMS = '.list-group-item';
const SELECTOR_LINK_ITEMS = `${SELECTOR_NAV_LINKS}, ${SELECTOR_NAV_ITEMS} > ${SELECTOR_NAV_LINKS}, ${SELECTOR_LIST_ITEMS}`;
const SELECTOR_DROPDOWN = '.dropdown';
const SELECTOR_DROPDOWN_TOGGLE$1 = '.dropdown-toggle';
const Default$1 = {
  offset: null,
  // TODO: v6 @deprecated, keep it for backwards compatibility reasons
  rootMargin: '0px 0px -25%',
  smoothScroll: false,
  target: null,
  threshold: [0.1, 0.5, 1]
};
const DefaultType$1 = {
  offset: '(number|null)',
  // TODO v6 @deprecated, keep it for backwards compatibility reasons
  rootMargin: 'string',
  smoothScroll: 'boolean',
  target: 'element',
  threshold: 'array'
};

/**
 * Class definition
 */

class ScrollSpy extends BaseComponent {
  constructor(element, config) {
    super(element, config);

    // this._element is the observablesContainer and config.target the menu links wrapper
    this._targetLinks = new Map();
    this._observableSections = new Map();
    this._rootElement = getComputedStyle(this._element).overflowY === 'visible' ? null : this._element;
    this._activeTarget = null;
    this._observer = null;
    this._previousScrollData = {
      visibleEntryTop: 0,
      parentScrollTop: 0
    };
    this.refresh(); // initialize
  }

  // Getters
  static get Default() {
    return Default$1;
  }
  static get DefaultType() {
    return DefaultType$1;
  }
  static get NAME() {
    return NAME$2;
  }

  // Public
  refresh() {
    this._initializeTargetsAndObservables();
    this._maybeEnableSmoothScroll();
    if (this._observer) {
      this._observer.disconnect();
    } else {
      this._observer = this._getNewObserver();
    }
    for (const section of this._observableSections.values()) {
      this._observer.observe(section);
    }
  }
  dispose() {
    this._observer.disconnect();
    super.dispose();
  }

  // Private
  _configAfterMerge(config) {
    // TODO: on v6 target should be given explicitly & remove the {target: 'ss-target'} case
    config.target = getElement(config.target) || document.body;

    // TODO: v6 Only for backwards compatibility reasons. Use rootMargin only
    config.rootMargin = config.offset ? `${config.offset}px 0px -30%` : config.rootMargin;
    if (typeof config.threshold === 'string') {
      config.threshold = config.threshold.split(',').map(value => Number.parseFloat(value));
    }
    return config;
  }
  _maybeEnableSmoothScroll() {
    if (!this._config.smoothScroll) {
      return;
    }

    // unregister any previous listeners
    EventHandler.off(this._config.target, EVENT_CLICK);
    EventHandler.on(this._config.target, EVENT_CLICK, SELECTOR_TARGET_LINKS, event => {
      const observableSection = this._observableSections.get(event.target.hash);
      if (observableSection) {
        event.preventDefault();
        const root = this._rootElement || window;
        const height = observableSection.offsetTop - this._element.offsetTop;
        if (root.scrollTo) {
          root.scrollTo({
            top: height,
            behavior: 'smooth'
          });
          return;
        }

        // Chrome 60 doesn't support `scrollTo`
        root.scrollTop = height;
      }
    });
  }
  _getNewObserver() {
    const options = {
      root: this._rootElement,
      threshold: this._config.threshold,
      rootMargin: this._config.rootMargin
    };
    return new IntersectionObserver(entries => this._observerCallback(entries), options);
  }

  // The logic of selection
  _observerCallback(entries) {
    const targetElement = entry => this._targetLinks.get(`#${entry.target.id}`);
    const activate = entry => {
      this._previousScrollData.visibleEntryTop = entry.target.offsetTop;
      this._process(targetElement(entry));
    };
    const parentScrollTop = (this._rootElement || document.documentElement).scrollTop;
    const userScrollsDown = parentScrollTop >= this._previousScrollData.parentScrollTop;
    this._previousScrollData.parentScrollTop = parentScrollTop;
    for (const entry of entries) {
      if (!entry.isIntersecting) {
        this._activeTarget = null;
        this._clearActiveClass(targetElement(entry));
        continue;
      }
      const entryIsLowerThanPrevious = entry.target.offsetTop >= this._previousScrollData.visibleEntryTop;
      // if we are scrolling down, pick the bigger offsetTop
      if (userScrollsDown && entryIsLowerThanPrevious) {
        activate(entry);
        // if parent isn't scrolled, let's keep the first visible item, breaking the iteration
        if (!parentScrollTop) {
          return;
        }
        continue;
      }

      // if we are scrolling up, pick the smallest offsetTop
      if (!userScrollsDown && !entryIsLowerThanPrevious) {
        activate(entry);
      }
    }
  }
  _initializeTargetsAndObservables() {
    this._targetLinks = new Map();
    this._observableSections = new Map();
    const targetLinks = SelectorEngine.find(SELECTOR_TARGET_LINKS, this._config.target);
    for (const anchor of targetLinks) {
      // ensure that the anchor has an id and is not disabled
      if (!anchor.hash || isDisabled(anchor)) {
        continue;
      }
      const observableSection = SelectorEngine.findOne(decodeURI(anchor.hash), this._element);

      // ensure that the observableSection exists & is visible
      if (isVisible(observableSection)) {
        this._targetLinks.set(decodeURI(anchor.hash), anchor);
        this._observableSections.set(anchor.hash, observableSection);
      }
    }
  }
  _process(target) {
    if (this._activeTarget === target) {
      return;
    }
    this._clearActiveClass(this._config.target);
    this._activeTarget = target;
    target.classList.add(CLASS_NAME_ACTIVE$1);
    this._activateParents(target);
    EventHandler.trigger(this._element, EVENT_ACTIVATE, {
      relatedTarget: target
    });
  }
  _activateParents(target) {
    // Activate dropdown parents
    if (target.classList.contains(CLASS_NAME_DROPDOWN_ITEM)) {
      SelectorEngine.findOne(SELECTOR_DROPDOWN_TOGGLE$1, target.closest(SELECTOR_DROPDOWN)).classList.add(CLASS_NAME_ACTIVE$1);
      return;
    }
    for (const listGroup of SelectorEngine.parents(target, SELECTOR_NAV_LIST_GROUP)) {
      // Set triggered links parents as active
      // With both <ul> and <nav> markup a parent is the previous sibling of any nav ancestor
      for (const item of SelectorEngine.prev(listGroup, SELECTOR_LINK_ITEMS)) {
        item.classList.add(CLASS_NAME_ACTIVE$1);
      }
    }
  }
  _clearActiveClass(parent) {
    parent.classList.remove(CLASS_NAME_ACTIVE$1);
    const activeNodes = SelectorEngine.find(`${SELECTOR_TARGET_LINKS}.${CLASS_NAME_ACTIVE$1}`, parent);
    for (const node of activeNodes) {
      node.classList.remove(CLASS_NAME_ACTIVE$1);
    }
  }

  // Static
  static jQueryInterface(config) {
    return this.each(function () {
      const data = ScrollSpy.getOrCreateInstance(this, config);
      if (typeof config !== 'string') {
        return;
      }
      if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
        throw new TypeError(`No method named "${config}"`);
      }
      data[config]();
    });
  }
}

/**
 * Data API implementation
 */

EventHandler.on(window, EVENT_LOAD_DATA_API$1, () => {
  for (const spy of SelectorEngine.find(SELECTOR_DATA_SPY)) {
    ScrollSpy.getOrCreateInstance(spy);
  }
});

/**
 * jQuery
 */

defineJQueryPlugin(ScrollSpy);

/**
 * --------------------------------------------------------------------------
 * Bootstrap tab.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME$1 = 'tab';
const DATA_KEY$1 = 'bs.tab';
const EVENT_KEY$1 = `.${DATA_KEY$1}`;
const EVENT_HIDE$1 = `hide${EVENT_KEY$1}`;
const EVENT_HIDDEN$1 = `hidden${EVENT_KEY$1}`;
const EVENT_SHOW$1 = `show${EVENT_KEY$1}`;
const EVENT_SHOWN$1 = `shown${EVENT_KEY$1}`;
const EVENT_CLICK_DATA_API = `click${EVENT_KEY$1}`;
const EVENT_KEYDOWN = `keydown${EVENT_KEY$1}`;
const EVENT_LOAD_DATA_API = `load${EVENT_KEY$1}`;
const ARROW_LEFT_KEY = 'ArrowLeft';
const ARROW_RIGHT_KEY = 'ArrowRight';
const ARROW_UP_KEY = 'ArrowUp';
const ARROW_DOWN_KEY = 'ArrowDown';
const HOME_KEY = 'Home';
const END_KEY = 'End';
const CLASS_NAME_ACTIVE = 'active';
const CLASS_NAME_FADE$1 = 'fade';
const CLASS_NAME_SHOW$1 = 'show';
const CLASS_DROPDOWN = 'dropdown';
const SELECTOR_DROPDOWN_TOGGLE = '.dropdown-toggle';
const SELECTOR_DROPDOWN_MENU = '.dropdown-menu';
const NOT_SELECTOR_DROPDOWN_TOGGLE = `:not(${SELECTOR_DROPDOWN_TOGGLE})`;
const SELECTOR_TAB_PANEL = '.list-group, .nav, [role="tablist"]';
const SELECTOR_OUTER = '.nav-item, .list-group-item';
const SELECTOR_INNER = `.nav-link${NOT_SELECTOR_DROPDOWN_TOGGLE}, .list-group-item${NOT_SELECTOR_DROPDOWN_TOGGLE}, [role="tab"]${NOT_SELECTOR_DROPDOWN_TOGGLE}`;
const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="tab"], [data-bs-toggle="pill"], [data-bs-toggle="list"]'; // TODO: could only be `tab` in v6
const SELECTOR_INNER_ELEM = `${SELECTOR_INNER}, ${SELECTOR_DATA_TOGGLE}`;
const SELECTOR_DATA_TOGGLE_ACTIVE = `.${CLASS_NAME_ACTIVE}[data-bs-toggle="tab"], .${CLASS_NAME_ACTIVE}[data-bs-toggle="pill"], .${CLASS_NAME_ACTIVE}[data-bs-toggle="list"]`;

/**
 * Class definition
 */

class Tab extends BaseComponent {
  constructor(element) {
    super(element);
    this._parent = this._element.closest(SELECTOR_TAB_PANEL);
    if (!this._parent) {
      return;
      // TODO: should throw exception in v6
      // throw new TypeError(`${element.outerHTML} has not a valid parent ${SELECTOR_INNER_ELEM}`)
    }

    // Set up initial aria attributes
    this._setInitialAttributes(this._parent, this._getChildren());
    EventHandler.on(this._element, EVENT_KEYDOWN, event => this._keydown(event));
  }

  // Getters
  static get NAME() {
    return NAME$1;
  }

  // Public
  show() {
    // Shows this elem and deactivate the active sibling if exists
    const innerElem = this._element;
    if (this._elemIsActive(innerElem)) {
      return;
    }

    // Search for active tab on same parent to deactivate it
    const active = this._getActiveElem();
    const hideEvent = active ? EventHandler.trigger(active, EVENT_HIDE$1, {
      relatedTarget: innerElem
    }) : null;
    const showEvent = EventHandler.trigger(innerElem, EVENT_SHOW$1, {
      relatedTarget: active
    });
    if (showEvent.defaultPrevented || hideEvent && hideEvent.defaultPrevented) {
      return;
    }
    this._deactivate(active, innerElem);
    this._activate(innerElem, active);
  }

  // Private
  _activate(element, relatedElem) {
    if (!element) {
      return;
    }
    element.classList.add(CLASS_NAME_ACTIVE);
    this._activate(SelectorEngine.getElementFromSelector(element)); // Search and activate/show the proper section

    const complete = () => {
      if (element.getAttribute('role') !== 'tab') {
        element.classList.add(CLASS_NAME_SHOW$1);
        return;
      }
      element.removeAttribute('tabindex');
      element.setAttribute('aria-selected', true);
      this._toggleDropDown(element, true);
      EventHandler.trigger(element, EVENT_SHOWN$1, {
        relatedTarget: relatedElem
      });
    };
    this._queueCallback(complete, element, element.classList.contains(CLASS_NAME_FADE$1));
  }
  _deactivate(element, relatedElem) {
    if (!element) {
      return;
    }
    element.classList.remove(CLASS_NAME_ACTIVE);
    element.blur();
    this._deactivate(SelectorEngine.getElementFromSelector(element)); // Search and deactivate the shown section too

    const complete = () => {
      if (element.getAttribute('role') !== 'tab') {
        element.classList.remove(CLASS_NAME_SHOW$1);
        return;
      }
      element.setAttribute('aria-selected', false);
      element.setAttribute('tabindex', '-1');
      this._toggleDropDown(element, false);
      EventHandler.trigger(element, EVENT_HIDDEN$1, {
        relatedTarget: relatedElem
      });
    };
    this._queueCallback(complete, element, element.classList.contains(CLASS_NAME_FADE$1));
  }
  _keydown(event) {
    if (![ARROW_LEFT_KEY, ARROW_RIGHT_KEY, ARROW_UP_KEY, ARROW_DOWN_KEY, HOME_KEY, END_KEY].includes(event.key)) {
      return;
    }
    event.stopPropagation(); // stopPropagation/preventDefault both added to support up/down keys without scrolling the page
    event.preventDefault();
    const children = this._getChildren().filter(element => !isDisabled(element));
    let nextActiveElement;
    if ([HOME_KEY, END_KEY].includes(event.key)) {
      nextActiveElement = children[event.key === HOME_KEY ? 0 : children.length - 1];
    } else {
      const isNext = [ARROW_RIGHT_KEY, ARROW_DOWN_KEY].includes(event.key);
      nextActiveElement = getNextActiveElement(children, event.target, isNext, true);
    }
    if (nextActiveElement) {
      nextActiveElement.focus({
        preventScroll: true
      });
      Tab.getOrCreateInstance(nextActiveElement).show();
    }
  }
  _getChildren() {
    // collection of inner elements
    return SelectorEngine.find(SELECTOR_INNER_ELEM, this._parent);
  }
  _getActiveElem() {
    return this._getChildren().find(child => this._elemIsActive(child)) || null;
  }
  _setInitialAttributes(parent, children) {
    this._setAttributeIfNotExists(parent, 'role', 'tablist');
    for (const child of children) {
      this._setInitialAttributesOnChild(child);
    }
  }
  _setInitialAttributesOnChild(child) {
    child = this._getInnerElement(child);
    const isActive = this._elemIsActive(child);
    const outerElem = this._getOuterElement(child);
    child.setAttribute('aria-selected', isActive);
    if (outerElem !== child) {
      this._setAttributeIfNotExists(outerElem, 'role', 'presentation');
    }
    if (!isActive) {
      child.setAttribute('tabindex', '-1');
    }
    this._setAttributeIfNotExists(child, 'role', 'tab');

    // set attributes to the related panel too
    this._setInitialAttributesOnTargetPanel(child);
  }
  _setInitialAttributesOnTargetPanel(child) {
    const target = SelectorEngine.getElementFromSelector(child);
    if (!target) {
      return;
    }
    this._setAttributeIfNotExists(target, 'role', 'tabpanel');
    if (child.id) {
      this._setAttributeIfNotExists(target, 'aria-labelledby', `${child.id}`);
    }
  }
  _toggleDropDown(element, open) {
    const outerElem = this._getOuterElement(element);
    if (!outerElem.classList.contains(CLASS_DROPDOWN)) {
      return;
    }
    const toggle = (selector, className) => {
      const element = SelectorEngine.findOne(selector, outerElem);
      if (element) {
        element.classList.toggle(className, open);
      }
    };
    toggle(SELECTOR_DROPDOWN_TOGGLE, CLASS_NAME_ACTIVE);
    toggle(SELECTOR_DROPDOWN_MENU, CLASS_NAME_SHOW$1);
    outerElem.setAttribute('aria-expanded', open);
  }
  _setAttributeIfNotExists(element, attribute, value) {
    if (!element.hasAttribute(attribute)) {
      element.setAttribute(attribute, value);
    }
  }
  _elemIsActive(elem) {
    return elem.classList.contains(CLASS_NAME_ACTIVE);
  }

  // Try to get the inner element (usually the .nav-link)
  _getInnerElement(elem) {
    return elem.matches(SELECTOR_INNER_ELEM) ? elem : SelectorEngine.findOne(SELECTOR_INNER_ELEM, elem);
  }

  // Try to get the outer element (usually the .nav-item)
  _getOuterElement(elem) {
    return elem.closest(SELECTOR_OUTER) || elem;
  }

  // Static
  static jQueryInterface(config) {
    return this.each(function () {
      const data = Tab.getOrCreateInstance(this);
      if (typeof config !== 'string') {
        return;
      }
      if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
        throw new TypeError(`No method named "${config}"`);
      }
      data[config]();
    });
  }
}

/**
 * Data API implementation
 */

EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
  if (['A', 'AREA'].includes(this.tagName)) {
    event.preventDefault();
  }
  if (isDisabled(this)) {
    return;
  }
  Tab.getOrCreateInstance(this).show();
});

/**
 * Initialize on focus
 */
EventHandler.on(window, EVENT_LOAD_DATA_API, () => {
  for (const element of SelectorEngine.find(SELECTOR_DATA_TOGGLE_ACTIVE)) {
    Tab.getOrCreateInstance(element);
  }
});
/**
 * jQuery
 */

defineJQueryPlugin(Tab);

/**
 * --------------------------------------------------------------------------
 * Bootstrap toast.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME = 'toast';
const DATA_KEY = 'bs.toast';
const EVENT_KEY = `.${DATA_KEY}`;
const EVENT_MOUSEOVER = `mouseover${EVENT_KEY}`;
const EVENT_MOUSEOUT = `mouseout${EVENT_KEY}`;
const EVENT_FOCUSIN = `focusin${EVENT_KEY}`;
const EVENT_FOCUSOUT = `focusout${EVENT_KEY}`;
const EVENT_HIDE = `hide${EVENT_KEY}`;
const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
const EVENT_SHOW = `show${EVENT_KEY}`;
const EVENT_SHOWN = `shown${EVENT_KEY}`;
const CLASS_NAME_FADE = 'fade';
const CLASS_NAME_HIDE = 'hide'; // @deprecated - kept here only for backwards compatibility
const CLASS_NAME_SHOW = 'show';
const CLASS_NAME_SHOWING = 'showing';
const DefaultType = {
  animation: 'boolean',
  autohide: 'boolean',
  delay: 'number'
};
const Default = {
  animation: true,
  autohide: true,
  delay: 5000
};

/**
 * Class definition
 */

class Toast extends BaseComponent {
  constructor(element, config) {
    super(element, config);
    this._timeout = null;
    this._hasMouseInteraction = false;
    this._hasKeyboardInteraction = false;
    this._setListeners();
  }

  // Getters
  static get Default() {
    return Default;
  }
  static get DefaultType() {
    return DefaultType;
  }
  static get NAME() {
    return NAME;
  }

  // Public
  show() {
    const showEvent = EventHandler.trigger(this._element, EVENT_SHOW);
    if (showEvent.defaultPrevented) {
      return;
    }
    this._clearTimeout();
    if (this._config.animation) {
      this._element.classList.add(CLASS_NAME_FADE);
    }
    const complete = () => {
      this._element.classList.remove(CLASS_NAME_SHOWING);
      EventHandler.trigger(this._element, EVENT_SHOWN);
      this._maybeScheduleHide();
    };
    this._element.classList.remove(CLASS_NAME_HIDE); // @deprecated
    reflow(this._element);
    this._element.classList.add(CLASS_NAME_SHOW, CLASS_NAME_SHOWING);
    this._queueCallback(complete, this._element, this._config.animation);
  }
  hide() {
    if (!this.isShown()) {
      return;
    }
    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE);
    if (hideEvent.defaultPrevented) {
      return;
    }
    const complete = () => {
      this._element.classList.add(CLASS_NAME_HIDE); // @deprecated
      this._element.classList.remove(CLASS_NAME_SHOWING, CLASS_NAME_SHOW);
      EventHandler.trigger(this._element, EVENT_HIDDEN);
    };
    this._element.classList.add(CLASS_NAME_SHOWING);
    this._queueCallback(complete, this._element, this._config.animation);
  }
  dispose() {
    this._clearTimeout();
    if (this.isShown()) {
      this._element.classList.remove(CLASS_NAME_SHOW);
    }
    super.dispose();
  }
  isShown() {
    return this._element.classList.contains(CLASS_NAME_SHOW);
  }

  // Private

  _maybeScheduleHide() {
    if (!this._config.autohide) {
      return;
    }
    if (this._hasMouseInteraction || this._hasKeyboardInteraction) {
      return;
    }
    this._timeout = setTimeout(() => {
      this.hide();
    }, this._config.delay);
  }
  _onInteraction(event, isInteracting) {
    switch (event.type) {
      case 'mouseover':
      case 'mouseout':
        {
          this._hasMouseInteraction = isInteracting;
          break;
        }
      case 'focusin':
      case 'focusout':
        {
          this._hasKeyboardInteraction = isInteracting;
          break;
        }
    }
    if (isInteracting) {
      this._clearTimeout();
      return;
    }
    const nextElement = event.relatedTarget;
    if (this._element === nextElement || this._element.contains(nextElement)) {
      return;
    }
    this._maybeScheduleHide();
  }
  _setListeners() {
    EventHandler.on(this._element, EVENT_MOUSEOVER, event => this._onInteraction(event, true));
    EventHandler.on(this._element, EVENT_MOUSEOUT, event => this._onInteraction(event, false));
    EventHandler.on(this._element, EVENT_FOCUSIN, event => this._onInteraction(event, true));
    EventHandler.on(this._element, EVENT_FOCUSOUT, event => this._onInteraction(event, false));
  }
  _clearTimeout() {
    clearTimeout(this._timeout);
    this._timeout = null;
  }

  // Static
  static jQueryInterface(config) {
    return this.each(function () {
      const data = Toast.getOrCreateInstance(this, config);
      if (typeof config === 'string') {
        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`);
        }
        data[config](this);
      }
    });
  }
}

/**
 * Data API implementation
 */

enableDismissTrigger(Toast);

/**
 * jQuery
 */

defineJQueryPlugin(Toast);


//# sourceMappingURL=bootstrap.esm.js.map


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[6].oneOf[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[6].oneOf[1].use[2]!./node_modules/filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css":
/*!*****************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[6].oneOf[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[6].oneOf[1].use[2]!./node_modules/filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css ***!
  \*****************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, "/*!\n * FilePondPluginImagePreview 4.6.12\n * Licensed under MIT, https://opensource.org/licenses/MIT/\n * Please visit https://pqina.nl/filepond/ for details.\n */\n\n/* eslint-disable */\n.filepond--image-preview-markup {\n  position: absolute;\n  left: 0;\n  top: 0;\n}\n.filepond--image-preview-wrapper {\n  z-index: 2;\n}\n.filepond--image-preview-overlay {\n  display: block;\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  min-height: 5rem;\n  max-height: 7rem;\n  margin: 0;\n  opacity: 0;\n  z-index: 2;\n  pointer-events: none;\n  -webkit-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n.filepond--image-preview-overlay svg {\n  width: 100%;\n  height: auto;\n  color: inherit;\n  max-height: inherit;\n}\n.filepond--image-preview-overlay-idle {\n  mix-blend-mode: multiply;\n  color: rgba(40, 40, 40, 0.85);\n}\n.filepond--image-preview-overlay-success {\n  mix-blend-mode: normal;\n  color: rgba(54, 151, 99, 1);\n}\n.filepond--image-preview-overlay-failure {\n  mix-blend-mode: normal;\n  color: rgba(196, 78, 71, 1);\n}\n/* disable for Safari as mix-blend-mode causes the overflow:hidden of the parent container to not work */\n@supports (-webkit-marquee-repetition: infinite) and\n  ((-o-object-fit: fill) or (object-fit: fill)) {\n  .filepond--image-preview-overlay-idle {\n    mix-blend-mode: normal;\n  }\n}\n.filepond--image-preview-wrapper {\n  /* no interaction */\n  -webkit-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n\n  /* have preview fill up all available space */\n  position: absolute;\n  left: 0;\n  top: 0;\n  right: 0;\n  height: 100%;\n  margin: 0;\n\n  /* radius is .05em less to prevent the panel background color from shining through */\n  border-radius: 0.45em;\n  overflow: hidden;\n\n  /* this seems to prevent Chrome from redrawing this layer constantly */\n  background: rgba(0, 0, 0, 0.01);\n}\n.filepond--image-preview {\n  position: absolute;\n  left: 0;\n  top: 0;\n  z-index: 1;\n  display: flex; /* this aligns the graphic vertically if the panel is higher than the image */\n  align-items: center;\n  height: 100%;\n  width: 100%;\n  pointer-events: none;\n  background: #222;\n\n  /* will be animated */\n  will-change: transform, opacity;\n}\n.filepond--image-clip {\n  position: relative;\n  overflow: hidden;\n  margin: 0 auto;\n\n  /* transparency indicator (currently only supports grid or basic color) */\n}\n.filepond--image-clip[data-transparency-indicator='grid'] img,\n.filepond--image-clip[data-transparency-indicator='grid'] canvas {\n  background-color: #fff;\n  background-image: url(\"data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg' fill='%23eee'%3E%3Cpath d='M0 0 H50 V50 H0'/%3E%3Cpath d='M50 50 H100 V100 H50'/%3E%3C/svg%3E\");\n  background-size: 1.25em 1.25em;\n}\n.filepond--image-bitmap,\n.filepond--image-vector {\n  position: absolute;\n  left: 0;\n  top: 0;\n  will-change: transform;\n}\n.filepond--root[data-style-panel-layout~='integrated']\n  .filepond--image-preview-wrapper {\n  border-radius: 0;\n}\n.filepond--root[data-style-panel-layout~='integrated']\n  .filepond--image-preview {\n  height: 100%;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n.filepond--root[data-style-panel-layout~='circle']\n  .filepond--image-preview-wrapper {\n  border-radius: 99999rem;\n}\n.filepond--root[data-style-panel-layout~='circle']\n  .filepond--image-preview-overlay {\n  top: auto;\n  bottom: 0;\n  -webkit-transform: scaleY(-1);\n  transform: scaleY(-1);\n}\n.filepond--root[data-style-panel-layout~='circle']\n  .filepond--file\n  .filepond--file-action-button[data-align*='bottom']:not([data-align*='center']) {\n  margin-bottom: 0.325em;\n}\n.filepond--root[data-style-panel-layout~='circle']\n  .filepond--file\n  [data-align*='left'] {\n  left: calc(50% - 3em);\n}\n.filepond--root[data-style-panel-layout~='circle']\n  .filepond--file\n  [data-align*='right'] {\n  right: calc(50% - 3em);\n}\n.filepond--root[data-style-panel-layout~='circle']\n  .filepond--progress-indicator[data-align*='bottom'][data-align*='left'],\n.filepond--root[data-style-panel-layout~='circle']\n  .filepond--progress-indicator[data-align*='bottom'][data-align*='right'] {\n  margin-bottom: calc(0.325em + 0.1875em);\n}\n.filepond--root[data-style-panel-layout~='circle']\n  .filepond--progress-indicator[data-align*='bottom'][data-align*='center'] {\n  margin-top: 0;\n  margin-bottom: 0.1875em;\n  margin-left: 0.1875em;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[6].oneOf[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[6].oneOf[1].use[2]!./node_modules/filepond/dist/filepond.min.css":
/*!***************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[6].oneOf[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[6].oneOf[1].use[2]!./node_modules/filepond/dist/filepond.min.css ***!
  \***************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, "/*!\n * FilePond 4.32.1\n * Licensed under MIT, https://opensource.org/licenses/MIT/\n * Please visit https://pqina.nl/filepond/ for details.\n */\n\n/* eslint-disable */\n.filepond--assistant{position:absolute;overflow:hidden;height:1px;width:1px;padding:0;border:0;clip:rect(1px,1px,1px,1px);-webkit-clip-path:inset(50%);clip-path:inset(50%);white-space:nowrap}.filepond--browser.filepond--browser{position:absolute;margin:0;padding:0;left:1em;top:1.75em;width:calc(100% - 2em);opacity:0;font-size:0}.filepond--data{position:absolute;width:0;height:0;padding:0;margin:0;border:none;visibility:hidden;pointer-events:none;contain:strict}.filepond--drip{position:absolute;top:0;left:0;right:0;bottom:0;overflow:hidden;opacity:.1;pointer-events:none;border-radius:.5em;background:rgba(0,0,0,.01)}.filepond--drip-blob{-webkit-transform-origin:center center;transform-origin:center center;width:8em;height:8em;margin-left:-4em;margin-top:-4em;background:#292625;border-radius:50%}.filepond--drip-blob,.filepond--drop-label{position:absolute;top:0;left:0;will-change:transform,opacity}.filepond--drop-label{right:0;margin:0;color:#4f4f4f;display:flex;justify-content:center;align-items:center;height:0;-webkit-user-select:none;-ms-user-select:none;user-select:none}.filepond--drop-label.filepond--drop-label label{display:block;margin:0;padding:.5em}.filepond--drop-label label{cursor:default;font-size:.875em;font-weight:400;text-align:center;line-height:1.5}.filepond--label-action{text-decoration:underline;-webkit-text-decoration-skip:ink;text-decoration-skip-ink:auto;-webkit-text-decoration-color:#a7a4a4;text-decoration-color:#a7a4a4;cursor:pointer}.filepond--root[data-disabled] .filepond--drop-label label{opacity:.5}.filepond--file-action-button.filepond--file-action-button{font-size:1em;width:1.625em;height:1.625em;font-family:inherit;line-height:inherit;margin:0;padding:0;border:none;outline:none;will-change:transform,opacity}.filepond--file-action-button.filepond--file-action-button span{position:absolute;overflow:hidden;height:1px;width:1px;padding:0;border:0;clip:rect(1px,1px,1px,1px);-webkit-clip-path:inset(50%);clip-path:inset(50%);white-space:nowrap}.filepond--file-action-button.filepond--file-action-button svg{width:100%;height:100%}.filepond--file-action-button.filepond--file-action-button:after{position:absolute;left:-.75em;right:-.75em;top:-.75em;bottom:-.75em;content:\"\"}.filepond--file-action-button{cursor:auto;color:#fff;border-radius:50%;background-color:rgba(0,0,0,.5);background-image:none;box-shadow:0 0 0 0 hsla(0,0%,100%,0);transition:box-shadow .25s ease-in}.filepond--file-action-button:focus,.filepond--file-action-button:hover{box-shadow:0 0 0 .125em hsla(0,0%,100%,.9)}.filepond--file-action-button[disabled]{color:hsla(0,0%,100%,.5);background-color:rgba(0,0,0,.25)}.filepond--file-action-button[hidden]{display:none}.filepond--action-edit-item.filepond--action-edit-item{width:2em;height:2em;padding:.1875em}.filepond--action-edit-item.filepond--action-edit-item[data-align*=center]{margin-left:-.1875em}.filepond--action-edit-item.filepond--action-edit-item[data-align*=bottom]{margin-bottom:-.1875em}.filepond--action-edit-item-alt{border:none;line-height:inherit;background:transparent;font-family:inherit;color:inherit;outline:none;padding:0;margin:0 0 0 .25em;pointer-events:all;position:absolute}.filepond--action-edit-item-alt svg{width:1.3125em;height:1.3125em}.filepond--action-edit-item-alt span{font-size:0;opacity:0}.filepond--file-info{position:static;display:flex;flex-direction:column;align-items:flex-start;flex:1;margin:0 .5em 0 0;min-width:0;will-change:transform,opacity;pointer-events:none;-webkit-user-select:none;-ms-user-select:none;user-select:none}.filepond--file-info *{margin:0}.filepond--file-info .filepond--file-info-main{font-size:.75em;line-height:1.2;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;width:100%}.filepond--file-info .filepond--file-info-sub{font-size:.625em;opacity:.5;transition:opacity .25s ease-in-out;white-space:nowrap}.filepond--file-info .filepond--file-info-sub:empty{display:none}.filepond--file-status{position:static;display:flex;flex-direction:column;align-items:flex-end;flex-grow:0;flex-shrink:0;margin:0;min-width:2.25em;text-align:right;will-change:transform,opacity;pointer-events:none;-webkit-user-select:none;-ms-user-select:none;user-select:none}.filepond--file-status *{margin:0;white-space:nowrap}.filepond--file-status .filepond--file-status-main{font-size:.75em;line-height:1.2}.filepond--file-status .filepond--file-status-sub{font-size:.625em;opacity:.5;transition:opacity .25s ease-in-out}.filepond--file-wrapper.filepond--file-wrapper{border:none;margin:0;padding:0;min-width:0;height:100%}.filepond--file-wrapper.filepond--file-wrapper>legend{position:absolute;overflow:hidden;height:1px;width:1px;padding:0;border:0;clip:rect(1px,1px,1px,1px);-webkit-clip-path:inset(50%);clip-path:inset(50%);white-space:nowrap}.filepond--file{position:static;display:flex;height:100%;align-items:flex-start;padding:.5625em;color:#fff;border-radius:.5em}.filepond--file .filepond--file-status{margin-left:auto;margin-right:2.25em}.filepond--file .filepond--processing-complete-indicator{pointer-events:none;-webkit-user-select:none;-ms-user-select:none;user-select:none;z-index:3}.filepond--file .filepond--file-action-button,.filepond--file .filepond--processing-complete-indicator,.filepond--file .filepond--progress-indicator{position:absolute}.filepond--file [data-align*=left]{left:.5625em}.filepond--file [data-align*=right]{right:.5625em}.filepond--file [data-align*=center]{left:calc(50% - .8125em)}.filepond--file [data-align*=bottom]{bottom:1.125em}.filepond--file [data-align=center]{top:calc(50% - .8125em)}.filepond--file .filepond--progress-indicator{margin-top:.1875em}.filepond--file .filepond--progress-indicator[data-align*=right]{margin-right:.1875em}.filepond--file .filepond--progress-indicator[data-align*=left]{margin-left:.1875em}[data-filepond-item-state*=error] .filepond--file-info,[data-filepond-item-state*=invalid] .filepond--file-info,[data-filepond-item-state=cancelled] .filepond--file-info{margin-right:2.25em}[data-filepond-item-state~=processing] .filepond--file-status-sub{opacity:0}[data-filepond-item-state~=processing] .filepond--action-abort-item-processing~.filepond--file-status .filepond--file-status-sub{opacity:.5}[data-filepond-item-state=processing-error] .filepond--file-status-sub{opacity:0}[data-filepond-item-state=processing-error] .filepond--action-retry-item-processing~.filepond--file-status .filepond--file-status-sub{opacity:.5}[data-filepond-item-state=processing-complete] .filepond--action-revert-item-processing svg{-webkit-animation:fall .5s linear .125s both;animation:fall .5s linear .125s both}[data-filepond-item-state=processing-complete] .filepond--file-status-sub{opacity:.5}[data-filepond-item-state=processing-complete] .filepond--file-info-sub,[data-filepond-item-state=processing-complete] .filepond--processing-complete-indicator:not([style*=hidden])~.filepond--file-status .filepond--file-status-sub{opacity:0}[data-filepond-item-state=processing-complete] .filepond--action-revert-item-processing~.filepond--file-info .filepond--file-info-sub{opacity:.5}[data-filepond-item-state*=error] .filepond--file-wrapper,[data-filepond-item-state*=error] .filepond--panel,[data-filepond-item-state*=invalid] .filepond--file-wrapper,[data-filepond-item-state*=invalid] .filepond--panel{-webkit-animation:shake .65s linear both;animation:shake .65s linear both}[data-filepond-item-state*=busy] .filepond--progress-indicator svg{-webkit-animation:spin 1s linear infinite;animation:spin 1s linear infinite}@-webkit-keyframes spin{0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)}to{-webkit-transform:rotate(1turn);transform:rotate(1turn)}}@keyframes spin{0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)}to{-webkit-transform:rotate(1turn);transform:rotate(1turn)}}@-webkit-keyframes shake{10%,90%{-webkit-transform:translateX(-.0625em);transform:translateX(-.0625em)}20%,80%{-webkit-transform:translateX(.125em);transform:translateX(.125em)}30%,50%,70%{-webkit-transform:translateX(-.25em);transform:translateX(-.25em)}40%,60%{-webkit-transform:translateX(.25em);transform:translateX(.25em)}}@keyframes shake{10%,90%{-webkit-transform:translateX(-.0625em);transform:translateX(-.0625em)}20%,80%{-webkit-transform:translateX(.125em);transform:translateX(.125em)}30%,50%,70%{-webkit-transform:translateX(-.25em);transform:translateX(-.25em)}40%,60%{-webkit-transform:translateX(.25em);transform:translateX(.25em)}}@-webkit-keyframes fall{0%{opacity:0;-webkit-transform:scale(.5);transform:scale(.5);-webkit-animation-timing-function:ease-out;animation-timing-function:ease-out}70%{opacity:1;-webkit-transform:scale(1.1);transform:scale(1.1);-webkit-animation-timing-function:ease-in-out;animation-timing-function:ease-in-out}to{-webkit-transform:scale(1);transform:scale(1);-webkit-animation-timing-function:ease-out;animation-timing-function:ease-out}}@keyframes fall{0%{opacity:0;-webkit-transform:scale(.5);transform:scale(.5);-webkit-animation-timing-function:ease-out;animation-timing-function:ease-out}70%{opacity:1;-webkit-transform:scale(1.1);transform:scale(1.1);-webkit-animation-timing-function:ease-in-out;animation-timing-function:ease-in-out}to{-webkit-transform:scale(1);transform:scale(1);-webkit-animation-timing-function:ease-out;animation-timing-function:ease-out}}.filepond--hopper[data-hopper-state=drag-over]>*{pointer-events:none}.filepond--hopper[data-hopper-state=drag-over]:after{content:\"\";position:absolute;left:0;top:0;right:0;bottom:0;z-index:100}.filepond--progress-indicator{z-index:103}.filepond--file-action-button{z-index:102}.filepond--file-status{z-index:101}.filepond--file-info{z-index:100}.filepond--item{position:absolute;top:0;left:0;right:0;z-index:1;padding:0;margin:.25em;will-change:transform,opacity;touch-action:none}.filepond--item>.filepond--panel{z-index:-1}.filepond--item>.filepond--panel .filepond--panel-bottom{box-shadow:0 .0625em .125em -.0625em rgba(0,0,0,.25)}.filepond--item>.filepond--file-wrapper,.filepond--item>.filepond--panel{transition:opacity .15s ease-out}.filepond--item[data-drag-state]{cursor:-webkit-grab;cursor:grab}.filepond--item[data-drag-state]>.filepond--panel{transition:box-shadow .125s ease-in-out;box-shadow:0 0 0 transparent}.filepond--item[data-drag-state=drag]{cursor:-webkit-grabbing;cursor:grabbing}.filepond--item[data-drag-state=drag]>.filepond--panel{box-shadow:0 .125em .3125em rgba(0,0,0,.325)}.filepond--item[data-drag-state]:not([data-drag-state=idle]){z-index:2}.filepond--item-panel{background-color:#64605e}[data-filepond-item-state=processing-complete] .filepond--item-panel{background-color:#369763}[data-filepond-item-state*=error] .filepond--item-panel,[data-filepond-item-state*=invalid] .filepond--item-panel{background-color:#c44e47}.filepond--item-panel{border-radius:.5em;transition:background-color .25s}.filepond--list-scroller{position:absolute;top:0;left:0;right:0;margin:0;will-change:transform}.filepond--list-scroller[data-state=overflow] .filepond--list{bottom:0;right:0}.filepond--list-scroller[data-state=overflow]{overflow-y:scroll;overflow-x:hidden;-webkit-overflow-scrolling:touch;-webkit-mask:linear-gradient(180deg,#000 calc(100% - .5em),transparent);mask:linear-gradient(180deg,#000 calc(100% - .5em),transparent)}.filepond--list-scroller::-webkit-scrollbar{background:transparent}.filepond--list-scroller::-webkit-scrollbar:vertical{width:1em}.filepond--list-scroller::-webkit-scrollbar:horizontal{height:0}.filepond--list-scroller::-webkit-scrollbar-thumb{background-color:rgba(0,0,0,.3);border-radius:99999px;border:.3125em solid transparent;background-clip:content-box}.filepond--list.filepond--list{position:absolute;top:0;margin:0;padding:0;list-style-type:none;will-change:transform}.filepond--list{left:.75em;right:.75em}.filepond--root[data-style-panel-layout~=integrated]{width:100%;height:100%;max-width:none;margin:0}.filepond--root[data-style-panel-layout~=circle] .filepond--panel-root,.filepond--root[data-style-panel-layout~=integrated] .filepond--panel-root{border-radius:0}.filepond--root[data-style-panel-layout~=circle] .filepond--panel-root>*,.filepond--root[data-style-panel-layout~=integrated] .filepond--panel-root>*{display:none}.filepond--root[data-style-panel-layout~=circle] .filepond--drop-label,.filepond--root[data-style-panel-layout~=integrated] .filepond--drop-label{bottom:0;height:auto;display:flex;justify-content:center;align-items:center;z-index:7}.filepond--root[data-style-panel-layout~=circle] .filepond--item-panel,.filepond--root[data-style-panel-layout~=integrated] .filepond--item-panel{display:none}.filepond--root[data-style-panel-layout~=compact] .filepond--list-scroller,.filepond--root[data-style-panel-layout~=integrated] .filepond--list-scroller{overflow:hidden;height:100%;margin-top:0;margin-bottom:0}.filepond--root[data-style-panel-layout~=compact] .filepond--list,.filepond--root[data-style-panel-layout~=integrated] .filepond--list{left:0;right:0;height:100%}.filepond--root[data-style-panel-layout~=compact] .filepond--item,.filepond--root[data-style-panel-layout~=integrated] .filepond--item{margin:0}.filepond--root[data-style-panel-layout~=compact] .filepond--file-wrapper,.filepond--root[data-style-panel-layout~=integrated] .filepond--file-wrapper{height:100%}.filepond--root[data-style-panel-layout~=compact] .filepond--drop-label,.filepond--root[data-style-panel-layout~=integrated] .filepond--drop-label{z-index:7}.filepond--root[data-style-panel-layout~=circle]{border-radius:99999rem;overflow:hidden}.filepond--root[data-style-panel-layout~=circle]>.filepond--panel{border-radius:inherit}.filepond--root[data-style-panel-layout~=circle]>.filepond--panel>*{display:none}.filepond--root[data-style-panel-layout~=circle] .filepond--file-info,.filepond--root[data-style-panel-layout~=circle] .filepond--file-status{display:none}.filepond--root[data-style-panel-layout~=circle] .filepond--action-edit-item{opacity:1!important;visibility:visible!important}@media not all and (-webkit-min-device-pixel-ratio:0), not all and (min-resolution:0.001dpcm){@supports (-webkit-appearance:none) and (stroke-color:transparent){.filepond--root[data-style-panel-layout~=circle]{will-change:transform}}}.filepond--panel-root{border-radius:.5em;background-color:#f1f0ef}.filepond--panel{position:absolute;left:0;top:0;right:0;margin:0;height:100%!important;pointer-events:none}.filepond-panel:not([data-scalable=false]){height:auto!important}.filepond--panel[data-scalable=false]>div{display:none}.filepond--panel[data-scalable=true]{-webkit-transform-style:preserve-3d;transform-style:preserve-3d;background-color:transparent!important;border:none!important}.filepond--panel-bottom,.filepond--panel-center,.filepond--panel-top{position:absolute;left:0;top:0;right:0;margin:0;padding:0}.filepond--panel-bottom,.filepond--panel-top{height:.5em}.filepond--panel-top{border-bottom-left-radius:0!important;border-bottom-right-radius:0!important;border-bottom:none!important}.filepond--panel-top:after{content:\"\";position:absolute;height:2px;left:0;right:0;bottom:-1px;background-color:inherit}.filepond--panel-bottom,.filepond--panel-center{will-change:transform;-webkit-backface-visibility:hidden;backface-visibility:hidden;-webkit-transform-origin:left top;transform-origin:left top;-webkit-transform:translate3d(0,.5em,0);transform:translate3d(0,.5em,0)}.filepond--panel-bottom{border-top-left-radius:0!important;border-top-right-radius:0!important;border-top:none!important}.filepond--panel-bottom:before{content:\"\";position:absolute;height:2px;left:0;right:0;top:-1px;background-color:inherit}.filepond--panel-center{height:100px!important;border-top:none!important;border-bottom:none!important;border-radius:0!important}.filepond--panel-center:not([style]){visibility:hidden}.filepond--progress-indicator{position:static;width:1.25em;height:1.25em;color:#fff;margin:0;pointer-events:none;will-change:transform,opacity}.filepond--progress-indicator svg{width:100%;height:100%;vertical-align:top;transform-box:fill-box}.filepond--progress-indicator path{fill:none;stroke:currentColor}.filepond--list-scroller{z-index:6}.filepond--drop-label{z-index:5}.filepond--drip{z-index:3}.filepond--root>.filepond--panel{z-index:2}.filepond--browser{z-index:1}.filepond--root{box-sizing:border-box;position:relative;margin-bottom:1em;font-size:1rem;line-height:normal;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol;font-weight:450;text-align:left;text-rendering:optimizeLegibility;direction:ltr;contain:layout style size}.filepond--root *{box-sizing:inherit;line-height:inherit}.filepond--root :not(text){font-size:inherit}.filepond--root[data-disabled]{pointer-events:none}.filepond--root[data-disabled] .filepond--list-scroller{pointer-events:all}.filepond--root[data-disabled] .filepond--list{pointer-events:none}.filepond--root .filepond--drop-label{min-height:4.75em}.filepond--root .filepond--list-scroller{margin-top:1em;margin-bottom:1em}.filepond--root .filepond--credits{position:absolute;right:0;opacity:.175;line-height:.85;font-size:11px;color:inherit;text-decoration:none;z-index:3;bottom:-14px}.filepond--root .filepond--credits[style]{top:0;bottom:auto;margin-top:14px}", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join("");
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === "string") {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, ""]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),

/***/ "./node_modules/filepond-plugin-file-validate-size/dist/filepond-plugin-file-validate-size.js":
/*!****************************************************************************************************!*\
  !*** ./node_modules/filepond-plugin-file-validate-size/dist/filepond-plugin-file-validate-size.js ***!
  \****************************************************************************************************/
/***/ (function(module) {

/*!
 * FilePondPluginFileValidateSize 2.2.8
 * Licensed under MIT, https://opensource.org/licenses/MIT/
 * Please visit https://pqina.nl/filepond/ for details.
 */

/* eslint-disable */

(function(global, factory) {
     true
        ? (module.exports = factory())
        : 0;
})(this, function() {
    'use strict';

    var plugin = function plugin(_ref) {
        var addFilter = _ref.addFilter,
            utils = _ref.utils;
        // get quick reference to Type utils
        var Type = utils.Type,
            replaceInString = utils.replaceInString,
            toNaturalFileSize = utils.toNaturalFileSize;

        // filtering if an item is allowed in hopper
        addFilter('ALLOW_HOPPER_ITEM', function(file, _ref2) {
            var query = _ref2.query;
            if (!query('GET_ALLOW_FILE_SIZE_VALIDATION')) {
                return true;
            }

            var sizeMax = query('GET_MAX_FILE_SIZE');
            if (sizeMax !== null && file.size > sizeMax) {
                return false;
            }

            var sizeMin = query('GET_MIN_FILE_SIZE');
            if (sizeMin !== null && file.size < sizeMin) {
                return false;
            }

            return true;
        });

        // called for each file that is loaded
        // right before it is set to the item state
        // should return a promise
        addFilter('LOAD_FILE', function(file, _ref3) {
            var query = _ref3.query;
            return new Promise(function(resolve, reject) {
                // if not allowed, all fine, exit
                if (!query('GET_ALLOW_FILE_SIZE_VALIDATION')) {
                    return resolve(file);
                }

                // check if file should be filtered
                var fileFilter = query('GET_FILE_VALIDATE_SIZE_FILTER');
                if (fileFilter && !fileFilter(file)) {
                    return resolve(file);
                }

                // reject or resolve based on file size
                var sizeMax = query('GET_MAX_FILE_SIZE');
                if (sizeMax !== null && file.size > sizeMax) {
                    reject({
                        status: {
                            main: query('GET_LABEL_MAX_FILE_SIZE_EXCEEDED'),
                            sub: replaceInString(query('GET_LABEL_MAX_FILE_SIZE'), {
                                filesize: toNaturalFileSize(
                                    sizeMax,
                                    '.',
                                    query('GET_FILE_SIZE_BASE'),
                                    query('GET_FILE_SIZE_LABELS', query)
                                ),
                            }),
                        },
                    });

                    return;
                }

                // reject or resolve based on file size
                var sizeMin = query('GET_MIN_FILE_SIZE');
                if (sizeMin !== null && file.size < sizeMin) {
                    reject({
                        status: {
                            main: query('GET_LABEL_MIN_FILE_SIZE_EXCEEDED'),
                            sub: replaceInString(query('GET_LABEL_MIN_FILE_SIZE'), {
                                filesize: toNaturalFileSize(
                                    sizeMin,
                                    '.',
                                    query('GET_FILE_SIZE_BASE'),
                                    query('GET_FILE_SIZE_LABELS', query)
                                ),
                            }),
                        },
                    });

                    return;
                }

                // returns the current option value
                var totalSizeMax = query('GET_MAX_TOTAL_FILE_SIZE');
                if (totalSizeMax !== null) {
                    // get the current total file size
                    var currentTotalSize = query('GET_ACTIVE_ITEMS').reduce(function(total, item) {
                        return total + item.fileSize;
                    }, 0);

                    // get the size of the new file
                    if (currentTotalSize > totalSizeMax) {
                        reject({
                            status: {
                                main: query('GET_LABEL_MAX_TOTAL_FILE_SIZE_EXCEEDED'),
                                sub: replaceInString(query('GET_LABEL_MAX_TOTAL_FILE_SIZE'), {
                                    filesize: toNaturalFileSize(
                                        totalSizeMax,
                                        '.',
                                        query('GET_FILE_SIZE_BASE'),
                                        query('GET_FILE_SIZE_LABELS', query)
                                    ),
                                }),
                            },
                        });

                        return;
                    }
                }

                // file is fine, let's pass it back
                resolve(file);
            });
        });

        return {
            options: {
                // Enable or disable file type validation
                allowFileSizeValidation: [true, Type.BOOLEAN],

                // Max individual file size in bytes
                maxFileSize: [null, Type.INT],

                // Min individual file size in bytes
                minFileSize: [null, Type.INT],

                // Max total file size in bytes
                maxTotalFileSize: [null, Type.INT],

                // Filter the files that need to be validated for size
                fileValidateSizeFilter: [null, Type.FUNCTION],

                // error labels
                labelMinFileSizeExceeded: ['File is too small', Type.STRING],
                labelMinFileSize: ['Minimum file size is {filesize}', Type.STRING],

                labelMaxFileSizeExceeded: ['File is too large', Type.STRING],
                labelMaxFileSize: ['Maximum file size is {filesize}', Type.STRING],

                labelMaxTotalFileSizeExceeded: ['Maximum total size exceeded', Type.STRING],
                labelMaxTotalFileSize: ['Maximum total file size is {filesize}', Type.STRING],
            },
        };
    };

    // fire pluginloaded event if running in browser, this allows registering the plugin when using async script tags
    var isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';
    if (isBrowser) {
        document.dispatchEvent(new CustomEvent('FilePond:pluginloaded', { detail: plugin }));
    }

    return plugin;
});


/***/ }),

/***/ "./node_modules/filepond-plugin-file-validate-type/dist/filepond-plugin-file-validate-type.js":
/*!****************************************************************************************************!*\
  !*** ./node_modules/filepond-plugin-file-validate-type/dist/filepond-plugin-file-validate-type.js ***!
  \****************************************************************************************************/
/***/ (function(module) {

/*!
 * FilePondPluginFileValidateType 1.2.9
 * Licensed under MIT, https://opensource.org/licenses/MIT/
 * Please visit https://pqina.nl/filepond/ for details.
 */

/* eslint-disable */

(function(global, factory) {
     true
        ? (module.exports = factory())
        : 0;
})(this, function() {
    'use strict';

    var plugin = function plugin(_ref) {
        var addFilter = _ref.addFilter,
            utils = _ref.utils;
        // get quick reference to Type utils
        var Type = utils.Type,
            isString = utils.isString,
            replaceInString = utils.replaceInString,
            guesstimateMimeType = utils.guesstimateMimeType,
            getExtensionFromFilename = utils.getExtensionFromFilename,
            getFilenameFromURL = utils.getFilenameFromURL;

        var mimeTypeMatchesWildCard = function mimeTypeMatchesWildCard(mimeType, wildcard) {
            var mimeTypeGroup = (/^[^/]+/.exec(mimeType) || []).pop(); // image/png -> image
            var wildcardGroup = wildcard.slice(0, -2); // image/* -> image
            return mimeTypeGroup === wildcardGroup;
        };

        var isValidMimeType = function isValidMimeType(acceptedTypes, userInputType) {
            return acceptedTypes.some(function(acceptedType) {
                // accepted is wildcard mime type
                if (/\*$/.test(acceptedType)) {
                    return mimeTypeMatchesWildCard(userInputType, acceptedType);
                }

                // is normal mime type
                return acceptedType === userInputType;
            });
        };

        var getItemType = function getItemType(item) {
            // if the item is a url we guess the mime type by the extension
            var type = '';
            if (isString(item)) {
                var filename = getFilenameFromURL(item);
                var extension = getExtensionFromFilename(filename);
                if (extension) {
                    type = guesstimateMimeType(extension);
                }
            } else {
                type = item.type;
            }

            return type;
        };

        var validateFile = function validateFile(item, acceptedFileTypes, typeDetector) {
            // no types defined, everything is allowed \o/
            if (acceptedFileTypes.length === 0) {
                return true;
            }

            // gets the item type
            var type = getItemType(item);

            // no type detector, test now
            if (!typeDetector) {
                return isValidMimeType(acceptedFileTypes, type);
            }

            // use type detector
            return new Promise(function(resolve, reject) {
                typeDetector(item, type)
                    .then(function(detectedType) {
                        if (isValidMimeType(acceptedFileTypes, detectedType)) {
                            resolve();
                        } else {
                            reject();
                        }
                    })
                    .catch(reject);
            });
        };

        var applyMimeTypeMap = function applyMimeTypeMap(map) {
            return function(acceptedFileType) {
                return map[acceptedFileType] === null
                    ? false
                    : map[acceptedFileType] || acceptedFileType;
            };
        };

        // setup attribute mapping for accept
        addFilter('SET_ATTRIBUTE_TO_OPTION_MAP', function(map) {
            return Object.assign(map, {
                accept: 'acceptedFileTypes',
            });
        });

        // filtering if an item is allowed in hopper
        addFilter('ALLOW_HOPPER_ITEM', function(file, _ref2) {
            var query = _ref2.query;
            // if we are not doing file type validation exit
            if (!query('GET_ALLOW_FILE_TYPE_VALIDATION')) {
                return true;
            }

            // we validate the file against the accepted file types
            return validateFile(file, query('GET_ACCEPTED_FILE_TYPES'));
        });

        // called for each file that is loaded
        // right before it is set to the item state
        // should return a promise
        addFilter('LOAD_FILE', function(file, _ref3) {
            var query = _ref3.query;
            return new Promise(function(resolve, reject) {
                if (!query('GET_ALLOW_FILE_TYPE_VALIDATION')) {
                    resolve(file);
                    return;
                }

                var acceptedFileTypes = query('GET_ACCEPTED_FILE_TYPES');

                // custom type detector method
                var typeDetector = query('GET_FILE_VALIDATE_TYPE_DETECT_TYPE');

                // if invalid, exit here
                var validationResult = validateFile(file, acceptedFileTypes, typeDetector);

                var handleRejection = function handleRejection() {
                    var acceptedFileTypesMapped = acceptedFileTypes
                        .map(
                            applyMimeTypeMap(
                                query('GET_FILE_VALIDATE_TYPE_LABEL_EXPECTED_TYPES_MAP')
                            )
                        )
                        .filter(function(label) {
                            return label !== false;
                        });

                    var acceptedFileTypesMappedUnique = acceptedFileTypesMapped.filter(function(
                        item,
                        index
                    ) {
                        return acceptedFileTypesMapped.indexOf(item) === index;
                    });

                    reject({
                        status: {
                            main: query('GET_LABEL_FILE_TYPE_NOT_ALLOWED'),
                            sub: replaceInString(
                                query('GET_FILE_VALIDATE_TYPE_LABEL_EXPECTED_TYPES'),
                                {
                                    allTypes: acceptedFileTypesMappedUnique.join(', '),
                                    allButLastType: acceptedFileTypesMappedUnique
                                        .slice(0, -1)
                                        .join(', '),
                                    lastType:
                                        acceptedFileTypesMappedUnique[
                                            acceptedFileTypesMappedUnique.length - 1
                                        ],
                                }
                            ),
                        },
                    });
                };

                // has returned new filename immidiately
                if (typeof validationResult === 'boolean') {
                    if (!validationResult) {
                        return handleRejection();
                    }
                    return resolve(file);
                }

                // is promise
                validationResult
                    .then(function() {
                        resolve(file);
                    })
                    .catch(handleRejection);
            });
        });

        // expose plugin
        return {
            // default options
            options: {
                // Enable or disable file type validation
                allowFileTypeValidation: [true, Type.BOOLEAN],

                // What file types to accept
                acceptedFileTypes: [[], Type.ARRAY],
                // - must be comma separated
                // - mime types: image/png, image/jpeg, image/gif
                // - extensions: .png, .jpg, .jpeg ( not enabled yet )
                // - wildcards: image/*

                // label to show when a type is not allowed
                labelFileTypeNotAllowed: ['File is of invalid type', Type.STRING],

                // nicer label
                fileValidateTypeLabelExpectedTypes: [
                    'Expects {allButLastType} or {lastType}',
                    Type.STRING,
                ],

                // map mime types to extensions
                fileValidateTypeLabelExpectedTypesMap: [{}, Type.OBJECT],

                // Custom function to detect type of file
                fileValidateTypeDetectType: [null, Type.FUNCTION],
            },
        };
    };

    // fire pluginloaded event if running in browser, this allows registering the plugin when using async script tags
    var isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';
    if (isBrowser) {
        document.dispatchEvent(new CustomEvent('FilePond:pluginloaded', { detail: plugin }));
    }

    return plugin;
});


/***/ }),

/***/ "./node_modules/filepond-plugin-image-preview/dist/filepond-plugin-image-preview.js":
/*!******************************************************************************************!*\
  !*** ./node_modules/filepond-plugin-image-preview/dist/filepond-plugin-image-preview.js ***!
  \******************************************************************************************/
/***/ (function(module) {

/*!
 * FilePondPluginImagePreview 4.6.12
 * Licensed under MIT, https://opensource.org/licenses/MIT/
 * Please visit https://pqina.nl/filepond/ for details.
 */

/* eslint-disable */

(function(global, factory) {
   true
    ? (module.exports = factory())
    : 0;
})(this, function() {
  'use strict';

  // test if file is of type image and can be viewed in canvas
  var isPreviewableImage = function isPreviewableImage(file) {
    return /^image/.test(file.type);
  };

  function _typeof(obj) {
    if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
      _typeof = function(obj) {
        return typeof obj;
      };
    } else {
      _typeof = function(obj) {
        return obj &&
          typeof Symbol === 'function' &&
          obj.constructor === Symbol &&
          obj !== Symbol.prototype
          ? 'symbol'
          : typeof obj;
      };
    }

    return _typeof(obj);
  }

  var REACT_ELEMENT_TYPE;

  function _jsx(type, props, key, children) {
    if (!REACT_ELEMENT_TYPE) {
      REACT_ELEMENT_TYPE =
        (typeof Symbol === 'function' &&
          Symbol.for &&
          Symbol.for('react.element')) ||
        0xeac7;
    }

    var defaultProps = type && type.defaultProps;
    var childrenLength = arguments.length - 3;

    if (!props && childrenLength !== 0) {
      props = {
        children: void 0
      };
    }

    if (props && defaultProps) {
      for (var propName in defaultProps) {
        if (props[propName] === void 0) {
          props[propName] = defaultProps[propName];
        }
      }
    } else if (!props) {
      props = defaultProps || {};
    }

    if (childrenLength === 1) {
      props.children = children;
    } else if (childrenLength > 1) {
      var childArray = new Array(childrenLength);

      for (var i = 0; i < childrenLength; i++) {
        childArray[i] = arguments[i + 3];
      }

      props.children = childArray;
    }

    return {
      $$typeof: REACT_ELEMENT_TYPE,
      type: type,
      key: key === undefined ? null : '' + key,
      ref: null,
      props: props,
      _owner: null
    };
  }

  function _asyncIterator(iterable) {
    var method;

    if (typeof Symbol === 'function') {
      if (Symbol.asyncIterator) {
        method = iterable[Symbol.asyncIterator];
        if (method != null) return method.call(iterable);
      }

      if (Symbol.iterator) {
        method = iterable[Symbol.iterator];
        if (method != null) return method.call(iterable);
      }
    }

    throw new TypeError('Object is not async iterable');
  }

  function _AwaitValue(value) {
    this.wrapped = value;
  }

  function _AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function(resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;
        var wrappedAwait = value instanceof _AwaitValue;
        Promise.resolve(wrappedAwait ? value.wrapped : value).then(
          function(arg) {
            if (wrappedAwait) {
              resume('next', arg);
              return;
            }

            settle(result.done ? 'return' : 'normal', arg);
          },
          function(err) {
            resume('throw', err);
          }
        );
      } catch (err) {
        settle('throw', err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case 'return':
          front.resolve({
            value: value,
            done: true
          });
          break;

        case 'throw':
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== 'function') {
      this.return = undefined;
    }
  }

  if (typeof Symbol === 'function' && Symbol.asyncIterator) {
    _AsyncGenerator.prototype[Symbol.asyncIterator] = function() {
      return this;
    };
  }

  _AsyncGenerator.prototype.next = function(arg) {
    return this._invoke('next', arg);
  };

  _AsyncGenerator.prototype.throw = function(arg) {
    return this._invoke('throw', arg);
  };

  _AsyncGenerator.prototype.return = function(arg) {
    return this._invoke('return', arg);
  };

  function _wrapAsyncGenerator(fn) {
    return function() {
      return new _AsyncGenerator(fn.apply(this, arguments));
    };
  }

  function _awaitAsyncGenerator(value) {
    return new _AwaitValue(value);
  }

  function _asyncGeneratorDelegate(inner, awaitWrap) {
    var iter = {},
      waiting = false;

    function pump(key, value) {
      waiting = true;
      value = new Promise(function(resolve) {
        resolve(inner[key](value));
      });
      return {
        done: false,
        value: awaitWrap(value)
      };
    }

    if (typeof Symbol === 'function' && Symbol.iterator) {
      iter[Symbol.iterator] = function() {
        return this;
      };
    }

    iter.next = function(value) {
      if (waiting) {
        waiting = false;
        return value;
      }

      return pump('next', value);
    };

    if (typeof inner.throw === 'function') {
      iter.throw = function(value) {
        if (waiting) {
          waiting = false;
          throw value;
        }

        return pump('throw', value);
      };
    }

    if (typeof inner.return === 'function') {
      iter.return = function(value) {
        return pump('return', value);
      };
    }

    return iter;
  }

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }

    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }

  function _asyncToGenerator(fn) {
    return function() {
      var self = this,
        args = arguments;
      return new Promise(function(resolve, reject) {
        var gen = fn.apply(self, args);

        function _next(value) {
          asyncGeneratorStep(
            gen,
            resolve,
            reject,
            _next,
            _throw,
            'next',
            value
          );
        }

        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'throw', err);
        }

        _next(undefined);
      });
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function');
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ('value' in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineEnumerableProperties(obj, descs) {
    for (var key in descs) {
      var desc = descs[key];
      desc.configurable = desc.enumerable = true;
      if ('value' in desc) desc.writable = true;
      Object.defineProperty(obj, key, desc);
    }

    if (Object.getOwnPropertySymbols) {
      var objectSymbols = Object.getOwnPropertySymbols(descs);

      for (var i = 0; i < objectSymbols.length; i++) {
        var sym = objectSymbols[i];
        var desc = descs[sym];
        desc.configurable = desc.enumerable = true;
        if ('value' in desc) desc.writable = true;
        Object.defineProperty(obj, sym, desc);
      }
    }

    return obj;
  }

  function _defaults(obj, defaults) {
    var keys = Object.getOwnPropertyNames(defaults);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var value = Object.getOwnPropertyDescriptor(defaults, key);

      if (value && value.configurable && obj[key] === undefined) {
        Object.defineProperty(obj, key, value);
      }
    }

    return obj;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _extends() {
    _extends =
      Object.assign ||
      function(target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i];

          for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              target[key] = source[key];
            }
          }
        }

        return target;
      };

    return _extends.apply(this, arguments);
  }

  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      var ownKeys = Object.keys(source);

      if (typeof Object.getOwnPropertySymbols === 'function') {
        ownKeys = ownKeys.concat(
          Object.getOwnPropertySymbols(source).filter(function(sym) {
            return Object.getOwnPropertyDescriptor(source, sym).enumerable;
          })
        );
      }

      ownKeys.forEach(function(key) {
        _defineProperty(target, key, source[key]);
      });
    }

    return target;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== 'function' && superClass !== null) {
      throw new TypeError('Super expression must either be null or a function');
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf
      ? Object.getPrototypeOf
      : function _getPrototypeOf(o) {
          return o.__proto__ || Object.getPrototypeOf(o);
        };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf =
      Object.setPrototypeOf ||
      function _setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
      };

    return _setPrototypeOf(o, p);
  }

  function isNativeReflectConstruct() {
    if (typeof Reflect === 'undefined' || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === 'function') return true;

    try {
      Date.prototype.toString.call(Reflect.construct(Date, [], function() {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _construct(Parent, args, Class) {
    if (isNativeReflectConstruct()) {
      _construct = Reflect.construct;
    } else {
      _construct = function _construct(Parent, args, Class) {
        var a = [null];
        a.push.apply(a, args);
        var Constructor = Function.bind.apply(Parent, a);
        var instance = new Constructor();
        if (Class) _setPrototypeOf(instance, Class.prototype);
        return instance;
      };
    }

    return _construct.apply(null, arguments);
  }

  function _isNativeFunction(fn) {
    return Function.toString.call(fn).indexOf('[native code]') !== -1;
  }

  function _wrapNativeSuper(Class) {
    var _cache = typeof Map === 'function' ? new Map() : undefined;

    _wrapNativeSuper = function _wrapNativeSuper(Class) {
      if (Class === null || !_isNativeFunction(Class)) return Class;

      if (typeof Class !== 'function') {
        throw new TypeError(
          'Super expression must either be null or a function'
        );
      }

      if (typeof _cache !== 'undefined') {
        if (_cache.has(Class)) return _cache.get(Class);

        _cache.set(Class, Wrapper);
      }

      function Wrapper() {
        return _construct(Class, arguments, _getPrototypeOf(this).constructor);
      }

      Wrapper.prototype = Object.create(Class.prototype, {
        constructor: {
          value: Wrapper,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
      return _setPrototypeOf(Wrapper, Class);
    };

    return _wrapNativeSuper(Class);
  }

  function _instanceof(left, right) {
    if (
      right != null &&
      typeof Symbol !== 'undefined' &&
      right[Symbol.hasInstance]
    ) {
      return right[Symbol.hasInstance](left);
    } else {
      return left instanceof right;
    }
  }

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule
      ? obj
      : {
          default: obj
        };
  }

  function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
      return obj;
    } else {
      var newObj = {};

      if (obj != null) {
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc =
              Object.defineProperty && Object.getOwnPropertyDescriptor
                ? Object.getOwnPropertyDescriptor(obj, key)
                : {};

            if (desc.get || desc.set) {
              Object.defineProperty(newObj, key, desc);
            } else {
              newObj[key] = obj[key];
            }
          }
        }
      }

      newObj.default = obj;
      return newObj;
    }
  }

  function _newArrowCheck(innerThis, boundThis) {
    if (innerThis !== boundThis) {
      throw new TypeError('Cannot instantiate an arrow function');
    }
  }

  function _objectDestructuringEmpty(obj) {
    if (obj == null) throw new TypeError('Cannot destructure undefined');
  }

  function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;

    for (i = 0; i < sourceKeys.length; i++) {
      key = sourceKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      target[key] = source[key];
    }

    return target;
  }

  function _objectWithoutProperties(source, excluded) {
    if (source == null) return {};

    var target = _objectWithoutPropertiesLoose(source, excluded);

    var key, i;

    if (Object.getOwnPropertySymbols) {
      var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

      for (i = 0; i < sourceSymbolKeys.length; i++) {
        key = sourceSymbolKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
      }
    }

    return target;
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError(
        "this hasn't been initialised - super() hasn't been called"
      );
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === 'object' || typeof call === 'function')) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _superPropBase(object, property) {
    while (!Object.prototype.hasOwnProperty.call(object, property)) {
      object = _getPrototypeOf(object);
      if (object === null) break;
    }

    return object;
  }

  function _get(target, property, receiver) {
    if (typeof Reflect !== 'undefined' && Reflect.get) {
      _get = Reflect.get;
    } else {
      _get = function _get(target, property, receiver) {
        var base = _superPropBase(target, property);

        if (!base) return;
        var desc = Object.getOwnPropertyDescriptor(base, property);

        if (desc.get) {
          return desc.get.call(receiver);
        }

        return desc.value;
      };
    }

    return _get(target, property, receiver || target);
  }

  function set(target, property, value, receiver) {
    if (typeof Reflect !== 'undefined' && Reflect.set) {
      set = Reflect.set;
    } else {
      set = function set(target, property, value, receiver) {
        var base = _superPropBase(target, property);

        var desc;

        if (base) {
          desc = Object.getOwnPropertyDescriptor(base, property);

          if (desc.set) {
            desc.set.call(receiver, value);
            return true;
          } else if (!desc.writable) {
            return false;
          }
        }

        desc = Object.getOwnPropertyDescriptor(receiver, property);

        if (desc) {
          if (!desc.writable) {
            return false;
          }

          desc.value = value;
          Object.defineProperty(receiver, property, desc);
        } else {
          _defineProperty(receiver, property, value);
        }

        return true;
      };
    }

    return set(target, property, value, receiver);
  }

  function _set(target, property, value, receiver, isStrict) {
    var s = set(target, property, value, receiver || target);

    if (!s && isStrict) {
      throw new Error('failed to set property');
    }

    return value;
  }

  function _taggedTemplateLiteral(strings, raw) {
    if (!raw) {
      raw = strings.slice(0);
    }

    return Object.freeze(
      Object.defineProperties(strings, {
        raw: {
          value: Object.freeze(raw)
        }
      })
    );
  }

  function _taggedTemplateLiteralLoose(strings, raw) {
    if (!raw) {
      raw = strings.slice(0);
    }

    strings.raw = raw;
    return strings;
  }

  function _temporalRef(val, name) {
    if (val === _temporalUndefined) {
      throw new ReferenceError(name + ' is not defined - temporal dead zone');
    } else {
      return val;
    }
  }

  function _readOnlyError(name) {
    throw new Error('"' + name + '" is read-only');
  }

  function _classNameTDZError(name) {
    throw new Error(
      'Class "' + name + '" cannot be referenced in computed property keys.'
    );
  }

  var _temporalUndefined = {};

  function _slicedToArray(arr, i) {
    return (
      _arrayWithHoles(arr) ||
      _iterableToArrayLimit(arr, i) ||
      _nonIterableRest()
    );
  }

  function _slicedToArrayLoose(arr, i) {
    return (
      _arrayWithHoles(arr) ||
      _iterableToArrayLimitLoose(arr, i) ||
      _nonIterableRest()
    );
  }

  function _toArray(arr) {
    return _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest();
  }

  function _toConsumableArray(arr) {
    return (
      _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread()
    );
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++)
        arr2[i] = arr[i];

      return arr2;
    }
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArray(iter) {
    if (
      Symbol.iterator in Object(iter) ||
      Object.prototype.toString.call(iter) === '[object Arguments]'
    )
      return Array.from(iter);
  }

  function _iterableToArrayLimit(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (
        var _i = arr[Symbol.iterator](), _s;
        !(_n = (_s = _i.next()).done);
        _n = true
      ) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i['return'] != null) _i['return']();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _iterableToArrayLimitLoose(arr, i) {
    var _arr = [];

    for (
      var _iterator = arr[Symbol.iterator](), _step;
      !(_step = _iterator.next()).done;

    ) {
      _arr.push(_step.value);

      if (i && _arr.length === i) break;
    }

    return _arr;
  }

  function _nonIterableSpread() {
    throw new TypeError('Invalid attempt to spread non-iterable instance');
  }

  function _nonIterableRest() {
    throw new TypeError('Invalid attempt to destructure non-iterable instance');
  }

  function _skipFirstGeneratorNext(fn) {
    return function() {
      var it = fn.apply(this, arguments);
      it.next();
      return it;
    };
  }

  function _toPrimitive(input, hint) {
    if (typeof input !== 'object' || input === null) return input;
    var prim = input[Symbol.toPrimitive];

    if (prim !== undefined) {
      var res = prim.call(input, hint || 'default');
      if (typeof res !== 'object') return res;
      throw new TypeError('@@toPrimitive must return a primitive value.');
    }

    return (hint === 'string' ? String : Number)(input);
  }

  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, 'string');

    return typeof key === 'symbol' ? key : String(key);
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error(
      'Decorating class property failed. Please ensure that ' +
        'proposal-class-properties is enabled and set to use loose mode. ' +
        'To use proposal-class-properties in spec mode with decorators, wait for ' +
        'the next major version of decorators in stage 2.'
    );
  }

  function _initializerDefineProperty(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer
        ? descriptor.initializer.call(context)
        : void 0
    });
  }

  function _applyDecoratedDescriptor(
    target,
    property,
    decorators,
    descriptor,
    context
  ) {
    var desc = {};
    Object.keys(descriptor).forEach(function(key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators
      .slice()
      .reverse()
      .reduce(function(desc, decorator) {
        return decorator(target, property, desc) || desc;
      }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object.defineProperty(target, property, desc);
      desc = null;
    }

    return desc;
  }

  var id = 0;

  function _classPrivateFieldLooseKey(name) {
    return '__private_' + id++ + '_' + name;
  }

  function _classPrivateFieldLooseBase(receiver, privateKey) {
    if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) {
      throw new TypeError('attempted to use private field on non-instance');
    }

    return receiver;
  }

  function _classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
      throw new TypeError('attempted to get private field on non-instance');
    }

    var descriptor = privateMap.get(receiver);

    if (descriptor.get) {
      return descriptor.get.call(receiver);
    }

    return descriptor.value;
  }

  function _classPrivateFieldSet(receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
      throw new TypeError('attempted to set private field on non-instance');
    }

    var descriptor = privateMap.get(receiver);

    if (descriptor.set) {
      descriptor.set.call(receiver, value);
    } else {
      if (!descriptor.writable) {
        throw new TypeError('attempted to set read only private field');
      }

      descriptor.value = value;
    }

    return value;
  }

  function _classStaticPrivateFieldSpecGet(
    receiver,
    classConstructor,
    descriptor
  ) {
    if (receiver !== classConstructor) {
      throw new TypeError('Private static access of wrong provenance');
    }

    return descriptor.value;
  }

  function _classStaticPrivateFieldSpecSet(
    receiver,
    classConstructor,
    descriptor,
    value
  ) {
    if (receiver !== classConstructor) {
      throw new TypeError('Private static access of wrong provenance');
    }

    if (!descriptor.writable) {
      throw new TypeError('attempted to set read only private field');
    }

    descriptor.value = value;
    return value;
  }

  function _classStaticPrivateMethodGet(receiver, classConstructor, method) {
    if (receiver !== classConstructor) {
      throw new TypeError('Private static access of wrong provenance');
    }

    return method;
  }

  function _classStaticPrivateMethodSet() {
    throw new TypeError('attempted to set read only static private field');
  }

  function _decorate(decorators, factory, superClass, mixins) {
    var api = _getDecoratorsApi();

    if (mixins) {
      for (var i = 0; i < mixins.length; i++) {
        api = mixins[i](api);
      }
    }

    var r = factory(function initialize(O) {
      api.initializeInstanceElements(O, decorated.elements);
    }, superClass);
    var decorated = api.decorateClass(
      _coalesceClassElements(r.d.map(_createElementDescriptor)),
      decorators
    );
    api.initializeClassElements(r.F, decorated.elements);
    return api.runClassFinishers(r.F, decorated.finishers);
  }

  function _getDecoratorsApi() {
    _getDecoratorsApi = function() {
      return api;
    };

    var api = {
      elementsDefinitionOrder: [['method'], ['field']],
      initializeInstanceElements: function(O, elements) {
        ['method', 'field'].forEach(function(kind) {
          elements.forEach(function(element) {
            if (element.kind === kind && element.placement === 'own') {
              this.defineClassElement(O, element);
            }
          }, this);
        }, this);
      },
      initializeClassElements: function(F, elements) {
        var proto = F.prototype;
        ['method', 'field'].forEach(function(kind) {
          elements.forEach(function(element) {
            var placement = element.placement;

            if (
              element.kind === kind &&
              (placement === 'static' || placement === 'prototype')
            ) {
              var receiver = placement === 'static' ? F : proto;
              this.defineClassElement(receiver, element);
            }
          }, this);
        }, this);
      },
      defineClassElement: function(receiver, element) {
        var descriptor = element.descriptor;

        if (element.kind === 'field') {
          var initializer = element.initializer;
          descriptor = {
            enumerable: descriptor.enumerable,
            writable: descriptor.writable,
            configurable: descriptor.configurable,
            value: initializer === void 0 ? void 0 : initializer.call(receiver)
          };
        }

        Object.defineProperty(receiver, element.key, descriptor);
      },
      decorateClass: function(elements, decorators) {
        var newElements = [];
        var finishers = [];
        var placements = {
          static: [],
          prototype: [],
          own: []
        };
        elements.forEach(function(element) {
          this.addElementPlacement(element, placements);
        }, this);
        elements.forEach(function(element) {
          if (!_hasDecorators(element)) return newElements.push(element);
          var elementFinishersExtras = this.decorateElement(
            element,
            placements
          );
          newElements.push(elementFinishersExtras.element);
          newElements.push.apply(newElements, elementFinishersExtras.extras);
          finishers.push.apply(finishers, elementFinishersExtras.finishers);
        }, this);

        if (!decorators) {
          return {
            elements: newElements,
            finishers: finishers
          };
        }

        var result = this.decorateConstructor(newElements, decorators);
        finishers.push.apply(finishers, result.finishers);
        result.finishers = finishers;
        return result;
      },
      addElementPlacement: function(element, placements, silent) {
        var keys = placements[element.placement];

        if (!silent && keys.indexOf(element.key) !== -1) {
          throw new TypeError('Duplicated element (' + element.key + ')');
        }

        keys.push(element.key);
      },
      decorateElement: function(element, placements) {
        var extras = [];
        var finishers = [];

        for (
          var decorators = element.decorators, i = decorators.length - 1;
          i >= 0;
          i--
        ) {
          var keys = placements[element.placement];
          keys.splice(keys.indexOf(element.key), 1);
          var elementObject = this.fromElementDescriptor(element);
          var elementFinisherExtras = this.toElementFinisherExtras(
            (0, decorators[i])(elementObject) || elementObject
          );
          element = elementFinisherExtras.element;
          this.addElementPlacement(element, placements);

          if (elementFinisherExtras.finisher) {
            finishers.push(elementFinisherExtras.finisher);
          }

          var newExtras = elementFinisherExtras.extras;

          if (newExtras) {
            for (var j = 0; j < newExtras.length; j++) {
              this.addElementPlacement(newExtras[j], placements);
            }

            extras.push.apply(extras, newExtras);
          }
        }

        return {
          element: element,
          finishers: finishers,
          extras: extras
        };
      },
      decorateConstructor: function(elements, decorators) {
        var finishers = [];

        for (var i = decorators.length - 1; i >= 0; i--) {
          var obj = this.fromClassDescriptor(elements);
          var elementsAndFinisher = this.toClassDescriptor(
            (0, decorators[i])(obj) || obj
          );

          if (elementsAndFinisher.finisher !== undefined) {
            finishers.push(elementsAndFinisher.finisher);
          }

          if (elementsAndFinisher.elements !== undefined) {
            elements = elementsAndFinisher.elements;

            for (var j = 0; j < elements.length - 1; j++) {
              for (var k = j + 1; k < elements.length; k++) {
                if (
                  elements[j].key === elements[k].key &&
                  elements[j].placement === elements[k].placement
                ) {
                  throw new TypeError(
                    'Duplicated element (' + elements[j].key + ')'
                  );
                }
              }
            }
          }
        }

        return {
          elements: elements,
          finishers: finishers
        };
      },
      fromElementDescriptor: function(element) {
        var obj = {
          kind: element.kind,
          key: element.key,
          placement: element.placement,
          descriptor: element.descriptor
        };
        var desc = {
          value: 'Descriptor',
          configurable: true
        };
        Object.defineProperty(obj, Symbol.toStringTag, desc);
        if (element.kind === 'field') obj.initializer = element.initializer;
        return obj;
      },
      toElementDescriptors: function(elementObjects) {
        if (elementObjects === undefined) return;
        return _toArray(elementObjects).map(function(elementObject) {
          var element = this.toElementDescriptor(elementObject);
          this.disallowProperty(
            elementObject,
            'finisher',
            'An element descriptor'
          );
          this.disallowProperty(
            elementObject,
            'extras',
            'An element descriptor'
          );
          return element;
        }, this);
      },
      toElementDescriptor: function(elementObject) {
        var kind = String(elementObject.kind);

        if (kind !== 'method' && kind !== 'field') {
          throw new TypeError(
            'An element descriptor\'s .kind property must be either "method" or' +
              ' "field", but a decorator created an element descriptor with' +
              ' .kind "' +
              kind +
              '"'
          );
        }

        var key = _toPropertyKey(elementObject.key);

        var placement = String(elementObject.placement);

        if (
          placement !== 'static' &&
          placement !== 'prototype' &&
          placement !== 'own'
        ) {
          throw new TypeError(
            'An element descriptor\'s .placement property must be one of "static",' +
              ' "prototype" or "own", but a decorator created an element descriptor' +
              ' with .placement "' +
              placement +
              '"'
          );
        }

        var descriptor = elementObject.descriptor;
        this.disallowProperty(
          elementObject,
          'elements',
          'An element descriptor'
        );
        var element = {
          kind: kind,
          key: key,
          placement: placement,
          descriptor: Object.assign({}, descriptor)
        };

        if (kind !== 'field') {
          this.disallowProperty(
            elementObject,
            'initializer',
            'A method descriptor'
          );
        } else {
          this.disallowProperty(
            descriptor,
            'get',
            'The property descriptor of a field descriptor'
          );
          this.disallowProperty(
            descriptor,
            'set',
            'The property descriptor of a field descriptor'
          );
          this.disallowProperty(
            descriptor,
            'value',
            'The property descriptor of a field descriptor'
          );
          element.initializer = elementObject.initializer;
        }

        return element;
      },
      toElementFinisherExtras: function(elementObject) {
        var element = this.toElementDescriptor(elementObject);

        var finisher = _optionalCallableProperty(elementObject, 'finisher');

        var extras = this.toElementDescriptors(elementObject.extras);
        return {
          element: element,
          finisher: finisher,
          extras: extras
        };
      },
      fromClassDescriptor: function(elements) {
        var obj = {
          kind: 'class',
          elements: elements.map(this.fromElementDescriptor, this)
        };
        var desc = {
          value: 'Descriptor',
          configurable: true
        };
        Object.defineProperty(obj, Symbol.toStringTag, desc);
        return obj;
      },
      toClassDescriptor: function(obj) {
        var kind = String(obj.kind);

        if (kind !== 'class') {
          throw new TypeError(
            'A class descriptor\'s .kind property must be "class", but a decorator' +
              ' created a class descriptor with .kind "' +
              kind +
              '"'
          );
        }

        this.disallowProperty(obj, 'key', 'A class descriptor');
        this.disallowProperty(obj, 'placement', 'A class descriptor');
        this.disallowProperty(obj, 'descriptor', 'A class descriptor');
        this.disallowProperty(obj, 'initializer', 'A class descriptor');
        this.disallowProperty(obj, 'extras', 'A class descriptor');

        var finisher = _optionalCallableProperty(obj, 'finisher');

        var elements = this.toElementDescriptors(obj.elements);
        return {
          elements: elements,
          finisher: finisher
        };
      },
      runClassFinishers: function(constructor, finishers) {
        for (var i = 0; i < finishers.length; i++) {
          var newConstructor = (0, finishers[i])(constructor);

          if (newConstructor !== undefined) {
            if (typeof newConstructor !== 'function') {
              throw new TypeError('Finishers must return a constructor.');
            }

            constructor = newConstructor;
          }
        }

        return constructor;
      },
      disallowProperty: function(obj, name, objectType) {
        if (obj[name] !== undefined) {
          throw new TypeError(
            objectType + " can't have a ." + name + ' property.'
          );
        }
      }
    };
    return api;
  }

  function _createElementDescriptor(def) {
    var key = _toPropertyKey(def.key);

    var descriptor;

    if (def.kind === 'method') {
      descriptor = {
        value: def.value,
        writable: true,
        configurable: true,
        enumerable: false
      };
    } else if (def.kind === 'get') {
      descriptor = {
        get: def.value,
        configurable: true,
        enumerable: false
      };
    } else if (def.kind === 'set') {
      descriptor = {
        set: def.value,
        configurable: true,
        enumerable: false
      };
    } else if (def.kind === 'field') {
      descriptor = {
        configurable: true,
        writable: true,
        enumerable: true
      };
    }

    var element = {
      kind: def.kind === 'field' ? 'field' : 'method',
      key: key,
      placement: def.static
        ? 'static'
        : def.kind === 'field'
        ? 'own'
        : 'prototype',
      descriptor: descriptor
    };
    if (def.decorators) element.decorators = def.decorators;
    if (def.kind === 'field') element.initializer = def.value;
    return element;
  }

  function _coalesceGetterSetter(element, other) {
    if (element.descriptor.get !== undefined) {
      other.descriptor.get = element.descriptor.get;
    } else {
      other.descriptor.set = element.descriptor.set;
    }
  }

  function _coalesceClassElements(elements) {
    var newElements = [];

    var isSameElement = function(other) {
      return (
        other.kind === 'method' &&
        other.key === element.key &&
        other.placement === element.placement
      );
    };

    for (var i = 0; i < elements.length; i++) {
      var element = elements[i];
      var other;

      if (
        element.kind === 'method' &&
        (other = newElements.find(isSameElement))
      ) {
        if (
          _isDataDescriptor(element.descriptor) ||
          _isDataDescriptor(other.descriptor)
        ) {
          if (_hasDecorators(element) || _hasDecorators(other)) {
            throw new ReferenceError(
              'Duplicated methods (' + element.key + ") can't be decorated."
            );
          }

          other.descriptor = element.descriptor;
        } else {
          if (_hasDecorators(element)) {
            if (_hasDecorators(other)) {
              throw new ReferenceError(
                "Decorators can't be placed on different accessors with for " +
                  'the same property (' +
                  element.key +
                  ').'
              );
            }

            other.decorators = element.decorators;
          }

          _coalesceGetterSetter(element, other);
        }
      } else {
        newElements.push(element);
      }
    }

    return newElements;
  }

  function _hasDecorators(element) {
    return element.decorators && element.decorators.length;
  }

  function _isDataDescriptor(desc) {
    return (
      desc !== undefined &&
      !(desc.value === undefined && desc.writable === undefined)
    );
  }

  function _optionalCallableProperty(obj, name) {
    var value = obj[name];

    if (value !== undefined && typeof value !== 'function') {
      throw new TypeError("Expected '" + name + "' to be a function");
    }

    return value;
  }

  function _classPrivateMethodGet(receiver, privateSet, fn) {
    if (!privateSet.has(receiver)) {
      throw new TypeError('attempted to get private field on non-instance');
    }

    return fn;
  }

  function _classPrivateMethodSet() {
    throw new TypeError('attempted to reassign private method');
  }

  function _wrapRegExp(re, groups) {
    _wrapRegExp = function(re, groups) {
      return new BabelRegExp(re, groups);
    };

    var _RegExp = _wrapNativeSuper(RegExp);

    var _super = RegExp.prototype;

    var _groups = new WeakMap();

    function BabelRegExp(re, groups) {
      var _this = _RegExp.call(this, re);

      _groups.set(_this, groups);

      return _this;
    }

    _inherits(BabelRegExp, _RegExp);

    BabelRegExp.prototype.exec = function(str) {
      var result = _super.exec.call(this, str);

      if (result) result.groups = buildGroups(result, this);
      return result;
    };

    BabelRegExp.prototype[Symbol.replace] = function(str, substitution) {
      if (typeof substitution === 'string') {
        var groups = _groups.get(this);

        return _super[Symbol.replace].call(
          this,
          str,
          substitution.replace(/\$<([^>]+)>/g, function(_, name) {
            return '$' + groups[name];
          })
        );
      } else if (typeof substitution === 'function') {
        var _this = this;

        return _super[Symbol.replace].call(this, str, function() {
          var args = [];
          args.push.apply(args, arguments);

          if (typeof args[args.length - 1] !== 'object') {
            args.push(buildGroups(args, _this));
          }

          return substitution.apply(this, args);
        });
      } else {
        return _super[Symbol.replace].call(this, str, substitution);
      }
    };

    function buildGroups(result, re) {
      var g = _groups.get(re);

      return Object.keys(g).reduce(function(groups, name) {
        groups[name] = result[g[name]];
        return groups;
      }, Object.create(null));
    }

    return _wrapRegExp.apply(this, arguments);
  }

  var vectorMultiply = function vectorMultiply(v, amount) {
    return createVector(v.x * amount, v.y * amount);
  };

  var vectorAdd = function vectorAdd(a, b) {
    return createVector(a.x + b.x, a.y + b.y);
  };

  var vectorNormalize = function vectorNormalize(v) {
    var l = Math.sqrt(v.x * v.x + v.y * v.y);
    if (l === 0) {
      return {
        x: 0,
        y: 0
      };
    }
    return createVector(v.x / l, v.y / l);
  };

  var vectorRotate = function vectorRotate(v, radians, origin) {
    var cos = Math.cos(radians);
    var sin = Math.sin(radians);
    var t = createVector(v.x - origin.x, v.y - origin.y);
    return createVector(
      origin.x + cos * t.x - sin * t.y,
      origin.y + sin * t.x + cos * t.y
    );
  };

  var createVector = function createVector() {
    var x =
      arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y =
      arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    return { x: x, y: y };
  };

  var getMarkupValue = function getMarkupValue(value, size) {
    var scalar =
      arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
    var axis = arguments.length > 3 ? arguments[3] : undefined;
    if (typeof value === 'string') {
      return parseFloat(value) * scalar;
    }
    if (typeof value === 'number') {
      return value * (axis ? size[axis] : Math.min(size.width, size.height));
    }
    return;
  };

  var getMarkupStyles = function getMarkupStyles(markup, size, scale) {
    var lineStyle = markup.borderStyle || markup.lineStyle || 'solid';
    var fill = markup.backgroundColor || markup.fontColor || 'transparent';
    var stroke = markup.borderColor || markup.lineColor || 'transparent';
    var strokeWidth = getMarkupValue(
      markup.borderWidth || markup.lineWidth,
      size,
      scale
    );
    var lineCap = markup.lineCap || 'round';
    var lineJoin = markup.lineJoin || 'round';
    var dashes =
      typeof lineStyle === 'string'
        ? ''
        : lineStyle
            .map(function(v) {
              return getMarkupValue(v, size, scale);
            })
            .join(',');
    var opacity = markup.opacity || 1;
    return {
      'stroke-linecap': lineCap,
      'stroke-linejoin': lineJoin,
      'stroke-width': strokeWidth || 0,
      'stroke-dasharray': dashes,
      stroke: stroke,
      fill: fill,
      opacity: opacity
    };
  };

  var isDefined = function isDefined(value) {
    return value != null;
  };

  var getMarkupRect = function getMarkupRect(rect, size) {
    var scalar =
      arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

    var left =
      getMarkupValue(rect.x, size, scalar, 'width') ||
      getMarkupValue(rect.left, size, scalar, 'width');
    var top =
      getMarkupValue(rect.y, size, scalar, 'height') ||
      getMarkupValue(rect.top, size, scalar, 'height');
    var width = getMarkupValue(rect.width, size, scalar, 'width');
    var height = getMarkupValue(rect.height, size, scalar, 'height');
    var right = getMarkupValue(rect.right, size, scalar, 'width');
    var bottom = getMarkupValue(rect.bottom, size, scalar, 'height');

    if (!isDefined(top)) {
      if (isDefined(height) && isDefined(bottom)) {
        top = size.height - height - bottom;
      } else {
        top = bottom;
      }
    }

    if (!isDefined(left)) {
      if (isDefined(width) && isDefined(right)) {
        left = size.width - width - right;
      } else {
        left = right;
      }
    }

    if (!isDefined(width)) {
      if (isDefined(left) && isDefined(right)) {
        width = size.width - left - right;
      } else {
        width = 0;
      }
    }

    if (!isDefined(height)) {
      if (isDefined(top) && isDefined(bottom)) {
        height = size.height - top - bottom;
      } else {
        height = 0;
      }
    }

    return {
      x: left || 0,
      y: top || 0,
      width: width || 0,
      height: height || 0
    };
  };

  var pointsToPathShape = function pointsToPathShape(points) {
    return points
      .map(function(point, index) {
        return ''
          .concat(index === 0 ? 'M' : 'L', ' ')
          .concat(point.x, ' ')
          .concat(point.y);
      })
      .join(' ');
  };

  var setAttributes = function setAttributes(element, attr) {
    return Object.keys(attr).forEach(function(key) {
      return element.setAttribute(key, attr[key]);
    });
  };

  var ns = 'http://www.w3.org/2000/svg';
  var svg = function svg(tag, attr) {
    var element = document.createElementNS(ns, tag);
    if (attr) {
      setAttributes(element, attr);
    }
    return element;
  };

  var updateRect = function updateRect(element) {
    return setAttributes(
      element,
      Object.assign({}, element.rect, element.styles)
    );
  };

  var updateEllipse = function updateEllipse(element) {
    var cx = element.rect.x + element.rect.width * 0.5;
    var cy = element.rect.y + element.rect.height * 0.5;
    var rx = element.rect.width * 0.5;
    var ry = element.rect.height * 0.5;
    return setAttributes(
      element,
      Object.assign(
        {
          cx: cx,
          cy: cy,
          rx: rx,
          ry: ry
        },
        element.styles
      )
    );
  };

  var IMAGE_FIT_STYLE = {
    contain: 'xMidYMid meet',
    cover: 'xMidYMid slice'
  };

  var updateImage = function updateImage(element, markup) {
    setAttributes(
      element,
      Object.assign({}, element.rect, element.styles, {
        preserveAspectRatio: IMAGE_FIT_STYLE[markup.fit] || 'none'
      })
    );
  };

  var TEXT_ANCHOR = {
    left: 'start',
    center: 'middle',
    right: 'end'
  };

  var updateText = function updateText(element, markup, size, scale) {
    var fontSize = getMarkupValue(markup.fontSize, size, scale);
    var fontFamily = markup.fontFamily || 'sans-serif';
    var fontWeight = markup.fontWeight || 'normal';
    var textAlign = TEXT_ANCHOR[markup.textAlign] || 'start';

    setAttributes(
      element,
      Object.assign({}, element.rect, element.styles, {
        'stroke-width': 0,
        'font-weight': fontWeight,
        'font-size': fontSize,
        'font-family': fontFamily,
        'text-anchor': textAlign
      })
    );

    // update text
    if (element.text !== markup.text) {
      element.text = markup.text;
      element.textContent = markup.text.length ? markup.text : ' ';
    }
  };

  var updateLine = function updateLine(element, markup, size, scale) {
    setAttributes(
      element,
      Object.assign({}, element.rect, element.styles, {
        fill: 'none'
      })
    );

    var line = element.childNodes[0];
    var begin = element.childNodes[1];
    var end = element.childNodes[2];

    var origin = element.rect;

    var target = {
      x: element.rect.x + element.rect.width,
      y: element.rect.y + element.rect.height
    };

    setAttributes(line, {
      x1: origin.x,
      y1: origin.y,
      x2: target.x,
      y2: target.y
    });

    if (!markup.lineDecoration) return;

    begin.style.display = 'none';
    end.style.display = 'none';

    var v = vectorNormalize({
      x: target.x - origin.x,
      y: target.y - origin.y
    });

    var l = getMarkupValue(0.05, size, scale);

    if (markup.lineDecoration.indexOf('arrow-begin') !== -1) {
      var arrowBeginRotationPoint = vectorMultiply(v, l);
      var arrowBeginCenter = vectorAdd(origin, arrowBeginRotationPoint);
      var arrowBeginA = vectorRotate(origin, 2, arrowBeginCenter);
      var arrowBeginB = vectorRotate(origin, -2, arrowBeginCenter);

      setAttributes(begin, {
        style: 'display:block;',
        d: 'M'
          .concat(arrowBeginA.x, ',')
          .concat(arrowBeginA.y, ' L')
          .concat(origin.x, ',')
          .concat(origin.y, ' L')
          .concat(arrowBeginB.x, ',')
          .concat(arrowBeginB.y)
      });
    }

    if (markup.lineDecoration.indexOf('arrow-end') !== -1) {
      var arrowEndRotationPoint = vectorMultiply(v, -l);
      var arrowEndCenter = vectorAdd(target, arrowEndRotationPoint);
      var arrowEndA = vectorRotate(target, 2, arrowEndCenter);
      var arrowEndB = vectorRotate(target, -2, arrowEndCenter);

      setAttributes(end, {
        style: 'display:block;',
        d: 'M'
          .concat(arrowEndA.x, ',')
          .concat(arrowEndA.y, ' L')
          .concat(target.x, ',')
          .concat(target.y, ' L')
          .concat(arrowEndB.x, ',')
          .concat(arrowEndB.y)
      });
    }
  };

  var updatePath = function updatePath(element, markup, size, scale) {
    setAttributes(
      element,
      Object.assign({}, element.styles, {
        fill: 'none',
        d: pointsToPathShape(
          markup.points.map(function(point) {
            return {
              x: getMarkupValue(point.x, size, scale, 'width'),
              y: getMarkupValue(point.y, size, scale, 'height')
            };
          })
        )
      })
    );
  };

  var createShape = function createShape(node) {
    return function(markup) {
      return svg(node, { id: markup.id });
    };
  };

  var createImage = function createImage(markup) {
    var shape = svg('image', {
      id: markup.id,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      opacity: '0'
    });

    shape.onload = function() {
      shape.setAttribute('opacity', markup.opacity || 1);
    };
    shape.setAttributeNS(
      'http://www.w3.org/1999/xlink',
      'xlink:href',
      markup.src
    );
    return shape;
  };

  var createLine = function createLine(markup) {
    var shape = svg('g', {
      id: markup.id,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    });

    var line = svg('line');
    shape.appendChild(line);

    var begin = svg('path');
    shape.appendChild(begin);

    var end = svg('path');
    shape.appendChild(end);

    return shape;
  };

  var CREATE_TYPE_ROUTES = {
    image: createImage,
    rect: createShape('rect'),
    ellipse: createShape('ellipse'),
    text: createShape('text'),
    path: createShape('path'),
    line: createLine
  };

  var UPDATE_TYPE_ROUTES = {
    rect: updateRect,
    ellipse: updateEllipse,
    image: updateImage,
    text: updateText,
    path: updatePath,
    line: updateLine
  };

  var createMarkupByType = function createMarkupByType(type, markup) {
    return CREATE_TYPE_ROUTES[type](markup);
  };

  var updateMarkupByType = function updateMarkupByType(
    element,
    type,
    markup,
    size,
    scale
  ) {
    if (type !== 'path') {
      element.rect = getMarkupRect(markup, size, scale);
    }
    element.styles = getMarkupStyles(markup, size, scale);
    UPDATE_TYPE_ROUTES[type](element, markup, size, scale);
  };

  var MARKUP_RECT = [
    'x',
    'y',
    'left',
    'top',
    'right',
    'bottom',
    'width',
    'height'
  ];

  var toOptionalFraction = function toOptionalFraction(value) {
    return typeof value === 'string' && /%/.test(value)
      ? parseFloat(value) / 100
      : value;
  };

  // adds default markup properties, clones markup
  var prepareMarkup = function prepareMarkup(markup) {
    var _markup = _slicedToArray(markup, 2),
      type = _markup[0],
      props = _markup[1];

    var rect = props.points
      ? {}
      : MARKUP_RECT.reduce(function(prev, curr) {
          prev[curr] = toOptionalFraction(props[curr]);
          return prev;
        }, {});

    return [
      type,
      Object.assign(
        {
          zIndex: 0
        },
        props,
        rect
      )
    ];
  };

  var sortMarkupByZIndex = function sortMarkupByZIndex(a, b) {
    if (a[1].zIndex > b[1].zIndex) {
      return 1;
    }
    if (a[1].zIndex < b[1].zIndex) {
      return -1;
    }
    return 0;
  };

  var createMarkupView = function createMarkupView(_) {
    return _.utils.createView({
      name: 'image-preview-markup',
      tag: 'svg',
      ignoreRect: true,
      mixins: {
        apis: ['width', 'height', 'crop', 'markup', 'resize', 'dirty']
      },

      write: function write(_ref) {
        var root = _ref.root,
          props = _ref.props;

        if (!props.dirty) return;
        var crop = props.crop,
          resize = props.resize,
          markup = props.markup;

        var viewWidth = props.width;
        var viewHeight = props.height;

        var cropWidth = crop.width;
        var cropHeight = crop.height;

        if (resize) {
          var _size = resize.size;

          var outputWidth = _size && _size.width;
          var outputHeight = _size && _size.height;
          var outputFit = resize.mode;
          var outputUpscale = resize.upscale;

          if (outputWidth && !outputHeight) outputHeight = outputWidth;
          if (outputHeight && !outputWidth) outputWidth = outputHeight;

          var shouldUpscale =
            cropWidth < outputWidth && cropHeight < outputHeight;

          if (!shouldUpscale || (shouldUpscale && outputUpscale)) {
            var scalarWidth = outputWidth / cropWidth;
            var scalarHeight = outputHeight / cropHeight;

            if (outputFit === 'force') {
              cropWidth = outputWidth;
              cropHeight = outputHeight;
            } else {
              var scalar;
              if (outputFit === 'cover') {
                scalar = Math.max(scalarWidth, scalarHeight);
              } else if (outputFit === 'contain') {
                scalar = Math.min(scalarWidth, scalarHeight);
              }
              cropWidth = cropWidth * scalar;
              cropHeight = cropHeight * scalar;
            }
          }
        }

        var size = {
          width: viewWidth,
          height: viewHeight
        };

        root.element.setAttribute('width', size.width);
        root.element.setAttribute('height', size.height);

        var scale = Math.min(viewWidth / cropWidth, viewHeight / cropHeight);

        // clear
        root.element.innerHTML = '';

        // get filter
        var markupFilter = root.query('GET_IMAGE_PREVIEW_MARKUP_FILTER');

        // draw new
        markup
          .filter(markupFilter)
          .map(prepareMarkup)
          .sort(sortMarkupByZIndex)
          .forEach(function(markup) {
            var _markup = _slicedToArray(markup, 2),
              type = _markup[0],
              settings = _markup[1];

            // create
            var element = createMarkupByType(type, settings);

            // update
            updateMarkupByType(element, type, settings, size, scale);

            // add
            root.element.appendChild(element);
          });
      }
    });
  };

  var createVector$1 = function createVector(x, y) {
    return { x: x, y: y };
  };

  var vectorDot = function vectorDot(a, b) {
    return a.x * b.x + a.y * b.y;
  };

  var vectorSubtract = function vectorSubtract(a, b) {
    return createVector$1(a.x - b.x, a.y - b.y);
  };

  var vectorDistanceSquared = function vectorDistanceSquared(a, b) {
    return vectorDot(vectorSubtract(a, b), vectorSubtract(a, b));
  };

  var vectorDistance = function vectorDistance(a, b) {
    return Math.sqrt(vectorDistanceSquared(a, b));
  };

  var getOffsetPointOnEdge = function getOffsetPointOnEdge(length, rotation) {
    var a = length;

    var A = 1.5707963267948966;
    var B = rotation;
    var C = 1.5707963267948966 - rotation;

    var sinA = Math.sin(A);
    var sinB = Math.sin(B);
    var sinC = Math.sin(C);
    var cosC = Math.cos(C);
    var ratio = a / sinA;
    var b = ratio * sinB;
    var c = ratio * sinC;

    return createVector$1(cosC * b, cosC * c);
  };

  var getRotatedRectSize = function getRotatedRectSize(rect, rotation) {
    var w = rect.width;
    var h = rect.height;

    var hor = getOffsetPointOnEdge(w, rotation);
    var ver = getOffsetPointOnEdge(h, rotation);

    var tl = createVector$1(rect.x + Math.abs(hor.x), rect.y - Math.abs(hor.y));

    var tr = createVector$1(
      rect.x + rect.width + Math.abs(ver.y),
      rect.y + Math.abs(ver.x)
    );

    var bl = createVector$1(
      rect.x - Math.abs(ver.y),
      rect.y + rect.height - Math.abs(ver.x)
    );

    return {
      width: vectorDistance(tl, tr),
      height: vectorDistance(tl, bl)
    };
  };

  var calculateCanvasSize = function calculateCanvasSize(
    image,
    canvasAspectRatio
  ) {
    var zoom =
      arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

    var imageAspectRatio = image.height / image.width;

    // determine actual pixels on x and y axis
    var canvasWidth = 1;
    var canvasHeight = canvasAspectRatio;
    var imgWidth = 1;
    var imgHeight = imageAspectRatio;
    if (imgHeight > canvasHeight) {
      imgHeight = canvasHeight;
      imgWidth = imgHeight / imageAspectRatio;
    }

    var scalar = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);
    var width = image.width / (zoom * scalar * imgWidth);
    var height = width * canvasAspectRatio;

    return {
      width: width,
      height: height
    };
  };

  var getImageRectZoomFactor = function getImageRectZoomFactor(
    imageRect,
    cropRect,
    rotation,
    center
  ) {
    // calculate available space round image center position
    var cx = center.x > 0.5 ? 1 - center.x : center.x;
    var cy = center.y > 0.5 ? 1 - center.y : center.y;
    var imageWidth = cx * 2 * imageRect.width;
    var imageHeight = cy * 2 * imageRect.height;

    // calculate rotated crop rectangle size
    var rotatedCropSize = getRotatedRectSize(cropRect, rotation);

    // calculate scalar required to fit image
    return Math.max(
      rotatedCropSize.width / imageWidth,
      rotatedCropSize.height / imageHeight
    );
  };

  var getCenteredCropRect = function getCenteredCropRect(
    container,
    aspectRatio
  ) {
    var width = container.width;
    var height = width * aspectRatio;
    if (height > container.height) {
      height = container.height;
      width = height / aspectRatio;
    }
    var x = (container.width - width) * 0.5;
    var y = (container.height - height) * 0.5;

    return {
      x: x,
      y: y,
      width: width,
      height: height
    };
  };

  var getCurrentCropSize = function getCurrentCropSize(imageSize) {
    var crop =
      arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var zoom = crop.zoom,
      rotation = crop.rotation,
      center = crop.center,
      aspectRatio = crop.aspectRatio;

    if (!aspectRatio) aspectRatio = imageSize.height / imageSize.width;

    var canvasSize = calculateCanvasSize(imageSize, aspectRatio, zoom);

    var canvasCenter = {
      x: canvasSize.width * 0.5,
      y: canvasSize.height * 0.5
    };

    var stage = {
      x: 0,
      y: 0,
      width: canvasSize.width,
      height: canvasSize.height,
      center: canvasCenter
    };

    var shouldLimit = typeof crop.scaleToFit === 'undefined' || crop.scaleToFit;

    var stageZoomFactor = getImageRectZoomFactor(
      imageSize,
      getCenteredCropRect(stage, aspectRatio),
      rotation,
      shouldLimit ? center : { x: 0.5, y: 0.5 }
    );

    var scale = zoom * stageZoomFactor;

    // start drawing
    return {
      widthFloat: canvasSize.width / scale,
      heightFloat: canvasSize.height / scale,
      width: Math.round(canvasSize.width / scale),
      height: Math.round(canvasSize.height / scale)
    };
  };

  var IMAGE_SCALE_SPRING_PROPS = {
    type: 'spring',
    stiffness: 0.5,
    damping: 0.45,
    mass: 10
  };

  // does horizontal and vertical flipping
  var createBitmapView = function createBitmapView(_) {
    return _.utils.createView({
      name: 'image-bitmap',
      ignoreRect: true,
      mixins: { styles: ['scaleX', 'scaleY'] },
      create: function create(_ref) {
        var root = _ref.root,
          props = _ref.props;
        root.appendChild(props.image);
      }
    });
  };

  // shifts and rotates image
  var createImageCanvasWrapper = function createImageCanvasWrapper(_) {
    return _.utils.createView({
      name: 'image-canvas-wrapper',
      tag: 'div',
      ignoreRect: true,
      mixins: {
        apis: ['crop', 'width', 'height'],

        styles: [
          'originX',
          'originY',
          'translateX',
          'translateY',
          'scaleX',
          'scaleY',
          'rotateZ'
        ],

        animations: {
          originX: IMAGE_SCALE_SPRING_PROPS,
          originY: IMAGE_SCALE_SPRING_PROPS,
          scaleX: IMAGE_SCALE_SPRING_PROPS,
          scaleY: IMAGE_SCALE_SPRING_PROPS,
          translateX: IMAGE_SCALE_SPRING_PROPS,
          translateY: IMAGE_SCALE_SPRING_PROPS,
          rotateZ: IMAGE_SCALE_SPRING_PROPS
        }
      },

      create: function create(_ref2) {
        var root = _ref2.root,
          props = _ref2.props;
        props.width = props.image.width;
        props.height = props.image.height;
        root.ref.bitmap = root.appendChildView(
          root.createChildView(createBitmapView(_), { image: props.image })
        );
      },
      write: function write(_ref3) {
        var root = _ref3.root,
          props = _ref3.props;
        var flip = props.crop.flip;
        var bitmap = root.ref.bitmap;
        bitmap.scaleX = flip.horizontal ? -1 : 1;
        bitmap.scaleY = flip.vertical ? -1 : 1;
      }
    });
  };

  // clips canvas to correct aspect ratio
  var createClipView = function createClipView(_) {
    return _.utils.createView({
      name: 'image-clip',
      tag: 'div',
      ignoreRect: true,
      mixins: {
        apis: [
          'crop',
          'markup',
          'resize',
          'width',
          'height',
          'dirty',
          'background'
        ],

        styles: ['width', 'height', 'opacity'],
        animations: {
          opacity: { type: 'tween', duration: 250 }
        }
      },

      didWriteView: function didWriteView(_ref4) {
        var root = _ref4.root,
          props = _ref4.props;
        if (!props.background) return;
        root.element.style.backgroundColor = props.background;
      },
      create: function create(_ref5) {
        var root = _ref5.root,
          props = _ref5.props;

        root.ref.image = root.appendChildView(
          root.createChildView(
            createImageCanvasWrapper(_),
            Object.assign({}, props)
          )
        );

        root.ref.createMarkup = function() {
          if (root.ref.markup) return;
          root.ref.markup = root.appendChildView(
            root.createChildView(createMarkupView(_), Object.assign({}, props))
          );
        };

        root.ref.destroyMarkup = function() {
          if (!root.ref.markup) return;
          root.removeChildView(root.ref.markup);
          root.ref.markup = null;
        };

        // set up transparency grid
        var transparencyIndicator = root.query(
          'GET_IMAGE_PREVIEW_TRANSPARENCY_INDICATOR'
        );
        if (transparencyIndicator === null) return;

        // grid pattern
        if (transparencyIndicator === 'grid') {
          root.element.dataset.transparencyIndicator = transparencyIndicator;
        }
        // basic color
        else {
          root.element.dataset.transparencyIndicator = 'color';
        }
      },
      write: function write(_ref6) {
        var root = _ref6.root,
          props = _ref6.props,
          shouldOptimize = _ref6.shouldOptimize;
        var crop = props.crop,
          markup = props.markup,
          resize = props.resize,
          dirty = props.dirty,
          width = props.width,
          height = props.height;

        root.ref.image.crop = crop;

        var stage = {
          x: 0,
          y: 0,
          width: width,
          height: height,
          center: {
            x: width * 0.5,
            y: height * 0.5
          }
        };

        var image = {
          width: root.ref.image.width,
          height: root.ref.image.height
        };

        var origin = {
          x: crop.center.x * image.width,
          y: crop.center.y * image.height
        };

        var translation = {
          x: stage.center.x - image.width * crop.center.x,
          y: stage.center.y - image.height * crop.center.y
        };

        var rotation = Math.PI * 2 + (crop.rotation % (Math.PI * 2));

        var cropAspectRatio = crop.aspectRatio || image.height / image.width;

        var shouldLimit =
          typeof crop.scaleToFit === 'undefined' || crop.scaleToFit;

        var stageZoomFactor = getImageRectZoomFactor(
          image,
          getCenteredCropRect(stage, cropAspectRatio),

          rotation,
          shouldLimit ? crop.center : { x: 0.5, y: 0.5 }
        );

        var scale = crop.zoom * stageZoomFactor;

        // update markup view
        if (markup && markup.length) {
          root.ref.createMarkup();
          root.ref.markup.width = width;
          root.ref.markup.height = height;
          root.ref.markup.resize = resize;
          root.ref.markup.dirty = dirty;
          root.ref.markup.markup = markup;
          root.ref.markup.crop = getCurrentCropSize(image, crop);
        } else if (root.ref.markup) {
          root.ref.destroyMarkup();
        }

        // update image view
        var imageView = root.ref.image;

        // don't update clip layout
        if (shouldOptimize) {
          imageView.originX = null;
          imageView.originY = null;
          imageView.translateX = null;
          imageView.translateY = null;
          imageView.rotateZ = null;
          imageView.scaleX = null;
          imageView.scaleY = null;
          return;
        }

        imageView.originX = origin.x;
        imageView.originY = origin.y;
        imageView.translateX = translation.x;
        imageView.translateY = translation.y;
        imageView.rotateZ = rotation;
        imageView.scaleX = scale;
        imageView.scaleY = scale;
      }
    });
  };

  var createImageView = function createImageView(_) {
    return _.utils.createView({
      name: 'image-preview',
      tag: 'div',
      ignoreRect: true,
      mixins: {
        apis: ['image', 'crop', 'markup', 'resize', 'dirty', 'background'],

        styles: ['translateY', 'scaleX', 'scaleY', 'opacity'],

        animations: {
          scaleX: IMAGE_SCALE_SPRING_PROPS,
          scaleY: IMAGE_SCALE_SPRING_PROPS,
          translateY: IMAGE_SCALE_SPRING_PROPS,
          opacity: { type: 'tween', duration: 400 }
        }
      },

      create: function create(_ref7) {
        var root = _ref7.root,
          props = _ref7.props;
        root.ref.clip = root.appendChildView(
          root.createChildView(createClipView(_), {
            id: props.id,
            image: props.image,
            crop: props.crop,
            markup: props.markup,
            resize: props.resize,
            dirty: props.dirty,
            background: props.background
          })
        );
      },
      write: function write(_ref8) {
        var root = _ref8.root,
          props = _ref8.props,
          shouldOptimize = _ref8.shouldOptimize;
        var clip = root.ref.clip;
        var image = props.image,
          crop = props.crop,
          markup = props.markup,
          resize = props.resize,
          dirty = props.dirty;

        clip.crop = crop;
        clip.markup = markup;
        clip.resize = resize;
        clip.dirty = dirty;

        // don't update clip layout
        clip.opacity = shouldOptimize ? 0 : 1;

        // don't re-render if optimizing or hidden (width will be zero resulting in weird animations)
        if (shouldOptimize || root.rect.element.hidden) return;

        // calculate scaled preview image size
        var imageAspectRatio = image.height / image.width;
        var aspectRatio = crop.aspectRatio || imageAspectRatio;

        // calculate container size
        var containerWidth = root.rect.inner.width;
        var containerHeight = root.rect.inner.height;

        var fixedPreviewHeight = root.query('GET_IMAGE_PREVIEW_HEIGHT');
        var minPreviewHeight = root.query('GET_IMAGE_PREVIEW_MIN_HEIGHT');
        var maxPreviewHeight = root.query('GET_IMAGE_PREVIEW_MAX_HEIGHT');

        var panelAspectRatio = root.query('GET_PANEL_ASPECT_RATIO');
        var allowMultiple = root.query('GET_ALLOW_MULTIPLE');

        if (panelAspectRatio && !allowMultiple) {
          fixedPreviewHeight = containerWidth * panelAspectRatio;
          aspectRatio = panelAspectRatio;
        }

        // determine clip width and height
        var clipHeight =
          fixedPreviewHeight !== null
            ? fixedPreviewHeight
            : Math.max(
                minPreviewHeight,
                Math.min(containerWidth * aspectRatio, maxPreviewHeight)
              );

        var clipWidth = clipHeight / aspectRatio;
        if (clipWidth > containerWidth) {
          clipWidth = containerWidth;
          clipHeight = clipWidth * aspectRatio;
        }

        if (clipHeight > containerHeight) {
          clipHeight = containerHeight;
          clipWidth = containerHeight / aspectRatio;
        }

        clip.width = clipWidth;
        clip.height = clipHeight;
      }
    });
  };

  var SVG_MASK =
    '<svg width="500" height="200" viewBox="0 0 500 200" preserveAspectRatio="none">\n    <defs>\n        <radialGradient id="gradient-__UID__" cx=".5" cy="1.25" r="1.15">\n            <stop offset=\'50%\' stop-color=\'#000000\'/>\n            <stop offset=\'56%\' stop-color=\'#0a0a0a\'/>\n            <stop offset=\'63%\' stop-color=\'#262626\'/>\n            <stop offset=\'69%\' stop-color=\'#4f4f4f\'/>\n            <stop offset=\'75%\' stop-color=\'#808080\'/>\n            <stop offset=\'81%\' stop-color=\'#b1b1b1\'/>\n            <stop offset=\'88%\' stop-color=\'#dadada\'/>\n            <stop offset=\'94%\' stop-color=\'#f6f6f6\'/>\n            <stop offset=\'100%\' stop-color=\'#ffffff\'/>\n        </radialGradient>\n        <mask id="mask-__UID__">\n            <rect x="0" y="0" width="500" height="200" fill="url(#gradient-__UID__)"></rect>\n        </mask>\n    </defs>\n    <rect x="0" width="500" height="200" fill="currentColor" mask="url(#mask-__UID__)"></rect>\n</svg>';

  var SVGMaskUniqueId = 0;

  var createImageOverlayView = function createImageOverlayView(fpAPI) {
    return fpAPI.utils.createView({
      name: 'image-preview-overlay',
      tag: 'div',
      ignoreRect: true,
      create: function create(_ref) {
        var root = _ref.root,
          props = _ref.props;
        var mask = SVG_MASK;
        if (document.querySelector('base')) {
          var url = new URL(
            window.location.href.replace(window.location.hash, '')
          ).href;
          mask = mask.replace(/url\(\#/g, 'url(' + url + '#');
        }

        SVGMaskUniqueId++;
        root.element.classList.add(
          'filepond--image-preview-overlay-'.concat(props.status)
        );

        root.element.innerHTML = mask.replace(/__UID__/g, SVGMaskUniqueId);
      },
      mixins: {
        styles: ['opacity'],
        animations: {
          opacity: { type: 'spring', mass: 25 }
        }
      }
    });
  };

  /**
   * Bitmap Worker
   */
  var BitmapWorker = function BitmapWorker() {
    self.onmessage = function(e) {
      createImageBitmap(e.data.message.file).then(function(bitmap) {
        self.postMessage({ id: e.data.id, message: bitmap }, [bitmap]);
      });
    };
  };

  /**
   * ColorMatrix Worker
   */
  var ColorMatrixWorker = function ColorMatrixWorker() {
    self.onmessage = function(e) {
      var imageData = e.data.message.imageData;
      var matrix = e.data.message.colorMatrix;

      var data = imageData.data;
      var l = data.length;

      var m11 = matrix[0];
      var m12 = matrix[1];
      var m13 = matrix[2];
      var m14 = matrix[3];
      var m15 = matrix[4];

      var m21 = matrix[5];
      var m22 = matrix[6];
      var m23 = matrix[7];
      var m24 = matrix[8];
      var m25 = matrix[9];

      var m31 = matrix[10];
      var m32 = matrix[11];
      var m33 = matrix[12];
      var m34 = matrix[13];
      var m35 = matrix[14];

      var m41 = matrix[15];
      var m42 = matrix[16];
      var m43 = matrix[17];
      var m44 = matrix[18];
      var m45 = matrix[19];

      var index = 0,
        r = 0.0,
        g = 0.0,
        b = 0.0,
        a = 0.0;

      for (; index < l; index += 4) {
        r = data[index] / 255;
        g = data[index + 1] / 255;
        b = data[index + 2] / 255;
        a = data[index + 3] / 255;
        data[index] = Math.max(
          0,
          Math.min((r * m11 + g * m12 + b * m13 + a * m14 + m15) * 255, 255)
        );
        data[index + 1] = Math.max(
          0,
          Math.min((r * m21 + g * m22 + b * m23 + a * m24 + m25) * 255, 255)
        );
        data[index + 2] = Math.max(
          0,
          Math.min((r * m31 + g * m32 + b * m33 + a * m34 + m35) * 255, 255)
        );
        data[index + 3] = Math.max(
          0,
          Math.min((r * m41 + g * m42 + b * m43 + a * m44 + m45) * 255, 255)
        );
      }

      self.postMessage({ id: e.data.id, message: imageData }, [
        imageData.data.buffer
      ]);
    };
  };

  var getImageSize = function getImageSize(url, cb) {
    var image = new Image();
    image.onload = function() {
      var width = image.naturalWidth;
      var height = image.naturalHeight;
      image = null;
      cb(width, height);
    };
    image.src = url;
  };

  var transforms = {
    1: function _() {
      return [1, 0, 0, 1, 0, 0];
    },
    2: function _(width) {
      return [-1, 0, 0, 1, width, 0];
    },
    3: function _(width, height) {
      return [-1, 0, 0, -1, width, height];
    },
    4: function _(width, height) {
      return [1, 0, 0, -1, 0, height];
    },
    5: function _() {
      return [0, 1, 1, 0, 0, 0];
    },
    6: function _(width, height) {
      return [0, 1, -1, 0, height, 0];
    },
    7: function _(width, height) {
      return [0, -1, -1, 0, height, width];
    },
    8: function _(width) {
      return [0, -1, 1, 0, 0, width];
    }
  };

  var fixImageOrientation = function fixImageOrientation(
    ctx,
    width,
    height,
    orientation
  ) {
    // no orientation supplied
    if (orientation === -1) {
      return;
    }

    ctx.transform.apply(ctx, transforms[orientation](width, height));
  };

  // draws the preview image to canvas
  var createPreviewImage = function createPreviewImage(
    data,
    width,
    height,
    orientation
  ) {
    // can't draw on half pixels
    width = Math.round(width);
    height = Math.round(height);

    // draw image
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext('2d');

    // if is rotated incorrectly swap width and height
    if (orientation >= 5 && orientation <= 8) {
      var _ref = [height, width];
      width = _ref[0];
      height = _ref[1];
    }

    // correct image orientation
    fixImageOrientation(ctx, width, height, orientation);

    // draw the image
    ctx.drawImage(data, 0, 0, width, height);

    return canvas;
  };

  var isBitmap = function isBitmap(file) {
    return /^image/.test(file.type) && !/svg/.test(file.type);
  };

  var MAX_WIDTH = 10;
  var MAX_HEIGHT = 10;

  var calculateAverageColor = function calculateAverageColor(image) {
    var scalar = Math.min(MAX_WIDTH / image.width, MAX_HEIGHT / image.height);

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var width = (canvas.width = Math.ceil(image.width * scalar));
    var height = (canvas.height = Math.ceil(image.height * scalar));
    ctx.drawImage(image, 0, 0, width, height);
    var data = null;
    try {
      data = ctx.getImageData(0, 0, width, height).data;
    } catch (e) {
      return null;
    }
    var l = data.length;

    var r = 0;
    var g = 0;
    var b = 0;
    var i = 0;

    for (; i < l; i += 4) {
      r += data[i] * data[i];
      g += data[i + 1] * data[i + 1];
      b += data[i + 2] * data[i + 2];
    }

    r = averageColor(r, l);
    g = averageColor(g, l);
    b = averageColor(b, l);

    return { r: r, g: g, b: b };
  };

  var averageColor = function averageColor(c, l) {
    return Math.floor(Math.sqrt(c / (l / 4)));
  };

  var cloneCanvas = function cloneCanvas(origin, target) {
    target = target || document.createElement('canvas');
    target.width = origin.width;
    target.height = origin.height;
    var ctx = target.getContext('2d');
    ctx.drawImage(origin, 0, 0);
    return target;
  };

  var cloneImageData = function cloneImageData(imageData) {
    var id;
    try {
      id = new ImageData(imageData.width, imageData.height);
    } catch (e) {
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      id = ctx.createImageData(imageData.width, imageData.height);
    }
    id.data.set(new Uint8ClampedArray(imageData.data));
    return id;
  };

  var loadImage = function loadImage(url) {
    return new Promise(function(resolve, reject) {
      var img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = function() {
        resolve(img);
      };
      img.onerror = function(e) {
        reject(e);
      };
      img.src = url;
    });
  };

  var createImageWrapperView = function createImageWrapperView(_) {
    // create overlay view
    var OverlayView = createImageOverlayView(_);

    var ImageView = createImageView(_);
    var createWorker = _.utils.createWorker;

    var applyFilter = function applyFilter(root, filter, target) {
      return new Promise(function(resolve) {
        // will store image data for future filter updates
        if (!root.ref.imageData) {
          root.ref.imageData = target
            .getContext('2d')
            .getImageData(0, 0, target.width, target.height);
        }

        // get image data reference
        var imageData = cloneImageData(root.ref.imageData);

        if (!filter || filter.length !== 20) {
          target.getContext('2d').putImageData(imageData, 0, 0);
          return resolve();
        }

        var worker = createWorker(ColorMatrixWorker);
        worker.post(
          {
            imageData: imageData,
            colorMatrix: filter
          },

          function(response) {
            // apply filtered colors
            target.getContext('2d').putImageData(response, 0, 0);

            // stop worker
            worker.terminate();

            // done!
            resolve();
          },
          [imageData.data.buffer]
        );
      });
    };

    var removeImageView = function removeImageView(root, imageView) {
      root.removeChildView(imageView);
      imageView.image.width = 1;
      imageView.image.height = 1;
      imageView._destroy();
    };

    // remove an image
    var shiftImage = function shiftImage(_ref) {
      var root = _ref.root;
      var imageView = root.ref.images.shift();
      imageView.opacity = 0;
      imageView.translateY = -15;
      root.ref.imageViewBin.push(imageView);
      return imageView;
    };

    // add new image
    var pushImage = function pushImage(_ref2) {
      var root = _ref2.root,
        props = _ref2.props,
        image = _ref2.image;
      var id = props.id;
      var item = root.query('GET_ITEM', { id: id });
      if (!item) return;

      var crop = item.getMetadata('crop') || {
        center: {
          x: 0.5,
          y: 0.5
        },

        flip: {
          horizontal: false,
          vertical: false
        },

        zoom: 1,
        rotation: 0,
        aspectRatio: null
      };

      var background = root.query(
        'GET_IMAGE_TRANSFORM_CANVAS_BACKGROUND_COLOR'
      );

      var markup;
      var resize;
      var dirty = false;
      if (root.query('GET_IMAGE_PREVIEW_MARKUP_SHOW')) {
        markup = item.getMetadata('markup') || [];
        resize = item.getMetadata('resize');
        dirty = true;
      }

      // append image presenter
      var imageView = root.appendChildView(
        root.createChildView(ImageView, {
          id: id,
          image: image,
          crop: crop,
          resize: resize,
          markup: markup,
          dirty: dirty,
          background: background,
          opacity: 0,
          scaleX: 1.15,
          scaleY: 1.15,
          translateY: 15
        }),

        root.childViews.length
      );

      root.ref.images.push(imageView);

      // reveal the preview image
      imageView.opacity = 1;
      imageView.scaleX = 1;
      imageView.scaleY = 1;
      imageView.translateY = 0;

      // the preview is now ready to be drawn
      setTimeout(function() {
        root.dispatch('DID_IMAGE_PREVIEW_SHOW', { id: id });
      }, 250);
    };

    var updateImage = function updateImage(_ref3) {
      var root = _ref3.root,
        props = _ref3.props;
      var item = root.query('GET_ITEM', { id: props.id });
      if (!item) return;
      var imageView = root.ref.images[root.ref.images.length - 1];
      imageView.crop = item.getMetadata('crop');
      imageView.background = root.query(
        'GET_IMAGE_TRANSFORM_CANVAS_BACKGROUND_COLOR'
      );

      if (root.query('GET_IMAGE_PREVIEW_MARKUP_SHOW')) {
        imageView.dirty = true;
        imageView.resize = item.getMetadata('resize');
        imageView.markup = item.getMetadata('markup');
      }
    };

    // replace image preview
    var didUpdateItemMetadata = function didUpdateItemMetadata(_ref4) {
      var root = _ref4.root,
        props = _ref4.props,
        action = _ref4.action;
      // only filter and crop trigger redraw
      if (!/crop|filter|markup|resize/.test(action.change.key)) return;

      // no images to update, exit
      if (!root.ref.images.length) return;

      // no item found, exit
      var item = root.query('GET_ITEM', { id: props.id });
      if (!item) return;

      // for now, update existing image when filtering
      if (/filter/.test(action.change.key)) {
        var imageView = root.ref.images[root.ref.images.length - 1];
        applyFilter(root, action.change.value, imageView.image);
        return;
      }

      if (/crop|markup|resize/.test(action.change.key)) {
        var crop = item.getMetadata('crop');
        var image = root.ref.images[root.ref.images.length - 1];

        // if aspect ratio has changed, we need to create a new image
        if (
          crop &&
          crop.aspectRatio &&
          image.crop &&
          image.crop.aspectRatio &&
          Math.abs(crop.aspectRatio - image.crop.aspectRatio) > 0.00001
        ) {
          var _imageView = shiftImage({ root: root });
          pushImage({
            root: root,
            props: props,
            image: cloneCanvas(_imageView.image)
          });
        }
        // if not, we can update the current image
        else {
          updateImage({ root: root, props: props });
        }
      }
    };

    var canCreateImageBitmap = function canCreateImageBitmap(file) {
      // Firefox versions before 58 will freeze when running createImageBitmap
      // in a Web Worker so we detect those versions and return false for support
      var userAgent = window.navigator.userAgent;
      var isFirefox = userAgent.match(/Firefox\/([0-9]+)\./);
      var firefoxVersion = isFirefox ? parseInt(isFirefox[1]) : null;
      if (firefoxVersion !== null && firefoxVersion <= 58) return false;

      return 'createImageBitmap' in window && isBitmap(file);
    };

    /**
     * Write handler for when preview container has been created
     */
    var didCreatePreviewContainer = function didCreatePreviewContainer(_ref5) {
      var root = _ref5.root,
        props = _ref5.props;
      var id = props.id;

      // we need to get the file data to determine the eventual image size
      var item = root.query('GET_ITEM', id);
      if (!item) return;

      // get url to file (we'll revoke it later on when done)
      var fileURL = URL.createObjectURL(item.file);

      // determine image size of this item
      getImageSize(fileURL, function(width, height) {
        // we can now scale the panel to the final size
        root.dispatch('DID_IMAGE_PREVIEW_CALCULATE_SIZE', {
          id: id,
          width: width,
          height: height
        });
      });
    };

    var drawPreview = function drawPreview(_ref6) {
      var root = _ref6.root,
        props = _ref6.props;
      var id = props.id;

      // we need to get the file data to determine the eventual image size
      var item = root.query('GET_ITEM', id);
      if (!item) return;

      // get url to file (we'll revoke it later on when done)
      var fileURL = URL.createObjectURL(item.file);

      // fallback
      var loadPreviewFallback = function loadPreviewFallback() {
        // let's scale the image in the main thread :(
        loadImage(fileURL).then(previewImageLoaded);
      };

      // image is now ready
      var previewImageLoaded = function previewImageLoaded(imageData) {
        // the file url is no longer needed
        URL.revokeObjectURL(fileURL);

        // draw the scaled down version here and use that as source so bitmapdata can be closed
        // orientation info
        var exif = item.getMetadata('exif') || {};
        var orientation = exif.orientation || -1;

        // get width and height from action, and swap if orientation is incorrect
        var width = imageData.width,
          height = imageData.height;

        // if no width or height, just return early.
        if (!width || !height) return;

        if (orientation >= 5 && orientation <= 8) {
          var _ref7 = [height, width];
          width = _ref7[0];
          height = _ref7[1];
        }

        // scale canvas based on pixel density
        // we multiply by .75 as that creates smaller but still clear images on screens with high res displays
        var pixelDensityFactor = Math.max(1, window.devicePixelRatio * 0.75);

        // we want as much pixels to work with as possible,
        // this multiplies the minimum image resolution,
        // so when zooming in it doesn't get too blurry
        var zoomFactor = root.query('GET_IMAGE_PREVIEW_ZOOM_FACTOR');

        // imaeg scale factor
        var scaleFactor = zoomFactor * pixelDensityFactor;

        // calculate scaled preview image size
        var previewImageRatio = height / width;

        // calculate image preview height and width
        var previewContainerWidth = root.rect.element.width;
        var previewContainerHeight = root.rect.element.height;

        var imageWidth = previewContainerWidth;
        var imageHeight = imageWidth * previewImageRatio;

        if (previewImageRatio > 1) {
          imageWidth = Math.min(width, previewContainerWidth * scaleFactor);
          imageHeight = imageWidth * previewImageRatio;
        } else {
          imageHeight = Math.min(height, previewContainerHeight * scaleFactor);
          imageWidth = imageHeight / previewImageRatio;
        }

        // transfer to image tag so no canvas memory wasted on iOS
        var previewImage = createPreviewImage(
          imageData,
          imageWidth,
          imageHeight,
          orientation
        );

        // done
        var done = function done() {
          // calculate average image color, disabled for now
          var averageColor = root.query(
            'GET_IMAGE_PREVIEW_CALCULATE_AVERAGE_IMAGE_COLOR'
          )
            ? calculateAverageColor(data)
            : null;
          item.setMetadata('color', averageColor, true);

          // data has been transferred to canvas ( if was ImageBitmap )
          if ('close' in imageData) {
            imageData.close();
          }

          // show the overlay
          root.ref.overlayShadow.opacity = 1;

          // create the first image
          pushImage({ root: root, props: props, image: previewImage });
        };

        // apply filter
        var filter = item.getMetadata('filter');
        if (filter) {
          applyFilter(root, filter, previewImage).then(done);
        } else {
          done();
        }
      };

      // if we support scaling using createImageBitmap we use a worker
      if (canCreateImageBitmap(item.file)) {
        // let's scale the image in a worker
        var worker = createWorker(BitmapWorker);

        worker.post(
          {
            file: item.file
          },

          function(imageBitmap) {
            // destroy worker
            worker.terminate();

            // no bitmap returned, must be something wrong,
            // try the oldschool way
            if (!imageBitmap) {
              loadPreviewFallback();
              return;
            }

            // yay we got our bitmap, let's continue showing the preview
            previewImageLoaded(imageBitmap);
          }
        );
      } else {
        // create fallback preview
        loadPreviewFallback();
      }
    };

    /**
     * Write handler for when the preview image is ready to be animated
     */
    var didDrawPreview = function didDrawPreview(_ref8) {
      var root = _ref8.root;
      // get last added image
      var image = root.ref.images[root.ref.images.length - 1];
      image.translateY = 0;
      image.scaleX = 1.0;
      image.scaleY = 1.0;
      image.opacity = 1;
    };

    /**
     * Write handler for when the preview has been loaded
     */
    var restoreOverlay = function restoreOverlay(_ref9) {
      var root = _ref9.root;
      root.ref.overlayShadow.opacity = 1;
      root.ref.overlayError.opacity = 0;
      root.ref.overlaySuccess.opacity = 0;
    };

    var didThrowError = function didThrowError(_ref10) {
      var root = _ref10.root;
      root.ref.overlayShadow.opacity = 0.25;
      root.ref.overlayError.opacity = 1;
    };

    var didCompleteProcessing = function didCompleteProcessing(_ref11) {
      var root = _ref11.root;
      root.ref.overlayShadow.opacity = 0.25;
      root.ref.overlaySuccess.opacity = 1;
    };

    /**
     * Constructor
     */
    var create = function create(_ref12) {
      var root = _ref12.root;
      // image view
      root.ref.images = [];

      // the preview image data (we need this to filter the image)
      root.ref.imageData = null;

      // image bin
      root.ref.imageViewBin = [];

      // image overlays
      root.ref.overlayShadow = root.appendChildView(
        root.createChildView(OverlayView, {
          opacity: 0,
          status: 'idle'
        })
      );

      root.ref.overlaySuccess = root.appendChildView(
        root.createChildView(OverlayView, {
          opacity: 0,
          status: 'success'
        })
      );

      root.ref.overlayError = root.appendChildView(
        root.createChildView(OverlayView, {
          opacity: 0,
          status: 'failure'
        })
      );
    };

    return _.utils.createView({
      name: 'image-preview-wrapper',
      create: create,
      styles: ['height'],
      apis: ['height'],
      destroy: function destroy(_ref13) {
        var root = _ref13.root;
        // we resize the image so memory on iOS 12 is released more quickly (it seems)
        root.ref.images.forEach(function(imageView) {
          imageView.image.width = 1;
          imageView.image.height = 1;
        });
      },
      didWriteView: function didWriteView(_ref14) {
        var root = _ref14.root;
        root.ref.images.forEach(function(imageView) {
          imageView.dirty = false;
        });
      },
      write: _.utils.createRoute(
        {
          // image preview stated
          DID_IMAGE_PREVIEW_DRAW: didDrawPreview,
          DID_IMAGE_PREVIEW_CONTAINER_CREATE: didCreatePreviewContainer,
          DID_FINISH_CALCULATE_PREVIEWSIZE: drawPreview,
          DID_UPDATE_ITEM_METADATA: didUpdateItemMetadata,

          // file states
          DID_THROW_ITEM_LOAD_ERROR: didThrowError,
          DID_THROW_ITEM_PROCESSING_ERROR: didThrowError,
          DID_THROW_ITEM_INVALID: didThrowError,
          DID_COMPLETE_ITEM_PROCESSING: didCompleteProcessing,
          DID_START_ITEM_PROCESSING: restoreOverlay,
          DID_REVERT_ITEM_PROCESSING: restoreOverlay
        },

        function(_ref15) {
          var root = _ref15.root;
          // views on death row
          var viewsToRemove = root.ref.imageViewBin.filter(function(imageView) {
            return imageView.opacity === 0;
          });

          // views to retain
          root.ref.imageViewBin = root.ref.imageViewBin.filter(function(
            imageView
          ) {
            return imageView.opacity > 0;
          });

          // remove these views
          viewsToRemove.forEach(function(imageView) {
            return removeImageView(root, imageView);
          });
          viewsToRemove.length = 0;
        }
      )
    });
  };

  /**
   * Image Preview Plugin
   */
  var plugin = function plugin(fpAPI) {
    var addFilter = fpAPI.addFilter,
      utils = fpAPI.utils;
    var Type = utils.Type,
      createRoute = utils.createRoute,
      isFile = utils.isFile;

    // imagePreviewView
    var imagePreviewView = createImageWrapperView(fpAPI);

    // called for each view that is created right after the 'create' method
    addFilter('CREATE_VIEW', function(viewAPI) {
      // get reference to created view
      var is = viewAPI.is,
        view = viewAPI.view,
        query = viewAPI.query;

      // only hook up to item view and only if is enabled for this cropper
      if (!is('file') || !query('GET_ALLOW_IMAGE_PREVIEW')) return;

      // create the image preview plugin, but only do so if the item is an image
      var didLoadItem = function didLoadItem(_ref) {
        var root = _ref.root,
          props = _ref.props;
        var id = props.id;
        var item = query('GET_ITEM', id);

        // item could theoretically have been removed in the mean time
        if (!item || !isFile(item.file) || item.archived) return;

        // get the file object
        var file = item.file;

        // exit if this is not an image
        if (!isPreviewableImage(file)) return;

        // test if is filtered
        if (!query('GET_IMAGE_PREVIEW_FILTER_ITEM')(item)) return;

        // exit if image size is too high and no createImageBitmap support
        // this would simply bring the browser to its knees and that is not what we want
        var supportsCreateImageBitmap = 'createImageBitmap' in (window || {});
        var maxPreviewFileSize = query('GET_IMAGE_PREVIEW_MAX_FILE_SIZE');
        if (
          !supportsCreateImageBitmap &&
          maxPreviewFileSize &&
          file.size > maxPreviewFileSize
        )
          return;

        // set preview view
        root.ref.imagePreview = view.appendChildView(
          view.createChildView(imagePreviewView, { id: id })
        );

        // update height if is fixed
        var fixedPreviewHeight = root.query('GET_IMAGE_PREVIEW_HEIGHT');
        if (fixedPreviewHeight) {
          root.dispatch('DID_UPDATE_PANEL_HEIGHT', {
            id: item.id,
            height: fixedPreviewHeight
          });
        }

        // now ready
        var queue =
          !supportsCreateImageBitmap &&
          file.size > query('GET_IMAGE_PREVIEW_MAX_INSTANT_PREVIEW_FILE_SIZE');
        root.dispatch('DID_IMAGE_PREVIEW_CONTAINER_CREATE', { id: id }, queue);
      };

      var rescaleItem = function rescaleItem(root, props) {
        if (!root.ref.imagePreview) return;
        var id = props.id;

        // get item
        var item = root.query('GET_ITEM', { id: id });
        if (!item) return;

        // if is fixed height or panel has aspect ratio, exit here, height has already been defined
        var panelAspectRatio = root.query('GET_PANEL_ASPECT_RATIO');
        var itemPanelAspectRatio = root.query('GET_ITEM_PANEL_ASPECT_RATIO');
        var fixedHeight = root.query('GET_IMAGE_PREVIEW_HEIGHT');
        if (panelAspectRatio || itemPanelAspectRatio || fixedHeight) return;

        // no data!
        var _root$ref = root.ref,
          imageWidth = _root$ref.imageWidth,
          imageHeight = _root$ref.imageHeight;
        if (!imageWidth || !imageHeight) return;

        // get height min and max
        var minPreviewHeight = root.query('GET_IMAGE_PREVIEW_MIN_HEIGHT');
        var maxPreviewHeight = root.query('GET_IMAGE_PREVIEW_MAX_HEIGHT');

        // orientation info
        var exif = item.getMetadata('exif') || {};
        var orientation = exif.orientation || -1;

        // get width and height from action, and swap of orientation is incorrect
        if (orientation >= 5 && orientation <= 8) {
          var _ref2 = [imageHeight, imageWidth];
          imageWidth = _ref2[0];
          imageHeight = _ref2[1];
        }

        // scale up width and height when we're dealing with an SVG
        if (!isBitmap(item.file) || root.query('GET_IMAGE_PREVIEW_UPSCALE')) {
          var scalar = 2048 / imageWidth;
          imageWidth *= scalar;
          imageHeight *= scalar;
        }

        // image aspect ratio
        var imageAspectRatio = imageHeight / imageWidth;

        // we need the item to get to the crop size
        var previewAspectRatio =
          (item.getMetadata('crop') || {}).aspectRatio || imageAspectRatio;

        // preview height range
        var previewHeightMax = Math.max(
          minPreviewHeight,
          Math.min(imageHeight, maxPreviewHeight)
        );

        var itemWidth = root.rect.element.width;
        var previewHeight = Math.min(
          itemWidth * previewAspectRatio,
          previewHeightMax
        );

        // request update to panel height
        root.dispatch('DID_UPDATE_PANEL_HEIGHT', {
          id: item.id,
          height: previewHeight
        });
      };

      var didResizeView = function didResizeView(_ref3) {
        var root = _ref3.root;
        // actions in next write operation
        root.ref.shouldRescale = true;
      };

      var didUpdateItemMetadata = function didUpdateItemMetadata(_ref4) {
        var root = _ref4.root,
          action = _ref4.action;
        if (action.change.key !== 'crop') return;

        // actions in next write operation
        root.ref.shouldRescale = true;
      };

      var didCalculatePreviewSize = function didCalculatePreviewSize(_ref5) {
        var root = _ref5.root,
          action = _ref5.action;
        // remember dimensions
        root.ref.imageWidth = action.width;
        root.ref.imageHeight = action.height;

        // actions in next write operation
        root.ref.shouldRescale = true;
        root.ref.shouldDrawPreview = true;

        // as image load could take a while and fire when draw loop is resting we need to give it a kick
        root.dispatch('KICK');
      };

      // start writing
      view.registerWriter(
        createRoute(
          {
            DID_RESIZE_ROOT: didResizeView,
            DID_STOP_RESIZE: didResizeView,
            DID_LOAD_ITEM: didLoadItem,
            DID_IMAGE_PREVIEW_CALCULATE_SIZE: didCalculatePreviewSize,
            DID_UPDATE_ITEM_METADATA: didUpdateItemMetadata
          },

          function(_ref6) {
            var root = _ref6.root,
              props = _ref6.props;
            // no preview view attached
            if (!root.ref.imagePreview) return;

            // don't do anything while hidden
            if (root.rect.element.hidden) return;

            // resize the item panel
            if (root.ref.shouldRescale) {
              rescaleItem(root, props);
              root.ref.shouldRescale = false;
            }

            if (root.ref.shouldDrawPreview) {
              // queue till next frame so we're sure the height has been applied this forces the draw image call inside the wrapper view to use the correct height
              requestAnimationFrame(function() {
                // this requestAnimationFrame nesting is horrible but it fixes an issue with 100hz displays on Chrome
                // https://github.com/pqina/filepond-plugin-image-preview/issues/57
                requestAnimationFrame(function() {
                  root.dispatch('DID_FINISH_CALCULATE_PREVIEWSIZE', {
                    id: props.id
                  });
                });
              });

              root.ref.shouldDrawPreview = false;
            }
          }
        )
      );
    });

    // expose plugin
    return {
      options: {
        // Enable or disable image preview
        allowImagePreview: [true, Type.BOOLEAN],

        // filters file items to determine which are shown as preview
        imagePreviewFilterItem: [
          function() {
            return true;
          },
          Type.FUNCTION
        ],

        // Fixed preview height
        imagePreviewHeight: [null, Type.INT],

        // Min image height
        imagePreviewMinHeight: [44, Type.INT],

        // Max image height
        imagePreviewMaxHeight: [256, Type.INT],

        // Max size of preview file for when createImageBitmap is not supported
        imagePreviewMaxFileSize: [null, Type.INT],

        // The amount of extra pixels added to the image preview to allow comfortable zooming
        imagePreviewZoomFactor: [2, Type.INT],

        // Should we upscale small images to fit the max bounding box of the preview area
        imagePreviewUpscale: [false, Type.BOOLEAN],

        // Max size of preview file that we allow to try to instant preview if createImageBitmap is not supported, else image is queued for loading
        imagePreviewMaxInstantPreviewFileSize: [1000000, Type.INT],

        // Style of the transparancy indicator used behind images
        imagePreviewTransparencyIndicator: [null, Type.STRING],

        // Enables or disables reading average image color
        imagePreviewCalculateAverageImageColor: [false, Type.BOOLEAN],

        // Enables or disables the previewing of markup
        imagePreviewMarkupShow: [true, Type.BOOLEAN],

        // Allows filtering of markup to only show certain shapes
        imagePreviewMarkupFilter: [
          function() {
            return true;
          },
          Type.FUNCTION
        ]
      }
    };
  };

  // fire pluginloaded event if running in browser, this allows registering the plugin when using async script tags
  var isBrowser =
    typeof window !== 'undefined' && typeof window.document !== 'undefined';
  if (isBrowser) {
    document.dispatchEvent(
      new CustomEvent('FilePond:pluginloaded', { detail: plugin })
    );
  }

  return plugin;
});


/***/ }),

/***/ "./node_modules/filepond/dist/filepond.js":
/*!************************************************!*\
  !*** ./node_modules/filepond/dist/filepond.js ***!
  \************************************************/
/***/ (function(__unused_webpack_module, exports) {

/*!
 * FilePond 4.32.1
 * Licensed under MIT, https://opensource.org/licenses/MIT/
 * Please visit https://pqina.nl/filepond/ for details.
 */

/* eslint-disable */

(function(global, factory) {
     true
        ? factory(exports)
        : 0;
})(this, function(exports) {
    'use strict';

    var isNode = function isNode(value) {
        return value instanceof HTMLElement;
    };

    var createStore = function createStore(initialState) {
        var queries = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
        var actions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
        // internal state
        var state = Object.assign({}, initialState);

        // contains all actions for next frame, is clear when actions are requested
        var actionQueue = [];
        var dispatchQueue = [];

        // returns a duplicate of the current state
        var getState = function getState() {
            return Object.assign({}, state);
        };

        // returns a duplicate of the actions array and clears the actions array
        var processActionQueue = function processActionQueue() {
            // create copy of actions queue
            var queue = [].concat(actionQueue);

            // clear actions queue (we don't want no double actions)
            actionQueue.length = 0;

            return queue;
        };

        // processes actions that might block the main UI thread
        var processDispatchQueue = function processDispatchQueue() {
            // create copy of actions queue
            var queue = [].concat(dispatchQueue);

            // clear actions queue (we don't want no double actions)
            dispatchQueue.length = 0;

            // now dispatch these actions
            queue.forEach(function(_ref) {
                var type = _ref.type,
                    data = _ref.data;
                dispatch(type, data);
            });
        };

        // adds a new action, calls its handler and
        var dispatch = function dispatch(type, data, isBlocking) {
            // is blocking action (should never block if document is hidden)
            if (isBlocking && !document.hidden) {
                dispatchQueue.push({ type: type, data: data });
                return;
            }

            // if this action has a handler, handle the action
            if (actionHandlers[type]) {
                actionHandlers[type](data);
            }

            // now add action
            actionQueue.push({
                type: type,
                data: data,
            });
        };

        var query = function query(str) {
            var _queryHandles;
            for (
                var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1;
                _key < _len;
                _key++
            ) {
                args[_key - 1] = arguments[_key];
            }
            return queryHandles[str]
                ? (_queryHandles = queryHandles)[str].apply(_queryHandles, args)
                : null;
        };

        var api = {
            getState: getState,
            processActionQueue: processActionQueue,
            processDispatchQueue: processDispatchQueue,
            dispatch: dispatch,
            query: query,
        };

        var queryHandles = {};
        queries.forEach(function(query) {
            queryHandles = Object.assign({}, query(state), {}, queryHandles);
        });

        var actionHandlers = {};
        actions.forEach(function(action) {
            actionHandlers = Object.assign({}, action(dispatch, query, state), {}, actionHandlers);
        });

        return api;
    };

    var defineProperty = function defineProperty(obj, property, definition) {
        if (typeof definition === 'function') {
            obj[property] = definition;
            return;
        }
        Object.defineProperty(obj, property, Object.assign({}, definition));
    };

    var forin = function forin(obj, cb) {
        for (var key in obj) {
            if (!obj.hasOwnProperty(key)) {
                continue;
            }

            cb(key, obj[key]);
        }
    };

    var createObject = function createObject(definition) {
        var obj = {};
        forin(definition, function(property) {
            defineProperty(obj, property, definition[property]);
        });
        return obj;
    };

    var attr = function attr(node, name) {
        var value = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
        if (value === null) {
            return node.getAttribute(name) || node.hasAttribute(name);
        }
        node.setAttribute(name, value);
    };

    var ns = 'http://www.w3.org/2000/svg';
    var svgElements = ['svg', 'path']; // only svg elements used

    var isSVGElement = function isSVGElement(tag) {
        return svgElements.includes(tag);
    };

    var createElement = function createElement(tag, className) {
        var attributes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        if (typeof className === 'object') {
            attributes = className;
            className = null;
        }
        var element = isSVGElement(tag)
            ? document.createElementNS(ns, tag)
            : document.createElement(tag);
        if (className) {
            if (isSVGElement(tag)) {
                attr(element, 'class', className);
            } else {
                element.className = className;
            }
        }
        forin(attributes, function(name, value) {
            attr(element, name, value);
        });
        return element;
    };

    var appendChild = function appendChild(parent) {
        return function(child, index) {
            if (typeof index !== 'undefined' && parent.children[index]) {
                parent.insertBefore(child, parent.children[index]);
            } else {
                parent.appendChild(child);
            }
        };
    };

    var appendChildView = function appendChildView(parent, childViews) {
        return function(view, index) {
            if (typeof index !== 'undefined') {
                childViews.splice(index, 0, view);
            } else {
                childViews.push(view);
            }

            return view;
        };
    };

    var removeChildView = function removeChildView(parent, childViews) {
        return function(view) {
            // remove from child views
            childViews.splice(childViews.indexOf(view), 1);

            // remove the element
            if (view.element.parentNode) {
                parent.removeChild(view.element);
            }

            return view;
        };
    };

    var IS_BROWSER = (function() {
        return typeof window !== 'undefined' && typeof window.document !== 'undefined';
    })();
    var isBrowser = function isBrowser() {
        return IS_BROWSER;
    };

    var testElement = isBrowser() ? createElement('svg') : {};
    var getChildCount =
        'children' in testElement
            ? function(el) {
                  return el.children.length;
              }
            : function(el) {
                  return el.childNodes.length;
              };

    var getViewRect = function getViewRect(elementRect, childViews, offset, scale) {
        var left = offset[0] || elementRect.left;
        var top = offset[1] || elementRect.top;
        var right = left + elementRect.width;
        var bottom = top + elementRect.height * (scale[1] || 1);

        var rect = {
            // the rectangle of the element itself
            element: Object.assign({}, elementRect),

            // the rectangle of the element expanded to contain its children, does not include any margins
            inner: {
                left: elementRect.left,
                top: elementRect.top,
                right: elementRect.right,
                bottom: elementRect.bottom,
            },

            // the rectangle of the element expanded to contain its children including own margin and child margins
            // margins will be added after we've recalculated the size
            outer: {
                left: left,
                top: top,
                right: right,
                bottom: bottom,
            },
        };

        // expand rect to fit all child rectangles
        childViews
            .filter(function(childView) {
                return !childView.isRectIgnored();
            })
            .map(function(childView) {
                return childView.rect;
            })
            .forEach(function(childViewRect) {
                expandRect(rect.inner, Object.assign({}, childViewRect.inner));
                expandRect(rect.outer, Object.assign({}, childViewRect.outer));
            });

        // calculate inner width and height
        calculateRectSize(rect.inner);

        // append additional margin (top and left margins are included in top and left automatically)
        rect.outer.bottom += rect.element.marginBottom;
        rect.outer.right += rect.element.marginRight;

        // calculate outer width and height
        calculateRectSize(rect.outer);

        return rect;
    };

    var expandRect = function expandRect(parent, child) {
        // adjust for parent offset
        child.top += parent.top;
        child.right += parent.left;
        child.bottom += parent.top;
        child.left += parent.left;

        if (child.bottom > parent.bottom) {
            parent.bottom = child.bottom;
        }

        if (child.right > parent.right) {
            parent.right = child.right;
        }
    };

    var calculateRectSize = function calculateRectSize(rect) {
        rect.width = rect.right - rect.left;
        rect.height = rect.bottom - rect.top;
    };

    var isNumber = function isNumber(value) {
        return typeof value === 'number';
    };

    /**
     * Determines if position is at destination
     * @param position
     * @param destination
     * @param velocity
     * @param errorMargin
     * @returns {boolean}
     */
    var thereYet = function thereYet(position, destination, velocity) {
        var errorMargin = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0.001;
        return Math.abs(position - destination) < errorMargin && Math.abs(velocity) < errorMargin;
    };

    /**
     * Spring animation
     */
    var spring =
        // default options
        function spring() // method definition
        {
            var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
                _ref$stiffness = _ref.stiffness,
                stiffness = _ref$stiffness === void 0 ? 0.5 : _ref$stiffness,
                _ref$damping = _ref.damping,
                damping = _ref$damping === void 0 ? 0.75 : _ref$damping,
                _ref$mass = _ref.mass,
                mass = _ref$mass === void 0 ? 10 : _ref$mass;
            var target = null;
            var position = null;
            var velocity = 0;
            var resting = false;

            // updates spring state
            var interpolate = function interpolate(ts, skipToEndState) {
                // in rest, don't animate
                if (resting) return;

                // need at least a target or position to do springy things
                if (!(isNumber(target) && isNumber(position))) {
                    resting = true;
                    velocity = 0;
                    return;
                }

                // calculate spring force
                var f = -(position - target) * stiffness;

                // update velocity by adding force based on mass
                velocity += f / mass;

                // update position by adding velocity
                position += velocity;

                // slow down based on amount of damping
                velocity *= damping;

                // we've arrived if we're near target and our velocity is near zero
                if (thereYet(position, target, velocity) || skipToEndState) {
                    position = target;
                    velocity = 0;
                    resting = true;

                    // we done
                    api.onupdate(position);
                    api.oncomplete(position);
                } else {
                    // progress update
                    api.onupdate(position);
                }
            };

            /**
             * Set new target value
             * @param value
             */
            var setTarget = function setTarget(value) {
                // if currently has no position, set target and position to this value
                if (isNumber(value) && !isNumber(position)) {
                    position = value;
                }

                // next target value will not be animated to
                if (target === null) {
                    target = value;
                    position = value;
                }

                // let start moving to target
                target = value;

                // already at target
                if (position === target || typeof target === 'undefined') {
                    // now resting as target is current position, stop moving
                    resting = true;
                    velocity = 0;

                    // done!
                    api.onupdate(position);
                    api.oncomplete(position);

                    return;
                }

                resting = false;
            };

            // need 'api' to call onupdate callback
            var api = createObject({
                interpolate: interpolate,
                target: {
                    set: setTarget,
                    get: function get() {
                        return target;
                    },
                },

                resting: {
                    get: function get() {
                        return resting;
                    },
                },

                onupdate: function onupdate(value) {},
                oncomplete: function oncomplete(value) {},
            });

            return api;
        };

    var easeLinear = function easeLinear(t) {
        return t;
    };
    var easeInOutQuad = function easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    };

    var tween =
        // default values
        function tween() // method definition
        {
            var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
                _ref$duration = _ref.duration,
                duration = _ref$duration === void 0 ? 500 : _ref$duration,
                _ref$easing = _ref.easing,
                easing = _ref$easing === void 0 ? easeInOutQuad : _ref$easing,
                _ref$delay = _ref.delay,
                delay = _ref$delay === void 0 ? 0 : _ref$delay;
            var start = null;
            var t;
            var p;
            var resting = true;
            var reverse = false;
            var target = null;

            var interpolate = function interpolate(ts, skipToEndState) {
                if (resting || target === null) return;

                if (start === null) {
                    start = ts;
                }

                if (ts - start < delay) return;

                t = ts - start - delay;

                if (t >= duration || skipToEndState) {
                    t = 1;
                    p = reverse ? 0 : 1;
                    api.onupdate(p * target);
                    api.oncomplete(p * target);
                    resting = true;
                } else {
                    p = t / duration;
                    api.onupdate((t >= 0 ? easing(reverse ? 1 - p : p) : 0) * target);
                }
            };

            // need 'api' to call onupdate callback
            var api = createObject({
                interpolate: interpolate,
                target: {
                    get: function get() {
                        return reverse ? 0 : target;
                    },
                    set: function set(value) {
                        // is initial value
                        if (target === null) {
                            target = value;
                            api.onupdate(value);
                            api.oncomplete(value);
                            return;
                        }

                        // want to tween to a smaller value and have a current value
                        if (value < target) {
                            target = 1;
                            reverse = true;
                        } else {
                            // not tweening to a smaller value
                            reverse = false;
                            target = value;
                        }

                        // let's go!
                        resting = false;
                        start = null;
                    },
                },

                resting: {
                    get: function get() {
                        return resting;
                    },
                },

                onupdate: function onupdate(value) {},
                oncomplete: function oncomplete(value) {},
            });

            return api;
        };

    var animator = {
        spring: spring,
        tween: tween,
    };

    /*
                       { type: 'spring', stiffness: .5, damping: .75, mass: 10 };
                       { translation: { type: 'spring', ... }, ... }
                       { translation: { x: { type: 'spring', ... } } }
                      */
    var createAnimator = function createAnimator(definition, category, property) {
        // default is single definition
        // we check if transform is set, if so, we check if property is set
        var def =
            definition[category] && typeof definition[category][property] === 'object'
                ? definition[category][property]
                : definition[category] || definition;

        var type = typeof def === 'string' ? def : def.type;
        var props = typeof def === 'object' ? Object.assign({}, def) : {};

        return animator[type] ? animator[type](props) : null;
    };

    var addGetSet = function addGetSet(keys, obj, props) {
        var overwrite = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
        obj = Array.isArray(obj) ? obj : [obj];
        obj.forEach(function(o) {
            keys.forEach(function(key) {
                var name = key;
                var getter = function getter() {
                    return props[key];
                };
                var setter = function setter(value) {
                    return (props[key] = value);
                };

                if (typeof key === 'object') {
                    name = key.key;
                    getter = key.getter || getter;
                    setter = key.setter || setter;
                }

                if (o[name] && !overwrite) {
                    return;
                }

                o[name] = {
                    get: getter,
                    set: setter,
                };
            });
        });
    };

    // add to state,
    // add getters and setters to internal and external api (if not set)
    // setup animators

    var animations = function animations(_ref) {
        var mixinConfig = _ref.mixinConfig,
            viewProps = _ref.viewProps,
            viewInternalAPI = _ref.viewInternalAPI,
            viewExternalAPI = _ref.viewExternalAPI;
        // initial properties
        var initialProps = Object.assign({}, viewProps);

        // list of all active animations
        var animations = [];

        // setup animators
        forin(mixinConfig, function(property, animation) {
            var animator = createAnimator(animation);
            if (!animator) {
                return;
            }

            // when the animator updates, update the view state value
            animator.onupdate = function(value) {
                viewProps[property] = value;
            };

            // set animator target
            animator.target = initialProps[property];

            // when value is set, set the animator target value
            var prop = {
                key: property,
                setter: function setter(value) {
                    // if already at target, we done!
                    if (animator.target === value) {
                        return;
                    }

                    animator.target = value;
                },
                getter: function getter() {
                    return viewProps[property];
                },
            };

            // add getters and setters
            addGetSet([prop], [viewInternalAPI, viewExternalAPI], viewProps, true);

            // add it to the list for easy updating from the _write method
            animations.push(animator);
        });

        // expose internal write api
        return {
            write: function write(ts) {
                var skipToEndState = document.hidden;
                var resting = true;
                animations.forEach(function(animation) {
                    if (!animation.resting) resting = false;
                    animation.interpolate(ts, skipToEndState);
                });
                return resting;
            },
            destroy: function destroy() {},
        };
    };

    var addEvent = function addEvent(element) {
        return function(type, fn) {
            element.addEventListener(type, fn);
        };
    };

    var removeEvent = function removeEvent(element) {
        return function(type, fn) {
            element.removeEventListener(type, fn);
        };
    };

    // mixin
    var listeners = function listeners(_ref) {
        var mixinConfig = _ref.mixinConfig,
            viewProps = _ref.viewProps,
            viewInternalAPI = _ref.viewInternalAPI,
            viewExternalAPI = _ref.viewExternalAPI,
            viewState = _ref.viewState,
            view = _ref.view;
        var events = [];

        var add = addEvent(view.element);
        var remove = removeEvent(view.element);

        viewExternalAPI.on = function(type, fn) {
            events.push({
                type: type,
                fn: fn,
            });

            add(type, fn);
        };

        viewExternalAPI.off = function(type, fn) {
            events.splice(
                events.findIndex(function(event) {
                    return event.type === type && event.fn === fn;
                }),
                1
            );

            remove(type, fn);
        };

        return {
            write: function write() {
                // not busy
                return true;
            },
            destroy: function destroy() {
                events.forEach(function(event) {
                    remove(event.type, event.fn);
                });
            },
        };
    };

    // add to external api and link to props

    var apis = function apis(_ref) {
        var mixinConfig = _ref.mixinConfig,
            viewProps = _ref.viewProps,
            viewExternalAPI = _ref.viewExternalAPI;
        addGetSet(mixinConfig, viewExternalAPI, viewProps);
    };

    var isDefined = function isDefined(value) {
        return value != null;
    };

    // add to state,
    // add getters and setters to internal and external api (if not set)
    // set initial state based on props in viewProps
    // apply as transforms each frame

    var defaults = {
        opacity: 1,
        scaleX: 1,
        scaleY: 1,
        translateX: 0,
        translateY: 0,
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0,
        originX: 0,
        originY: 0,
    };

    var styles = function styles(_ref) {
        var mixinConfig = _ref.mixinConfig,
            viewProps = _ref.viewProps,
            viewInternalAPI = _ref.viewInternalAPI,
            viewExternalAPI = _ref.viewExternalAPI,
            view = _ref.view;
        // initial props
        var initialProps = Object.assign({}, viewProps);

        // current props
        var currentProps = {};

        // we will add those properties to the external API and link them to the viewState
        addGetSet(mixinConfig, [viewInternalAPI, viewExternalAPI], viewProps);

        // override rect on internal and external rect getter so it takes in account transforms
        var getOffset = function getOffset() {
            return [viewProps['translateX'] || 0, viewProps['translateY'] || 0];
        };

        var getScale = function getScale() {
            return [viewProps['scaleX'] || 0, viewProps['scaleY'] || 0];
        };
        var getRect = function getRect() {
            return view.rect
                ? getViewRect(view.rect, view.childViews, getOffset(), getScale())
                : null;
        };
        viewInternalAPI.rect = { get: getRect };
        viewExternalAPI.rect = { get: getRect };

        // apply view props
        mixinConfig.forEach(function(key) {
            viewProps[key] =
                typeof initialProps[key] === 'undefined' ? defaults[key] : initialProps[key];
        });

        // expose api
        return {
            write: function write() {
                // see if props have changed
                if (!propsHaveChanged(currentProps, viewProps)) {
                    return;
                }

                // moves element to correct position on screen
                applyStyles(view.element, viewProps);

                // store new transforms
                Object.assign(currentProps, Object.assign({}, viewProps));

                // no longer busy
                return true;
            },
            destroy: function destroy() {},
        };
    };

    var propsHaveChanged = function propsHaveChanged(currentProps, newProps) {
        // different amount of keys
        if (Object.keys(currentProps).length !== Object.keys(newProps).length) {
            return true;
        }

        // lets analyze the individual props
        for (var prop in newProps) {
            if (newProps[prop] !== currentProps[prop]) {
                return true;
            }
        }

        return false;
    };

    var applyStyles = function applyStyles(element, _ref2) {
        var opacity = _ref2.opacity,
            perspective = _ref2.perspective,
            translateX = _ref2.translateX,
            translateY = _ref2.translateY,
            scaleX = _ref2.scaleX,
            scaleY = _ref2.scaleY,
            rotateX = _ref2.rotateX,
            rotateY = _ref2.rotateY,
            rotateZ = _ref2.rotateZ,
            originX = _ref2.originX,
            originY = _ref2.originY,
            width = _ref2.width,
            height = _ref2.height;

        var transforms = '';
        var styles = '';

        // handle transform origin
        if (isDefined(originX) || isDefined(originY)) {
            styles += 'transform-origin: ' + (originX || 0) + 'px ' + (originY || 0) + 'px;';
        }

        // transform order is relevant
        // 0. perspective
        if (isDefined(perspective)) {
            transforms += 'perspective(' + perspective + 'px) ';
        }

        // 1. translate
        if (isDefined(translateX) || isDefined(translateY)) {
            transforms +=
                'translate3d(' + (translateX || 0) + 'px, ' + (translateY || 0) + 'px, 0) ';
        }

        // 2. scale
        if (isDefined(scaleX) || isDefined(scaleY)) {
            transforms +=
                'scale3d(' +
                (isDefined(scaleX) ? scaleX : 1) +
                ', ' +
                (isDefined(scaleY) ? scaleY : 1) +
                ', 1) ';
        }

        // 3. rotate
        if (isDefined(rotateZ)) {
            transforms += 'rotateZ(' + rotateZ + 'rad) ';
        }

        if (isDefined(rotateX)) {
            transforms += 'rotateX(' + rotateX + 'rad) ';
        }

        if (isDefined(rotateY)) {
            transforms += 'rotateY(' + rotateY + 'rad) ';
        }

        // add transforms
        if (transforms.length) {
            styles += 'transform:' + transforms + ';';
        }

        // add opacity
        if (isDefined(opacity)) {
            styles += 'opacity:' + opacity + ';';

            // if we reach zero, we make the element inaccessible
            if (opacity === 0) {
                styles += 'visibility:hidden;';
            }

            // if we're below 100% opacity this element can't be clicked
            if (opacity < 1) {
                styles += 'pointer-events:none;';
            }
        }

        // add height
        if (isDefined(height)) {
            styles += 'height:' + height + 'px;';
        }

        // add width
        if (isDefined(width)) {
            styles += 'width:' + width + 'px;';
        }

        // apply styles
        var elementCurrentStyle = element.elementCurrentStyle || '';

        // if new styles does not match current styles, lets update!
        if (styles.length !== elementCurrentStyle.length || styles !== elementCurrentStyle) {
            element.style.cssText = styles;
            // store current styles so we can compare them to new styles later on
            // _not_ getting the style value is faster
            element.elementCurrentStyle = styles;
        }
    };

    var Mixins = {
        styles: styles,
        listeners: listeners,
        animations: animations,
        apis: apis,
    };

    var updateRect = function updateRect() {
        var rect = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var element = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var style = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        if (!element.layoutCalculated) {
            rect.paddingTop = parseInt(style.paddingTop, 10) || 0;
            rect.marginTop = parseInt(style.marginTop, 10) || 0;
            rect.marginRight = parseInt(style.marginRight, 10) || 0;
            rect.marginBottom = parseInt(style.marginBottom, 10) || 0;
            rect.marginLeft = parseInt(style.marginLeft, 10) || 0;
            element.layoutCalculated = true;
        }

        rect.left = element.offsetLeft || 0;
        rect.top = element.offsetTop || 0;
        rect.width = element.offsetWidth || 0;
        rect.height = element.offsetHeight || 0;

        rect.right = rect.left + rect.width;
        rect.bottom = rect.top + rect.height;

        rect.scrollTop = element.scrollTop;

        rect.hidden = element.offsetParent === null;

        return rect;
    };

    var createView =
        // default view definition
        function createView() {
            var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
                _ref$tag = _ref.tag,
                tag = _ref$tag === void 0 ? 'div' : _ref$tag,
                _ref$name = _ref.name,
                name = _ref$name === void 0 ? null : _ref$name,
                _ref$attributes = _ref.attributes,
                attributes = _ref$attributes === void 0 ? {} : _ref$attributes,
                _ref$read = _ref.read,
                read = _ref$read === void 0 ? function() {} : _ref$read,
                _ref$write = _ref.write,
                write = _ref$write === void 0 ? function() {} : _ref$write,
                _ref$create = _ref.create,
                create = _ref$create === void 0 ? function() {} : _ref$create,
                _ref$destroy = _ref.destroy,
                destroy = _ref$destroy === void 0 ? function() {} : _ref$destroy,
                _ref$filterFrameActio = _ref.filterFrameActionsForChild,
                filterFrameActionsForChild =
                    _ref$filterFrameActio === void 0
                        ? function(child, actions) {
                              return actions;
                          }
                        : _ref$filterFrameActio,
                _ref$didCreateView = _ref.didCreateView,
                didCreateView = _ref$didCreateView === void 0 ? function() {} : _ref$didCreateView,
                _ref$didWriteView = _ref.didWriteView,
                didWriteView = _ref$didWriteView === void 0 ? function() {} : _ref$didWriteView,
                _ref$ignoreRect = _ref.ignoreRect,
                ignoreRect = _ref$ignoreRect === void 0 ? false : _ref$ignoreRect,
                _ref$ignoreRectUpdate = _ref.ignoreRectUpdate,
                ignoreRectUpdate = _ref$ignoreRectUpdate === void 0 ? false : _ref$ignoreRectUpdate,
                _ref$mixins = _ref.mixins,
                mixins = _ref$mixins === void 0 ? [] : _ref$mixins;
            return function(
                // each view requires reference to store
                store
            ) {
                var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                // root element should not be changed
                var element = createElement(tag, 'filepond--' + name, attributes);

                // style reference should also not be changed
                var style = window.getComputedStyle(element, null);

                // element rectangle
                var rect = updateRect();
                var frameRect = null;

                // rest state
                var isResting = false;

                // pretty self explanatory
                var childViews = [];

                // loaded mixins
                var activeMixins = [];

                // references to created children
                var ref = {};

                // state used for each instance
                var state = {};

                // list of writers that will be called to update this view
                var writers = [
                    write, // default writer
                ];

                var readers = [
                    read, // default reader
                ];

                var destroyers = [
                    destroy, // default destroy
                ];

                // core view methods
                var getElement = function getElement() {
                    return element;
                };
                var getChildViews = function getChildViews() {
                    return childViews.concat();
                };
                var getReference = function getReference() {
                    return ref;
                };
                var createChildView = function createChildView(store) {
                    return function(view, props) {
                        return view(store, props);
                    };
                };
                var getRect = function getRect() {
                    if (frameRect) {
                        return frameRect;
                    }
                    frameRect = getViewRect(rect, childViews, [0, 0], [1, 1]);
                    return frameRect;
                };
                var getStyle = function getStyle() {
                    return style;
                };

                /**
                 * Read data from DOM
                 * @private
                 */
                var _read = function _read() {
                    frameRect = null;

                    // read child views
                    childViews.forEach(function(child) {
                        return child._read();
                    });

                    var shouldUpdate = !(ignoreRectUpdate && rect.width && rect.height);
                    if (shouldUpdate) {
                        updateRect(rect, element, style);
                    }

                    // readers
                    var api = { root: internalAPI, props: props, rect: rect };
                    readers.forEach(function(reader) {
                        return reader(api);
                    });
                };

                /**
                 * Write data to DOM
                 * @private
                 */
                var _write = function _write(ts, frameActions, shouldOptimize) {
                    // if no actions, we assume that the view is resting
                    var resting = frameActions.length === 0;

                    // writers
                    writers.forEach(function(writer) {
                        var writerResting = writer({
                            props: props,
                            root: internalAPI,
                            actions: frameActions,
                            timestamp: ts,
                            shouldOptimize: shouldOptimize,
                        });

                        if (writerResting === false) {
                            resting = false;
                        }
                    });

                    // run mixins
                    activeMixins.forEach(function(mixin) {
                        // if one of the mixins is still busy after write operation, we are not resting
                        var mixinResting = mixin.write(ts);
                        if (mixinResting === false) {
                            resting = false;
                        }
                    });

                    // updates child views that are currently attached to the DOM
                    childViews
                        .filter(function(child) {
                            return !!child.element.parentNode;
                        })
                        .forEach(function(child) {
                            // if a child view is not resting, we are not resting
                            var childResting = child._write(
                                ts,
                                filterFrameActionsForChild(child, frameActions),
                                shouldOptimize
                            );

                            if (!childResting) {
                                resting = false;
                            }
                        });

                    // append new elements to DOM and update those
                    childViews
                        //.filter(child => !child.element.parentNode)
                        .forEach(function(child, index) {
                            // skip
                            if (child.element.parentNode) {
                                return;
                            }

                            // append to DOM
                            internalAPI.appendChild(child.element, index);

                            // call read (need to know the size of these elements)
                            child._read();

                            // re-call write
                            child._write(
                                ts,
                                filterFrameActionsForChild(child, frameActions),
                                shouldOptimize
                            );

                            // we just added somthing to the dom, no rest
                            resting = false;
                        });

                    // update resting state
                    isResting = resting;

                    didWriteView({
                        props: props,
                        root: internalAPI,
                        actions: frameActions,
                        timestamp: ts,
                    });

                    // let parent know if we are resting
                    return resting;
                };

                var _destroy = function _destroy() {
                    activeMixins.forEach(function(mixin) {
                        return mixin.destroy();
                    });
                    destroyers.forEach(function(destroyer) {
                        destroyer({ root: internalAPI, props: props });
                    });
                    childViews.forEach(function(child) {
                        return child._destroy();
                    });
                };

                // sharedAPI
                var sharedAPIDefinition = {
                    element: {
                        get: getElement,
                    },

                    style: {
                        get: getStyle,
                    },

                    childViews: {
                        get: getChildViews,
                    },
                };

                // private API definition
                var internalAPIDefinition = Object.assign({}, sharedAPIDefinition, {
                    rect: {
                        get: getRect,
                    },

                    // access to custom children references
                    ref: {
                        get: getReference,
                    },

                    // dom modifiers
                    is: function is(needle) {
                        return name === needle;
                    },
                    appendChild: appendChild(element),
                    createChildView: createChildView(store),
                    linkView: function linkView(view) {
                        childViews.push(view);
                        return view;
                    },
                    unlinkView: function unlinkView(view) {
                        childViews.splice(childViews.indexOf(view), 1);
                    },
                    appendChildView: appendChildView(element, childViews),
                    removeChildView: removeChildView(element, childViews),
                    registerWriter: function registerWriter(writer) {
                        return writers.push(writer);
                    },
                    registerReader: function registerReader(reader) {
                        return readers.push(reader);
                    },
                    registerDestroyer: function registerDestroyer(destroyer) {
                        return destroyers.push(destroyer);
                    },
                    invalidateLayout: function invalidateLayout() {
                        return (element.layoutCalculated = false);
                    },

                    // access to data store
                    dispatch: store.dispatch,
                    query: store.query,
                });

                // public view API methods
                var externalAPIDefinition = {
                    element: {
                        get: getElement,
                    },

                    childViews: {
                        get: getChildViews,
                    },

                    rect: {
                        get: getRect,
                    },

                    resting: {
                        get: function get() {
                            return isResting;
                        },
                    },

                    isRectIgnored: function isRectIgnored() {
                        return ignoreRect;
                    },
                    _read: _read,
                    _write: _write,
                    _destroy: _destroy,
                };

                // mixin API methods
                var mixinAPIDefinition = Object.assign({}, sharedAPIDefinition, {
                    rect: {
                        get: function get() {
                            return rect;
                        },
                    },
                });

                // add mixin functionality
                Object.keys(mixins)
                    .sort(function(a, b) {
                        // move styles to the back of the mixin list (so adjustments of other mixins are applied to the props correctly)
                        if (a === 'styles') {
                            return 1;
                        } else if (b === 'styles') {
                            return -1;
                        }
                        return 0;
                    })
                    .forEach(function(key) {
                        var mixinAPI = Mixins[key]({
                            mixinConfig: mixins[key],
                            viewProps: props,
                            viewState: state,
                            viewInternalAPI: internalAPIDefinition,
                            viewExternalAPI: externalAPIDefinition,
                            view: createObject(mixinAPIDefinition),
                        });

                        if (mixinAPI) {
                            activeMixins.push(mixinAPI);
                        }
                    });

                // construct private api
                var internalAPI = createObject(internalAPIDefinition);

                // create the view
                create({
                    root: internalAPI,
                    props: props,
                });

                // append created child views to root node
                var childCount = getChildCount(element); // need to know the current child count so appending happens in correct order
                childViews.forEach(function(child, index) {
                    internalAPI.appendChild(child.element, childCount + index);
                });

                // call did create
                didCreateView(internalAPI);

                // expose public api
                return createObject(externalAPIDefinition);
            };
        };

    var createPainter = function createPainter(read, write) {
        var fps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 60;

        var name = '__framePainter';

        // set global painter
        if (window[name]) {
            window[name].readers.push(read);
            window[name].writers.push(write);
            return;
        }

        window[name] = {
            readers: [read],
            writers: [write],
        };

        var painter = window[name];

        var interval = 1000 / fps;
        var last = null;
        var id = null;
        var requestTick = null;
        var cancelTick = null;

        var setTimerType = function setTimerType() {
            if (document.hidden) {
                requestTick = function requestTick() {
                    return window.setTimeout(function() {
                        return tick(performance.now());
                    }, interval);
                };
                cancelTick = function cancelTick() {
                    return window.clearTimeout(id);
                };
            } else {
                requestTick = function requestTick() {
                    return window.requestAnimationFrame(tick);
                };
                cancelTick = function cancelTick() {
                    return window.cancelAnimationFrame(id);
                };
            }
        };

        document.addEventListener('visibilitychange', function() {
            if (cancelTick) cancelTick();
            setTimerType();
            tick(performance.now());
        });

        var tick = function tick(ts) {
            // queue next tick
            id = requestTick(tick);

            // limit fps
            if (!last) {
                last = ts;
            }

            var delta = ts - last;

            if (delta <= interval) {
                // skip frame
                return;
            }

            // align next frame
            last = ts - (delta % interval);

            // update view
            painter.readers.forEach(function(read) {
                return read();
            });
            painter.writers.forEach(function(write) {
                return write(ts);
            });
        };

        setTimerType();
        tick(performance.now());

        return {
            pause: function pause() {
                cancelTick(id);
            },
        };
    };

    var createRoute = function createRoute(routes, fn) {
        return function(_ref) {
            var root = _ref.root,
                props = _ref.props,
                _ref$actions = _ref.actions,
                actions = _ref$actions === void 0 ? [] : _ref$actions,
                timestamp = _ref.timestamp,
                shouldOptimize = _ref.shouldOptimize;
            actions
                .filter(function(action) {
                    return routes[action.type];
                })
                .forEach(function(action) {
                    return routes[action.type]({
                        root: root,
                        props: props,
                        action: action.data,
                        timestamp: timestamp,
                        shouldOptimize: shouldOptimize,
                    });
                });

            if (fn) {
                fn({
                    root: root,
                    props: props,
                    actions: actions,
                    timestamp: timestamp,
                    shouldOptimize: shouldOptimize,
                });
            }
        };
    };

    var insertBefore = function insertBefore(newNode, referenceNode) {
        return referenceNode.parentNode.insertBefore(newNode, referenceNode);
    };

    var insertAfter = function insertAfter(newNode, referenceNode) {
        return referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    };

    var isArray = function isArray(value) {
        return Array.isArray(value);
    };

    var isEmpty = function isEmpty(value) {
        return value == null;
    };

    var trim = function trim(str) {
        return str.trim();
    };

    var toString = function toString(value) {
        return '' + value;
    };

    var toArray = function toArray(value) {
        var splitter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ',';
        if (isEmpty(value)) {
            return [];
        }
        if (isArray(value)) {
            return value;
        }
        return toString(value)
            .split(splitter)
            .map(trim)
            .filter(function(str) {
                return str.length;
            });
    };

    var isBoolean = function isBoolean(value) {
        return typeof value === 'boolean';
    };

    var toBoolean = function toBoolean(value) {
        return isBoolean(value) ? value : value === 'true';
    };

    var isString = function isString(value) {
        return typeof value === 'string';
    };

    var toNumber = function toNumber(value) {
        return isNumber(value)
            ? value
            : isString(value)
            ? toString(value).replace(/[a-z]+/gi, '')
            : 0;
    };

    var toInt = function toInt(value) {
        return parseInt(toNumber(value), 10);
    };

    var toFloat = function toFloat(value) {
        return parseFloat(toNumber(value));
    };

    var isInt = function isInt(value) {
        return isNumber(value) && isFinite(value) && Math.floor(value) === value;
    };

    var toBytes = function toBytes(value) {
        var base = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1000;
        // is in bytes
        if (isInt(value)) {
            return value;
        }

        // is natural file size
        var naturalFileSize = toString(value).trim();

        // if is value in megabytes
        if (/MB$/i.test(naturalFileSize)) {
            naturalFileSize = naturalFileSize.replace(/MB$i/, '').trim();
            return toInt(naturalFileSize) * base * base;
        }

        // if is value in kilobytes
        if (/KB/i.test(naturalFileSize)) {
            naturalFileSize = naturalFileSize.replace(/KB$i/, '').trim();
            return toInt(naturalFileSize) * base;
        }

        return toInt(naturalFileSize);
    };

    var isFunction = function isFunction(value) {
        return typeof value === 'function';
    };

    var toFunctionReference = function toFunctionReference(string) {
        var ref = self;
        var levels = string.split('.');
        var level = null;
        while ((level = levels.shift())) {
            ref = ref[level];
            if (!ref) {
                return null;
            }
        }
        return ref;
    };

    var methods = {
        process: 'POST',
        patch: 'PATCH',
        revert: 'DELETE',
        fetch: 'GET',
        restore: 'GET',
        load: 'GET',
    };

    var createServerAPI = function createServerAPI(outline) {
        var api = {};

        api.url = isString(outline) ? outline : outline.url || '';
        api.timeout = outline.timeout ? parseInt(outline.timeout, 10) : 0;
        api.headers = outline.headers ? outline.headers : {};

        forin(methods, function(key) {
            api[key] = createAction(key, outline[key], methods[key], api.timeout, api.headers);
        });

        // remove process if no url or process on outline
        api.process = outline.process || isString(outline) || outline.url ? api.process : null;

        // special treatment for remove
        api.remove = outline.remove || null;

        // remove generic headers from api object
        delete api.headers;

        return api;
    };

    var createAction = function createAction(name, outline, method, timeout, headers) {
        // is explicitely set to null so disable
        if (outline === null) {
            return null;
        }

        // if is custom function, done! Dev handles everything.
        if (typeof outline === 'function') {
            return outline;
        }

        // build action object
        var action = {
            url: method === 'GET' || method === 'PATCH' ? '?' + name + '=' : '',
            method: method,
            headers: headers,
            withCredentials: false,
            timeout: timeout,
            onload: null,
            ondata: null,
            onerror: null,
        };

        // is a single url
        if (isString(outline)) {
            action.url = outline;
            return action;
        }

        // overwrite
        Object.assign(action, outline);

        // see if should reformat headers;
        if (isString(action.headers)) {
            var parts = action.headers.split(/:(.+)/);
            action.headers = {
                header: parts[0],
                value: parts[1],
            };
        }

        // if is bool withCredentials
        action.withCredentials = toBoolean(action.withCredentials);

        return action;
    };

    var toServerAPI = function toServerAPI(value) {
        return createServerAPI(value);
    };

    var isNull = function isNull(value) {
        return value === null;
    };

    var isObject = function isObject(value) {
        return typeof value === 'object' && value !== null;
    };

    var isAPI = function isAPI(value) {
        return (
            isObject(value) &&
            isString(value.url) &&
            isObject(value.process) &&
            isObject(value.revert) &&
            isObject(value.restore) &&
            isObject(value.fetch)
        );
    };

    var getType = function getType(value) {
        if (isArray(value)) {
            return 'array';
        }

        if (isNull(value)) {
            return 'null';
        }

        if (isInt(value)) {
            return 'int';
        }

        if (/^[0-9]+ ?(?:GB|MB|KB)$/gi.test(value)) {
            return 'bytes';
        }

        if (isAPI(value)) {
            return 'api';
        }

        return typeof value;
    };

    var replaceSingleQuotes = function replaceSingleQuotes(str) {
        return str
            .replace(/{\s*'/g, '{"')
            .replace(/'\s*}/g, '"}')
            .replace(/'\s*:/g, '":')
            .replace(/:\s*'/g, ':"')
            .replace(/,\s*'/g, ',"')
            .replace(/'\s*,/g, '",');
    };

    var conversionTable = {
        array: toArray,
        boolean: toBoolean,
        int: function int(value) {
            return getType(value) === 'bytes' ? toBytes(value) : toInt(value);
        },
        number: toFloat,
        float: toFloat,
        bytes: toBytes,
        string: function string(value) {
            return isFunction(value) ? value : toString(value);
        },
        function: function _function(value) {
            return toFunctionReference(value);
        },
        serverapi: toServerAPI,
        object: function object(value) {
            try {
                return JSON.parse(replaceSingleQuotes(value));
            } catch (e) {
                return null;
            }
        },
    };

    var convertTo = function convertTo(value, type) {
        return conversionTable[type](value);
    };

    var getValueByType = function getValueByType(newValue, defaultValue, valueType) {
        // can always assign default value
        if (newValue === defaultValue) {
            return newValue;
        }

        // get the type of the new value
        var newValueType = getType(newValue);

        // is valid type?
        if (newValueType !== valueType) {
            // is string input, let's attempt to convert
            var convertedValue = convertTo(newValue, valueType);

            // what is the type now
            newValueType = getType(convertedValue);

            // no valid conversions found
            if (convertedValue === null) {
                throw 'Trying to assign value with incorrect type to "' +
                    option +
                    '", allowed type: "' +
                    valueType +
                    '"';
            } else {
                newValue = convertedValue;
            }
        }

        // assign new value
        return newValue;
    };

    var createOption = function createOption(defaultValue, valueType) {
        var currentValue = defaultValue;
        return {
            enumerable: true,
            get: function get() {
                return currentValue;
            },
            set: function set(newValue) {
                currentValue = getValueByType(newValue, defaultValue, valueType);
            },
        };
    };

    var createOptions = function createOptions(options) {
        var obj = {};
        forin(options, function(prop) {
            var optionDefinition = options[prop];
            obj[prop] = createOption(optionDefinition[0], optionDefinition[1]);
        });
        return createObject(obj);
    };

    var createInitialState = function createInitialState(options) {
        return {
            // model
            items: [],

            // timeout used for calling update items
            listUpdateTimeout: null,

            // timeout used for stacking metadata updates
            itemUpdateTimeout: null,

            // queue of items waiting to be processed
            processingQueue: [],

            // options
            options: createOptions(options),
        };
    };

    var fromCamels = function fromCamels(string) {
        var separator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '-';
        return string
            .split(/(?=[A-Z])/)
            .map(function(part) {
                return part.toLowerCase();
            })
            .join(separator);
    };

    var createOptionAPI = function createOptionAPI(store, options) {
        var obj = {};
        forin(options, function(key) {
            obj[key] = {
                get: function get() {
                    return store.getState().options[key];
                },
                set: function set(value) {
                    store.dispatch('SET_' + fromCamels(key, '_').toUpperCase(), {
                        value: value,
                    });
                },
            };
        });
        return obj;
    };

    var createOptionActions = function createOptionActions(options) {
        return function(dispatch, query, state) {
            var obj = {};
            forin(options, function(key) {
                var name = fromCamels(key, '_').toUpperCase();

                obj['SET_' + name] = function(action) {
                    try {
                        state.options[key] = action.value;
                    } catch (e) {} // nope, failed

                    // we successfully set the value of this option
                    dispatch('DID_SET_' + name, { value: state.options[key] });
                };
            });
            return obj;
        };
    };

    var createOptionQueries = function createOptionQueries(options) {
        return function(state) {
            var obj = {};
            forin(options, function(key) {
                obj['GET_' + fromCamels(key, '_').toUpperCase()] = function(action) {
                    return state.options[key];
                };
            });
            return obj;
        };
    };

    var InteractionMethod = {
        API: 1,
        DROP: 2,
        BROWSE: 3,
        PASTE: 4,
        NONE: 5,
    };

    var getUniqueId = function getUniqueId() {
        return Math.random()
            .toString(36)
            .substring(2, 11);
    };

    function _typeof(obj) {
        if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
            _typeof = function(obj) {
                return typeof obj;
            };
        } else {
            _typeof = function(obj) {
                return obj &&
                    typeof Symbol === 'function' &&
                    obj.constructor === Symbol &&
                    obj !== Symbol.prototype
                    ? 'symbol'
                    : typeof obj;
            };
        }

        return _typeof(obj);
    }

    var REACT_ELEMENT_TYPE;

    function _jsx(type, props, key, children) {
        if (!REACT_ELEMENT_TYPE) {
            REACT_ELEMENT_TYPE =
                (typeof Symbol === 'function' && Symbol['for'] && Symbol['for']('react.element')) ||
                0xeac7;
        }

        var defaultProps = type && type.defaultProps;
        var childrenLength = arguments.length - 3;

        if (!props && childrenLength !== 0) {
            props = {
                children: void 0,
            };
        }

        if (props && defaultProps) {
            for (var propName in defaultProps) {
                if (props[propName] === void 0) {
                    props[propName] = defaultProps[propName];
                }
            }
        } else if (!props) {
            props = defaultProps || {};
        }

        if (childrenLength === 1) {
            props.children = children;
        } else if (childrenLength > 1) {
            var childArray = new Array(childrenLength);

            for (var i = 0; i < childrenLength; i++) {
                childArray[i] = arguments[i + 3];
            }

            props.children = childArray;
        }

        return {
            $$typeof: REACT_ELEMENT_TYPE,
            type: type,
            key: key === undefined ? null : '' + key,
            ref: null,
            props: props,
            _owner: null,
        };
    }

    function _asyncIterator(iterable) {
        var method;

        if (typeof Symbol !== 'undefined') {
            if (Symbol.asyncIterator) {
                method = iterable[Symbol.asyncIterator];
                if (method != null) return method.call(iterable);
            }

            if (Symbol.iterator) {
                method = iterable[Symbol.iterator];
                if (method != null) return method.call(iterable);
            }
        }

        throw new TypeError('Object is not async iterable');
    }

    function _AwaitValue(value) {
        this.wrapped = value;
    }

    function _AsyncGenerator(gen) {
        var front, back;

        function send(key, arg) {
            return new Promise(function(resolve, reject) {
                var request = {
                    key: key,
                    arg: arg,
                    resolve: resolve,
                    reject: reject,
                    next: null,
                };

                if (back) {
                    back = back.next = request;
                } else {
                    front = back = request;
                    resume(key, arg);
                }
            });
        }

        function resume(key, arg) {
            try {
                var result = gen[key](arg);
                var value = result.value;
                var wrappedAwait = value instanceof _AwaitValue;
                Promise.resolve(wrappedAwait ? value.wrapped : value).then(
                    function(arg) {
                        if (wrappedAwait) {
                            resume('next', arg);
                            return;
                        }

                        settle(result.done ? 'return' : 'normal', arg);
                    },
                    function(err) {
                        resume('throw', err);
                    }
                );
            } catch (err) {
                settle('throw', err);
            }
        }

        function settle(type, value) {
            switch (type) {
                case 'return':
                    front.resolve({
                        value: value,
                        done: true,
                    });
                    break;

                case 'throw':
                    front.reject(value);
                    break;

                default:
                    front.resolve({
                        value: value,
                        done: false,
                    });
                    break;
            }

            front = front.next;

            if (front) {
                resume(front.key, front.arg);
            } else {
                back = null;
            }
        }

        this._invoke = send;

        if (typeof gen.return !== 'function') {
            this.return = undefined;
        }
    }

    if (typeof Symbol === 'function' && Symbol.asyncIterator) {
        _AsyncGenerator.prototype[Symbol.asyncIterator] = function() {
            return this;
        };
    }

    _AsyncGenerator.prototype.next = function(arg) {
        return this._invoke('next', arg);
    };

    _AsyncGenerator.prototype.throw = function(arg) {
        return this._invoke('throw', arg);
    };

    _AsyncGenerator.prototype.return = function(arg) {
        return this._invoke('return', arg);
    };

    function _wrapAsyncGenerator(fn) {
        return function() {
            return new _AsyncGenerator(fn.apply(this, arguments));
        };
    }

    function _awaitAsyncGenerator(value) {
        return new _AwaitValue(value);
    }

    function _asyncGeneratorDelegate(inner, awaitWrap) {
        var iter = {},
            waiting = false;

        function pump(key, value) {
            waiting = true;
            value = new Promise(function(resolve) {
                resolve(inner[key](value));
            });
            return {
                done: false,
                value: awaitWrap(value),
            };
        }

        if (typeof Symbol === 'function' && Symbol.iterator) {
            iter[Symbol.iterator] = function() {
                return this;
            };
        }

        iter.next = function(value) {
            if (waiting) {
                waiting = false;
                return value;
            }

            return pump('next', value);
        };

        if (typeof inner.throw === 'function') {
            iter.throw = function(value) {
                if (waiting) {
                    waiting = false;
                    throw value;
                }

                return pump('throw', value);
            };
        }

        if (typeof inner.return === 'function') {
            iter.return = function(value) {
                return pump('return', value);
            };
        }

        return iter;
    }

    function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
        try {
            var info = gen[key](arg);
            var value = info.value;
        } catch (error) {
            reject(error);
            return;
        }

        if (info.done) {
            resolve(value);
        } else {
            Promise.resolve(value).then(_next, _throw);
        }
    }

    function _asyncToGenerator(fn) {
        return function() {
            var self = this,
                args = arguments;
            return new Promise(function(resolve, reject) {
                var gen = fn.apply(self, args);

                function _next(value) {
                    asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'next', value);
                }

                function _throw(err) {
                    asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'throw', err);
                }

                _next(undefined);
            });
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError('Cannot call a class as a function');
        }
    }

    function _defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ('value' in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }

    function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps) _defineProperties(Constructor.prototype, protoProps);
        if (staticProps) _defineProperties(Constructor, staticProps);
        return Constructor;
    }

    function _defineEnumerableProperties(obj, descs) {
        for (var key in descs) {
            var desc = descs[key];
            desc.configurable = desc.enumerable = true;
            if ('value' in desc) desc.writable = true;
            Object.defineProperty(obj, key, desc);
        }

        if (Object.getOwnPropertySymbols) {
            var objectSymbols = Object.getOwnPropertySymbols(descs);

            for (var i = 0; i < objectSymbols.length; i++) {
                var sym = objectSymbols[i];
                var desc = descs[sym];
                desc.configurable = desc.enumerable = true;
                if ('value' in desc) desc.writable = true;
                Object.defineProperty(obj, sym, desc);
            }
        }

        return obj;
    }

    function _defaults(obj, defaults) {
        var keys = Object.getOwnPropertyNames(defaults);

        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var value = Object.getOwnPropertyDescriptor(defaults, key);

            if (value && value.configurable && obj[key] === undefined) {
                Object.defineProperty(obj, key, value);
            }
        }

        return obj;
    }

    function _defineProperty(obj, key, value) {
        if (key in obj) {
            Object.defineProperty(obj, key, {
                value: value,
                enumerable: true,
                configurable: true,
                writable: true,
            });
        } else {
            obj[key] = value;
        }

        return obj;
    }

    function _extends() {
        _extends =
            Object.assign ||
            function(target) {
                for (var i = 1; i < arguments.length; i++) {
                    var source = arguments[i];

                    for (var key in source) {
                        if (Object.prototype.hasOwnProperty.call(source, key)) {
                            target[key] = source[key];
                        }
                    }
                }

                return target;
            };

        return _extends.apply(this, arguments);
    }

    function _objectSpread(target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i] != null ? arguments[i] : {};
            var ownKeys = Object.keys(source);

            if (typeof Object.getOwnPropertySymbols === 'function') {
                ownKeys = ownKeys.concat(
                    Object.getOwnPropertySymbols(source).filter(function(sym) {
                        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
                    })
                );
            }

            ownKeys.forEach(function(key) {
                _defineProperty(target, key, source[key]);
            });
        }

        return target;
    }

    function ownKeys(object, enumerableOnly) {
        var keys = Object.keys(object);

        if (Object.getOwnPropertySymbols) {
            var symbols = Object.getOwnPropertySymbols(object);
            if (enumerableOnly)
                symbols = symbols.filter(function(sym) {
                    return Object.getOwnPropertyDescriptor(object, sym).enumerable;
                });
            keys.push.apply(keys, symbols);
        }

        return keys;
    }

    function _objectSpread2(target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i] != null ? arguments[i] : {};

            if (i % 2) {
                ownKeys(source, true).forEach(function(key) {
                    _defineProperty(target, key, source[key]);
                });
            } else if (Object.getOwnPropertyDescriptors) {
                Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
            } else {
                ownKeys(source).forEach(function(key) {
                    Object.defineProperty(
                        target,
                        key,
                        Object.getOwnPropertyDescriptor(source, key)
                    );
                });
            }
        }

        return target;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== 'function' && superClass !== null) {
            throw new TypeError('Super expression must either be null or a function');
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                writable: true,
                configurable: true,
            },
        });
        if (superClass) _setPrototypeOf(subClass, superClass);
    }

    function _inheritsLoose(subClass, superClass) {
        subClass.prototype = Object.create(superClass.prototype);
        subClass.prototype.constructor = subClass;
        subClass.__proto__ = superClass;
    }

    function _getPrototypeOf(o) {
        _getPrototypeOf = Object.setPrototypeOf
            ? Object.getPrototypeOf
            : function _getPrototypeOf(o) {
                  return o.__proto__ || Object.getPrototypeOf(o);
              };
        return _getPrototypeOf(o);
    }

    function _setPrototypeOf(o, p) {
        _setPrototypeOf =
            Object.setPrototypeOf ||
            function _setPrototypeOf(o, p) {
                o.__proto__ = p;
                return o;
            };

        return _setPrototypeOf(o, p);
    }

    function isNativeReflectConstruct() {
        if (typeof Reflect === 'undefined' || !Reflect.construct) return false;
        if (Reflect.construct.sham) return false;
        if (typeof Proxy === 'function') return true;

        try {
            Date.prototype.toString.call(Reflect.construct(Date, [], function() {}));
            return true;
        } catch (e) {
            return false;
        }
    }

    function _construct(Parent, args, Class) {
        if (isNativeReflectConstruct()) {
            _construct = Reflect.construct;
        } else {
            _construct = function _construct(Parent, args, Class) {
                var a = [null];
                a.push.apply(a, args);
                var Constructor = Function.bind.apply(Parent, a);
                var instance = new Constructor();
                if (Class) _setPrototypeOf(instance, Class.prototype);
                return instance;
            };
        }

        return _construct.apply(null, arguments);
    }

    function _isNativeFunction(fn) {
        return Function.toString.call(fn).indexOf('[native code]') !== -1;
    }

    function _wrapNativeSuper(Class) {
        var _cache = typeof Map === 'function' ? new Map() : undefined;

        _wrapNativeSuper = function _wrapNativeSuper(Class) {
            if (Class === null || !_isNativeFunction(Class)) return Class;

            if (typeof Class !== 'function') {
                throw new TypeError('Super expression must either be null or a function');
            }

            if (typeof _cache !== 'undefined') {
                if (_cache.has(Class)) return _cache.get(Class);

                _cache.set(Class, Wrapper);
            }

            function Wrapper() {
                return _construct(Class, arguments, _getPrototypeOf(this).constructor);
            }

            Wrapper.prototype = Object.create(Class.prototype, {
                constructor: {
                    value: Wrapper,
                    enumerable: false,
                    writable: true,
                    configurable: true,
                },
            });
            return _setPrototypeOf(Wrapper, Class);
        };

        return _wrapNativeSuper(Class);
    }

    function _instanceof(left, right) {
        if (right != null && typeof Symbol !== 'undefined' && right[Symbol.hasInstance]) {
            return !!right[Symbol.hasInstance](left);
        } else {
            return left instanceof right;
        }
    }

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule
            ? obj
            : {
                  default: obj,
              };
    }

    function _interopRequireWildcard(obj) {
        if (obj && obj.__esModule) {
            return obj;
        } else {
            var newObj = {};

            if (obj != null) {
                for (var key in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, key)) {
                        var desc =
                            Object.defineProperty && Object.getOwnPropertyDescriptor
                                ? Object.getOwnPropertyDescriptor(obj, key)
                                : {};

                        if (desc.get || desc.set) {
                            Object.defineProperty(newObj, key, desc);
                        } else {
                            newObj[key] = obj[key];
                        }
                    }
                }
            }

            newObj.default = obj;
            return newObj;
        }
    }

    function _newArrowCheck(innerThis, boundThis) {
        if (innerThis !== boundThis) {
            throw new TypeError('Cannot instantiate an arrow function');
        }
    }

    function _objectDestructuringEmpty(obj) {
        if (obj == null) throw new TypeError('Cannot destructure undefined');
    }

    function _objectWithoutPropertiesLoose(source, excluded) {
        if (source == null) return {};
        var target = {};
        var sourceKeys = Object.keys(source);
        var key, i;

        for (i = 0; i < sourceKeys.length; i++) {
            key = sourceKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            target[key] = source[key];
        }

        return target;
    }

    function _objectWithoutProperties(source, excluded) {
        if (source == null) return {};

        var target = _objectWithoutPropertiesLoose(source, excluded);

        var key, i;

        if (Object.getOwnPropertySymbols) {
            var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

            for (i = 0; i < sourceSymbolKeys.length; i++) {
                key = sourceSymbolKeys[i];
                if (excluded.indexOf(key) >= 0) continue;
                if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
                target[key] = source[key];
            }
        }

        return target;
    }

    function _assertThisInitialized(self) {
        if (self === void 0) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return self;
    }

    function _possibleConstructorReturn(self, call) {
        if (call && (typeof call === 'object' || typeof call === 'function')) {
            return call;
        }

        return _assertThisInitialized(self);
    }

    function _superPropBase(object, property) {
        while (!Object.prototype.hasOwnProperty.call(object, property)) {
            object = _getPrototypeOf(object);
            if (object === null) break;
        }

        return object;
    }

    function _get(target, property, receiver) {
        if (typeof Reflect !== 'undefined' && Reflect.get) {
            _get = Reflect.get;
        } else {
            _get = function _get(target, property, receiver) {
                var base = _superPropBase(target, property);

                if (!base) return;
                var desc = Object.getOwnPropertyDescriptor(base, property);

                if (desc.get) {
                    return desc.get.call(receiver);
                }

                return desc.value;
            };
        }

        return _get(target, property, receiver || target);
    }

    function set(target, property, value, receiver) {
        if (typeof Reflect !== 'undefined' && Reflect.set) {
            set = Reflect.set;
        } else {
            set = function set(target, property, value, receiver) {
                var base = _superPropBase(target, property);

                var desc;

                if (base) {
                    desc = Object.getOwnPropertyDescriptor(base, property);

                    if (desc.set) {
                        desc.set.call(receiver, value);
                        return true;
                    } else if (!desc.writable) {
                        return false;
                    }
                }

                desc = Object.getOwnPropertyDescriptor(receiver, property);

                if (desc) {
                    if (!desc.writable) {
                        return false;
                    }

                    desc.value = value;
                    Object.defineProperty(receiver, property, desc);
                } else {
                    _defineProperty(receiver, property, value);
                }

                return true;
            };
        }

        return set(target, property, value, receiver);
    }

    function _set(target, property, value, receiver, isStrict) {
        var s = set(target, property, value, receiver || target);

        if (!s && isStrict) {
            throw new Error('failed to set property');
        }

        return value;
    }

    function _taggedTemplateLiteral(strings, raw) {
        if (!raw) {
            raw = strings.slice(0);
        }

        return Object.freeze(
            Object.defineProperties(strings, {
                raw: {
                    value: Object.freeze(raw),
                },
            })
        );
    }

    function _taggedTemplateLiteralLoose(strings, raw) {
        if (!raw) {
            raw = strings.slice(0);
        }

        strings.raw = raw;
        return strings;
    }

    function _temporalRef(val, name) {
        if (val === _temporalUndefined) {
            throw new ReferenceError(name + ' is not defined - temporal dead zone');
        } else {
            return val;
        }
    }

    function _readOnlyError(name) {
        throw new Error('"' + name + '" is read-only');
    }

    function _classNameTDZError(name) {
        throw new Error('Class "' + name + '" cannot be referenced in computed property keys.');
    }

    var _temporalUndefined = {};

    function _slicedToArray(arr, i) {
        return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
    }

    function _slicedToArrayLoose(arr, i) {
        return _arrayWithHoles(arr) || _iterableToArrayLimitLoose(arr, i) || _nonIterableRest();
    }

    function _toArray(arr) {
        return _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest();
    }

    function _toConsumableArray(arr) {
        return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
    }

    function _arrayWithoutHoles(arr) {
        if (Array.isArray(arr)) {
            for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

            return arr2;
        }
    }

    function _arrayWithHoles(arr) {
        if (Array.isArray(arr)) return arr;
    }

    function _iterableToArray(iter) {
        if (
            Symbol.iterator in Object(iter) ||
            Object.prototype.toString.call(iter) === '[object Arguments]'
        )
            return Array.from(iter);
    }

    function _iterableToArrayLimit(arr, i) {
        var _arr = [];
        var _n = true;
        var _d = false;
        var _e = undefined;

        try {
            for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                _arr.push(_s.value);

                if (i && _arr.length === i) break;
            }
        } catch (err) {
            _d = true;
            _e = err;
        } finally {
            try {
                if (!_n && _i['return'] != null) _i['return']();
            } finally {
                if (_d) throw _e;
            }
        }

        return _arr;
    }

    function _iterableToArrayLimitLoose(arr, i) {
        var _arr = [];

        for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done; ) {
            _arr.push(_step.value);

            if (i && _arr.length === i) break;
        }

        return _arr;
    }

    function _nonIterableSpread() {
        throw new TypeError('Invalid attempt to spread non-iterable instance');
    }

    function _nonIterableRest() {
        throw new TypeError('Invalid attempt to destructure non-iterable instance');
    }

    function _skipFirstGeneratorNext(fn) {
        return function() {
            var it = fn.apply(this, arguments);
            it.next();
            return it;
        };
    }

    function _toPrimitive(input, hint) {
        if (typeof input !== 'object' || input === null) return input;
        var prim = input[Symbol.toPrimitive];

        if (prim !== undefined) {
            var res = prim.call(input, hint || 'default');
            if (typeof res !== 'object') return res;
            throw new TypeError('@@toPrimitive must return a primitive value.');
        }

        return (hint === 'string' ? String : Number)(input);
    }

    function _toPropertyKey(arg) {
        var key = _toPrimitive(arg, 'string');

        return typeof key === 'symbol' ? key : String(key);
    }

    function _initializerWarningHelper(descriptor, context) {
        throw new Error(
            'Decorating class property failed. Please ensure that ' +
                'proposal-class-properties is enabled and set to use loose mode. ' +
                'To use proposal-class-properties in spec mode with decorators, wait for ' +
                'the next major version of decorators in stage 2.'
        );
    }

    function _initializerDefineProperty(target, property, descriptor, context) {
        if (!descriptor) return;
        Object.defineProperty(target, property, {
            enumerable: descriptor.enumerable,
            configurable: descriptor.configurable,
            writable: descriptor.writable,
            value: descriptor.initializer ? descriptor.initializer.call(context) : void 0,
        });
    }

    function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
        var desc = {};
        Object.keys(descriptor).forEach(function(key) {
            desc[key] = descriptor[key];
        });
        desc.enumerable = !!desc.enumerable;
        desc.configurable = !!desc.configurable;

        if ('value' in desc || desc.initializer) {
            desc.writable = true;
        }

        desc = decorators
            .slice()
            .reverse()
            .reduce(function(desc, decorator) {
                return decorator(target, property, desc) || desc;
            }, desc);

        if (context && desc.initializer !== void 0) {
            desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
            desc.initializer = undefined;
        }

        if (desc.initializer === void 0) {
            Object.defineProperty(target, property, desc);
            desc = null;
        }

        return desc;
    }

    var id = 0;

    function _classPrivateFieldLooseKey(name) {
        return '__private_' + id++ + '_' + name;
    }

    function _classPrivateFieldLooseBase(receiver, privateKey) {
        if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) {
            throw new TypeError('attempted to use private field on non-instance');
        }

        return receiver;
    }

    function _classPrivateFieldGet(receiver, privateMap) {
        var descriptor = privateMap.get(receiver);

        if (!descriptor) {
            throw new TypeError('attempted to get private field on non-instance');
        }

        if (descriptor.get) {
            return descriptor.get.call(receiver);
        }

        return descriptor.value;
    }

    function _classPrivateFieldSet(receiver, privateMap, value) {
        var descriptor = privateMap.get(receiver);

        if (!descriptor) {
            throw new TypeError('attempted to set private field on non-instance');
        }

        if (descriptor.set) {
            descriptor.set.call(receiver, value);
        } else {
            if (!descriptor.writable) {
                throw new TypeError('attempted to set read only private field');
            }

            descriptor.value = value;
        }

        return value;
    }

    function _classPrivateFieldDestructureSet(receiver, privateMap) {
        if (!privateMap.has(receiver)) {
            throw new TypeError('attempted to set private field on non-instance');
        }

        var descriptor = privateMap.get(receiver);

        if (descriptor.set) {
            if (!('__destrObj' in descriptor)) {
                descriptor.__destrObj = {
                    set value(v) {
                        descriptor.set.call(receiver, v);
                    },
                };
            }

            return descriptor.__destrObj;
        } else {
            if (!descriptor.writable) {
                throw new TypeError('attempted to set read only private field');
            }

            return descriptor;
        }
    }

    function _classStaticPrivateFieldSpecGet(receiver, classConstructor, descriptor) {
        if (receiver !== classConstructor) {
            throw new TypeError('Private static access of wrong provenance');
        }

        return descriptor.value;
    }

    function _classStaticPrivateFieldSpecSet(receiver, classConstructor, descriptor, value) {
        if (receiver !== classConstructor) {
            throw new TypeError('Private static access of wrong provenance');
        }

        if (!descriptor.writable) {
            throw new TypeError('attempted to set read only private field');
        }

        descriptor.value = value;
        return value;
    }

    function _classStaticPrivateMethodGet(receiver, classConstructor, method) {
        if (receiver !== classConstructor) {
            throw new TypeError('Private static access of wrong provenance');
        }

        return method;
    }

    function _classStaticPrivateMethodSet() {
        throw new TypeError('attempted to set read only static private field');
    }

    function _decorate(decorators, factory, superClass, mixins) {
        var api = _getDecoratorsApi();

        if (mixins) {
            for (var i = 0; i < mixins.length; i++) {
                api = mixins[i](api);
            }
        }

        var r = factory(function initialize(O) {
            api.initializeInstanceElements(O, decorated.elements);
        }, superClass);
        var decorated = api.decorateClass(
            _coalesceClassElements(r.d.map(_createElementDescriptor)),
            decorators
        );
        api.initializeClassElements(r.F, decorated.elements);
        return api.runClassFinishers(r.F, decorated.finishers);
    }

    function _getDecoratorsApi() {
        _getDecoratorsApi = function() {
            return api;
        };

        var api = {
            elementsDefinitionOrder: [['method'], ['field']],
            initializeInstanceElements: function(O, elements) {
                ['method', 'field'].forEach(function(kind) {
                    elements.forEach(function(element) {
                        if (element.kind === kind && element.placement === 'own') {
                            this.defineClassElement(O, element);
                        }
                    }, this);
                }, this);
            },
            initializeClassElements: function(F, elements) {
                var proto = F.prototype;
                ['method', 'field'].forEach(function(kind) {
                    elements.forEach(function(element) {
                        var placement = element.placement;

                        if (
                            element.kind === kind &&
                            (placement === 'static' || placement === 'prototype')
                        ) {
                            var receiver = placement === 'static' ? F : proto;
                            this.defineClassElement(receiver, element);
                        }
                    }, this);
                }, this);
            },
            defineClassElement: function(receiver, element) {
                var descriptor = element.descriptor;

                if (element.kind === 'field') {
                    var initializer = element.initializer;
                    descriptor = {
                        enumerable: descriptor.enumerable,
                        writable: descriptor.writable,
                        configurable: descriptor.configurable,
                        value: initializer === void 0 ? void 0 : initializer.call(receiver),
                    };
                }

                Object.defineProperty(receiver, element.key, descriptor);
            },
            decorateClass: function(elements, decorators) {
                var newElements = [];
                var finishers = [];
                var placements = {
                    static: [],
                    prototype: [],
                    own: [],
                };
                elements.forEach(function(element) {
                    this.addElementPlacement(element, placements);
                }, this);
                elements.forEach(function(element) {
                    if (!_hasDecorators(element)) return newElements.push(element);
                    var elementFinishersExtras = this.decorateElement(element, placements);
                    newElements.push(elementFinishersExtras.element);
                    newElements.push.apply(newElements, elementFinishersExtras.extras);
                    finishers.push.apply(finishers, elementFinishersExtras.finishers);
                }, this);

                if (!decorators) {
                    return {
                        elements: newElements,
                        finishers: finishers,
                    };
                }

                var result = this.decorateConstructor(newElements, decorators);
                finishers.push.apply(finishers, result.finishers);
                result.finishers = finishers;
                return result;
            },
            addElementPlacement: function(element, placements, silent) {
                var keys = placements[element.placement];

                if (!silent && keys.indexOf(element.key) !== -1) {
                    throw new TypeError('Duplicated element (' + element.key + ')');
                }

                keys.push(element.key);
            },
            decorateElement: function(element, placements) {
                var extras = [];
                var finishers = [];

                for (var decorators = element.decorators, i = decorators.length - 1; i >= 0; i--) {
                    var keys = placements[element.placement];
                    keys.splice(keys.indexOf(element.key), 1);
                    var elementObject = this.fromElementDescriptor(element);
                    var elementFinisherExtras = this.toElementFinisherExtras(
                        (0, decorators[i])(elementObject) || elementObject
                    );
                    element = elementFinisherExtras.element;
                    this.addElementPlacement(element, placements);

                    if (elementFinisherExtras.finisher) {
                        finishers.push(elementFinisherExtras.finisher);
                    }

                    var newExtras = elementFinisherExtras.extras;

                    if (newExtras) {
                        for (var j = 0; j < newExtras.length; j++) {
                            this.addElementPlacement(newExtras[j], placements);
                        }

                        extras.push.apply(extras, newExtras);
                    }
                }

                return {
                    element: element,
                    finishers: finishers,
                    extras: extras,
                };
            },
            decorateConstructor: function(elements, decorators) {
                var finishers = [];

                for (var i = decorators.length - 1; i >= 0; i--) {
                    var obj = this.fromClassDescriptor(elements);
                    var elementsAndFinisher = this.toClassDescriptor(
                        (0, decorators[i])(obj) || obj
                    );

                    if (elementsAndFinisher.finisher !== undefined) {
                        finishers.push(elementsAndFinisher.finisher);
                    }

                    if (elementsAndFinisher.elements !== undefined) {
                        elements = elementsAndFinisher.elements;

                        for (var j = 0; j < elements.length - 1; j++) {
                            for (var k = j + 1; k < elements.length; k++) {
                                if (
                                    elements[j].key === elements[k].key &&
                                    elements[j].placement === elements[k].placement
                                ) {
                                    throw new TypeError(
                                        'Duplicated element (' + elements[j].key + ')'
                                    );
                                }
                            }
                        }
                    }
                }

                return {
                    elements: elements,
                    finishers: finishers,
                };
            },
            fromElementDescriptor: function(element) {
                var obj = {
                    kind: element.kind,
                    key: element.key,
                    placement: element.placement,
                    descriptor: element.descriptor,
                };
                var desc = {
                    value: 'Descriptor',
                    configurable: true,
                };
                Object.defineProperty(obj, Symbol.toStringTag, desc);
                if (element.kind === 'field') obj.initializer = element.initializer;
                return obj;
            },
            toElementDescriptors: function(elementObjects) {
                if (elementObjects === undefined) return;
                return _toArray(elementObjects).map(function(elementObject) {
                    var element = this.toElementDescriptor(elementObject);
                    this.disallowProperty(elementObject, 'finisher', 'An element descriptor');
                    this.disallowProperty(elementObject, 'extras', 'An element descriptor');
                    return element;
                }, this);
            },
            toElementDescriptor: function(elementObject) {
                var kind = String(elementObject.kind);

                if (kind !== 'method' && kind !== 'field') {
                    throw new TypeError(
                        'An element descriptor\'s .kind property must be either "method" or' +
                            ' "field", but a decorator created an element descriptor with' +
                            ' .kind "' +
                            kind +
                            '"'
                    );
                }

                var key = _toPropertyKey(elementObject.key);

                var placement = String(elementObject.placement);

                if (placement !== 'static' && placement !== 'prototype' && placement !== 'own') {
                    throw new TypeError(
                        'An element descriptor\'s .placement property must be one of "static",' +
                            ' "prototype" or "own", but a decorator created an element descriptor' +
                            ' with .placement "' +
                            placement +
                            '"'
                    );
                }

                var descriptor = elementObject.descriptor;
                this.disallowProperty(elementObject, 'elements', 'An element descriptor');
                var element = {
                    kind: kind,
                    key: key,
                    placement: placement,
                    descriptor: Object.assign({}, descriptor),
                };

                if (kind !== 'field') {
                    this.disallowProperty(elementObject, 'initializer', 'A method descriptor');
                } else {
                    this.disallowProperty(
                        descriptor,
                        'get',
                        'The property descriptor of a field descriptor'
                    );
                    this.disallowProperty(
                        descriptor,
                        'set',
                        'The property descriptor of a field descriptor'
                    );
                    this.disallowProperty(
                        descriptor,
                        'value',
                        'The property descriptor of a field descriptor'
                    );
                    element.initializer = elementObject.initializer;
                }

                return element;
            },
            toElementFinisherExtras: function(elementObject) {
                var element = this.toElementDescriptor(elementObject);

                var finisher = _optionalCallableProperty(elementObject, 'finisher');

                var extras = this.toElementDescriptors(elementObject.extras);
                return {
                    element: element,
                    finisher: finisher,
                    extras: extras,
                };
            },
            fromClassDescriptor: function(elements) {
                var obj = {
                    kind: 'class',
                    elements: elements.map(this.fromElementDescriptor, this),
                };
                var desc = {
                    value: 'Descriptor',
                    configurable: true,
                };
                Object.defineProperty(obj, Symbol.toStringTag, desc);
                return obj;
            },
            toClassDescriptor: function(obj) {
                var kind = String(obj.kind);

                if (kind !== 'class') {
                    throw new TypeError(
                        'A class descriptor\'s .kind property must be "class", but a decorator' +
                            ' created a class descriptor with .kind "' +
                            kind +
                            '"'
                    );
                }

                this.disallowProperty(obj, 'key', 'A class descriptor');
                this.disallowProperty(obj, 'placement', 'A class descriptor');
                this.disallowProperty(obj, 'descriptor', 'A class descriptor');
                this.disallowProperty(obj, 'initializer', 'A class descriptor');
                this.disallowProperty(obj, 'extras', 'A class descriptor');

                var finisher = _optionalCallableProperty(obj, 'finisher');

                var elements = this.toElementDescriptors(obj.elements);
                return {
                    elements: elements,
                    finisher: finisher,
                };
            },
            runClassFinishers: function(constructor, finishers) {
                for (var i = 0; i < finishers.length; i++) {
                    var newConstructor = (0, finishers[i])(constructor);

                    if (newConstructor !== undefined) {
                        if (typeof newConstructor !== 'function') {
                            throw new TypeError('Finishers must return a constructor.');
                        }

                        constructor = newConstructor;
                    }
                }

                return constructor;
            },
            disallowProperty: function(obj, name, objectType) {
                if (obj[name] !== undefined) {
                    throw new TypeError(objectType + " can't have a ." + name + ' property.');
                }
            },
        };
        return api;
    }

    function _createElementDescriptor(def) {
        var key = _toPropertyKey(def.key);

        var descriptor;

        if (def.kind === 'method') {
            descriptor = {
                value: def.value,
                writable: true,
                configurable: true,
                enumerable: false,
            };
        } else if (def.kind === 'get') {
            descriptor = {
                get: def.value,
                configurable: true,
                enumerable: false,
            };
        } else if (def.kind === 'set') {
            descriptor = {
                set: def.value,
                configurable: true,
                enumerable: false,
            };
        } else if (def.kind === 'field') {
            descriptor = {
                configurable: true,
                writable: true,
                enumerable: true,
            };
        }

        var element = {
            kind: def.kind === 'field' ? 'field' : 'method',
            key: key,
            placement: def.static ? 'static' : def.kind === 'field' ? 'own' : 'prototype',
            descriptor: descriptor,
        };
        if (def.decorators) element.decorators = def.decorators;
        if (def.kind === 'field') element.initializer = def.value;
        return element;
    }

    function _coalesceGetterSetter(element, other) {
        if (element.descriptor.get !== undefined) {
            other.descriptor.get = element.descriptor.get;
        } else {
            other.descriptor.set = element.descriptor.set;
        }
    }

    function _coalesceClassElements(elements) {
        var newElements = [];

        var isSameElement = function(other) {
            return (
                other.kind === 'method' &&
                other.key === element.key &&
                other.placement === element.placement
            );
        };

        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            var other;

            if (element.kind === 'method' && (other = newElements.find(isSameElement))) {
                if (_isDataDescriptor(element.descriptor) || _isDataDescriptor(other.descriptor)) {
                    if (_hasDecorators(element) || _hasDecorators(other)) {
                        throw new ReferenceError(
                            'Duplicated methods (' + element.key + ") can't be decorated."
                        );
                    }

                    other.descriptor = element.descriptor;
                } else {
                    if (_hasDecorators(element)) {
                        if (_hasDecorators(other)) {
                            throw new ReferenceError(
                                "Decorators can't be placed on different accessors with for " +
                                    'the same property (' +
                                    element.key +
                                    ').'
                            );
                        }

                        other.decorators = element.decorators;
                    }

                    _coalesceGetterSetter(element, other);
                }
            } else {
                newElements.push(element);
            }
        }

        return newElements;
    }

    function _hasDecorators(element) {
        return element.decorators && element.decorators.length;
    }

    function _isDataDescriptor(desc) {
        return desc !== undefined && !(desc.value === undefined && desc.writable === undefined);
    }

    function _optionalCallableProperty(obj, name) {
        var value = obj[name];

        if (value !== undefined && typeof value !== 'function') {
            throw new TypeError("Expected '" + name + "' to be a function");
        }

        return value;
    }

    function _classPrivateMethodGet(receiver, privateSet, fn) {
        if (!privateSet.has(receiver)) {
            throw new TypeError('attempted to get private field on non-instance');
        }

        return fn;
    }

    function _classPrivateMethodSet() {
        throw new TypeError('attempted to reassign private method');
    }

    function _wrapRegExp(re, groups) {
        _wrapRegExp = function(re, groups) {
            return new BabelRegExp(re, groups);
        };

        var _RegExp = _wrapNativeSuper(RegExp);

        var _super = RegExp.prototype;

        var _groups = new WeakMap();

        function BabelRegExp(re, groups) {
            var _this = _RegExp.call(this, re);

            _groups.set(_this, groups);

            return _this;
        }

        _inherits(BabelRegExp, _RegExp);

        BabelRegExp.prototype.exec = function(str) {
            var result = _super.exec.call(this, str);

            if (result) result.groups = buildGroups(result, this);
            return result;
        };

        BabelRegExp.prototype[Symbol.replace] = function(str, substitution) {
            if (typeof substitution === 'string') {
                var groups = _groups.get(this);

                return _super[Symbol.replace].call(
                    this,
                    str,
                    substitution.replace(/\$<([^>]+)>/g, function(_, name) {
                        return '$' + groups[name];
                    })
                );
            } else if (typeof substitution === 'function') {
                var _this = this;

                return _super[Symbol.replace].call(this, str, function() {
                    var args = [];
                    args.push.apply(args, arguments);

                    if (typeof args[args.length - 1] !== 'object') {
                        args.push(buildGroups(args, _this));
                    }

                    return substitution.apply(this, args);
                });
            } else {
                return _super[Symbol.replace].call(this, str, substitution);
            }
        };

        function buildGroups(result, re) {
            var g = _groups.get(re);

            return Object.keys(g).reduce(function(groups, name) {
                groups[name] = result[g[name]];
                return groups;
            }, Object.create(null));
        }

        return _wrapRegExp.apply(this, arguments);
    }

    var arrayRemove = function arrayRemove(arr, index) {
        return arr.splice(index, 1);
    };

    var run = function run(cb, sync) {
        if (sync) {
            cb();
        } else if (document.hidden) {
            Promise.resolve(1).then(cb);
        } else {
            setTimeout(cb, 0);
        }
    };

    var on = function on() {
        var listeners = [];
        var off = function off(event, cb) {
            arrayRemove(
                listeners,
                listeners.findIndex(function(listener) {
                    return listener.event === event && (listener.cb === cb || !cb);
                })
            );
        };
        var _fire = function fire(event, args, sync) {
            listeners
                .filter(function(listener) {
                    return listener.event === event;
                })
                .map(function(listener) {
                    return listener.cb;
                })
                .forEach(function(cb) {
                    return run(function() {
                        return cb.apply(void 0, _toConsumableArray(args));
                    }, sync);
                });
        };
        return {
            fireSync: function fireSync(event) {
                for (
                    var _len = arguments.length,
                        args = new Array(_len > 1 ? _len - 1 : 0),
                        _key = 1;
                    _key < _len;
                    _key++
                ) {
                    args[_key - 1] = arguments[_key];
                }
                _fire(event, args, true);
            },
            fire: function fire(event) {
                for (
                    var _len2 = arguments.length,
                        args = new Array(_len2 > 1 ? _len2 - 1 : 0),
                        _key2 = 1;
                    _key2 < _len2;
                    _key2++
                ) {
                    args[_key2 - 1] = arguments[_key2];
                }
                _fire(event, args, false);
            },
            on: function on(event, cb) {
                listeners.push({ event: event, cb: cb });
            },
            onOnce: function onOnce(event, _cb) {
                listeners.push({
                    event: event,
                    cb: function cb() {
                        off(event, _cb);
                        _cb.apply(void 0, arguments);
                    },
                });
            },
            off: off,
        };
    };

    var copyObjectPropertiesToObject = function copyObjectPropertiesToObject(
        src,
        target,
        excluded
    ) {
        Object.getOwnPropertyNames(src)
            .filter(function(property) {
                return !excluded.includes(property);
            })
            .forEach(function(key) {
                return Object.defineProperty(
                    target,
                    key,
                    Object.getOwnPropertyDescriptor(src, key)
                );
            });
    };

    var PRIVATE = [
        'fire',
        'process',
        'revert',
        'load',
        'on',
        'off',
        'onOnce',
        'retryLoad',
        'extend',
        'archive',
        'archived',
        'release',
        'released',
        'requestProcessing',
        'freeze',
    ];

    var createItemAPI = function createItemAPI(item) {
        var api = {};
        copyObjectPropertiesToObject(item, api, PRIVATE);
        return api;
    };

    var removeReleasedItems = function removeReleasedItems(items) {
        items.forEach(function(item, index) {
            if (item.released) {
                arrayRemove(items, index);
            }
        });
    };

    var ItemStatus = {
        INIT: 1,
        IDLE: 2,
        PROCESSING_QUEUED: 9,
        PROCESSING: 3,
        PROCESSING_COMPLETE: 5,
        PROCESSING_ERROR: 6,
        PROCESSING_REVERT_ERROR: 10,
        LOADING: 7,
        LOAD_ERROR: 8,
    };

    var FileOrigin = {
        INPUT: 1,
        LIMBO: 2,
        LOCAL: 3,
    };

    var getNonNumeric = function getNonNumeric(str) {
        return /[^0-9]+/.exec(str);
    };

    var getDecimalSeparator = function getDecimalSeparator() {
        return getNonNumeric((1.1).toLocaleString())[0];
    };

    var getThousandsSeparator = function getThousandsSeparator() {
        // Added for browsers that do not return the thousands separator (happend on native browser Android 4.4.4)
        // We check against the normal toString output and if they're the same return a comma when decimal separator is a dot
        var decimalSeparator = getDecimalSeparator();
        var thousandsStringWithSeparator = (1000.0).toLocaleString();
        var thousandsStringWithoutSeparator = (1000.0).toString();
        if (thousandsStringWithSeparator !== thousandsStringWithoutSeparator) {
            return getNonNumeric(thousandsStringWithSeparator)[0];
        }
        return decimalSeparator === '.' ? ',' : '.';
    };

    var Type = {
        BOOLEAN: 'boolean',
        INT: 'int',
        NUMBER: 'number',
        STRING: 'string',
        ARRAY: 'array',
        OBJECT: 'object',
        FUNCTION: 'function',
        ACTION: 'action',
        SERVER_API: 'serverapi',
        REGEX: 'regex',
    };

    // all registered filters
    var filters = [];

    // loops over matching filters and passes options to each filter, returning the mapped results
    var applyFilterChain = function applyFilterChain(key, value, utils) {
        return new Promise(function(resolve, reject) {
            // find matching filters for this key
            var matchingFilters = filters
                .filter(function(f) {
                    return f.key === key;
                })
                .map(function(f) {
                    return f.cb;
                });

            // resolve now
            if (matchingFilters.length === 0) {
                resolve(value);
                return;
            }

            // first filter to kick things of
            var initialFilter = matchingFilters.shift();

            // chain filters
            matchingFilters
                .reduce(
                    // loop over promises passing value to next promise
                    function(current, next) {
                        return current.then(function(value) {
                            return next(value, utils);
                        });
                    },

                    // call initial filter, will return a promise
                    initialFilter(value, utils)

                    // all executed
                )
                .then(function(value) {
                    return resolve(value);
                })
                .catch(function(error) {
                    return reject(error);
                });
        });
    };

    var applyFilters = function applyFilters(key, value, utils) {
        return filters
            .filter(function(f) {
                return f.key === key;
            })
            .map(function(f) {
                return f.cb(value, utils);
            });
    };

    // adds a new filter to the list
    var addFilter = function addFilter(key, cb) {
        return filters.push({ key: key, cb: cb });
    };

    var extendDefaultOptions = function extendDefaultOptions(additionalOptions) {
        return Object.assign(defaultOptions, additionalOptions);
    };

    var getOptions = function getOptions() {
        return Object.assign({}, defaultOptions);
    };

    var setOptions = function setOptions(opts) {
        forin(opts, function(key, value) {
            // key does not exist, so this option cannot be set
            if (!defaultOptions[key]) {
                return;
            }
            defaultOptions[key][0] = getValueByType(
                value,
                defaultOptions[key][0],
                defaultOptions[key][1]
            );
        });
    };

    // default options on app
    var defaultOptions = {
        // the id to add to the root element
        id: [null, Type.STRING],

        // input field name to use
        name: ['filepond', Type.STRING],

        // disable the field
        disabled: [false, Type.BOOLEAN],

        // classname to put on wrapper
        className: [null, Type.STRING],

        // is the field required
        required: [false, Type.BOOLEAN],

        // Allow media capture when value is set
        captureMethod: [null, Type.STRING],
        // - "camera", "microphone" or "camcorder",
        // - Does not work with multiple on apple devices
        // - If set, acceptedFileTypes must be made to match with media wildcard "image/*", "audio/*" or "video/*"

        // sync `acceptedFileTypes` property with `accept` attribute
        allowSyncAcceptAttribute: [true, Type.BOOLEAN],

        // Feature toggles
        allowDrop: [true, Type.BOOLEAN], // Allow dropping of files
        allowBrowse: [true, Type.BOOLEAN], // Allow browsing the file system
        allowPaste: [true, Type.BOOLEAN], // Allow pasting files
        allowMultiple: [false, Type.BOOLEAN], // Allow multiple files (disabled by default, as multiple attribute is also required on input to allow multiple)
        allowReplace: [true, Type.BOOLEAN], // Allow dropping a file on other file to replace it (only works when multiple is set to false)
        allowRevert: [true, Type.BOOLEAN], // Allows user to revert file upload
        allowRemove: [true, Type.BOOLEAN], // Allow user to remove a file
        allowProcess: [true, Type.BOOLEAN], // Allows user to process a file, when set to false, this removes the file upload button
        allowReorder: [false, Type.BOOLEAN], // Allow reordering of files
        allowDirectoriesOnly: [false, Type.BOOLEAN], // Allow only selecting directories with browse (no support for filtering dnd at this point)

        // Try store file if `server` not set
        storeAsFile: [false, Type.BOOLEAN],

        // Revert mode
        forceRevert: [false, Type.BOOLEAN], // Set to 'force' to require the file to be reverted before removal

        // Input requirements
        maxFiles: [null, Type.INT], // Max number of files
        checkValidity: [false, Type.BOOLEAN], // Enables custom validity messages

        // Where to put file
        itemInsertLocationFreedom: [true, Type.BOOLEAN], // Set to false to always add items to begin or end of list
        itemInsertLocation: ['before', Type.STRING], // Default index in list to add items that have been dropped at the top of the list
        itemInsertInterval: [75, Type.INT],

        // Drag 'n Drop related
        dropOnPage: [false, Type.BOOLEAN], // Allow dropping of files anywhere on page (prevents browser from opening file if dropped outside of Up)
        dropOnElement: [true, Type.BOOLEAN], // Drop needs to happen on element (set to false to also load drops outside of Up)
        dropValidation: [false, Type.BOOLEAN], // Enable or disable validating files on drop
        ignoredFiles: [['.ds_store', 'thumbs.db', 'desktop.ini'], Type.ARRAY],

        // Upload related
        instantUpload: [true, Type.BOOLEAN], // Should upload files immediately on drop
        maxParallelUploads: [2, Type.INT], // Maximum files to upload in parallel
        allowMinimumUploadDuration: [true, Type.BOOLEAN], // if true uploads take at least 750 ms, this ensures the user sees the upload progress giving trust the upload actually happened

        // Chunks
        chunkUploads: [false, Type.BOOLEAN], // Enable chunked uploads
        chunkForce: [false, Type.BOOLEAN], // Force use of chunk uploads even for files smaller than chunk size
        chunkSize: [5000000, Type.INT], // Size of chunks (5MB default)
        chunkRetryDelays: [[500, 1000, 3000], Type.ARRAY], // Amount of times to retry upload of a chunk when it fails

        // The server api end points to use for uploading (see docs)
        server: [null, Type.SERVER_API],

        // File size calculations, can set to 1024, this is only used for display, properties use file size base 1000
        fileSizeBase: [1000, Type.INT],

        // Labels and status messages
        labelFileSizeBytes: ['bytes', Type.STRING],
        labelFileSizeKilobytes: ['KB', Type.STRING],
        labelFileSizeMegabytes: ['MB', Type.STRING],
        labelFileSizeGigabytes: ['GB', Type.STRING],

        labelDecimalSeparator: [getDecimalSeparator(), Type.STRING], // Default is locale separator
        labelThousandsSeparator: [getThousandsSeparator(), Type.STRING], // Default is locale separator

        labelIdle: [
            'Drag & Drop your files or <span class="filepond--label-action">Browse</span>',
            Type.STRING,
        ],

        labelInvalidField: ['Field contains invalid files', Type.STRING],
        labelFileWaitingForSize: ['Waiting for size', Type.STRING],
        labelFileSizeNotAvailable: ['Size not available', Type.STRING],
        labelFileCountSingular: ['file in list', Type.STRING],
        labelFileCountPlural: ['files in list', Type.STRING],
        labelFileLoading: ['Loading', Type.STRING],
        labelFileAdded: ['Added', Type.STRING], // assistive only
        labelFileLoadError: ['Error during load', Type.STRING],
        labelFileRemoved: ['Removed', Type.STRING], // assistive only
        labelFileRemoveError: ['Error during remove', Type.STRING],
        labelFileProcessing: ['Uploading', Type.STRING],
        labelFileProcessingComplete: ['Upload complete', Type.STRING],
        labelFileProcessingAborted: ['Upload cancelled', Type.STRING],
        labelFileProcessingError: ['Error during upload', Type.STRING],
        labelFileProcessingRevertError: ['Error during revert', Type.STRING],

        labelTapToCancel: ['tap to cancel', Type.STRING],
        labelTapToRetry: ['tap to retry', Type.STRING],
        labelTapToUndo: ['tap to undo', Type.STRING],

        labelButtonRemoveItem: ['Remove', Type.STRING],
        labelButtonAbortItemLoad: ['Abort', Type.STRING],
        labelButtonRetryItemLoad: ['Retry', Type.STRING],
        labelButtonAbortItemProcessing: ['Cancel', Type.STRING],
        labelButtonUndoItemProcessing: ['Undo', Type.STRING],
        labelButtonRetryItemProcessing: ['Retry', Type.STRING],
        labelButtonProcessItem: ['Upload', Type.STRING],

        // make sure width and height plus viewpox are even numbers so icons are nicely centered
        iconRemove: [
            '<svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg"><path d="M11.586 13l-2.293 2.293a1 1 0 0 0 1.414 1.414L13 14.414l2.293 2.293a1 1 0 0 0 1.414-1.414L14.414 13l2.293-2.293a1 1 0 0 0-1.414-1.414L13 11.586l-2.293-2.293a1 1 0 0 0-1.414 1.414L11.586 13z" fill="currentColor" fill-rule="nonzero"/></svg>',
            Type.STRING,
        ],

        iconProcess: [
            '<svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg"><path d="M14 10.414v3.585a1 1 0 0 1-2 0v-3.585l-1.293 1.293a1 1 0 0 1-1.414-1.415l3-3a1 1 0 0 1 1.414 0l3 3a1 1 0 0 1-1.414 1.415L14 10.414zM9 18a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2H9z" fill="currentColor" fill-rule="evenodd"/></svg>',
            Type.STRING,
        ],

        iconRetry: [
            '<svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg"><path d="M10.81 9.185l-.038.02A4.997 4.997 0 0 0 8 13.683a5 5 0 0 0 5 5 5 5 0 0 0 5-5 1 1 0 0 1 2 0A7 7 0 1 1 9.722 7.496l-.842-.21a.999.999 0 1 1 .484-1.94l3.23.806c.535.133.86.675.73 1.21l-.804 3.233a.997.997 0 0 1-1.21.73.997.997 0 0 1-.73-1.21l.23-.928v-.002z" fill="currentColor" fill-rule="nonzero"/></svg>',
            Type.STRING,
        ],

        iconUndo: [
            '<svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg"><path d="M9.185 10.81l.02-.038A4.997 4.997 0 0 1 13.683 8a5 5 0 0 1 5 5 5 5 0 0 1-5 5 1 1 0 0 0 0 2A7 7 0 1 0 7.496 9.722l-.21-.842a.999.999 0 1 0-1.94.484l.806 3.23c.133.535.675.86 1.21.73l3.233-.803a.997.997 0 0 0 .73-1.21.997.997 0 0 0-1.21-.73l-.928.23-.002-.001z" fill="currentColor" fill-rule="nonzero"/></svg>',
            Type.STRING,
        ],

        iconDone: [
            '<svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg"><path d="M18.293 9.293a1 1 0 0 1 1.414 1.414l-7.002 7a1 1 0 0 1-1.414 0l-3.998-4a1 1 0 1 1 1.414-1.414L12 15.586l6.294-6.293z" fill="currentColor" fill-rule="nonzero"/></svg>',
            Type.STRING,
        ],

        // event handlers
        oninit: [null, Type.FUNCTION],
        onwarning: [null, Type.FUNCTION],
        onerror: [null, Type.FUNCTION],
        onactivatefile: [null, Type.FUNCTION],
        oninitfile: [null, Type.FUNCTION],
        onaddfilestart: [null, Type.FUNCTION],
        onaddfileprogress: [null, Type.FUNCTION],
        onaddfile: [null, Type.FUNCTION],
        onprocessfilestart: [null, Type.FUNCTION],
        onprocessfileprogress: [null, Type.FUNCTION],
        onprocessfileabort: [null, Type.FUNCTION],
        onprocessfilerevert: [null, Type.FUNCTION],
        onprocessfile: [null, Type.FUNCTION],
        onprocessfiles: [null, Type.FUNCTION],
        onremovefile: [null, Type.FUNCTION],
        onpreparefile: [null, Type.FUNCTION],
        onupdatefiles: [null, Type.FUNCTION],
        onreorderfiles: [null, Type.FUNCTION],

        // hooks
        beforeDropFile: [null, Type.FUNCTION],
        beforeAddFile: [null, Type.FUNCTION],
        beforeRemoveFile: [null, Type.FUNCTION],
        beforePrepareFile: [null, Type.FUNCTION],

        // styles
        stylePanelLayout: [null, Type.STRING], // null 'integrated', 'compact', 'circle'
        stylePanelAspectRatio: [null, Type.STRING], // null or '3:2' or 1
        styleItemPanelAspectRatio: [null, Type.STRING],
        styleButtonRemoveItemPosition: ['left', Type.STRING],
        styleButtonProcessItemPosition: ['right', Type.STRING],
        styleLoadIndicatorPosition: ['right', Type.STRING],
        styleProgressIndicatorPosition: ['right', Type.STRING],
        styleButtonRemoveItemAlign: [false, Type.BOOLEAN],

        // custom initial files array
        files: [[], Type.ARRAY],

        // show support by displaying credits
        credits: [['https://pqina.nl/', 'Powered by PQINA'], Type.ARRAY],
    };

    var getItemByQuery = function getItemByQuery(items, query) {
        // just return first index
        if (isEmpty(query)) {
            return items[0] || null;
        }

        // query is index
        if (isInt(query)) {
            return items[query] || null;
        }

        // if query is item, get the id
        if (typeof query === 'object') {
            query = query.id;
        }

        // assume query is a string and return item by id
        return (
            items.find(function(item) {
                return item.id === query;
            }) || null
        );
    };

    var getNumericAspectRatioFromString = function getNumericAspectRatioFromString(aspectRatio) {
        if (isEmpty(aspectRatio)) {
            return aspectRatio;
        }
        if (/:/.test(aspectRatio)) {
            var parts = aspectRatio.split(':');
            return parts[1] / parts[0];
        }
        return parseFloat(aspectRatio);
    };

    var getActiveItems = function getActiveItems(items) {
        return items.filter(function(item) {
            return !item.archived;
        });
    };

    var Status = {
        EMPTY: 0,
        IDLE: 1, // waiting
        ERROR: 2, // a file is in error state
        BUSY: 3, // busy processing or loading
        READY: 4, // all files uploaded
    };

    var res = null;
    var canUpdateFileInput = function canUpdateFileInput() {
        if (res === null) {
            try {
                var dataTransfer = new DataTransfer();
                dataTransfer.items.add(new File(['hello world'], 'This_Works.txt'));
                var el = document.createElement('input');
                el.setAttribute('type', 'file');
                el.files = dataTransfer.files;
                res = el.files.length === 1;
            } catch (err) {
                res = false;
            }
        }
        return res;
    };

    var ITEM_ERROR = [
        ItemStatus.LOAD_ERROR,
        ItemStatus.PROCESSING_ERROR,
        ItemStatus.PROCESSING_REVERT_ERROR,
    ];

    var ITEM_BUSY = [
        ItemStatus.LOADING,
        ItemStatus.PROCESSING,
        ItemStatus.PROCESSING_QUEUED,
        ItemStatus.INIT,
    ];

    var ITEM_READY = [ItemStatus.PROCESSING_COMPLETE];

    var isItemInErrorState = function isItemInErrorState(item) {
        return ITEM_ERROR.includes(item.status);
    };
    var isItemInBusyState = function isItemInBusyState(item) {
        return ITEM_BUSY.includes(item.status);
    };
    var isItemInReadyState = function isItemInReadyState(item) {
        return ITEM_READY.includes(item.status);
    };

    var isAsync = function isAsync(state) {
        return (
            isObject(state.options.server) &&
            (isObject(state.options.server.process) || isFunction(state.options.server.process))
        );
    };

    var queries = function queries(state) {
        return {
            GET_STATUS: function GET_STATUS() {
                var items = getActiveItems(state.items);
                var EMPTY = Status.EMPTY,
                    ERROR = Status.ERROR,
                    BUSY = Status.BUSY,
                    IDLE = Status.IDLE,
                    READY = Status.READY;

                if (items.length === 0) return EMPTY;

                if (items.some(isItemInErrorState)) return ERROR;

                if (items.some(isItemInBusyState)) return BUSY;

                if (items.some(isItemInReadyState)) return READY;

                return IDLE;
            },

            GET_ITEM: function GET_ITEM(query) {
                return getItemByQuery(state.items, query);
            },

            GET_ACTIVE_ITEM: function GET_ACTIVE_ITEM(query) {
                return getItemByQuery(getActiveItems(state.items), query);
            },

            GET_ACTIVE_ITEMS: function GET_ACTIVE_ITEMS() {
                return getActiveItems(state.items);
            },

            GET_ITEMS: function GET_ITEMS() {
                return state.items;
            },

            GET_ITEM_NAME: function GET_ITEM_NAME(query) {
                var item = getItemByQuery(state.items, query);
                return item ? item.filename : null;
            },

            GET_ITEM_SIZE: function GET_ITEM_SIZE(query) {
                var item = getItemByQuery(state.items, query);
                return item ? item.fileSize : null;
            },

            GET_STYLES: function GET_STYLES() {
                return Object.keys(state.options)
                    .filter(function(key) {
                        return /^style/.test(key);
                    })
                    .map(function(option) {
                        return {
                            name: option,
                            value: state.options[option],
                        };
                    });
            },

            GET_PANEL_ASPECT_RATIO: function GET_PANEL_ASPECT_RATIO() {
                var isShapeCircle = /circle/.test(state.options.stylePanelLayout);
                var aspectRatio = isShapeCircle
                    ? 1
                    : getNumericAspectRatioFromString(state.options.stylePanelAspectRatio);
                return aspectRatio;
            },

            GET_ITEM_PANEL_ASPECT_RATIO: function GET_ITEM_PANEL_ASPECT_RATIO() {
                return state.options.styleItemPanelAspectRatio;
            },

            GET_ITEMS_BY_STATUS: function GET_ITEMS_BY_STATUS(status) {
                return getActiveItems(state.items).filter(function(item) {
                    return item.status === status;
                });
            },

            GET_TOTAL_ITEMS: function GET_TOTAL_ITEMS() {
                return getActiveItems(state.items).length;
            },

            SHOULD_UPDATE_FILE_INPUT: function SHOULD_UPDATE_FILE_INPUT() {
                return state.options.storeAsFile && canUpdateFileInput() && !isAsync(state);
            },

            IS_ASYNC: function IS_ASYNC() {
                return isAsync(state);
            },

            GET_FILE_SIZE_LABELS: function GET_FILE_SIZE_LABELS(query) {
                return {
                    labelBytes: query('GET_LABEL_FILE_SIZE_BYTES') || undefined,
                    labelKilobytes: query('GET_LABEL_FILE_SIZE_KILOBYTES') || undefined,
                    labelMegabytes: query('GET_LABEL_FILE_SIZE_MEGABYTES') || undefined,
                    labelGigabytes: query('GET_LABEL_FILE_SIZE_GIGABYTES') || undefined,
                };
            },
        };
    };

    var hasRoomForItem = function hasRoomForItem(state) {
        var count = getActiveItems(state.items).length;

        // if cannot have multiple items, to add one item it should currently not contain items
        if (!state.options.allowMultiple) {
            return count === 0;
        }

        // if allows multiple items, we check if a max item count has been set, if not, there's no limit
        var maxFileCount = state.options.maxFiles;
        if (maxFileCount === null) {
            return true;
        }

        // we check if the current count is smaller than the max count, if so, another file can still be added
        if (count < maxFileCount) {
            return true;
        }

        // no more room for another file
        return false;
    };

    var limit = function limit(value, min, max) {
        return Math.max(Math.min(max, value), min);
    };

    var arrayInsert = function arrayInsert(arr, index, item) {
        return arr.splice(index, 0, item);
    };

    var insertItem = function insertItem(items, item, index) {
        if (isEmpty(item)) {
            return null;
        }

        // if index is undefined, append
        if (typeof index === 'undefined') {
            items.push(item);
            return item;
        }

        // limit the index to the size of the items array
        index = limit(index, 0, items.length);

        // add item to array
        arrayInsert(items, index, item);

        // expose
        return item;
    };

    var isBase64DataURI = function isBase64DataURI(str) {
        return /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s]*)\s*$/i.test(
            str
        );
    };

    var getFilenameFromURL = function getFilenameFromURL(url) {
        return ('' + url)
            .split('/')
            .pop()
            .split('?')
            .shift();
    };

    var getExtensionFromFilename = function getExtensionFromFilename(name) {
        return name.split('.').pop();
    };

    var guesstimateExtension = function guesstimateExtension(type) {
        // if no extension supplied, exit here
        if (typeof type !== 'string') {
            return '';
        }

        // get subtype
        var subtype = type.split('/').pop();

        // is svg subtype
        if (/svg/.test(subtype)) {
            return 'svg';
        }

        if (/zip|compressed/.test(subtype)) {
            return 'zip';
        }

        if (/plain/.test(subtype)) {
            return 'txt';
        }

        if (/msword/.test(subtype)) {
            return 'doc';
        }

        // if is valid subtype
        if (/[a-z]+/.test(subtype)) {
            // always use jpg extension
            if (subtype === 'jpeg') {
                return 'jpg';
            }

            // return subtype
            return subtype;
        }

        return '';
    };

    var leftPad = function leftPad(value) {
        var padding = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
        return (padding + value).slice(-padding.length);
    };

    var getDateString = function getDateString() {
        var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Date();
        return (
            date.getFullYear() +
            '-' +
            leftPad(date.getMonth() + 1, '00') +
            '-' +
            leftPad(date.getDate(), '00') +
            '_' +
            leftPad(date.getHours(), '00') +
            '-' +
            leftPad(date.getMinutes(), '00') +
            '-' +
            leftPad(date.getSeconds(), '00')
        );
    };

    var getFileFromBlob = function getFileFromBlob(blob, filename) {
        var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
        var extension = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
        var file =
            typeof type === 'string'
                ? blob.slice(0, blob.size, type)
                : blob.slice(0, blob.size, blob.type);
        file.lastModifiedDate = new Date();

        // copy relative path
        if (blob._relativePath) file._relativePath = blob._relativePath;

        // if blob has name property, use as filename if no filename supplied
        if (!isString(filename)) {
            filename = getDateString();
        }

        // if filename supplied but no extension and filename has extension
        if (filename && extension === null && getExtensionFromFilename(filename)) {
            file.name = filename;
        } else {
            extension = extension || guesstimateExtension(file.type);
            file.name = filename + (extension ? '.' + extension : '');
        }

        return file;
    };

    var getBlobBuilder = function getBlobBuilder() {
        return (window.BlobBuilder =
            window.BlobBuilder ||
            window.WebKitBlobBuilder ||
            window.MozBlobBuilder ||
            window.MSBlobBuilder);
    };

    var createBlob = function createBlob(arrayBuffer, mimeType) {
        var BB = getBlobBuilder();

        if (BB) {
            var bb = new BB();
            bb.append(arrayBuffer);
            return bb.getBlob(mimeType);
        }

        return new Blob([arrayBuffer], {
            type: mimeType,
        });
    };

    var getBlobFromByteStringWithMimeType = function getBlobFromByteStringWithMimeType(
        byteString,
        mimeType
    ) {
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);

        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return createBlob(ab, mimeType);
    };

    var getMimeTypeFromBase64DataURI = function getMimeTypeFromBase64DataURI(dataURI) {
        return (/^data:(.+);/.exec(dataURI) || [])[1] || null;
    };

    var getBase64DataFromBase64DataURI = function getBase64DataFromBase64DataURI(dataURI) {
        // get data part of string (remove data:image/jpeg...,)
        var data = dataURI.split(',')[1];

        // remove any whitespace as that causes InvalidCharacterError in IE
        return data.replace(/\s/g, '');
    };

    var getByteStringFromBase64DataURI = function getByteStringFromBase64DataURI(dataURI) {
        return atob(getBase64DataFromBase64DataURI(dataURI));
    };

    var getBlobFromBase64DataURI = function getBlobFromBase64DataURI(dataURI) {
        var mimeType = getMimeTypeFromBase64DataURI(dataURI);
        var byteString = getByteStringFromBase64DataURI(dataURI);

        return getBlobFromByteStringWithMimeType(byteString, mimeType);
    };

    var getFileFromBase64DataURI = function getFileFromBase64DataURI(dataURI, filename, extension) {
        return getFileFromBlob(getBlobFromBase64DataURI(dataURI), filename, null, extension);
    };

    var getFileNameFromHeader = function getFileNameFromHeader(header) {
        // test if is content disposition header, if not exit
        if (!/^content-disposition:/i.test(header)) return null;

        // get filename parts
        var matches = header
            .split(/filename=|filename\*=.+''/)
            .splice(1)
            .map(function(name) {
                return name.trim().replace(/^["']|[;"']{0,2}$/g, '');
            })
            .filter(function(name) {
                return name.length;
            });

        return matches.length ? decodeURI(matches[matches.length - 1]) : null;
    };

    var getFileSizeFromHeader = function getFileSizeFromHeader(header) {
        if (/content-length:/i.test(header)) {
            var size = header.match(/[0-9]+/)[0];
            return size ? parseInt(size, 10) : null;
        }
        return null;
    };

    var getTranfserIdFromHeader = function getTranfserIdFromHeader(header) {
        if (/x-content-transfer-id:/i.test(header)) {
            var id = (header.split(':')[1] || '').trim();
            return id || null;
        }
        return null;
    };

    var getFileInfoFromHeaders = function getFileInfoFromHeaders(headers) {
        var info = {
            source: null,
            name: null,
            size: null,
        };

        var rows = headers.split('\n');
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;
        try {
            for (
                var _iterator = rows[Symbol.iterator](), _step;
                !(_iteratorNormalCompletion = (_step = _iterator.next()).done);
                _iteratorNormalCompletion = true
            ) {
                var header = _step.value;

                var name = getFileNameFromHeader(header);
                if (name) {
                    info.name = name;
                    continue;
                }

                var size = getFileSizeFromHeader(header);
                if (size) {
                    info.size = size;
                    continue;
                }

                var source = getTranfserIdFromHeader(header);
                if (source) {
                    info.source = source;
                    continue;
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return != null) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        return info;
    };

    var createFileLoader = function createFileLoader(fetchFn) {
        var state = {
            source: null,
            complete: false,
            progress: 0,
            size: null,
            timestamp: null,
            duration: 0,
            request: null,
        };

        var getProgress = function getProgress() {
            return state.progress;
        };
        var abort = function abort() {
            if (state.request && state.request.abort) {
                state.request.abort();
            }
        };

        // load source
        var load = function load() {
            // get quick reference
            var source = state.source;

            api.fire('init', source);

            // Load Files
            if (source instanceof File) {
                api.fire('load', source);
            } else if (source instanceof Blob) {
                // Load blobs, set default name to current date
                api.fire('load', getFileFromBlob(source, source.name));
            } else if (isBase64DataURI(source)) {
                // Load base 64, set default name to current date
                api.fire('load', getFileFromBase64DataURI(source));
            } else {
                // Deal as if is external URL, let's load it!
                loadURL(source);
            }
        };

        // loads a url
        var loadURL = function loadURL(url) {
            // is remote url and no fetch method supplied
            if (!fetchFn) {
                api.fire('error', {
                    type: 'error',
                    body: "Can't load URL",
                    code: 400,
                });

                return;
            }

            // set request start
            state.timestamp = Date.now();

            // load file
            state.request = fetchFn(
                url,
                function(response) {
                    // update duration
                    state.duration = Date.now() - state.timestamp;

                    // done!
                    state.complete = true;

                    // turn blob response into a file
                    if (response instanceof Blob) {
                        response = getFileFromBlob(
                            response,
                            response.name || getFilenameFromURL(url)
                        );
                    }

                    api.fire(
                        'load',
                        // if has received blob, we go with blob, if no response, we return null
                        response instanceof Blob ? response : response ? response.body : null
                    );
                },
                function(error) {
                    api.fire(
                        'error',
                        typeof error === 'string'
                            ? {
                                  type: 'error',
                                  code: 0,
                                  body: error,
                              }
                            : error
                    );
                },
                function(computable, current, total) {
                    // collected some meta data already
                    if (total) {
                        state.size = total;
                    }

                    // update duration
                    state.duration = Date.now() - state.timestamp;

                    // if we can't compute progress, we're not going to fire progress events
                    if (!computable) {
                        state.progress = null;
                        return;
                    }

                    // update progress percentage
                    state.progress = current / total;

                    // expose
                    api.fire('progress', state.progress);
                },
                function() {
                    api.fire('abort');
                },
                function(response) {
                    var fileinfo = getFileInfoFromHeaders(
                        typeof response === 'string' ? response : response.headers
                    );
                    api.fire('meta', {
                        size: state.size || fileinfo.size,
                        filename: fileinfo.name,
                        source: fileinfo.source,
                    });
                }
            );
        };

        var api = Object.assign({}, on(), {
            setSource: function setSource(source) {
                return (state.source = source);
            },
            getProgress: getProgress, // file load progress
            abort: abort, // abort file load
            load: load, // start load
        });

        return api;
    };

    var isGet = function isGet(method) {
        return /GET|HEAD/.test(method);
    };

    var sendRequest = function sendRequest(data, url, options) {
        var api = {
            onheaders: function onheaders() {},
            onprogress: function onprogress() {},
            onload: function onload() {},
            ontimeout: function ontimeout() {},
            onerror: function onerror() {},
            onabort: function onabort() {},
            abort: function abort() {
                aborted = true;
                xhr.abort();
            },
        };

        // timeout identifier, only used when timeout is defined
        var aborted = false;
        var headersReceived = false;

        // set default options
        options = Object.assign(
            {
                method: 'POST',
                headers: {},
                withCredentials: false,
            },
            options
        );

        // encode url
        url = encodeURI(url);

        // if method is GET, add any received data to url

        if (isGet(options.method) && data) {
            url =
                '' +
                url +
                encodeURIComponent(typeof data === 'string' ? data : JSON.stringify(data));
        }

        // create request
        var xhr = new XMLHttpRequest();

        // progress of load
        var process = isGet(options.method) ? xhr : xhr.upload;
        process.onprogress = function(e) {
            // no progress event when aborted ( onprogress is called once after abort() )
            if (aborted) {
                return;
            }

            api.onprogress(e.lengthComputable, e.loaded, e.total);
        };

        // tries to get header info to the app as fast as possible
        xhr.onreadystatechange = function() {
            // not interesting in these states ('unsent' and 'openend' as they don't give us any additional info)
            if (xhr.readyState < 2) {
                return;
            }

            // no server response
            if (xhr.readyState === 4 && xhr.status === 0) {
                return;
            }

            if (headersReceived) {
                return;
            }

            headersReceived = true;

            // we've probably received some useful data in response headers
            api.onheaders(xhr);
        };

        // load successful
        xhr.onload = function() {
            // is classified as valid response
            if (xhr.status >= 200 && xhr.status < 300) {
                api.onload(xhr);
            } else {
                api.onerror(xhr);
            }
        };

        // error during load
        xhr.onerror = function() {
            return api.onerror(xhr);
        };

        // request aborted
        xhr.onabort = function() {
            aborted = true;
            api.onabort();
        };

        // request timeout
        xhr.ontimeout = function() {
            return api.ontimeout(xhr);
        };

        // open up open up!
        xhr.open(options.method, url, true);

        // set timeout if defined (do it after open so IE11 plays ball)
        if (isInt(options.timeout)) {
            xhr.timeout = options.timeout;
        }

        // add headers
        Object.keys(options.headers).forEach(function(key) {
            var value = unescape(encodeURIComponent(options.headers[key]));
            xhr.setRequestHeader(key, value);
        });

        // set type of response
        if (options.responseType) {
            xhr.responseType = options.responseType;
        }

        // set credentials
        if (options.withCredentials) {
            xhr.withCredentials = true;
        }

        // let's send our data
        xhr.send(data);

        return api;
    };

    var createResponse = function createResponse(type, code, body, headers) {
        return {
            type: type,
            code: code,
            body: body,
            headers: headers,
        };
    };

    var createTimeoutResponse = function createTimeoutResponse(cb) {
        return function(xhr) {
            cb(createResponse('error', 0, 'Timeout', xhr.getAllResponseHeaders()));
        };
    };

    var hasQS = function hasQS(str) {
        return /\?/.test(str);
    };
    var buildURL = function buildURL() {
        var url = '';
        for (var _len = arguments.length, parts = new Array(_len), _key = 0; _key < _len; _key++) {
            parts[_key] = arguments[_key];
        }
        parts.forEach(function(part) {
            url += hasQS(url) && hasQS(part) ? part.replace(/\?/, '&') : part;
        });
        return url;
    };

    var createFetchFunction = function createFetchFunction() {
        var apiUrl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        var action = arguments.length > 1 ? arguments[1] : undefined;
        // custom handler (should also handle file, load, error, progress and abort)
        if (typeof action === 'function') {
            return action;
        }

        // no action supplied
        if (!action || !isString(action.url)) {
            return null;
        }

        // set onload hanlder
        var onload =
            action.onload ||
            function(res) {
                return res;
            };
        var onerror =
            action.onerror ||
            function(res) {
                return null;
            };

        // internal handler
        return function(url, load, error, progress, abort, headers) {
            // do local or remote request based on if the url is external
            var request = sendRequest(
                url,
                buildURL(apiUrl, action.url),
                Object.assign({}, action, {
                    responseType: 'blob',
                })
            );

            request.onload = function(xhr) {
                // get headers
                var headers = xhr.getAllResponseHeaders();

                // get filename
                var filename = getFileInfoFromHeaders(headers).name || getFilenameFromURL(url);

                // create response
                load(
                    createResponse(
                        'load',
                        xhr.status,
                        action.method === 'HEAD'
                            ? null
                            : getFileFromBlob(onload(xhr.response), filename),
                        headers
                    )
                );
            };

            request.onerror = function(xhr) {
                error(
                    createResponse(
                        'error',
                        xhr.status,
                        onerror(xhr.response) || xhr.statusText,
                        xhr.getAllResponseHeaders()
                    )
                );
            };

            request.onheaders = function(xhr) {
                headers(createResponse('headers', xhr.status, null, xhr.getAllResponseHeaders()));
            };

            request.ontimeout = createTimeoutResponse(error);
            request.onprogress = progress;
            request.onabort = abort;

            // should return request
            return request;
        };
    };

    var ChunkStatus = {
        QUEUED: 0,
        COMPLETE: 1,
        PROCESSING: 2,
        ERROR: 3,
        WAITING: 4,
    };

    /*
                                                       function signature:
                                                         (file, metadata, load, error, progress, abort, transfer, options) => {
                                                           return {
                                                           abort:() => {}
                                                         }
                                                       }
                                                       */

    // apiUrl, action, name, file, metadata, load, error, progress, abort, transfer, options
    var processFileChunked = function processFileChunked(
        apiUrl,
        action,
        name,
        file,
        metadata,
        load,
        error,
        progress,
        abort,
        transfer,
        options
    ) {
        // all chunks
        var chunks = [];
        var chunkTransferId = options.chunkTransferId,
            chunkServer = options.chunkServer,
            chunkSize = options.chunkSize,
            chunkRetryDelays = options.chunkRetryDelays;

        // default state
        var state = {
            serverId: chunkTransferId,
            aborted: false,
        };

        // set onload handlers
        var ondata =
            action.ondata ||
            function(fd) {
                return fd;
            };
        var onload =
            action.onload ||
            function(xhr, method) {
                return method === 'HEAD' ? xhr.getResponseHeader('Upload-Offset') : xhr.response;
            };
        var onerror =
            action.onerror ||
            function(res) {
                return null;
            };

        // create server hook
        var requestTransferId = function requestTransferId(cb) {
            var formData = new FormData();

            // add metadata under same name
            if (isObject(metadata)) formData.append(name, JSON.stringify(metadata));

            var headers =
                typeof action.headers === 'function'
                    ? action.headers(file, metadata)
                    : Object.assign(
                          {},

                          action.headers,
                          {
                              'Upload-Length': file.size,
                          }
                      );

            var requestParams = Object.assign({}, action, {
                headers: headers,
            });

            // send request object
            var request = sendRequest(
                ondata(formData),
                buildURL(apiUrl, action.url),
                requestParams
            );

            request.onload = function(xhr) {
                return cb(onload(xhr, requestParams.method));
            };

            request.onerror = function(xhr) {
                return error(
                    createResponse(
                        'error',
                        xhr.status,
                        onerror(xhr.response) || xhr.statusText,
                        xhr.getAllResponseHeaders()
                    )
                );
            };

            request.ontimeout = createTimeoutResponse(error);
        };

        var requestTransferOffset = function requestTransferOffset(cb) {
            var requestUrl = buildURL(apiUrl, chunkServer.url, state.serverId);

            var headers =
                typeof action.headers === 'function'
                    ? action.headers(state.serverId)
                    : Object.assign(
                          {},

                          action.headers
                      );

            var requestParams = {
                headers: headers,
                method: 'HEAD',
            };

            var request = sendRequest(null, requestUrl, requestParams);

            request.onload = function(xhr) {
                return cb(onload(xhr, requestParams.method));
            };

            request.onerror = function(xhr) {
                return error(
                    createResponse(
                        'error',
                        xhr.status,
                        onerror(xhr.response) || xhr.statusText,
                        xhr.getAllResponseHeaders()
                    )
                );
            };

            request.ontimeout = createTimeoutResponse(error);
        };

        // create chunks
        var lastChunkIndex = Math.floor(file.size / chunkSize);
        for (var i = 0; i <= lastChunkIndex; i++) {
            var offset = i * chunkSize;
            var data = file.slice(offset, offset + chunkSize, 'application/offset+octet-stream');
            chunks[i] = {
                index: i,
                size: data.size,
                offset: offset,
                data: data,
                file: file,
                progress: 0,
                retries: _toConsumableArray(chunkRetryDelays),
                status: ChunkStatus.QUEUED,
                error: null,
                request: null,
                timeout: null,
            };
        }

        var completeProcessingChunks = function completeProcessingChunks() {
            return load(state.serverId);
        };

        var canProcessChunk = function canProcessChunk(chunk) {
            return chunk.status === ChunkStatus.QUEUED || chunk.status === ChunkStatus.ERROR;
        };

        var processChunk = function processChunk(chunk) {
            // processing is paused, wait here
            if (state.aborted) return;

            // get next chunk to process
            chunk = chunk || chunks.find(canProcessChunk);

            // no more chunks to process
            if (!chunk) {
                // all done?
                if (
                    chunks.every(function(chunk) {
                        return chunk.status === ChunkStatus.COMPLETE;
                    })
                ) {
                    completeProcessingChunks();
                }

                // no chunk to handle
                return;
            }

            // now processing this chunk
            chunk.status = ChunkStatus.PROCESSING;
            chunk.progress = null;

            // allow parsing of formdata
            var ondata =
                chunkServer.ondata ||
                function(fd) {
                    return fd;
                };
            var onerror =
                chunkServer.onerror ||
                function(res) {
                    return null;
                };
            var onload = chunkServer.onload || function() {};

            // send request object
            var requestUrl = buildURL(apiUrl, chunkServer.url, state.serverId);

            var headers =
                typeof chunkServer.headers === 'function'
                    ? chunkServer.headers(chunk)
                    : Object.assign(
                          {},

                          chunkServer.headers,
                          {
                              'Content-Type': 'application/offset+octet-stream',
                              'Upload-Offset': chunk.offset,
                              'Upload-Length': file.size,
                              'Upload-Name': file.name,
                          }
                      );

            var request = (chunk.request = sendRequest(
                ondata(chunk.data),
                requestUrl,
                Object.assign({}, chunkServer, {
                    headers: headers,
                })
            ));

            request.onload = function(xhr) {
                // allow hooking into request result
                onload(xhr, chunk.index, chunks.length);

                // done!
                chunk.status = ChunkStatus.COMPLETE;

                // remove request reference
                chunk.request = null;

                // start processing more chunks
                processChunks();
            };

            request.onprogress = function(lengthComputable, loaded, total) {
                chunk.progress = lengthComputable ? loaded : null;
                updateTotalProgress();
            };

            request.onerror = function(xhr) {
                chunk.status = ChunkStatus.ERROR;
                chunk.request = null;
                chunk.error = onerror(xhr.response) || xhr.statusText;
                if (!retryProcessChunk(chunk)) {
                    error(
                        createResponse(
                            'error',
                            xhr.status,
                            onerror(xhr.response) || xhr.statusText,
                            xhr.getAllResponseHeaders()
                        )
                    );
                }
            };

            request.ontimeout = function(xhr) {
                chunk.status = ChunkStatus.ERROR;
                chunk.request = null;
                if (!retryProcessChunk(chunk)) {
                    createTimeoutResponse(error)(xhr);
                }
            };

            request.onabort = function() {
                chunk.status = ChunkStatus.QUEUED;
                chunk.request = null;
                abort();
            };
        };

        var retryProcessChunk = function retryProcessChunk(chunk) {
            // no more retries left
            if (chunk.retries.length === 0) return false;

            // new retry
            chunk.status = ChunkStatus.WAITING;
            clearTimeout(chunk.timeout);
            chunk.timeout = setTimeout(function() {
                processChunk(chunk);
            }, chunk.retries.shift());

            // we're going to retry
            return true;
        };

        var updateTotalProgress = function updateTotalProgress() {
            // calculate total progress fraction
            var totalBytesTransfered = chunks.reduce(function(p, chunk) {
                if (p === null || chunk.progress === null) return null;
                return p + chunk.progress;
            }, 0);

            // can't compute progress
            if (totalBytesTransfered === null) return progress(false, 0, 0);

            // calculate progress values
            var totalSize = chunks.reduce(function(total, chunk) {
                return total + chunk.size;
            }, 0);

            // can update progress indicator
            progress(true, totalBytesTransfered, totalSize);
        };

        // process new chunks
        var processChunks = function processChunks() {
            var totalProcessing = chunks.filter(function(chunk) {
                return chunk.status === ChunkStatus.PROCESSING;
            }).length;
            if (totalProcessing >= 1) return;
            processChunk();
        };

        var abortChunks = function abortChunks() {
            chunks.forEach(function(chunk) {
                clearTimeout(chunk.timeout);
                if (chunk.request) {
                    chunk.request.abort();
                }
            });
        };

        // let's go!
        if (!state.serverId) {
            requestTransferId(function(serverId) {
                // stop here if aborted, might have happened in between request and callback
                if (state.aborted) return;

                // pass back to item so we can use it if something goes wrong
                transfer(serverId);

                // store internally
                state.serverId = serverId;
                processChunks();
            });
        } else {
            requestTransferOffset(function(offset) {
                // stop here if aborted, might have happened in between request and callback
                if (state.aborted) return;

                // mark chunks with lower offset as complete
                chunks
                    .filter(function(chunk) {
                        return chunk.offset < offset;
                    })
                    .forEach(function(chunk) {
                        chunk.status = ChunkStatus.COMPLETE;
                        chunk.progress = chunk.size;
                    });

                // continue processing
                processChunks();
            });
        }

        return {
            abort: function abort() {
                state.aborted = true;
                abortChunks();
            },
        };
    };

    /*
                                                               function signature:
                                                                 (file, metadata, load, error, progress, abort) => {
                                                                   return {
                                                                   abort:() => {}
                                                                 }
                                                               }
                                                               */
    var createFileProcessorFunction = function createFileProcessorFunction(
        apiUrl,
        action,
        name,
        options
    ) {
        return function(file, metadata, load, error, progress, abort, transfer) {
            // no file received
            if (!file) return;

            // if was passed a file, and we can chunk it, exit here
            var canChunkUpload = options.chunkUploads;
            var shouldChunkUpload = canChunkUpload && file.size > options.chunkSize;
            var willChunkUpload = canChunkUpload && (shouldChunkUpload || options.chunkForce);
            if (file instanceof Blob && willChunkUpload)
                return processFileChunked(
                    apiUrl,
                    action,
                    name,
                    file,
                    metadata,
                    load,
                    error,
                    progress,
                    abort,
                    transfer,
                    options
                );

            // set handlers
            var ondata =
                action.ondata ||
                function(fd) {
                    return fd;
                };
            var onload =
                action.onload ||
                function(res) {
                    return res;
                };
            var onerror =
                action.onerror ||
                function(res) {
                    return null;
                };

            var headers =
                typeof action.headers === 'function'
                    ? action.headers(file, metadata) || {}
                    : Object.assign(
                          {},

                          action.headers
                      );

            var requestParams = Object.assign({}, action, {
                headers: headers,
            });

            // create formdata object
            var formData = new FormData();

            // add metadata under same name
            if (isObject(metadata)) {
                formData.append(name, JSON.stringify(metadata));
            }

            // Turn into an array of objects so no matter what the input, we can handle it the same way
            (file instanceof Blob ? [{ name: null, file: file }] : file).forEach(function(item) {
                formData.append(
                    name,
                    item.file,
                    item.name === null ? item.file.name : '' + item.name + item.file.name
                );
            });

            // send request object
            var request = sendRequest(
                ondata(formData),
                buildURL(apiUrl, action.url),
                requestParams
            );
            request.onload = function(xhr) {
                load(
                    createResponse(
                        'load',
                        xhr.status,
                        onload(xhr.response),
                        xhr.getAllResponseHeaders()
                    )
                );
            };

            request.onerror = function(xhr) {
                error(
                    createResponse(
                        'error',
                        xhr.status,
                        onerror(xhr.response) || xhr.statusText,
                        xhr.getAllResponseHeaders()
                    )
                );
            };

            request.ontimeout = createTimeoutResponse(error);
            request.onprogress = progress;
            request.onabort = abort;

            // should return request
            return request;
        };
    };

    var createProcessorFunction = function createProcessorFunction() {
        var apiUrl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        var action = arguments.length > 1 ? arguments[1] : undefined;
        var name = arguments.length > 2 ? arguments[2] : undefined;
        var options = arguments.length > 3 ? arguments[3] : undefined;

        // custom handler (should also handle file, load, error, progress and abort)
        if (typeof action === 'function')
            return function() {
                for (
                    var _len = arguments.length, params = new Array(_len), _key = 0;
                    _key < _len;
                    _key++
                ) {
                    params[_key] = arguments[_key];
                }
                return action.apply(void 0, [name].concat(params, [options]));
            };

        // no action supplied
        if (!action || !isString(action.url)) return null;

        // internal handler
        return createFileProcessorFunction(apiUrl, action, name, options);
    };

    /*
                                                      function signature:
                                                      (uniqueFileId, load, error) => { }
                                                      */
    var createRevertFunction = function createRevertFunction() {
        var apiUrl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        var action = arguments.length > 1 ? arguments[1] : undefined;
        // is custom implementation
        if (typeof action === 'function') {
            return action;
        }

        // no action supplied, return stub function, interface will work, but file won't be removed
        if (!action || !isString(action.url)) {
            return function(uniqueFileId, load) {
                return load();
            };
        }

        // set onload hanlder
        var onload =
            action.onload ||
            function(res) {
                return res;
            };
        var onerror =
            action.onerror ||
            function(res) {
                return null;
            };

        // internal implementation
        return function(uniqueFileId, load, error) {
            var request = sendRequest(
                uniqueFileId,
                apiUrl + action.url,
                action // contains method, headers and withCredentials properties
            );
            request.onload = function(xhr) {
                load(
                    createResponse(
                        'load',
                        xhr.status,
                        onload(xhr.response),
                        xhr.getAllResponseHeaders()
                    )
                );
            };

            request.onerror = function(xhr) {
                error(
                    createResponse(
                        'error',
                        xhr.status,
                        onerror(xhr.response) || xhr.statusText,
                        xhr.getAllResponseHeaders()
                    )
                );
            };

            request.ontimeout = createTimeoutResponse(error);

            return request;
        };
    };

    var getRandomNumber = function getRandomNumber() {
        var min = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
        return min + Math.random() * (max - min);
    };

    var createPerceivedPerformanceUpdater = function createPerceivedPerformanceUpdater(cb) {
        var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1000;
        var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var tickMin = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 25;
        var tickMax = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 250;
        var timeout = null;
        var start = Date.now();

        var tick = function tick() {
            var runtime = Date.now() - start;
            var delay = getRandomNumber(tickMin, tickMax);

            if (runtime + delay > duration) {
                delay = runtime + delay - duration;
            }

            var progress = runtime / duration;
            if (progress >= 1 || document.hidden) {
                cb(1);
                return;
            }

            cb(progress);

            timeout = setTimeout(tick, delay);
        };

        if (duration > 0) tick();

        return {
            clear: function clear() {
                clearTimeout(timeout);
            },
        };
    };

    var createFileProcessor = function createFileProcessor(processFn, options) {
        var state = {
            complete: false,
            perceivedProgress: 0,
            perceivedPerformanceUpdater: null,
            progress: null,
            timestamp: null,
            perceivedDuration: 0,
            duration: 0,
            request: null,
            response: null,
        };
        var allowMinimumUploadDuration = options.allowMinimumUploadDuration;

        var process = function process(file, metadata) {
            var progressFn = function progressFn() {
                // we've not yet started the real download, stop here
                // the request might not go through, for instance, there might be some server trouble
                // if state.progress is null, the server does not allow computing progress and we show the spinner instead
                if (state.duration === 0 || state.progress === null) return;

                // as we're now processing, fire the progress event
                api.fire('progress', api.getProgress());
            };

            var completeFn = function completeFn() {
                state.complete = true;
                api.fire('load-perceived', state.response.body);
            };

            // let's start processing
            api.fire('start');

            // set request start
            state.timestamp = Date.now();

            // create perceived performance progress indicator
            state.perceivedPerformanceUpdater = createPerceivedPerformanceUpdater(
                function(progress) {
                    state.perceivedProgress = progress;
                    state.perceivedDuration = Date.now() - state.timestamp;

                    progressFn();

                    // if fake progress is done, and a response has been received,
                    // and we've not yet called the complete method
                    if (state.response && state.perceivedProgress === 1 && !state.complete) {
                        // we done!
                        completeFn();
                    }
                },
                // random delay as in a list of files you start noticing
                // files uploading at the exact same speed
                allowMinimumUploadDuration ? getRandomNumber(750, 1500) : 0
            );

            // remember request so we can abort it later
            state.request = processFn(
                // the file to process
                file,

                // the metadata to send along
                metadata,

                // callbacks (load, error, progress, abort, transfer)
                // load expects the body to be a server id if
                // you want to make use of revert
                function(response) {
                    // we put the response in state so we can access
                    // it outside of this method
                    state.response = isObject(response)
                        ? response
                        : {
                              type: 'load',
                              code: 200,
                              body: '' + response,
                              headers: {},
                          };

                    // update duration
                    state.duration = Date.now() - state.timestamp;

                    // force progress to 1 as we're now done
                    state.progress = 1;

                    // actual load is done let's share results
                    api.fire('load', state.response.body);

                    // we are really done
                    // if perceived progress is 1 ( wait for perceived progress to complete )
                    // or if server does not support progress ( null )
                    if (
                        !allowMinimumUploadDuration ||
                        (allowMinimumUploadDuration && state.perceivedProgress === 1)
                    ) {
                        completeFn();
                    }
                },

                // error is expected to be an object with type, code, body
                function(error) {
                    // cancel updater
                    state.perceivedPerformanceUpdater.clear();

                    // update others about this error
                    api.fire(
                        'error',
                        isObject(error)
                            ? error
                            : {
                                  type: 'error',
                                  code: 0,
                                  body: '' + error,
                              }
                    );
                },

                // actual processing progress
                function(computable, current, total) {
                    // update actual duration
                    state.duration = Date.now() - state.timestamp;

                    // update actual progress
                    state.progress = computable ? current / total : null;

                    progressFn();
                },

                // abort does not expect a value
                function() {
                    // stop updater
                    state.perceivedPerformanceUpdater.clear();

                    // fire the abort event so we can switch visuals
                    api.fire('abort', state.response ? state.response.body : null);
                },

                // register the id for this transfer
                function(transferId) {
                    api.fire('transfer', transferId);
                }
            );
        };

        var abort = function abort() {
            // no request running, can't abort
            if (!state.request) return;

            // stop updater
            state.perceivedPerformanceUpdater.clear();

            // abort actual request
            if (state.request.abort) state.request.abort();

            // if has response object, we've completed the request
            state.complete = true;
        };

        var reset = function reset() {
            abort();
            state.complete = false;
            state.perceivedProgress = 0;
            state.progress = 0;
            state.timestamp = null;
            state.perceivedDuration = 0;
            state.duration = 0;
            state.request = null;
            state.response = null;
        };

        var getProgress = allowMinimumUploadDuration
            ? function() {
                  return state.progress ? Math.min(state.progress, state.perceivedProgress) : null;
              }
            : function() {
                  return state.progress || null;
              };

        var getDuration = allowMinimumUploadDuration
            ? function() {
                  return Math.min(state.duration, state.perceivedDuration);
              }
            : function() {
                  return state.duration;
              };

        var api = Object.assign({}, on(), {
            process: process, // start processing file
            abort: abort, // abort active process request
            getProgress: getProgress,
            getDuration: getDuration,
            reset: reset,
        });

        return api;
    };

    var getFilenameWithoutExtension = function getFilenameWithoutExtension(name) {
        return name.substring(0, name.lastIndexOf('.')) || name;
    };

    var createFileStub = function createFileStub(source) {
        var data = [source.name, source.size, source.type];

        // is blob or base64, then we need to set the name
        if (source instanceof Blob || isBase64DataURI(source)) {
            data[0] = source.name || getDateString();
        } else if (isBase64DataURI(source)) {
            // if is base64 data uri we need to determine the average size and type
            data[1] = source.length;
            data[2] = getMimeTypeFromBase64DataURI(source);
        } else if (isString(source)) {
            // url
            data[0] = getFilenameFromURL(source);
            data[1] = 0;
            data[2] = 'application/octet-stream';
        }

        return {
            name: data[0],
            size: data[1],
            type: data[2],
        };
    };

    var isFile = function isFile(value) {
        return !!(value instanceof File || (value instanceof Blob && value.name));
    };

    var deepCloneObject = function deepCloneObject(src) {
        if (!isObject(src)) return src;
        var target = isArray(src) ? [] : {};
        for (var key in src) {
            if (!src.hasOwnProperty(key)) continue;
            var v = src[key];
            target[key] = v && isObject(v) ? deepCloneObject(v) : v;
        }
        return target;
    };

    var createItem = function createItem() {
        var origin = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        var serverFileReference =
            arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var file = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
        // unique id for this item, is used to identify the item across views
        var id = getUniqueId();

        /**
         * Internal item state
         */
        var state = {
            // is archived
            archived: false,

            // if is frozen, no longer fires events
            frozen: false,

            // removed from view
            released: false,

            // original source
            source: null,

            // file model reference
            file: file,

            // id of file on server
            serverFileReference: serverFileReference,

            // id of file transfer on server
            transferId: null,

            // is aborted
            processingAborted: false,

            // current item status
            status: serverFileReference ? ItemStatus.PROCESSING_COMPLETE : ItemStatus.INIT,

            // active processes
            activeLoader: null,
            activeProcessor: null,
        };

        // callback used when abort processing is called to link back to the resolve method
        var abortProcessingRequestComplete = null;

        /**
         * Externally added item metadata
         */
        var metadata = {};

        // item data
        var setStatus = function setStatus(status) {
            return (state.status = status);
        };

        // fire event unless the item has been archived
        var fire = function fire(event) {
            if (state.released || state.frozen) return;
            for (
                var _len = arguments.length, params = new Array(_len > 1 ? _len - 1 : 0), _key = 1;
                _key < _len;
                _key++
            ) {
                params[_key - 1] = arguments[_key];
            }
            api.fire.apply(api, [event].concat(params));
        };

        // file data
        var getFileExtension = function getFileExtension() {
            return getExtensionFromFilename(state.file.name);
        };
        var getFileType = function getFileType() {
            return state.file.type;
        };
        var getFileSize = function getFileSize() {
            return state.file.size;
        };
        var getFile = function getFile() {
            return state.file;
        };

        //
        // logic to load a file
        //
        var load = function load(source, loader, onload) {
            // remember the original item source
            state.source = source;

            // source is known
            api.fireSync('init');

            // file stub is already there
            if (state.file) {
                api.fireSync('load-skip');
                return;
            }

            // set a stub file object while loading the actual data
            state.file = createFileStub(source);

            // starts loading
            loader.on('init', function() {
                fire('load-init');
            });

            // we'eve received a size indication, let's update the stub
            loader.on('meta', function(meta) {
                // set size of file stub
                state.file.size = meta.size;

                // set name of file stub
                state.file.filename = meta.filename;

                // if has received source, we done
                if (meta.source) {
                    origin = FileOrigin.LIMBO;
                    state.serverFileReference = meta.source;
                    state.status = ItemStatus.PROCESSING_COMPLETE;
                }

                // size has been updated
                fire('load-meta');
            });

            // the file is now loading we need to update the progress indicators
            loader.on('progress', function(progress) {
                setStatus(ItemStatus.LOADING);

                fire('load-progress', progress);
            });

            // an error was thrown while loading the file, we need to switch to error state
            loader.on('error', function(error) {
                setStatus(ItemStatus.LOAD_ERROR);

                fire('load-request-error', error);
            });

            // user or another process aborted the file load (cannot retry)
            loader.on('abort', function() {
                setStatus(ItemStatus.INIT);
                fire('load-abort');
            });

            // done loading
            loader.on('load', function(file) {
                // as we've now loaded the file the loader is no longer required
                state.activeLoader = null;

                // called when file has loaded succesfully
                var success = function success(result) {
                    // set (possibly) transformed file
                    state.file = isFile(result) ? result : state.file;

                    // file received
                    if (origin === FileOrigin.LIMBO && state.serverFileReference) {
                        setStatus(ItemStatus.PROCESSING_COMPLETE);
                    } else {
                        setStatus(ItemStatus.IDLE);
                    }

                    fire('load');
                };

                var error = function error(result) {
                    // set original file
                    state.file = file;
                    fire('load-meta');

                    setStatus(ItemStatus.LOAD_ERROR);
                    fire('load-file-error', result);
                };

                // if we already have a server file reference, we don't need to call the onload method
                if (state.serverFileReference) {
                    success(file);
                    return;
                }

                // no server id, let's give this file the full treatment
                onload(file, success, error);
            });

            // set loader source data
            loader.setSource(source);

            // set as active loader
            state.activeLoader = loader;

            // load the source data
            loader.load();
        };

        var retryLoad = function retryLoad() {
            if (!state.activeLoader) {
                return;
            }
            state.activeLoader.load();
        };

        var abortLoad = function abortLoad() {
            if (state.activeLoader) {
                state.activeLoader.abort();
                return;
            }
            setStatus(ItemStatus.INIT);
            fire('load-abort');
        };

        //
        // logic to process a file
        //
        var process = function process(processor, onprocess) {
            // processing was aborted
            if (state.processingAborted) {
                state.processingAborted = false;
                return;
            }

            // now processing
            setStatus(ItemStatus.PROCESSING);

            // reset abort callback
            abortProcessingRequestComplete = null;

            // if no file loaded we'll wait for the load event
            if (!(state.file instanceof Blob)) {
                api.on('load', function() {
                    process(processor, onprocess);
                });
                return;
            }

            // setup processor
            processor.on('load', function(serverFileReference) {
                // need this id to be able to revert the upload
                state.transferId = null;
                state.serverFileReference = serverFileReference;
            });

            // register transfer id
            processor.on('transfer', function(transferId) {
                // need this id to be able to revert the upload
                state.transferId = transferId;
            });

            processor.on('load-perceived', function(serverFileReference) {
                // no longer required
                state.activeProcessor = null;

                // need this id to be able to rever the upload
                state.transferId = null;
                state.serverFileReference = serverFileReference;

                setStatus(ItemStatus.PROCESSING_COMPLETE);
                fire('process-complete', serverFileReference);
            });

            processor.on('start', function() {
                fire('process-start');
            });

            processor.on('error', function(error) {
                state.activeProcessor = null;
                setStatus(ItemStatus.PROCESSING_ERROR);
                fire('process-error', error);
            });

            processor.on('abort', function(serverFileReference) {
                state.activeProcessor = null;

                // if file was uploaded but processing was cancelled during perceived processor time store file reference
                state.serverFileReference = serverFileReference;

                setStatus(ItemStatus.IDLE);
                fire('process-abort');

                // has timeout so doesn't interfere with remove action
                if (abortProcessingRequestComplete) {
                    abortProcessingRequestComplete();
                }
            });

            processor.on('progress', function(progress) {
                fire('process-progress', progress);
            });

            // when successfully transformed
            var success = function success(file) {
                // if was archived in the mean time, don't process
                if (state.archived) return;

                // process file!
                processor.process(file, Object.assign({}, metadata));
            };

            // something went wrong during transform phase
            var error = console.error;

            // start processing the file
            onprocess(state.file, success, error);

            // set as active processor
            state.activeProcessor = processor;
        };

        var requestProcessing = function requestProcessing() {
            state.processingAborted = false;
            setStatus(ItemStatus.PROCESSING_QUEUED);
        };

        var abortProcessing = function abortProcessing() {
            return new Promise(function(resolve) {
                if (!state.activeProcessor) {
                    state.processingAborted = true;

                    setStatus(ItemStatus.IDLE);
                    fire('process-abort');

                    resolve();
                    return;
                }

                abortProcessingRequestComplete = function abortProcessingRequestComplete() {
                    resolve();
                };

                state.activeProcessor.abort();
            });
        };

        //
        // logic to revert a processed file
        //
        var revert = function revert(revertFileUpload, forceRevert) {
            return new Promise(function(resolve, reject) {
                // a completed upload will have a serverFileReference, a failed chunked upload where
                // getting a serverId succeeded but >=0 chunks have been uploaded will have transferId set
                var serverTransferId =
                    state.serverFileReference !== null
                        ? state.serverFileReference
                        : state.transferId;

                // cannot revert without a server id for this process
                if (serverTransferId === null) {
                    resolve();
                    return;
                }

                // revert the upload (fire and forget)
                revertFileUpload(
                    serverTransferId,
                    function() {
                        // reset file server id and transfer id as now it's not available on the server
                        state.serverFileReference = null;
                        state.transferId = null;
                        resolve();
                    },
                    function(error) {
                        // don't set error state when reverting is optional, it will always resolve
                        if (!forceRevert) {
                            resolve();
                            return;
                        }

                        // oh no errors
                        setStatus(ItemStatus.PROCESSING_REVERT_ERROR);
                        fire('process-revert-error');
                        reject(error);
                    }
                );

                // fire event
                setStatus(ItemStatus.IDLE);
                fire('process-revert');
            });
        };

        // exposed methods
        var _setMetadata = function setMetadata(key, value, silent) {
            var keys = key.split('.');
            var root = keys[0];
            var last = keys.pop();
            var data = metadata;
            keys.forEach(function(key) {
                return (data = data[key]);
            });

            // compare old value against new value, if they're the same, we're not updating
            if (JSON.stringify(data[last]) === JSON.stringify(value)) return;

            // update value
            data[last] = value;

            // fire update
            fire('metadata-update', {
                key: root,
                value: metadata[root],
                silent: silent,
            });
        };

        var getMetadata = function getMetadata(key) {
            return deepCloneObject(key ? metadata[key] : metadata);
        };

        var api = Object.assign(
            {
                id: {
                    get: function get() {
                        return id;
                    },
                },
                origin: {
                    get: function get() {
                        return origin;
                    },
                    set: function set(value) {
                        return (origin = value);
                    },
                },
                serverId: {
                    get: function get() {
                        return state.serverFileReference;
                    },
                },
                transferId: {
                    get: function get() {
                        return state.transferId;
                    },
                },
                status: {
                    get: function get() {
                        return state.status;
                    },
                },
                filename: {
                    get: function get() {
                        return state.file.name;
                    },
                },
                filenameWithoutExtension: {
                    get: function get() {
                        return getFilenameWithoutExtension(state.file.name);
                    },
                },
                fileExtension: { get: getFileExtension },
                fileType: { get: getFileType },
                fileSize: { get: getFileSize },
                file: { get: getFile },
                relativePath: {
                    get: function get() {
                        return state.file._relativePath;
                    },
                },

                source: {
                    get: function get() {
                        return state.source;
                    },
                },

                getMetadata: getMetadata,
                setMetadata: function setMetadata(key, value, silent) {
                    if (isObject(key)) {
                        var data = key;
                        Object.keys(data).forEach(function(key) {
                            _setMetadata(key, data[key], value);
                        });
                        return key;
                    }
                    _setMetadata(key, value, silent);
                    return value;
                },

                extend: function extend(name, handler) {
                    return (itemAPI[name] = handler);
                },

                abortLoad: abortLoad,
                retryLoad: retryLoad,
                requestProcessing: requestProcessing,
                abortProcessing: abortProcessing,

                load: load,
                process: process,
                revert: revert,
            },

            on(),
            {
                freeze: function freeze() {
                    return (state.frozen = true);
                },

                release: function release() {
                    return (state.released = true);
                },
                released: {
                    get: function get() {
                        return state.released;
                    },
                },

                archive: function archive() {
                    return (state.archived = true);
                },
                archived: {
                    get: function get() {
                        return state.archived;
                    },
                },

                // replace source and file object
                setFile: function setFile(file) {
                    return (state.file = file);
                },
            }
        );

        // create it here instead of returning it instantly so we can extend it later
        var itemAPI = createObject(api);

        return itemAPI;
    };

    var getItemIndexByQuery = function getItemIndexByQuery(items, query) {
        // just return first index
        if (isEmpty(query)) {
            return 0;
        }

        // invalid queries
        if (!isString(query)) {
            return -1;
        }

        // return item by id (or -1 if not found)
        return items.findIndex(function(item) {
            return item.id === query;
        });
    };

    var getItemById = function getItemById(items, itemId) {
        var index = getItemIndexByQuery(items, itemId);
        if (index < 0) {
            return;
        }
        return items[index] || null;
    };

    var fetchBlob = function fetchBlob(url, load, error, progress, abort, headers) {
        var request = sendRequest(null, url, {
            method: 'GET',
            responseType: 'blob',
        });

        request.onload = function(xhr) {
            // get headers
            var headers = xhr.getAllResponseHeaders();

            // get filename
            var filename = getFileInfoFromHeaders(headers).name || getFilenameFromURL(url);

            // create response
            load(
                createResponse('load', xhr.status, getFileFromBlob(xhr.response, filename), headers)
            );
        };

        request.onerror = function(xhr) {
            error(createResponse('error', xhr.status, xhr.statusText, xhr.getAllResponseHeaders()));
        };

        request.onheaders = function(xhr) {
            headers(createResponse('headers', xhr.status, null, xhr.getAllResponseHeaders()));
        };

        request.ontimeout = createTimeoutResponse(error);
        request.onprogress = progress;
        request.onabort = abort;

        // should return request
        return request;
    };

    var getDomainFromURL = function getDomainFromURL(url) {
        if (url.indexOf('//') === 0) {
            url = location.protocol + url;
        }
        return url
            .toLowerCase()
            .replace('blob:', '')
            .replace(/([a-z])?:\/\//, '$1')
            .split('/')[0];
    };

    var isExternalURL = function isExternalURL(url) {
        return (
            (url.indexOf(':') > -1 || url.indexOf('//') > -1) &&
            getDomainFromURL(location.href) !== getDomainFromURL(url)
        );
    };

    var dynamicLabel = function dynamicLabel(label) {
        return function() {
            return isFunction(label) ? label.apply(void 0, arguments) : label;
        };
    };

    var isMockItem = function isMockItem(item) {
        return !isFile(item.file);
    };

    var listUpdated = function listUpdated(dispatch, state) {
        clearTimeout(state.listUpdateTimeout);
        state.listUpdateTimeout = setTimeout(function() {
            dispatch('DID_UPDATE_ITEMS', { items: getActiveItems(state.items) });
        }, 0);
    };

    var optionalPromise = function optionalPromise(fn) {
        for (
            var _len = arguments.length, params = new Array(_len > 1 ? _len - 1 : 0), _key = 1;
            _key < _len;
            _key++
        ) {
            params[_key - 1] = arguments[_key];
        }
        return new Promise(function(resolve) {
            if (!fn) {
                return resolve(true);
            }

            var result = fn.apply(void 0, params);

            if (result == null) {
                return resolve(true);
            }

            if (typeof result === 'boolean') {
                return resolve(result);
            }

            if (typeof result.then === 'function') {
                result.then(resolve);
            }
        });
    };

    var sortItems = function sortItems(state, compare) {
        state.items.sort(function(a, b) {
            return compare(createItemAPI(a), createItemAPI(b));
        });
    };

    // returns item based on state
    var getItemByQueryFromState = function getItemByQueryFromState(state, itemHandler) {
        return function() {
            var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            var query = _ref.query,
                _ref$success = _ref.success,
                success = _ref$success === void 0 ? function() {} : _ref$success,
                _ref$failure = _ref.failure,
                failure = _ref$failure === void 0 ? function() {} : _ref$failure,
                options = _objectWithoutProperties(_ref, ['query', 'success', 'failure']);
            var item = getItemByQuery(state.items, query);
            if (!item) {
                failure({
                    error: createResponse('error', 0, 'Item not found'),
                    file: null,
                });

                return;
            }
            itemHandler(item, success, failure, options || {});
        };
    };

    var actions = function actions(dispatch, query, state) {
        return {
            /**
             * Aborts all ongoing processes
             */
            ABORT_ALL: function ABORT_ALL() {
                getActiveItems(state.items).forEach(function(item) {
                    item.freeze();
                    item.abortLoad();
                    item.abortProcessing();
                });
            },

            /**
             * Sets initial files
             */
            DID_SET_FILES: function DID_SET_FILES(_ref2) {
                var _ref2$value = _ref2.value,
                    value = _ref2$value === void 0 ? [] : _ref2$value;
                // map values to file objects
                var files = value.map(function(file) {
                    return {
                        source: file.source ? file.source : file,
                        options: file.options,
                    };
                });

                // loop over files, if file is in list, leave it be, if not, remove
                // test if items should be moved
                var activeItems = getActiveItems(state.items);

                activeItems.forEach(function(item) {
                    // if item not is in new value, remove
                    if (
                        !files.find(function(file) {
                            return file.source === item.source || file.source === item.file;
                        })
                    ) {
                        dispatch('REMOVE_ITEM', { query: item, remove: false });
                    }
                });

                // add new files
                activeItems = getActiveItems(state.items);
                files.forEach(function(file, index) {
                    // if file is already in list
                    if (
                        activeItems.find(function(item) {
                            return item.source === file.source || item.file === file.source;
                        })
                    )
                        return;

                    // not in list, add
                    dispatch(
                        'ADD_ITEM',
                        Object.assign({}, file, {
                            interactionMethod: InteractionMethod.NONE,
                            index: index,
                        })
                    );
                });
            },

            DID_UPDATE_ITEM_METADATA: function DID_UPDATE_ITEM_METADATA(_ref3) {
                var id = _ref3.id,
                    action = _ref3.action,
                    change = _ref3.change;
                // don't do anything
                if (change.silent) return;

                // if is called multiple times in close succession we combined all calls together to save resources
                clearTimeout(state.itemUpdateTimeout);
                state.itemUpdateTimeout = setTimeout(function() {
                    var item = getItemById(state.items, id);

                    // only revert and attempt to upload when we're uploading to a server
                    if (!query('IS_ASYNC')) {
                        // should we update the output data
                        applyFilterChain('SHOULD_PREPARE_OUTPUT', false, {
                            item: item,
                            query: query,
                            action: action,
                            change: change,
                        }).then(function(shouldPrepareOutput) {
                            // plugins determined the output data should be prepared (or not), can be adjusted with beforePrepareOutput hook
                            var beforePrepareFile = query('GET_BEFORE_PREPARE_FILE');
                            if (beforePrepareFile)
                                shouldPrepareOutput = beforePrepareFile(item, shouldPrepareOutput);

                            if (!shouldPrepareOutput) return;

                            dispatch(
                                'REQUEST_PREPARE_OUTPUT',
                                {
                                    query: id,
                                    item: item,
                                    success: function success(file) {
                                        dispatch('DID_PREPARE_OUTPUT', { id: id, file: file });
                                    },
                                },

                                true
                            );
                        });

                        return;
                    }

                    // if is local item we need to enable upload button so change can be propagated to server
                    if (item.origin === FileOrigin.LOCAL) {
                        dispatch('DID_LOAD_ITEM', {
                            id: item.id,
                            error: null,
                            serverFileReference: item.source,
                        });
                    }

                    // for async scenarios
                    var upload = function upload() {
                        // we push this forward a bit so the interface is updated correctly
                        setTimeout(function() {
                            dispatch('REQUEST_ITEM_PROCESSING', { query: id });
                        }, 32);
                    };

                    var revert = function revert(doUpload) {
                        item.revert(
                            createRevertFunction(
                                state.options.server.url,
                                state.options.server.revert
                            ),
                            query('GET_FORCE_REVERT')
                        )
                            .then(doUpload ? upload : function() {})
                            .catch(function() {});
                    };

                    var abort = function abort(doUpload) {
                        item.abortProcessing().then(doUpload ? upload : function() {});
                    };

                    // if we should re-upload the file immediately
                    if (item.status === ItemStatus.PROCESSING_COMPLETE) {
                        return revert(state.options.instantUpload);
                    }

                    // if currently uploading, cancel upload
                    if (item.status === ItemStatus.PROCESSING) {
                        return abort(state.options.instantUpload);
                    }

                    if (state.options.instantUpload) {
                        upload();
                    }
                }, 0);
            },

            MOVE_ITEM: function MOVE_ITEM(_ref4) {
                var query = _ref4.query,
                    index = _ref4.index;
                var item = getItemByQuery(state.items, query);
                if (!item) return;
                var currentIndex = state.items.indexOf(item);
                index = limit(index, 0, state.items.length - 1);
                if (currentIndex === index) return;
                state.items.splice(index, 0, state.items.splice(currentIndex, 1)[0]);
            },

            SORT: function SORT(_ref5) {
                var compare = _ref5.compare;
                sortItems(state, compare);
                dispatch('DID_SORT_ITEMS', {
                    items: query('GET_ACTIVE_ITEMS'),
                });
            },

            ADD_ITEMS: function ADD_ITEMS(_ref6) {
                var items = _ref6.items,
                    index = _ref6.index,
                    interactionMethod = _ref6.interactionMethod,
                    _ref6$success = _ref6.success,
                    success = _ref6$success === void 0 ? function() {} : _ref6$success,
                    _ref6$failure = _ref6.failure,
                    failure = _ref6$failure === void 0 ? function() {} : _ref6$failure;
                var currentIndex = index;

                if (index === -1 || typeof index === 'undefined') {
                    var insertLocation = query('GET_ITEM_INSERT_LOCATION');
                    var totalItems = query('GET_TOTAL_ITEMS');
                    currentIndex = insertLocation === 'before' ? 0 : totalItems;
                }

                var ignoredFiles = query('GET_IGNORED_FILES');
                var isValidFile = function isValidFile(source) {
                    return isFile(source)
                        ? !ignoredFiles.includes(source.name.toLowerCase())
                        : !isEmpty(source);
                };
                var validItems = items.filter(isValidFile);

                var promises = validItems.map(function(source) {
                    return new Promise(function(resolve, reject) {
                        dispatch('ADD_ITEM', {
                            interactionMethod: interactionMethod,
                            source: source.source || source,
                            success: resolve,
                            failure: reject,
                            index: currentIndex++,
                            options: source.options || {},
                        });
                    });
                });

                Promise.all(promises)
                    .then(success)
                    .catch(failure);
            },

            /**
             * @param source
             * @param index
             * @param interactionMethod
             */
            ADD_ITEM: function ADD_ITEM(_ref7) {
                var source = _ref7.source,
                    _ref7$index = _ref7.index,
                    index = _ref7$index === void 0 ? -1 : _ref7$index,
                    interactionMethod = _ref7.interactionMethod,
                    _ref7$success = _ref7.success,
                    success = _ref7$success === void 0 ? function() {} : _ref7$success,
                    _ref7$failure = _ref7.failure,
                    failure = _ref7$failure === void 0 ? function() {} : _ref7$failure,
                    _ref7$options = _ref7.options,
                    options = _ref7$options === void 0 ? {} : _ref7$options;
                // if no source supplied
                if (isEmpty(source)) {
                    failure({
                        error: createResponse('error', 0, 'No source'),
                        file: null,
                    });

                    return;
                }

                // filter out invalid file items, used to filter dropped directory contents
                if (
                    isFile(source) &&
                    state.options.ignoredFiles.includes(source.name.toLowerCase())
                ) {
                    // fail silently
                    return;
                }

                // test if there's still room in the list of files
                if (!hasRoomForItem(state)) {
                    // if multiple allowed, we can't replace
                    // or if only a single item is allowed but we're not allowed to replace it we exit
                    if (
                        state.options.allowMultiple ||
                        (!state.options.allowMultiple && !state.options.allowReplace)
                    ) {
                        var error = createResponse('warning', 0, 'Max files');

                        dispatch('DID_THROW_MAX_FILES', {
                            source: source,
                            error: error,
                        });

                        failure({ error: error, file: null });

                        return;
                    }

                    // let's replace the item
                    // id of first item we're about to remove
                    var _item = getActiveItems(state.items)[0];

                    // if has been processed remove it from the server as well
                    if (
                        _item.status === ItemStatus.PROCESSING_COMPLETE ||
                        _item.status === ItemStatus.PROCESSING_REVERT_ERROR
                    ) {
                        var forceRevert = query('GET_FORCE_REVERT');
                        _item
                            .revert(
                                createRevertFunction(
                                    state.options.server.url,
                                    state.options.server.revert
                                ),
                                forceRevert
                            )
                            .then(function() {
                                if (!forceRevert) return;

                                // try to add now
                                dispatch('ADD_ITEM', {
                                    source: source,
                                    index: index,
                                    interactionMethod: interactionMethod,
                                    success: success,
                                    failure: failure,
                                    options: options,
                                });
                            })
                            .catch(function() {}); // no need to handle this catch state for now

                        if (forceRevert) return;
                    }

                    // remove first item as it will be replaced by this item
                    dispatch('REMOVE_ITEM', { query: _item.id });
                }

                // where did the file originate
                var origin =
                    options.type === 'local'
                        ? FileOrigin.LOCAL
                        : options.type === 'limbo'
                        ? FileOrigin.LIMBO
                        : FileOrigin.INPUT;

                // create a new blank item
                var item = createItem(
                    // where did this file come from
                    origin,

                    // an input file never has a server file reference
                    origin === FileOrigin.INPUT ? null : source,

                    // file mock data, if defined
                    options.file
                );

                // set initial meta data
                Object.keys(options.metadata || {}).forEach(function(key) {
                    item.setMetadata(key, options.metadata[key]);
                });

                // created the item, let plugins add methods
                applyFilters('DID_CREATE_ITEM', item, { query: query, dispatch: dispatch });

                // where to insert new items
                var itemInsertLocation = query('GET_ITEM_INSERT_LOCATION');

                // adjust index if is not allowed to pick location
                if (!state.options.itemInsertLocationFreedom) {
                    index = itemInsertLocation === 'before' ? -1 : state.items.length;
                }

                // add item to list
                insertItem(state.items, item, index);

                // sort items in list
                if (isFunction(itemInsertLocation) && source) {
                    sortItems(state, itemInsertLocation);
                }

                // get a quick reference to the item id
                var id = item.id;

                // observe item events
                item.on('init', function() {
                    dispatch('DID_INIT_ITEM', { id: id });
                });

                item.on('load-init', function() {
                    dispatch('DID_START_ITEM_LOAD', { id: id });
                });

                item.on('load-meta', function() {
                    dispatch('DID_UPDATE_ITEM_META', { id: id });
                });

                item.on('load-progress', function(progress) {
                    dispatch('DID_UPDATE_ITEM_LOAD_PROGRESS', { id: id, progress: progress });
                });

                item.on('load-request-error', function(error) {
                    var mainStatus = dynamicLabel(state.options.labelFileLoadError)(error);

                    // is client error, no way to recover
                    if (error.code >= 400 && error.code < 500) {
                        dispatch('DID_THROW_ITEM_INVALID', {
                            id: id,
                            error: error,
                            status: {
                                main: mainStatus,
                                sub: error.code + ' (' + error.body + ')',
                            },
                        });

                        // reject the file so can be dealt with through API
                        failure({ error: error, file: createItemAPI(item) });
                        return;
                    }

                    // is possible server error, so might be possible to retry
                    dispatch('DID_THROW_ITEM_LOAD_ERROR', {
                        id: id,
                        error: error,
                        status: {
                            main: mainStatus,
                            sub: state.options.labelTapToRetry,
                        },
                    });
                });

                item.on('load-file-error', function(error) {
                    dispatch('DID_THROW_ITEM_INVALID', {
                        id: id,
                        error: error.status,
                        status: error.status,
                    });

                    failure({ error: error.status, file: createItemAPI(item) });
                });

                item.on('load-abort', function() {
                    dispatch('REMOVE_ITEM', { query: id });
                });

                item.on('load-skip', function() {
                    item.on('metadata-update', function(change) {
                        if (!isFile(item.file)) return;
                        dispatch('DID_UPDATE_ITEM_METADATA', { id: id, change: change });
                    });

                    dispatch('COMPLETE_LOAD_ITEM', {
                        query: id,
                        item: item,
                        data: {
                            source: source,
                            success: success,
                        },
                    });
                });

                item.on('load', function() {
                    var handleAdd = function handleAdd(shouldAdd) {
                        // no should not add this file
                        if (!shouldAdd) {
                            dispatch('REMOVE_ITEM', {
                                query: id,
                            });

                            return;
                        }

                        // now interested in metadata updates
                        item.on('metadata-update', function(change) {
                            dispatch('DID_UPDATE_ITEM_METADATA', { id: id, change: change });
                        });

                        // let plugins decide if the output data should be prepared at this point
                        // means we'll do this and wait for idle state
                        applyFilterChain('SHOULD_PREPARE_OUTPUT', false, {
                            item: item,
                            query: query,
                        }).then(function(shouldPrepareOutput) {
                            // plugins determined the output data should be prepared (or not), can be adjusted with beforePrepareOutput hook
                            var beforePrepareFile = query('GET_BEFORE_PREPARE_FILE');
                            if (beforePrepareFile)
                                shouldPrepareOutput = beforePrepareFile(item, shouldPrepareOutput);

                            var loadComplete = function loadComplete() {
                                dispatch('COMPLETE_LOAD_ITEM', {
                                    query: id,
                                    item: item,
                                    data: {
                                        source: source,
                                        success: success,
                                    },
                                });

                                listUpdated(dispatch, state);
                            };

                            // exit
                            if (shouldPrepareOutput) {
                                // wait for idle state and then run PREPARE_OUTPUT
                                dispatch(
                                    'REQUEST_PREPARE_OUTPUT',
                                    {
                                        query: id,
                                        item: item,
                                        success: function success(file) {
                                            dispatch('DID_PREPARE_OUTPUT', { id: id, file: file });
                                            loadComplete();
                                        },
                                    },

                                    true
                                );

                                return;
                            }

                            loadComplete();
                        });
                    };

                    // item loaded, allow plugins to
                    // - read data (quickly)
                    // - add metadata
                    applyFilterChain('DID_LOAD_ITEM', item, { query: query, dispatch: dispatch })
                        .then(function() {
                            optionalPromise(query('GET_BEFORE_ADD_FILE'), createItemAPI(item)).then(
                                handleAdd
                            );
                        })
                        .catch(function(e) {
                            if (!e || !e.error || !e.status) return handleAdd(false);
                            dispatch('DID_THROW_ITEM_INVALID', {
                                id: id,
                                error: e.error,
                                status: e.status,
                            });
                        });
                });

                item.on('process-start', function() {
                    dispatch('DID_START_ITEM_PROCESSING', { id: id });
                });

                item.on('process-progress', function(progress) {
                    dispatch('DID_UPDATE_ITEM_PROCESS_PROGRESS', { id: id, progress: progress });
                });

                item.on('process-error', function(error) {
                    dispatch('DID_THROW_ITEM_PROCESSING_ERROR', {
                        id: id,
                        error: error,
                        status: {
                            main: dynamicLabel(state.options.labelFileProcessingError)(error),
                            sub: state.options.labelTapToRetry,
                        },
                    });
                });

                item.on('process-revert-error', function(error) {
                    dispatch('DID_THROW_ITEM_PROCESSING_REVERT_ERROR', {
                        id: id,
                        error: error,
                        status: {
                            main: dynamicLabel(state.options.labelFileProcessingRevertError)(error),
                            sub: state.options.labelTapToRetry,
                        },
                    });
                });

                item.on('process-complete', function(serverFileReference) {
                    dispatch('DID_COMPLETE_ITEM_PROCESSING', {
                        id: id,
                        error: null,
                        serverFileReference: serverFileReference,
                    });

                    dispatch('DID_DEFINE_VALUE', { id: id, value: serverFileReference });
                });

                item.on('process-abort', function() {
                    dispatch('DID_ABORT_ITEM_PROCESSING', { id: id });
                });

                item.on('process-revert', function() {
                    dispatch('DID_REVERT_ITEM_PROCESSING', { id: id });
                    dispatch('DID_DEFINE_VALUE', { id: id, value: null });
                });

                // let view know the item has been inserted
                dispatch('DID_ADD_ITEM', {
                    id: id,
                    index: index,
                    interactionMethod: interactionMethod,
                });

                listUpdated(dispatch, state);

                // start loading the source
                var _ref8 = state.options.server || {},
                    url = _ref8.url,
                    load = _ref8.load,
                    restore = _ref8.restore,
                    fetch = _ref8.fetch;

                item.load(
                    source,

                    // this creates a function that loads the file based on the type of file (string, base64, blob, file) and location of file (local, remote, limbo)
                    createFileLoader(
                        origin === FileOrigin.INPUT
                            ? // input, if is remote, see if should use custom fetch, else use default fetchBlob
                              isString(source) && isExternalURL(source)
                                ? fetch
                                    ? createFetchFunction(url, fetch)
                                    : fetchBlob // remote url
                                : fetchBlob // try to fetch url
                            : // limbo or local
                            origin === FileOrigin.LIMBO
                            ? createFetchFunction(url, restore) // limbo
                            : createFetchFunction(url, load) // local
                    ),

                    // called when the file is loaded so it can be piped through the filters
                    function(file, success, error) {
                        // let's process the file
                        applyFilterChain('LOAD_FILE', file, { query: query })
                            .then(success)
                            .catch(error);
                    }
                );
            },

            REQUEST_PREPARE_OUTPUT: function REQUEST_PREPARE_OUTPUT(_ref9) {
                var item = _ref9.item,
                    success = _ref9.success,
                    _ref9$failure = _ref9.failure,
                    failure = _ref9$failure === void 0 ? function() {} : _ref9$failure;
                // error response if item archived
                var err = {
                    error: createResponse('error', 0, 'Item not found'),
                    file: null,
                };

                // don't handle archived items, an item could have been archived (load aborted) while waiting to be prepared
                if (item.archived) return failure(err);

                // allow plugins to alter the file data
                applyFilterChain('PREPARE_OUTPUT', item.file, { query: query, item: item }).then(
                    function(result) {
                        applyFilterChain('COMPLETE_PREPARE_OUTPUT', result, {
                            query: query,
                            item: item,
                        }).then(function(result) {
                            // don't handle archived items, an item could have been archived (load aborted) while being prepared
                            if (item.archived) return failure(err);

                            // we done!
                            success(result);
                        });
                    }
                );
            },

            COMPLETE_LOAD_ITEM: function COMPLETE_LOAD_ITEM(_ref10) {
                var item = _ref10.item,
                    data = _ref10.data;
                var success = data.success,
                    source = data.source;

                // sort items in list
                var itemInsertLocation = query('GET_ITEM_INSERT_LOCATION');
                if (isFunction(itemInsertLocation) && source) {
                    sortItems(state, itemInsertLocation);
                }

                // let interface know the item has loaded
                dispatch('DID_LOAD_ITEM', {
                    id: item.id,
                    error: null,
                    serverFileReference: item.origin === FileOrigin.INPUT ? null : source,
                });

                // item has been successfully loaded and added to the
                // list of items so can now be safely returned for use
                success(createItemAPI(item));

                // if this is a local server file we need to show a different state
                if (item.origin === FileOrigin.LOCAL) {
                    dispatch('DID_LOAD_LOCAL_ITEM', { id: item.id });
                    return;
                }

                // if is a temp server file we prevent async upload call here (as the file is already on the server)
                if (item.origin === FileOrigin.LIMBO) {
                    dispatch('DID_COMPLETE_ITEM_PROCESSING', {
                        id: item.id,
                        error: null,
                        serverFileReference: source,
                    });

                    dispatch('DID_DEFINE_VALUE', {
                        id: item.id,
                        value: item.serverId || source,
                    });

                    return;
                }

                // id we are allowed to upload the file immediately, lets do it
                if (query('IS_ASYNC') && state.options.instantUpload) {
                    dispatch('REQUEST_ITEM_PROCESSING', { query: item.id });
                }
            },

            RETRY_ITEM_LOAD: getItemByQueryFromState(state, function(item) {
                // try loading the source one more time
                item.retryLoad();
            }),

            REQUEST_ITEM_PREPARE: getItemByQueryFromState(state, function(item, _success, failure) {
                dispatch(
                    'REQUEST_PREPARE_OUTPUT',
                    {
                        query: item.id,
                        item: item,
                        success: function success(file) {
                            dispatch('DID_PREPARE_OUTPUT', { id: item.id, file: file });
                            _success({
                                file: item,
                                output: file,
                            });
                        },
                        failure: failure,
                    },

                    true
                );
            }),

            REQUEST_ITEM_PROCESSING: getItemByQueryFromState(state, function(
                item,
                success,
                failure
            ) {
                // cannot be queued (or is already queued)
                var itemCanBeQueuedForProcessing =
                    // waiting for something
                    item.status === ItemStatus.IDLE ||
                    // processing went wrong earlier
                    item.status === ItemStatus.PROCESSING_ERROR;

                // not ready to be processed
                if (!itemCanBeQueuedForProcessing) {
                    var processNow = function processNow() {
                        return dispatch('REQUEST_ITEM_PROCESSING', {
                            query: item,
                            success: success,
                            failure: failure,
                        });
                    };

                    var process = function process() {
                        return document.hidden ? processNow() : setTimeout(processNow, 32);
                    };

                    // if already done processing or tried to revert but didn't work, try again
                    if (
                        item.status === ItemStatus.PROCESSING_COMPLETE ||
                        item.status === ItemStatus.PROCESSING_REVERT_ERROR
                    ) {
                        item.revert(
                            createRevertFunction(
                                state.options.server.url,
                                state.options.server.revert
                            ),
                            query('GET_FORCE_REVERT')
                        )
                            .then(process)
                            .catch(function() {}); // don't continue with processing if something went wrong
                    } else if (item.status === ItemStatus.PROCESSING) {
                        item.abortProcessing().then(process);
                    }

                    return;
                }

                // already queued for processing
                if (item.status === ItemStatus.PROCESSING_QUEUED) return;

                item.requestProcessing();

                dispatch('DID_REQUEST_ITEM_PROCESSING', { id: item.id });

                dispatch('PROCESS_ITEM', { query: item, success: success, failure: failure }, true);
            }),

            PROCESS_ITEM: getItemByQueryFromState(state, function(item, success, failure) {
                var maxParallelUploads = query('GET_MAX_PARALLEL_UPLOADS');
                var totalCurrentUploads = query('GET_ITEMS_BY_STATUS', ItemStatus.PROCESSING)
                    .length;

                // queue and wait till queue is freed up
                if (totalCurrentUploads === maxParallelUploads) {
                    // queue for later processing
                    state.processingQueue.push({
                        id: item.id,
                        success: success,
                        failure: failure,
                    });

                    // stop it!
                    return;
                }

                // if was not queued or is already processing exit here
                if (item.status === ItemStatus.PROCESSING) return;

                var processNext = function processNext() {
                    // process queueud items
                    var queueEntry = state.processingQueue.shift();

                    // no items left
                    if (!queueEntry) return;

                    // get item reference
                    var id = queueEntry.id,
                        success = queueEntry.success,
                        failure = queueEntry.failure;
                    var itemReference = getItemByQuery(state.items, id);

                    // if item was archived while in queue, jump to next
                    if (!itemReference || itemReference.archived) {
                        processNext();
                        return;
                    }

                    // process queued item
                    dispatch(
                        'PROCESS_ITEM',
                        { query: id, success: success, failure: failure },
                        true
                    );
                };

                // we done function
                item.onOnce('process-complete', function() {
                    success(createItemAPI(item));
                    processNext();

                    // if origin is local, and we're instant uploading, trigger remove of original
                    // as revert will remove file from list
                    var server = state.options.server;
                    var instantUpload = state.options.instantUpload;
                    if (
                        instantUpload &&
                        item.origin === FileOrigin.LOCAL &&
                        isFunction(server.remove)
                    ) {
                        var noop = function noop() {};
                        item.origin = FileOrigin.LIMBO;
                        state.options.server.remove(item.source, noop, noop);
                    }

                    // All items processed? No errors?
                    var allItemsProcessed =
                        query('GET_ITEMS_BY_STATUS', ItemStatus.PROCESSING_COMPLETE).length ===
                        state.items.length;
                    if (allItemsProcessed) {
                        dispatch('DID_COMPLETE_ITEM_PROCESSING_ALL');
                    }
                });

                // we error function
                item.onOnce('process-error', function(error) {
                    failure({ error: error, file: createItemAPI(item) });
                    processNext();
                });

                // start file processing
                var options = state.options;
                item.process(
                    createFileProcessor(
                        createProcessorFunction(
                            options.server.url,
                            options.server.process,
                            options.name,
                            {
                                chunkTransferId: item.transferId,
                                chunkServer: options.server.patch,
                                chunkUploads: options.chunkUploads,
                                chunkForce: options.chunkForce,
                                chunkSize: options.chunkSize,
                                chunkRetryDelays: options.chunkRetryDelays,
                            }
                        ),

                        {
                            allowMinimumUploadDuration: query('GET_ALLOW_MINIMUM_UPLOAD_DURATION'),
                        }
                    ),

                    // called when the file is about to be processed so it can be piped through the transform filters
                    function(file, success, error) {
                        // allow plugins to alter the file data
                        applyFilterChain('PREPARE_OUTPUT', file, { query: query, item: item })
                            .then(function(file) {
                                dispatch('DID_PREPARE_OUTPUT', { id: item.id, file: file });

                                success(file);
                            })
                            .catch(error);
                    }
                );
            }),

            RETRY_ITEM_PROCESSING: getItemByQueryFromState(state, function(item) {
                dispatch('REQUEST_ITEM_PROCESSING', { query: item });
            }),

            REQUEST_REMOVE_ITEM: getItemByQueryFromState(state, function(item) {
                optionalPromise(query('GET_BEFORE_REMOVE_FILE'), createItemAPI(item)).then(function(
                    shouldRemove
                ) {
                    if (!shouldRemove) {
                        return;
                    }
                    dispatch('REMOVE_ITEM', { query: item });
                });
            }),

            RELEASE_ITEM: getItemByQueryFromState(state, function(item) {
                item.release();
            }),

            REMOVE_ITEM: getItemByQueryFromState(state, function(item, success, failure, options) {
                var removeFromView = function removeFromView() {
                    // get id reference
                    var id = item.id;

                    // archive the item, this does not remove it from the list
                    getItemById(state.items, id).archive();

                    // tell the view the item has been removed
                    dispatch('DID_REMOVE_ITEM', { error: null, id: id, item: item });

                    // now the list has been modified
                    listUpdated(dispatch, state);

                    // correctly removed
                    success(createItemAPI(item));
                };

                // if this is a local file and the `server.remove` function has been configured,
                // send source there so dev can remove file from server
                var server = state.options.server;
                if (
                    item.origin === FileOrigin.LOCAL &&
                    server &&
                    isFunction(server.remove) &&
                    options.remove !== false
                ) {
                    dispatch('DID_START_ITEM_REMOVE', { id: item.id });

                    server.remove(
                        item.source,
                        function() {
                            return removeFromView();
                        },
                        function(status) {
                            dispatch('DID_THROW_ITEM_REMOVE_ERROR', {
                                id: item.id,
                                error: createResponse('error', 0, status, null),
                                status: {
                                    main: dynamicLabel(state.options.labelFileRemoveError)(status),
                                    sub: state.options.labelTapToRetry,
                                },
                            });
                        }
                    );
                } else {
                    // if is requesting revert and can revert need to call revert handler (not calling request_ because that would also trigger beforeRemoveHook)
                    if (
                        (options.revert &&
                            item.origin !== FileOrigin.LOCAL &&
                            item.serverId !== null) ||
                        // if chunked uploads are enabled and we're uploading in chunks for this specific file
                        // or if the file isn't big enough for chunked uploads but chunkForce is set then call
                        // revert before removing from the view...
                        (state.options.chunkUploads && item.file.size > state.options.chunkSize) ||
                        (state.options.chunkUploads && state.options.chunkForce)
                    ) {
                        item.revert(
                            createRevertFunction(
                                state.options.server.url,
                                state.options.server.revert
                            ),
                            query('GET_FORCE_REVERT')
                        );
                    }

                    // can now safely remove from view
                    removeFromView();
                }
            }),

            ABORT_ITEM_LOAD: getItemByQueryFromState(state, function(item) {
                item.abortLoad();
            }),

            ABORT_ITEM_PROCESSING: getItemByQueryFromState(state, function(item) {
                // test if is already processed
                if (item.serverId) {
                    dispatch('REVERT_ITEM_PROCESSING', { id: item.id });
                    return;
                }

                // abort
                item.abortProcessing().then(function() {
                    var shouldRemove = state.options.instantUpload;
                    if (shouldRemove) {
                        dispatch('REMOVE_ITEM', { query: item.id });
                    }
                });
            }),

            REQUEST_REVERT_ITEM_PROCESSING: getItemByQueryFromState(state, function(item) {
                // not instant uploading, revert immediately
                if (!state.options.instantUpload) {
                    dispatch('REVERT_ITEM_PROCESSING', { query: item });
                    return;
                }

                // if we're instant uploading the file will also be removed if we revert,
                // so if a before remove file hook is defined we need to run it now
                var handleRevert = function handleRevert(shouldRevert) {
                    if (!shouldRevert) return;
                    dispatch('REVERT_ITEM_PROCESSING', { query: item });
                };

                var fn = query('GET_BEFORE_REMOVE_FILE');
                if (!fn) {
                    return handleRevert(true);
                }

                var requestRemoveResult = fn(createItemAPI(item));
                if (requestRemoveResult == null) {
                    // undefined or null
                    return handleRevert(true);
                }

                if (typeof requestRemoveResult === 'boolean') {
                    return handleRevert(requestRemoveResult);
                }

                if (typeof requestRemoveResult.then === 'function') {
                    requestRemoveResult.then(handleRevert);
                }
            }),

            REVERT_ITEM_PROCESSING: getItemByQueryFromState(state, function(item) {
                item.revert(
                    createRevertFunction(state.options.server.url, state.options.server.revert),
                    query('GET_FORCE_REVERT')
                )
                    .then(function() {
                        var shouldRemove = state.options.instantUpload || isMockItem(item);
                        if (shouldRemove) {
                            dispatch('REMOVE_ITEM', { query: item.id });
                        }
                    })
                    .catch(function() {});
            }),

            SET_OPTIONS: function SET_OPTIONS(_ref11) {
                var options = _ref11.options;
                // get all keys passed
                var optionKeys = Object.keys(options);

                // get prioritized keyed to include (remove once not in options object)
                var prioritizedOptionKeys = PrioritizedOptions.filter(function(key) {
                    return optionKeys.includes(key);
                });

                // order the keys, prioritized first, then rest
                var orderedOptionKeys = [].concat(
                    _toConsumableArray(prioritizedOptionKeys),
                    _toConsumableArray(
                        Object.keys(options).filter(function(key) {
                            return !prioritizedOptionKeys.includes(key);
                        })
                    )
                );

                // dispatch set event for each option
                orderedOptionKeys.forEach(function(key) {
                    dispatch('SET_' + fromCamels(key, '_').toUpperCase(), {
                        value: options[key],
                    });
                });
            },
        };
    };

    var PrioritizedOptions = ['server'];

    var formatFilename = function formatFilename(name) {
        return name;
    };

    var createElement$1 = function createElement(tagName) {
        return document.createElement(tagName);
    };

    var text = function text(node, value) {
        var textNode = node.childNodes[0];
        if (!textNode) {
            textNode = document.createTextNode(value);
            node.appendChild(textNode);
        } else if (value !== textNode.nodeValue) {
            textNode.nodeValue = value;
        }
    };

    var polarToCartesian = function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
        var angleInRadians = (((angleInDegrees % 360) - 90) * Math.PI) / 180.0;
        return {
            x: centerX + radius * Math.cos(angleInRadians),
            y: centerY + radius * Math.sin(angleInRadians),
        };
    };

    var describeArc = function describeArc(x, y, radius, startAngle, endAngle, arcSweep) {
        var start = polarToCartesian(x, y, radius, endAngle);
        var end = polarToCartesian(x, y, radius, startAngle);
        return ['M', start.x, start.y, 'A', radius, radius, 0, arcSweep, 0, end.x, end.y].join(' ');
    };

    var percentageArc = function percentageArc(x, y, radius, from, to) {
        var arcSweep = 1;
        if (to > from && to - from <= 0.5) {
            arcSweep = 0;
        }
        if (from > to && from - to >= 0.5) {
            arcSweep = 0;
        }
        return describeArc(
            x,
            y,
            radius,
            Math.min(0.9999, from) * 360,
            Math.min(0.9999, to) * 360,
            arcSweep
        );
    };

    var create = function create(_ref) {
        var root = _ref.root,
            props = _ref.props;
        // start at 0
        props.spin = false;
        props.progress = 0;
        props.opacity = 0;

        // svg
        var svg = createElement('svg');
        root.ref.path = createElement('path', {
            'stroke-width': 2,
            'stroke-linecap': 'round',
        });

        svg.appendChild(root.ref.path);

        root.ref.svg = svg;

        root.appendChild(svg);
    };

    var write = function write(_ref2) {
        var root = _ref2.root,
            props = _ref2.props;
        if (props.opacity === 0) {
            return;
        }

        if (props.align) {
            root.element.dataset.align = props.align;
        }

        // get width of stroke
        var ringStrokeWidth = parseInt(attr(root.ref.path, 'stroke-width'), 10);

        // calculate size of ring
        var size = root.rect.element.width * 0.5;

        // ring state
        var ringFrom = 0;
        var ringTo = 0;

        // now in busy mode
        if (props.spin) {
            ringFrom = 0;
            ringTo = 0.5;
        } else {
            ringFrom = 0;
            ringTo = props.progress;
        }

        // get arc path
        var coordinates = percentageArc(size, size, size - ringStrokeWidth, ringFrom, ringTo);

        // update progress bar
        attr(root.ref.path, 'd', coordinates);

        // hide while contains 0 value
        attr(root.ref.path, 'stroke-opacity', props.spin || props.progress > 0 ? 1 : 0);
    };

    var progressIndicator = createView({
        tag: 'div',
        name: 'progress-indicator',
        ignoreRectUpdate: true,
        ignoreRect: true,
        create: create,
        write: write,
        mixins: {
            apis: ['progress', 'spin', 'align'],
            styles: ['opacity'],
            animations: {
                opacity: { type: 'tween', duration: 500 },
                progress: {
                    type: 'spring',
                    stiffness: 0.95,
                    damping: 0.65,
                    mass: 10,
                },
            },
        },
    });

    var create$1 = function create(_ref) {
        var root = _ref.root,
            props = _ref.props;
        root.element.innerHTML = (props.icon || '') + ('<span>' + props.label + '</span>');

        props.isDisabled = false;
    };

    var write$1 = function write(_ref2) {
        var root = _ref2.root,
            props = _ref2.props;
        var isDisabled = props.isDisabled;
        var shouldDisable = root.query('GET_DISABLED') || props.opacity === 0;

        if (shouldDisable && !isDisabled) {
            props.isDisabled = true;
            attr(root.element, 'disabled', 'disabled');
        } else if (!shouldDisable && isDisabled) {
            props.isDisabled = false;
            root.element.removeAttribute('disabled');
        }
    };

    var fileActionButton = createView({
        tag: 'button',
        attributes: {
            type: 'button',
        },

        ignoreRect: true,
        ignoreRectUpdate: true,
        name: 'file-action-button',
        mixins: {
            apis: ['label'],
            styles: ['translateX', 'translateY', 'scaleX', 'scaleY', 'opacity'],
            animations: {
                scaleX: 'spring',
                scaleY: 'spring',
                translateX: 'spring',
                translateY: 'spring',
                opacity: { type: 'tween', duration: 250 },
            },

            listeners: true,
        },

        create: create$1,
        write: write$1,
    });

    var toNaturalFileSize = function toNaturalFileSize(bytes) {
        var decimalSeparator =
            arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '.';
        var base = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1000;
        var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
        var _options$labelBytes = options.labelBytes,
            labelBytes = _options$labelBytes === void 0 ? 'bytes' : _options$labelBytes,
            _options$labelKilobyt = options.labelKilobytes,
            labelKilobytes = _options$labelKilobyt === void 0 ? 'KB' : _options$labelKilobyt,
            _options$labelMegabyt = options.labelMegabytes,
            labelMegabytes = _options$labelMegabyt === void 0 ? 'MB' : _options$labelMegabyt,
            _options$labelGigabyt = options.labelGigabytes,
            labelGigabytes = _options$labelGigabyt === void 0 ? 'GB' : _options$labelGigabyt;

        // no negative byte sizes
        bytes = Math.round(Math.abs(bytes));

        var KB = base;
        var MB = base * base;
        var GB = base * base * base;

        // just bytes
        if (bytes < KB) {
            return bytes + ' ' + labelBytes;
        }

        // kilobytes
        if (bytes < MB) {
            return Math.floor(bytes / KB) + ' ' + labelKilobytes;
        }

        // megabytes
        if (bytes < GB) {
            return removeDecimalsWhenZero(bytes / MB, 1, decimalSeparator) + ' ' + labelMegabytes;
        }

        // gigabytes
        return removeDecimalsWhenZero(bytes / GB, 2, decimalSeparator) + ' ' + labelGigabytes;
    };

    var removeDecimalsWhenZero = function removeDecimalsWhenZero(value, decimalCount, separator) {
        return value
            .toFixed(decimalCount)
            .split('.')
            .filter(function(part) {
                return part !== '0';
            })
            .join(separator);
    };

    var create$2 = function create(_ref) {
        var root = _ref.root,
            props = _ref.props;
        // filename
        var fileName = createElement$1('span');
        fileName.className = 'filepond--file-info-main';
        // hide for screenreaders
        // the file is contained in a fieldset with legend that contains the filename
        // no need to read it twice
        attr(fileName, 'aria-hidden', 'true');
        root.appendChild(fileName);
        root.ref.fileName = fileName;

        // filesize
        var fileSize = createElement$1('span');
        fileSize.className = 'filepond--file-info-sub';
        root.appendChild(fileSize);
        root.ref.fileSize = fileSize;

        // set initial values
        text(fileSize, root.query('GET_LABEL_FILE_WAITING_FOR_SIZE'));
        text(fileName, formatFilename(root.query('GET_ITEM_NAME', props.id)));
    };

    var updateFile = function updateFile(_ref2) {
        var root = _ref2.root,
            props = _ref2.props;
        text(
            root.ref.fileSize,
            toNaturalFileSize(
                root.query('GET_ITEM_SIZE', props.id),
                '.',
                root.query('GET_FILE_SIZE_BASE'),
                root.query('GET_FILE_SIZE_LABELS', root.query)
            )
        );

        text(root.ref.fileName, formatFilename(root.query('GET_ITEM_NAME', props.id)));
    };

    var updateFileSizeOnError = function updateFileSizeOnError(_ref3) {
        var root = _ref3.root,
            props = _ref3.props;
        // if size is available don't fallback to unknown size message
        if (isInt(root.query('GET_ITEM_SIZE', props.id))) {
            updateFile({ root: root, props: props });
            return;
        }

        text(root.ref.fileSize, root.query('GET_LABEL_FILE_SIZE_NOT_AVAILABLE'));
    };

    var fileInfo = createView({
        name: 'file-info',
        ignoreRect: true,
        ignoreRectUpdate: true,
        write: createRoute({
            DID_LOAD_ITEM: updateFile,
            DID_UPDATE_ITEM_META: updateFile,
            DID_THROW_ITEM_LOAD_ERROR: updateFileSizeOnError,
            DID_THROW_ITEM_INVALID: updateFileSizeOnError,
        }),

        didCreateView: function didCreateView(root) {
            applyFilters('CREATE_VIEW', Object.assign({}, root, { view: root }));
        },
        create: create$2,
        mixins: {
            styles: ['translateX', 'translateY'],
            animations: {
                translateX: 'spring',
                translateY: 'spring',
            },
        },
    });

    var toPercentage = function toPercentage(value) {
        return Math.round(value * 100);
    };

    var create$3 = function create(_ref) {
        var root = _ref.root;

        // main status
        var main = createElement$1('span');
        main.className = 'filepond--file-status-main';
        root.appendChild(main);
        root.ref.main = main;

        // sub status
        var sub = createElement$1('span');
        sub.className = 'filepond--file-status-sub';
        root.appendChild(sub);
        root.ref.sub = sub;

        didSetItemLoadProgress({ root: root, action: { progress: null } });
    };

    var didSetItemLoadProgress = function didSetItemLoadProgress(_ref2) {
        var root = _ref2.root,
            action = _ref2.action;
        var title =
            action.progress === null
                ? root.query('GET_LABEL_FILE_LOADING')
                : root.query('GET_LABEL_FILE_LOADING') + ' ' + toPercentage(action.progress) + '%';

        text(root.ref.main, title);
        text(root.ref.sub, root.query('GET_LABEL_TAP_TO_CANCEL'));
    };

    var didSetItemProcessProgress = function didSetItemProcessProgress(_ref3) {
        var root = _ref3.root,
            action = _ref3.action;
        var title =
            action.progress === null
                ? root.query('GET_LABEL_FILE_PROCESSING')
                : root.query('GET_LABEL_FILE_PROCESSING') +
                  ' ' +
                  toPercentage(action.progress) +
                  '%';

        text(root.ref.main, title);
        text(root.ref.sub, root.query('GET_LABEL_TAP_TO_CANCEL'));
    };

    var didRequestItemProcessing = function didRequestItemProcessing(_ref4) {
        var root = _ref4.root;
        text(root.ref.main, root.query('GET_LABEL_FILE_PROCESSING'));
        text(root.ref.sub, root.query('GET_LABEL_TAP_TO_CANCEL'));
    };

    var didAbortItemProcessing = function didAbortItemProcessing(_ref5) {
        var root = _ref5.root;
        text(root.ref.main, root.query('GET_LABEL_FILE_PROCESSING_ABORTED'));
        text(root.ref.sub, root.query('GET_LABEL_TAP_TO_RETRY'));
    };

    var didCompleteItemProcessing = function didCompleteItemProcessing(_ref6) {
        var root = _ref6.root;
        text(root.ref.main, root.query('GET_LABEL_FILE_PROCESSING_COMPLETE'));
        text(root.ref.sub, root.query('GET_LABEL_TAP_TO_UNDO'));
    };

    var clear = function clear(_ref7) {
        var root = _ref7.root;
        text(root.ref.main, '');
        text(root.ref.sub, '');
    };

    var error = function error(_ref8) {
        var root = _ref8.root,
            action = _ref8.action;
        text(root.ref.main, action.status.main);
        text(root.ref.sub, action.status.sub);
    };

    var fileStatus = createView({
        name: 'file-status',
        ignoreRect: true,
        ignoreRectUpdate: true,
        write: createRoute({
            DID_LOAD_ITEM: clear,
            DID_REVERT_ITEM_PROCESSING: clear,
            DID_REQUEST_ITEM_PROCESSING: didRequestItemProcessing,
            DID_ABORT_ITEM_PROCESSING: didAbortItemProcessing,
            DID_COMPLETE_ITEM_PROCESSING: didCompleteItemProcessing,
            DID_UPDATE_ITEM_PROCESS_PROGRESS: didSetItemProcessProgress,
            DID_UPDATE_ITEM_LOAD_PROGRESS: didSetItemLoadProgress,
            DID_THROW_ITEM_LOAD_ERROR: error,
            DID_THROW_ITEM_INVALID: error,
            DID_THROW_ITEM_PROCESSING_ERROR: error,
            DID_THROW_ITEM_PROCESSING_REVERT_ERROR: error,
            DID_THROW_ITEM_REMOVE_ERROR: error,
        }),

        didCreateView: function didCreateView(root) {
            applyFilters('CREATE_VIEW', Object.assign({}, root, { view: root }));
        },
        create: create$3,
        mixins: {
            styles: ['translateX', 'translateY', 'opacity'],
            animations: {
                opacity: { type: 'tween', duration: 250 },
                translateX: 'spring',
                translateY: 'spring',
            },
        },
    });

    /**
     * Button definitions for the file view
     */

    var Buttons = {
        AbortItemLoad: {
            label: 'GET_LABEL_BUTTON_ABORT_ITEM_LOAD',
            action: 'ABORT_ITEM_LOAD',
            className: 'filepond--action-abort-item-load',
            align: 'LOAD_INDICATOR_POSITION', // right
        },
        RetryItemLoad: {
            label: 'GET_LABEL_BUTTON_RETRY_ITEM_LOAD',
            action: 'RETRY_ITEM_LOAD',
            icon: 'GET_ICON_RETRY',
            className: 'filepond--action-retry-item-load',
            align: 'BUTTON_PROCESS_ITEM_POSITION', // right
        },
        RemoveItem: {
            label: 'GET_LABEL_BUTTON_REMOVE_ITEM',
            action: 'REQUEST_REMOVE_ITEM',
            icon: 'GET_ICON_REMOVE',
            className: 'filepond--action-remove-item',
            align: 'BUTTON_REMOVE_ITEM_POSITION', // left
        },
        ProcessItem: {
            label: 'GET_LABEL_BUTTON_PROCESS_ITEM',
            action: 'REQUEST_ITEM_PROCESSING',
            icon: 'GET_ICON_PROCESS',
            className: 'filepond--action-process-item',
            align: 'BUTTON_PROCESS_ITEM_POSITION', // right
        },
        AbortItemProcessing: {
            label: 'GET_LABEL_BUTTON_ABORT_ITEM_PROCESSING',
            action: 'ABORT_ITEM_PROCESSING',
            className: 'filepond--action-abort-item-processing',
            align: 'BUTTON_PROCESS_ITEM_POSITION', // right
        },
        RetryItemProcessing: {
            label: 'GET_LABEL_BUTTON_RETRY_ITEM_PROCESSING',
            action: 'RETRY_ITEM_PROCESSING',
            icon: 'GET_ICON_RETRY',
            className: 'filepond--action-retry-item-processing',
            align: 'BUTTON_PROCESS_ITEM_POSITION', // right
        },
        RevertItemProcessing: {
            label: 'GET_LABEL_BUTTON_UNDO_ITEM_PROCESSING',
            action: 'REQUEST_REVERT_ITEM_PROCESSING',
            icon: 'GET_ICON_UNDO',
            className: 'filepond--action-revert-item-processing',
            align: 'BUTTON_PROCESS_ITEM_POSITION', // right
        },
    };

    // make a list of buttons, we can then remove buttons from this list if they're disabled
    var ButtonKeys = [];
    forin(Buttons, function(key) {
        ButtonKeys.push(key);
    });

    var calculateFileInfoOffset = function calculateFileInfoOffset(root) {
        if (getRemoveIndicatorAligment(root) === 'right') return 0;
        var buttonRect = root.ref.buttonRemoveItem.rect.element;
        return buttonRect.hidden ? null : buttonRect.width + buttonRect.left;
    };

    var calculateButtonWidth = function calculateButtonWidth(root) {
        var buttonRect = root.ref.buttonAbortItemLoad.rect.element;
        return buttonRect.width;
    };

    // Force on full pixels so text stays crips
    var calculateFileVerticalCenterOffset = function calculateFileVerticalCenterOffset(root) {
        return Math.floor(root.ref.buttonRemoveItem.rect.element.height / 4);
    };
    var calculateFileHorizontalCenterOffset = function calculateFileHorizontalCenterOffset(root) {
        return Math.floor(root.ref.buttonRemoveItem.rect.element.left / 2);
    };

    var getLoadIndicatorAlignment = function getLoadIndicatorAlignment(root) {
        return root.query('GET_STYLE_LOAD_INDICATOR_POSITION');
    };
    var getProcessIndicatorAlignment = function getProcessIndicatorAlignment(root) {
        return root.query('GET_STYLE_PROGRESS_INDICATOR_POSITION');
    };
    var getRemoveIndicatorAligment = function getRemoveIndicatorAligment(root) {
        return root.query('GET_STYLE_BUTTON_REMOVE_ITEM_POSITION');
    };

    var DefaultStyle = {
        buttonAbortItemLoad: { opacity: 0 },
        buttonRetryItemLoad: { opacity: 0 },
        buttonRemoveItem: { opacity: 0 },
        buttonProcessItem: { opacity: 0 },
        buttonAbortItemProcessing: { opacity: 0 },
        buttonRetryItemProcessing: { opacity: 0 },
        buttonRevertItemProcessing: { opacity: 0 },
        loadProgressIndicator: { opacity: 0, align: getLoadIndicatorAlignment },
        processProgressIndicator: { opacity: 0, align: getProcessIndicatorAlignment },
        processingCompleteIndicator: { opacity: 0, scaleX: 0.75, scaleY: 0.75 },
        info: { translateX: 0, translateY: 0, opacity: 0 },
        status: { translateX: 0, translateY: 0, opacity: 0 },
    };

    var IdleStyle = {
        buttonRemoveItem: { opacity: 1 },
        buttonProcessItem: { opacity: 1 },
        info: { translateX: calculateFileInfoOffset },
        status: { translateX: calculateFileInfoOffset },
    };

    var ProcessingStyle = {
        buttonAbortItemProcessing: { opacity: 1 },
        processProgressIndicator: { opacity: 1 },
        status: { opacity: 1 },
    };

    var StyleMap = {
        DID_THROW_ITEM_INVALID: {
            buttonRemoveItem: { opacity: 1 },
            info: { translateX: calculateFileInfoOffset },
            status: { translateX: calculateFileInfoOffset, opacity: 1 },
        },

        DID_START_ITEM_LOAD: {
            buttonAbortItemLoad: { opacity: 1 },
            loadProgressIndicator: { opacity: 1 },
            status: { opacity: 1 },
        },

        DID_THROW_ITEM_LOAD_ERROR: {
            buttonRetryItemLoad: { opacity: 1 },
            buttonRemoveItem: { opacity: 1 },
            info: { translateX: calculateFileInfoOffset },
            status: { opacity: 1 },
        },

        DID_START_ITEM_REMOVE: {
            processProgressIndicator: { opacity: 1, align: getRemoveIndicatorAligment },
            info: { translateX: calculateFileInfoOffset },
            status: { opacity: 0 },
        },

        DID_THROW_ITEM_REMOVE_ERROR: {
            processProgressIndicator: { opacity: 0, align: getRemoveIndicatorAligment },
            buttonRemoveItem: { opacity: 1 },
            info: { translateX: calculateFileInfoOffset },
            status: { opacity: 1, translateX: calculateFileInfoOffset },
        },

        DID_LOAD_ITEM: IdleStyle,
        DID_LOAD_LOCAL_ITEM: {
            buttonRemoveItem: { opacity: 1 },
            info: { translateX: calculateFileInfoOffset },
            status: { translateX: calculateFileInfoOffset },
        },

        DID_START_ITEM_PROCESSING: ProcessingStyle,
        DID_REQUEST_ITEM_PROCESSING: ProcessingStyle,
        DID_UPDATE_ITEM_PROCESS_PROGRESS: ProcessingStyle,
        DID_COMPLETE_ITEM_PROCESSING: {
            buttonRevertItemProcessing: { opacity: 1 },
            info: { opacity: 1 },
            status: { opacity: 1 },
        },

        DID_THROW_ITEM_PROCESSING_ERROR: {
            buttonRemoveItem: { opacity: 1 },
            buttonRetryItemProcessing: { opacity: 1 },
            status: { opacity: 1 },
            info: { translateX: calculateFileInfoOffset },
        },

        DID_THROW_ITEM_PROCESSING_REVERT_ERROR: {
            buttonRevertItemProcessing: { opacity: 1 },
            status: { opacity: 1 },
            info: { opacity: 1 },
        },

        DID_ABORT_ITEM_PROCESSING: {
            buttonRemoveItem: { opacity: 1 },
            buttonProcessItem: { opacity: 1 },
            info: { translateX: calculateFileInfoOffset },
            status: { opacity: 1 },
        },

        DID_REVERT_ITEM_PROCESSING: IdleStyle,
    };

    // complete indicator view
    var processingCompleteIndicatorView = createView({
        create: function create(_ref) {
            var root = _ref.root;
            root.element.innerHTML = root.query('GET_ICON_DONE');
        },
        name: 'processing-complete-indicator',
        ignoreRect: true,
        mixins: {
            styles: ['scaleX', 'scaleY', 'opacity'],
            animations: {
                scaleX: 'spring',
                scaleY: 'spring',
                opacity: { type: 'tween', duration: 250 },
            },
        },
    });

    /**
     * Creates the file view
     */
    var create$4 = function create(_ref2) {
        var root = _ref2.root,
            props = _ref2.props;
        // copy Buttons object
        var LocalButtons = Object.keys(Buttons).reduce(function(prev, curr) {
            prev[curr] = Object.assign({}, Buttons[curr]);
            return prev;
        }, {});
        var id = props.id;

        // allow reverting upload
        var allowRevert = root.query('GET_ALLOW_REVERT');

        // allow remove file
        var allowRemove = root.query('GET_ALLOW_REMOVE');

        // allow processing upload
        var allowProcess = root.query('GET_ALLOW_PROCESS');

        // is instant uploading, need this to determine the icon of the undo button
        var instantUpload = root.query('GET_INSTANT_UPLOAD');

        // is async set up
        var isAsync = root.query('IS_ASYNC');

        // should align remove item buttons
        var alignRemoveItemButton = root.query('GET_STYLE_BUTTON_REMOVE_ITEM_ALIGN');

        // enabled buttons array
        var buttonFilter;
        if (isAsync) {
            if (allowProcess && !allowRevert) {
                // only remove revert button
                buttonFilter = function buttonFilter(key) {
                    return !/RevertItemProcessing/.test(key);
                };
            } else if (!allowProcess && allowRevert) {
                // only remove process button
                buttonFilter = function buttonFilter(key) {
                    return !/ProcessItem|RetryItemProcessing|AbortItemProcessing/.test(key);
                };
            } else if (!allowProcess && !allowRevert) {
                // remove all process buttons
                buttonFilter = function buttonFilter(key) {
                    return !/Process/.test(key);
                };
            }
        } else {
            // no process controls available
            buttonFilter = function buttonFilter(key) {
                return !/Process/.test(key);
            };
        }

        var enabledButtons = buttonFilter ? ButtonKeys.filter(buttonFilter) : ButtonKeys.concat();

        // update icon and label for revert button when instant uploading
        if (instantUpload && allowRevert) {
            LocalButtons['RevertItemProcessing'].label = 'GET_LABEL_BUTTON_REMOVE_ITEM';
            LocalButtons['RevertItemProcessing'].icon = 'GET_ICON_REMOVE';
        }

        // remove last button (revert) if not allowed
        if (isAsync && !allowRevert) {
            var map = StyleMap['DID_COMPLETE_ITEM_PROCESSING'];
            map.info.translateX = calculateFileHorizontalCenterOffset;
            map.info.translateY = calculateFileVerticalCenterOffset;
            map.status.translateY = calculateFileVerticalCenterOffset;
            map.processingCompleteIndicator = { opacity: 1, scaleX: 1, scaleY: 1 };
        }

        // should align center
        if (isAsync && !allowProcess) {
            [
                'DID_START_ITEM_PROCESSING',
                'DID_REQUEST_ITEM_PROCESSING',
                'DID_UPDATE_ITEM_PROCESS_PROGRESS',
                'DID_THROW_ITEM_PROCESSING_ERROR',
            ].forEach(function(key) {
                StyleMap[key].status.translateY = calculateFileVerticalCenterOffset;
            });
            StyleMap['DID_THROW_ITEM_PROCESSING_ERROR'].status.translateX = calculateButtonWidth;
        }

        // move remove button to right
        if (alignRemoveItemButton && allowRevert) {
            LocalButtons['RevertItemProcessing'].align = 'BUTTON_REMOVE_ITEM_POSITION';
            var _map = StyleMap['DID_COMPLETE_ITEM_PROCESSING'];
            _map.info.translateX = calculateFileInfoOffset;
            _map.status.translateY = calculateFileVerticalCenterOffset;
            _map.processingCompleteIndicator = { opacity: 1, scaleX: 1, scaleY: 1 };
        }

        // show/hide RemoveItem button
        if (!allowRemove) {
            LocalButtons['RemoveItem'].disabled = true;
        }

        // create the button views
        forin(LocalButtons, function(key, definition) {
            // create button
            var buttonView = root.createChildView(fileActionButton, {
                label: root.query(definition.label),
                icon: root.query(definition.icon),
                opacity: 0,
            });

            // should be appended?
            if (enabledButtons.includes(key)) {
                root.appendChildView(buttonView);
            }

            // toggle
            if (definition.disabled) {
                buttonView.element.setAttribute('disabled', 'disabled');
                buttonView.element.setAttribute('hidden', 'hidden');
            }

            // add position attribute
            buttonView.element.dataset.align = root.query('GET_STYLE_' + definition.align);

            // add class
            buttonView.element.classList.add(definition.className);

            // handle interactions
            buttonView.on('click', function(e) {
                e.stopPropagation();
                if (definition.disabled) return;
                root.dispatch(definition.action, { query: id });
            });

            // set reference
            root.ref['button' + key] = buttonView;
        });

        // checkmark
        root.ref.processingCompleteIndicator = root.appendChildView(
            root.createChildView(processingCompleteIndicatorView)
        );

        root.ref.processingCompleteIndicator.element.dataset.align = root.query(
            'GET_STYLE_BUTTON_PROCESS_ITEM_POSITION'
        );

        // create file info view
        root.ref.info = root.appendChildView(root.createChildView(fileInfo, { id: id }));

        // create file status view
        root.ref.status = root.appendChildView(root.createChildView(fileStatus, { id: id }));

        // add progress indicators
        var loadIndicatorView = root.appendChildView(
            root.createChildView(progressIndicator, {
                opacity: 0,
                align: root.query('GET_STYLE_LOAD_INDICATOR_POSITION'),
            })
        );

        loadIndicatorView.element.classList.add('filepond--load-indicator');
        root.ref.loadProgressIndicator = loadIndicatorView;

        var progressIndicatorView = root.appendChildView(
            root.createChildView(progressIndicator, {
                opacity: 0,
                align: root.query('GET_STYLE_PROGRESS_INDICATOR_POSITION'),
            })
        );

        progressIndicatorView.element.classList.add('filepond--process-indicator');
        root.ref.processProgressIndicator = progressIndicatorView;

        // current active styles
        root.ref.activeStyles = [];
    };

    var write$2 = function write(_ref3) {
        var root = _ref3.root,
            actions = _ref3.actions,
            props = _ref3.props;
        // route actions
        route({ root: root, actions: actions, props: props });

        // select last state change action
        var action = actions
            .concat()
            .filter(function(action) {
                return /^DID_/.test(action.type);
            })
            .reverse()
            .find(function(action) {
                return StyleMap[action.type];
            });

        // a new action happened, let's get the matching styles
        if (action) {
            // define new active styles
            root.ref.activeStyles = [];

            var stylesToApply = StyleMap[action.type];
            forin(DefaultStyle, function(name, defaultStyles) {
                // get reference to control
                var control = root.ref[name];

                // loop over all styles for this control
                forin(defaultStyles, function(key, defaultValue) {
                    var value =
                        stylesToApply[name] && typeof stylesToApply[name][key] !== 'undefined'
                            ? stylesToApply[name][key]
                            : defaultValue;
                    root.ref.activeStyles.push({ control: control, key: key, value: value });
                });
            });
        }

        // apply active styles to element
        root.ref.activeStyles.forEach(function(_ref4) {
            var control = _ref4.control,
                key = _ref4.key,
                value = _ref4.value;
            control[key] = typeof value === 'function' ? value(root) : value;
        });
    };

    var route = createRoute({
        DID_SET_LABEL_BUTTON_ABORT_ITEM_PROCESSING: function DID_SET_LABEL_BUTTON_ABORT_ITEM_PROCESSING(
            _ref5
        ) {
            var root = _ref5.root,
                action = _ref5.action;
            root.ref.buttonAbortItemProcessing.label = action.value;
        },
        DID_SET_LABEL_BUTTON_ABORT_ITEM_LOAD: function DID_SET_LABEL_BUTTON_ABORT_ITEM_LOAD(_ref6) {
            var root = _ref6.root,
                action = _ref6.action;
            root.ref.buttonAbortItemLoad.label = action.value;
        },
        DID_SET_LABEL_BUTTON_ABORT_ITEM_REMOVAL: function DID_SET_LABEL_BUTTON_ABORT_ITEM_REMOVAL(
            _ref7
        ) {
            var root = _ref7.root,
                action = _ref7.action;
            root.ref.buttonAbortItemRemoval.label = action.value;
        },
        DID_REQUEST_ITEM_PROCESSING: function DID_REQUEST_ITEM_PROCESSING(_ref8) {
            var root = _ref8.root;
            root.ref.processProgressIndicator.spin = true;
            root.ref.processProgressIndicator.progress = 0;
        },
        DID_START_ITEM_LOAD: function DID_START_ITEM_LOAD(_ref9) {
            var root = _ref9.root;
            root.ref.loadProgressIndicator.spin = true;
            root.ref.loadProgressIndicator.progress = 0;
        },
        DID_START_ITEM_REMOVE: function DID_START_ITEM_REMOVE(_ref10) {
            var root = _ref10.root;
            root.ref.processProgressIndicator.spin = true;
            root.ref.processProgressIndicator.progress = 0;
        },
        DID_UPDATE_ITEM_LOAD_PROGRESS: function DID_UPDATE_ITEM_LOAD_PROGRESS(_ref11) {
            var root = _ref11.root,
                action = _ref11.action;
            root.ref.loadProgressIndicator.spin = false;
            root.ref.loadProgressIndicator.progress = action.progress;
        },
        DID_UPDATE_ITEM_PROCESS_PROGRESS: function DID_UPDATE_ITEM_PROCESS_PROGRESS(_ref12) {
            var root = _ref12.root,
                action = _ref12.action;
            root.ref.processProgressIndicator.spin = false;
            root.ref.processProgressIndicator.progress = action.progress;
        },
    });

    var file = createView({
        create: create$4,
        write: write$2,
        didCreateView: function didCreateView(root) {
            applyFilters('CREATE_VIEW', Object.assign({}, root, { view: root }));
        },
        name: 'file',
    });

    /**
     * Creates the file view
     */
    var create$5 = function create(_ref) {
        var root = _ref.root,
            props = _ref.props;

        // filename
        root.ref.fileName = createElement$1('legend');
        root.appendChild(root.ref.fileName);

        // file appended
        root.ref.file = root.appendChildView(root.createChildView(file, { id: props.id }));

        // data has moved to data.js
        root.ref.data = false;
    };

    /**
     * Data storage
     */
    var didLoadItem = function didLoadItem(_ref2) {
        var root = _ref2.root,
            props = _ref2.props;
        // updates the legend of the fieldset so screenreaders can better group buttons
        text(root.ref.fileName, formatFilename(root.query('GET_ITEM_NAME', props.id)));
    };

    var fileWrapper = createView({
        create: create$5,
        ignoreRect: true,
        write: createRoute({
            DID_LOAD_ITEM: didLoadItem,
        }),

        didCreateView: function didCreateView(root) {
            applyFilters('CREATE_VIEW', Object.assign({}, root, { view: root }));
        },
        tag: 'fieldset',
        name: 'file-wrapper',
    });

    var PANEL_SPRING_PROPS = { type: 'spring', damping: 0.6, mass: 7 };

    var create$6 = function create(_ref) {
        var root = _ref.root,
            props = _ref.props;
        [
            {
                name: 'top',
            },

            {
                name: 'center',
                props: {
                    translateY: null,
                    scaleY: null,
                },

                mixins: {
                    animations: {
                        scaleY: PANEL_SPRING_PROPS,
                    },

                    styles: ['translateY', 'scaleY'],
                },
            },

            {
                name: 'bottom',
                props: {
                    translateY: null,
                },

                mixins: {
                    animations: {
                        translateY: PANEL_SPRING_PROPS,
                    },

                    styles: ['translateY'],
                },
            },
        ].forEach(function(section) {
            createSection(root, section, props.name);
        });

        root.element.classList.add('filepond--' + props.name);

        root.ref.scalable = null;
    };

    var createSection = function createSection(root, section, className) {
        var viewConstructor = createView({
            name: 'panel-' + section.name + ' filepond--' + className,
            mixins: section.mixins,
            ignoreRectUpdate: true,
        });

        var view = root.createChildView(viewConstructor, section.props);

        root.ref[section.name] = root.appendChildView(view);
    };

    var write$3 = function write(_ref2) {
        var root = _ref2.root,
            props = _ref2.props;

        // update scalable state
        if (root.ref.scalable === null || props.scalable !== root.ref.scalable) {
            root.ref.scalable = isBoolean(props.scalable) ? props.scalable : true;
            root.element.dataset.scalable = root.ref.scalable;
        }

        // no height, can't set
        if (!props.height) return;

        // get child rects
        var topRect = root.ref.top.rect.element;
        var bottomRect = root.ref.bottom.rect.element;

        // make sure height never is smaller than bottom and top seciton heights combined (will probably never happen, but who knows)
        var height = Math.max(topRect.height + bottomRect.height, props.height);

        // offset center part
        root.ref.center.translateY = topRect.height;

        // scale center part
        // use math ceil to prevent transparent lines because of rounding errors
        root.ref.center.scaleY = (height - topRect.height - bottomRect.height) / 100;

        // offset bottom part
        root.ref.bottom.translateY = height - bottomRect.height;
    };

    var panel = createView({
        name: 'panel',
        read: function read(_ref3) {
            var root = _ref3.root,
                props = _ref3.props;
            return (props.heightCurrent = root.ref.bottom.translateY);
        },
        write: write$3,
        create: create$6,
        ignoreRect: true,
        mixins: {
            apis: ['height', 'heightCurrent', 'scalable'],
        },
    });

    var createDragHelper = function createDragHelper(items) {
        var itemIds = items.map(function(item) {
            return item.id;
        });
        var prevIndex = undefined;
        return {
            setIndex: function setIndex(index) {
                prevIndex = index;
            },
            getIndex: function getIndex() {
                return prevIndex;
            },
            getItemIndex: function getItemIndex(item) {
                return itemIds.indexOf(item.id);
            },
        };
    };

    var ITEM_TRANSLATE_SPRING = {
        type: 'spring',
        stiffness: 0.75,
        damping: 0.45,
        mass: 10,
    };

    var ITEM_SCALE_SPRING = 'spring';

    var StateMap = {
        DID_START_ITEM_LOAD: 'busy',
        DID_UPDATE_ITEM_LOAD_PROGRESS: 'loading',
        DID_THROW_ITEM_INVALID: 'load-invalid',
        DID_THROW_ITEM_LOAD_ERROR: 'load-error',
        DID_LOAD_ITEM: 'idle',
        DID_THROW_ITEM_REMOVE_ERROR: 'remove-error',
        DID_START_ITEM_REMOVE: 'busy',
        DID_START_ITEM_PROCESSING: 'busy processing',
        DID_REQUEST_ITEM_PROCESSING: 'busy processing',
        DID_UPDATE_ITEM_PROCESS_PROGRESS: 'processing',
        DID_COMPLETE_ITEM_PROCESSING: 'processing-complete',
        DID_THROW_ITEM_PROCESSING_ERROR: 'processing-error',
        DID_THROW_ITEM_PROCESSING_REVERT_ERROR: 'processing-revert-error',
        DID_ABORT_ITEM_PROCESSING: 'cancelled',
        DID_REVERT_ITEM_PROCESSING: 'idle',
    };

    /**
     * Creates the file view
     */
    var create$7 = function create(_ref) {
        var root = _ref.root,
            props = _ref.props;
        // select
        root.ref.handleClick = function(e) {
            return root.dispatch('DID_ACTIVATE_ITEM', { id: props.id });
        };

        // set id
        root.element.id = 'filepond--item-' + props.id;
        root.element.addEventListener('click', root.ref.handleClick);

        // file view
        root.ref.container = root.appendChildView(
            root.createChildView(fileWrapper, { id: props.id })
        );

        // file panel
        root.ref.panel = root.appendChildView(root.createChildView(panel, { name: 'item-panel' }));

        // default start height
        root.ref.panel.height = null;

        // by default not marked for removal
        props.markedForRemoval = false;

        // if not allowed to reorder file items, exit here
        if (!root.query('GET_ALLOW_REORDER')) return;

        // set to idle so shows grab cursor
        root.element.dataset.dragState = 'idle';

        var grab = function grab(e) {
            if (!e.isPrimary) return;

            var removedActivateListener = false;

            var origin = {
                x: e.pageX,
                y: e.pageY,
            };

            props.dragOrigin = {
                x: root.translateX,
                y: root.translateY,
            };

            props.dragCenter = {
                x: e.offsetX,
                y: e.offsetY,
            };

            var dragState = createDragHelper(root.query('GET_ACTIVE_ITEMS'));

            root.dispatch('DID_GRAB_ITEM', { id: props.id, dragState: dragState });

            var drag = function drag(e) {
                if (!e.isPrimary) return;

                e.stopPropagation();
                e.preventDefault();

                props.dragOffset = {
                    x: e.pageX - origin.x,
                    y: e.pageY - origin.y,
                };

                // if dragged stop listening to clicks, will re-add when done dragging
                var dist =
                    props.dragOffset.x * props.dragOffset.x +
                    props.dragOffset.y * props.dragOffset.y;
                if (dist > 16 && !removedActivateListener) {
                    removedActivateListener = true;
                    root.element.removeEventListener('click', root.ref.handleClick);
                }

                root.dispatch('DID_DRAG_ITEM', { id: props.id, dragState: dragState });
            };

            var drop = function drop(e) {
                if (!e.isPrimary) return;

                props.dragOffset = {
                    x: e.pageX - origin.x,
                    y: e.pageY - origin.y,
                };

                reset();
            };

            var cancel = function cancel() {
                reset();
            };

            var reset = function reset() {
                document.removeEventListener('pointercancel', cancel);
                document.removeEventListener('pointermove', drag);
                document.removeEventListener('pointerup', drop);

                root.dispatch('DID_DROP_ITEM', { id: props.id, dragState: dragState });

                // start listening to clicks again
                if (removedActivateListener) {
                    setTimeout(function() {
                        return root.element.addEventListener('click', root.ref.handleClick);
                    }, 0);
                }
            };

            document.addEventListener('pointercancel', cancel);
            document.addEventListener('pointermove', drag);
            document.addEventListener('pointerup', drop);
        };

        root.element.addEventListener('pointerdown', grab);
    };

    var route$1 = createRoute({
        DID_UPDATE_PANEL_HEIGHT: function DID_UPDATE_PANEL_HEIGHT(_ref2) {
            var root = _ref2.root,
                action = _ref2.action;
            root.height = action.height;
        },
    });

    var write$4 = createRoute(
        {
            DID_GRAB_ITEM: function DID_GRAB_ITEM(_ref3) {
                var root = _ref3.root,
                    props = _ref3.props;
                props.dragOrigin = {
                    x: root.translateX,
                    y: root.translateY,
                };
            },
            DID_DRAG_ITEM: function DID_DRAG_ITEM(_ref4) {
                var root = _ref4.root;
                root.element.dataset.dragState = 'drag';
            },
            DID_DROP_ITEM: function DID_DROP_ITEM(_ref5) {
                var root = _ref5.root,
                    props = _ref5.props;
                props.dragOffset = null;
                props.dragOrigin = null;
                root.element.dataset.dragState = 'drop';
            },
        },

        function(_ref6) {
            var root = _ref6.root,
                actions = _ref6.actions,
                props = _ref6.props,
                shouldOptimize = _ref6.shouldOptimize;
            if (root.element.dataset.dragState === 'drop') {
                if (root.scaleX <= 1) {
                    root.element.dataset.dragState = 'idle';
                }
            }

            // select last state change action
            var action = actions
                .concat()
                .filter(function(action) {
                    return /^DID_/.test(action.type);
                })
                .reverse()
                .find(function(action) {
                    return StateMap[action.type];
                });

            // no need to set same state twice
            if (action && action.type !== props.currentState) {
                // set current state
                props.currentState = action.type;

                // set state
                root.element.dataset.filepondItemState = StateMap[props.currentState] || '';
            }

            // route actions
            var aspectRatio =
                root.query('GET_ITEM_PANEL_ASPECT_RATIO') || root.query('GET_PANEL_ASPECT_RATIO');
            if (!aspectRatio) {
                route$1({ root: root, actions: actions, props: props });
                if (!root.height && root.ref.container.rect.element.height > 0) {
                    root.height = root.ref.container.rect.element.height;
                }
            } else if (!shouldOptimize) {
                root.height = root.rect.element.width * aspectRatio;
            }

            // sync panel height with item height
            if (shouldOptimize) {
                root.ref.panel.height = null;
            }

            root.ref.panel.height = root.height;
        }
    );

    var item = createView({
        create: create$7,
        write: write$4,
        destroy: function destroy(_ref7) {
            var root = _ref7.root,
                props = _ref7.props;
            root.element.removeEventListener('click', root.ref.handleClick);
            root.dispatch('RELEASE_ITEM', { query: props.id });
        },
        tag: 'li',
        name: 'item',
        mixins: {
            apis: [
                'id',
                'interactionMethod',
                'markedForRemoval',
                'spawnDate',
                'dragCenter',
                'dragOrigin',
                'dragOffset',
            ],

            styles: ['translateX', 'translateY', 'scaleX', 'scaleY', 'opacity', 'height'],
            animations: {
                scaleX: ITEM_SCALE_SPRING,
                scaleY: ITEM_SCALE_SPRING,
                translateX: ITEM_TRANSLATE_SPRING,
                translateY: ITEM_TRANSLATE_SPRING,
                opacity: { type: 'tween', duration: 150 },
            },
        },
    });

    var getItemsPerRow = function(horizontalSpace, itemWidth) {
        // add one pixel leeway, when using percentages for item width total items can be 1.99 per row

        return Math.max(1, Math.floor((horizontalSpace + 1) / itemWidth));
    };

    var getItemIndexByPosition = function getItemIndexByPosition(view, children, positionInView) {
        if (!positionInView) return;

        var horizontalSpace = view.rect.element.width;
        // const children = view.childViews;
        var l = children.length;
        var last = null;

        // -1, don't move items to accomodate (either add to top or bottom)
        if (l === 0 || positionInView.top < children[0].rect.element.top) return -1;

        // let's get the item width
        var item = children[0];
        var itemRect = item.rect.element;
        var itemHorizontalMargin = itemRect.marginLeft + itemRect.marginRight;
        var itemWidth = itemRect.width + itemHorizontalMargin;
        var itemsPerRow = getItemsPerRow(horizontalSpace, itemWidth);

        // stack
        if (itemsPerRow === 1) {
            for (var index = 0; index < l; index++) {
                var child = children[index];
                var childMid = child.rect.outer.top + child.rect.element.height * 0.5;
                if (positionInView.top < childMid) {
                    return index;
                }
            }
            return l;
        }

        // grid
        var itemVerticalMargin = itemRect.marginTop + itemRect.marginBottom;
        var itemHeight = itemRect.height + itemVerticalMargin;
        for (var _index = 0; _index < l; _index++) {
            var indexX = _index % itemsPerRow;
            var indexY = Math.floor(_index / itemsPerRow);

            var offsetX = indexX * itemWidth;
            var offsetY = indexY * itemHeight;

            var itemTop = offsetY - itemRect.marginTop;
            var itemRight = offsetX + itemWidth;
            var itemBottom = offsetY + itemHeight + itemRect.marginBottom;

            if (positionInView.top < itemBottom && positionInView.top > itemTop) {
                if (positionInView.left < itemRight) {
                    return _index;
                } else if (_index !== l - 1) {
                    last = _index;
                } else {
                    last = null;
                }
            }
        }

        if (last !== null) {
            return last;
        }

        return l;
    };

    var dropAreaDimensions = {
        height: 0,
        width: 0,
        get getHeight() {
            return this.height;
        },
        set setHeight(val) {
            if (this.height === 0 || val === 0) this.height = val;
        },
        get getWidth() {
            return this.width;
        },
        set setWidth(val) {
            if (this.width === 0 || val === 0) this.width = val;
        },
        setDimensions: function setDimensions(height, width) {
            if (this.height === 0 || height === 0) this.height = height;
            if (this.width === 0 || width === 0) this.width = width;
        },
    };

    var create$8 = function create(_ref) {
        var root = _ref.root;
        // need to set role to list as otherwise it won't be read as a list by VoiceOver
        attr(root.element, 'role', 'list');

        root.ref.lastItemSpanwDate = Date.now();
    };

    /**
     * Inserts a new item
     * @param root
     * @param action
     */
    var addItemView = function addItemView(_ref2) {
        var root = _ref2.root,
            action = _ref2.action;
        var id = action.id,
            index = action.index,
            interactionMethod = action.interactionMethod;

        root.ref.addIndex = index;

        var now = Date.now();
        var spawnDate = now;
        var opacity = 1;

        if (interactionMethod !== InteractionMethod.NONE) {
            opacity = 0;
            var cooldown = root.query('GET_ITEM_INSERT_INTERVAL');
            var dist = now - root.ref.lastItemSpanwDate;
            spawnDate = dist < cooldown ? now + (cooldown - dist) : now;
        }

        root.ref.lastItemSpanwDate = spawnDate;

        root.appendChildView(
            root.createChildView(
                // view type
                item,

                // props
                {
                    spawnDate: spawnDate,
                    id: id,
                    opacity: opacity,
                    interactionMethod: interactionMethod,
                }
            ),

            index
        );
    };

    var moveItem = function moveItem(item, x, y) {
        var vx = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
        var vy = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
        // set to null to remove animation while dragging
        if (item.dragOffset) {
            item.translateX = null;
            item.translateY = null;
            item.translateX = item.dragOrigin.x + item.dragOffset.x;
            item.translateY = item.dragOrigin.y + item.dragOffset.y;
            item.scaleX = 1.025;
            item.scaleY = 1.025;
        } else {
            item.translateX = x;
            item.translateY = y;

            if (Date.now() > item.spawnDate) {
                // reveal element
                if (item.opacity === 0) {
                    introItemView(item, x, y, vx, vy);
                }

                // make sure is default scale every frame
                item.scaleX = 1;
                item.scaleY = 1;
                item.opacity = 1;
            }
        }
    };

    var introItemView = function introItemView(item, x, y, vx, vy) {
        if (item.interactionMethod === InteractionMethod.NONE) {
            item.translateX = null;
            item.translateX = x;
            item.translateY = null;
            item.translateY = y;
        } else if (item.interactionMethod === InteractionMethod.DROP) {
            item.translateX = null;
            item.translateX = x - vx * 20;

            item.translateY = null;
            item.translateY = y - vy * 10;

            item.scaleX = 0.8;
            item.scaleY = 0.8;
        } else if (item.interactionMethod === InteractionMethod.BROWSE) {
            item.translateY = null;
            item.translateY = y - 30;
        } else if (item.interactionMethod === InteractionMethod.API) {
            item.translateX = null;
            item.translateX = x - 30;
            item.translateY = null;
        }
    };

    /**
     * Removes an existing item
     * @param root
     * @param action
     */
    var removeItemView = function removeItemView(_ref3) {
        var root = _ref3.root,
            action = _ref3.action;
        var id = action.id;

        // get the view matching the given id
        var view = root.childViews.find(function(child) {
            return child.id === id;
        });

        // if no view found, exit
        if (!view) {
            return;
        }

        // animate view out of view
        view.scaleX = 0.9;
        view.scaleY = 0.9;
        view.opacity = 0;

        // mark for removal
        view.markedForRemoval = true;
    };

    var getItemHeight = function getItemHeight(child) {
        return (
            child.rect.element.height +
            child.rect.element.marginBottom * 0.5 +
            child.rect.element.marginTop * 0.5
        );
    };
    var getItemWidth = function getItemWidth(child) {
        return (
            child.rect.element.width +
            child.rect.element.marginLeft * 0.5 +
            child.rect.element.marginRight * 0.5
        );
    };

    var dragItem = function dragItem(_ref4) {
        var root = _ref4.root,
            action = _ref4.action;
        var id = action.id,
            dragState = action.dragState;

        // reference to item
        var item = root.query('GET_ITEM', { id: id });

        // get the view matching the given id
        var view = root.childViews.find(function(child) {
            return child.id === id;
        });

        var numItems = root.childViews.length;
        var oldIndex = dragState.getItemIndex(item);

        // if no view found, exit
        if (!view) return;

        var dragPosition = {
            x: view.dragOrigin.x + view.dragOffset.x + view.dragCenter.x,
            y: view.dragOrigin.y + view.dragOffset.y + view.dragCenter.y,
        };

        // get drag area dimensions
        var dragHeight = getItemHeight(view);
        var dragWidth = getItemWidth(view);

        // get rows and columns (There will always be at least one row and one column if a file is present)
        var cols = Math.floor(root.rect.outer.width / dragWidth);
        if (cols > numItems) cols = numItems;

        // rows are used to find when we have left the preview area bounding box
        var rows = Math.floor(numItems / cols + 1);

        dropAreaDimensions.setHeight = dragHeight * rows;
        dropAreaDimensions.setWidth = dragWidth * cols;

        // get new index of dragged item
        var location = {
            y: Math.floor(dragPosition.y / dragHeight),
            x: Math.floor(dragPosition.x / dragWidth),
            getGridIndex: function getGridIndex() {
                if (
                    dragPosition.y > dropAreaDimensions.getHeight ||
                    dragPosition.y < 0 ||
                    dragPosition.x > dropAreaDimensions.getWidth ||
                    dragPosition.x < 0
                )
                    return oldIndex;
                return this.y * cols + this.x;
            },
            getColIndex: function getColIndex() {
                var items = root.query('GET_ACTIVE_ITEMS');
                var visibleChildren = root.childViews.filter(function(child) {
                    return child.rect.element.height;
                });
                var children = items.map(function(item) {
                    return visibleChildren.find(function(childView) {
                        return childView.id === item.id;
                    });
                });

                var currentIndex = children.findIndex(function(child) {
                    return child === view;
                });
                var dragHeight = getItemHeight(view);
                var l = children.length;
                var idx = l;
                var childHeight = 0;
                var childBottom = 0;
                var childTop = 0;
                for (var i = 0; i < l; i++) {
                    childHeight = getItemHeight(children[i]);
                    childTop = childBottom;
                    childBottom = childTop + childHeight;
                    if (dragPosition.y < childBottom) {
                        if (currentIndex > i) {
                            if (dragPosition.y < childTop + dragHeight) {
                                idx = i;
                                break;
                            }
                            continue;
                        }
                        idx = i;
                        break;
                    }
                }
                return idx;
            },
        };

        // get new index
        var index = cols > 1 ? location.getGridIndex() : location.getColIndex();
        root.dispatch('MOVE_ITEM', { query: view, index: index });

        // if the index of the item changed, dispatch reorder action
        var currentIndex = dragState.getIndex();

        if (currentIndex === undefined || currentIndex !== index) {
            dragState.setIndex(index);

            if (currentIndex === undefined) return;

            root.dispatch('DID_REORDER_ITEMS', {
                items: root.query('GET_ACTIVE_ITEMS'),
                origin: oldIndex,
                target: index,
            });
        }
    };

    /**
     * Setup action routes
     */
    var route$2 = createRoute({
        DID_ADD_ITEM: addItemView,
        DID_REMOVE_ITEM: removeItemView,
        DID_DRAG_ITEM: dragItem,
    });

    /**
     * Write to view
     * @param root
     * @param actions
     * @param props
     */
    var write$5 = function write(_ref5) {
        var root = _ref5.root,
            props = _ref5.props,
            actions = _ref5.actions,
            shouldOptimize = _ref5.shouldOptimize;
        // route actions
        route$2({ root: root, props: props, actions: actions });
        var dragCoordinates = props.dragCoordinates;

        // available space on horizontal axis
        var horizontalSpace = root.rect.element.width;

        // only draw children that have dimensions
        var visibleChildren = root.childViews.filter(function(child) {
            return child.rect.element.height;
        });

        // sort based on current active items
        var children = root
            .query('GET_ACTIVE_ITEMS')
            .map(function(item) {
                return visibleChildren.find(function(child) {
                    return child.id === item.id;
                });
            })
            .filter(function(item) {
                return item;
            });

        // get index
        var dragIndex = dragCoordinates
            ? getItemIndexByPosition(root, children, dragCoordinates)
            : null;

        // add index is used to reserve the dropped/added item index till the actual item is rendered
        var addIndex = root.ref.addIndex || null;

        // add index no longer needed till possibly next draw
        root.ref.addIndex = null;

        var dragIndexOffset = 0;
        var removeIndexOffset = 0;
        var addIndexOffset = 0;

        if (children.length === 0) return;

        var childRect = children[0].rect.element;
        var itemVerticalMargin = childRect.marginTop + childRect.marginBottom;
        var itemHorizontalMargin = childRect.marginLeft + childRect.marginRight;
        var itemWidth = childRect.width + itemHorizontalMargin;
        var itemHeight = childRect.height + itemVerticalMargin;
        var itemsPerRow = getItemsPerRow(horizontalSpace, itemWidth);

        // stack
        if (itemsPerRow === 1) {
            var offsetY = 0;
            var dragOffset = 0;

            children.forEach(function(child, index) {
                if (dragIndex) {
                    var dist = index - dragIndex;
                    if (dist === -2) {
                        dragOffset = -itemVerticalMargin * 0.25;
                    } else if (dist === -1) {
                        dragOffset = -itemVerticalMargin * 0.75;
                    } else if (dist === 0) {
                        dragOffset = itemVerticalMargin * 0.75;
                    } else if (dist === 1) {
                        dragOffset = itemVerticalMargin * 0.25;
                    } else {
                        dragOffset = 0;
                    }
                }

                if (shouldOptimize) {
                    child.translateX = null;
                    child.translateY = null;
                }

                if (!child.markedForRemoval) {
                    moveItem(child, 0, offsetY + dragOffset);
                }

                var itemHeight = child.rect.element.height + itemVerticalMargin;

                var visualHeight = itemHeight * (child.markedForRemoval ? child.opacity : 1);

                offsetY += visualHeight;
            });
        }
        // grid
        else {
            var prevX = 0;
            var prevY = 0;

            children.forEach(function(child, index) {
                if (index === dragIndex) {
                    dragIndexOffset = 1;
                }

                if (index === addIndex) {
                    addIndexOffset += 1;
                }

                if (child.markedForRemoval && child.opacity < 0.5) {
                    removeIndexOffset -= 1;
                }

                var visualIndex = index + addIndexOffset + dragIndexOffset + removeIndexOffset;

                var indexX = visualIndex % itemsPerRow;
                var indexY = Math.floor(visualIndex / itemsPerRow);

                var offsetX = indexX * itemWidth;
                var offsetY = indexY * itemHeight;

                var vectorX = Math.sign(offsetX - prevX);
                var vectorY = Math.sign(offsetY - prevY);

                prevX = offsetX;
                prevY = offsetY;

                if (child.markedForRemoval) return;

                if (shouldOptimize) {
                    child.translateX = null;
                    child.translateY = null;
                }

                moveItem(child, offsetX, offsetY, vectorX, vectorY);
            });
        }
    };

    /**
     * Filters actions that are meant specifically for a certain child of the list
     * @param child
     * @param actions
     */
    var filterSetItemActions = function filterSetItemActions(child, actions) {
        return actions.filter(function(action) {
            // if action has an id, filter out actions that don't have this child id
            if (action.data && action.data.id) {
                return child.id === action.data.id;
            }

            // allow all other actions
            return true;
        });
    };

    var list = createView({
        create: create$8,
        write: write$5,
        tag: 'ul',
        name: 'list',
        didWriteView: function didWriteView(_ref6) {
            var root = _ref6.root;
            root.childViews
                .filter(function(view) {
                    return view.markedForRemoval && view.opacity === 0 && view.resting;
                })
                .forEach(function(view) {
                    view._destroy();
                    root.removeChildView(view);
                });
        },
        filterFrameActionsForChild: filterSetItemActions,
        mixins: {
            apis: ['dragCoordinates'],
        },
    });

    var create$9 = function create(_ref) {
        var root = _ref.root,
            props = _ref.props;
        root.ref.list = root.appendChildView(root.createChildView(list));
        props.dragCoordinates = null;
        props.overflowing = false;
    };

    var storeDragCoordinates = function storeDragCoordinates(_ref2) {
        var root = _ref2.root,
            props = _ref2.props,
            action = _ref2.action;
        if (!root.query('GET_ITEM_INSERT_LOCATION_FREEDOM')) return;
        props.dragCoordinates = {
            left: action.position.scopeLeft - root.ref.list.rect.element.left,
            top:
                action.position.scopeTop -
                (root.rect.outer.top + root.rect.element.marginTop + root.rect.element.scrollTop),
        };
    };

    var clearDragCoordinates = function clearDragCoordinates(_ref3) {
        var props = _ref3.props;
        props.dragCoordinates = null;
    };

    var route$3 = createRoute({
        DID_DRAG: storeDragCoordinates,
        DID_END_DRAG: clearDragCoordinates,
    });

    var write$6 = function write(_ref4) {
        var root = _ref4.root,
            props = _ref4.props,
            actions = _ref4.actions;

        // route actions
        route$3({ root: root, props: props, actions: actions });

        // current drag position
        root.ref.list.dragCoordinates = props.dragCoordinates;

        // if currently overflowing but no longer received overflow
        if (props.overflowing && !props.overflow) {
            props.overflowing = false;

            // reset overflow state
            root.element.dataset.state = '';
            root.height = null;
        }

        // if is not overflowing currently but does receive overflow value
        if (props.overflow) {
            var newHeight = Math.round(props.overflow);
            if (newHeight !== root.height) {
                props.overflowing = true;
                root.element.dataset.state = 'overflow';
                root.height = newHeight;
            }
        }
    };

    var listScroller = createView({
        create: create$9,
        write: write$6,
        name: 'list-scroller',
        mixins: {
            apis: ['overflow', 'dragCoordinates'],
            styles: ['height', 'translateY'],
            animations: {
                translateY: 'spring',
            },
        },
    });

    var attrToggle = function attrToggle(element, name, state) {
        var enabledValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
        if (state) {
            attr(element, name, enabledValue);
        } else {
            element.removeAttribute(name);
        }
    };

    var resetFileInput = function resetFileInput(input) {
        // no value, no need to reset
        if (!input || input.value === '') {
            return;
        }

        try {
            // for modern browsers
            input.value = '';
        } catch (err) {}

        // for IE10
        if (input.value) {
            // quickly append input to temp form and reset form
            var form = createElement$1('form');
            var parentNode = input.parentNode;
            var ref = input.nextSibling;
            form.appendChild(input);
            form.reset();

            // re-inject input where it originally was
            if (ref) {
                parentNode.insertBefore(input, ref);
            } else {
                parentNode.appendChild(input);
            }
        }
    };

    var create$a = function create(_ref) {
        var root = _ref.root,
            props = _ref.props;

        // set id so can be referenced from outside labels
        root.element.id = 'filepond--browser-' + props.id;

        // set name of element (is removed when a value is set)
        attr(root.element, 'name', root.query('GET_NAME'));

        // we have to link this element to the status element
        attr(root.element, 'aria-controls', 'filepond--assistant-' + props.id);

        // set label, we use labelled by as otherwise the screenreader does not read the "browse" text in the label (as it has tabindex: 0)
        attr(root.element, 'aria-labelledby', 'filepond--drop-label-' + props.id);

        // set configurable props
        setAcceptedFileTypes({
            root: root,
            action: { value: root.query('GET_ACCEPTED_FILE_TYPES') },
        });
        toggleAllowMultiple({ root: root, action: { value: root.query('GET_ALLOW_MULTIPLE') } });
        toggleDirectoryFilter({
            root: root,
            action: { value: root.query('GET_ALLOW_DIRECTORIES_ONLY') },
        });
        toggleDisabled({ root: root });
        toggleRequired({ root: root, action: { value: root.query('GET_REQUIRED') } });
        setCaptureMethod({ root: root, action: { value: root.query('GET_CAPTURE_METHOD') } });

        // handle changes to the input field
        root.ref.handleChange = function(e) {
            if (!root.element.value) {
                return;
            }

            // extract files and move value of webkitRelativePath path to _relativePath
            var files = Array.from(root.element.files).map(function(file) {
                file._relativePath = file.webkitRelativePath;
                return file;
            });

            // we add a little delay so the OS file select window can move out of the way before we add our file
            setTimeout(function() {
                // load files
                props.onload(files);

                // reset input, it's just for exposing a method to drop files, should not retain any state
                resetFileInput(root.element);
            }, 250);
        };

        root.element.addEventListener('change', root.ref.handleChange);
    };

    var setAcceptedFileTypes = function setAcceptedFileTypes(_ref2) {
        var root = _ref2.root,
            action = _ref2.action;
        if (!root.query('GET_ALLOW_SYNC_ACCEPT_ATTRIBUTE')) return;
        attrToggle(
            root.element,
            'accept',
            !!action.value,
            action.value ? action.value.join(',') : ''
        );
    };

    var toggleAllowMultiple = function toggleAllowMultiple(_ref3) {
        var root = _ref3.root,
            action = _ref3.action;
        attrToggle(root.element, 'multiple', action.value);
    };

    var toggleDirectoryFilter = function toggleDirectoryFilter(_ref4) {
        var root = _ref4.root,
            action = _ref4.action;
        attrToggle(root.element, 'webkitdirectory', action.value);
    };

    var toggleDisabled = function toggleDisabled(_ref5) {
        var root = _ref5.root;
        var isDisabled = root.query('GET_DISABLED');
        var doesAllowBrowse = root.query('GET_ALLOW_BROWSE');
        var disableField = isDisabled || !doesAllowBrowse;
        attrToggle(root.element, 'disabled', disableField);
    };

    var toggleRequired = function toggleRequired(_ref6) {
        var root = _ref6.root,
            action = _ref6.action;
        // want to remove required, always possible
        if (!action.value) {
            attrToggle(root.element, 'required', false);
        }
        // if want to make required, only possible when zero items
        else if (root.query('GET_TOTAL_ITEMS') === 0) {
            attrToggle(root.element, 'required', true);
        }
    };

    var setCaptureMethod = function setCaptureMethod(_ref7) {
        var root = _ref7.root,
            action = _ref7.action;
        attrToggle(
            root.element,
            'capture',
            !!action.value,
            action.value === true ? '' : action.value
        );
    };

    var updateRequiredStatus = function updateRequiredStatus(_ref8) {
        var root = _ref8.root;
        var element = root.element;
        // always remove the required attribute when more than zero items
        if (root.query('GET_TOTAL_ITEMS') > 0) {
            attrToggle(element, 'required', false);
            attrToggle(element, 'name', false);
        } else {
            // add name attribute
            attrToggle(element, 'name', true, root.query('GET_NAME'));

            // remove any validation messages
            var shouldCheckValidity = root.query('GET_CHECK_VALIDITY');
            if (shouldCheckValidity) {
                element.setCustomValidity('');
            }

            // we only add required if the field has been deemed required
            if (root.query('GET_REQUIRED')) {
                attrToggle(element, 'required', true);
            }
        }
    };

    var updateFieldValidityStatus = function updateFieldValidityStatus(_ref9) {
        var root = _ref9.root;
        var shouldCheckValidity = root.query('GET_CHECK_VALIDITY');
        if (!shouldCheckValidity) return;
        root.element.setCustomValidity(root.query('GET_LABEL_INVALID_FIELD'));
    };

    var browser = createView({
        tag: 'input',
        name: 'browser',
        ignoreRect: true,
        ignoreRectUpdate: true,
        attributes: {
            type: 'file',
        },

        create: create$a,
        destroy: function destroy(_ref10) {
            var root = _ref10.root;
            root.element.removeEventListener('change', root.ref.handleChange);
        },
        write: createRoute({
            DID_LOAD_ITEM: updateRequiredStatus,
            DID_REMOVE_ITEM: updateRequiredStatus,
            DID_THROW_ITEM_INVALID: updateFieldValidityStatus,

            DID_SET_DISABLED: toggleDisabled,
            DID_SET_ALLOW_BROWSE: toggleDisabled,
            DID_SET_ALLOW_DIRECTORIES_ONLY: toggleDirectoryFilter,
            DID_SET_ALLOW_MULTIPLE: toggleAllowMultiple,
            DID_SET_ACCEPTED_FILE_TYPES: setAcceptedFileTypes,
            DID_SET_CAPTURE_METHOD: setCaptureMethod,
            DID_SET_REQUIRED: toggleRequired,
        }),
    });

    var Key = {
        ENTER: 13,
        SPACE: 32,
    };

    var create$b = function create(_ref) {
        var root = _ref.root,
            props = _ref.props;
        // create the label and link it to the file browser
        var label = createElement$1('label');
        attr(label, 'for', 'filepond--browser-' + props.id);

        // use for labeling file input (aria-labelledby on file input)
        attr(label, 'id', 'filepond--drop-label-' + props.id);

        // handle keys
        root.ref.handleKeyDown = function(e) {
            var isActivationKey = e.keyCode === Key.ENTER || e.keyCode === Key.SPACE;
            if (!isActivationKey) return;
            // stops from triggering the element a second time
            e.preventDefault();

            // click link (will then in turn activate file input)
            root.ref.label.click();
        };

        root.ref.handleClick = function(e) {
            var isLabelClick = e.target === label || label.contains(e.target);

            // don't want to click twice
            if (isLabelClick) return;

            // click link (will then in turn activate file input)
            root.ref.label.click();
        };

        // attach events
        label.addEventListener('keydown', root.ref.handleKeyDown);
        root.element.addEventListener('click', root.ref.handleClick);

        // update
        updateLabelValue(label, props.caption);

        // add!
        root.appendChild(label);
        root.ref.label = label;
    };

    var updateLabelValue = function updateLabelValue(label, value) {
        label.innerHTML = value;
        var clickable = label.querySelector('.filepond--label-action');
        if (clickable) {
            attr(clickable, 'tabindex', '0');
        }
        return value;
    };

    var dropLabel = createView({
        name: 'drop-label',
        ignoreRect: true,
        create: create$b,
        destroy: function destroy(_ref2) {
            var root = _ref2.root;
            root.ref.label.addEventListener('keydown', root.ref.handleKeyDown);
            root.element.removeEventListener('click', root.ref.handleClick);
        },
        write: createRoute({
            DID_SET_LABEL_IDLE: function DID_SET_LABEL_IDLE(_ref3) {
                var root = _ref3.root,
                    action = _ref3.action;
                updateLabelValue(root.ref.label, action.value);
            },
        }),

        mixins: {
            styles: ['opacity', 'translateX', 'translateY'],
            animations: {
                opacity: { type: 'tween', duration: 150 },
                translateX: 'spring',
                translateY: 'spring',
            },
        },
    });

    var blob = createView({
        name: 'drip-blob',
        ignoreRect: true,
        mixins: {
            styles: ['translateX', 'translateY', 'scaleX', 'scaleY', 'opacity'],
            animations: {
                scaleX: 'spring',
                scaleY: 'spring',
                translateX: 'spring',
                translateY: 'spring',
                opacity: { type: 'tween', duration: 250 },
            },
        },
    });

    var addBlob = function addBlob(_ref) {
        var root = _ref.root;
        var centerX = root.rect.element.width * 0.5;
        var centerY = root.rect.element.height * 0.5;

        root.ref.blob = root.appendChildView(
            root.createChildView(blob, {
                opacity: 0,
                scaleX: 2.5,
                scaleY: 2.5,
                translateX: centerX,
                translateY: centerY,
            })
        );
    };

    var moveBlob = function moveBlob(_ref2) {
        var root = _ref2.root,
            action = _ref2.action;
        if (!root.ref.blob) {
            addBlob({ root: root });
            return;
        }

        root.ref.blob.translateX = action.position.scopeLeft;
        root.ref.blob.translateY = action.position.scopeTop;
        root.ref.blob.scaleX = 1;
        root.ref.blob.scaleY = 1;
        root.ref.blob.opacity = 1;
    };

    var hideBlob = function hideBlob(_ref3) {
        var root = _ref3.root;
        if (!root.ref.blob) {
            return;
        }
        root.ref.blob.opacity = 0;
    };

    var explodeBlob = function explodeBlob(_ref4) {
        var root = _ref4.root;
        if (!root.ref.blob) {
            return;
        }
        root.ref.blob.scaleX = 2.5;
        root.ref.blob.scaleY = 2.5;
        root.ref.blob.opacity = 0;
    };

    var write$7 = function write(_ref5) {
        var root = _ref5.root,
            props = _ref5.props,
            actions = _ref5.actions;
        route$4({ root: root, props: props, actions: actions });
        var blob = root.ref.blob;

        if (actions.length === 0 && blob && blob.opacity === 0) {
            root.removeChildView(blob);
            root.ref.blob = null;
        }
    };

    var route$4 = createRoute({
        DID_DRAG: moveBlob,
        DID_DROP: explodeBlob,
        DID_END_DRAG: hideBlob,
    });

    var drip = createView({
        ignoreRect: true,
        ignoreRectUpdate: true,
        name: 'drip',
        write: write$7,
    });

    var setInputFiles = function setInputFiles(element, files) {
        try {
            // Create a DataTransfer instance and add a newly created file
            var dataTransfer = new DataTransfer();
            files.forEach(function(file) {
                if (file instanceof File) {
                    dataTransfer.items.add(file);
                } else {
                    dataTransfer.items.add(
                        new File([file], file.name, {
                            type: file.type,
                        })
                    );
                }
            });

            // Assign the DataTransfer files list to the file input
            element.files = dataTransfer.files;
        } catch (err) {
            return false;
        }
        return true;
    };

    var create$c = function create(_ref) {
        var root = _ref.root;
        return (root.ref.fields = {});
    };

    var getField = function getField(root, id) {
        return root.ref.fields[id];
    };

    var syncFieldPositionsWithItems = function syncFieldPositionsWithItems(root) {
        root.query('GET_ACTIVE_ITEMS').forEach(function(item) {
            if (!root.ref.fields[item.id]) return;
            root.element.appendChild(root.ref.fields[item.id]);
        });
    };

    var didReorderItems = function didReorderItems(_ref2) {
        var root = _ref2.root;
        return syncFieldPositionsWithItems(root);
    };

    var didAddItem = function didAddItem(_ref3) {
        var root = _ref3.root,
            action = _ref3.action;
        var fileItem = root.query('GET_ITEM', action.id);
        var isLocalFile = fileItem.origin === FileOrigin.LOCAL;
        var shouldUseFileInput = !isLocalFile && root.query('SHOULD_UPDATE_FILE_INPUT');
        var dataContainer = createElement$1('input');
        dataContainer.type = shouldUseFileInput ? 'file' : 'hidden';
        dataContainer.name = root.query('GET_NAME');
        root.ref.fields[action.id] = dataContainer;
        syncFieldPositionsWithItems(root);
    };

    var didLoadItem$1 = function didLoadItem(_ref4) {
        var root = _ref4.root,
            action = _ref4.action;
        var field = getField(root, action.id);
        if (!field) return;

        // store server ref in hidden input
        if (action.serverFileReference !== null) field.value = action.serverFileReference;

        // store file item in file input
        if (!root.query('SHOULD_UPDATE_FILE_INPUT')) return;

        var fileItem = root.query('GET_ITEM', action.id);
        setInputFiles(field, [fileItem.file]);
    };

    var didPrepareOutput = function didPrepareOutput(_ref5) {
        var root = _ref5.root,
            action = _ref5.action;
        // this timeout pushes the handler after 'load'
        if (!root.query('SHOULD_UPDATE_FILE_INPUT')) return;
        setTimeout(function() {
            var field = getField(root, action.id);
            if (!field) return;
            setInputFiles(field, [action.file]);
        }, 0);
    };

    var didSetDisabled = function didSetDisabled(_ref6) {
        var root = _ref6.root;
        root.element.disabled = root.query('GET_DISABLED');
    };

    var didRemoveItem = function didRemoveItem(_ref7) {
        var root = _ref7.root,
            action = _ref7.action;
        var field = getField(root, action.id);
        if (!field) return;
        if (field.parentNode) field.parentNode.removeChild(field);
        delete root.ref.fields[action.id];
    };

    // only runs for server files. will refuse to update the value if the field
    // is a file field
    var didDefineValue = function didDefineValue(_ref8) {
        var root = _ref8.root,
            action = _ref8.action;
        var field = getField(root, action.id);
        if (!field) return;
        if (action.value === null) {
            // clear field value
            field.removeAttribute('value');
        } else {
            // set field value
            if (field.type != 'file') {
                field.value = action.value;
            }
        }
        syncFieldPositionsWithItems(root);
    };

    var write$8 = createRoute({
        DID_SET_DISABLED: didSetDisabled,
        DID_ADD_ITEM: didAddItem,
        DID_LOAD_ITEM: didLoadItem$1,
        DID_REMOVE_ITEM: didRemoveItem,
        DID_DEFINE_VALUE: didDefineValue,
        DID_PREPARE_OUTPUT: didPrepareOutput,
        DID_REORDER_ITEMS: didReorderItems,
        DID_SORT_ITEMS: didReorderItems,
    });

    var data = createView({
        tag: 'fieldset',
        name: 'data',
        create: create$c,
        write: write$8,
        ignoreRect: true,
    });

    var getRootNode = function getRootNode(element) {
        return 'getRootNode' in element ? element.getRootNode() : document;
    };

    var images = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'tiff'];
    var text$1 = ['css', 'csv', 'html', 'txt'];
    var map = {
        zip: 'zip|compressed',
        epub: 'application/epub+zip',
    };

    var guesstimateMimeType = function guesstimateMimeType() {
        var extension = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        extension = extension.toLowerCase();
        if (images.includes(extension)) {
            return (
                'image/' +
                (extension === 'jpg' ? 'jpeg' : extension === 'svg' ? 'svg+xml' : extension)
            );
        }
        if (text$1.includes(extension)) {
            return 'text/' + extension;
        }

        return map[extension] || '';
    };

    var requestDataTransferItems = function requestDataTransferItems(dataTransfer) {
        return new Promise(function(resolve, reject) {
            // try to get links from transfer, if found we'll exit immediately (unless a file is in the dataTransfer as well, this is because Firefox could represent the file as a URL and a file object at the same time)
            var links = getLinks(dataTransfer);
            if (links.length && !hasFiles(dataTransfer)) {
                return resolve(links);
            }
            // try to get files from the transfer
            getFiles(dataTransfer).then(resolve);
        });
    };

    /**
     * Test if datatransfer has files
     */
    var hasFiles = function hasFiles(dataTransfer) {
        if (dataTransfer.files) return dataTransfer.files.length > 0;
        return false;
    };

    /**
     * Extracts files from a DataTransfer object
     */
    var getFiles = function getFiles(dataTransfer) {
        return new Promise(function(resolve, reject) {
            // get the transfer items as promises
            var promisedFiles = (dataTransfer.items ? Array.from(dataTransfer.items) : [])
                // only keep file system items (files and directories)
                .filter(function(item) {
                    return isFileSystemItem(item);
                })

                // map each item to promise
                .map(function(item) {
                    return getFilesFromItem(item);
                });

            // if is empty, see if we can extract some info from the files property as a fallback
            if (!promisedFiles.length) {
                // TODO: test for directories (should not be allowed)
                // Use FileReader, problem is that the files property gets lost in the process
                resolve(dataTransfer.files ? Array.from(dataTransfer.files) : []);
                return;
            }

            // done!
            Promise.all(promisedFiles)
                .then(function(returnedFileGroups) {
                    // flatten groups
                    var files = [];
                    returnedFileGroups.forEach(function(group) {
                        files.push.apply(files, group);
                    });

                    // done (filter out empty files)!
                    resolve(
                        files
                            .filter(function(file) {
                                return file;
                            })
                            .map(function(file) {
                                if (!file._relativePath)
                                    file._relativePath = file.webkitRelativePath;
                                return file;
                            })
                    );
                })
                .catch(console.error);
        });
    };

    var isFileSystemItem = function isFileSystemItem(item) {
        if (isEntry(item)) {
            var entry = getAsEntry(item);
            if (entry) {
                return entry.isFile || entry.isDirectory;
            }
        }
        return item.kind === 'file';
    };

    var getFilesFromItem = function getFilesFromItem(item) {
        return new Promise(function(resolve, reject) {
            if (isDirectoryEntry(item)) {
                getFilesInDirectory(getAsEntry(item))
                    .then(resolve)
                    .catch(reject);
                return;
            }

            resolve([item.getAsFile()]);
        });
    };

    var getFilesInDirectory = function getFilesInDirectory(entry) {
        return new Promise(function(resolve, reject) {
            var files = [];

            // the total entries to read
            var dirCounter = 0;
            var fileCounter = 0;

            var resolveIfDone = function resolveIfDone() {
                if (fileCounter === 0 && dirCounter === 0) {
                    resolve(files);
                }
            };

            // the recursive function
            var readEntries = function readEntries(dirEntry) {
                dirCounter++;

                var directoryReader = dirEntry.createReader();

                // directories are returned in batches, we need to process all batches before we're done
                var readBatch = function readBatch() {
                    directoryReader.readEntries(function(entries) {
                        if (entries.length === 0) {
                            dirCounter--;
                            resolveIfDone();
                            return;
                        }

                        entries.forEach(function(entry) {
                            // recursively read more directories
                            if (entry.isDirectory) {
                                readEntries(entry);
                            } else {
                                // read as file
                                fileCounter++;

                                entry.file(function(file) {
                                    var correctedFile = correctMissingFileType(file);
                                    if (entry.fullPath)
                                        correctedFile._relativePath = entry.fullPath;
                                    files.push(correctedFile);
                                    fileCounter--;
                                    resolveIfDone();
                                });
                            }
                        });

                        // try to get next batch of files
                        readBatch();
                    }, reject);
                };

                // read first batch of files
                readBatch();
            };

            // go!
            readEntries(entry);
        });
    };

    var correctMissingFileType = function correctMissingFileType(file) {
        if (file.type.length) return file;
        var date = file.lastModifiedDate;
        var name = file.name;
        var type = guesstimateMimeType(getExtensionFromFilename(file.name));
        if (!type.length) return file;
        file = file.slice(0, file.size, type);
        file.name = name;
        file.lastModifiedDate = date;
        return file;
    };

    var isDirectoryEntry = function isDirectoryEntry(item) {
        return isEntry(item) && (getAsEntry(item) || {}).isDirectory;
    };

    var isEntry = function isEntry(item) {
        return 'webkitGetAsEntry' in item;
    };

    var getAsEntry = function getAsEntry(item) {
        return item.webkitGetAsEntry();
    };

    /**
     * Extracts links from a DataTransfer object
     */
    var getLinks = function getLinks(dataTransfer) {
        var links = [];
        try {
            // look in meta data property
            links = getLinksFromTransferMetaData(dataTransfer);
            if (links.length) {
                return links;
            }
            links = getLinksFromTransferURLData(dataTransfer);
        } catch (e) {
            // nope nope nope (probably IE trouble)
        }
        return links;
    };

    var getLinksFromTransferURLData = function getLinksFromTransferURLData(dataTransfer) {
        var data = dataTransfer.getData('url');
        if (typeof data === 'string' && data.length) {
            return [data];
        }
        return [];
    };

    var getLinksFromTransferMetaData = function getLinksFromTransferMetaData(dataTransfer) {
        var data = dataTransfer.getData('text/html');
        if (typeof data === 'string' && data.length) {
            var matches = data.match(/src\s*=\s*"(.+?)"/);
            if (matches) {
                return [matches[1]];
            }
        }
        return [];
    };

    var dragNDropObservers = [];

    var eventPosition = function eventPosition(e) {
        return {
            pageLeft: e.pageX,
            pageTop: e.pageY,
            scopeLeft: e.offsetX || e.layerX,
            scopeTop: e.offsetY || e.layerY,
        };
    };

    var createDragNDropClient = function createDragNDropClient(
        element,
        scopeToObserve,
        filterElement
    ) {
        var observer = getDragNDropObserver(scopeToObserve);

        var client = {
            element: element,
            filterElement: filterElement,
            state: null,
            ondrop: function ondrop() {},
            onenter: function onenter() {},
            ondrag: function ondrag() {},
            onexit: function onexit() {},
            onload: function onload() {},
            allowdrop: function allowdrop() {},
        };

        client.destroy = observer.addListener(client);

        return client;
    };

    var getDragNDropObserver = function getDragNDropObserver(element) {
        // see if already exists, if so, return
        var observer = dragNDropObservers.find(function(item) {
            return item.element === element;
        });
        if (observer) {
            return observer;
        }

        // create new observer, does not yet exist for this element
        var newObserver = createDragNDropObserver(element);
        dragNDropObservers.push(newObserver);
        return newObserver;
    };

    var createDragNDropObserver = function createDragNDropObserver(element) {
        var clients = [];

        var routes = {
            dragenter: dragenter,
            dragover: dragover,
            dragleave: dragleave,
            drop: drop,
        };

        var handlers = {};

        forin(routes, function(event, createHandler) {
            handlers[event] = createHandler(element, clients);
            element.addEventListener(event, handlers[event], false);
        });

        var observer = {
            element: element,
            addListener: function addListener(client) {
                // add as client
                clients.push(client);

                // return removeListener function
                return function() {
                    // remove client
                    clients.splice(clients.indexOf(client), 1);

                    // if no more clients, clean up observer
                    if (clients.length === 0) {
                        dragNDropObservers.splice(dragNDropObservers.indexOf(observer), 1);

                        forin(routes, function(event) {
                            element.removeEventListener(event, handlers[event], false);
                        });
                    }
                };
            },
        };

        return observer;
    };

    var elementFromPoint = function elementFromPoint(root, point) {
        if (!('elementFromPoint' in root)) {
            root = document;
        }
        return root.elementFromPoint(point.x, point.y);
    };

    var isEventTarget = function isEventTarget(e, target) {
        // get root
        var root = getRootNode(target);

        // get element at position
        // if root is not actual shadow DOM and does not have elementFromPoint method, use the one on document
        var elementAtPosition = elementFromPoint(root, {
            x: e.pageX - window.pageXOffset,
            y: e.pageY - window.pageYOffset,
        });

        // test if target is the element or if one of its children is
        return elementAtPosition === target || target.contains(elementAtPosition);
    };

    var initialTarget = null;

    var setDropEffect = function setDropEffect(dataTransfer, effect) {
        // is in try catch as IE11 will throw error if not
        try {
            dataTransfer.dropEffect = effect;
        } catch (e) {}
    };

    var dragenter = function dragenter(root, clients) {
        return function(e) {
            e.preventDefault();

            initialTarget = e.target;

            clients.forEach(function(client) {
                var element = client.element,
                    onenter = client.onenter;

                if (isEventTarget(e, element)) {
                    client.state = 'enter';

                    // fire enter event
                    onenter(eventPosition(e));
                }
            });
        };
    };

    var dragover = function dragover(root, clients) {
        return function(e) {
            e.preventDefault();

            var dataTransfer = e.dataTransfer;

            requestDataTransferItems(dataTransfer).then(function(items) {
                var overDropTarget = false;

                clients.some(function(client) {
                    var filterElement = client.filterElement,
                        element = client.element,
                        onenter = client.onenter,
                        onexit = client.onexit,
                        ondrag = client.ondrag,
                        allowdrop = client.allowdrop;

                    // by default we can drop
                    setDropEffect(dataTransfer, 'copy');

                    // allow transfer of these items
                    var allowsTransfer = allowdrop(items);

                    // only used when can be dropped on page
                    if (!allowsTransfer) {
                        setDropEffect(dataTransfer, 'none');
                        return;
                    }

                    // targetting this client
                    if (isEventTarget(e, element)) {
                        overDropTarget = true;

                        // had no previous state, means we are entering this client
                        if (client.state === null) {
                            client.state = 'enter';
                            onenter(eventPosition(e));
                            return;
                        }

                        // now over element (no matter if it allows the drop or not)
                        client.state = 'over';

                        // needs to allow transfer
                        if (filterElement && !allowsTransfer) {
                            setDropEffect(dataTransfer, 'none');
                            return;
                        }

                        // dragging
                        ondrag(eventPosition(e));
                    } else {
                        // should be over an element to drop
                        if (filterElement && !overDropTarget) {
                            setDropEffect(dataTransfer, 'none');
                        }

                        // might have just left this client?
                        if (client.state) {
                            client.state = null;
                            onexit(eventPosition(e));
                        }
                    }
                });
            });
        };
    };

    var drop = function drop(root, clients) {
        return function(e) {
            e.preventDefault();

            var dataTransfer = e.dataTransfer;

            requestDataTransferItems(dataTransfer).then(function(items) {
                clients.forEach(function(client) {
                    var filterElement = client.filterElement,
                        element = client.element,
                        ondrop = client.ondrop,
                        onexit = client.onexit,
                        allowdrop = client.allowdrop;

                    client.state = null;

                    // if we're filtering on element we need to be over the element to drop
                    if (filterElement && !isEventTarget(e, element)) return;

                    // no transfer for this client
                    if (!allowdrop(items)) return onexit(eventPosition(e));

                    // we can drop these items on this client
                    ondrop(eventPosition(e), items);
                });
            });
        };
    };

    var dragleave = function dragleave(root, clients) {
        return function(e) {
            if (initialTarget !== e.target) {
                return;
            }

            clients.forEach(function(client) {
                var onexit = client.onexit;

                client.state = null;

                onexit(eventPosition(e));
            });
        };
    };

    var createHopper = function createHopper(scope, validateItems, options) {
        // is now hopper scope
        scope.classList.add('filepond--hopper');

        // shortcuts
        var catchesDropsOnPage = options.catchesDropsOnPage,
            requiresDropOnElement = options.requiresDropOnElement,
            _options$filterItems = options.filterItems,
            filterItems =
                _options$filterItems === void 0
                    ? function(items) {
                          return items;
                      }
                    : _options$filterItems;

        // create a dnd client
        var client = createDragNDropClient(
            scope,
            catchesDropsOnPage ? document.documentElement : scope,
            requiresDropOnElement
        );

        // current client state
        var lastState = '';
        var currentState = '';

        // determines if a file may be dropped
        client.allowdrop = function(items) {
            // TODO: if we can, throw error to indicate the items cannot by dropped

            return validateItems(filterItems(items));
        };

        client.ondrop = function(position, items) {
            var filteredItems = filterItems(items);

            if (!validateItems(filteredItems)) {
                api.ondragend(position);
                return;
            }

            currentState = 'drag-drop';

            api.onload(filteredItems, position);
        };

        client.ondrag = function(position) {
            api.ondrag(position);
        };

        client.onenter = function(position) {
            currentState = 'drag-over';

            api.ondragstart(position);
        };

        client.onexit = function(position) {
            currentState = 'drag-exit';

            api.ondragend(position);
        };

        var api = {
            updateHopperState: function updateHopperState() {
                if (lastState !== currentState) {
                    scope.dataset.hopperState = currentState;
                    lastState = currentState;
                }
            },
            onload: function onload() {},
            ondragstart: function ondragstart() {},
            ondrag: function ondrag() {},
            ondragend: function ondragend() {},
            destroy: function destroy() {
                // destroy client
                client.destroy();
            },
        };

        return api;
    };

    var listening = false;
    var listeners$1 = [];

    var handlePaste = function handlePaste(e) {
        // if is pasting in input or textarea and the target is outside of a filepond scope, ignore
        var activeEl = document.activeElement;
        var isActiveElementEditable =
            activeEl &&
            (/textarea|input/i.test(activeEl.nodeName) ||
                activeEl.getAttribute('contenteditable') === 'true');

        if (isActiveElementEditable) {
            // test textarea or input is contained in filepond root
            var inScope = false;
            var element = activeEl;
            while (element !== document.body) {
                if (element.classList.contains('filepond--root')) {
                    inScope = true;
                    break;
                }
                element = element.parentNode;
            }

            if (!inScope) return;
        }

        requestDataTransferItems(e.clipboardData).then(function(files) {
            // no files received
            if (!files.length) {
                return;
            }

            // notify listeners of received files
            listeners$1.forEach(function(listener) {
                return listener(files);
            });
        });
    };

    var listen = function listen(cb) {
        // can't add twice
        if (listeners$1.includes(cb)) {
            return;
        }

        // add initial listener
        listeners$1.push(cb);

        // setup paste listener for entire page
        if (listening) {
            return;
        }

        listening = true;
        document.addEventListener('paste', handlePaste);
    };

    var unlisten = function unlisten(listener) {
        arrayRemove(listeners$1, listeners$1.indexOf(listener));

        // clean up
        if (listeners$1.length === 0) {
            document.removeEventListener('paste', handlePaste);
            listening = false;
        }
    };

    var createPaster = function createPaster() {
        var cb = function cb(files) {
            api.onload(files);
        };

        var api = {
            destroy: function destroy() {
                unlisten(cb);
            },
            onload: function onload() {},
        };

        listen(cb);

        return api;
    };

    /**
     * Creates the file view
     */
    var create$d = function create(_ref) {
        var root = _ref.root,
            props = _ref.props;
        root.element.id = 'filepond--assistant-' + props.id;
        attr(root.element, 'role', 'alert');
        attr(root.element, 'aria-live', 'polite');
        attr(root.element, 'aria-relevant', 'additions');
    };

    var addFilesNotificationTimeout = null;
    var notificationClearTimeout = null;

    var filenames = [];

    var assist = function assist(root, message) {
        root.element.textContent = message;
    };

    var clear$1 = function clear(root) {
        root.element.textContent = '';
    };

    var listModified = function listModified(root, filename, label) {
        var total = root.query('GET_TOTAL_ITEMS');
        assist(
            root,
            label +
                ' ' +
                filename +
                ', ' +
                total +
                ' ' +
                (total === 1
                    ? root.query('GET_LABEL_FILE_COUNT_SINGULAR')
                    : root.query('GET_LABEL_FILE_COUNT_PLURAL'))
        );

        // clear group after set amount of time so the status is not read twice
        clearTimeout(notificationClearTimeout);
        notificationClearTimeout = setTimeout(function() {
            clear$1(root);
        }, 1500);
    };

    var isUsingFilePond = function isUsingFilePond(root) {
        return root.element.parentNode.contains(document.activeElement);
    };

    var itemAdded = function itemAdded(_ref2) {
        var root = _ref2.root,
            action = _ref2.action;
        if (!isUsingFilePond(root)) {
            return;
        }

        root.element.textContent = '';
        var item = root.query('GET_ITEM', action.id);
        filenames.push(item.filename);

        clearTimeout(addFilesNotificationTimeout);
        addFilesNotificationTimeout = setTimeout(function() {
            listModified(root, filenames.join(', '), root.query('GET_LABEL_FILE_ADDED'));
            filenames.length = 0;
        }, 750);
    };

    var itemRemoved = function itemRemoved(_ref3) {
        var root = _ref3.root,
            action = _ref3.action;
        if (!isUsingFilePond(root)) {
            return;
        }

        var item = action.item;
        listModified(root, item.filename, root.query('GET_LABEL_FILE_REMOVED'));
    };

    var itemProcessed = function itemProcessed(_ref4) {
        var root = _ref4.root,
            action = _ref4.action;
        // will also notify the user when FilePond is not being used, as the user might be occupied with other activities while uploading a file

        var item = root.query('GET_ITEM', action.id);
        var filename = item.filename;
        var label = root.query('GET_LABEL_FILE_PROCESSING_COMPLETE');

        assist(root, filename + ' ' + label);
    };

    var itemProcessedUndo = function itemProcessedUndo(_ref5) {
        var root = _ref5.root,
            action = _ref5.action;
        var item = root.query('GET_ITEM', action.id);
        var filename = item.filename;
        var label = root.query('GET_LABEL_FILE_PROCESSING_ABORTED');

        assist(root, filename + ' ' + label);
    };

    var itemError = function itemError(_ref6) {
        var root = _ref6.root,
            action = _ref6.action;
        var item = root.query('GET_ITEM', action.id);
        var filename = item.filename;

        // will also notify the user when FilePond is not being used, as the user might be occupied with other activities while uploading a file

        assist(root, action.status.main + ' ' + filename + ' ' + action.status.sub);
    };

    var assistant = createView({
        create: create$d,
        ignoreRect: true,
        ignoreRectUpdate: true,
        write: createRoute({
            DID_LOAD_ITEM: itemAdded,
            DID_REMOVE_ITEM: itemRemoved,
            DID_COMPLETE_ITEM_PROCESSING: itemProcessed,

            DID_ABORT_ITEM_PROCESSING: itemProcessedUndo,
            DID_REVERT_ITEM_PROCESSING: itemProcessedUndo,

            DID_THROW_ITEM_REMOVE_ERROR: itemError,
            DID_THROW_ITEM_LOAD_ERROR: itemError,
            DID_THROW_ITEM_INVALID: itemError,
            DID_THROW_ITEM_PROCESSING_ERROR: itemError,
        }),

        tag: 'span',
        name: 'assistant',
    });

    var toCamels = function toCamels(string) {
        var separator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '-';
        return string.replace(new RegExp(separator + '.', 'g'), function(sub) {
            return sub.charAt(1).toUpperCase();
        });
    };

    var debounce = function debounce(func) {
        var interval = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 16;
        var immidiateOnly =
            arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
        var last = Date.now();
        var timeout = null;

        return function() {
            for (
                var _len = arguments.length, args = new Array(_len), _key = 0;
                _key < _len;
                _key++
            ) {
                args[_key] = arguments[_key];
            }
            clearTimeout(timeout);

            var dist = Date.now() - last;

            var fn = function fn() {
                last = Date.now();
                func.apply(void 0, args);
            };

            if (dist < interval) {
                // we need to delay by the difference between interval and dist
                // for example: if distance is 10 ms and interval is 16 ms,
                // we need to wait an additional 6ms before calling the function)
                if (!immidiateOnly) {
                    timeout = setTimeout(fn, interval - dist);
                }
            } else {
                // go!
                fn();
            }
        };
    };

    var MAX_FILES_LIMIT = 1000000;

    var prevent = function prevent(e) {
        return e.preventDefault();
    };

    var create$e = function create(_ref) {
        var root = _ref.root,
            props = _ref.props;
        // Add id
        var id = root.query('GET_ID');
        if (id) {
            root.element.id = id;
        }

        // Add className
        var className = root.query('GET_CLASS_NAME');
        if (className) {
            className
                .split(' ')
                .filter(function(name) {
                    return name.length;
                })
                .forEach(function(name) {
                    root.element.classList.add(name);
                });
        }

        // Field label
        root.ref.label = root.appendChildView(
            root.createChildView(
                dropLabel,
                Object.assign({}, props, {
                    translateY: null,
                    caption: root.query('GET_LABEL_IDLE'),
                })
            )
        );

        // List of items
        root.ref.list = root.appendChildView(
            root.createChildView(listScroller, { translateY: null })
        );

        // Background panel
        root.ref.panel = root.appendChildView(root.createChildView(panel, { name: 'panel-root' }));

        // Assistant notifies assistive tech when content changes
        root.ref.assistant = root.appendChildView(
            root.createChildView(assistant, Object.assign({}, props))
        );

        // Data
        root.ref.data = root.appendChildView(root.createChildView(data, Object.assign({}, props)));

        // Measure (tests if fixed height was set)
        // DOCTYPE needs to be set for this to work
        root.ref.measure = createElement$1('div');
        root.ref.measure.style.height = '100%';
        root.element.appendChild(root.ref.measure);

        // information on the root height or fixed height status
        root.ref.bounds = null;

        // apply initial style properties
        root.query('GET_STYLES')
            .filter(function(style) {
                return !isEmpty(style.value);
            })
            .map(function(_ref2) {
                var name = _ref2.name,
                    value = _ref2.value;
                root.element.dataset[name] = value;
            });

        // determine if width changed
        root.ref.widthPrevious = null;
        root.ref.widthUpdated = debounce(function() {
            root.ref.updateHistory = [];
            root.dispatch('DID_RESIZE_ROOT');
        }, 250);

        // history of updates
        root.ref.previousAspectRatio = null;
        root.ref.updateHistory = [];

        // prevent scrolling and zooming on iOS (only if supports pointer events, for then we can enable reorder)
        var canHover = window.matchMedia('(pointer: fine) and (hover: hover)').matches;
        var hasPointerEvents = 'PointerEvent' in window;
        if (root.query('GET_ALLOW_REORDER') && hasPointerEvents && !canHover) {
            root.element.addEventListener('touchmove', prevent, { passive: false });
            root.element.addEventListener('gesturestart', prevent);
        }

        // add credits
        var credits = root.query('GET_CREDITS');
        var hasCredits = credits.length === 2;
        if (hasCredits) {
            var frag = document.createElement('a');
            frag.className = 'filepond--credits';
            frag.href = credits[0];
            frag.tabIndex = -1;
            frag.target = '_blank';
            frag.rel = 'noopener noreferrer';
            frag.textContent = credits[1];
            root.element.appendChild(frag);
            root.ref.credits = frag;
        }
    };

    var write$9 = function write(_ref3) {
        var root = _ref3.root,
            props = _ref3.props,
            actions = _ref3.actions;
        // route actions
        route$5({ root: root, props: props, actions: actions });

        // apply style properties
        actions
            .filter(function(action) {
                return /^DID_SET_STYLE_/.test(action.type);
            })
            .filter(function(action) {
                return !isEmpty(action.data.value);
            })
            .map(function(_ref4) {
                var type = _ref4.type,
                    data = _ref4.data;
                var name = toCamels(type.substring(8).toLowerCase(), '_');
                root.element.dataset[name] = data.value;
                root.invalidateLayout();
            });

        if (root.rect.element.hidden) return;

        if (root.rect.element.width !== root.ref.widthPrevious) {
            root.ref.widthPrevious = root.rect.element.width;
            root.ref.widthUpdated();
        }

        // get box bounds, we do this only once
        var bounds = root.ref.bounds;
        if (!bounds) {
            bounds = root.ref.bounds = calculateRootBoundingBoxHeight(root);

            // destroy measure element
            root.element.removeChild(root.ref.measure);
            root.ref.measure = null;
        }

        // get quick references to various high level parts of the upload tool
        var _root$ref = root.ref,
            hopper = _root$ref.hopper,
            label = _root$ref.label,
            list = _root$ref.list,
            panel = _root$ref.panel;

        // sets correct state to hopper scope
        if (hopper) {
            hopper.updateHopperState();
        }

        // bool to indicate if we're full or not
        var aspectRatio = root.query('GET_PANEL_ASPECT_RATIO');
        var isMultiItem = root.query('GET_ALLOW_MULTIPLE');
        var totalItems = root.query('GET_TOTAL_ITEMS');
        var maxItems = isMultiItem ? root.query('GET_MAX_FILES') || MAX_FILES_LIMIT : 1;
        var atMaxCapacity = totalItems === maxItems;

        // action used to add item
        var addAction = actions.find(function(action) {
            return action.type === 'DID_ADD_ITEM';
        });

        // if reached max capacity and we've just reached it
        if (atMaxCapacity && addAction) {
            // get interaction type
            var interactionMethod = addAction.data.interactionMethod;

            // hide label
            label.opacity = 0;

            if (isMultiItem) {
                label.translateY = -40;
            } else {
                if (interactionMethod === InteractionMethod.API) {
                    label.translateX = 40;
                } else if (interactionMethod === InteractionMethod.BROWSE) {
                    label.translateY = 40;
                } else {
                    label.translateY = 30;
                }
            }
        } else if (!atMaxCapacity) {
            label.opacity = 1;
            label.translateX = 0;
            label.translateY = 0;
        }

        var listItemMargin = calculateListItemMargin(root);

        var listHeight = calculateListHeight(root);

        var labelHeight = label.rect.element.height;
        var currentLabelHeight = !isMultiItem || atMaxCapacity ? 0 : labelHeight;

        var listMarginTop = atMaxCapacity ? list.rect.element.marginTop : 0;
        var listMarginBottom = totalItems === 0 ? 0 : list.rect.element.marginBottom;

        var visualHeight =
            currentLabelHeight + listMarginTop + listHeight.visual + listMarginBottom;
        var boundsHeight =
            currentLabelHeight + listMarginTop + listHeight.bounds + listMarginBottom;

        // link list to label bottom position
        list.translateY =
            Math.max(0, currentLabelHeight - list.rect.element.marginTop) - listItemMargin.top;

        if (aspectRatio) {
            // fixed aspect ratio

            // calculate height based on width
            var width = root.rect.element.width;
            var height = width * aspectRatio;

            // clear history if aspect ratio has changed
            if (aspectRatio !== root.ref.previousAspectRatio) {
                root.ref.previousAspectRatio = aspectRatio;
                root.ref.updateHistory = [];
            }

            // remember this width
            var history = root.ref.updateHistory;
            history.push(width);

            var MAX_BOUNCES = 2;
            if (history.length > MAX_BOUNCES * 2) {
                var l = history.length;
                var bottom = l - 10;
                var bounces = 0;
                for (var i = l; i >= bottom; i--) {
                    if (history[i] === history[i - 2]) {
                        bounces++;
                    }

                    if (bounces >= MAX_BOUNCES) {
                        // dont adjust height
                        return;
                    }
                }
            }

            // fix height of panel so it adheres to aspect ratio
            panel.scalable = false;
            panel.height = height;

            // available height for list
            var listAvailableHeight =
                // the height of the panel minus the label height
                height -
                currentLabelHeight -
                // the room we leave open between the end of the list and the panel bottom
                (listMarginBottom - listItemMargin.bottom) -
                // if we're full we need to leave some room between the top of the panel and the list
                (atMaxCapacity ? listMarginTop : 0);

            if (listHeight.visual > listAvailableHeight) {
                list.overflow = listAvailableHeight;
            } else {
                list.overflow = null;
            }

            // set container bounds (so pushes siblings downwards)
            root.height = height;
        } else if (bounds.fixedHeight) {
            // fixed height

            // fix height of panel
            panel.scalable = false;

            // available height for list
            var _listAvailableHeight =
                // the height of the panel minus the label height
                bounds.fixedHeight -
                currentLabelHeight -
                // the room we leave open between the end of the list and the panel bottom
                (listMarginBottom - listItemMargin.bottom) -
                // if we're full we need to leave some room between the top of the panel and the list
                (atMaxCapacity ? listMarginTop : 0);

            // set list height
            if (listHeight.visual > _listAvailableHeight) {
                list.overflow = _listAvailableHeight;
            } else {
                list.overflow = null;
            }

            // no need to set container bounds as these are handles by CSS fixed height
        } else if (bounds.cappedHeight) {
            // max-height

            // not a fixed height panel
            var isCappedHeight = visualHeight >= bounds.cappedHeight;
            var panelHeight = Math.min(bounds.cappedHeight, visualHeight);
            panel.scalable = true;
            panel.height = isCappedHeight
                ? panelHeight
                : panelHeight - listItemMargin.top - listItemMargin.bottom;

            // available height for list
            var _listAvailableHeight2 =
                // the height of the panel minus the label height
                panelHeight -
                currentLabelHeight -
                // the room we leave open between the end of the list and the panel bottom
                (listMarginBottom - listItemMargin.bottom) -
                // if we're full we need to leave some room between the top of the panel and the list
                (atMaxCapacity ? listMarginTop : 0);

            // set list height (if is overflowing)
            if (visualHeight > bounds.cappedHeight && listHeight.visual > _listAvailableHeight2) {
                list.overflow = _listAvailableHeight2;
            } else {
                list.overflow = null;
            }

            // set container bounds (so pushes siblings downwards)
            root.height = Math.min(
                bounds.cappedHeight,
                boundsHeight - listItemMargin.top - listItemMargin.bottom
            );
        } else {
            // flexible height

            // not a fixed height panel
            var itemMargin = totalItems > 0 ? listItemMargin.top + listItemMargin.bottom : 0;
            panel.scalable = true;
            panel.height = Math.max(labelHeight, visualHeight - itemMargin);

            // set container bounds (so pushes siblings downwards)
            root.height = Math.max(labelHeight, boundsHeight - itemMargin);
        }

        // move credits to bottom
        if (root.ref.credits && panel.heightCurrent)
            root.ref.credits.style.transform = 'translateY(' + panel.heightCurrent + 'px)';
    };

    var calculateListItemMargin = function calculateListItemMargin(root) {
        var item = root.ref.list.childViews[0].childViews[0];
        return item
            ? {
                  top: item.rect.element.marginTop,
                  bottom: item.rect.element.marginBottom,
              }
            : {
                  top: 0,
                  bottom: 0,
              };
    };

    var calculateListHeight = function calculateListHeight(root) {
        var visual = 0;
        var bounds = 0;

        // get file list reference
        var scrollList = root.ref.list;
        var itemList = scrollList.childViews[0];
        var visibleChildren = itemList.childViews.filter(function(child) {
            return child.rect.element.height;
        });
        var children = root
            .query('GET_ACTIVE_ITEMS')
            .map(function(item) {
                return visibleChildren.find(function(child) {
                    return child.id === item.id;
                });
            })
            .filter(function(item) {
                return item;
            });

        // no children, done!
        if (children.length === 0) return { visual: visual, bounds: bounds };

        var horizontalSpace = itemList.rect.element.width;
        var dragIndex = getItemIndexByPosition(itemList, children, scrollList.dragCoordinates);

        var childRect = children[0].rect.element;

        var itemVerticalMargin = childRect.marginTop + childRect.marginBottom;
        var itemHorizontalMargin = childRect.marginLeft + childRect.marginRight;

        var itemWidth = childRect.width + itemHorizontalMargin;
        var itemHeight = childRect.height + itemVerticalMargin;

        var newItem = typeof dragIndex !== 'undefined' && dragIndex >= 0 ? 1 : 0;
        var removedItem = children.find(function(child) {
            return child.markedForRemoval && child.opacity < 0.45;
        })
            ? -1
            : 0;
        var verticalItemCount = children.length + newItem + removedItem;
        var itemsPerRow = getItemsPerRow(horizontalSpace, itemWidth);

        // stack
        if (itemsPerRow === 1) {
            children.forEach(function(item) {
                var height = item.rect.element.height + itemVerticalMargin;
                bounds += height;
                visual += height * item.opacity;
            });
        }
        // grid
        else {
            bounds = Math.ceil(verticalItemCount / itemsPerRow) * itemHeight;
            visual = bounds;
        }

        return { visual: visual, bounds: bounds };
    };

    var calculateRootBoundingBoxHeight = function calculateRootBoundingBoxHeight(root) {
        var height = root.ref.measureHeight || null;
        var cappedHeight = parseInt(root.style.maxHeight, 10) || null;
        var fixedHeight = height === 0 ? null : height;

        return {
            cappedHeight: cappedHeight,
            fixedHeight: fixedHeight,
        };
    };

    var exceedsMaxFiles = function exceedsMaxFiles(root, items) {
        var allowReplace = root.query('GET_ALLOW_REPLACE');
        var allowMultiple = root.query('GET_ALLOW_MULTIPLE');
        var totalItems = root.query('GET_TOTAL_ITEMS');
        var maxItems = root.query('GET_MAX_FILES');

        // total amount of items being dragged
        var totalBrowseItems = items.length;

        // if does not allow multiple items and dragging more than one item
        if (!allowMultiple && totalBrowseItems > 1) {
            root.dispatch('DID_THROW_MAX_FILES', {
                source: items,
                error: createResponse('warning', 0, 'Max files'),
            });

            return true;
        }

        // limit max items to one if not allowed to drop multiple items
        maxItems = allowMultiple ? maxItems : 1;

        if (!allowMultiple && allowReplace) {
            // There is only one item, so there is room to replace or add an item
            return false;
        }

        // no more room?
        var hasMaxItems = isInt(maxItems);
        if (hasMaxItems && totalItems + totalBrowseItems > maxItems) {
            root.dispatch('DID_THROW_MAX_FILES', {
                source: items,
                error: createResponse('warning', 0, 'Max files'),
            });

            return true;
        }

        return false;
    };

    var getDragIndex = function getDragIndex(list, children, position) {
        var itemList = list.childViews[0];
        return getItemIndexByPosition(itemList, children, {
            left: position.scopeLeft - itemList.rect.element.left,
            top:
                position.scopeTop -
                (list.rect.outer.top + list.rect.element.marginTop + list.rect.element.scrollTop),
        });
    };

    /**
     * Enable or disable file drop functionality
     */
    var toggleDrop = function toggleDrop(root) {
        var isAllowed = root.query('GET_ALLOW_DROP');
        var isDisabled = root.query('GET_DISABLED');
        var enabled = isAllowed && !isDisabled;
        if (enabled && !root.ref.hopper) {
            var hopper = createHopper(
                root.element,
                function(items) {
                    // allow quick validation of dropped items
                    var beforeDropFile =
                        root.query('GET_BEFORE_DROP_FILE') ||
                        function() {
                            return true;
                        };

                    // all items should be validated by all filters as valid
                    var dropValidation = root.query('GET_DROP_VALIDATION');
                    return dropValidation
                        ? items.every(function(item) {
                              return (
                                  applyFilters('ALLOW_HOPPER_ITEM', item, {
                                      query: root.query,
                                  }).every(function(result) {
                                      return result === true;
                                  }) && beforeDropFile(item)
                              );
                          })
                        : true;
                },
                {
                    filterItems: function filterItems(items) {
                        var ignoredFiles = root.query('GET_IGNORED_FILES');
                        return items.filter(function(item) {
                            if (isFile(item)) {
                                return !ignoredFiles.includes(item.name.toLowerCase());
                            }
                            return true;
                        });
                    },
                    catchesDropsOnPage: root.query('GET_DROP_ON_PAGE'),
                    requiresDropOnElement: root.query('GET_DROP_ON_ELEMENT'),
                }
            );

            hopper.onload = function(items, position) {
                // get item children elements and sort based on list sort
                var list = root.ref.list.childViews[0];
                var visibleChildren = list.childViews.filter(function(child) {
                    return child.rect.element.height;
                });
                var children = root
                    .query('GET_ACTIVE_ITEMS')
                    .map(function(item) {
                        return visibleChildren.find(function(child) {
                            return child.id === item.id;
                        });
                    })
                    .filter(function(item) {
                        return item;
                    });

                applyFilterChain('ADD_ITEMS', items, { dispatch: root.dispatch }).then(function(
                    queue
                ) {
                    // these files don't fit so stop here
                    if (exceedsMaxFiles(root, queue)) return false;

                    // go
                    root.dispatch('ADD_ITEMS', {
                        items: queue,
                        index: getDragIndex(root.ref.list, children, position),
                        interactionMethod: InteractionMethod.DROP,
                    });
                });

                root.dispatch('DID_DROP', { position: position });

                root.dispatch('DID_END_DRAG', { position: position });
            };

            hopper.ondragstart = function(position) {
                root.dispatch('DID_START_DRAG', { position: position });
            };

            hopper.ondrag = debounce(function(position) {
                root.dispatch('DID_DRAG', { position: position });
            });

            hopper.ondragend = function(position) {
                root.dispatch('DID_END_DRAG', { position: position });
            };

            root.ref.hopper = hopper;

            root.ref.drip = root.appendChildView(root.createChildView(drip));
        } else if (!enabled && root.ref.hopper) {
            root.ref.hopper.destroy();
            root.ref.hopper = null;
            root.removeChildView(root.ref.drip);
        }
    };

    /**
     * Enable or disable browse functionality
     */
    var toggleBrowse = function toggleBrowse(root, props) {
        var isAllowed = root.query('GET_ALLOW_BROWSE');
        var isDisabled = root.query('GET_DISABLED');
        var enabled = isAllowed && !isDisabled;
        if (enabled && !root.ref.browser) {
            root.ref.browser = root.appendChildView(
                root.createChildView(
                    browser,
                    Object.assign({}, props, {
                        onload: function onload(items) {
                            applyFilterChain('ADD_ITEMS', items, {
                                dispatch: root.dispatch,
                            }).then(function(queue) {
                                // these files don't fit so stop here
                                if (exceedsMaxFiles(root, queue)) return false;

                                // add items!
                                root.dispatch('ADD_ITEMS', {
                                    items: queue,
                                    index: -1,
                                    interactionMethod: InteractionMethod.BROWSE,
                                });
                            });
                        },
                    })
                ),

                0
            );
        } else if (!enabled && root.ref.browser) {
            root.removeChildView(root.ref.browser);
            root.ref.browser = null;
        }
    };

    /**
     * Enable or disable paste functionality
     */
    var togglePaste = function togglePaste(root) {
        var isAllowed = root.query('GET_ALLOW_PASTE');
        var isDisabled = root.query('GET_DISABLED');
        var enabled = isAllowed && !isDisabled;
        if (enabled && !root.ref.paster) {
            root.ref.paster = createPaster();
            root.ref.paster.onload = function(items) {
                applyFilterChain('ADD_ITEMS', items, { dispatch: root.dispatch }).then(function(
                    queue
                ) {
                    // these files don't fit so stop here
                    if (exceedsMaxFiles(root, queue)) return false;

                    // add items!
                    root.dispatch('ADD_ITEMS', {
                        items: queue,
                        index: -1,
                        interactionMethod: InteractionMethod.PASTE,
                    });
                });
            };
        } else if (!enabled && root.ref.paster) {
            root.ref.paster.destroy();
            root.ref.paster = null;
        }
    };

    /**
     * Route actions
     */
    var route$5 = createRoute({
        DID_SET_ALLOW_BROWSE: function DID_SET_ALLOW_BROWSE(_ref5) {
            var root = _ref5.root,
                props = _ref5.props;
            toggleBrowse(root, props);
        },
        DID_SET_ALLOW_DROP: function DID_SET_ALLOW_DROP(_ref6) {
            var root = _ref6.root;
            toggleDrop(root);
        },
        DID_SET_ALLOW_PASTE: function DID_SET_ALLOW_PASTE(_ref7) {
            var root = _ref7.root;
            togglePaste(root);
        },
        DID_SET_DISABLED: function DID_SET_DISABLED(_ref8) {
            var root = _ref8.root,
                props = _ref8.props;
            toggleDrop(root);
            togglePaste(root);
            toggleBrowse(root, props);
            var isDisabled = root.query('GET_DISABLED');
            if (isDisabled) {
                root.element.dataset.disabled = 'disabled';
            } else {
                // delete root.element.dataset.disabled; <= this does not work on iOS 10
                root.element.removeAttribute('data-disabled');
            }
        },
    });

    var root = createView({
        name: 'root',
        read: function read(_ref9) {
            var root = _ref9.root;
            if (root.ref.measure) {
                root.ref.measureHeight = root.ref.measure.offsetHeight;
            }
        },
        create: create$e,
        write: write$9,
        destroy: function destroy(_ref10) {
            var root = _ref10.root;
            if (root.ref.paster) {
                root.ref.paster.destroy();
            }
            if (root.ref.hopper) {
                root.ref.hopper.destroy();
            }
            root.element.removeEventListener('touchmove', prevent);
            root.element.removeEventListener('gesturestart', prevent);
        },
        mixins: {
            styles: ['height'],
        },
    });

    // creates the app
    var createApp = function createApp() {
        var initialOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        // let element
        var originalElement = null;

        // get default options
        var defaultOptions = getOptions();

        // create the data store, this will contain all our app info
        var store = createStore(
            // initial state (should be serializable)
            createInitialState(defaultOptions),

            // queries
            [queries, createOptionQueries(defaultOptions)],

            // action handlers
            [actions, createOptionActions(defaultOptions)]
        );

        // set initial options
        store.dispatch('SET_OPTIONS', { options: initialOptions });

        // kick thread if visibility changes
        var visibilityHandler = function visibilityHandler() {
            if (document.hidden) return;
            store.dispatch('KICK');
        };
        document.addEventListener('visibilitychange', visibilityHandler);

        // re-render on window resize start and finish
        var resizeDoneTimer = null;
        var isResizing = false;
        var isResizingHorizontally = false;
        var initialWindowWidth = null;
        var currentWindowWidth = null;
        var resizeHandler = function resizeHandler() {
            if (!isResizing) {
                isResizing = true;
            }
            clearTimeout(resizeDoneTimer);
            resizeDoneTimer = setTimeout(function() {
                isResizing = false;
                initialWindowWidth = null;
                currentWindowWidth = null;
                if (isResizingHorizontally) {
                    isResizingHorizontally = false;
                    store.dispatch('DID_STOP_RESIZE');
                }
            }, 500);
        };
        window.addEventListener('resize', resizeHandler);

        // render initial view
        var view = root(store, { id: getUniqueId() });

        //
        // PRIVATE API -------------------------------------------------------------------------------------
        //
        var isResting = false;
        var isHidden = false;

        var readWriteApi = {
            // necessary for update loop

            /**
             * Reads from dom (never call manually)
             * @private
             */
            _read: function _read() {
                // test if we're resizing horizontally
                // TODO: see if we can optimize this by measuring root rect
                if (isResizing) {
                    currentWindowWidth = window.innerWidth;
                    if (!initialWindowWidth) {
                        initialWindowWidth = currentWindowWidth;
                    }

                    if (!isResizingHorizontally && currentWindowWidth !== initialWindowWidth) {
                        store.dispatch('DID_START_RESIZE');
                        isResizingHorizontally = true;
                    }
                }

                if (isHidden && isResting) {
                    // test if is no longer hidden
                    isResting = view.element.offsetParent === null;
                }

                // if resting, no need to read as numbers will still all be correct
                if (isResting) return;

                // read view data
                view._read();

                // if is hidden we need to know so we exit rest mode when revealed
                isHidden = view.rect.element.hidden;
            },

            /**
             * Writes to dom (never call manually)
             * @private
             */
            _write: function _write(ts) {
                // get all actions from store
                var actions = store
                    .processActionQueue()

                    // filter out set actions (these will automatically trigger DID_SET)
                    .filter(function(action) {
                        return !/^SET_/.test(action.type);
                    });

                // if was idling and no actions stop here
                if (isResting && !actions.length) return;

                // some actions might trigger events
                routeActionsToEvents(actions);

                // update the view
                isResting = view._write(ts, actions, isResizingHorizontally);

                // will clean up all archived items
                removeReleasedItems(store.query('GET_ITEMS'));

                // now idling
                if (isResting) {
                    store.processDispatchQueue();
                }
            },
        };

        //
        // EXPOSE EVENTS -------------------------------------------------------------------------------------
        //
        var createEvent = function createEvent(name) {
            return function(data) {
                // create default event
                var event = {
                    type: name,
                };

                // no data to add
                if (!data) {
                    return event;
                }

                // copy relevant props
                if (data.hasOwnProperty('error')) {
                    event.error = data.error ? Object.assign({}, data.error) : null;
                }

                if (data.status) {
                    event.status = Object.assign({}, data.status);
                }

                if (data.file) {
                    event.output = data.file;
                }

                // only source is available, else add item if possible
                if (data.source) {
                    event.file = data.source;
                } else if (data.item || data.id) {
                    var item = data.item ? data.item : store.query('GET_ITEM', data.id);
                    event.file = item ? createItemAPI(item) : null;
                }

                // map all items in a possible items array
                if (data.items) {
                    event.items = data.items.map(createItemAPI);
                }

                // if this is a progress event add the progress amount
                if (/progress/.test(name)) {
                    event.progress = data.progress;
                }

                // copy relevant props
                if (data.hasOwnProperty('origin') && data.hasOwnProperty('target')) {
                    event.origin = data.origin;
                    event.target = data.target;
                }

                return event;
            };
        };

        var eventRoutes = {
            DID_DESTROY: createEvent('destroy'),

            DID_INIT: createEvent('init'),

            DID_THROW_MAX_FILES: createEvent('warning'),

            DID_INIT_ITEM: createEvent('initfile'),
            DID_START_ITEM_LOAD: createEvent('addfilestart'),
            DID_UPDATE_ITEM_LOAD_PROGRESS: createEvent('addfileprogress'),
            DID_LOAD_ITEM: createEvent('addfile'),

            DID_THROW_ITEM_INVALID: [createEvent('error'), createEvent('addfile')],

            DID_THROW_ITEM_LOAD_ERROR: [createEvent('error'), createEvent('addfile')],

            DID_THROW_ITEM_REMOVE_ERROR: [createEvent('error'), createEvent('removefile')],

            DID_PREPARE_OUTPUT: createEvent('preparefile'),

            DID_START_ITEM_PROCESSING: createEvent('processfilestart'),
            DID_UPDATE_ITEM_PROCESS_PROGRESS: createEvent('processfileprogress'),
            DID_ABORT_ITEM_PROCESSING: createEvent('processfileabort'),
            DID_COMPLETE_ITEM_PROCESSING: createEvent('processfile'),
            DID_COMPLETE_ITEM_PROCESSING_ALL: createEvent('processfiles'),
            DID_REVERT_ITEM_PROCESSING: createEvent('processfilerevert'),

            DID_THROW_ITEM_PROCESSING_ERROR: [createEvent('error'), createEvent('processfile')],

            DID_REMOVE_ITEM: createEvent('removefile'),

            DID_UPDATE_ITEMS: createEvent('updatefiles'),

            DID_ACTIVATE_ITEM: createEvent('activatefile'),

            DID_REORDER_ITEMS: createEvent('reorderfiles'),
        };

        var exposeEvent = function exposeEvent(event) {
            // create event object to be dispatched
            var detail = Object.assign({ pond: exports }, event);
            delete detail.type;
            view.element.dispatchEvent(
                new CustomEvent('FilePond:' + event.type, {
                    // event info
                    detail: detail,

                    // event behaviour
                    bubbles: true,
                    cancelable: true,
                    composed: true, // triggers listeners outside of shadow root
                })
            );

            // event object to params used for `on()` event handlers and callbacks `oninit()`
            var params = [];

            // if is possible error event, make it the first param
            if (event.hasOwnProperty('error')) {
                params.push(event.error);
            }

            // file is always section
            if (event.hasOwnProperty('file')) {
                params.push(event.file);
            }

            // append other props
            var filtered = ['type', 'error', 'file'];
            Object.keys(event)
                .filter(function(key) {
                    return !filtered.includes(key);
                })
                .forEach(function(key) {
                    return params.push(event[key]);
                });

            // on(type, () => { })
            exports.fire.apply(exports, [event.type].concat(params));

            // oninit = () => {}
            var handler = store.query('GET_ON' + event.type.toUpperCase());
            if (handler) {
                handler.apply(void 0, params);
            }
        };

        var routeActionsToEvents = function routeActionsToEvents(actions) {
            if (!actions.length) return;
            actions
                .filter(function(action) {
                    return eventRoutes[action.type];
                })
                .forEach(function(action) {
                    var routes = eventRoutes[action.type];
                    (Array.isArray(routes) ? routes : [routes]).forEach(function(route) {
                        // this isn't fantastic, but because of the stacking of settimeouts plugins can handle the did_load before the did_init
                        if (action.type === 'DID_INIT_ITEM') {
                            exposeEvent(route(action.data));
                        } else {
                            setTimeout(function() {
                                exposeEvent(route(action.data));
                            }, 0);
                        }
                    });
                });
        };

        //
        // PUBLIC API -------------------------------------------------------------------------------------
        //
        var setOptions = function setOptions(options) {
            return store.dispatch('SET_OPTIONS', { options: options });
        };

        var getFile = function getFile(query) {
            return store.query('GET_ACTIVE_ITEM', query);
        };

        var prepareFile = function prepareFile(query) {
            return new Promise(function(resolve, reject) {
                store.dispatch('REQUEST_ITEM_PREPARE', {
                    query: query,
                    success: function success(item) {
                        resolve(item);
                    },
                    failure: function failure(error) {
                        reject(error);
                    },
                });
            });
        };

        var addFile = function addFile(source) {
            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            return new Promise(function(resolve, reject) {
                addFiles([{ source: source, options: options }], { index: options.index })
                    .then(function(items) {
                        return resolve(items && items[0]);
                    })
                    .catch(reject);
            });
        };

        var isFilePondFile = function isFilePondFile(obj) {
            return obj.file && obj.id;
        };

        var removeFile = function removeFile(query, options) {
            // if only passed options
            if (typeof query === 'object' && !isFilePondFile(query) && !options) {
                options = query;
                query = undefined;
            }

            // request item removal
            store.dispatch('REMOVE_ITEM', Object.assign({}, options, { query: query }));

            // see if item has been removed
            return store.query('GET_ACTIVE_ITEM', query) === null;
        };

        var addFiles = function addFiles() {
            for (
                var _len = arguments.length, args = new Array(_len), _key = 0;
                _key < _len;
                _key++
            ) {
                args[_key] = arguments[_key];
            }
            return new Promise(function(resolve, reject) {
                var sources = [];
                var options = {};

                // user passed a sources array
                if (isArray(args[0])) {
                    sources.push.apply(sources, args[0]);
                    Object.assign(options, args[1] || {});
                } else {
                    // user passed sources as arguments, last one might be options object
                    var lastArgument = args[args.length - 1];
                    if (typeof lastArgument === 'object' && !(lastArgument instanceof Blob)) {
                        Object.assign(options, args.pop());
                    }

                    // add rest to sources
                    sources.push.apply(sources, args);
                }

                store.dispatch('ADD_ITEMS', {
                    items: sources,
                    index: options.index,
                    interactionMethod: InteractionMethod.API,
                    success: resolve,
                    failure: reject,
                });
            });
        };

        var getFiles = function getFiles() {
            return store.query('GET_ACTIVE_ITEMS');
        };

        var processFile = function processFile(query) {
            return new Promise(function(resolve, reject) {
                store.dispatch('REQUEST_ITEM_PROCESSING', {
                    query: query,
                    success: function success(item) {
                        resolve(item);
                    },
                    failure: function failure(error) {
                        reject(error);
                    },
                });
            });
        };

        var prepareFiles = function prepareFiles() {
            for (
                var _len2 = arguments.length, args = new Array(_len2), _key2 = 0;
                _key2 < _len2;
                _key2++
            ) {
                args[_key2] = arguments[_key2];
            }
            var queries = Array.isArray(args[0]) ? args[0] : args;
            var items = queries.length ? queries : getFiles();
            return Promise.all(items.map(prepareFile));
        };

        var processFiles = function processFiles() {
            for (
                var _len3 = arguments.length, args = new Array(_len3), _key3 = 0;
                _key3 < _len3;
                _key3++
            ) {
                args[_key3] = arguments[_key3];
            }
            var queries = Array.isArray(args[0]) ? args[0] : args;
            if (!queries.length) {
                var files = getFiles().filter(function(item) {
                    return (
                        !(item.status === ItemStatus.IDLE && item.origin === FileOrigin.LOCAL) &&
                        item.status !== ItemStatus.PROCESSING &&
                        item.status !== ItemStatus.PROCESSING_COMPLETE &&
                        item.status !== ItemStatus.PROCESSING_REVERT_ERROR
                    );
                });

                return Promise.all(files.map(processFile));
            }
            return Promise.all(queries.map(processFile));
        };

        var removeFiles = function removeFiles() {
            for (
                var _len4 = arguments.length, args = new Array(_len4), _key4 = 0;
                _key4 < _len4;
                _key4++
            ) {
                args[_key4] = arguments[_key4];
            }

            var queries = Array.isArray(args[0]) ? args[0] : args;

            var options;
            if (typeof queries[queries.length - 1] === 'object') {
                options = queries.pop();
            } else if (Array.isArray(args[0])) {
                options = args[1];
            }

            var files = getFiles();

            if (!queries.length)
                return Promise.all(
                    files.map(function(file) {
                        return removeFile(file, options);
                    })
                );

            // when removing by index the indexes shift after each file removal so we need to convert indexes to ids
            var mappedQueries = queries
                .map(function(query) {
                    return isNumber(query) ? (files[query] ? files[query].id : null) : query;
                })
                .filter(function(query) {
                    return query;
                });

            return mappedQueries.map(function(q) {
                return removeFile(q, options);
            });
        };

        var exports = Object.assign(
            {},

            on(),
            {},

            readWriteApi,
            {},

            createOptionAPI(store, defaultOptions),
            {
                /**
                 * Override options defined in options object
                 * @param options
                 */
                setOptions: setOptions,

                /**
                 * Load the given file
                 * @param source - the source of the file (either a File, base64 data uri or url)
                 * @param options - object, { index: 0 }
                 */
                addFile: addFile,

                /**
                 * Load the given files
                 * @param sources - the sources of the files to load
                 * @param options - object, { index: 0 }
                 */
                addFiles: addFiles,

                /**
                 * Returns the file objects matching the given query
                 * @param query { string, number, null }
                 */
                getFile: getFile,

                /**
                 * Upload file with given name
                 * @param query { string, number, null  }
                 */
                processFile: processFile,

                /**
                 * Request prepare output for file with given name
                 * @param query { string, number, null  }
                 */
                prepareFile: prepareFile,

                /**
                 * Removes a file by its name
                 * @param query { string, number, null  }
                 */
                removeFile: removeFile,

                /**
                 * Moves a file to a new location in the files list
                 */
                moveFile: function moveFile(query, index) {
                    return store.dispatch('MOVE_ITEM', { query: query, index: index });
                },

                /**
                 * Returns all files (wrapped in public api)
                 */
                getFiles: getFiles,

                /**
                 * Starts uploading all files
                 */
                processFiles: processFiles,

                /**
                 * Clears all files from the files list
                 */
                removeFiles: removeFiles,

                /**
                 * Starts preparing output of all files
                 */
                prepareFiles: prepareFiles,

                /**
                 * Sort list of files
                 */
                sort: function sort(compare) {
                    return store.dispatch('SORT', { compare: compare });
                },

                /**
                 * Browse the file system for a file
                 */
                browse: function browse() {
                    // needs to be trigger directly as user action needs to be traceable (is not traceable in requestAnimationFrame)
                    var input = view.element.querySelector('input[type=file]');
                    if (input) {
                        input.click();
                    }
                },

                /**
                 * Destroys the app
                 */
                destroy: function destroy() {
                    // request destruction
                    exports.fire('destroy', view.element);

                    // stop active processes (file uploads, fetches, stuff like that)
                    // loop over items and depending on states call abort for ongoing processes
                    store.dispatch('ABORT_ALL');

                    // destroy view
                    view._destroy();

                    // stop listening to resize
                    window.removeEventListener('resize', resizeHandler);

                    // stop listening to the visiblitychange event
                    document.removeEventListener('visibilitychange', visibilityHandler);

                    // dispatch destroy
                    store.dispatch('DID_DESTROY');
                },

                /**
                 * Inserts the plugin before the target element
                 */
                insertBefore: function insertBefore$1(element) {
                    return insertBefore(view.element, element);
                },

                /**
                 * Inserts the plugin after the target element
                 */
                insertAfter: function insertAfter$1(element) {
                    return insertAfter(view.element, element);
                },

                /**
                 * Appends the plugin to the target element
                 */
                appendTo: function appendTo(element) {
                    return element.appendChild(view.element);
                },

                /**
                 * Replaces an element with the app
                 */
                replaceElement: function replaceElement(element) {
                    // insert the app before the element
                    insertBefore(view.element, element);

                    // remove the original element
                    element.parentNode.removeChild(element);

                    // remember original element
                    originalElement = element;
                },

                /**
                 * Restores the original element
                 */
                restoreElement: function restoreElement() {
                    if (!originalElement) {
                        return; // no element to restore
                    }

                    // restore original element
                    insertAfter(originalElement, view.element);

                    // remove our element
                    view.element.parentNode.removeChild(view.element);

                    // remove reference
                    originalElement = null;
                },

                /**
                 * Returns true if the app root is attached to given element
                 * @param element
                 */
                isAttachedTo: function isAttachedTo(element) {
                    return view.element === element || originalElement === element;
                },

                /**
                 * Returns the root element
                 */
                element: {
                    get: function get() {
                        return view.element;
                    },
                },

                /**
                 * Returns the current pond status
                 */
                status: {
                    get: function get() {
                        return store.query('GET_STATUS');
                    },
                },
            }
        );

        // Done!
        store.dispatch('DID_INIT');

        // create actual api object
        return createObject(exports);
    };

    var createAppObject = function createAppObject() {
        var customOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        // default options
        var defaultOptions = {};
        forin(getOptions(), function(key, value) {
            defaultOptions[key] = value[0];
        });

        // set app options
        var app = createApp(
            Object.assign(
                {},

                defaultOptions,
                {},

                customOptions
            )
        );

        // return the plugin instance
        return app;
    };

    var lowerCaseFirstLetter = function lowerCaseFirstLetter(string) {
        return string.charAt(0).toLowerCase() + string.slice(1);
    };

    var attributeNameToPropertyName = function attributeNameToPropertyName(attributeName) {
        return toCamels(attributeName.replace(/^data-/, ''));
    };

    var mapObject = function mapObject(object, propertyMap) {
        // remove unwanted
        forin(propertyMap, function(selector, mapping) {
            forin(object, function(property, value) {
                // create regexp shortcut
                var selectorRegExp = new RegExp(selector);

                // tests if
                var matches = selectorRegExp.test(property);

                // no match, skip
                if (!matches) {
                    return;
                }

                // if there's a mapping, the original property is always removed
                delete object[property];

                // should only remove, we done!
                if (mapping === false) {
                    return;
                }

                // move value to new property
                if (isString(mapping)) {
                    object[mapping] = value;
                    return;
                }

                // move to group
                var group = mapping.group;
                if (isObject(mapping) && !object[group]) {
                    object[group] = {};
                }

                object[group][lowerCaseFirstLetter(property.replace(selectorRegExp, ''))] = value;
            });

            // do submapping
            if (mapping.mapping) {
                mapObject(object[mapping.group], mapping.mapping);
            }
        });
    };

    var getAttributesAsObject = function getAttributesAsObject(node) {
        var attributeMapping =
            arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        // turn attributes into object
        var attributes = [];
        forin(node.attributes, function(index) {
            attributes.push(node.attributes[index]);
        });

        var output = attributes
            .filter(function(attribute) {
                return attribute.name;
            })
            .reduce(function(obj, attribute) {
                var value = attr(node, attribute.name);

                obj[attributeNameToPropertyName(attribute.name)] =
                    value === attribute.name ? true : value;
                return obj;
            }, {});

        // do mapping of object properties
        mapObject(output, attributeMapping);

        return output;
    };

    var createAppAtElement = function createAppAtElement(element) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        // how attributes of the input element are mapped to the options for the plugin
        var attributeMapping = {
            // translate to other name
            '^class$': 'className',
            '^multiple$': 'allowMultiple',
            '^capture$': 'captureMethod',
            '^webkitdirectory$': 'allowDirectoriesOnly',

            // group under single property
            '^server': {
                group: 'server',
                mapping: {
                    '^process': {
                        group: 'process',
                    },

                    '^revert': {
                        group: 'revert',
                    },

                    '^fetch': {
                        group: 'fetch',
                    },

                    '^restore': {
                        group: 'restore',
                    },

                    '^load': {
                        group: 'load',
                    },
                },
            },

            // don't include in object
            '^type$': false,
            '^files$': false,
        };

        // add additional option translators
        applyFilters('SET_ATTRIBUTE_TO_OPTION_MAP', attributeMapping);

        // create final options object by setting options object and then overriding options supplied on element
        var mergedOptions = Object.assign({}, options);

        var attributeOptions = getAttributesAsObject(
            element.nodeName === 'FIELDSET' ? element.querySelector('input[type=file]') : element,
            attributeMapping
        );

        // merge with options object
        Object.keys(attributeOptions).forEach(function(key) {
            if (isObject(attributeOptions[key])) {
                if (!isObject(mergedOptions[key])) {
                    mergedOptions[key] = {};
                }
                Object.assign(mergedOptions[key], attributeOptions[key]);
            } else {
                mergedOptions[key] = attributeOptions[key];
            }
        });

        // if parent is a fieldset, get files from parent by selecting all input fields that are not file upload fields
        // these will then be automatically set to the initial files
        mergedOptions.files = (options.files || []).concat(
            Array.from(element.querySelectorAll('input:not([type=file])')).map(function(input) {
                return {
                    source: input.value,
                    options: {
                        type: input.dataset.type,
                    },
                };
            })
        );

        // build plugin
        var app = createAppObject(mergedOptions);

        // add already selected files
        if (element.files) {
            Array.from(element.files).forEach(function(file) {
                app.addFile(file);
            });
        }

        // replace the target element
        app.replaceElement(element);

        // expose
        return app;
    };

    // if an element is passed, we create the instance at that element, if not, we just create an up object
    var createApp$1 = function createApp() {
        return isNode(arguments.length <= 0 ? undefined : arguments[0])
            ? createAppAtElement.apply(void 0, arguments)
            : createAppObject.apply(void 0, arguments);
    };

    var PRIVATE_METHODS = ['fire', '_read', '_write'];

    var createAppAPI = function createAppAPI(app) {
        var api = {};

        copyObjectPropertiesToObject(app, api, PRIVATE_METHODS);

        return api;
    };

    /**
     * Replaces placeholders in given string with replacements
     * @param string - "Foo {bar}""
     * @param replacements - { "bar": 10 }
     */
    var replaceInString = function replaceInString(string, replacements) {
        return string.replace(/(?:{([a-zA-Z]+)})/g, function(match, group) {
            return replacements[group];
        });
    };

    var createWorker = function createWorker(fn) {
        var workerBlob = new Blob(['(', fn.toString(), ')()'], {
            type: 'application/javascript',
        });

        var workerURL = URL.createObjectURL(workerBlob);
        var worker = new Worker(workerURL);

        return {
            transfer: function transfer(message, cb) {},
            post: function post(message, cb, transferList) {
                var id = getUniqueId();

                worker.onmessage = function(e) {
                    if (e.data.id === id) {
                        cb(e.data.message);
                    }
                };

                worker.postMessage(
                    {
                        id: id,
                        message: message,
                    },

                    transferList
                );
            },
            terminate: function terminate() {
                worker.terminate();
                URL.revokeObjectURL(workerURL);
            },
        };
    };

    var loadImage = function loadImage(url) {
        return new Promise(function(resolve, reject) {
            var img = new Image();
            img.onload = function() {
                resolve(img);
            };
            img.onerror = function(e) {
                reject(e);
            };
            img.src = url;
        });
    };

    var renameFile = function renameFile(file, name) {
        var renamedFile = file.slice(0, file.size, file.type);
        renamedFile.lastModifiedDate = file.lastModifiedDate;
        renamedFile.name = name;
        return renamedFile;
    };

    var copyFile = function copyFile(file) {
        return renameFile(file, file.name);
    };

    // already registered plugins (can't register twice)
    var registeredPlugins = [];

    // pass utils to plugin
    var createAppPlugin = function createAppPlugin(plugin) {
        // already registered
        if (registeredPlugins.includes(plugin)) {
            return;
        }

        // remember this plugin
        registeredPlugins.push(plugin);

        // setup!
        var pluginOutline = plugin({
            addFilter: addFilter,
            utils: {
                Type: Type,
                forin: forin,
                isString: isString,
                isFile: isFile,
                toNaturalFileSize: toNaturalFileSize,
                replaceInString: replaceInString,
                getExtensionFromFilename: getExtensionFromFilename,
                getFilenameWithoutExtension: getFilenameWithoutExtension,
                guesstimateMimeType: guesstimateMimeType,
                getFileFromBlob: getFileFromBlob,
                getFilenameFromURL: getFilenameFromURL,
                createRoute: createRoute,
                createWorker: createWorker,
                createView: createView,
                createItemAPI: createItemAPI,
                loadImage: loadImage,
                copyFile: copyFile,
                renameFile: renameFile,
                createBlob: createBlob,
                applyFilterChain: applyFilterChain,
                text: text,
                getNumericAspectRatioFromString: getNumericAspectRatioFromString,
            },

            views: {
                fileActionButton: fileActionButton,
            },
        });

        // add plugin options to default options
        extendDefaultOptions(pluginOutline.options);
    };

    // feature detection used by supported() method
    var isOperaMini = function isOperaMini() {
        return Object.prototype.toString.call(window.operamini) === '[object OperaMini]';
    };
    var hasPromises = function hasPromises() {
        return 'Promise' in window;
    };
    var hasBlobSlice = function hasBlobSlice() {
        return 'slice' in Blob.prototype;
    };
    var hasCreateObjectURL = function hasCreateObjectURL() {
        return 'URL' in window && 'createObjectURL' in window.URL;
    };
    var hasVisibility = function hasVisibility() {
        return 'visibilityState' in document;
    };
    var hasTiming = function hasTiming() {
        return 'performance' in window;
    }; // iOS 8.x
    var hasCSSSupports = function hasCSSSupports() {
        return 'supports' in (window.CSS || {});
    }; // use to detect Safari 9+
    var isIE11 = function isIE11() {
        return /MSIE|Trident/.test(window.navigator.userAgent);
    };

    var supported = (function() {
        // Runs immediately and then remembers result for subsequent calls
        var isSupported =
            // Has to be a browser
            isBrowser() &&
            // Can't run on Opera Mini due to lack of everything
            !isOperaMini() &&
            // Require these APIs to feature detect a modern browser
            hasVisibility() &&
            hasPromises() &&
            hasBlobSlice() &&
            hasCreateObjectURL() &&
            hasTiming() &&
            // doesn't need CSSSupports but is a good way to detect Safari 9+ (we do want to support IE11 though)
            (hasCSSSupports() || isIE11());

        return function() {
            return isSupported;
        };
    })();

    /**
     * Plugin internal state (over all instances)
     */
    var state = {
        // active app instances, used to redraw the apps and to find the later
        apps: [],
    };

    // plugin name
    var name = 'filepond';

    /**
     * Public Plugin methods
     */
    var fn = function fn() {};
    exports.Status = {};
    exports.FileStatus = {};
    exports.FileOrigin = {};
    exports.OptionTypes = {};
    exports.create = fn;
    exports.destroy = fn;
    exports.parse = fn;
    exports.find = fn;
    exports.registerPlugin = fn;
    exports.getOptions = fn;
    exports.setOptions = fn;

    // if not supported, no API
    if (supported()) {
        // start painter and fire load event
        createPainter(
            function() {
                state.apps.forEach(function(app) {
                    return app._read();
                });
            },
            function(ts) {
                state.apps.forEach(function(app) {
                    return app._write(ts);
                });
            }
        );

        // fire loaded event so we know when FilePond is available
        var dispatch = function dispatch() {
            // let others know we have area ready
            document.dispatchEvent(
                new CustomEvent('FilePond:loaded', {
                    detail: {
                        supported: supported,
                        create: exports.create,
                        destroy: exports.destroy,
                        parse: exports.parse,
                        find: exports.find,
                        registerPlugin: exports.registerPlugin,
                        setOptions: exports.setOptions,
                    },
                })
            );

            // clean up event
            document.removeEventListener('DOMContentLoaded', dispatch);
        };

        if (document.readyState !== 'loading') {
            // move to back of execution queue, FilePond should have been exported by then
            setTimeout(function() {
                return dispatch();
            }, 0);
        } else {
            document.addEventListener('DOMContentLoaded', dispatch);
        }

        // updates the OptionTypes object based on the current options
        var updateOptionTypes = function updateOptionTypes() {
            return forin(getOptions(), function(key, value) {
                exports.OptionTypes[key] = value[1];
            });
        };

        exports.Status = Object.assign({}, Status);
        exports.FileOrigin = Object.assign({}, FileOrigin);
        exports.FileStatus = Object.assign({}, ItemStatus);

        exports.OptionTypes = {};
        updateOptionTypes();

        // create method, creates apps and adds them to the app array
        exports.create = function create() {
            var app = createApp$1.apply(void 0, arguments);
            app.on('destroy', exports.destroy);
            state.apps.push(app);
            return createAppAPI(app);
        };

        // destroys apps and removes them from the app array
        exports.destroy = function destroy(hook) {
            // returns true if the app was destroyed successfully
            var indexToRemove = state.apps.findIndex(function(app) {
                return app.isAttachedTo(hook);
            });
            if (indexToRemove >= 0) {
                // remove from apps
                var app = state.apps.splice(indexToRemove, 1)[0];

                // restore original dom element
                app.restoreElement();

                return true;
            }

            return false;
        };

        // parses the given context for plugins (does not include the context element itself)
        exports.parse = function parse(context) {
            // get all possible hooks
            var matchedHooks = Array.from(context.querySelectorAll('.' + name));

            // filter out already active hooks
            var newHooks = matchedHooks.filter(function(newHook) {
                return !state.apps.find(function(app) {
                    return app.isAttachedTo(newHook);
                });
            });

            // create new instance for each hook
            return newHooks.map(function(hook) {
                return exports.create(hook);
            });
        };

        // returns an app based on the given element hook
        exports.find = function find(hook) {
            var app = state.apps.find(function(app) {
                return app.isAttachedTo(hook);
            });
            if (!app) {
                return null;
            }
            return createAppAPI(app);
        };

        // adds a plugin extension
        exports.registerPlugin = function registerPlugin() {
            for (
                var _len = arguments.length, plugins = new Array(_len), _key = 0;
                _key < _len;
                _key++
            ) {
                plugins[_key] = arguments[_key];
            }

            // register plugins
            plugins.forEach(createAppPlugin);

            // update OptionTypes, each plugin might have extended the default options
            updateOptionTypes();
        };

        exports.getOptions = function getOptions$1() {
            var opts = {};
            forin(getOptions(), function(key, value) {
                opts[key] = value[0];
            });
            return opts;
        };

        exports.setOptions = function setOptions$1(opts) {
            if (isObject(opts)) {
                // update existing plugins
                state.apps.forEach(function(app) {
                    app.setOptions(opts);
                });

                // override defaults
                setOptions(opts);
            }

            // return new options
            return exports.getOptions();
        };
    }

    exports.supported = supported;

    Object.defineProperty(exports, '__esModule', { value: true });
});


/***/ }),

/***/ "./resources/css/app.css":
/*!*******************************!*\
  !*** ./resources/css/app.css ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/process/browser.js":
/*!*****************************************!*\
  !*** ./node_modules/process/browser.js ***!
  \*****************************************/
/***/ ((module) => {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ "./node_modules/filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css":
/*!*******************************************************************************************!*\
  !*** ./node_modules/filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _css_loader_dist_cjs_js_ruleSet_1_rules_6_oneOf_1_use_1_postcss_loader_dist_cjs_js_ruleSet_1_rules_6_oneOf_1_use_2_filepond_plugin_image_preview_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../css-loader/dist/cjs.js??ruleSet[1].rules[6].oneOf[1].use[1]!../../postcss-loader/dist/cjs.js??ruleSet[1].rules[6].oneOf[1].use[2]!./filepond-plugin-image-preview.css */ "./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[6].oneOf[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[6].oneOf[1].use[2]!./node_modules/filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_css_loader_dist_cjs_js_ruleSet_1_rules_6_oneOf_1_use_1_postcss_loader_dist_cjs_js_ruleSet_1_rules_6_oneOf_1_use_2_filepond_plugin_image_preview_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_css_loader_dist_cjs_js_ruleSet_1_rules_6_oneOf_1_use_1_postcss_loader_dist_cjs_js_ruleSet_1_rules_6_oneOf_1_use_2_filepond_plugin_image_preview_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./node_modules/filepond/dist/filepond.min.css":
/*!*****************************************************!*\
  !*** ./node_modules/filepond/dist/filepond.min.css ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _css_loader_dist_cjs_js_ruleSet_1_rules_6_oneOf_1_use_1_postcss_loader_dist_cjs_js_ruleSet_1_rules_6_oneOf_1_use_2_filepond_min_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../css-loader/dist/cjs.js??ruleSet[1].rules[6].oneOf[1].use[1]!../../postcss-loader/dist/cjs.js??ruleSet[1].rules[6].oneOf[1].use[2]!./filepond.min.css */ "./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[6].oneOf[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[6].oneOf[1].use[2]!./node_modules/filepond/dist/filepond.min.css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_css_loader_dist_cjs_js_ruleSet_1_rules_6_oneOf_1_use_1_postcss_loader_dist_cjs_js_ruleSet_1_rules_6_oneOf_1_use_2_filepond_min_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_css_loader_dist_cjs_js_ruleSet_1_rules_6_oneOf_1_use_1_postcss_loader_dist_cjs_js_ruleSet_1_rules_6_oneOf_1_use_2_filepond_min_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var isOldIE = function isOldIE() {
  var memo;
  return function memorize() {
    if (typeof memo === 'undefined') {
      // Test for IE <= 9 as proposed by Browserhacks
      // @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
      // Tests for existence of standard globals is to allow style-loader
      // to operate correctly into non-standard environments
      // @see https://github.com/webpack-contrib/style-loader/issues/177
      memo = Boolean(window && document && document.all && !window.atob);
    }

    return memo;
  };
}();

var getTarget = function getTarget() {
  var memo = {};
  return function memorize(target) {
    if (typeof memo[target] === 'undefined') {
      var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

      if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
        try {
          // This will throw an exception if access to iframe is blocked
          // due to cross-origin restrictions
          styleTarget = styleTarget.contentDocument.head;
        } catch (e) {
          // istanbul ignore next
          styleTarget = null;
        }
      }

      memo[target] = styleTarget;
    }

    return memo[target];
  };
}();

var stylesInDom = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDom.length; i++) {
    if (stylesInDom[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var index = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3]
    };

    if (index !== -1) {
      stylesInDom[index].references++;
      stylesInDom[index].updater(obj);
    } else {
      stylesInDom.push({
        identifier: identifier,
        updater: addStyle(obj, options),
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function insertStyleElement(options) {
  var style = document.createElement('style');
  var attributes = options.attributes || {};

  if (typeof attributes.nonce === 'undefined') {
    var nonce =  true ? __webpack_require__.nc : 0;

    if (nonce) {
      attributes.nonce = nonce;
    }
  }

  Object.keys(attributes).forEach(function (key) {
    style.setAttribute(key, attributes[key]);
  });

  if (typeof options.insert === 'function') {
    options.insert(style);
  } else {
    var target = getTarget(options.insert || 'head');

    if (!target) {
      throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
    }

    target.appendChild(style);
  }

  return style;
}

function removeStyleElement(style) {
  // istanbul ignore if
  if (style.parentNode === null) {
    return false;
  }

  style.parentNode.removeChild(style);
}
/* istanbul ignore next  */


var replaceText = function replaceText() {
  var textStore = [];
  return function replace(index, replacement) {
    textStore[index] = replacement;
    return textStore.filter(Boolean).join('\n');
  };
}();

function applyToSingletonTag(style, index, remove, obj) {
  var css = remove ? '' : obj.media ? "@media ".concat(obj.media, " {").concat(obj.css, "}") : obj.css; // For old IE

  /* istanbul ignore if  */

  if (style.styleSheet) {
    style.styleSheet.cssText = replaceText(index, css);
  } else {
    var cssNode = document.createTextNode(css);
    var childNodes = style.childNodes;

    if (childNodes[index]) {
      style.removeChild(childNodes[index]);
    }

    if (childNodes.length) {
      style.insertBefore(cssNode, childNodes[index]);
    } else {
      style.appendChild(cssNode);
    }
  }
}

function applyToTag(style, options, obj) {
  var css = obj.css;
  var media = obj.media;
  var sourceMap = obj.sourceMap;

  if (media) {
    style.setAttribute('media', media);
  } else {
    style.removeAttribute('media');
  }

  if (sourceMap && typeof btoa !== 'undefined') {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    while (style.firstChild) {
      style.removeChild(style.firstChild);
    }

    style.appendChild(document.createTextNode(css));
  }
}

var singleton = null;
var singletonCounter = 0;

function addStyle(obj, options) {
  var style;
  var update;
  var remove;

  if (options.singleton) {
    var styleIndex = singletonCounter++;
    style = singleton || (singleton = insertStyleElement(options));
    update = applyToSingletonTag.bind(null, style, styleIndex, false);
    remove = applyToSingletonTag.bind(null, style, styleIndex, true);
  } else {
    style = insertStyleElement(options);
    update = applyToTag.bind(null, style, options);

    remove = function remove() {
      removeStyleElement(style);
    };
  }

  update(obj);
  return function updateStyle(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
        return;
      }

      update(obj = newObj);
    } else {
      remove();
    }
  };
}

module.exports = function (list, options) {
  options = options || {}; // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
  // tags it will allow on a page

  if (!options.singleton && typeof options.singleton !== 'boolean') {
    options.singleton = isOldIE();
  }

  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    if (Object.prototype.toString.call(newList) !== '[object Array]') {
      return;
    }

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDom[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDom[_index].references === 0) {
        stylesInDom[_index].updater();

        stylesInDom.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"/js/app": 0,
/******/ 			"css/app": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunk"] = self["webpackChunk"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	__webpack_require__.O(undefined, ["css/app"], () => (__webpack_require__("./resources/js/app.js")))
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["css/app"], () => (__webpack_require__("./resources/css/app.css")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
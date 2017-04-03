define(["exports", "fable-core/Symbol", "fable-core/Util", "PIXI"], function (exports, _Symbol2, _Util, _PIXI) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.RenderingContext = exports.State = undefined;
  exports.updateLoop = updateLoop;
  exports.start = start;

  var _Symbol3 = _interopRequireDefault(_Symbol2);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var State = exports.State = function () {
    function State(caseName, fields) {
      _classCallCheck(this, State);

      this.Case = caseName;
      this.Fields = fields;
    }

    _createClass(State, [{
      key: _Symbol3.default.reflection,
      value: function value() {
        return {
          type: "Fable-behaviors.State",
          interfaces: ["FSharpUnion", "System.IEquatable", "System.IComparable"],
          cases: {
            Loading: [],
            MainTitle: [],
            Nothing: [],
            Play: []
          }
        };
      }
    }, {
      key: "Equals",
      value: function Equals(other) {
        return (0, _Util.equalsUnions)(this, other);
      }
    }, {
      key: "CompareTo",
      value: function CompareTo(other) {
        return (0, _Util.compareUnions)(this, other);
      }
    }]);

    return State;
  }();

  (0, _Util.declare)(State);

  var RenderingContext = exports.RenderingContext = function () {
    _createClass(RenderingContext, [{
      key: _Symbol3.default.reflection,
      value: function value() {
        return {
          type: "Fable-behaviors.RenderingContext",
          properties: {
            Instance: RenderingContext
          }
        };
      }
    }]);

    function RenderingContext() {
      _classCallCheck(this, RenderingContext);

      this.renderer = new _PIXI.WebGLRenderer(window.innerWidth, window.innerHeight, {
        antialias: true,
        backgroundColor: 133918
      });
      this.stage = new _PIXI.Sprite();
    }

    _createClass(RenderingContext, [{
      key: "SetInteractive",
      value: function SetInteractive() {
        this.stage.interactive = true;
      }
    }, {
      key: "GetRenderer",
      value: function GetRenderer() {
        return this.renderer;
      }
    }, {
      key: "GetKnownRenderer",
      value: function GetKnownRenderer() {
        return this.renderer;
      }
    }, {
      key: "GetView",
      value: function GetView() {
        return this.renderer.view;
      }
    }, {
      key: "Render",
      value: function Render() {
        this.renderer.render(this.stage);
      }
    }, {
      key: "GetRoot",
      value: function GetRoot() {
        return this.stage;
      }
    }, {
      key: "GetBounds",
      value: function GetBounds() {
        return new _PIXI.Rectangle(0, 0, this.renderer.width, this.renderer.height);
      }
    }], [{
      key: ".cctor",
      value: function cctor() {
        RenderingContext.instance = new RenderingContext();
      }
    }, {
      key: "Instance",
      get: function get() {
        return RenderingContext.instance;
      }
    }]);

    return RenderingContext;
  }();

  (0, _Util.declare)(RenderingContext);
  RenderingContext[".cctor"]();

  function updateLoop(fps) {
    var state = new State("Loading", []);

    var errorCallback = function errorCallback(e) {
      console.log(e);
    };

    var progressCallback = function progressCallback(e) {
      console.log(e);
    };

    var onLoadComplete = function onLoadComplete() {
      state = new State("MainTitle", []);
    };

    var update = function update(state_1) {
      return state_1.Case === "Loading" ? new State("Nothing", []) : state_1.Case === "MainTitle" ? new State("Play", []) : state_1.Case === "Play" ? new State("Play", []) : new State("Nothing", []);
    };

    var updateLoop_1 = function updateLoop_1(dt) {
      window.requestAnimationFrame(function (delegateArg0) {
        updateLoop_1(delegateArg0);
      });
      state = update(state);
      RenderingContext.Instance.Render();
    };

    return updateLoop_1;
  }

  function start(divName, fps) {
    var view = RenderingContext.Instance.GetView();
    document.getElementById(divName).appendChild(view);
    view.style.display = "block";
    view.style.margin = "0 auto";
    updateLoop(fps)(0);
  }

  start("game", 60);
});
//# sourceMappingURL=fable-behaviors.js.map
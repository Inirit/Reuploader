(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('blob-util')) :
	typeof define === 'function' && define.amd ? define(['blob-util'], factory) :
	(factory(global.blobUtil));
}(this, (function (blobUtil) { 'use strict';

var HandlerType;
(function (HandlerType) {
    HandlerType[HandlerType["Pomf"] = 0] = "Pomf";
    HandlerType[HandlerType["Imgur"] = 1] = "Imgur";
    HandlerType[HandlerType["PostImage"] = 2] = "PostImage";
})(HandlerType || (HandlerType = {}));
var HandlerType$1 = HandlerType;

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};



function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var stronglyTypedEvents = createCommonjsModule(function (module, exports) {
/*!
 * Strongly Typed Events for TypeScript - 1.0.1
 * https://github.com/KeesCBakker/StronlyTypedEvents/
 * http://keestalkstech.com
 *
 * Copyright Kees C. Bakker / KeesTalksTech
 * Released under the MIT license
 */
var __extends = (commonjsGlobal && commonjsGlobal.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscription = (function () {
    /**
     * Creates an instance of Subscription.
     *
     * @param {TEventHandler} handler The handler for the subscription.
     * @param {boolean} isOnce Indicates if the handler should only be executed` once.
     */
    function Subscription(handler, isOnce) {
        this.handler = handler;
        this.isOnce = isOnce;
        /**
         * Indicates if the subscription has been executed before.
         */
        this.isExecuted = false;
    }
    /**
     * Executes the handler.
     *
     * @param {boolean} executeAsync True if the even should be executed async.
     * @param {*} The scope the scope of the event.
     * @param {IArguments} args The arguments for the event.
     */
    Subscription.prototype.execute = function (executeAsync, scope, args) {
        if (!this.isOnce || !this.isExecuted) {
            this.isExecuted = true;
            var fn = this.handler;
            if (executeAsync) {
                setTimeout(function () {
                    fn.apply(scope, args);
                }, 1);
            }
            else {
                fn.apply(scope, args);
            }
        }
    };
    return Subscription;
}());
exports.Subscription = Subscription;
/**
 * Base class for implementation of the dispatcher. It facilitates the subscribe
 * and unsubscribe methods based on generic handlers. The TEventType specifies
 * the type of event that should be exposed. Use the asEvent to expose the
 * dispatcher as event.
 */
var DispatcherBase = (function () {
    function DispatcherBase() {
        this._wrap = new DispatcherWrapper(this);
        this._subscriptions = new Array();
    }
    /**
     * Subscribe to the event dispatcher.
     * @param fn The event handler that is called when the event is dispatched.
     */
    DispatcherBase.prototype.subscribe = function (fn) {
        if (fn) {
            this._subscriptions.push(new Subscription(fn, false));
        }
    };
    /**
     * Subscribe to the event dispatcher.
     * @param fn The event handler that is called when the event is dispatched.
     */
    DispatcherBase.prototype.sub = function (fn) {
        this.subscribe(fn);
    };
    /**
     * Subscribe once to the event with the specified name.
     * @param fn The event handler that is called when the event is dispatched.
     */
    DispatcherBase.prototype.one = function (fn) {
        if (fn) {
            this._subscriptions.push(new Subscription(fn, true));
        }
    };
    /**
     * Checks it the event has a subscription for the specified handler.
     * @param fn The event handler.
     */
    DispatcherBase.prototype.has = function (fn) {
        if (fn) {
            for (var _i = 0, _a = this._subscriptions; _i < _a.length; _i++) {
                var sub = _a[_i];
                if (sub.handler == fn) {
                    return true;
                }
            }
        }
        return false;
    };
    /**
     * Unsubscribes the handler from the dispatcher.
     * @param fn The event handler.
     */
    DispatcherBase.prototype.unsubscribe = function (fn) {
        if (fn) {
            for (var i = 0; i < this._subscriptions.length; i++) {
                var sub = this._subscriptions[i];
                if (sub.handler == fn) {
                    this._subscriptions.splice(i, 1);
                    break;
                }
            }
        }
    };
    /**
     * Unsubscribes the handler from the dispatcher.
     * @param fn The event handler.
     */
    DispatcherBase.prototype.unsub = function (fn) {
        this.unsubscribe(fn);
    };
    /**
     * Generic dispatch will dispatch the handlers with the given arguments.
     *
     * @protected
     * @param {boolean} executeAsync True if the even should be executed async.
     * @param {*} The scope the scope of the event.
     * @param {IArguments} args The arguments for the event.
     */
    DispatcherBase.prototype._dispatch = function (executeAsync, scope, args) {
        for (var i = 0; i < this._subscriptions.length; i++) {
            var sub = this._subscriptions[i];
            if (sub.isOnce) {
                if (sub.isExecuted === true) {
                    continue;
                }
                this._subscriptions.splice(i, 1);
                i--;
            }
            sub.execute(executeAsync, scope, args);
        }
    };
    /**
     * Creates an event from the dispatcher. Will return the dispatcher
     * in a wrapper. This will prevent exposure of any dispatcher methods.
     */
    DispatcherBase.prototype.asEvent = function () {
        return this._wrap;
    };
    /**
     * Clears all the subscriptions.
     */
    DispatcherBase.prototype.clear = function () {
        this._subscriptions.splice(0, this._subscriptions.length);
    };
    return DispatcherBase;
}());
exports.DispatcherBase = DispatcherBase;
/**
 * Dispatcher implementation for events. Can be used to subscribe, unsubscribe
 * or dispatch events. Use the ToEvent() method to expose the event.
 */
var EventDispatcher = (function (_super) {
    __extends(EventDispatcher, _super);
    /**
     * Creates a new EventDispatcher instance.
     */
    function EventDispatcher() {
        return _super.call(this) || this;
    }
    /**
     * Dispatches the event.
     * @param sender The sender.
     * @param args The arguments object.
     */
    EventDispatcher.prototype.dispatch = function (sender, args) {
        this._dispatch(false, this, arguments);
    };
    /**
     * Dispatches the events thread.
     * @param sender The sender.
     * @param args The arguments object.
     */
    EventDispatcher.prototype.dispatchAsync = function (sender, args) {
        this._dispatch(true, this, arguments);
    };
    /**
     * Creates an event from the dispatcher. Will return the dispatcher
     * in a wrapper. This will prevent exposure of any dispatcher methods.
     */
    EventDispatcher.prototype.asEvent = function () {
        return _super.prototype.asEvent.call(this);
    };
    return EventDispatcher;
}(DispatcherBase));
exports.EventDispatcher = EventDispatcher;
/**
 * The dispatcher handles the storage of subsciptions and facilitates
 * subscription, unsubscription and dispatching of a simple event
 */
var SimpleEventDispatcher = (function (_super) {
    __extends(SimpleEventDispatcher, _super);
    /**
     * Creates a new SimpleEventDispatcher instance.
     */
    function SimpleEventDispatcher() {
        return _super.call(this) || this;
    }
    /**
     * Dispatches the event.
     * @param args The arguments object.
     */
    SimpleEventDispatcher.prototype.dispatch = function (args) {
        this._dispatch(false, this, arguments);
    };
    /**
     * Dispatches the events thread.
     * @param args The arguments object.
     */
    SimpleEventDispatcher.prototype.dispatchAsync = function (args) {
        this._dispatch(true, this, arguments);
    };
    /**
     * Creates an event from the dispatcher. Will return the dispatcher
     * in a wrapper. This will prevent exposure of any dispatcher methods.
     */
    SimpleEventDispatcher.prototype.asEvent = function () {
        return _super.prototype.asEvent.call(this);
    };
    return SimpleEventDispatcher;
}(DispatcherBase));
exports.SimpleEventDispatcher = SimpleEventDispatcher;
/**
 * The dispatcher handles the storage of subsciptions and facilitates
 * subscription, unsubscription and dispatching of a signal event.
 */
var SignalDispatcher = (function (_super) {
    __extends(SignalDispatcher, _super);
    /**
     * Creates a new SignalDispatcher instance.
     */
    function SignalDispatcher() {
        return _super.call(this) || this;
    }
    /**
     * Dispatches the signal.
     */
    SignalDispatcher.prototype.dispatch = function () {
        this._dispatch(false, this, arguments);
    };
    /**
     * Dispatches the signal threaded.
     */
    SignalDispatcher.prototype.dispatchAsync = function () {
        this._dispatch(true, this, arguments);
    };
    /**
     * Creates an event from the dispatcher. Will return the dispatcher
     * in a wrapper. This will prevent exposure of any dispatcher methods.
     */
    SignalDispatcher.prototype.asEvent = function () {
        return _super.prototype.asEvent.call(this);
    };
    return SignalDispatcher;
}(DispatcherBase));
exports.SignalDispatcher = SignalDispatcher;
/**
 * Hides the implementation of the event dispatcher. Will expose methods that
 * are relevent to the event.
 */
var DispatcherWrapper = (function () {
    /**
     * Creates a new EventDispatcherWrapper instance.
     * @param dispatcher The dispatcher.
     */
    function DispatcherWrapper(dispatcher) {
        this._subscribe = function (fn) { return dispatcher.subscribe(fn); };
        this._unsubscribe = function (fn) { return dispatcher.unsubscribe(fn); };
        this._one = function (fn) { return dispatcher.one(fn); };
        this._has = function (fn) { return dispatcher.has(fn); };
        this._clear = function () { return dispatcher.clear(); };
    }
    /**
     * Subscribe to the event dispatcher.
     * @param fn The event handler that is called when the event is dispatched.
     */
    DispatcherWrapper.prototype.subscribe = function (fn) {
        this._subscribe(fn);
    };
    /**
     * Subscribe to the event dispatcher.
     * @param fn The event handler that is called when the event is dispatched.
     */
    DispatcherWrapper.prototype.sub = function (fn) {
        this.subscribe(fn);
    };
    /**
     * Unsubscribe from the event dispatcher.
     * @param fn The event handler that is called when the event is dispatched.
     */
    DispatcherWrapper.prototype.unsubscribe = function (fn) {
        this._unsubscribe(fn);
    };
    /**
     * Unsubscribe from the event dispatcher.
     * @param fn The event handler that is called when the event is dispatched.
     */
    DispatcherWrapper.prototype.unsub = function (fn) {
        this.unsubscribe(fn);
    };
    /**
     * Subscribe once to the event with the specified name.
     * @param fn The event handler that is called when the event is dispatched.
     */
    DispatcherWrapper.prototype.one = function (fn) {
        this._one(fn);
    };
    /**
     * Checks it the event has a subscription for the specified handler.
     * @param fn The event handler.
     */
    DispatcherWrapper.prototype.has = function (fn) {
        return this._has(fn);
    };
    /**
     * Clears all the subscriptions.
     */
    DispatcherWrapper.prototype.clear = function () {
        this._clear();
    };
    return DispatcherWrapper;
}());
exports.DispatcherWrapper = DispatcherWrapper;
/**
 * Base class for event lists classes. Implements the get and remove.
 */
var EventListBase = (function () {
    function EventListBase() {
        this._events = {};
    }
    /**
     * Gets the dispatcher associated with the name.
     * @param name The name of the event.
     */
    EventListBase.prototype.get = function (name) {
        var event = this._events[name];
        if (event) {
            return event;
        }
        event = this.createDispatcher();
        this._events[name] = event;
        return event;
    };
    /**
     * Removes the dispatcher associated with the name.
     * @param name The name of the event.
     */
    EventListBase.prototype.remove = function (name) {
        this._events[name] = null;
    };
    return EventListBase;
}());
exports.EventListBase = EventListBase;
/**
 * Storage class for multiple events that are accessible by name.
 * Events dispatchers are automatically created.
 */
var EventList = (function (_super) {
    __extends(EventList, _super);
    /**
     * Creates a new EventList instance.
     */
    function EventList() {
        return _super.call(this) || this;
    }
    /**
     * Creates a new dispatcher instance.
     */
    EventList.prototype.createDispatcher = function () {
        return new EventDispatcher();
    };
    return EventList;
}(EventListBase));
exports.EventList = EventList;
/**
 * Storage class for multiple simple events that are accessible by name.
 * Events dispatchers are automatically created.
 */
var SimpleEventList = (function (_super) {
    __extends(SimpleEventList, _super);
    /**
     * Creates a new SimpleEventList instance.
     */
    function SimpleEventList() {
        return _super.call(this) || this;
    }
    /**
     * Creates a new dispatcher instance.
     */
    SimpleEventList.prototype.createDispatcher = function () {
        return new SimpleEventDispatcher();
    };
    return SimpleEventList;
}(EventListBase));
exports.SimpleEventList = SimpleEventList;
/**
 * Storage class for multiple signal events that are accessible by name.
 * Events dispatchers are automatically created.
 */
var SignalList = (function (_super) {
    __extends(SignalList, _super);
    /**
     * Creates a new SignalList instance.
     */
    function SignalList() {
        return _super.call(this) || this;
    }
    /**
     * Creates a new dispatcher instance.
     */
    SignalList.prototype.createDispatcher = function () {
        return new SignalDispatcher();
    };
    return SignalList;
}(EventListBase));
exports.SignalList = SignalList;
/**
 * Extends objects with event handling capabilities.
 */
var EventHandlingBase = (function () {
    function EventHandlingBase() {
        this._events = new EventList();
    }
    Object.defineProperty(EventHandlingBase.prototype, "events", {
        /**
         * Gets the list with all the event dispatchers.
         */
        get: function () {
            return this._events;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Subscribes to the event with the specified name.
     * @param name The name of the event.
     * @param fn The event handler.
     */
    EventHandlingBase.prototype.subscribe = function (name, fn) {
        this._events.get(name).subscribe(fn);
    };
    /**
     * Subscribes to the event with the specified name.
     * @param name The name of the event.
     * @param fn The event handler.
     */
    EventHandlingBase.prototype.sub = function (name, fn) {
        this.subscribe(name, fn);
    };
    /**
     * Unsubscribes from the event with the specified name.
     * @param name The name of the event.
     * @param fn The event handler.
     */
    EventHandlingBase.prototype.unsubscribe = function (name, fn) {
        this._events.get(name).unsubscribe(fn);
    };
    /**
     * Unsubscribes from the event with the specified name.
     * @param name The name of the event.
     * @param fn The event handler.
     */
    EventHandlingBase.prototype.unsub = function (name, fn) {
        this.unsubscribe(name, fn);
    };
    /**
     * Subscribes to once the event with the specified name.
     * @param name The name of the event.
     * @param fn The event handler.
     */
    EventHandlingBase.prototype.one = function (name, fn) {
        this._events.get(name).one(fn);
    };
    /**
     * Subscribes to once the event with the specified name.
     * @param name The name of the event.
     * @param fn The event handler.
     */
    EventHandlingBase.prototype.has = function (name, fn) {
        return this._events.get(name).has(fn);
    };
    return EventHandlingBase;
}());
exports.EventHandlingBase = EventHandlingBase;
/**
 * Extends objects with simple event handling capabilities.
 */
var SimpleEventHandlingBase = (function () {
    function SimpleEventHandlingBase() {
        this._events = new SimpleEventList();
    }
    Object.defineProperty(SimpleEventHandlingBase.prototype, "events", {
        get: function () {
            return this._events;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Subscribes to the event with the specified name.
     * @param name The name of the event.
     * @param fn The event handler.
     */
    SimpleEventHandlingBase.prototype.subscribe = function (name, fn) {
        this._events.get(name).subscribe(fn);
    };
    /**
     * Subscribes to the event with the specified name.
     * @param name The name of the event.
     * @param fn The event handler.
     */
    SimpleEventHandlingBase.prototype.sub = function (name, fn) {
        this.subscribe(name, fn);
    };
    /**
     * Subscribes once to the event with the specified name.
     * @param name The name of the event.
     * @param fn The event handler.
     */
    SimpleEventHandlingBase.prototype.one = function (name, fn) {
        this._events.get(name).one(fn);
    };
    /**
     * Checks it the event has a subscription for the specified handler.
     * @param name The name of the event.
     * @param fn The event handler.
     */
    SimpleEventHandlingBase.prototype.has = function (name, fn) {
        return this._events.get(name).has(fn);
    };
    /**
     * Unsubscribes from the event with the specified name.
     * @param name The name of the event.
     * @param fn The event handler.
     */
    SimpleEventHandlingBase.prototype.unsubscribe = function (name, fn) {
        this._events.get(name).unsubscribe(fn);
    };
    /**
     * Unsubscribes from the event with the specified name.
     * @param name The name of the event.
     * @param fn The event handler.
     */
    SimpleEventHandlingBase.prototype.unsub = function (name, fn) {
        this.unsubscribe(name, fn);
    };
    return SimpleEventHandlingBase;
}());
exports.SimpleEventHandlingBase = SimpleEventHandlingBase;
/**
 * Extends objects with signal event handling capabilities.
 */
var SignalHandlingBase = (function () {
    function SignalHandlingBase() {
        this._events = new SignalList();
    }
    Object.defineProperty(SignalHandlingBase.prototype, "events", {
        get: function () {
            return this._events;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Subscribes once to the event with the specified name.
     * @param name The name of the event.
     * @param fn The event handler.
     */
    SignalHandlingBase.prototype.one = function (name, fn) {
        this._events.get(name).one(fn);
    };
    /**
     * Checks it the event has a subscription for the specified handler.
     * @param name The name of the event.
     * @param fn The event handler.
     */
    SignalHandlingBase.prototype.has = function (name, fn) {
        return this._events.get(name).has(fn);
    };
    /**
     * Subscribes to the event with the specified name.
     * @param name The name of the event.
     * @param fn The event handler.
     */
    SignalHandlingBase.prototype.subscribe = function (name, fn) {
        this._events.get(name).subscribe(fn);
    };
    /**
     * Subscribes to the event with the specified name.
     * @param name The name of the event.
     * @param fn The event handler.
     */
    SignalHandlingBase.prototype.sub = function (name, fn) {
        this.subscribe(name, fn);
    };
    /**
     * Unsubscribes from the event with the specified name.
     * @param name The name of the event.
     * @param fn The event handler.
     */
    SignalHandlingBase.prototype.unsubscribe = function (name, fn) {
        this._events.get(name).unsubscribe(fn);
    };
    /**
     * Unsubscribes from the event with the specified name.
     * @param name The name of the event.
     * @param fn The event handler.
     */
    SignalHandlingBase.prototype.unsub = function (name, fn) {
        this.unsubscribe(name, fn);
    };
    return SignalHandlingBase;
}());
exports.SignalHandlingBase = SignalHandlingBase;
function createEventDispatcher() {
    return new EventDispatcher();
}
exports.createEventDispatcher = createEventDispatcher;

function createEventList() {
    return new EventList();
}
exports.createEventList = createEventList;
function createSimpleEventDispatcher() {
    return new SimpleEventDispatcher();
}
exports.createSimpleEventDispatcher = createSimpleEventDispatcher;

function createSimpleEventList() {
    return new SimpleEventList();
}
exports.createSimpleEventList = createSimpleEventList;
function createSignalDispatcher() {
    return new SignalDispatcher();
}
exports.createSignalDispatcher = createSignalDispatcher;

function createSignalList() {
    return new SignalList();
}
exports.createSignalList = createSignalList;

var StronglyTypedEventsStatic = {
    EventList: EventList,
    SimpleEventList: SimpleEventList,
    SignalList: SignalList,
    createEventList: createEventList,
    createSimpleEventList: createSimpleEventList,
    createSignalList: createSignalList,
    EventDispatcher: EventDispatcher,
    SimpleEventDispatcher: SimpleEventDispatcher,
    SignalDispatcher: SignalDispatcher,
    EventHandlingBase: EventHandlingBase,
    SimpleEventHandlingBase: SimpleEventHandlingBase,
    SignalHandlingBase: SignalHandlingBase,
    createEventDispatcher: createEventDispatcher,
    createSimpleEventDispatcher: createSimpleEventDispatcher,
    createSignalDispatcher: createSignalDispatcher,
    EventListBase: EventListBase,
    DispatcherBase: DispatcherBase,
    DispatcherWrapper: DispatcherWrapper
};
exports.IStronglyTypedEvents = StronglyTypedEventsStatic;
var _e = exports.IStronglyTypedEvents;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StronglyTypedEventsStatic;
});

unwrapExports(stronglyTypedEvents);
var stronglyTypedEvents_1 = stronglyTypedEvents.Subscription;
var stronglyTypedEvents_2 = stronglyTypedEvents.DispatcherBase;
var stronglyTypedEvents_3 = stronglyTypedEvents.EventDispatcher;
var stronglyTypedEvents_4 = stronglyTypedEvents.SimpleEventDispatcher;
var stronglyTypedEvents_5 = stronglyTypedEvents.SignalDispatcher;
var stronglyTypedEvents_6 = stronglyTypedEvents.DispatcherWrapper;
var stronglyTypedEvents_7 = stronglyTypedEvents.EventListBase;
var stronglyTypedEvents_8 = stronglyTypedEvents.EventList;
var stronglyTypedEvents_9 = stronglyTypedEvents.SimpleEventList;
var stronglyTypedEvents_10 = stronglyTypedEvents.SignalList;
var stronglyTypedEvents_11 = stronglyTypedEvents.EventHandlingBase;
var stronglyTypedEvents_12 = stronglyTypedEvents.SimpleEventHandlingBase;
var stronglyTypedEvents_13 = stronglyTypedEvents.SignalHandlingBase;
var stronglyTypedEvents_14 = stronglyTypedEvents.createEventDispatcher;
var stronglyTypedEvents_15 = stronglyTypedEvents.createEventList;
var stronglyTypedEvents_16 = stronglyTypedEvents.createSimpleEventDispatcher;
var stronglyTypedEvents_17 = stronglyTypedEvents.createSimpleEventList;
var stronglyTypedEvents_18 = stronglyTypedEvents.createSignalDispatcher;
var stronglyTypedEvents_19 = stronglyTypedEvents.createSignalList;
var stronglyTypedEvents_20 = stronglyTypedEvents.IStronglyTypedEvents;

class ExtensionOptionsBase {
    static async GetOptions(defaultOptions) {
        const options = await browser.storage.local.get(defaultOptions);
        return options;
    }
    static async GetOption(name, defaultOptions) {
        const options = await this.GetOptions(defaultOptions);
        const value = options[name];
        console.debug(`Got '${name}' with value '${value}'`);
        return value;
    }
    static async SetOption(name, value) {
        console.debug(`Setting '${name}' to '${value}'`);
        if (value) {
            const options = await browser.storage.local.get(name);
            options[name] = value;
            await browser.storage.local.set(options);
        }
        else {
            await browser.storage.local.remove(name);
        }
    }
}

class UrlParams {
}
class ImgurOptions extends ExtensionOptionsBase {
    static get onAuthStateChange() {
        return this._authStateChange.asEvent();
    }
    static async GetAccessToken() {
        const value = await this.GetOption(this._accessTokenName, this._defaultOptions);
        return value;
    }
    static async GetExpiresIn() {
        const value = await this.GetOption(this._expiresInName, this._defaultOptions);
        return value;
    }
    static async GetTokenType() {
        const value = await this.GetOption(this._tokenTypeName, this._defaultOptions);
        return value;
    }
    static async GetRefreshToken() {
        const value = await this.GetOption(this._refreshTokenName, this._defaultOptions);
        return value;
    }
    static async GetAccountName() {
        const value = await this.GetOption(this._accountNameName, this._defaultOptions);
        return value;
    }
    static async GetAccountId() {
        const value = await this.GetOption(this._accountIdName, this._defaultOptions);
        return value;
    }
    static async SetAuthInfo(authResponse) {
        const params = this.GetParamsFromResponseUrl(authResponse);
        await this.SetAccessToken(params["access_token"]);
        await this.SetExpiresIn(params["expires_in"]);
        await this.SetTokenType(params["token_type"]);
        await this.SetRefreshToken(params["refresh_token"]);
        await this.SetAccountName(params["account_username"]);
        await this.SetAccountId(params["account_id"]);
        const authState = await this.IsAuthed();
        this._authStateChange.dispatch(authState);
    }
    static async ClearAuthInfo() {
        await this.SetAuthInfo(undefined);
    }
    static async IsAuthed() {
        let isAuthed;
        if (await this.GetAccessToken()) {
            isAuthed = true;
        }
        else {
            isAuthed = false;
        }
        return isAuthed;
    }
    static async SetAccessToken(value) {
        await this.SetOption(this._accessTokenName, value);
    }
    static async SetExpiresIn(value) {
        await this.SetOption(this._expiresInName, value);
    }
    static async SetTokenType(value) {
        await this.SetOption(this._tokenTypeName, value);
    }
    static async SetRefreshToken(value) {
        await this.SetOption(this._refreshTokenName, value);
    }
    static async SetAccountName(value) {
        await this.SetOption(this._accountNameName, value);
    }
    static async SetAccountId(value) {
        await this.SetOption(this._accountIdName, value);
    }
    static GetParamsFromResponseUrl(response) {
        const values = new UrlParams();
        if (!response) {
            return values;
        }
        const params = response.slice(response.indexOf("#") + 1).split("&");
        for (const param of params) {
            const paramPair = param.split("=");
            values[paramPair[0]] = paramPair[1];
        }
        return values;
    }
}
ImgurOptions.ClientId = "4a4f81163ed1219";
ImgurOptions._defaultOptions = {
    AccessToken: undefined,
    ExpiresIn: undefined,
    TokenType: undefined,
    RefreshToken: undefined,
    AccountName: undefined,
    AccountId: undefined
};
ImgurOptions._accessTokenName = "AccessToken";
ImgurOptions._expiresInName = "ExpiresIn";
ImgurOptions._tokenTypeName = "TokenType";
ImgurOptions._refreshTokenName = "RefreshToken";
ImgurOptions._accountNameName = "AccountName";
ImgurOptions._accountIdName = "AccountId";
ImgurOptions._authStateChange = new stronglyTypedEvents_4();

class HandlerBase {
    async ReuploadImage(originalImageUrl) {
        const image = await this.FetchImage(originalImageUrl);
        const uploadedUrl = await this.UploadImage(image);
        return uploadedUrl;
    }
    async UploadImage(image) {
        const notificationId = await browser.notifications.create(`reupload_progress_${Date.now()}`, {
            type: "basic",
            title: browser.i18n.getMessage("extensionName"),
            iconUrl: "./images/up_arrow.png",
            message: browser.i18n.getMessage("notificationMessageReuploadProgress", HandlerType$1[this.HandlerType])
        });
        setTimeout(() => {
            browser.notifications.clear(notificationId);
        }, 5000);
        const uploadedUrl = await this.HandleUpload(image);
        await browser.notifications.clear(notificationId);
        return uploadedUrl;
    }
    async FetchImage(imageUrl) {
        let blob;
        await $.ajax({
            url: imageUrl,
            method: "GET",
            xhr: this.GetFetchXhr
        }).then((data) => {
            console.debug(`Image fetch complete. Size: ${data.size}, Type: ${data.type}`);
            blob = data;
        }, (jqXHR, textStatus, error) => {
            this.HandleFetchError(jqXHR, textStatus, error);
        });
        return blob;
    }
    GetUploadXhr() {
        const xhr = $.ajaxSettings.xhr();
        if (xhr.upload) {
            xhr.upload.addEventListener("progress", (e) => {
                if (e.lengthComputable) {
                    const percentage = e.loaded / e.total * 100;
                    console.debug(`Progress: ${percentage}%`);
                }
            }, false);
        }
        return xhr;
    }
    GetFetchXhr() {
        const xhr = $.ajaxSettings.xhr();
        xhr.responseType = "blob";
        return xhr;
    }
    async HandleGeneralError(errorMessage) {
        const notificationId = await browser.notifications.create(`reupload_failed_${Date.now()}`, {
            type: "basic",
            title: browser.i18n.getMessage("extensionName"),
            iconUrl: "./images/up_arrow.png",
            message: `${errorMessage}`
        });
        setTimeout(() => {
            browser.notifications.clear(notificationId);
        }, 10000);
    }
    async HandleUploadError(jqXHR, textStatus, error) {
        await this.HandleGeneralError(browser.i18n.getMessage("errorImageFailedToUpload", [textStatus, error]));
    }
    async HandleFetchError(jqXHR, textStatus, error) {
        await this.HandleGeneralError(browser.i18n.getMessage("errorImageFailedToDownload", [textStatus, error]));
    }
}

class ImgurHandler extends HandlerBase {
    constructor() {
        super(...arguments);
        this._uploadUrl = "https://api.imgur.com/3/image";
    }
    get HandlerType() {
        return HandlerType$1.Imgur;
    }
    async HandleUpload(image) {
        const authorizationHeader = await this.GetAuthorizationHeader();
        const formData = new FormData();
        formData.append("image", image, "image.jpg");
        const ajaxSettings = {
            url: this._uploadUrl,
            method: "POST",
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            headers: {
                Authorization: authorizationHeader,
                Accept: "application/json"
            },
            xhr: this.GetUploadXhr
        };
        let uploadedUrl;
        await $.ajax(ajaxSettings).then((result) => {
            if (result && result.data && result.data.link) {
                uploadedUrl = result.data.link;
            }
            else {
                this.HandleGeneralError("Failed to upload image, unexpected response format from service.");
            }
        }, (jqXHR, textStatus, error) => {
            this.HandleUploadError(jqXHR, textStatus, error);
        });
        return uploadedUrl;
    }
    async GetAuthorizationHeader() {
        let authorizationHeader;
        const accessToken = await ImgurOptions.GetAccessToken();
        if (accessToken) {
            authorizationHeader = `Bearer ${accessToken}`;
            console.debug(`Using access token for Imgur upload`);
        }
        else {
            const clientId = await ImgurOptions.ClientId;
            authorizationHeader = `Client-ID ${clientId}`;
            console.debug(`Using client id for Imgur upload`);
        }
        return authorizationHeader;
    }
}

class PomfHandler extends HandlerBase {
    constructor() {
        super(...arguments);
        this._uploadUrl = "https://pomf.cat/upload.php";
        this._uploadPrefix = "https://a.pomf.cat/";
    }
    get HandlerType() {
        return HandlerType$1.Pomf;
    }
    async HandleUpload(image) {
        const formData = new FormData();
        formData.append("files[]", image, "image.jpg");
        const ajaxSettings = {
            url: this._uploadUrl,
            method: "POST",
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            xhr: this.GetUploadXhr
        };
        let uploadedUrl;
        await $.ajax(ajaxSettings).then((data) => {
            if (data && data.files) {
                const uploadedFile = data.files[0];
                const uploadedFileName = uploadedFile.url;
                uploadedUrl = `${this._uploadPrefix}${uploadedFileName}`;
            }
            else {
                this.HandleGeneralError("Failed to upload image, unexpected response format from service.");
            }
        }, (jqXHR, textStatus, error) => {
            this.HandleUploadError(jqXHR, textStatus, error);
        });
        return uploadedUrl;
    }
}

class PostImageData {
    constructor(imageBase64) {
        this.key = "8ca0b57a6bb9c4c33cd9e7ab8e6a7f05";
        this.o = "2b819584285c102318568238c7d4a4c7";
        this.m = "fb733cccce28e7db3ff9f17d7ccff3d1";
        this.version = "1.0.1";
        this.name = "image";
        this.type = "jpg";
        this.image = imageBase64;
    }
}
class PostImageHandler extends HandlerBase {
    constructor() {
        super(...arguments);
        this._uploadUrl = "http://api.postimage.org/1/upload";
    }
    get HandlerType() {
        return HandlerType$1.PostImage;
    }
    async HandleUpload(image) {
        const dataUrl = await blobUtil.blobToBase64String(image);
        const uploadData = new PostImageData(dataUrl);
        const ajaxSettings = {
            url: this._uploadUrl,
            method: "POST",
            data: uploadData,
            xhr: this.GetUploadXhr
        };
        let uploadedUrl;
        await $.ajax(ajaxSettings).then((data) => {
            const xml = $(data);
            const link = xml.find("hotlink");
            if (link && link.length > 0) {
                uploadedUrl = link.text();
            }
            else {
                console.error("Upload to PostImage faile but with a successful status code, potentially requires updating handling.");
                console.error(data);
                this.HandleGeneralError("Failed to upload image due to an unknown error.");
            }
        }, (jqXHR, textStatus, error) => {
            this.HandleUploadError(jqXHR, textStatus, error);
        });
        return uploadedUrl;
    }
}

class PrimaryOptions extends ExtensionOptionsBase {
    static async GetHandlerType() {
        const handler = await this.GetOption(this._handlerTypeName, this._defaultOptions);
        return handler;
    }
    static async SetHandlerType(value) {
        await this.SetOption(this._handlerTypeName, value);
    }
}
PrimaryOptions.EnabledHandlers = [
    HandlerType$1.Imgur,
    HandlerType$1.Pomf,
    HandlerType$1.PostImage
];
PrimaryOptions._handlerTypeName = "HandlerType";
PrimaryOptions._defaultOptions = {
    HandlerType: `${HandlerType$1.Imgur}`
};

function HandleOnCreated() {
    if (browser.runtime.lastError) {
        console.error(`Error: ${browser.runtime.lastError}`);
    }
}
async function HandleGeneralError(errorMessage) {
    const notificationId = await browser.notifications.create(`reupload_failed_${Date.now()}`, {
        type: "basic",
        title: browser.i18n.getMessage("extensionName"),
        iconUrl: "./images/up_arrow.png",
        message: `${errorMessage}`
    });
    setTimeout(() => {
        browser.notifications.clear(notificationId);
    }, 10000);
}
async function HandleReuploadOnClick(info, tab) {
    if (info.menuItemId === "reuploadMenuItem") {
        const currentHandler = await PrimaryOptions.GetHandlerType();
        let handler;
        switch (+currentHandler) {
            case HandlerType$1.Imgur:
                handler = new ImgurHandler();
                break;
            case HandlerType$1.Pomf:
                handler = new PomfHandler();
                break;
            case HandlerType$1.PostImage:
                handler = new PostImageHandler();
                break;
            default:
                HandleGeneralError(browser.i18n.getMessage("errorHandlerTypeNotSupported", HandlerType$1[currentHandler]));
                break;
        }
        if (handler) {
            if (info.srcUrl) {
                const uploadedUrl = await handler.ReuploadImage(info.srcUrl);
                if (uploadedUrl) {
                    await browser.tabs.sendMessage(tab.id, { url: uploadedUrl });
                    const notificationId = await browser.notifications.create(`copy_complete_${Date.now()}`, {
                        type: "basic",
                        title: browser.i18n.getMessage("extensionName"),
                        iconUrl: "./images/up_arrow.png",
                        message: browser.i18n.getMessage("notificationMessageCopyToClipboard", uploadedUrl)
                    });
                    setTimeout(() => {
                        browser.notifications.clear(notificationId);
                    }, 5000);
                }
            }
            else {
                HandleGeneralError(browser.i18n.getMessage("errorImageSourceUrl"));
            }
        }
    }
}
async function Initialize() {
    console.debug(`Initializing...`);
    browser.contextMenus.create({
        id: "reuploadMenuItem",
        title: browser.i18n.getMessage("reuploadMenuItemLabel"),
        contexts: ["image"]
    }, (HandleOnCreated));
    browser.contextMenus.onClicked.addListener(HandleReuploadOnClick);
    console.debug(`Initialization complete.`);
}
Initialize();

})));
//# sourceMappingURL=background.bundle.js.map

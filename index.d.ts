export interface Thenable<T> {
    then<U>(
        resolve: (value: T) => U | Thenable<U>,
        reject?: (value: Error) => U | Thenable<U>
    ): Thenable<U>;
}

export interface Location {
    name: string;
    index: number;
}

export type ReportType =
    "start" |
    "enter" |
    "leave" |
    "pass" |
    "fail" |
    "skip" |
    "end" |
    "error" |
    "hook";

export type Report =
    StartReport |
    EnterReport |
    LeaveReport |
    PassReport |
    FailReport |
    SkipReport |
    EndReport |
    ErrorReport |
    HookReport;

interface ReportBase<T extends ReportType> {
    type: T;

    isStart: this is StartReport;
    isEnter: this is EnterReport;
    isLeave: this is LeaveReport;
    isPass: this is PassReport;
    isFail: this is FailReport;
    isSkip: this is SkipReport;
    isEnd: this is EndReport;
    isError: this is ErrorReport;
    isHook: this is HookReport;
    inspect(): Object;
}

export interface StartReport extends ReportBase<"start"> {}

export interface EnterReport extends ReportBase<"enter"> {
    path: Location[];
    duration: number;
    slow: number;
}

export interface LeaveReport extends ReportBase<"leave"> {
    path: Location[];
}

export interface PassReport extends ReportBase<"pass"> {
    path: Location[];
    duration: number;
    slow: number;
}

export interface FailReport extends ReportBase<"fail"> {
    path: Location[];
    error: any;
    duration: number;
    slow: number;
}

export interface SkipReport extends ReportBase<"skip"> {
    path: Location[];
}

export interface EndReport extends ReportBase<"end"> {}

export interface ErrorReport extends ReportBase<"error"> {
    error: any;
}

export type HookStage =
    "before all" |
    "before each" |
    "after each" |
    "after all";

export interface HookError<S extends HookStage> {
    stage: S;
    name: string;
    error: any;
}

export interface HookReport<S extends HookStage> extends ReportBase<"hook"> {
    stage: S;
    path: Location[];
    name: string;
    error: any;

    hookError: HookError<S>;
    isBeforeAll: this is HookReport<"before all">;
    isBeforeEach: this is HookReport<"before each">;
    isAfterEach: this is HookReport<"after each">;
    isAfterAll: this is HookReport<"after all">;
}

interface Reporter {
    (report: Report): any | Thenable<any>;
}

interface Callback {
    (): any | Thenable<any>;
}

/**
 * Contains several internal methods that are not as useful for most users,
 * but give plenty of access to details for plugin/reporter/etc. developers,
 * in case they need it.
 */
export interface Reflect {
    /**
     * Get the currently executing test.
     */
    current: Reflect;

    /**
     * Get the global root.
     */
    global: Reflect;

    /**
     * Get the current total test count.
     */
    count: number;

    /**
     * Get a copy of the current test list, as a Reflect collection. This is
     * intentionally a slice, so you can't mutate the real children.
     */
    children: Reflect[];

    /**
     * Get the test name, or `undefined` if it's the root test.
     */
    name: String | void;

    /**
     * Get the test index, or `-1` if it's the root test.
     */
    index: number;

    /**
     * Is this test the root, i.e. top level?
     */
    root: boolean;

    /**
     * Is this locked (i.e. unsafe to modify)?
     */
    locked: boolean;

    /**
     * Get a list of all own reporters. If none were added, an empty list is
     * returned.
     */
    reporters: Reporter[];

    /**
     * Get a list of all active reporters, either on this instance or on the
     * closest parent.
     */
    activeReporters: Reporter[];

    /**
     * Get the own, not necessarily active, timeout. 0 means inherit the
     * parent's, and `Infinity` means it's disabled.
     */
    timeout: number;

    /**
     * Get the active timeout in milliseconds, not necessarily own, or the
     * framework default of 2000, if none was set.
     */
    activeTimeout: number;

    /**
     * Get the own, not necessarily active, slow threshold. 0 means inherit the
     * parent's, and `Infinity` means it's disabled.
     */
    slow: number;

    /**
     * Get the active slow threshold in milliseconds, not necessarily own, or
     * the framework default of 75, if none was set.
     */
    activeSlow: number;

    /**
     * Get the parent test as a Reflect.
     */
    parent: Reflect | void;

    /**
     * Before/after hooks, for initialization and cleanup.
     */

    /**
     * Add a hook to be run before each subtest, including their subtests and so
     * on.
     */
    addBeforeEach(func: Callback): void;

    /**
     * Add a hook to be run once before all subtests are run.
     */
    addBeforeAll(func: Callback): void;

   /**
    * Add a hook to be run after each subtest, including their subtests and so
    * on.
    */
    addAfterEach(func: Callback): void;

    /**
     * Add a hook to be run once after all subtests are run.
     */
    addAfterAll(func: Callback): void;

    /**
     * Remove a hook previously added with `t.before` or
     * `reflect.addBeforeEach`.
     */
    removeBeforeEach(func: Callback): void;

    /**
     * Remove a hook previously added with `t.beforeAll` or
     * `reflect.addBeforeAll`.
     */
    removeBeforeAll(func: Callback): void;

    /**
     * Remove a hook previously added with `t.after` or`reflect.addAfterEach`.
     */
    removeAfterEach(func: Callback): void;

    /**
     * Remove a hook previously added with `t.afterAll` or
     * `reflect.addAfterAll`.
     */
    removeAfterAll(func: Callback): void;

    /**
     * Thallium API methods made available on reflect objects, so they don't
     * need a test instance to wrap everything.
     */

    /**
     * Add a reporter.
     */
    addReporter(reporter: Reporter, blocking?: boolean): void;

    /**
     * Remove a reporter.
     */
    removeReporter(reporter: Reporter): void;

    /**
     * Add a block or inline test.
     */
    test(name: string, callback: Callback): void;

    /**
     * Add a skipped block or inline test.
     */
    testSkip(name: string, callback: Callback): void;
}

export interface Test {
    /**
     * Friendly alias for ES6 module transpilers.
     */
    default: this;

    /**
     * Call a plugin and return the result. The plugin is called with a Reflect
     * instance for access to plenty of potentially useful internal details.
     */
    call<T>(plugin: (reflect: Reflect) => T): T;

    /**
     * Whitelist specific tests, using array-based selectors where each entry
     * is either a string or regular expression.
     */
    only(...selectors: Array<string | RegExp>[]): void;

    /**
     * Add a number of reporters. Note that this does add reporters to skipped
     * tests, because they're still runnable.
     *
     * `block` is `true` if this reporter needs to block while emitting its
     * data, but still work asynchronously. Useful if you need to have sole
     * async access to a resource, but there's no lock available. A good example
     * is having multiple console reporters, in which you probably want to make
     * at least all but one block.
     */
    reporter(reporter: Reporter, block?: boolean): void;

    /**
     * Get the current timeout. 0 means inherit the parent's, and `Infinity`
     * means it's disabled.
     *
     * Set the timeout in milliseconds, rounding negatives to 0. Setting the
     * timeout to 0 means to inherit the parent timeout, and setting it to
     * `Infinity` disables it.
     */
    timeout: number;

    /**
     * Get the current slow threshold. 0 means inherit the parent's, and
     * `Infinity` means it's disabled.
     *
     * Set the slow threshold in milliseconds, rounding negatives to 0. Setting
     * the timeout to 0 means to inherit the parent threshold, and setting it to
     * `Infinity` disables it.
     */
    slow: number;

    /**
     * Run the tests (or the test's tests if it's not a base instance).
     */
    run(): Promise<void>;

    /**
     * Add a test.
     */
    test(name: string, body: Callback): this;

    /**
     * Add a skipped test.
     */
    testSkip(name: string, body: Callback): this;
}

declare const t: Test;
export default t;

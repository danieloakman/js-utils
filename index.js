import {
assert,
equal,
expectType,
throws
} from "./assertions.js";
import {
BinarySearch
} from "./BinarySearch.js";
import {
exec,
importSync,
main,
nodeOnly,
sh
} from "./misc.js";
import {
DEGREES_MULT,
RADIANS_MULT,
lerp,
manhattanDistance,
randFloat,
randInteger,
roundTo,
safeParseFloat,
safeParseInt,
toDegrees,
toRadians
} from "./number.js";
import {
attempt,
constant,
effect,
identity,
iife,
isNullish,
isObjectLike,
isOk,
limitConcurrentCalls,
multiComparator,
noop,
ok,
okOr,
once,
pipe,
raise,
safeCall,
sleep
} from "./functional.js";
import"./types.js";
import {
InMemoryCache
} from "./InMemoryCache.js";
import {
findItemsFrom,
groupBy,
isPartiallyLike,
propIs,
safeJSONParse,
sortByKeys
} from "./object.js";
import {
__commonJS,
__require
} from "./chunk-1c49e647d94a40b6.js";

// node_modules/.pnpm/argparse@2.0.1/node_modules/argparse/lib/textwr
var require_sub = __commonJS((exports, module) => {
  var { inspect } = __require("util");
  module.exports = function sub(pattern, ...values) {
    let regex = /%(?:(%)|(-)?(\*)?(?:\((\w+)\))?([A-Za-z]))/g;
    let result = pattern.replace(regex, function(_, is_literal, is_left_align, is_padded, name, format) {
      if (is_literal)
        return "%";
      let padded_count = 0;
      if (is_padded) {
        if (values.length === 0)
          throw new TypeError("not enough arguments for format string");
        padded_count = values.shift();
        if (!Number.isInteger(padded_count))
          throw new TypeError("* wants int");
      }
      let str;
      if (name !== undefined) {
        let dict = values[0];
        if (typeof dict !== "object" || dict === null)
          throw new TypeError("format requires a mapping");
        if (!(name in dict))
          throw new TypeError(`no such key: '${name}'`);
        str = dict[name];
      } else {
        if (values.length === 0)
          throw new TypeError("not enough arguments for format string");
        str = values.shift();
      }
      switch (format) {
        case "s":
          str = String(str);
          break;
        case "r":
          str = inspect(str);
          break;
        case "d":
        case "i":
          if (typeof str !== "number") {
            throw new TypeError(`%${format} format: a number is required, not ${typeof str}`);
          }
          str = String(str.toFixed(0));
          break;
        default:
          throw new TypeError(`unsupported format character '${format}'`);
      }
      if (padded_count > 0) {
        return is_left_align ? str.padEnd(padded_count) : str.padStart(padded_count);
      } else {
        return str;
      }
    });
    if (values.length) {
      if (values.length === 1 && typeof values[0] === "object" && values[0] !== null) {
      } else {
        throw new TypeError("not all arguments converted during string formatting");
      }
    }
    return result;
  };
});

// node_modules/.pnpm/argparse@2.0.1/node_modules/argparse/lib/textwrap.js
var require_textwrap = __commonJS((exports, module) => {
  var wrap = function(text, options = {}) {
    let { width = 70, ...kwargs } = options;
    let w = new TextWrapper(Object.assign({ width }, kwargs));
    return w.wrap(text);
  };
  var fill = function(text, options = {}) {
    let { width = 70, ...kwargs } = options;
    let w = new TextWrapper(Object.assign({ width }, kwargs));
    return w.fill(text);
  };
  var dedent = function(text) {
    let margin = undefined;
    text = text.replace(_whitespace_only_re, "");
    let indents = text.match(_leading_whitespace_re) || [];
    for (let indent of indents) {
      indent = indent.slice(0, -1);
      if (margin === undefined) {
        margin = indent;
      } else if (indent.startsWith(margin)) {
      } else if (margin.startsWith(indent)) {
        margin = indent;
      } else {
        for (let i = 0;i < margin.length && i < indent.length; i++) {
          if (margin[i] !== indent[i]) {
            margin = margin.slice(0, i);
            break;
          }
        }
      }
    }
    if (margin) {
      text = text.replace(new RegExp("^" + margin, "mg"), "");
    }
    return text;
  };
  var wordsep_simple_re = /([\t\n\x0b\x0c\r ]+)/;

  class TextWrapper {
    constructor(options = {}) {
      let {
        width = 70,
        initial_indent = "",
        subsequent_indent = "",
        expand_tabs = true,
        replace_whitespace = true,
        fix_sentence_endings = false,
        break_long_words = true,
        drop_whitespace = true,
        break_on_hyphens = true,
        tabsize = 8,
        max_lines = undefined,
        placeholder = " [...]"
      } = options;
      this.width = width;
      this.initial_indent = initial_indent;
      this.subsequent_indent = subsequent_indent;
      this.expand_tabs = expand_tabs;
      this.replace_whitespace = replace_whitespace;
      this.fix_sentence_endings = fix_sentence_endings;
      this.break_long_words = break_long_words;
      this.drop_whitespace = drop_whitespace;
      this.break_on_hyphens = break_on_hyphens;
      this.tabsize = tabsize;
      this.max_lines = max_lines;
      this.placeholder = placeholder;
    }
    _munge_whitespace(text) {
      if (this.expand_tabs) {
        text = text.replace(/\t/g, " ".repeat(this.tabsize));
      }
      if (this.replace_whitespace) {
        text = text.replace(/[\t\n\x0b\x0c\r]/g, " ");
      }
      return text;
    }
    _split(text) {
      let chunks = text.split(wordsep_simple_re);
      chunks = chunks.filter(Boolean);
      return chunks;
    }
    _handle_long_word(reversed_chunks, cur_line, cur_len, width) {
      let space_left;
      if (width < 1) {
        space_left = 1;
      } else {
        space_left = width - cur_len;
      }
      if (this.break_long_words) {
        cur_line.push(reversed_chunks[reversed_chunks.length - 1].slice(0, space_left));
        reversed_chunks[reversed_chunks.length - 1] = reversed_chunks[reversed_chunks.length - 1].slice(space_left);
      } else if (!cur_line) {
        cur_line.push(...reversed_chunks.pop());
      }
    }
    _wrap_chunks(chunks) {
      let lines = [];
      let indent;
      if (this.width <= 0) {
        throw Error(`invalid width ${this.width} (must be > 0)`);
      }
      if (this.max_lines !== undefined) {
        if (this.max_lines > 1) {
          indent = this.subsequent_indent;
        } else {
          indent = this.initial_indent;
        }
        if (indent.length + this.placeholder.trimStart().length > this.width) {
          throw Error("placeholder too large for max width");
        }
      }
      chunks = chunks.reverse();
      while (chunks.length > 0) {
        let cur_line = [];
        let cur_len = 0;
        let indent2;
        if (lines) {
          indent2 = this.subsequent_indent;
        } else {
          indent2 = this.initial_indent;
        }
        let width = this.width - indent2.length;
        if (this.drop_whitespace && chunks[chunks.length - 1].trim() === "" && lines.length > 0) {
          chunks.pop();
        }
        while (chunks.length > 0) {
          let l = chunks[chunks.length - 1].length;
          if (cur_len + l <= width) {
            cur_line.push(chunks.pop());
            cur_len += l;
          } else {
            break;
          }
        }
        if (chunks.length && chunks[chunks.length - 1].length > width) {
          this._handle_long_word(chunks, cur_line, cur_len, width);
          cur_len = cur_line.map((l) => l.length).reduce((a, b) => a + b, 0);
        }
        if (this.drop_whitespace && cur_line.length > 0 && cur_line[cur_line.length - 1].trim() === "") {
          cur_len -= cur_line[cur_line.length - 1].length;
          cur_line.pop();
        }
        if (cur_line) {
          if (this.max_lines === undefined || lines.length + 1 < this.max_lines || (chunks.length === 0 || this.drop_whitespace && chunks.length === 1 && !chunks[0].trim()) && cur_len <= width) {
            lines.push(indent2 + cur_line.join(""));
          } else {
            let had_break = false;
            while (cur_line) {
              if (cur_line[cur_line.length - 1].trim() && cur_len + this.placeholder.length <= width) {
                cur_line.push(this.placeholder);
                lines.push(indent2 + cur_line.join(""));
                had_break = true;
                break;
              }
              cur_len -= cur_line[-1].length;
              cur_line.pop();
            }
            if (!had_break) {
              if (lines) {
                let prev_line = lines[lines.length - 1].trimEnd();
                if (prev_line.length + this.placeholder.length <= this.width) {
                  lines[lines.length - 1] = prev_line + this.placeholder;
                  break;
                }
              }
              lines.push(indent2 + this.placeholder.lstrip());
            }
            break;
          }
        }
      }
      return lines;
    }
    _split_chunks(text) {
      text = this._munge_whitespace(text);
      return this._split(text);
    }
    wrap(text) {
      let chunks = this._split_chunks(text);
      return this._wrap_chunks(chunks);
    }
    fill(text) {
      return this.wrap(text).join("\n");
    }
  }
  var _whitespace_only_re = /^[ \t]+$/mg;
  var _leading_whitespace_re = /(^[ \t]*)(?:[^ \t\n])/mg;
  module.exports = { wrap, fill, dedent };
});

// /home/dano/repos/personal/js-utils/node_modules/argparse/argparse.js
var require_argparse = __commonJS((exports, module) => {
  var get_argv = function() {
    return process.argv.slice(1);
  };
  var get_terminal_size = function() {
    return {
      columns: +process.env.COLUMNS || process.stdout.columns || 80
    };
  };
  var hasattr = function(object2, name) {
    return Object.prototype.hasOwnProperty.call(object2, name);
  };
  var getattr = function(object2, name, value) {
    return hasattr(object2, name) ? object2[name] : value;
  };
  var setattr = function(object2, name, value) {
    object2[name] = value;
  };
  var setdefault = function(object2, name, value) {
    if (!hasattr(object2, name))
      object2[name] = value;
    return object2[name];
  };
  var delattr = function(object2, name) {
    delete object2[name];
  };
  var range = function(from, to, step = 1) {
    if (arguments.length === 1)
      [to, from] = [from, 0];
    if (typeof from !== "number" || typeof to !== "number" || typeof step !== "number") {
      throw new TypeError("argument cannot be interpreted as an integer");
    }
    if (step === 0)
      throw new TypeError("range() arg 3 must not be zero");
    let result = [];
    if (step > 0) {
      for (let i = from;i < to; i += step)
        result.push(i);
    } else {
      for (let i = from;i > to; i += step)
        result.push(i);
    }
    return result;
  };
  var splitlines = function(str, keepends = false) {
    let result;
    if (!keepends) {
      result = str.split(/\r\n|[\n\r\v\f\x1c\x1d\x1e\x85\u2028\u2029]/);
    } else {
      result = [];
      let parts = str.split(/(\r\n|[\n\r\v\f\x1c\x1d\x1e\x85\u2028\u2029])/);
      for (let i = 0;i < parts.length; i += 2) {
        result.push(parts[i] + (i + 1 < parts.length ? parts[i + 1] : ""));
      }
    }
    if (!result[result.length - 1])
      result.pop();
    return result;
  };
  var _string_lstrip = function(string2, prefix_chars) {
    let idx = 0;
    while (idx < string2.length && prefix_chars.includes(string2[idx]))
      idx++;
    return idx ? string2.slice(idx) : string2;
  };
  var _string_split = function(string2, sep, maxsplit) {
    let result = string2.split(sep);
    if (result.length > maxsplit) {
      result = result.slice(0, maxsplit).concat([result.slice(maxsplit).join(sep)]);
    }
    return result;
  };
  var _array_equal = function(array1, array2) {
    if (array1.length !== array2.length)
      return false;
    for (let i = 0;i < array1.length; i++) {
      if (array1[i] !== array2[i])
        return false;
    }
    return true;
  };
  var _array_remove = function(array, item) {
    let idx = array.indexOf(item);
    if (idx === -1)
      throw new TypeError(sub("%r not in list", item));
    array.splice(idx, 1);
  };
  var _choices_to_array = function(choices) {
    if (choices === undefined) {
      return [];
    } else if (Array.isArray(choices)) {
      return choices;
    } else if (choices !== null && typeof choices[Symbol.iterator] === "function") {
      return Array.from(choices);
    } else if (typeof choices === "object" && choices !== null) {
      return Object.keys(choices);
    } else {
      throw new Error(sub("invalid choices value: %r", choices));
    }
  };
  var _callable = function(cls) {
    let result = {
      [cls.name]: function(...args2) {
        let this_class = new.target === result || !new.target;
        return Reflect.construct(cls, args2, this_class ? cls : new.target);
      }
    };
    result[cls.name].prototype = cls.prototype;
    cls.prototype[Symbol.toStringTag] = cls.name;
    return result[cls.name];
  };
  var _alias = function(object2, from, to) {
    try {
      let name = object2.constructor.name;
      Object.defineProperty(object2, from, {
        value: util.deprecate(object2[to], sub("%s.%s() is renamed to %s.%s()", name, from, name, to)),
        enumerable: false
      });
    } catch {
    }
  };
  var _camelcase_alias = function(_class) {
    for (let name of Object.getOwnPropertyNames(_class.prototype)) {
      let camelcase = name.replace(/\w_[a-z]/g, (s) => s[0] + s[2].toUpperCase());
      if (camelcase !== name)
        _alias(_class.prototype, camelcase, name);
    }
    return _class;
  };
  var _to_legacy_name = function(key) {
    key = key.replace(/\w_[a-z]/g, (s) => s[0] + s[2].toUpperCase());
    if (key === "default")
      key = "defaultValue";
    if (key === "const")
      key = "constant";
    return key;
  };
  var _to_new_name = function(key) {
    if (key === "defaultValue")
      key = "default";
    if (key === "constant")
      key = "const";
    key = key.replace(/[A-Z]/g, (c) => "_" + c.toLowerCase());
    return key;
  };
  var _parse_opts = function(args2, descriptor) {
    function get_name() {
      let stack = new Error().stack.split("\n").map((x) => x.match(/^    at (.*) \(.*\)$/)).filter(Boolean).map((m) => m[1]).map((fn) => fn.match(/[^ .]*$/)[0]);
      if (stack.length && stack[0] === get_name.name)
        stack.shift();
      if (stack.length && stack[0] === _parse_opts.name)
        stack.shift();
      return stack.length ? stack[0] : "";
    }
    args2 = Array.from(args2);
    let kwargs = {};
    let result = [];
    let last_opt = args2.length && args2[args2.length - 1];
    if (typeof last_opt === "object" && last_opt !== null && !Array.isArray(last_opt) && (!last_opt.constructor || last_opt.constructor.name === "Object")) {
      kwargs = Object.assign({}, args2.pop());
    }
    let renames = [];
    for (let key of Object.keys(descriptor)) {
      let old_name = _to_legacy_name(key);
      if (old_name !== key && old_name in kwargs) {
        if (key in kwargs) {
        } else {
          kwargs[key] = kwargs[old_name];
        }
        renames.push([old_name, key]);
        delete kwargs[old_name];
      }
    }
    if (renames.length) {
      let name = get_name();
      deprecate("camelcase_" + name, sub("%s(): following options are renamed: %s", name, renames.map(([a, b]) => sub("%r -> %r", a, b))));
    }
    let missing_positionals = [];
    let positional_count = args2.length;
    for (let [key, def] of Object.entries(descriptor)) {
      if (key[0] === "*") {
        if (key.length > 0 && key[1] === "*") {
          let renames2 = [];
          for (let key2 of Object.keys(kwargs)) {
            let new_name = _to_new_name(key2);
            if (new_name !== key2 && key2 in kwargs) {
              if (new_name in kwargs) {
              } else {
                kwargs[new_name] = kwargs[key2];
              }
              renames2.push([key2, new_name]);
              delete kwargs[key2];
            }
          }
          if (renames2.length) {
            let name = get_name();
            deprecate("camelcase_" + name, sub("%s(): following options are renamed: %s", name, renames2.map(([a, b]) => sub("%r -> %r", a, b))));
          }
          result.push(kwargs);
          kwargs = {};
        } else {
          result.push(args2);
          args2 = [];
        }
      } else if (key in kwargs && args2.length > 0) {
        throw new TypeError(sub("%s() got multiple values for argument %r", get_name(), key));
      } else if (key in kwargs) {
        result.push(kwargs[key]);
        delete kwargs[key];
      } else if (args2.length > 0) {
        result.push(args2.shift());
      } else if (def !== no_default) {
        result.push(def);
      } else {
        missing_positionals.push(key);
      }
    }
    if (Object.keys(kwargs).length) {
      throw new TypeError(sub("%s() got an unexpected keyword argument %r", get_name(), Object.keys(kwargs)[0]));
    }
    if (args2.length) {
      let from = Object.entries(descriptor).filter(([k, v]) => k[0] !== "*" && v !== no_default).length;
      let to = Object.entries(descriptor).filter(([k]) => k[0] !== "*").length;
      throw new TypeError(sub("%s() takes %s positional argument%s but %s %s given", get_name(), from === to ? sub("from %s to %s", from, to) : to, from === to && to === 1 ? "" : "s", positional_count, positional_count === 1 ? "was" : "were"));
    }
    if (missing_positionals.length) {
      let strs = missing_positionals.map(repr);
      if (strs.length > 1)
        strs[strs.length - 1] = "and " + strs[strs.length - 1];
      let str_joined = strs.join(strs.length === 2 ? "" : ", ");
      throw new TypeError(sub("%s() missing %i required positional argument%s: %s", get_name(), strs.length, strs.length === 1 ? "" : "s", str_joined));
    }
    return result;
  };
  var deprecate = function(id, string2) {
    _deprecations[id] = _deprecations[id] || util.deprecate(() => {
    }, string2);
    _deprecations[id]();
  };
  var _AttributeHolder = function(cls = Object) {
    return class _AttributeHolder2 extends cls {
      [util.inspect.custom]() {
        let type_name = this.constructor.name;
        let arg_strings = [];
        let star_args = {};
        for (let arg of this._get_args()) {
          arg_strings.push(repr(arg));
        }
        for (let [name, value] of this._get_kwargs()) {
          if (/^[a-z_][a-z0-9_$]*$/i.test(name)) {
            arg_strings.push(sub("%s=%r", name, value));
          } else {
            star_args[name] = value;
          }
        }
        if (Object.keys(star_args).length) {
          arg_strings.push(sub("**%s", repr(star_args)));
        }
        return sub("%s(%s)", type_name, arg_strings.join(", "));
      }
      toString() {
        return this[util.inspect.custom]();
      }
      _get_kwargs() {
        return Object.entries(this);
      }
      _get_args() {
        return [];
      }
    };
  };
  var _copy_items = function(items) {
    if (items === undefined) {
      return [];
    }
    return items.slice(0);
  };
  var _get_action_name = function(argument) {
    if (argument === undefined) {
      return;
    } else if (argument.option_strings.length) {
      return argument.option_strings.join("/");
    } else if (![undefined, SUPPRESS].includes(argument.metavar)) {
      return argument.metavar;
    } else if (![undefined, SUPPRESS].includes(argument.dest)) {
      return argument.dest;
    } else {
      return;
    }
  };
  var SUPPRESS = "==SUPPRESS==";
  var OPTIONAL = "?";
  var ZERO_OR_MORE = "*";
  var ONE_OR_MORE = "+";
  var PARSER = "A...";
  var REMAINDER = "...";
  var _UNRECOGNIZED_ARGS_ATTR = "_unrecognized_args";
  var assert2 = __require("assert");
  var util = __require("util");
  var fs = __require("fs");
  var sub = require_sub();
  var path = __require("path");
  var repr = util.inspect;
  var no_default = Symbol("no_default_value");
  var _deprecations = {};
  var HelpFormatter = _camelcase_alias(_callable(class HelpFormatter2 {
    constructor() {
      let [
        prog,
        indent_increment,
        max_help_position,
        width
      ] = _parse_opts(arguments, {
        prog: no_default,
        indent_increment: 2,
        max_help_position: 24,
        width: undefined
      });
      if (width === undefined) {
        width = get_terminal_size().columns;
        width -= 2;
      }
      this._prog = prog;
      this._indent_increment = indent_increment;
      this._max_help_position = Math.min(max_help_position, Math.max(width - 20, indent_increment * 2));
      this._width = width;
      this._current_indent = 0;
      this._level = 0;
      this._action_max_length = 0;
      this._root_section = this._Section(this, undefined);
      this._current_section = this._root_section;
      this._whitespace_matcher = /[ \t\n\r\f\v]+/g;
      this._long_break_matcher = /\n\n\n+/g;
    }
    _indent() {
      this._current_indent += this._indent_increment;
      this._level += 1;
    }
    _dedent() {
      this._current_indent -= this._indent_increment;
      assert2(this._current_indent >= 0, "Indent decreased below 0.");
      this._level -= 1;
    }
    _add_item(func, args2) {
      this._current_section.items.push([func, args2]);
    }
    start_section(heading) {
      this._indent();
      let section = this._Section(this, this._current_section, heading);
      this._add_item(section.format_help.bind(section), []);
      this._current_section = section;
    }
    end_section() {
      this._current_section = this._current_section.parent;
      this._dedent();
    }
    add_text(text) {
      if (text !== SUPPRESS && text !== undefined) {
        this._add_item(this._format_text.bind(this), [text]);
      }
    }
    add_usage(usage, actions, groups, prefix = undefined) {
      if (usage !== SUPPRESS) {
        let args2 = [usage, actions, groups, prefix];
        this._add_item(this._format_usage.bind(this), args2);
      }
    }
    add_argument(action) {
      if (action.help !== SUPPRESS) {
        let invocations = [this._format_action_invocation(action)];
        for (let subaction of this._iter_indented_subactions(action)) {
          invocations.push(this._format_action_invocation(subaction));
        }
        let invocation_length = Math.max(...invocations.map((invocation) => invocation.length));
        let action_length = invocation_length + this._current_indent;
        this._action_max_length = Math.max(this._action_max_length, action_length);
        this._add_item(this._format_action.bind(this), [action]);
      }
    }
    add_arguments(actions) {
      for (let action of actions) {
        this.add_argument(action);
      }
    }
    format_help() {
      let help = this._root_section.format_help();
      if (help) {
        help = help.replace(this._long_break_matcher, "\n\n");
        help = help.replace(/^\n+|\n+$/g, "") + "\n";
      }
      return help;
    }
    _join_parts(part_strings) {
      return part_strings.filter((part) => part && part !== SUPPRESS).join("");
    }
    _format_usage(usage, actions, groups, prefix) {
      if (prefix === undefined) {
        prefix = "usage: ";
      }
      if (usage !== undefined) {
        usage = sub(usage, { prog: this._prog });
      } else if (usage === undefined && !actions.length) {
        usage = sub("%(prog)s", { prog: this._prog });
      } else if (usage === undefined) {
        let prog = sub("%(prog)s", { prog: this._prog });
        let optionals = [];
        let positionals = [];
        for (let action of actions) {
          if (action.option_strings.length) {
            optionals.push(action);
          } else {
            positionals.push(action);
          }
        }
        let action_usage = this._format_actions_usage([].concat(optionals).concat(positionals), groups);
        usage = [prog, action_usage].map(String).join(" ");
        let text_width = this._width - this._current_indent;
        if (prefix.length + usage.length > text_width) {
          let part_regexp = /\(.*?\)+(?=\s|$)|\[.*?\]+(?=\s|$)|\S+/g;
          let opt_usage = this._format_actions_usage(optionals, groups);
          let pos_usage = this._format_actions_usage(positionals, groups);
          let opt_parts = opt_usage.match(part_regexp) || [];
          let pos_parts = pos_usage.match(part_regexp) || [];
          assert2(opt_parts.join(" ") === opt_usage);
          assert2(pos_parts.join(" ") === pos_usage);
          let get_lines = (parts, indent, prefix2 = undefined) => {
            let lines2 = [];
            let line = [];
            let line_len;
            if (prefix2 !== undefined) {
              line_len = prefix2.length - 1;
            } else {
              line_len = indent.length - 1;
            }
            for (let part of parts) {
              if (line_len + 1 + part.length > text_width && line) {
                lines2.push(indent + line.join(" "));
                line = [];
                line_len = indent.length - 1;
              }
              line.push(part);
              line_len += part.length + 1;
            }
            if (line.length) {
              lines2.push(indent + line.join(" "));
            }
            if (prefix2 !== undefined) {
              lines2[0] = lines2[0].slice(indent.length);
            }
            return lines2;
          };
          let lines;
          if (prefix.length + prog.length <= 0.75 * text_width) {
            let indent = " ".repeat(prefix.length + prog.length + 1);
            if (opt_parts.length) {
              lines = get_lines([prog].concat(opt_parts), indent, prefix);
              lines = lines.concat(get_lines(pos_parts, indent));
            } else if (pos_parts.length) {
              lines = get_lines([prog].concat(pos_parts), indent, prefix);
            } else {
              lines = [prog];
            }
          } else {
            let indent = " ".repeat(prefix.length);
            let parts = [].concat(opt_parts).concat(pos_parts);
            lines = get_lines(parts, indent);
            if (lines.length > 1) {
              lines = [];
              lines = lines.concat(get_lines(opt_parts, indent));
              lines = lines.concat(get_lines(pos_parts, indent));
            }
            lines = [prog].concat(lines);
          }
          usage = lines.join("\n");
        }
      }
      return sub("%s%s\n\n", prefix, usage);
    }
    _format_actions_usage(actions, groups) {
      let group_actions = new Set;
      let inserts = {};
      for (let group of groups) {
        let start = actions.indexOf(group._group_actions[0]);
        if (start === -1) {
          continue;
        } else {
          let end = start + group._group_actions.length;
          if (_array_equal(actions.slice(start, end), group._group_actions)) {
            for (let action of group._group_actions) {
              group_actions.add(action);
            }
            if (!group.required) {
              if (start in inserts) {
                inserts[start] += " [";
              } else {
                inserts[start] = "[";
              }
              if (end in inserts) {
                inserts[end] += "]";
              } else {
                inserts[end] = "]";
              }
            } else {
              if (start in inserts) {
                inserts[start] += " (";
              } else {
                inserts[start] = "(";
              }
              if (end in inserts) {
                inserts[end] += ")";
              } else {
                inserts[end] = ")";
              }
            }
            for (let i of range(start + 1, end)) {
              inserts[i] = "|";
            }
          }
        }
      }
      let parts = [];
      for (let [i, action] of Object.entries(actions)) {
        if (action.help === SUPPRESS) {
          parts.push(undefined);
          if (inserts[+i] === "|") {
            delete inserts[+i];
          } else if (inserts[+i + 1] === "|") {
            delete inserts[+i + 1];
          }
        } else if (!action.option_strings.length) {
          let default_value = this._get_default_metavar_for_positional(action);
          let part = this._format_args(action, default_value);
          if (group_actions.has(action)) {
            if (part[0] === "[" && part[part.length - 1] === "]") {
              part = part.slice(1, -1);
            }
          }
          parts.push(part);
        } else {
          let option_string = action.option_strings[0];
          let part;
          if (action.nargs === 0) {
            part = action.format_usage();
          } else {
            let default_value = this._get_default_metavar_for_optional(action);
            let args_string = this._format_args(action, default_value);
            part = sub("%s %s", option_string, args_string);
          }
          if (!action.required && !group_actions.has(action)) {
            part = sub("[%s]", part);
          }
          parts.push(part);
        }
      }
      for (let i of Object.keys(inserts).map(Number).sort((a, b) => b - a)) {
        parts.splice(+i, 0, inserts[+i]);
      }
      let text = parts.filter(Boolean).join(" ");
      text = text.replace(/([\[(]) /g, "$1");
      text = text.replace(/ ([\])])/g, "$1");
      text = text.replace(/[\[(] *[\])]/g, "");
      text = text.replace(/\(([^|]*)\)/g, "$1", text);
      text = text.trim();
      return text;
    }
    _format_text(text) {
      if (text.includes("%(prog)")) {
        text = sub(text, { prog: this._prog });
      }
      let text_width = Math.max(this._width - this._current_indent, 11);
      let indent = " ".repeat(this._current_indent);
      return this._fill_text(text, text_width, indent) + "\n\n";
    }
    _format_action(action) {
      let help_position = Math.min(this._action_max_length + 2, this._max_help_position);
      let help_width = Math.max(this._width - help_position, 11);
      let action_width = help_position - this._current_indent - 2;
      let action_header = this._format_action_invocation(action);
      let indent_first;
      if (!action.help) {
        let tup = [this._current_indent, "", action_header];
        action_header = sub("%*s%s\n", ...tup);
      } else if (action_header.length <= action_width) {
        let tup = [this._current_indent, "", action_width, action_header];
        action_header = sub("%*s%-*s  ", ...tup);
        indent_first = 0;
      } else {
        let tup = [this._current_indent, "", action_header];
        action_header = sub("%*s%s\n", ...tup);
        indent_first = help_position;
      }
      let parts = [action_header];
      if (action.help) {
        let help_text = this._expand_help(action);
        let help_lines = this._split_lines(help_text, help_width);
        parts.push(sub("%*s%s\n", indent_first, "", help_lines[0]));
        for (let line of help_lines.slice(1)) {
          parts.push(sub("%*s%s\n", help_position, "", line));
        }
      } else if (!action_header.endsWith("\n")) {
        parts.push("\n");
      }
      for (let subaction of this._iter_indented_subactions(action)) {
        parts.push(this._format_action(subaction));
      }
      return this._join_parts(parts);
    }
    _format_action_invocation(action) {
      if (!action.option_strings.length) {
        let default_value = this._get_default_metavar_for_positional(action);
        let metavar = this._metavar_formatter(action, default_value)(1)[0];
        return metavar;
      } else {
        let parts = [];
        if (action.nargs === 0) {
          parts = parts.concat(action.option_strings);
        } else {
          let default_value = this._get_default_metavar_for_optional(action);
          let args_string = this._format_args(action, default_value);
          for (let option_string of action.option_strings) {
            parts.push(sub("%s %s", option_string, args_string));
          }
        }
        return parts.join(", ");
      }
    }
    _metavar_formatter(action, default_metavar) {
      let result;
      if (action.metavar !== undefined) {
        result = action.metavar;
      } else if (action.choices !== undefined) {
        let choice_strs = _choices_to_array(action.choices).map(String);
        result = sub("{%s}", choice_strs.join(","));
      } else {
        result = default_metavar;
      }
      function format(tuple_size) {
        if (Array.isArray(result)) {
          return result;
        } else {
          return Array(tuple_size).fill(result);
        }
      }
      return format;
    }
    _format_args(action, default_metavar) {
      let get_metavar = this._metavar_formatter(action, default_metavar);
      let result;
      if (action.nargs === undefined) {
        result = sub("%s", ...get_metavar(1));
      } else if (action.nargs === OPTIONAL) {
        result = sub("[%s]", ...get_metavar(1));
      } else if (action.nargs === ZERO_OR_MORE) {
        let metavar = get_metavar(1);
        if (metavar.length === 2) {
          result = sub("[%s [%s ...]]", ...metavar);
        } else {
          result = sub("[%s ...]", ...metavar);
        }
      } else if (action.nargs === ONE_OR_MORE) {
        result = sub("%s [%s ...]", ...get_metavar(2));
      } else if (action.nargs === REMAINDER) {
        result = "...";
      } else if (action.nargs === PARSER) {
        result = sub("%s ...", ...get_metavar(1));
      } else if (action.nargs === SUPPRESS) {
        result = "";
      } else {
        let formats;
        try {
          formats = range(action.nargs).map(() => "%s");
        } catch (err) {
          throw new TypeError("invalid nargs value");
        }
        result = sub(formats.join(" "), ...get_metavar(action.nargs));
      }
      return result;
    }
    _expand_help(action) {
      let params = Object.assign({ prog: this._prog }, action);
      for (let name of Object.keys(params)) {
        if (params[name] === SUPPRESS) {
          delete params[name];
        }
      }
      for (let name of Object.keys(params)) {
        if (params[name] && params[name].name) {
          params[name] = params[name].name;
        }
      }
      if (params.choices !== undefined) {
        let choices_str = _choices_to_array(params.choices).map(String).join(", ");
        params.choices = choices_str;
      }
      for (let key of Object.keys(params)) {
        let old_name = _to_legacy_name(key);
        if (old_name !== key) {
          params[old_name] = params[key];
        }
      }
      return sub(this._get_help_string(action), params);
    }
    *_iter_indented_subactions(action) {
      if (typeof action._get_subactions === "function") {
        this._indent();
        yield* action._get_subactions();
        this._dedent();
      }
    }
    _split_lines(text, width) {
      text = text.replace(this._whitespace_matcher, " ").trim();
      let textwrap = require_textwrap();
      return textwrap.wrap(text, { width });
    }
    _fill_text(text, width, indent) {
      text = text.replace(this._whitespace_matcher, " ").trim();
      let textwrap = require_textwrap();
      return textwrap.fill(text, {
        width,
        initial_indent: indent,
        subsequent_indent: indent
      });
    }
    _get_help_string(action) {
      return action.help;
    }
    _get_default_metavar_for_optional(action) {
      return action.dest.toUpperCase();
    }
    _get_default_metavar_for_positional(action) {
      return action.dest;
    }
  }));
  HelpFormatter.prototype._Section = _callable(class _Section {
    constructor(formatter, parent, heading = undefined) {
      this.formatter = formatter;
      this.parent = parent;
      this.heading = heading;
      this.items = [];
    }
    format_help() {
      if (this.parent !== undefined) {
        this.formatter._indent();
      }
      let item_help = this.formatter._join_parts(this.items.map(([func, args2]) => func.apply(null, args2)));
      if (this.parent !== undefined) {
        this.formatter._dedent();
      }
      if (!item_help) {
        return "";
      }
      let heading;
      if (this.heading !== SUPPRESS && this.heading !== undefined) {
        let current_indent = this.formatter._current_indent;
        heading = sub("%*s%s:\n", current_indent, "", this.heading);
      } else {
        heading = "";
      }
      return this.formatter._join_parts(["\n", heading, item_help, "\n"]);
    }
  });
  var RawDescriptionHelpFormatter = _camelcase_alias(_callable(class RawDescriptionHelpFormatter2 extends HelpFormatter {
    _fill_text(text, width, indent) {
      return splitlines(text, true).map((line) => indent + line).join("");
    }
  }));
  var RawTextHelpFormatter = _camelcase_alias(_callable(class RawTextHelpFormatter2 extends RawDescriptionHelpFormatter {
    _split_lines(text) {
      return splitlines(text);
    }
  }));
  var ArgumentDefaultsHelpFormatter = _camelcase_alias(_callable(class ArgumentDefaultsHelpFormatter2 extends HelpFormatter {
    _get_help_string(action) {
      let help = action.help;
      if (!action.help.includes("%(default)") && !action.help.includes("%(defaultValue)")) {
        if (action.default !== SUPPRESS) {
          let defaulting_nargs = [OPTIONAL, ZERO_OR_MORE];
          if (action.option_strings.length || defaulting_nargs.includes(action.nargs)) {
            help += " (default: %(default)s)";
          }
        }
      }
      return help;
    }
  }));
  var MetavarTypeHelpFormatter = _camelcase_alias(_callable(class MetavarTypeHelpFormatter2 extends HelpFormatter {
    _get_default_metavar_for_optional(action) {
      return typeof action.type === "function" ? action.type.name : action.type;
    }
    _get_default_metavar_for_positional(action) {
      return typeof action.type === "function" ? action.type.name : action.type;
    }
  }));
  var ArgumentError = _callable(class ArgumentError2 extends Error {
    constructor(argument, message) {
      super();
      this.name = "ArgumentError";
      this._argument_name = _get_action_name(argument);
      this._message = message;
      this.message = this.str();
    }
    str() {
      let format;
      if (this._argument_name === undefined) {
        format = "%(message)s";
      } else {
        format = "argument %(argument_name)s: %(message)s";
      }
      return sub(format, {
        message: this._message,
        argument_name: this._argument_name
      });
    }
  });
  var ArgumentTypeError = _callable(class ArgumentTypeError2 extends Error {
    constructor(message) {
      super(message);
      this.name = "ArgumentTypeError";
    }
  });
  var Action = _camelcase_alias(_callable(class Action2 extends _AttributeHolder(Function) {
    constructor() {
      let [
        option_strings,
        dest,
        nargs,
        const_value,
        default_value,
        type,
        choices,
        required,
        help,
        metavar
      ] = _parse_opts(arguments, {
        option_strings: no_default,
        dest: no_default,
        nargs: undefined,
        const: undefined,
        default: undefined,
        type: undefined,
        choices: undefined,
        required: false,
        help: undefined,
        metavar: undefined
      });
      super("return arguments.callee.call.apply(arguments.callee, arguments)");
      this.option_strings = option_strings;
      this.dest = dest;
      this.nargs = nargs;
      this.const = const_value;
      this.default = default_value;
      this.type = type;
      this.choices = choices;
      this.required = required;
      this.help = help;
      this.metavar = metavar;
    }
    _get_kwargs() {
      let names = [
        "option_strings",
        "dest",
        "nargs",
        "const",
        "default",
        "type",
        "choices",
        "help",
        "metavar"
      ];
      return names.map((name) => [name, getattr(this, name)]);
    }
    format_usage() {
      return this.option_strings[0];
    }
    call() {
      throw new Error(".call() not defined");
    }
  }));
  var BooleanOptionalAction = _camelcase_alias(_callable(class BooleanOptionalAction2 extends Action {
    constructor() {
      let [
        option_strings,
        dest,
        default_value,
        type,
        choices,
        required,
        help,
        metavar
      ] = _parse_opts(arguments, {
        option_strings: no_default,
        dest: no_default,
        default: undefined,
        type: undefined,
        choices: undefined,
        required: false,
        help: undefined,
        metavar: undefined
      });
      let _option_strings = [];
      for (let option_string of option_strings) {
        _option_strings.push(option_string);
        if (option_string.startsWith("--")) {
          option_string = "--no-" + option_string.slice(2);
          _option_strings.push(option_string);
        }
      }
      if (help !== undefined && default_value !== undefined) {
        help += ` (default: ${default_value})`;
      }
      super({
        option_strings: _option_strings,
        dest,
        nargs: 0,
        default: default_value,
        type,
        choices,
        required,
        help,
        metavar
      });
    }
    call(parser, namespace, values, option_string = undefined) {
      if (this.option_strings.includes(option_string)) {
        setattr(namespace, this.dest, !option_string.startsWith("--no-"));
      }
    }
    format_usage() {
      return this.option_strings.join(" | ");
    }
  }));
  var _StoreAction = _callable(class _StoreAction2 extends Action {
    constructor() {
      let [
        option_strings,
        dest,
        nargs,
        const_value,
        default_value,
        type,
        choices,
        required,
        help,
        metavar
      ] = _parse_opts(arguments, {
        option_strings: no_default,
        dest: no_default,
        nargs: undefined,
        const: undefined,
        default: undefined,
        type: undefined,
        choices: undefined,
        required: false,
        help: undefined,
        metavar: undefined
      });
      if (nargs === 0) {
        throw new TypeError("nargs for store actions must be != 0; if you have nothing to store, actions such as store true or store const may be more appropriate");
      }
      if (const_value !== undefined && nargs !== OPTIONAL) {
        throw new TypeError(sub("nargs must be %r to supply const", OPTIONAL));
      }
      super({
        option_strings,
        dest,
        nargs,
        const: const_value,
        default: default_value,
        type,
        choices,
        required,
        help,
        metavar
      });
    }
    call(parser, namespace, values) {
      setattr(namespace, this.dest, values);
    }
  });
  var _StoreConstAction = _callable(class _StoreConstAction2 extends Action {
    constructor() {
      let [
        option_strings,
        dest,
        const_value,
        default_value,
        required,
        help
      ] = _parse_opts(arguments, {
        option_strings: no_default,
        dest: no_default,
        const: no_default,
        default: undefined,
        required: false,
        help: undefined,
        metavar: undefined
      });
      super({
        option_strings,
        dest,
        nargs: 0,
        const: const_value,
        default: default_value,
        required,
        help
      });
    }
    call(parser, namespace) {
      setattr(namespace, this.dest, this.const);
    }
  });
  var _StoreTrueAction = _callable(class _StoreTrueAction2 extends _StoreConstAction {
    constructor() {
      let [
        option_strings,
        dest,
        default_value,
        required,
        help
      ] = _parse_opts(arguments, {
        option_strings: no_default,
        dest: no_default,
        default: false,
        required: false,
        help: undefined
      });
      super({
        option_strings,
        dest,
        const: true,
        default: default_value,
        required,
        help
      });
    }
  });
  var _StoreFalseAction = _callable(class _StoreFalseAction2 extends _StoreConstAction {
    constructor() {
      let [
        option_strings,
        dest,
        default_value,
        required,
        help
      ] = _parse_opts(arguments, {
        option_strings: no_default,
        dest: no_default,
        default: true,
        required: false,
        help: undefined
      });
      super({
        option_strings,
        dest,
        const: false,
        default: default_value,
        required,
        help
      });
    }
  });
  var _AppendAction = _callable(class _AppendAction2 extends Action {
    constructor() {
      let [
        option_strings,
        dest,
        nargs,
        const_value,
        default_value,
        type,
        choices,
        required,
        help,
        metavar
      ] = _parse_opts(arguments, {
        option_strings: no_default,
        dest: no_default,
        nargs: undefined,
        const: undefined,
        default: undefined,
        type: undefined,
        choices: undefined,
        required: false,
        help: undefined,
        metavar: undefined
      });
      if (nargs === 0) {
        throw new TypeError("nargs for append actions must be != 0; if arg strings are not supplying the value to append, the append const action may be more appropriate");
      }
      if (const_value !== undefined && nargs !== OPTIONAL) {
        throw new TypeError(sub("nargs must be %r to supply const", OPTIONAL));
      }
      super({
        option_strings,
        dest,
        nargs,
        const: const_value,
        default: default_value,
        type,
        choices,
        required,
        help,
        metavar
      });
    }
    call(parser, namespace, values) {
      let items = getattr(namespace, this.dest, undefined);
      items = _copy_items(items);
      items.push(values);
      setattr(namespace, this.dest, items);
    }
  });
  var _AppendConstAction = _callable(class _AppendConstAction2 extends Action {
    constructor() {
      let [
        option_strings,
        dest,
        const_value,
        default_value,
        required,
        help,
        metavar
      ] = _parse_opts(arguments, {
        option_strings: no_default,
        dest: no_default,
        const: no_default,
        default: undefined,
        required: false,
        help: undefined,
        metavar: undefined
      });
      super({
        option_strings,
        dest,
        nargs: 0,
        const: const_value,
        default: default_value,
        required,
        help,
        metavar
      });
    }
    call(parser, namespace) {
      let items = getattr(namespace, this.dest, undefined);
      items = _copy_items(items);
      items.push(this.const);
      setattr(namespace, this.dest, items);
    }
  });
  var _CountAction = _callable(class _CountAction2 extends Action {
    constructor() {
      let [
        option_strings,
        dest,
        default_value,
        required,
        help
      ] = _parse_opts(arguments, {
        option_strings: no_default,
        dest: no_default,
        default: undefined,
        required: false,
        help: undefined
      });
      super({
        option_strings,
        dest,
        nargs: 0,
        default: default_value,
        required,
        help
      });
    }
    call(parser, namespace) {
      let count = getattr(namespace, this.dest, undefined);
      if (count === undefined) {
        count = 0;
      }
      setattr(namespace, this.dest, count + 1);
    }
  });
  var _HelpAction = _callable(class _HelpAction2 extends Action {
    constructor() {
      let [
        option_strings,
        dest,
        default_value,
        help
      ] = _parse_opts(arguments, {
        option_strings: no_default,
        dest: SUPPRESS,
        default: SUPPRESS,
        help: undefined
      });
      super({
        option_strings,
        dest,
        default: default_value,
        nargs: 0,
        help
      });
    }
    call(parser) {
      parser.print_help();
      parser.exit();
    }
  });
  var _VersionAction = _callable(class _VersionAction2 extends Action {
    constructor() {
      let [
        option_strings,
        version,
        dest,
        default_value,
        help
      ] = _parse_opts(arguments, {
        option_strings: no_default,
        version: undefined,
        dest: SUPPRESS,
        default: SUPPRESS,
        help: "show program's version number and exit"
      });
      super({
        option_strings,
        dest,
        default: default_value,
        nargs: 0,
        help
      });
      this.version = version;
    }
    call(parser) {
      let version = this.version;
      if (version === undefined) {
        version = parser.version;
      }
      let formatter = parser._get_formatter();
      formatter.add_text(version);
      parser._print_message(formatter.format_help(), process.stdout);
      parser.exit();
    }
  });
  var _SubParsersAction = _camelcase_alias(_callable(class _SubParsersAction2 extends Action {
    constructor() {
      let [
        option_strings,
        prog,
        parser_class,
        dest,
        required,
        help,
        metavar
      ] = _parse_opts(arguments, {
        option_strings: no_default,
        prog: no_default,
        parser_class: no_default,
        dest: SUPPRESS,
        required: false,
        help: undefined,
        metavar: undefined
      });
      let name_parser_map = {};
      super({
        option_strings,
        dest,
        nargs: PARSER,
        choices: name_parser_map,
        required,
        help,
        metavar
      });
      this._prog_prefix = prog;
      this._parser_class = parser_class;
      this._name_parser_map = name_parser_map;
      this._choices_actions = [];
    }
    add_parser() {
      let [
        name,
        kwargs
      ] = _parse_opts(arguments, {
        name: no_default,
        "**kwargs": no_default
      });
      if (kwargs.prog === undefined) {
        kwargs.prog = sub("%s %s", this._prog_prefix, name);
      }
      let aliases = getattr(kwargs, "aliases", []);
      delete kwargs.aliases;
      if ("help" in kwargs) {
        let help = kwargs.help;
        delete kwargs.help;
        let choice_action = this._ChoicesPseudoAction(name, aliases, help);
        this._choices_actions.push(choice_action);
      }
      let parser = new this._parser_class(kwargs);
      this._name_parser_map[name] = parser;
      for (let alias of aliases) {
        this._name_parser_map[alias] = parser;
      }
      return parser;
    }
    _get_subactions() {
      return this._choices_actions;
    }
    call(parser, namespace, values) {
      let parser_name = values[0];
      let arg_strings = values.slice(1);
      if (this.dest !== SUPPRESS) {
        setattr(namespace, this.dest, parser_name);
      }
      if (hasattr(this._name_parser_map, parser_name)) {
        parser = this._name_parser_map[parser_name];
      } else {
        let args2 = {
          parser_name,
          choices: this._name_parser_map.join(", ")
        };
        let msg = sub("unknown parser %(parser_name)r (choices: %(choices)s)", args2);
        throw new ArgumentError(this, msg);
      }
      let subnamespace;
      [subnamespace, arg_strings] = parser.parse_known_args(arg_strings, undefined);
      for (let [key, value] of Object.entries(subnamespace)) {
        setattr(namespace, key, value);
      }
      if (arg_strings.length) {
        setdefault(namespace, _UNRECOGNIZED_ARGS_ATTR, []);
        getattr(namespace, _UNRECOGNIZED_ARGS_ATTR).push(...arg_strings);
      }
    }
  }));
  _SubParsersAction.prototype._ChoicesPseudoAction = _callable(class _ChoicesPseudoAction extends Action {
    constructor(name, aliases, help) {
      let metavar = name, dest = name;
      if (aliases.length) {
        metavar += sub(" (%s)", aliases.join(", "));
      }
      super({ option_strings: [], dest, help, metavar });
    }
  });
  var _ExtendAction = _callable(class _ExtendAction2 extends _AppendAction {
    call(parser, namespace, values) {
      let items = getattr(namespace, this.dest, undefined);
      items = _copy_items(items);
      items = items.concat(values);
      setattr(namespace, this.dest, items);
    }
  });
  var FileType = _callable(class FileType2 extends Function {
    constructor() {
      let [
        flags,
        encoding,
        mode,
        autoClose,
        emitClose,
        start,
        end,
        highWaterMark,
        fs2
      ] = _parse_opts(arguments, {
        flags: "r",
        encoding: undefined,
        mode: undefined,
        autoClose: undefined,
        emitClose: undefined,
        start: undefined,
        end: undefined,
        highWaterMark: undefined,
        fs: undefined
      });
      super("return arguments.callee.call.apply(arguments.callee, arguments)");
      Object.defineProperty(this, "name", {
        get() {
          return sub("FileType(%r)", flags);
        }
      });
      this._flags = flags;
      this._options = {};
      if (encoding !== undefined)
        this._options.encoding = encoding;
      if (mode !== undefined)
        this._options.mode = mode;
      if (autoClose !== undefined)
        this._options.autoClose = autoClose;
      if (emitClose !== undefined)
        this._options.emitClose = emitClose;
      if (start !== undefined)
        this._options.start = start;
      if (end !== undefined)
        this._options.end = end;
      if (highWaterMark !== undefined)
        this._options.highWaterMark = highWaterMark;
      if (fs2 !== undefined)
        this._options.fs = fs2;
    }
    call(string2) {
      if (string2 === "-") {
        if (this._flags.includes("r")) {
          return process.stdin;
        } else if (this._flags.includes("w")) {
          return process.stdout;
        } else {
          let msg = sub('argument "-" with mode %r', this._flags);
          throw new TypeError(msg);
        }
      }
      let fd;
      try {
        fd = fs.openSync(string2, this._flags, this._options.mode);
      } catch (e) {
        let args2 = { filename: string2, error: e.message };
        let message = "can't open '%(filename)s': %(error)s";
        throw new ArgumentTypeError(sub(message, args2));
      }
      let options = Object.assign({ fd, flags: this._flags }, this._options);
      if (this._flags.includes("r")) {
        return fs.createReadStream(undefined, options);
      } else if (this._flags.includes("w")) {
        return fs.createWriteStream(undefined, options);
      } else {
        let msg = sub('argument "%s" with mode %r', string2, this._flags);
        throw new TypeError(msg);
      }
    }
    [util.inspect.custom]() {
      let args2 = [this._flags];
      let kwargs = Object.entries(this._options).map(([k, v]) => {
        if (k === "mode")
          v = { value: v, [util.inspect.custom]() {
            return "0o" + this.value.toString(8);
          } };
        return [k, v];
      });
      let args_str = [].concat(args2.filter((arg) => arg !== -1).map(repr)).concat(kwargs.filter(([, arg]) => arg !== undefined).map(([kw, arg]) => sub("%s=%r", kw, arg))).join(", ");
      return sub("%s(%s)", this.constructor.name, args_str);
    }
    toString() {
      return this[util.inspect.custom]();
    }
  });
  var Namespace = _callable(class Namespace2 extends _AttributeHolder() {
    constructor(options = {}) {
      super();
      Object.assign(this, options);
    }
  });
  Namespace.prototype[Symbol.toStringTag] = undefined;
  var _ActionsContainer = _camelcase_alias(_callable(class _ActionsContainer2 {
    constructor() {
      let [
        description,
        prefix_chars,
        argument_default,
        conflict_handler
      ] = _parse_opts(arguments, {
        description: no_default,
        prefix_chars: no_default,
        argument_default: no_default,
        conflict_handler: no_default
      });
      this.description = description;
      this.argument_default = argument_default;
      this.prefix_chars = prefix_chars;
      this.conflict_handler = conflict_handler;
      this._registries = {};
      this.register("action", undefined, _StoreAction);
      this.register("action", "store", _StoreAction);
      this.register("action", "store_const", _StoreConstAction);
      this.register("action", "store_true", _StoreTrueAction);
      this.register("action", "store_false", _StoreFalseAction);
      this.register("action", "append", _AppendAction);
      this.register("action", "append_const", _AppendConstAction);
      this.register("action", "count", _CountAction);
      this.register("action", "help", _HelpAction);
      this.register("action", "version", _VersionAction);
      this.register("action", "parsers", _SubParsersAction);
      this.register("action", "extend", _ExtendAction);
      ["storeConst", "storeTrue", "storeFalse", "appendConst"].forEach((old_name) => {
        let new_name = _to_new_name(old_name);
        this.register("action", old_name, util.deprecate(this._registry_get("action", new_name), sub('{action: "%s"} is renamed to {action: "%s"}', old_name, new_name)));
      });
      this._get_handler();
      this._actions = [];
      this._option_string_actions = {};
      this._action_groups = [];
      this._mutually_exclusive_groups = [];
      this._defaults = {};
      this._negative_number_matcher = /^-\d+$|^-\d*\.\d+$/;
      this._has_negative_number_optionals = [];
    }
    register(registry_name, value, object2) {
      let registry = setdefault(this._registries, registry_name, {});
      registry[value] = object2;
    }
    _registry_get(registry_name, value, default_value = undefined) {
      return getattr(this._registries[registry_name], value, default_value);
    }
    set_defaults(kwargs) {
      Object.assign(this._defaults, kwargs);
      for (let action of this._actions) {
        if (action.dest in kwargs) {
          action.default = kwargs[action.dest];
        }
      }
    }
    get_default(dest) {
      for (let action of this._actions) {
        if (action.dest === dest && action.default !== undefined) {
          return action.default;
        }
      }
      return this._defaults[dest];
    }
    add_argument() {
      let [
        args2,
        kwargs
      ] = _parse_opts(arguments, {
        "*args": no_default,
        "**kwargs": no_default
      });
      if (args2.length === 1 && Array.isArray(args2[0])) {
        args2 = args2[0];
        deprecate("argument-array", sub("use add_argument(%(args)s, {...}) instead of add_argument([ %(args)s ], { ... })", {
          args: args2.map(repr).join(", ")
        }));
      }
      let chars = this.prefix_chars;
      if (!args2.length || args2.length === 1 && !chars.includes(args2[0][0])) {
        if (args2.length && "dest" in kwargs) {
          throw new TypeError("dest supplied twice for positional argument");
        }
        kwargs = this._get_positional_kwargs(...args2, kwargs);
      } else {
        kwargs = this._get_optional_kwargs(...args2, kwargs);
      }
      if (!("default" in kwargs)) {
        let dest = kwargs.dest;
        if (dest in this._defaults) {
          kwargs.default = this._defaults[dest];
        } else if (this.argument_default !== undefined) {
          kwargs.default = this.argument_default;
        }
      }
      let action_class = this._pop_action_class(kwargs);
      if (typeof action_class !== "function") {
        throw new TypeError(sub('unknown action "%s"', action_class));
      }
      let action = new action_class(kwargs);
      let type_func = this._registry_get("type", action.type, action.type);
      if (typeof type_func !== "function") {
        throw new TypeError(sub("%r is not callable", type_func));
      }
      if (type_func === FileType) {
        throw new TypeError(sub("%r is a FileType class object, instance of it must be passed", type_func));
      }
      if ("_get_formatter" in this) {
        try {
          this._get_formatter()._format_args(action, undefined);
        } catch (err) {
          if (err instanceof TypeError && err.message !== "invalid nargs value") {
            throw new TypeError("length of metavar tuple does not match nargs");
          } else {
            throw err;
          }
        }
      }
      return this._add_action(action);
    }
    add_argument_group() {
      let group = _ArgumentGroup(this, ...arguments);
      this._action_groups.push(group);
      return group;
    }
    add_mutually_exclusive_group() {
      let group = _MutuallyExclusiveGroup(this, ...arguments);
      this._mutually_exclusive_groups.push(group);
      return group;
    }
    _add_action(action) {
      this._check_conflict(action);
      this._actions.push(action);
      action.container = this;
      for (let option_string of action.option_strings) {
        this._option_string_actions[option_string] = action;
      }
      for (let option_string of action.option_strings) {
        if (this._negative_number_matcher.test(option_string)) {
          if (!this._has_negative_number_optionals.length) {
            this._has_negative_number_optionals.push(true);
          }
        }
      }
      return action;
    }
    _remove_action(action) {
      _array_remove(this._actions, action);
    }
    _add_container_actions(container) {
      let title_group_map = {};
      for (let group of this._action_groups) {
        if (group.title in title_group_map) {
          let msg = "cannot merge actions - two groups are named %r";
          throw new TypeError(sub(msg, group.title));
        }
        title_group_map[group.title] = group;
      }
      let group_map = new Map;
      for (let group of container._action_groups) {
        if (!(group.title in title_group_map)) {
          title_group_map[group.title] = this.add_argument_group({
            title: group.title,
            description: group.description,
            conflict_handler: group.conflict_handler
          });
        }
        for (let action of group._group_actions) {
          group_map.set(action, title_group_map[group.title]);
        }
      }
      for (let group of container._mutually_exclusive_groups) {
        let mutex_group = this.add_mutually_exclusive_group({
          required: group.required
        });
        for (let action of group._group_actions) {
          group_map.set(action, mutex_group);
        }
      }
      for (let action of container._actions) {
        group_map.get(action)._add_action(action);
      }
    }
    _get_positional_kwargs() {
      let [
        dest,
        kwargs
      ] = _parse_opts(arguments, {
        dest: no_default,
        "**kwargs": no_default
      });
      if ("required" in kwargs) {
        let msg = "'required' is an invalid argument for positionals";
        throw new TypeError(msg);
      }
      if (![OPTIONAL, ZERO_OR_MORE].includes(kwargs.nargs)) {
        kwargs.required = true;
      }
      if (kwargs.nargs === ZERO_OR_MORE && !("default" in kwargs)) {
        kwargs.required = true;
      }
      return Object.assign(kwargs, { dest, option_strings: [] });
    }
    _get_optional_kwargs() {
      let [
        args2,
        kwargs
      ] = _parse_opts(arguments, {
        "*args": no_default,
        "**kwargs": no_default
      });
      let option_strings = [];
      let long_option_strings = [];
      let option_string;
      for (option_string of args2) {
        if (!this.prefix_chars.includes(option_string[0])) {
          let args3 = {
            option: option_string,
            prefix_chars: this.prefix_chars
          };
          let msg = "invalid option string %(option)r: must start with a character %(prefix_chars)r";
          throw new TypeError(sub(msg, args3));
        }
        option_strings.push(option_string);
        if (option_string.length > 1 && this.prefix_chars.includes(option_string[1])) {
          long_option_strings.push(option_string);
        }
      }
      let dest = kwargs.dest;
      delete kwargs.dest;
      if (dest === undefined) {
        let dest_option_string;
        if (long_option_strings.length) {
          dest_option_string = long_option_strings[0];
        } else {
          dest_option_string = option_strings[0];
        }
        dest = _string_lstrip(dest_option_string, this.prefix_chars);
        if (!dest) {
          let msg = "dest= is required for options like %r";
          throw new TypeError(sub(msg, option_string));
        }
        dest = dest.replace(/-/g, "_");
      }
      return Object.assign(kwargs, { dest, option_strings });
    }
    _pop_action_class(kwargs, default_value = undefined) {
      let action = getattr(kwargs, "action", default_value);
      delete kwargs.action;
      return this._registry_get("action", action, action);
    }
    _get_handler() {
      let handler_func_name = sub("_handle_conflict_%s", this.conflict_handler);
      if (typeof this[handler_func_name] === "function") {
        return this[handler_func_name];
      } else {
        let msg = "invalid conflict_resolution value: %r";
        throw new TypeError(sub(msg, this.conflict_handler));
      }
    }
    _check_conflict(action) {
      let confl_optionals = [];
      for (let option_string of action.option_strings) {
        if (hasattr(this._option_string_actions, option_string)) {
          let confl_optional = this._option_string_actions[option_string];
          confl_optionals.push([option_string, confl_optional]);
        }
      }
      if (confl_optionals.length) {
        let conflict_handler = this._get_handler();
        conflict_handler.call(this, action, confl_optionals);
      }
    }
    _handle_conflict_error(action, conflicting_actions) {
      let message = conflicting_actions.length === 1 ? "conflicting option string: %s" : "conflicting option strings: %s";
      let conflict_string = conflicting_actions.map(([option_string]) => option_string).join(", ");
      throw new ArgumentError(action, sub(message, conflict_string));
    }
    _handle_conflict_resolve(action, conflicting_actions) {
      for (let [option_string, action2] of conflicting_actions) {
        _array_remove(action2.option_strings, option_string);
        delete this._option_string_actions[option_string];
        if (!action2.option_strings.length) {
          action2.container._remove_action(action2);
        }
      }
    }
  }));
  var _ArgumentGroup = _callable(class _ArgumentGroup2 extends _ActionsContainer {
    constructor() {
      let [
        container,
        title,
        description,
        kwargs
      ] = _parse_opts(arguments, {
        container: no_default,
        title: undefined,
        description: undefined,
        "**kwargs": no_default
      });
      setdefault(kwargs, "conflict_handler", container.conflict_handler);
      setdefault(kwargs, "prefix_chars", container.prefix_chars);
      setdefault(kwargs, "argument_default", container.argument_default);
      super(Object.assign({ description }, kwargs));
      this.title = title;
      this._group_actions = [];
      this._registries = container._registries;
      this._actions = container._actions;
      this._option_string_actions = container._option_string_actions;
      this._defaults = container._defaults;
      this._has_negative_number_optionals = container._has_negative_number_optionals;
      this._mutually_exclusive_groups = container._mutually_exclusive_groups;
    }
    _add_action(action) {
      action = super._add_action(action);
      this._group_actions.push(action);
      return action;
    }
    _remove_action(action) {
      super._remove_action(action);
      _array_remove(this._group_actions, action);
    }
  });
  var _MutuallyExclusiveGroup = _callable(class _MutuallyExclusiveGroup2 extends _ArgumentGroup {
    constructor() {
      let [
        container,
        required
      ] = _parse_opts(arguments, {
        container: no_default,
        required: false
      });
      super(container);
      this.required = required;
      this._container = container;
    }
    _add_action(action) {
      if (action.required) {
        let msg = "mutually exclusive arguments must be optional";
        throw new TypeError(msg);
      }
      action = this._container._add_action(action);
      this._group_actions.push(action);
      return action;
    }
    _remove_action(action) {
      this._container._remove_action(action);
      _array_remove(this._group_actions, action);
    }
  });
  var ArgumentParser = _camelcase_alias(_callable(class ArgumentParser2 extends _AttributeHolder(_ActionsContainer) {
    constructor() {
      let [
        prog,
        usage,
        description,
        epilog,
        parents,
        formatter_class,
        prefix_chars,
        fromfile_prefix_chars,
        argument_default,
        conflict_handler,
        add_help,
        allow_abbrev,
        exit_on_error,
        debug,
        version
      ] = _parse_opts(arguments, {
        prog: undefined,
        usage: undefined,
        description: undefined,
        epilog: undefined,
        parents: [],
        formatter_class: HelpFormatter,
        prefix_chars: "-",
        fromfile_prefix_chars: undefined,
        argument_default: undefined,
        conflict_handler: "error",
        add_help: true,
        allow_abbrev: true,
        exit_on_error: true,
        debug: undefined,
        version: undefined
      });
      if (debug !== undefined) {
        deprecate("debug", 'The "debug" argument to ArgumentParser is deprecated. Please override ArgumentParser.exit function instead.');
      }
      if (version !== undefined) {
        deprecate("version", `The "version" argument to ArgumentParser is deprecated. Please use add_argument(..., { action: 'version', version: 'N', ... }) instead.`);
      }
      super({
        description,
        prefix_chars,
        argument_default,
        conflict_handler
      });
      if (prog === undefined) {
        prog = path.basename(get_argv()[0] || "");
      }
      this.prog = prog;
      this.usage = usage;
      this.epilog = epilog;
      this.formatter_class = formatter_class;
      this.fromfile_prefix_chars = fromfile_prefix_chars;
      this.add_help = add_help;
      this.allow_abbrev = allow_abbrev;
      this.exit_on_error = exit_on_error;
      this.debug = debug;
      this._positionals = this.add_argument_group("positional arguments");
      this._optionals = this.add_argument_group("optional arguments");
      this._subparsers = undefined;
      function identity2(string2) {
        return string2;
      }
      this.register("type", undefined, identity2);
      this.register("type", null, identity2);
      this.register("type", "auto", identity2);
      this.register("type", "int", function(x) {
        let result = Number(x);
        if (!Number.isInteger(result)) {
          throw new TypeError(sub("could not convert string to int: %r", x));
        }
        return result;
      });
      this.register("type", "float", function(x) {
        let result = Number(x);
        if (isNaN(result)) {
          throw new TypeError(sub("could not convert string to float: %r", x));
        }
        return result;
      });
      this.register("type", "str", String);
      this.register("type", "string", util.deprecate(String, 'use {type:"str"} or {type:String} instead of {type:"string"}'));
      let default_prefix = prefix_chars.includes("-") ? "-" : prefix_chars[0];
      if (this.add_help) {
        this.add_argument(default_prefix + "h", default_prefix.repeat(2) + "help", {
          action: "help",
          default: SUPPRESS,
          help: "show this help message and exit"
        });
      }
      if (version) {
        this.add_argument(default_prefix + "v", default_prefix.repeat(2) + "version", {
          action: "version",
          default: SUPPRESS,
          version: this.version,
          help: "show program's version number and exit"
        });
      }
      for (let parent of parents) {
        this._add_container_actions(parent);
        Object.assign(this._defaults, parent._defaults);
      }
    }
    _get_kwargs() {
      let names = [
        "prog",
        "usage",
        "description",
        "formatter_class",
        "conflict_handler",
        "add_help"
      ];
      return names.map((name) => [name, getattr(this, name)]);
    }
    add_subparsers() {
      let [
        kwargs
      ] = _parse_opts(arguments, {
        "**kwargs": no_default
      });
      if (this._subparsers !== undefined) {
        this.error("cannot have multiple subparser arguments");
      }
      setdefault(kwargs, "parser_class", this.constructor);
      if ("title" in kwargs || "description" in kwargs) {
        let title = getattr(kwargs, "title", "subcommands");
        let description = getattr(kwargs, "description", undefined);
        delete kwargs.title;
        delete kwargs.description;
        this._subparsers = this.add_argument_group(title, description);
      } else {
        this._subparsers = this._positionals;
      }
      if (kwargs.prog === undefined) {
        let formatter = this._get_formatter();
        let positionals = this._get_positional_actions();
        let groups = this._mutually_exclusive_groups;
        formatter.add_usage(this.usage, positionals, groups, "");
        kwargs.prog = formatter.format_help().trim();
      }
      let parsers_class = this._pop_action_class(kwargs, "parsers");
      let action = new parsers_class(Object.assign({ option_strings: [] }, kwargs));
      this._subparsers._add_action(action);
      return action;
    }
    _add_action(action) {
      if (action.option_strings.length) {
        this._optionals._add_action(action);
      } else {
        this._positionals._add_action(action);
      }
      return action;
    }
    _get_optional_actions() {
      return this._actions.filter((action) => action.option_strings.length);
    }
    _get_positional_actions() {
      return this._actions.filter((action) => !action.option_strings.length);
    }
    parse_args(args2 = undefined, namespace = undefined) {
      let argv;
      [args2, argv] = this.parse_known_args(args2, namespace);
      if (argv && argv.length > 0) {
        let msg = "unrecognized arguments: %s";
        this.error(sub(msg, argv.join(" ")));
      }
      return args2;
    }
    parse_known_args(args2 = undefined, namespace = undefined) {
      if (args2 === undefined) {
        args2 = get_argv().slice(1);
      }
      if (namespace === undefined) {
        namespace = new Namespace;
      }
      for (let action of this._actions) {
        if (action.dest !== SUPPRESS) {
          if (!hasattr(namespace, action.dest)) {
            if (action.default !== SUPPRESS) {
              setattr(namespace, action.dest, action.default);
            }
          }
        }
      }
      for (let dest of Object.keys(this._defaults)) {
        if (!hasattr(namespace, dest)) {
          setattr(namespace, dest, this._defaults[dest]);
        }
      }
      if (this.exit_on_error) {
        try {
          [namespace, args2] = this._parse_known_args(args2, namespace);
        } catch (err) {
          if (err instanceof ArgumentError) {
            this.error(err.message);
          } else {
            throw err;
          }
        }
      } else {
        [namespace, args2] = this._parse_known_args(args2, namespace);
      }
      if (hasattr(namespace, _UNRECOGNIZED_ARGS_ATTR)) {
        args2 = args2.concat(getattr(namespace, _UNRECOGNIZED_ARGS_ATTR));
        delattr(namespace, _UNRECOGNIZED_ARGS_ATTR);
      }
      return [namespace, args2];
    }
    _parse_known_args(arg_strings, namespace) {
      if (this.fromfile_prefix_chars !== undefined) {
        arg_strings = this._read_args_from_files(arg_strings);
      }
      let action_conflicts = new Map;
      for (let mutex_group of this._mutually_exclusive_groups) {
        let group_actions = mutex_group._group_actions;
        for (let [i, mutex_action] of Object.entries(mutex_group._group_actions)) {
          let conflicts = action_conflicts.get(mutex_action) || [];
          conflicts = conflicts.concat(group_actions.slice(0, +i));
          conflicts = conflicts.concat(group_actions.slice(+i + 1));
          action_conflicts.set(mutex_action, conflicts);
        }
      }
      let option_string_indices = {};
      let arg_string_pattern_parts = [];
      let arg_strings_iter = Object.entries(arg_strings)[Symbol.iterator]();
      for (let [i, arg_string] of arg_strings_iter) {
        if (arg_string === "--") {
          arg_string_pattern_parts.push("-");
          for ([i, arg_string] of arg_strings_iter) {
            arg_string_pattern_parts.push("A");
          }
        } else {
          let option_tuple = this._parse_optional(arg_string);
          let pattern;
          if (option_tuple === undefined) {
            pattern = "A";
          } else {
            option_string_indices[i] = option_tuple;
            pattern = "O";
          }
          arg_string_pattern_parts.push(pattern);
        }
      }
      let arg_strings_pattern = arg_string_pattern_parts.join("");
      let seen_actions = new Set;
      let seen_non_default_actions = new Set;
      let extras;
      let take_action = (action, argument_strings, option_string = undefined) => {
        seen_actions.add(action);
        let argument_values = this._get_values(action, argument_strings);
        if (argument_values !== action.default) {
          seen_non_default_actions.add(action);
          for (let conflict_action of action_conflicts.get(action) || []) {
            if (seen_non_default_actions.has(conflict_action)) {
              let msg = "not allowed with argument %s";
              let action_name = _get_action_name(conflict_action);
              throw new ArgumentError(action, sub(msg, action_name));
            }
          }
        }
        if (argument_values !== SUPPRESS) {
          action(this, namespace, argument_values, option_string);
        }
      };
      let consume_optional = (start_index2) => {
        let option_tuple = option_string_indices[start_index2];
        let [action, option_string, explicit_arg] = option_tuple;
        let action_tuples = [];
        let stop;
        for (;; ) {
          if (action === undefined) {
            extras.push(arg_strings[start_index2]);
            return start_index2 + 1;
          }
          if (explicit_arg !== undefined) {
            let arg_count = this._match_argument(action, "A");
            let chars = this.prefix_chars;
            if (arg_count === 0 && !chars.includes(option_string[1])) {
              action_tuples.push([action, [], option_string]);
              let char = option_string[0];
              option_string = char + explicit_arg[0];
              let new_explicit_arg = explicit_arg.slice(1) || undefined;
              let optionals_map = this._option_string_actions;
              if (hasattr(optionals_map, option_string)) {
                action = optionals_map[option_string];
                explicit_arg = new_explicit_arg;
              } else {
                let msg = "ignored explicit argument %r";
                throw new ArgumentError(action, sub(msg, explicit_arg));
              }
            } else if (arg_count === 1) {
              stop = start_index2 + 1;
              let args2 = [explicit_arg];
              action_tuples.push([action, args2, option_string]);
              break;
            } else {
              let msg = "ignored explicit argument %r";
              throw new ArgumentError(action, sub(msg, explicit_arg));
            }
          } else {
            let start = start_index2 + 1;
            let selected_patterns = arg_strings_pattern.slice(start);
            let arg_count = this._match_argument(action, selected_patterns);
            stop = start + arg_count;
            let args2 = arg_strings.slice(start, stop);
            action_tuples.push([action, args2, option_string]);
            break;
          }
        }
        assert2(action_tuples.length);
        for (let [action2, args2, option_string2] of action_tuples) {
          take_action(action2, args2, option_string2);
        }
        return stop;
      };
      let positionals = this._get_positional_actions();
      let consume_positionals = (start_index2) => {
        let selected_pattern = arg_strings_pattern.slice(start_index2);
        let arg_counts = this._match_arguments_partial(positionals, selected_pattern);
        for (let i = 0;i < positionals.length && i < arg_counts.length; i++) {
          let action = positionals[i];
          let arg_count = arg_counts[i];
          let args2 = arg_strings.slice(start_index2, start_index2 + arg_count);
          start_index2 += arg_count;
          take_action(action, args2);
        }
        positionals = positionals.slice(arg_counts.length);
        return start_index2;
      };
      extras = [];
      let start_index = 0;
      let max_option_string_index = Math.max(-1, ...Object.keys(option_string_indices).map(Number));
      while (start_index <= max_option_string_index) {
        let next_option_string_index = Math.min(...Object.keys(option_string_indices).map(Number).filter((index) => index >= start_index));
        if (start_index !== next_option_string_index) {
          let positionals_end_index = consume_positionals(start_index);
          if (positionals_end_index > start_index) {
            start_index = positionals_end_index;
            continue;
          } else {
            start_index = positionals_end_index;
          }
        }
        if (!(start_index in option_string_indices)) {
          let strings = arg_strings.slice(start_index, next_option_string_index);
          extras = extras.concat(strings);
          start_index = next_option_string_index;
        }
        start_index = consume_optional(start_index);
      }
      let stop_index = consume_positionals(start_index);
      extras = extras.concat(arg_strings.slice(stop_index));
      let required_actions = [];
      for (let action of this._actions) {
        if (!seen_actions.has(action)) {
          if (action.required) {
            required_actions.push(_get_action_name(action));
          } else {
            if (action.default !== undefined && typeof action.default === "string" && hasattr(namespace, action.dest) && action.default === getattr(namespace, action.dest)) {
              setattr(namespace, action.dest, this._get_value(action, action.default));
            }
          }
        }
      }
      if (required_actions.length) {
        this.error(sub("the following arguments are required: %s", required_actions.join(", ")));
      }
      for (let group of this._mutually_exclusive_groups) {
        if (group.required) {
          let no_actions_used = true;
          for (let action of group._group_actions) {
            if (seen_non_default_actions.has(action)) {
              no_actions_used = false;
              break;
            }
          }
          if (no_actions_used) {
            let names = group._group_actions.filter((action) => action.help !== SUPPRESS).map((action) => _get_action_name(action));
            let msg = "one of the arguments %s is required";
            this.error(sub(msg, names.join(" ")));
          }
        }
      }
      return [namespace, extras];
    }
    _read_args_from_files(arg_strings) {
      let new_arg_strings = [];
      for (let arg_string of arg_strings) {
        if (!arg_string || !this.fromfile_prefix_chars.includes(arg_string[0])) {
          new_arg_strings.push(arg_string);
        } else {
          try {
            let args_file = fs.readFileSync(arg_string.slice(1), "utf8");
            let arg_strings2 = [];
            for (let arg_line of splitlines(args_file)) {
              for (let arg of this.convert_arg_line_to_args(arg_line)) {
                arg_strings2.push(arg);
              }
            }
            arg_strings2 = this._read_args_from_files(arg_strings2);
            new_arg_strings = new_arg_strings.concat(arg_strings2);
          } catch (err) {
            this.error(err.message);
          }
        }
      }
      return new_arg_strings;
    }
    convert_arg_line_to_args(arg_line) {
      return [arg_line];
    }
    _match_argument(action, arg_strings_pattern) {
      let nargs_pattern = this._get_nargs_pattern(action);
      let match = arg_strings_pattern.match(new RegExp("^" + nargs_pattern));
      if (match === null) {
        let nargs_errors = {
          undefined: "expected one argument",
          [OPTIONAL]: "expected at most one argument",
          [ONE_OR_MORE]: "expected at least one argument"
        };
        let msg = nargs_errors[action.nargs];
        if (msg === undefined) {
          msg = sub(action.nargs === 1 ? "expected %s argument" : "expected %s arguments", action.nargs);
        }
        throw new ArgumentError(action, msg);
      }
      return match[1].length;
    }
    _match_arguments_partial(actions, arg_strings_pattern) {
      let result = [];
      for (let i of range(actions.length, 0, -1)) {
        let actions_slice = actions.slice(0, i);
        let pattern = actions_slice.map((action) => this._get_nargs_pattern(action)).join("");
        let match = arg_strings_pattern.match(new RegExp("^" + pattern));
        if (match !== null) {
          result = result.concat(match.slice(1).map((string2) => string2.length));
          break;
        }
      }
      return result;
    }
    _parse_optional(arg_string) {
      if (!arg_string) {
        return;
      }
      if (!this.prefix_chars.includes(arg_string[0])) {
        return;
      }
      if (arg_string in this._option_string_actions) {
        let action = this._option_string_actions[arg_string];
        return [action, arg_string, undefined];
      }
      if (arg_string.length === 1) {
        return;
      }
      if (arg_string.includes("=")) {
        let [option_string, explicit_arg] = _string_split(arg_string, "=", 1);
        if (option_string in this._option_string_actions) {
          let action = this._option_string_actions[option_string];
          return [action, option_string, explicit_arg];
        }
      }
      let option_tuples = this._get_option_tuples(arg_string);
      if (option_tuples.length > 1) {
        let options = option_tuples.map(([, option_string]) => option_string).join(", ");
        let args2 = { option: arg_string, matches: options };
        let msg = "ambiguous option: %(option)s could match %(matches)s";
        this.error(sub(msg, args2));
      } else if (option_tuples.length === 1) {
        let [option_tuple] = option_tuples;
        return option_tuple;
      }
      if (this._negative_number_matcher.test(arg_string)) {
        if (!this._has_negative_number_optionals.length) {
          return;
        }
      }
      if (arg_string.includes(" ")) {
        return;
      }
      return [undefined, arg_string, undefined];
    }
    _get_option_tuples(option_string) {
      let result = [];
      let chars = this.prefix_chars;
      if (chars.includes(option_string[0]) && chars.includes(option_string[1])) {
        if (this.allow_abbrev) {
          let option_prefix, explicit_arg;
          if (option_string.includes("=")) {
            [option_prefix, explicit_arg] = _string_split(option_string, "=", 1);
          } else {
            option_prefix = option_string;
            explicit_arg = undefined;
          }
          for (let option_string2 of Object.keys(this._option_string_actions)) {
            if (option_string2.startsWith(option_prefix)) {
              let action = this._option_string_actions[option_string2];
              let tup = [action, option_string2, explicit_arg];
              result.push(tup);
            }
          }
        }
      } else if (chars.includes(option_string[0]) && !chars.includes(option_string[1])) {
        let option_prefix = option_string;
        let explicit_arg = undefined;
        let short_option_prefix = option_string.slice(0, 2);
        let short_explicit_arg = option_string.slice(2);
        for (let option_string2 of Object.keys(this._option_string_actions)) {
          if (option_string2 === short_option_prefix) {
            let action = this._option_string_actions[option_string2];
            let tup = [action, option_string2, short_explicit_arg];
            result.push(tup);
          } else if (option_string2.startsWith(option_prefix)) {
            let action = this._option_string_actions[option_string2];
            let tup = [action, option_string2, explicit_arg];
            result.push(tup);
          }
        }
      } else {
        this.error(sub("unexpected option string: %s", option_string));
      }
      return result;
    }
    _get_nargs_pattern(action) {
      let nargs = action.nargs;
      let nargs_pattern;
      if (nargs === undefined) {
        nargs_pattern = "(-*A-*)";
      } else if (nargs === OPTIONAL) {
        nargs_pattern = "(-*A?-*)";
      } else if (nargs === ZERO_OR_MORE) {
        nargs_pattern = "(-*[A-]*)";
      } else if (nargs === ONE_OR_MORE) {
        nargs_pattern = "(-*A[A-]*)";
      } else if (nargs === REMAINDER) {
        nargs_pattern = "([-AO]*)";
      } else if (nargs === PARSER) {
        nargs_pattern = "(-*A[-AO]*)";
      } else if (nargs === SUPPRESS) {
        nargs_pattern = "(-*-*)";
      } else {
        nargs_pattern = sub("(-*%s-*)", "A".repeat(nargs).split("").join("-*"));
      }
      if (action.option_strings.length) {
        nargs_pattern = nargs_pattern.replace(/-\*/g, "");
        nargs_pattern = nargs_pattern.replace(/-/g, "");
      }
      return nargs_pattern;
    }
    parse_intermixed_args(args2 = undefined, namespace = undefined) {
      let argv;
      [args2, argv] = this.parse_known_intermixed_args(args2, namespace);
      if (argv.length) {
        let msg = "unrecognized arguments: %s";
        this.error(sub(msg, argv.join(" ")));
      }
      return args2;
    }
    parse_known_intermixed_args(args2 = undefined, namespace = undefined) {
      let extras;
      let positionals = this._get_positional_actions();
      let a = positionals.filter((action) => [PARSER, REMAINDER].includes(action.nargs));
      if (a.length) {
        throw new TypeError(sub("parse_intermixed_args: positional arg with nargs=%s", a[0].nargs));
      }
      for (let group of this._mutually_exclusive_groups) {
        for (let action of group._group_actions) {
          if (positionals.includes(action)) {
            throw new TypeError("parse_intermixed_args: positional in mutuallyExclusiveGroup");
          }
        }
      }
      let save_usage;
      try {
        save_usage = this.usage;
        let remaining_args;
        try {
          if (this.usage === undefined) {
            this.usage = this.format_usage().slice(7);
          }
          for (let action of positionals) {
            action.save_nargs = action.nargs;
            action.nargs = SUPPRESS;
            action.save_default = action.default;
            action.default = SUPPRESS;
          }
          [namespace, remaining_args] = this.parse_known_args(args2, namespace);
          for (let action of positionals) {
            let attr = getattr(namespace, action.dest);
            if (Array.isArray(attr) && attr.length === 0) {
              console.warn(sub("Do not expect %s in %s", action.dest, namespace));
              delattr(namespace, action.dest);
            }
          }
        } finally {
          for (let action of positionals) {
            action.nargs = action.save_nargs;
            action.default = action.save_default;
          }
        }
        let optionals = this._get_optional_actions();
        try {
          for (let action of optionals) {
            action.save_required = action.required;
            action.required = false;
          }
          for (let group of this._mutually_exclusive_groups) {
            group.save_required = group.required;
            group.required = false;
          }
          [namespace, extras] = this.parse_known_args(remaining_args, namespace);
        } finally {
          for (let action of optionals) {
            action.required = action.save_required;
          }
          for (let group of this._mutually_exclusive_groups) {
            group.required = group.save_required;
          }
        }
      } finally {
        this.usage = save_usage;
      }
      return [namespace, extras];
    }
    _get_values(action, arg_strings) {
      if (![PARSER, REMAINDER].includes(action.nargs)) {
        try {
          _array_remove(arg_strings, "--");
        } catch (err) {
        }
      }
      let value;
      if (!arg_strings.length && action.nargs === OPTIONAL) {
        if (action.option_strings.length) {
          value = action.const;
        } else {
          value = action.default;
        }
        if (typeof value === "string") {
          value = this._get_value(action, value);
          this._check_value(action, value);
        }
      } else if (!arg_strings.length && action.nargs === ZERO_OR_MORE && !action.option_strings.length) {
        if (action.default !== undefined) {
          value = action.default;
        } else {
          value = arg_strings;
        }
        this._check_value(action, value);
      } else if (arg_strings.length === 1 && [undefined, OPTIONAL].includes(action.nargs)) {
        let arg_string = arg_strings[0];
        value = this._get_value(action, arg_string);
        this._check_value(action, value);
      } else if (action.nargs === REMAINDER) {
        value = arg_strings.map((v) => this._get_value(action, v));
      } else if (action.nargs === PARSER) {
        value = arg_strings.map((v) => this._get_value(action, v));
        this._check_value(action, value[0]);
      } else if (action.nargs === SUPPRESS) {
        value = SUPPRESS;
      } else {
        value = arg_strings.map((v) => this._get_value(action, v));
        for (let v of value) {
          this._check_value(action, v);
        }
      }
      return value;
    }
    _get_value(action, arg_string) {
      let type_func = this._registry_get("type", action.type, action.type);
      if (typeof type_func !== "function") {
        let msg = "%r is not callable";
        throw new ArgumentError(action, sub(msg, type_func));
      }
      let result;
      try {
        try {
          result = type_func(arg_string);
        } catch (err) {
          if (err instanceof TypeError && /Class constructor .* cannot be invoked without 'new'/.test(err.message)) {
            result = new type_func(arg_string);
          } else {
            throw err;
          }
        }
      } catch (err) {
        if (err instanceof ArgumentTypeError) {
          let msg = err.message;
          throw new ArgumentError(action, msg);
        } else if (err instanceof TypeError) {
          let name = getattr(action.type, "name", repr(action.type));
          let args2 = { type: name, value: arg_string };
          let msg = "invalid %(type)s value: %(value)r";
          throw new ArgumentError(action, sub(msg, args2));
        } else {
          throw err;
        }
      }
      return result;
    }
    _check_value(action, value) {
      if (action.choices !== undefined && !_choices_to_array(action.choices).includes(value)) {
        let args2 = {
          value,
          choices: _choices_to_array(action.choices).map(repr).join(", ")
        };
        let msg = "invalid choice: %(value)r (choose from %(choices)s)";
        throw new ArgumentError(action, sub(msg, args2));
      }
    }
    format_usage() {
      let formatter = this._get_formatter();
      formatter.add_usage(this.usage, this._actions, this._mutually_exclusive_groups);
      return formatter.format_help();
    }
    format_help() {
      let formatter = this._get_formatter();
      formatter.add_usage(this.usage, this._actions, this._mutually_exclusive_groups);
      formatter.add_text(this.description);
      for (let action_group of this._action_groups) {
        formatter.start_section(action_group.title);
        formatter.add_text(action_group.description);
        formatter.add_arguments(action_group._group_actions);
        formatter.end_section();
      }
      formatter.add_text(this.epilog);
      return formatter.format_help();
    }
    _get_formatter() {
      return new this.formatter_class({ prog: this.prog });
    }
    print_usage(file = undefined) {
      if (file === undefined)
        file = process.stdout;
      this._print_message(this.format_usage(), file);
    }
    print_help(file = undefined) {
      if (file === undefined)
        file = process.stdout;
      this._print_message(this.format_help(), file);
    }
    _print_message(message, file = undefined) {
      if (message) {
        if (file === undefined)
          file = process.stderr;
        file.write(message);
      }
    }
    exit(status = 0, message = undefined) {
      if (message) {
        this._print_message(message, process.stderr);
      }
      process.exit(status);
    }
    error(message) {
      if (this.debug === true)
        throw new Error(message);
      this.print_usage(process.stderr);
      let args2 = { prog: this.prog, message };
      this.exit(2, sub("%(prog)s: error: %(message)s\n", args2));
    }
  }));
  module.exports = {
    ArgumentParser,
    ArgumentError,
    ArgumentTypeError,
    BooleanOptionalAction,
    FileType,
    HelpFormatter,
    ArgumentDefaultsHelpFormatter,
    RawDescriptionHelpFormatter,
    RawTextHelpFormatter,
    MetavarTypeHelpFormatter,
    Namespace,
    Action,
    ONE_OR_MORE,
    OPTIONAL,
    PARSER,
    REMAINDER,
    SUPPRESS,
    ZERO_OR_MORE
  };
  Object.defineProperty(module.exports, "Const", {
    get() {
      let result = {};
      Object.entries({ ONE_OR_MORE, OPTIONAL, PARSER, REMAINDER, SUPPRESS, ZERO_OR_MORE }).forEach(([n, v]) => {
        Object.defineProperty(result, n, {
          get() {
            deprecate(n, sub("use argparse.%s instead of argparse.Const.%s", n, n));
            return v;
          }
        });
      });
      Object.entries({ _UNRECOGNIZED_ARGS_ATTR }).forEach(([n, v]) => {
        Object.defineProperty(result, n, {
          get() {
            deprecate(n, sub("argparse.Const.%s is an internal symbol and will no longer be available", n));
            return v;
          }
        });
      });
      return result;
    },
    enumerable: false
  });
});
// node_modules/
function fastHash(str, seed = 0) {
  let h1 = 3735928559 ^ seed, h2 = 1103547991 ^ seed;
  for (let i = 0, ch;i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2246822519);
    h2 = Math.imul(h2 ^ ch, 3266489917);
  }
  h1 ^= Math.imul(h1 ^ h2 >>> 15, 1935289751);
  h2 ^= Math.imul(h2 ^ h1 >>> 15, 3405138345);
  h1 ^= h2 >>> 16;
  h2 ^= h1 >>> 16;
  return 2097152 * (h2 >>> 0) + (h1 >>> 11);
}
function hashWithLength(input, length, seed = 0) {
  if (length < 0)
    throw new Error("`length` cannot be less than zero");
  const h = typeof input === "number" ? input : fastHash(input, seed);
  const approxBaseFromLength = Math.max(Math.min(Math.pow(2, Math.ceil(Math.log2(length))), 36), 2);
  let result = h.toString(approxBaseFromLength);
  if (result.length === length)
    return result;
  for (let i = 1;i < length * 2; i++) {
    if (approxBaseFromLength + i > 36)
      continue;
    result = h.toString(approxBaseFromLength + i);
    if (result.length === length)
      return result;
    if (approxBaseFromLength - i < 2)
      continue;
    result = h.toString(approxBaseFromLength - i);
    if (result.length === length)
      return result;
  }
  return h.toString().padEnd(length, "0").slice(0, length);
}
function coerceHash(input, seed = 0) {
  if (typeof input === "string")
    return fastHash(input, seed);
  if (typeof input === "number")
    return fastHash(input.toString(), seed);
  if (Array.isArray(input))
    return fastHash(input.map((v) => coerceHash(v, seed)).join(""));
  if (isObjectLike(input))
    return fastHash(JSON.stringify(sortByKeys(input)), seed);
  if (typeof input === "bigint")
    return fastHash(input.toString());
  if (typeof input === "undefined")
    return fastHash("undefined", seed);
  if (typeof input === "symbol")
    return fastHash(input.toString(), seed);
  return fastHash(JSON.stringify(input), seed);
}
function matches(regex, string) {
  if (!regex.flags.includes("g"))
    regex = new RegExp(regex.source, regex.flags + "g");
  return {
    [Symbol.iterator]() {
      return this;
    },
    next: () => {
      const result = regex.exec(string);
      if (!result)
        return { done: true, value: undefined };
      return { done: false, value: result };
    }
  };
}
function toMatch(value) {
  if (!value || typeof value.index !== "number" || typeof value.input !== "string")
    return null;
  const str = value[0];
  return Object.assign(str, { start: value.index, end: value.index + str.length, input: value.input });
}
function stringSplice(str, index, count = 1, add = "") {
  if (index < 0 || count < 0)
    throw new Error("index and count parameters cannot be less than zero");
  return str.slice(0, index) + add + str.slice(index + count);
}
// node_module
var parseArgs = (constructorParams, ...args2) => {
  const parser = new (require_argparse()).ArgumentParser(constructorParams);
  for (const arg of args2)
    parser.add_argument(...arg);
  return parser.parse_args();
};
export {
  toRadians,
  toMatch,
  toDegrees,
  throws,
  stringSplice,
  sortByKeys,
  sleep,
  sh,
  safeParseInt,
  safeParseFloat,
  safeJSONParse,
  safeCall,
  roundTo,
  randInteger,
  randFloat,
  raise,
  propIs,
  pipe,
  parseArgs,
  once,
  okOr,
  ok,
  noop,
  nodeOnly,
  multiComparator,
  matches,
  manhattanDistance,
  main,
  limitConcurrentCalls,
  lerp,
  isPartiallyLike,
  isOk,
  isObjectLike,
  isNullish,
  importSync,
  iife,
  identity,
  hashWithLength,
  groupBy,
  findItemsFrom,
  fastHash,
  expectType,
  exec,
  equal,
  effect,
  constant,
  coerceHash,
  attempt,
  assert,
  RADIANS_MULT,
  InMemoryCache,
  DEGREES_MULT,
  BinarySearch
};

//# debugId=E649273A9CFD3D7464756e2164756e21

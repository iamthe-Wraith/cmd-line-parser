# cmd-line-parser
a command line parser to be used with a CLI.

will parse a command, breaking it down into individual pieces as registered by the command, identify what kind of data each piece represents, and compile them all into a single object to be referenced by the command.

## Usage
in the main file of your CLI, you will want to call the Parser's static `init` method, passing it the process.argv as a new array. this will break the initial command down into 3 parts: `namespace`, `command`, and `args`.  
(you can do this initially before the command begins executing to identify which command the user is attempting to execute (if your command namespace contains multiple commands)).
```javascript
const Parser = require('Parser');

// perform initial breakdown of command entered
let ctx = { ...Parser.init(...process.argv) };
```

next, you must register your command's `arguments`, `parameters`, and `flags`.
:heavy_exclamation_mark: you can encounter unexpected results/execution if you attempt to use any `arguments`, `parameters`, of `flags` that have not been registered.
```javascript
...
const parser = new Parser('<[command]>'); // more on this argument later.

parser.argument(<name>, <options>);
parser.parameter(<name>, <options>);
parser.flag(<name>, <options>);
```

then, once your command is ready to parse the arguments it was provided, you will call the Parser instance's parse method. this method takes a single parameter, which is a object that must at least have an `args` property inside it, which houses the `args` that were returned from the init method. this method will return a Promise that will resolve with an object that contains the broken down args which will fall into the 3 different categories: `agruments`, `parameters`, and `flags`.
```javascript
...
parser.parse(ctx.args)
  .then(args => {
    /*  rest of command code */
  })
  .catch(err => { /* do something with error */ });
```


## Pieces of the Command
Parser relies on a predefined command structure:
### `<namespace> <command> <...args>`

#### namespace
the namespace is the name provided to the overarching program (set in the "bin" property within your package.json file). it is the name which is used to identify your CLI.

#### command
once the namespace has been entered, you will then enter the command. this is the specific action you wish to take using this CLI.

#### args
lastly will be a combination of `arguments`, `parameters`, and `flags` that provide additional data for command.


## args
the parse method breaks down the args property (received from the init method) into 3 different types of command data:

#### arguments
arguments are optional pieces of data that can be identified by the argument's name, and provided with an additional value (which must immediately follow the argument name).  
__example:__ let's say we have an argument `name|n`. we could include this in our command using the following structure:  
```
<namespace> <command> --name "kimberly ashland"
<namespace> <command> --name derek
<namespace> <command> -n "anthony patterson"
<namespace> <command> -n barbara
```

to register an argument, you call the parser's `argument` method, passing it the name of the argument, separating the long and short versions of the name by a pipe ('name|n'), and an options object.
```javascript
...
parser.argument('name|n', { ... });
```

__available options:__
- type - [OPTIONAL] the type of data expected to be passed to this flag (default: string)
- validate - [OPTIONAL] a function used to validate the data passed to this function

-----

#### flags
flags are optional pieces of data that are similar to parameters since they can be identified their name (long or short). but unlike arguments, flags do not contain additional data. flags represent boolean values. if they are included in the command, that value is true. if they are not included, that value is false.
__example:__ let's say we have a flag `preventinstall|p`. we could include this in our command like so:
```
<namespace> <command> -preventinstall
<namespace> <command> -p
```

to register a flag, you call the parser's `flag` method, passing it the name of the flag, separating the long and short versions of the name by a pipe ('preventinstall|p').
```javascript
...
parser.flag('preventinstall|p');
```

-----

#### parameters
parameters are the only piece of data a command is able to require (though they can be made optional as well). similar to arguments, parameters provide additional data to the command. however, unlike arguments and flags, parameters are not identified (in the command) by their name, but instead by the order in which they appear in the command. this order is determined when the Parser instance is created. you pass a string to the Parser constructor identifying the pattern that the command name and the parameters must follow.  

:heavy_exclamation_mark: __IMPORTANT__ no required parameter can be implemented AFTER an optional parameter. if a command is to have a combination of required and optional parameters, then all required parameters must be implemented first.

:heavy_exclamation_mark: __NOTE__ flags and arguments can both be insterted before, between, and after parameters. the Parser will be able to identify them either way.

__example:__ let's say we have a command `registeruser` that takes 3 parameters `firstname`, `lastname`, and `age` which is optional. we would instatiate this parser instance like this:
```javascript
const parser = new Parser('<registeruser> <firstname> <lastname> <age?>');
```

then, we still must register the parameters like we do arguments and flags by passing in the name of the parameter (no short version here, only the long), and an options object:
```javascript
parser
  .parameter('firstname', { ... })
  .parameter('lastname', { ... })
  .parameter('age', { ... });
```

__available options:__
- type - [OPTIONAL] the type of data expected to be passed to this flag (default: string)

-----

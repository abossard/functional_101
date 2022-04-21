//#region functions
function introduceSomeone(myname: string, otherName: string) {
    return `Hello ${otherName}, my name is ${otherName}`;
}

function introduceMe(me: string) {
    return function (otherName: string) {
        return `Hello ${otherName}, my name is ${me}`;
    }
}

function applyIntroduction(names: string[], introduction: (name: string) => string) {
    return names.map(introduction);
}

//console.log(introduceSomeone('John', 'Jane'));

const andreGreets = introduceMe('Andre');

//console.log(andreGreets('Jane'));
const names = ['John', 'Jane', 'Jack'];

//console.table(applyIntroduction(names, andreGreets));

//#endregion


//#region Objects are functions too ;-)

class GreeterFactory {
    myname: string;
    greetCount: number = 0;

    constructor(myname: string) {
        this.myname = myname
    }

    greet(otherName: string) {
        this.greetCount++;
        return "Hello " + otherName + ", my name is " + this.myname;
    }
}

let andreGreetsObjects = new GreeterFactory('Andre');
// is the equivalent if


console.log(andreGreetsObjects.greet('Jane'));


function introduceMeWithCount(me: string) {
    let greetCount = 0;
    let greet = function (otherName: string) {
        greetCount += 1;
        return `Hello ${otherName}, my name is ${me}`;
    }
    let count = function() {return greetCount}
    return {count, greet}
}
let introducer = introduceMeWithCount('Andre');
console.log(introducer.greet('Jane'));
console.log(introducer.greet('Jane'));
console.log(introducer.count());
//#endregion


function add5(n: number) {
    return n + 5;
}

function minus2(n: number) {
    return n - 2;
}

let x = add5(minus2(10));
// nice, but not very reusable, composition and execution is close together

// so let's make a new function that does the same thing
function add5minus2(n: number) {
    add5(minus2(n))
}

// better, but still not as readable
console.log(add5minus2(10));

// that's where compose comes into play
function compose <A, B, C>( 
    f1: (value: A) => B, 
    f2: (value: B) => C 
    ): (value: A) => C {
    return value => f2( f1( value ) )
}

let add3withCompose = compose(add5, minus2);
// better, but what if the functions to compose have really different imputs?

function wrap<V>(value: V) {
    return {
        value,
        map: function <B>(f: (value: V) => B) {
            return wrap(f(value));
        }
    }
}
type Command = {name: string, body: string};

function httpRequestToCommand(request: string): Command {
    let name = request.split('/')[1];
    let body = request;
    return {name, body};
}
type SQL = string;

function commandToSql(command: Command): SQL {
    return `SELECT content FROM ${command.name}`;
}

type Result<V> = 
    {value: V, success: true} 
    | {success: false, error: string};


function wrapResult<V>(value: V) {
    return {
        value,
        map: function <B>(f: (value: V) => Result<B>) {
            let result = f(value);
            if (result.success) {
                return wrapResult(f(value));
            } else {
                this.onNotSuccess(result);
            }
        },
        onNotSuccess: function (result: {success: false, error: string}) {
            console.error(result.error);
        }
    }
}

let request = 'GET /users';
let sql = wrap(request)
    .map(httpRequestToCommand)
    .map(commandToSql);
console.log(sql.value);
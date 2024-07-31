// Building a custom complier.

// Compiler Phase 1 - Lexer
function lexer(input){
    const tokens =[];
    let cursor = 0;
    while (cursor < input.length){
        let char = input[cursor];
        // Skip whitespaces
        if(/\s/.test(char)){
            cursor++;
            continue;
        }
        //Tokenize Word
        if(/[a-zA-Z]/.test(char)){
            let word = '';
            while(/[a-zA-Z0-9]/.test(char)){
                word += char;
                char = input[++cursor];
            }
            if(word === 'take'|| word === 'show'){
                tokens.push({type:'keyword', value:word});
            }
            else{
                tokens.push({type:'identifier', value:word});
            }
            continue;
        }
        //Tokenize Number
        if(/[0-9]/.test(char)){
            let num = '';
            while(/[0-9]/.test(char)){
                num += char;
                char = input[++cursor];
            }
            tokens.push({type:'number', value:parseInt(num)});
            continue;
        }
        //Tokenize operators and equals sign
        if(/[\+\-\*\/=]/.test(char)){
            tokens.push({type:'operator', value:char});
            cursor++;
            continue;
        }
    }
    return tokens;
}

// Compiler phase 2 - parser
function parser(tokens){
    let abstract_syntax_tree = {
        type: 'Program',
        body: []
    };
    while(tokens.length > 0){
        let token = tokens.shift();
        if(token.type === 'keyword' && token.value === 'take'){
            let declaration = {
                type: 'Declaration',
                name: tokens.shift().value,
                value: null
            };
            if(tokens[0].type === 'operator' && tokens[0].value === '='){
                tokens.shift();
                let expression = '';
                while(tokens.length > 0 && tokens[0].type !== 'keyword'){
                    expression += tokens.shift().value;
                }
                declaration.value = expression.trim();
            }
            abstract_syntax_tree.body.push(declaration);
        }
        if(token.type === 'keyword' && token.value === 'show'){
            abstract_syntax_tree.body.push({
                type: 'Print',
                expression: tokens.shift().value
            });
        }
    }
    return abstract_syntax_tree;
}

// Compiler phase 3 - code generator
function Code_Generator(node){
    switch (node.type){
        case 'Program': return node.body.map(Code_Generator).join('\n');
        case 'Declaration': return `const ${node.name} = ${node.value};`;
        case 'Print': return `console.log(${node.expression});`;
    }
}

//Compiler function
function compiler(input){
    const tokens = lexer(input);
    const abstract_syntax_tree = parser(tokens);
    const executableCode = Code_Generator(abstract_syntax_tree);
    return executableCode;
}

//Code Runner function
function Code_Runner(input){
    eval(input);
}

//This is my custom language code
const code = `
    take x = 20
    take y = 20
    take sum = x / y
    show sum
`
// Calling compiler and code runner functions
const exec = compiler(code);
Code_Runner(exec);
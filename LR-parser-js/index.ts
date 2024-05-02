type NonTerminal = 'E' | 'T' | 'F';
type Terminal = '+' | '*' | '(' | ')' | 'id';

const GRAMMAR = {
  S: 'S',
  E: 'E',
  T: 'T',
  F: 'F',
  '+': '+',
  '*': '*',
  'id': 'id',
  '(': '(',
  ')': ')',
};
const terminalList: Terminal[] = ['+', '*', 'id', '(', ')'];

interface State {
  lhs: NonTerminal;
  rhs: string;
  currentIndex: number;
  lookahead: Terminal | '$';
}

interface Iterm {
  kernel: State[];
  closure: State[];
}

const POINT = '·';
const iTermList: Iterm[] = [];
const lhs: string[] = [];
const rhs: string[] = [];


// 'S -> ·E', '$'
// 'E -> ·E+T', '$'
// 'E -> ·T', '$'
// 'T -> ·T*F', '$'
// 'T -> ·F', '$'
// 'F -> ·(E)', '$'
// 'F -> ·n', '$'
//
// 'E -> ·E+T', '+'
// 'E -> ·T', '+'
// 'T -> ·T*F', '+'
// 'T -> ·F', '+'
// 'F -> ·(E)', '+'
// 'F -> ·n', '+'
//
// 'T -> ·T*F', '*'
// 'T -> ·F', '*'
// 'F -> ·(E)', '*'
// 'F -> ·n', '*'

// const createClosure = (it) => {
//   const { iterm, closure } = it;
//   const str = iterm[1];
//   const matchIndex = [];
//   for (let i=0; i<lhs.length; i++) {
//     if (str === lhs[i]) {
//       matchIndex.push(i);
//     }
//   }
//
//
//   console.log('iterm', iterm);
// }

function init() {
  const str: string =
    `S -> E
    E -> T
    E -> E + T
    T -> F
    T -> T * F
    F -> (E)
    F -> n`.replace(/ /gi, '');
  const grammar: string[] = str.split('\n');
  grammar.map(item => {
    const [left, right] = item.split('->');
    lhs.push(left);
    rhs.push(right);
  });

  const firstIterm: Iterm = {
    kernel: [],
    closure: [],
  };
  firstIterm.kernel.push({
    lhs: lhs[0] as NonTerminal,
    rhs: rhs[0] as Terminal,
    lookahead: '$',
    currentIndex: 0,
  })
  iTermList.push(firstIterm);

  createIterm(0);
}

function createIterm (itermIndex: number) {
  const currentIterm = iTermList[itermIndex];
  const { kernel } = currentIterm;

  for (let i=0; i<kernel.length; i++) {
    createClosure(kernel[i]);
  }

  console.log('kernel', kernel);
}

function createClosure (kernel: State) {
  const { rhs: kernelRhs, lookahead, currentIndex } = kernel;

  const currentState: State[] = [];
  const charForFind: any = [];

  let currentKernelRhs;

  do {
    if (!currentKernelRhs) {
      currentKernelRhs = {
        char: kernelRhs,
        hasTerminal: terminalList.includes(kernelRhs[currentIndex + 1] as Terminal)
      };
    }

    for (let i=0; i<lhs.length; i++) {
      if (lhs[i] === currentKernelRhs.char) {

        currentState.push({
          lhs: lhs[i] as NonTerminal,
          rhs: rhs[i],
          lookahead,
          currentIndex
        });

        const char = rhs[i][currentIndex];
        const isTerminal = terminalList.includes(char as any);
        if (!isTerminal) {
          const currentStateIndex = currentState.findIndex((item: State) => item.lhs === char);
          const charForFindIndex = charForFind.findIndex((item: any) => item.char === char);
          if (currentStateIndex === -1 && charForFindIndex === -1) {
            if (lhs.includes(char)) {
              charForFind.push({
                char,
                hasTerminal: terminalList.includes(rhs[i][currentIndex + 1] as Terminal)
              });
            }
          }
        }
      }
    }

    currentKernelRhs = charForFind.shift();
  } while (charForFind.length !== 0 || currentKernelRhs);

  console.log('currentState', currentState);
}

// const insertCurrentString = (str, number) => {
//   const strs = str.split('');
//   strs.splice(number, 0, POINT);
//   return strs.join('');
// }

init();

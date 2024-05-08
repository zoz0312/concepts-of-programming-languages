import cloneDeep from 'clone-deep';

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
  arch?: string;
  kernel: State[];
  closure: State[];
  nextKernelIndex?: number;
  prevItermIndex: number;
}

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
    E -> E + T
    E -> T
    T -> T * F
    T -> F
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
    prevItermIndex: -1,
  };
  firstIterm.kernel.push({
    lhs: lhs[0] as NonTerminal,
    rhs: rhs[0] as Terminal,
    lookahead: '$',
    currentIndex: 0,
  })
  iTermList.push(firstIterm);

  let index = 0;
  do {
    createIterm(index);
    index++;
  } while (iTermList.length > index);

  // iTermList.map(iterm => {
  //   console.log('iterm', iterm.prevItermIndex)
  // })
  iTermList.map((iterm, index) => {
    console.log('index', index);
    console.log('iterm.arch', iterm.arch);
    console.log('iterm.closure', iterm.closure);
    console.log('iterm.kernel', iterm.kernel);
    console.log('=================')
  });
}

function createIterm (itermIndex: number) {
  const currentIterm = iTermList[itermIndex];
  const { kernel } = currentIterm;


  for (let i=0; i<kernel.length; i++) {
    const closure = createClosure(kernel[i], itermIndex);
    currentIterm.closure = cloneDeep(closure as any) as [];
    gotoIterm(kernel, closure, itermIndex);
  }
}

function createClosure (kernel: State, itermIndex: number): State[] {
  const { rhs: kernelRhs, lookahead, currentIndex } = kernel;
  // console.log('kernel', kernel);

  if (!kernelRhs[currentIndex]) {
    return [];
  } else if (terminalList.includes(kernelRhs[currentIndex] as Terminal)) {
    return [];
  }

  if (itermIndex === 4) {
    console.log('kernel', kernel);
  }
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
      let stateCurrentIndex = currentKernelRhs.char[currentIndex] === 'E' ? 0 : currentIndex;
      const char = rhs[i][stateCurrentIndex];

      if (lhs[i] === currentKernelRhs.char) {
        currentState.push({
          lhs: lhs[i] as NonTerminal,
          rhs: rhs[i],
          lookahead,
          currentIndex: stateCurrentIndex,
        });

        const isTerminal = terminalList.includes(char as any);
        if (!isTerminal) {
          const currentStateIndex = currentState.findIndex((item: State) => item.lhs === char);
          const charForFindIndex = charForFind.findIndex((item: any) => item.char === char);

          if (currentStateIndex === -1 && charForFindIndex === -1) {
            if (lhs.includes(char)) {
              charForFind.push({
                char,
                hasTerminal: terminalList.includes(rhs[i][stateCurrentIndex + 1] as Terminal)
              });
            }
          }
        }
      }
    }

    currentKernelRhs = charForFind.shift();
  } while (charForFind.length !== 0 || currentKernelRhs);

  // create Derivation State
  const derivationState: State[] = [];
  for (let i=0; i<currentState.length; i++) {
    const { rhs, currentIndex } = currentState[i];
    const lookahead = rhs[currentIndex + 1] as Terminal;
    if (terminalList.includes(lookahead)) {
      for (let j=i; j<currentState.length; j++) {
        const cpState = {
          ...currentState[j],
          lookahead
        };
        derivationState.push(cpState);
      }
    }
  }

  currentState.push(...derivationState);
  // console.log('currentState', currentState);

  return currentState;
}

function gotoIterm (kernelOfIterm: State[], closureOfIterm: State[], itermIndex: number) {
  const gotoArray: {
    symbol: string;
    gotoList: any[];
  }[] = [];

  for (let i=0; i<kernelOfIterm.length; i++) {
    const kernel = { ...kernelOfIterm[i] };
    const kernelRhs = kernel.rhs[kernel.currentIndex];

    if (kernelRhs) {
      let gotoIndex = gotoArray.findIndex((item: any) => item.symbol === kernelRhs);
      if (gotoIndex === -1) {
        gotoArray.push({
          symbol: kernelRhs,
          gotoList: []
        });
        gotoIndex = gotoArray.length - 1;
      }
      gotoArray[gotoIndex].gotoList.push(kernel);
    }
  }

  for (let i=0; i<closureOfIterm.length; i++) {
    const closure = { ...closureOfIterm[i] };
    const closureRhs = closure.rhs[closure.currentIndex];

    if (closureRhs) {
      let gotoIndex = gotoArray.findIndex((item: any) => {
        return item.symbol === closureRhs;
      });
      if (gotoIndex === -1) {
        gotoArray.push({
          symbol: closureRhs,
          gotoList: []
        });
        gotoIndex = gotoArray.length - 1;
      }
      gotoArray[gotoIndex].gotoList.push(closure);
    }
  }

  // TODO: closure와 iterm끼리 비교

  // console.log('=====================');
  // console.log('gotoArray', gotoArray);
  // console.log('');

  for(let i=0; i<gotoArray.length; i++) {
    const state: any[] = gotoArray[i].gotoList.map((item:any)=> {
      item.currentIndex++;
      return item;
    });
    const matchIdx = isMatchKernelInIterm(gotoArray[i].gotoList);
    // console.log('matchIdx', matchIdx);
    if (matchIdx === -1) {
      const iterm: Iterm = {
        arch: gotoArray[i].symbol,
        kernel: cloneDeep(state),
        closure: [],
        prevItermIndex: itermIndex,
      };
      iTermList.push(iterm);
    }
  }
  return gotoArray;
}

function isMatchKernelInIterm (closures: State[]) {
  const matchItermIndex = iTermList.findIndex((iterm, index) => {
    const kernelIdx = iterm.kernel.findIndex(kernel => {
      for (let i=0; i<closures.length; i++) {
        const closure = closures[i];
        if (
            closure.lhs === kernel.lhs &&
            closure.rhs === kernel.rhs &&
            closure.currentIndex === kernel.currentIndex &&
            closure.lookahead === kernel.lookahead
        ) {
          return true;
        }
      }
      return false;
    });

    // console.log('kernelIdx', kernelIdx);
    return kernelIdx !== -1;
  });

  // console.log('matchItermIndex', matchItermIndex);
  return matchItermIndex;
}

init();

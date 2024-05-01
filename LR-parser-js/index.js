const POINT = '·';

const iTermList = [];
const lhs = [];
const rhs = [];
const GRAMMAR = {
  E: 0,
  T: 1,
  F: 2,
  '+': 3,
  '*': 4,
  'n': 5,
  '(': 6,
  ')': 7,
};

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

const createClosure = (it) => {
  const { iterm, closure } = it;
  const str = iterm[1];
  const matchIndex = [];
  for (let i=0; i<lhs.length; i++) {
    if (str === lhs[i]) {
      matchIndex.push(i);
    }
  }


  console.log('iterm', iterm);
}

function init() {
  const str =
    `E' -> E
    E -> T
    E -> E + T
    T -> F
    T -> T * F
    F -> (E)
    F -> n`.replace(/ /gi, '');
  const grammar = str.split('\n');
  grammar.map(item => {
    const [left, right] = item.split('->');
    lhs.push(left);
    rhs.push(right);
  });

  const startIterm = insertCurrentString(rhs[0], 0);
  iTermList.push({
    iterm: startIterm,
    closure: [],
  })
  createClosure(iTermList[0]);

  console.log(lhs);
  console.log(rhs);
}

const insertCurrentString = (str, number) => {
  const strs = str.split('');
  strs.splice(number, 0, POINT);
  return strs.join('');
}

init();

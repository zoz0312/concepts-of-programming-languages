//
//#define NUM_RULES 7
//#define MAX_RULE_LEN 10
//#define MAX_SYMBOLS 10
//#define MAX_ITERMS 50
//
//typedef struct {
//  char left;
//  char right[MAX_RULE_LEN];
//} Rule;
//
//typedef struct {
//  Rule rule;
//  int dotPosition;
//  char lookahead[MAX_SYMBOLS];
//} Iterm;
//
//Rule rules[NUM_RULES] = {
//    {'S', "E"},
//    {'E', "T"},
//    {'E', "E+T"},
//    {'T', "F"},
//    {'T', "T*F"},
//    {'F', "(E)"},
//    {'F', "n"}
//};
//
void addIterm();
void closure();
void printIterms();
void calculateGoto();
void setupParseTable();
int lr_main();
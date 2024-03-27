enum { PLUS, STAR, NUMBER, LP, RP, END } token;
int isNumber(char c);
void getNextToken();
void printTokenName (int key);
void error();
void expr();
void term();
void factor();
int week3_main();

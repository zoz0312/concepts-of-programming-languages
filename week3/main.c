#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include "./main.h"

int numberValue;
char expression[] = "331 + 2 * 123 * 333";
int currentIndex = 0;

int week3_main() {
    getNextToken();
    expr();
    if (token != END) {
        error();
    } else {
        printf("정상 입니다.");
    }
    return 0;
}

void getNextToken() {
    if (expression[currentIndex] == '\0') {
        token = END;
        return;
    }

    bool hasSpace;
    do {
        hasSpace = false;
        switch (expression[currentIndex]) {
            case ' ':
            case '\n':
            case '\t':
                hasSpace = true;
                currentIndex++;
                break;
        }
    } while (hasSpace);

    printf("getNextToken statement => [%c]\n", expression[currentIndex]);

    if (isNumber(expression[currentIndex])) {
        token = NUMBER;
        numberValue = 0;
        while (isNumber(expression[currentIndex])) {
            numberValue = numberValue * 10 + (expression[currentIndex] - '0');
            currentIndex++;
        }
        printf("numberValue: %d\n", numberValue);
    } else {
        switch (expression[currentIndex]) {
            case '+': token = PLUS; break;
            case '*': token = STAR; break;
            case '(': token = LP; break;
            case ')': token = RP; break;
            default: error(); return;
        }
        currentIndex++;
    }
    printTokenName(token);
}

void printTokenName (int key) {
    switch (key) {
        case 0: printf("Current Token => PLUS\n"); return;
        case 1: printf("Current Token => STAR\n"); return;
        case 2: printf("Current Token => NUMBER\n"); return;
        case 3: printf("Current Token => LP\n"); return;
        case 4: printf("Current Token => RP\n"); return;
        case 5: printf("Current Token => END\n"); return;
        default: printf("Undefined Token ENUM\n"); return;
    }
}
void expr() {
    term();
    while (token == PLUS) {
        getNextToken();
        term();
    }
    if (token == END) {
        printf("[EOF] 구문 분석을 완료하였습니다.\n");
        exit(0);
    }
}

void term() {
    factor();
    while (token == STAR) {
        getNextToken();
        factor();
    }
}

void factor() {
    if (token == NUMBER) {
        getNextToken();
    } else if (token == LP) {
        getNextToken();
        expr();
        if (token == RP) {
            getNextToken();
        } else {
            error();
        }
    } else {
        error();
    }
}

void error() {
    printf("Syntax error\n");
    exit(1);
}

int isNumber (char c) {
    return c >= '0' && c <= '9';
}

#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include "./main.h"

int numberValue; // 숫자 값을 저장할 변수
char expression[] = "331 + 2 * 123 * 333"; // 분석할 문자열
int currentIndex = 0; // 현재 문자의 인덱스

int week3_main() {
    getNextToken(); // 첫 토큰을 가져옴
    expr();
    if (token != END) { // 파싱이 끝난 후 END가 아니면 에러
        error();
    } else {
        printf("정상입니다.");
    }
    return 0;
}

void getNextToken() {
    if (expression[currentIndex] == '\0') {
        printf("마지막 문자\n");
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
            default: error(); return; // 예상치 못한 문자
        }
        currentIndex++; // 토큰을 처리했으므로 다음 문자로 이동
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
    if (token == END) { // EOF 검사
        // 여기서 EOF를 만났다면 문법적으로 옳다고 볼 수 있습니다.
        // 추가적인 처리가 필요할 수 있습니다.
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

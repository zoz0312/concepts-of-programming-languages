#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>

#define NUM_RULES 7
#define MAX_RULE_LEN 10
#define MAX_SYMBOLS 20
#define MAX_ITERMS 50

typedef struct {
  char left;
  char right[MAX_RULE_LEN];
} Rule;

typedef struct {
  Rule rule;
  int dotPosition;
  char lookahead[MAX_SYMBOLS];
} Iterm;

Rule rules[NUM_RULES] = {
    {'S', "E"},
    {'E', "T"},
    {'E', "E+T"},
    {'T', "F"},
    {'T', "T*F"},
    {'F', "(E)"},
    {'F', "n"}
};

Iterm itermList[MAX_ITERMS];
int itermCount = 0;

bool isNonTerminal(char c) {
  return c >= 'A' && c <= 'Z';
}

void calculateLookahead(char *lookahead, char *rule, int position) {
  int ruleLength = strlen(rule);
  bool isNextCharAdded = false;

  if (position < ruleLength - 1) {
    char nextChar = rule[position + 1];
    if (isNonTerminal(nextChar)) {
      int nextPosition = position + 2; // 비터미널 다음의 위치
      while (nextPosition < ruleLength && isNonTerminal(rule[nextPosition])) {
        nextPosition++;  // 다음 터미널이 나올 때까지 스킵
      }
      if (nextPosition < ruleLength) {
        char nextTerminal = rule[nextPosition];
        if (!strchr(lookahead, nextTerminal)) {
          char buffer[2] = {nextTerminal, '\0'};
          strcat(lookahead, buffer);
          isNextCharAdded = true;
        }
      }
    } else {
      if (!strchr(lookahead, nextChar)) {
        char buffer[2] = {nextChar, '\0'};
        strcat(lookahead, buffer);
        isNextCharAdded = true;
      }
    }
  }

  if (!isNextCharAdded) { // 규칙 끝에 도달했거나 다음 심볼이 없는 경우
    if (!strchr(lookahead, '$')) {
      strcat(lookahead, "$");
    }
  }
}

bool addOrUpdateIterm(Rule rule, int dot, const char *lookahead) {
  for (int i = 0; i < itermCount; i++) {
    if (memcmp(&itermList[i].rule, &rule, sizeof(Rule)) == 0 && itermList[i].dotPosition == dot) {
      if (!strstr(itermList[i].lookahead, lookahead)) {
        strcat(itermList[i].lookahead, lookahead);
        return true;
      }
      return false;
    }
  }

  Iterm newIterm = {rule, dot, ""};
  strcpy(newIterm.lookahead, lookahead);
  itermList[itermCount++] = newIterm;
  return true;
}

void calculateClosure() {
  bool added;
  do {
    added = false;
    int itemCount = itermCount;
    for (int i = 0; i < itemCount; i++) {
      Iterm *currentItem = &itermList[i];
      if (currentItem->dotPosition < strlen(currentItem->rule.right) && isNonTerminal(currentItem->rule.right[currentItem->dotPosition])) {
        char symbol = currentItem->rule.right[currentItem->dotPosition];
        char lookahead[MAX_SYMBOLS] = {0};
        calculateLookahead(lookahead, currentItem->rule.right, currentItem->dotPosition);
        for (int j = 0; j < NUM_RULES; j++) {
          if (rules[j].left == symbol) {
            if (addOrUpdateIterm(rules[j], 0, lookahead)) {
              added = true;
            }
          }
        }
      }
    }
  } while (added);
}

void printIterms() {
  for (int i = 0; i < itermCount; i++) {
    printf("Iterm %d: %c -> %s, . at %d, lookahead: %s\n",
           i, itermList[i].rule.left, itermList[i].rule.right,
           itermList[i].dotPosition, itermList[i].lookahead);
  }
}

int lr_main() {
  addOrUpdateIterm(rules[0], 0, "$");
  calculateClosure();

  printIterms();
  printf("Total iterms: %d\n", itermCount);

  return 0;
}

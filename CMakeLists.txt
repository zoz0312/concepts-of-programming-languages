cmake_minimum_required(VERSION 3.27)
project(programming_master C)

set(CMAKE_C_STANDARD 11)

add_executable(programming_master main.c
        week3/main.c
        week3/main.h
        LR1-Parser/main.h
        LR1-Parser/main.c
)

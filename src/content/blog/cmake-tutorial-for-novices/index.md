---
title: CMake tutorial for novices
date: "2016-07-08T13:11:00.000Z"
category: "Programming Languages"
tags: [ "C", "CMake", "programming languages" ]
---

I really struggled to find a decent and simple tutorial on CMake. For this reason I decided to write this one for novices like me and just get started. I'm quite sure it's not the right way of doing things, but it's simple and it works. I'm more than open to suggestions and best practices of more experienced developers of course! I'll try, as I learn new things, to update this tutorial (pinky swear :P). Cut to the chase and let's start :).

What is CMake
-------------

CMake as the official website states "is an open-source, cross-platform family of tools designed to build, test and package software". It is a simpler tool than Make, considering all the cross-platform work it does for us for free. It permits you to granularly define how your source code should be compiled giving a lot of flexibility. The downsides of such flexibility are the configuration files that ideally have to be placed on every folder of your project, to define dependencies and builds.

The project structure
---------------------

I'll consider for this tutorial a fairly common structure:
```
AwesomeProject/
|-- CMakeLists.txt
|-- build/
|-- src/
| |-- CMakeLists.txt
| |-- main.c
| |-- lib1/
| | |-- CMakeLists.txt
| | |-- file1.h
| | `-- file1.c
| `-- lib2/
|   |-- CMakeLists.txt
|   |-- file2.h
|   `-- file2.c
`-- test/
  |-- CMakeLists.txt
  |-- main.c
  |-- testLibrary/
  | |-- CMakeLists.txt
  | `-- testLibrary.h
  |-- lib1Test/
  | |-- CMakeLists.txt
  | `-- file1Test.c
  `-- lib2Test/
    |-- CMakeLists.txt
    `-- file2Test.c
```

*   `AwesomeProject/` is the root of the project. It contains only a CMakeLists.txt file (if you like you can put there all the amenities like a README.md file and so on).
*   `build/` is where we are going to build the project.
*   `src/` is the root of the source files of your project, ideally with only your executable file, all the other code should be put in separate libraries. main.c depends on lib1 and lib2.
*   `lib1/` and `lib2/` are 2 libraries you coded for your project. To spice up things a little let's decide that lib1 depends upon lib2.
*   `test/` is the root of the test files of your project, like src/ it should only have one executable file that centrally runs all of yout unit tests. main.c (in the test/ folder) depends on lib1 and lib2 (for the sake of simplicity let's not test main.c from src/).
*   `testLibrary/` is a third party library that we use to test our project. In my attempts to understand how CMake works I've used [Greatest](https://github.com/silentbicycle/greatest), it is a really small unit testing library and it has a remarkable wordplay as a name. It doesn't depend on anything.
*   `lib1Test/` and `lib2Test/` contain the unit tests for respectively lib1 and lib2. lib1Test depends on lib1, lib2 and testLibrary. lib2Test depends on lib2 and testLibrary.

CMakeLists.txt files
--------------------

CMake files are filled with a powerful scripting language composed by COMMAND (programming constructs similar to functions) and COMMENT (simple comments). To deepen your knowledge on the matter I suggest a [brief reading](https://cmake.org/Wiki/CMake/Language_Syntax). For our needs we just have to learn a few things:

*   `command_name (<argument1> <argument2> ...)` that's the COMMAND call syntax. Be aware that while the command name is case-insensitive the arguments are not. Commands are separated with a new-line.
*   `# comment` is the syntax for a single-line comment
*   to create variables for substitution we use `set (variable_name variable_value)` and to use them we use `${variable_name}`

Let's have a look on how we have to configure our CMakeLists.txt files throughout our project.

### AwesomeProject/ CMakeLists.txt
```cmake
# specifies the minimum version of CMake to compile the project.
cmake_minimum_required(VERSION 3.5)

# specifies the name of the project.
project(AwesomeProject)

# specifies custom compilation flags ([more info](https://gcc.gnu.org/onlinedocs/gcc/Warning-Options.html)).
set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -Wall -Werror")

# specifies what folders CMake should consider for the compilation, those folders needs to provide a CMakeLists.txt on their own, add_subdirectory accept relative paths.
add_subdirectory(src)
add_subdirectory(test)
```
### src/ CMakeLists.txt
```cmake
# specifies the name of the executable that it will be created and the files that will be necessary to build it.
add_executable(AwesomeProject main.c)

# we make CMake aware of the libraries lib1 and lib2.
add_subdirectory(lib1)
add_subdirectory(lib2)

# specifies what libraries should be included for the compilation of the current folder level (in this case main.c).
target_link_libraries(AwesomeProject lib1 lib2)
```
### lib1/ CMakeLists.txt
```cmake
# selects all the files in the current folder ending with the extension .h and .c and puts them in the SOURCES variable. If we wanted to select even subfolders recursively we would have used GLOB_RECURSE instead of GLOB.
file(GLOB SOURCES *.c *.h)

# defines a new library called lib1 composed by the files listed in the SOURCES variable.
add_library(lib1 ${SOURCES})

# since our lib1 has dependencies on the sibling folder lib2, we include it in the compilation process.
include_directories(../lib2)
```
### lib2/ CMakeLists.txt
```cmake
file(GLOB SOURCES *.c *.h)
add_library(lib2 ${SOURCES})
```
### test/ CMakeLists.txt
```cmake
# creates the executable for the separate build for tests.
add_executable(AwesomeProjectTest main.c)

# adds the test library.
add_subdirectory (testLibrary)

add_subdirectory(lib1Test)
add_subdirectory(lib2Test)

# since it depends on the libraries /src also, we add them as well.
target_link_libraries(AwesomeProjectTest lib1 lib2 testLibrary lib1Test lib2Test)
```
### testLibrary/ CMakeLists.txt
```cmake
file(GLOB SOURCES *.c *.h)
add_library(testLibrary ${SOURCES})

# since the test library I used (Greatest) was made up by a single .h file, I had to specify to CMake the programming language of the file hence of the library.
SET_TARGET_PROPERTIES(testLibrary PROPERTIES LINKER_LANGUAGE C)
```
### lib1Test/ CMakeLists.txt
```cmake
file(GLOB SOURCES *.c *.h)
add_library(lib1Test ${SOURCES})

include_directories(../testLibrary)
```
### lib2Test/ CMakeLists.txt
```cmake
file(GLOB SOURCES *.c *.h)
add_library(lib2Test ${SOURCES})

include_directories(../testLibrary)
```
Compilation and running
-----------------------

Assuming you are on Ubuntu Linux

1.  install cmake with `sudo apt install cmake`
2.  open the terminal go to the build folder `cd /path/to/project/AwesomeProject/build`
3.  launch `cmake ../` to create the "make" build. If you want to selectively build the src/ do `cmake ../src` and if you want to build the test/ do `cmake ../test`
4.  launch `make` to finally compile your code
5.  then you can launch either the project with `./AwesomeProject` or the tests with `./AwesomeProjectTest`

Sources
-------

*   [http://cmake.3232098.n2.nabble.com/Linking-archives-in-a-sibling-directory-td5790878.html](http://cmake.3232098.n2.nabble.com/Linking-archives-in-a-sibling-directory-td5790878.html)
*   [https://cmake.org/Wiki/CMake/Tutorials/How\_to\_create\_a\_ProjectConfig.cmake_file](https://cmake.org/Wiki/CMake/Tutorials/How_to_create_a_ProjectConfig.cmake_file)
*   [http://stackoverflow.com/questions/16398937/cmake-and-finding-other-projects-and-their-dependencies](http://stackoverflow.com/questions/16398937/cmake-and-finding-other-projects-and-their-dependencies)
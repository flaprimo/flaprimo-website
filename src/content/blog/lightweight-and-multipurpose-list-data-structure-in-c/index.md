---
title: Lightweight and multipurpose list data structure in C
date: "2016-07-30T09:26:00.000Z"
category: "Programming Languages"
tags: [  "data structures", "library", "list", "pointers", "programming languages" ]
---

In the last C project I needed a versatile list data structure. The needs for this list where:

*   lightweight on memory
*   easy to use
*   support for every kind of information I wanted to store

Given those premises, I decided to create a classic list data structure that instead of using the correct data type, it uses (void *) as the information holder.

Using a void pointer gives you a lot of flexibility because in this way you can store every kind of information you need. You can even obtain a list that holds different element types! However the use of (void *) requires a bit of a consideration.

In fact, deleting a node from the list becomes difficult because the information that is being held by the list node needs an appropriate deallocator function.

Another reason of concern is that when you get the info from a node list, you have to cast it as the element type that you know it is.

The code
--------

Code is available on [GitHub](https://github.com/flaprimo/CList) too!

### List library code

#### The header

So the header (saved in a file called "list.h") looks like this:
```c
#ifndef LIST_H
#define LIST_H

typedef struct list_t {
    void *info; // pointer to the information that the list node holds

    struct list_t *next; // pointer to the list successor
} List;

// add a list node as the first element of the list
void list_addFirst(List **l, void *info);

// add a list node as the last element of the list
void list_addLast(List **l, void *info);

// get a l->info given the position in the list
void *list_get(List *l, int index);

// remove a list node given the position in the list and a function that correctly frees the l->info pointer
void list_remove(List **l, int index, void (*freeInfo)(void *));

// remove every list node given the position in the list and a function that correctly frees the l->info pointer
void list_removeAll(List **l, void (*freeInfo)(void *));

#endif //LIST_H
```

#### The source

The source (saved in a file called “list.c”) looks like this:

```c
#include <stdlib.h>
#include "list.h"

/**
 * Given a list and an element, the element is added as the first of the list.
 * @param l list where should be added the new element
 * @param info the new element
 */
void list_addFirst(List **l, void *info)
{
    List *tmp = malloc(sizeof(List));

    tmp->info = info;
    tmp->next = *l;

    *l = tmp;
}

/**
 * Given a list and an element, the element is added at the end of the list.
 * @param l
 * @param info
 */
void list_addLast(List **l, void *info)
{
    if (*l == NULL)
        list_addFirst(l, info);
    else
        list_addLast(&(*l)->next, info);
}

/**
 * Given a list and an index, it returns the value at the position given, NULL otherwhise.
 * @param l list where to find the element
 * @param index of the element to be found
 * @return
 */
void *list_get(List *l, int index)
{
    void *result = NULL;

    if (l) {
        if (index == 0)
            result = l->info;
        else if (index > 0)
            result = list_get(l->next, --index);
    }

    return result;
}

/**
 * Given an list, an index and a destructor function for l->info, it remove the corresponding element of the list.
 * @param l list where the first element should be removed
 */
void list_remove(List **l, int index, void (*freeInfo)(void *))
{
    if (*l) {
        if (index == 0) {
            List *tmp = *l;
            *l = (*l)->next;

            freeInfo(tmp->info);
            free(tmp);
        }
        else {
            list_remove(&(*l)->next, --index, freeInfo);
        }
    }
}

/**
 * Given an list and a destructor function for l->info, it remove every element of the list.
 * @param l
 * @param freeInfo
 */
void list_removeAll(List **l, void (*freeInfo)(void *))
{
    if (*l) {
        list_remove(l, 0, freeInfo);
        list_removeAll(l, freeInfo);
    }
}
```

### Usage example

Let's give a simple usage example, with the info being a dinamically allocated integer:
```c
#include <stdlib.h>
#include <stdio.h>
#include "helper/list.h"

/**
 * Frees a (void *) that is in reality an (int *)
 * @param integerVoidPointer 
 */
void freeIntPointer(void *integerVoidPointer)
{
    if (integerVoidPointer != NULL)
        free((int *)integerVoidPointer);
}

int main()
{
    // declare the list
    List *l1;
    // list is now []

    // instantiate, initialize and add 1st element to the list
    int *i1 = malloc(sizeof(int));
    *i1 = 10;
    list_addFirst(&l1, i1);
    // list is now [10]

    // instantiate, initialize and add 2nd element to the list
    int *i2 = malloc(sizeof(int));
    *i2 = 11;
    list_addFirst(&l1, i2);
    // list is now [11, 10]

    // instantiate, initialize and add 3rd element to the list
    int *i3 = malloc(sizeof(int));
    *i3 = 12;
    list_addLast(&l1, i3);
    // list is now [11, 10, 12]

    // print the element in position 1 (that is 10)
    printf("the element in position 1 is: %d", *(int *)list_get(l1, 1));

    // remove the element that is in position 1
    list_remove(&l1, 1, freeIntPointer);
    // list is now [11, 12]

    // remove all the list elements
    list_removeAll(&l1, freeIntPointer);
    // list is now []
}
```

Conclusion
----------

This data structure is quite easy to use and requires a minimal effort to be implemented.

To enrich the functionality of this list, a wider use of function pointers is possible. For example to implement a "find" function you can provide an appropriate comparator function to correctly handle and evaluate the stored info. Functional programming functions can be implemented too, like "map" that applies a function to every element of the list returning a new modified one.

Improving the multitype handling capability of this list is easy. For example it can be added a "type" field (a string? an enum?) in the struct definition indicating the type being held in the info. In this way you can appropriately handle every type of information stored in the list.
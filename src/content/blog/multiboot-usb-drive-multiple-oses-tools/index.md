---
title: Multiboot USB drive for multiple OSes and tools
date: "2016-10-29T22:37:00.000Z"
category: "Windows"
tags: [  "OS", "startup disk", "USB" ]
---

This is the successfull procedure I adopted to create my multiboot USB drive with Ubuntu linux and Windows 10 (but you can put every bootable `.iso` or `.zip` file you want).

I have also tried [SARDU](http://www.sarducd.it/it/index.html) and [YUMI](https://www.pendrivelinux.com/yumi-multiboot-usb-creator/), but I couldn't get them to work with UEFI.

Unfortunately the entire procedure only works on a Windows OS, if someone knows a way to do the same on linux just drop a comment line.

Create multiboot USB
--------------------

1.  **Download the OSes and tools** that you want to put on your USB drive as `.iso` or `.zip` files
2.  **Download and extract tools** from [Easy2Boot official website](http://www.easy2boot.com/download/):
    *   _E2B_ \- formats and installs Easy2Boot on the USB drive
    *   _MPI Tool Pack (MakePartImage)_ \- converts `.iso` and `.zip` files to `.imgPTN`
3.  **Install Easy2Boot on a USB drive** \- go to extracted _E2B_ tool
    1.  insert a USB drive
    2.  execute as admin `MAKE_E2B_USB_DRIVE (run as admin).cmd`
    3.  select the correct USB drive
    4.  choose `NTFS`
    5.  choose preferred keyboard layout
    6.  press "Enter" to all the subsequent requests
    7.  _Check:_ at the end of the procedure the window becomes green, USB drive has been formatted and E2B is installed on the USB drive
4.  **Convert `.iso` and `.zip` files to `.imgPTN`** \- go to extracted _MPI Tool Pack (MakePartImage)_ tool
    1.  install _ImDisk_ from `ImDisk\imdiskinst.exe`
    2.  execute `CreateDesktopShortcuts.cmd`
    3.  For each downloaded `.iso` and `.zip`
        1.  Drag `.iso` or `.zip` to the newly created desktop shortcut `MPI_FAT32`
        2.  press "Enter"
        3.  _Check:_ in the same folder of your `.iso` or `.zip` it should have created the `.imgPTN` file
5.  Move created `.imgPTN` files to `\_ISO\MAINMENU` of your USB drive
6.  Execute `MAKE_THIS_DRIVE_CONTIGUOUS.cmd` from your USB drive

If you want to later add any other `.iso` or `.zip`, just start from step 4 (of course you can also delete any `.imgPTN` file you don't want anymore).

Use multiboot USB
-----------------

Now that you have prepared your E2B drive, execute `SWITCH_E2B.exe` from your E2B drive in `\_ISO` folder and double click on the OS or tool that you wish to boot with. Next time you boot your computer you will be able to boot the selected OS or tool chosen.

To get back and choose another OS or tool to boot, go to `e2b` folder, execute `SWITCH_E2B.exe` and choose "Restore E2B partitions".

Sources
-------

*   [easy2boot](http://www.easy2boot.com/)
*   [Il Software - "Chiavetta USB bootable, come prepararla"](http://www.ilsoftware.it/articoli.asp?tag=Chiavetta-USB-bootable-come-prepararla_12763)
---
title: How to install Virtualbox on Ubuntu having UEFI secure boot enabled
date: "2016-06-03T17:11:00.000Z"
category: "Programming Languages"
tags: [ "secure boot", "Ubuntu", "UEFI", "VirtualBox" ]
---

Installing Virtualbox on Ubuntu, if we have an UEFI secure boot enabled computer, it's not that difficult if we know the right steps to follow. This procedure has been tested with Ubuntu 16.04.

Instructions
------------

1.  open a terminal and install virtualbox with `sudo apt-get install virtualbox` (ignore warning and requests about disabling UEFI secure boot)
2.  create an "X.509 Key Pair": `openssl req -new -x509 -newkey rsa:2048 -keyout vboxdrv.priv -outform DER -out vboxdrv.der -nodes -days 36500 -subj "/CN=MySelf/"`
3.  sign the virtualbox module: `sudo /usr/src/linux-headers-$(uname -r)/scripts/sign-file sha256 ./vboxdrv.priv ./vboxdrv.der $(modinfo -n vboxdrv)`
4.  import the generated public key with: `sudo mokutil --import vboxdrv.der`
5.  reboot and follow the screen menus that will appear during the UEFI boot to enroll the new key. This is a persistent operation, so you’ll only need to do this once.

Check the solution
------------------

To check that the solution worked, try to run virtualbox from the terminal by simply typing `virtualbox` and check that this message **is not** present:

```
WARNING: The vboxdrv kernel module is not loaded.
Either there is no module available for the current kernel (3.15.8-200.fc20.x86_64) or it failed to load.
Please recompile the kernel module and install it by sudo /etc/init.d/vboxdrv setup
You will not be able to start VMs until this problem is fixed.
```

Sources
-------

*   [http://gorka.eguileor.com/vbox-vmware-in-secureboot-linux/](http://gorka.eguileor.com/vbox-vmware-in-secureboot-linux/)
*   [http://askubuntu.com/questions/770205/how-to-sign-kernel-modules-with-sign-file](http://askubuntu.com/questions/770205/how-to-sign-kernel-modules-with-sign-file)
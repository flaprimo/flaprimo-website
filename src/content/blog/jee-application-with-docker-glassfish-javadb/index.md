---
title: JEE application with Docker + Glassfish + JavaDB (Derby)
date: "2017-03-23T21:43:00.000Z"
category: "Programming Languages"
tags: [ "Derby", "Docker", "GlassFish", "JavaDB", "JEE" ]
---

With [Docker](https://www.docker.com/) it's easy to develop applications in an isolated, deterministic and secure environment.
So let's see how we can leverage Docker features to develop [JEE](http://www.oracle.com/technetwork/java/javaee/overview/index.html) applications.

We will see how to create a container that features [Glassfish](https://glassfish.java.net/) (the reference implementation for JEE application servers) and it's default database [JavaDB (Derby)](https://docs.oracle.com/javaee/7/tutorial/usingexamples004.htm).

To simply test how it works on a sample project you can use this one: [https://github.com/MicheleGuerriero/se2-class-example/](https://github.com/MicheleGuerriero/se2-class-example/).

Docker + Glassfish + JavaDB
---------------------------

### Instructions

1.  [install docker on your OS](https://www.docker.com/products/docker) (of course Linux is king).
2.  compile the war of your JEE application (if you happen to use maven it should be: `mvn compile war:war`). To simplify this guide I'll refer to this .war as "example-0.0.1-SNAPSHOT.war".
3.  create a folder and put there the resulting "example-0.0.1-SNAPSHOT.war" and the below described files "init_gf.sh" and "Dockerfile".
4.  open a terminal in this folder and execute `docker build -t example-IMAGE .` to build the docker image described in "Dockerfile".
5.  execute `docker run --name example-CONTAINER -p 8080:8080 -p 4848:4848 -i -t example-IMAGE` to start a container based on the created image
6.  That's all folks!

### Docker image files

The Dockerfile (saved in a file called "Dockerfile") looks like this:
```dockerfile
FROM glassfish # official Docker Glassfish image
# ADD WAR (change it accordingly to the name of your .war file)
ADD example-0.0.1-SNAPSHOT.war /usr/local/glassfish4/glassfish/domains/domain1/autodeploy/
# SETUP/START GF
ADD init_gf.sh /home/ RUN chmod +x /home/init_gf.sh CMD /home/init_gf.sh
# EXPOSE CONTAINER PORTS (8080 for the JEE application and 4848 for the Glassfish admin area)
EXPOSE 8080 4848
```
The script to setup and initialize Glassfish (saved in a file called "init\_gf.sh") looks like this:
```sh
#!/bin/sh
# change password (it's horrible, but gf seems to accept as password parameters files only...)
echo "AS_ADMIN_PASSWORD= AS_ADMIN_NEWPASSWORD=password" >> /home/gf-password.txt asadmin --user=admin --passwordfile=/home/gf-password.txt change-admin-password --domain_name domain1
rm /home/gf-password.txt
# enable secure area asadmin start-domain
echo "AS_ADMIN_PASSWORD=password" >> /home/gf-password.txt asadmin --user=admin --passwordfile=/home/gf-password.txt enable-secure-admin rm /home/gf-password.txt asadmin --user=admin stop-domain
# finally start db and glassfish
asadmin start-database
asadmin start-domain -v
```

### Additional information

*   project example url is _"http://localhost:8080/example-0.0.1-SNAPSHOT/"_
*   GF admin area url "_https://localhost:4848/"_ (user: _"admin"_ and password: _"password"_)
*   to ssh into the container execute `docker exec -i -t class-example-CONTAINER /bin/bash` tip: exploded project in the container is located here: _"/usr/local/glassfish4/glassfish/domains/domain1/applications/example-0.0.1-SNAPSHOT"_

Sources
-------

*   [Docker Glassfish image](https://github.com/glassfish/docker/blob/master/4.1.1-web/Dockerfile)
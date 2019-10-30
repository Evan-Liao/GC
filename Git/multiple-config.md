
#### 为了方便学习（摸鱼）， 需要在公司电脑配置两个不同的github账号，分别是工作，私人的账号。


##### 1.生成ssh-key:

```
ssh-keygen -t rsa -C "work@mail.com"

ssh-keygen -t rsa -C "myself@mail.com"
```

##### 2.在ssh-key目录下创建config文件

```
touch config
```

配置内容：

```
# Personal GitHub account
Host myself
 HostName github.com
 User Evan-Liao
 IdentityFile ~/.ssh/id_rsa_myself

# Work GitHub account
Host github.com
 HostName github.com
 User Lucas
 IdentityFile ~/.ssh/id_rsa_work

```

重点来了，配置文件中，根据自身需求，选择默认的`Host`。我目的是为了学习(摸鱼)，那当然选择工作账号的`ssh-key`为默认的`github.com`，个人账号把Host改为了`myself`
其他平台原理一样。

##### 3.clone使用

个人账号：
```
原指令： git clone git@github.com:Evan-Liao/blog.git
现指令： git clone git@mysel:Evan-Liao/blog.git
```

工作账号正常指令操作即可

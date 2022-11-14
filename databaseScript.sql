drop table if exists users;
create table if not exists users(
ID int not null auto_increment primary key,
privilege enum("user", "admin") not null,
username varchar(15) not null,
email varchar(15) not null,
password varchar(15) not null,
sessionID varchar(32) UNIQUE
);
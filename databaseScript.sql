drop table if exists users;
create table if not exists users(
username varchar(15) not null,
email varchar(30) not null primary key,
password varchar(15) not null,
privilege enum("user", "admin") not null,
sessionID varchar(32),
sessionIDExpires datetime
);

INSERT INTO users
VALUES ("ahmed","gimo999@hotmail.com","123", "admin","session","2022-11-14 10:50:00");

select * from users;
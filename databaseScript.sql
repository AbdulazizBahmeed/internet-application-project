-- drop table if exists users;
create table if not exists users(
username varchar(15) not null,
email varchar(30) not null primary key,
password varchar(15) not null,
privilege enum("user", "admin") not null,
sessionID varchar(32),
sessionIDExpires datetime
);


-- INSERT INTO users VALUES ("admin","admin@bakkah.com","123", "admin","0IAh5G3ce85DF54GMkqAO9I57SncURp3","2022-11-15");

-- select * from users where sessionID = "0IAh5G3ce85DF54GMkqAO9I57SncURp2" and sessionIDExpires > NOW() ;

-- select * from users where email = "admin@bakkah.com" and password = "123";

-- update users set sessionIDExpires = "exp", sessionID = "sessionID" where email = "email";

-- select * from users where sessionID = "fJ75yCw6znmDdpYuj6Xa3ANJlVWfz-WJ" and sessionIDExpires > NOW();
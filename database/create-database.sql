create table category(
    id bigint not null auto_increment primary key,
    name text not null
);

create table cafe(
    id bigint not null auto_increment primary key,
    title varchar(50) not null,
    categoryId bigint not null,
    explanation varchar(100) not null,
    foreign key(categoryId) references category(id)
);

create table post(
    id bigint not null auto_increment primary key,
    content varchar(100) not null,
    createdAt varchar(50) not null,
    cafeId bigint not null,
    author varchar(20) not null,
    foreign key(cafeId) references cafe(id)
);

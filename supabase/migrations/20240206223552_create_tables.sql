create table
    if not exists roles (id serial, name varchar(255), primary key (id));

create table
    if not exists users (
        id serial,
        first_name varchar(255),
        last_name varchar(255),
        email varchar(255) unique,
        password varchar(255),
        role_id int,
        primary key (id),
        foreign key (role_id) references roles (id)
    );

create table
    if not exists checklists (
        id serial,
        title varchar(255),
        details text,
        primary key (id)
    );

create table
    if not exists checklist_items (
        id serial,
        name varchar(255),
        details text,
        times_to_complete int,
        additional_details_required boolean,
        primary key (id)
    );

create table
    if not exists checklist_signoffs (
        id serial,
        checklist_item_id int,
        completion_status boolean,
        user_id int,
        signee_id int,
        last_updated_at timestamp,
        additional_details jsonb,
        primary key (id)
    );
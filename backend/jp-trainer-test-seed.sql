-- both test users have the password "password"

INSERT INTO users (username, password, email) 
VALUES  ('testuser',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'test@testemail.com'),
        ('testuser2',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'test2@testemail.com');

INSERT INTO kanji_sets (username, characters, name) 
VALUES  ('testuser2', ARRAY ['撤'], 'set1'),
        ('testuser2' , ARRAY ['協', '刊'], 'set2');

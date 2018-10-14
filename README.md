# mysql-bricks
sql-bricks extension for MySQL

mysql-bricks is an extension to the awesome [sql-bricks library], that helps generate SQL statements for MySQL DB. It adds MySQL specific functions and formatting on top of the sql-bricks functionality.


## Installation

Requires Node.js V6+ and ECMAScript 6 to run

```sh
$ npm install mysql-bricks
```

## Usage

see  sql-bricks [documentation] for common SELECT, INSERT, UPDATE and DELETE functionality. Below are examples of usage for the MySQL-specific functionality:

#### INSERT ... ON DUPLICATE KEY UPDATE ...

```javascript
let values = [[123, 'Daniel', 41, 92], [456, 'David', 34, 87], [789, 'Rachel', 22, 98]];  
let query = sql.insert('main.some_table', 'id', 'name', 'age', 'grade')
                .values(values)
                .onDuplicateKeyUpdate(['grade'])
                .toString();
/*                
INSERT INTO main.some_table (id, name, age, grade)
VALUES (123, \'Moshe\', 41, 92),  (456, \'David\', 34, 87), (789, \'Rachel\', 22, 98)
ON DUPLICATE KEY UPDATE grade = VALUES(grade)
*/
```

#### INSERT IGNORE ...

```javascript
let values = [[123, 'Daniel', 41, 92], [456, 'David', 34, 87], [789, 'Rachel', 22, 98]];  
let query = sql.insert('main.some_table', 'id', 'name', 'age', 'grade')
                .ignore()
                .values(values)
                .toString();
/*                
INSERT IGNORE INTO main.some_table (id, name, age, grade)
VALUES (123, \'Moshe\', 41, 92),  (456, \'David\', 34, 87), (789, \'Rachel\', 22, 98)
*/
```

#### LIMIT (SELECT / UPDATE / DELETE)

```javascript
let query = sql.select().from('main.some_table').limit(100).toString();
/*                
SELECT * FROM main.some_table LIMIT 100
*/
```

MySQL supports optional 'limit' clause in UPDATE and DELETE queries:

```javascript
let query = sql.delete('main.some_table').limit(100).toString();
/*                
DELETE FROM main.some_table LIMIT 100
*/
```

#### OFFSET

```javascript
let query = sql.select().from('main.some_table').limit(100).offset(50).toString();
/*                
SELECT * FROM main.some_table LIMIT 100 OFFSET 50
*/
```

#### ORDER BY (UPDATE / DELETE)

MySQL supports optional 'order by' clause in UPDATE and DELETE queries:

```javascript
let query = sql.update('main.some_table', { grade: 90})
                .where(sql.gt('grade', 90))
                .orderBy('age desc')
                .limit(100)
                .toString();
/*                
UPDATE main.some_table SET grade = 90 WHERE grade > 90 ORDER BY age desc LIMIT 100
*/
```

## Contribute

Supported MySQL specific functions are the most common ones as used by me, but if you find something missing - feel free to open an issue, or better yet - a pull request!

[sql-bricks library]: <http://csnw.github.io/sql-bricks/>
[documentation]: <http://csnw.github.io/sql-bricks/>

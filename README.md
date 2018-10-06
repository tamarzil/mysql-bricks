# mysql-bricks
sql-bricks extension for MySQL

mysql-bricks is an extension to the awesome [sql-bricks library], that helps generate SQL statements for MySQL DB. It adds MySQL specific functions and formatting on top of the sql-bricks functionality.


## Installation - This code will be added as an npm package shortly! 

Requires Node.js V6+ and ECMAScript 6 to run

```sh
$ npm install mysql-bricks
```

## Usage

see  sql-bricks [documentation] for common SELECT, INSERT, UPDATE and DELETE functionality. Below are examples of usage for the MySQL-specific functionality:

#### INSERT ... ON DUPLICATE UPDATE ...

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

#### LIMIT

```javascript
let query = sql.select().from('main.some_table').limit(100).toString();
/*                
SELECT * FROM main.some_table LIMIT 100
*/
```

#### OFFSET

```javascript
let query = sql.select().from('main.some_table').limit(100).offset(50).toString();
/*                
SELECT * FROM main.some_table LIMIT 100 OFFSET 50
*/
```


## Contribute

Supported MySQL specific functions are the most common ones as used by me, but if you find something missing - feel free to open an issue, or better yet - a pull request!

[sql-bricks library]: <http://csnw.github.io/sql-bricks/>
[documentation]: <http://csnw.github.io/sql-bricks/>

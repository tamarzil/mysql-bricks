'use strict';

const expect = require('chai').expect;
const sql = require('./index.js');

/*
These are tests for the extension to 'sql-bricks' library, which is meant to add mysql-specific functionality to the general
'sql-bricks' library. The 'sql-bricks' library is well tested, so the tests below cover only the extension functionality, which includes
only a few functions
 */

describe("MySQL Query Builder Tests", function () {

    describe("insert", function () {

        it("should return correct insert query when using '.onDuplicateKeyUpdate' option with single column update", function () {

            let values = [[123, 'Moshe', 41, 92], [456, 'David', 34, 87], [789, 'Rachel', 22, 98]];

            let expectedQuery = 'INSERT INTO main.some_table (id, name, age, grade) ' +
                'VALUES (123, \'Moshe\', 41, 92),  (456, \'David\', 34, 87), (789, \'Rachel\', 22, 98) ' +
                'ON DUPLICATE KEY UPDATE grade = VALUES(grade)';

            let actualQuery = sql.insert('main.some_table', 'id', 'name', 'age', 'grade')
                .values(values)
                .onDuplicateKeyUpdate(['grade'])
                .toString();

            return expect(actualQuery).to.equal(expectedQuery.replace(/\n/g, ' ').replace(/\s\s+/g, ' '));
        });

        it("should return correct insert query when using '.onDuplicateKeyUpdate' option with multiple column update", function () {

            let values = [[123, 'Moshe', 41, 92], [456, 'David', 34, 87], [789, 'Rachel', 22, 98]];

            let expectedQuery = 'INSERT INTO main.some_table (id, name, age, grade) ' +
                'VALUES (123, \'Moshe\', 41, 92),  (456, \'David\', 34, 87), (789, \'Rachel\', 22, 98) ' +
                'ON DUPLICATE KEY UPDATE age = VALUES(age), grade = VALUES(grade)';

            let actualQuery = sql.insert('main.some_table', 'id', 'name', 'age', 'grade')
                .values(values)
                .onDuplicateKeyUpdate(['age', 'grade'])
                .toString();

            return expect(actualQuery).to.equal(expectedQuery.replace(/\n/g, ' ').replace(/\s\s+/g, ' '));
        });

        it("should return correct insert query when using '.onDuplicateKeyUpdate' option with column-value pair", function () {

            let values = [[123, 'Moshe', 41, 92, 0], [456, 'David', 34, 87, 0], [789, 'Rachel', 22, 98, 0]];

            let expectedQuery = 'INSERT INTO main.some_table (id, name, age, grade, counter) ' +
                'VALUES (123, \'Moshe\', 41, 92, 0),  (456, \'David\', 34, 87, 0), (789, \'Rachel\', 22, 98, 0) ' +
                'ON DUPLICATE KEY UPDATE age = VALUES(age), grade = VALUES(grade), counter = counter + 1';

            let actualQuery = sql.insert('main.some_table', 'id', 'name', 'age', 'grade', 'counter')
                .values(values)
                .onDuplicateKeyUpdate(['age', 'grade', { counter: 'counter + 1' }])
                .toString();

            return expect(actualQuery).to.equal(expectedQuery.replace(/\n/g, ' ').replace(/\s\s+/g, ' '));
        });

        it("should ignore '.onDuplicateKeyUpdate' when cols is null", function () {

            let values = [[123, 'Moshe', 41, 92], [456, 'David', 34, 87], [789, 'Rachel', 22, 98]];

            let expectedQuery = 'INSERT INTO main.some_table (id, name, age, grade) ' +
                'VALUES (123, \'Moshe\', 41, 92),  (456, \'David\', 34, 87), (789, \'Rachel\', 22, 98)';

            let actualQuery = sql.insert('main.some_table', 'id', 'name', 'age', 'grade')
                .values(values)
                .onDuplicateKeyUpdate()
                .toString();

            return expect(actualQuery).to.equal(expectedQuery.replace(/\n/g, ' ').replace(/\s\s+/g, ' '));
        });

        it("should ignore '.onDuplicateKeyUpdate' when cols is not array", function () {

            let values = [[123, 'Moshe', 41, 92], [456, 'David', 34, 87], [789, 'Rachel', 22, 98]];

            let expectedQuery = 'INSERT INTO main.some_table (id, name, age, grade) ' +
                'VALUES (123, \'Moshe\', 41, 92),  (456, \'David\', 34, 87), (789, \'Rachel\', 22, 98)';

            let actualQuery = sql.insert('main.some_table', 'id', 'name', 'age', 'grade')
                .values(values)
                .onDuplicateKeyUpdate('grade')
                .toString();

            return expect(actualQuery).to.equal(expectedQuery.replace(/\n/g, ' ').replace(/\s\s+/g, ' '));
        });

        it("should ignore '.onDuplicateKeyUpdate' when cols empty array", function () {

            let values = [[123, 'Moshe', 41, 92], [456, 'David', 34, 87], [789, 'Rachel', 22, 98]];

            let expectedQuery = 'INSERT INTO main.some_table (id, name, age, grade) ' +
                'VALUES (123, \'Moshe\', 41, 92),  (456, \'David\', 34, 87), (789, \'Rachel\', 22, 98)';

            let actualQuery = sql.insert('main.some_table', 'id', 'name', 'age', 'grade')
                .values(values)
                .onDuplicateKeyUpdate([])
                .toString();

            return expect(actualQuery).to.equal(expectedQuery.replace(/\n/g, ' ').replace(/\s\s+/g, ' '));
        });

        it("should return correct insert query when using 'ignore'", function () {

            let values = [[123, 'Moshe', 41, 92], [456, 'David', 34, 87], [789, 'Rachel', 22, 98]];

            let expectedQuery = 'INSERT IGNORE INTO main.some_table (id, name, age, grade) ' +
                'VALUES (123, \'Moshe\', 41, 92),  (456, \'David\', 34, 87), (789, \'Rachel\', 22, 98)';

            let actualQuery = sql.insert('main.some_table', 'id', 'name', 'age', 'grade')
                .ignore()
                .values(values)
                .toString();

            return expect(actualQuery).to.equal(expectedQuery.replace(/\n/g, ' ').replace(/\s\s+/g, ' '));
        });

        it("should quote reserved words with grave accent (backtick)", function () {

            let values = [[123, 'Moshe', 41, 92], [456, 'David', 34, 87], [789, 'Rachel', 22, 98]];

            let expectedQuery = 'INSERT INTO main.some_table (`user`, name, `order`, grade) ' +
                'VALUES (123, \'Moshe\', 41, 92),  (456, \'David\', 34, 87), (789, \'Rachel\', 22, 98)';

            let actualQuery = sql.insert('main.some_table', 'user', 'name', 'order', 'grade')
                .values(values)
                .toString();

            return expect(actualQuery).to.equal(expectedQuery.replace(/\n/g, ' ').replace(/\s\s+/g, ' '));
        });
    });

    describe("select", function () {

        it("should return correct select query using limit", function () {

            let expectedQuery = 'SELECT * FROM main.some_table LIMIT 100';

            let actualQuery = sql.select().from('main.some_table').limit(100).toString();

            return expect(actualQuery).to.equal(expectedQuery.replace(/\n/g, ' ').replace(/\s\s+/g, ' '));
        });

        it("should ignore limit when value is null", function () {

            let expectedQuery = 'SELECT * FROM main.some_table';

            let actualQuery = sql.select().from('main.some_table').limit().toString();

            return expect(actualQuery).to.equal(expectedQuery.replace(/\n/g, ' ').replace(/\s\s+/g, ' '));
        });

        it("should return correct select query using limit and offset", function () {

            let expectedQuery = 'SELECT * FROM main.some_table LIMIT 100 OFFSET 50';

            let actualQuery = sql.select().from('main.some_table').limit(100).offset(50).toString();

            return expect(actualQuery).to.equal(expectedQuery.replace(/\n/g, ' ').replace(/\s\s+/g, ' '));
        });

        it("should ignore offset when value is null", function () {

            let expectedQuery = 'SELECT * FROM main.some_table LIMIT 100';

            let actualQuery = sql.select().from('main.some_table').limit(100).offset().toString();

            return expect(actualQuery).to.equal(expectedQuery.replace(/\n/g, ' ').replace(/\s\s+/g, ' '));
        });
    });

    describe("delete", function() {

        it("should return correct delete query with limit", function () {

            let expectedQuery = 'DELETE FROM main.some_table LIMIT 100';

            let actualQuery = sql.delete('main.some_table').limit(100).toString();

            return expect(actualQuery).to.equal(expectedQuery.replace(/\n/g, ' ').replace(/\s\s+/g, ' '));
        });

        it("should return correct delete query with where and limit", function () {

            let expectedQuery = 'DELETE FROM main.some_table WHERE id > 200 LIMIT 100';

            let actualQuery = sql.delete('main.some_table').where(sql.gt('id', 200)).limit(100).toString();

            return expect(actualQuery).to.equal(expectedQuery.replace(/\n/g, ' ').replace(/\s\s+/g, ' '));
        });

        it("should return correct delete query with order by when passing columns as array", function () {

            let expectedQuery = 'DELETE FROM main.some_table ORDER BY name,age desc,grade';

            let actualQuery = sql.delete('main.some_table').orderBy(['name', 'age desc', 'grade']).toString();

            return expect(actualQuery).to.equal(expectedQuery.replace(/\n/g, ' ').replace(/\s\s+/g, ' '));
        });

        it("should return correct delete query with order by when passing columns as separate arguments", function () {

            let expectedQuery = 'DELETE FROM main.some_table ORDER BY name, age desc, grade';

            let actualQuery = sql.delete('main.some_table').orderBy('name', 'age desc', 'grade').toString();

            return expect(actualQuery).to.equal(expectedQuery.replace(/\n/g, ' ').replace(/\s\s+/g, ' '));
        });

        it("should return correct delete query without order by when passing null", function () {

            let expectedQuery = 'DELETE FROM main.some_table';

            let actualQuery = sql.delete('main.some_table').orderBy().toString();

            return expect(actualQuery).to.equal(expectedQuery.replace(/\n/g, ' ').replace(/\s\s+/g, ' '));
        });

        it("should return correct delete query without order by when passing empty array", function () {

            let expectedQuery = 'DELETE FROM main.some_table';

            let actualQuery = sql.delete('main.some_table').orderBy([]).toString();

            return expect(actualQuery).to.equal(expectedQuery.replace(/\n/g, ' ').replace(/\s\s+/g, ' '));
        });

        it("should return correct delete query without order by when passing empty string", function () {

            let expectedQuery = 'DELETE FROM main.some_table';

            let actualQuery = sql.delete('main.some_table').orderBy('').toString();

            return expect(actualQuery).to.equal(expectedQuery.replace(/\n/g, ' ').replace(/\s\s+/g, ' '));
        });

        it("should return correct delete query with order by and limit", function () {

            let expectedQuery = 'DELETE FROM main.some_table ORDER BY name, age desc, grade LIMIT 100';

            let actualQuery = sql.delete('main.some_table')
                .orderBy('name', 'age desc', 'grade')
                .limit(100)
                .toString();

            return expect(actualQuery).to.equal(expectedQuery.replace(/\n/g, ' ').replace(/\s\s+/g, ' '));
        });
    })

    describe("update", function() {     // not repeating similar tests for limit and order by in "delete" class

        it("should return correct update query with limit clause", function () {

            let expectedQuery = 'UPDATE main.some_table SET grade = 90 LIMIT 100';

            let actualQuery = sql.update('main.some_table', { grade: 90}).limit(100).toString();

            return expect(actualQuery).to.equal(expectedQuery.replace(/\n/g, ' ').replace(/\s\s+/g, ' '));
        });

        it("should return correct update query with where, limit clauses", function () {

            let expectedQuery = 'UPDATE main.some_table SET grade = 90 WHERE grade > 90 LIMIT 100';

            let actualQuery = sql.update('main.some_table', { grade: 90}).where(sql.gt('grade', 90)).limit(100).toString();

            return expect(actualQuery).to.equal(expectedQuery.replace(/\n/g, ' ').replace(/\s\s+/g, ' '));
        });

        it("should return correct update query with order by clause", function () {

            let expectedQuery = 'UPDATE main.some_table SET grade = 90 ORDER BY age desc';

            let actualQuery = sql.update('main.some_table', { grade: 90}).orderBy('age desc').toString();

            return expect(actualQuery).to.equal(expectedQuery.replace(/\n/g, ' ').replace(/\s\s+/g, ' '));
        });

        it("should return correct update query with where, order by, limit clauses", function () {

            let expectedQuery = 'UPDATE main.some_table SET grade = 90 WHERE grade > 90 ORDER BY age desc LIMIT 100';

            let actualQuery = sql.update('main.some_table', { grade: 90})
                .where(sql.gt('grade', 90))
                .orderBy('age desc')
                .limit(100)
                .toString();

            return expect(actualQuery).to.equal(expectedQuery.replace(/\n/g, ' ').replace(/\s\s+/g, ' '));
        });
        
    });
});

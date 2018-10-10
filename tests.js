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
});

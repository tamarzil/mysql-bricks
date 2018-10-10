'use strict';

const sql = require('sql-bricks');

let mysqlBricks = sql._extension();

// unfortunately, for now, this can only be done by overriding sql-bricks module itself
// see issue https://github.com/CSNW/sql-bricks/issues/104
sql._autoQuoteChar = '`';

// LIMIT
mysqlBricks.select.prototype.limit = function(val) {
    this._limit = val;
    return this;
};

mysqlBricks.select.defineClause(
    'limit',
    '{{#ifNotNull _limit}}LIMIT {{_limit}}{{/ifNotNull}}',
    { after: 'orderBy' }
);

// OFFSET
mysqlBricks.select.prototype.offset = function(val) {
    this._offset = val;
    return this;
};

mysqlBricks.select.defineClause(
    'offset',
    '{{#ifNotNull _offset}}OFFSET {{_offset}}{{/ifNotNull}}',
    { after: 'limit' }
);

// ON DUPLICATE KEY UPDATE
mysqlBricks.insert.prototype.onDuplicateKeyUpdate = function(cols) {
    this._onDuplicateColumns = cols;
    return this;
};

mysqlBricks.insert.defineClause('onDuplicateKeyUpdate',
    function() {
        if(!this._onDuplicateColumns || !Array.isArray(this._onDuplicateColumns) || this._onDuplicateColumns.length <= 0) {
            return;
        }
        return 'ON DUPLICATE KEY UPDATE ' + this._onDuplicateColumns.map(function(col) {
            col = sql._handleColumn(col, null);
            return `${col} = VALUES(${col})`;
        }).join(', ');
    },
    {after: 'values'}
);

// IGNORE
mysqlBricks.insert.prototype.ignore = function() {
    this._insertIgnore = true;
    return this;
};

mysqlBricks.insert.defineClause('ignore', '{{#if _insertIgnore}}IGNORE{{/if}}', { after: 'insert' });

// TODO: Replace


module.exports = mysqlBricks;

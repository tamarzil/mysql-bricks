'use strict';

const sql = require('sql-bricks');

let mysqlBricks = sql._extension();

// unfortunately, for now, this can only be done by overriding sql-bricks module itself
// see issue https://github.com/CSNW/sql-bricks/issues/104
sql._autoQuoteChar = '`';


// DELETE / UPDATE ... ORDER BY
mysqlBricks.delete.prototype.orderBy = mysqlBricks.update.prototype.orderBy = function() {
    this._orderBy = Array.from(arguments);
    return this;
};

let orderByClauseFunction = function() {
        if(!this._orderBy || this._orderBy.length <= 0 || (this._orderBy.length === 1 && this._orderBy[0].length <= 0)) {
            return;
        }
        return 'ORDER BY ' + this._orderBy.map(col => sql._handleColumn(col, null)).join(', ');
    };

// '{{#ifNotNull _orderBy}}ORDER BY {{_orderBy}}{{/ifNotNull}}';
mysqlBricks.delete.defineClause('orderBy', orderByClauseFunction, { after: 'where' });
mysqlBricks.update.defineClause('orderBy', orderByClauseFunction, { after: 'where' });

// SELECT / UPDATE / DELETE ... LIMIT
mysqlBricks.select.prototype.limit = mysqlBricks.delete.prototype.limit = mysqlBricks.update.prototype.limit = function(val) {
    this._limit = val;
    return this;
};

let limitClause = '{{#ifNotNull _limit}}LIMIT {{_limit}}{{/ifNotNull}}';
mysqlBricks.select.defineClause('limit', limitClause, { after: 'orderBy' });
mysqlBricks.update.defineClause('limit', limitClause, { after: 'orderBy' });
mysqlBricks.delete.defineClause('limit', limitClause, { after: 'orderBy' });

// SELECT ... OFFSET
mysqlBricks.select.prototype.offset = function(val) {
    this._offset = val;
    return this;
};

mysqlBricks.select.defineClause(
    'offset',
    '{{#ifNotNull _offset}}OFFSET {{_offset}}{{/ifNotNull}}',
    { after: 'limit' }
);

// INSERT ... ON DUPLICATE KEY UPDATE
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

// INSERT IGNORE ...
mysqlBricks.insert.prototype.ignore = function() {
    this._insertIgnore = true;
    return this;
};

mysqlBricks.insert.defineClause('ignore', '{{#if _insertIgnore}}IGNORE{{/if}}', { after: 'insert' });


// TODO: The ORDER BY and LIMIT clauses of the UPDATE and DELETE statements + tests
// TODO: extend on duplicate key update - allow expression
// Replace ?



module.exports = mysqlBricks;

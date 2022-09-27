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

const limitClauseFunction = function() {
    if(this._limit) {
        return `LIMIT ${this._limit}`
    }
}

// '{{#ifNotNull _limit}}LIMIT {{_limit}}{{/ifNotNull}}';
mysqlBricks.select.defineClause('limit', limitClauseFunction, { after: 'orderBy' });
mysqlBricks.update.defineClause('limit', limitClauseFunction, { after: 'orderBy' });
mysqlBricks.delete.defineClause('limit', limitClauseFunction, { after: 'orderBy' });

// SELECT ... OFFSET
mysqlBricks.select.prototype.offset = function(val) {
    this._offset = val;
    return this;
};

const offsetClauseFunction = function() {
    if(this._offset) {
        return `OFFSET ${this._offset}`
    }
}

// '{{#ifNotNull _offset}}OFFSET {{_offset}}{{/ifNotNull}}'
mysqlBricks.select.defineClause(
    'offset',
    offsetClauseFunction,
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
            if (col.constructor === "".constructor) { // is string
                col = sql._handleColumn(col, null);
                return `${col} = VALUES(${col})`;
            } else if (col.constructor === {}.constructor && Object.keys(col).length > 0) { // is column-value pair object
                let colKey = Object.keys(col)[0];
                let colValue = col[colKey];
                colKey = sql._handleColumn(colKey, null);
                return `${colKey} = ${colValue}`;
            }
        }).join(', ');
    },
    {after: 'values'}
);

// INSERT IGNORE ...
mysqlBricks.insert.prototype.ignore = function() {
    this._insertIgnore = true;
    return this;
};

const defineClauseFunction = function() {
    return this._insertIgnore? "IGNORE": undefined
}

// '{{#if _insertIgnore}}IGNORE{{/if}}'
mysqlBricks.insert.defineClause('ignore', defineClauseFunction, { after: 'insert' });



module.exports = mysqlBricks;

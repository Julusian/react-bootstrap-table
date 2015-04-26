"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var React = _interopRequire(require("react"));

var Const = _interopRequire(require("./Const"));

var TableRow = _interopRequire(require("./TableRow"));

var TableColumn = _interopRequire(require("./TableColumn"));

var TableEditColumn = _interopRequire(require("./TableEditColumn"));

var classSet = _interopRequire(require("classnames"));

var TableBody = (function (_React$Component) {
  function TableBody(props) {
    _classCallCheck(this, TableBody);

    _get(Object.getPrototypeOf(TableBody.prototype), "constructor", this).call(this, props);
    this.state = {
      currEditCell: null
    };
  }

  _inherits(TableBody, _React$Component);

  _createClass(TableBody, {
    render: {
      value: function render() {
        var containerClasses = classSet("table-container");

        var tableClasses = classSet("table", "table-bordered", {
          "table-striped": this.props.striped,
          "table-hover": this.props.hover,
          "table-condensed": this.props.condensed
        });

        var isSelectRowDefined = this._isSelectRowDefined();
        var tableHeader = this.renderTableHeader(isSelectRowDefined);

        var tableRows = this.props.data.map(function (data, r) {
          var tableColumns = this.props.columns.map(function (column, i) {
            var fieldValue = data[column.name];
            if (!this.props.parentRender && this.state.currEditCell != null && this.state.currEditCell.rid == r + 1 && this.state.currEditCell.cid == i + 1) {
              return React.createElement(
                TableEditColumn,
                { completeEdit: this.handleCompleteEditCell.bind(this),
                  blurToSave: this.props.cellEdit.blurToSave,
                  rowIndex: r,
                  colIndex: i },
                fieldValue
              );
            } else {
              if (typeof column.format !== "undefined") {
                var formattedValue = column.format(fieldValue, data);
                return React.createElement(
                  TableColumn,
                  { dataAlign: column.align,
                    cellEdit: this.props.cellEdit,
                    onEdit: this.handleEditCell.bind(this) },
                  React.createElement("div", { dangerouslySetInnerHTML: { __html: formattedValue } })
                );
              } else {
                return React.createElement(
                  TableColumn,
                  { dataAlign: column.align,
                    cellEdit: this.props.cellEdit,
                    onEdit: this.handleEditCell.bind(this) },
                  fieldValue
                );
              }
            }
          }, this);
          var selectRowColumn = isSelectRowDefined ? this.renderSelectRowColumn(data.__selected__) : null;
          return React.createElement(
            TableRow,
            { isSelected: data.__selected__,
              selectRow: isSelectRowDefined ? this.props.selectRow : undefined },
            selectRowColumn,
            tableColumns
          );
        }, this);

        return React.createElement(
          "div",
          { className: containerClasses },
          React.createElement(
            "table",
            { className: tableClasses },
            tableHeader,
            React.createElement(
              "tbody",
              null,
              tableRows
            )
          )
        );
      }
    },
    renderTableHeader: {
      value: function renderTableHeader(isSelectRowDefined) {
        var selectRowHeader = null;

        if (isSelectRowDefined) {
          var style = {
            width: 35
          };
          selectRowHeader = React.createElement("th", { style: style });
        }
        var theader = this.props.columns.map(function (column) {
          return React.createElement("th", null);
        });

        return React.createElement(
          "thead",
          null,
          React.createElement(
            "tr",
            null,
            selectRowHeader,
            theader
          )
        );
      }
    },
    handleSelectColum: {
      value: function handleSelectColum(e) {
        if (!this.props.selectRow.clickToSelect) {
          this.props.selectRow.__onSelect__(e.currentTarget.parentElement.parentElement.rowIndex, e.currentTarget.checked);
        }
      }
    },
    handleEditCell: {
      value: function handleEditCell(rowIndex, columnIndex) {
        this.props.parentRender = false;
        this.setState({ currEditCell: {
            rid: rowIndex,
            cid: columnIndex
          } });
      }
    },
    handleCompleteEditCell: {
      value: function handleCompleteEditCell(newVal, rowIndex, columnIndex) {
        this.setState({ currEditCell: null });
        if (null != newVal) this.props.cellEdit.__onCompleteEdit__(newVal, rowIndex, columnIndex);
      }
    },
    renderSelectRowColumn: {
      value: function renderSelectRowColumn(selected) {
        if (this.props.selectRow.mode == Const.ROW_SELECT_SINGLE) {
          return React.createElement(
            TableColumn,
            null,
            React.createElement("input", { type: "radio", name: "selection", checked: selected, onChange: this.handleSelectColum.bind(this) })
          );
        } else {
          return React.createElement(
            TableColumn,
            null,
            React.createElement("input", { type: "checkbox", checked: selected, onChange: this.handleSelectColum.bind(this) })
          );
        }
      }
    },
    _isSelectRowDefined: {
      value: function _isSelectRowDefined() {
        return this.props.selectRow.mode == Const.ROW_SELECT_SINGLE || this.props.selectRow.mode == Const.ROW_SELECT_MULTI;
      }
    }
  });

  return TableBody;
})(React.Component);

TableBody.propTypes = {
  data: React.PropTypes.array,
  columns: React.PropTypes.array,
  striped: React.PropTypes.bool,
  hover: React.PropTypes.bool,
  condensed: React.PropTypes.bool,
  // if render is from parent, I will discard the cell edit checking
  // because of a bug happened if user click to start a cell editing and then he/she do a sort or change page
  // that will cause a incorrent position of "input cell" on table.
  parentRender: React.PropTypes.bool
};
module.exports = TableBody;
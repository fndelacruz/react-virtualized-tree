import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {AutoSizer, List, CellMeasurerCache, CellMeasurer} from 'react-virtualized';

import {FlattenedNode} from './shapes/nodeShapes';

export default class Tree extends React.Component {
  _cache = new CellMeasurerCache({
    fixedWidth: true,
    minHeight: 20,
  });

  rowRenderer = ({node, key, measure, style, NodeRenderer, selectedMap, treeNodeSelectedClass}) => {
    const {nodePaddingLeft} = this.props;
    const className = classNames("tree-node", {[treeNodeSelectedClass]: selectedMap[node.id]});
    return (
      <div key={key} className={className} style={{...style, paddingLeft: node.deepness * nodePaddingLeft}}>
        <NodeRenderer node={node} onChange={this.props.onChange} measure={measure} />
      </div>
    );
  };

  measureRowRenderer = (nodes, selectedMap, treeNodeSelectedClass) => ({key, index, style, parent}) => {
    const {NodeRenderer} = this.props;
    const node = nodes[index];

    return (
      <CellMeasurer cache={this._cache} columnIndex={0} key={key} rowIndex={index} parent={parent}>
        {m => this.rowRenderer({...m, node, key, style, NodeRenderer, selectedMap, treeNodeSelectedClass})}
      </CellMeasurer>
    );
  };

  render() {
    const {nodes, width, scrollToIndex, selectedMap, treeNodeSelectedClass = ""} = this.props;

    return (
      <AutoSizer disableWidth={Boolean(width)}>
        {({height, width: autoWidth}) => (
          <List
            deferredMeasurementCache={this._cache}
            ref={r => (this._list = r)}
            height={height}
            rowCount={nodes.length}
            rowHeight={this._cache.rowHeight}
            rowRenderer={this.measureRowRenderer(nodes, selectedMap, treeNodeSelectedClass)}
            width={width || autoWidth}
            scrollToIndex={scrollToIndex}
          />
        )}
      </AutoSizer>
    );
  }
}

Tree.propTypes = {
  nodes: PropTypes.arrayOf(PropTypes.shape(FlattenedNode)).isRequired,
  NodeRenderer: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  nodePaddingLeft: PropTypes.number,
  width: PropTypes.number,
  treeNodeSelectedClass: PropTypes.string,
  selectedMap: PropTypes.object.isRequired,
};

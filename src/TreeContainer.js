import React from 'react';
import PropTypes from 'prop-types';

import Tree from './Tree';
import {UPDATE_TYPE} from './contants';
import {getFlattenedTree} from './selectors/getFlattenedTree';
import {deleteNodeFromTree, replaceNodeFromTree, getRowIndexFromId} from './selectors/nodes';
import {Node} from './shapes/nodeShapes';
import {createSelector} from 'reselect';

const DEFAULT_UPDATE_TYPES = {
  [UPDATE_TYPE.DELETE]: deleteNodeFromTree,
  [UPDATE_TYPE.UPDATE]: replaceNodeFromTree,
};

const getExtensions = createSelector(
  e => e,
  (extensions = {}) => {
    const {updateTypeHandlers = {}} = extensions;

    return {
      updateTypeHandlers: {
        ...DEFAULT_UPDATE_TYPES,
        ...updateTypeHandlers,
      },
    };
  },
);

export default class TreeContainer extends React.Component {
  static contextTypes = {
    unfilteredNodes: PropTypes.arrayOf(PropTypes.shape(Node)),
  };

  get nodes() {
    return this.context.unfilteredNodes || this.props.nodes;
  }

  handleChange = ({node, type}) => {
    const updatedNodes = getExtensions(this.props.extensions).updateTypeHandlers[type](this.nodes, node);

    this.props.onChange(updatedNodes);
  };

  render() {
    const flattenedTree = getFlattenedTree(this.props.nodes);
    const rowIndex = getRowIndexFromId(flattenedTree, this.props.scrollToId);
    return (
      <Tree
        nodePaddingLeft={this.props.nodePaddingLeft}
        extraClasses={this.props.extraClasses}
        selectedMap={this.props.selectedMap}
        nodes={flattenedTree}
        onChange={this.handleChange}
        NodeRenderer={this.props.children}
        scrollToIndex={rowIndex}
      />
    );
  }
}

TreeContainer.propTypes = {
  extensions: PropTypes.shape({
    updateTypeHandlers: PropTypes.object,
  }),
  nodes: PropTypes.arrayOf(PropTypes.shape(Node)).isRequired,
  onChange: PropTypes.func,
  children: PropTypes.func.isRequired,
  nodePaddingLeft: PropTypes.number,
  width: PropTypes.number,
  scrollToId: PropTypes.number,
  extraClasses: PropTypes.shape({
    treeNodeSelectedClass: PropTypes.string,
    treeNodeChildSelectedClass: PropTypes.string,
  }),
  selectedMap: PropTypes.object.isRequired,
};

TreeContainer.defaultProps = {
  nodePaddingLeft: 30,
  extraClasses: {}
};

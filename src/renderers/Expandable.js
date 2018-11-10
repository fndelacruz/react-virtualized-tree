import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import {submitEvent} from '../eventWrappers';
import {updateNode} from '../selectors/nodes';
import {Renderer} from '../shapes/rendererShapes';

const Expandable = ({
  onChange,
  node = {},
  children,
  iconsElementMap = {
    expanded: <span>-</span>,
    collapsed: <span>+</span>,
    lastChild: <span>*</span>
  },
}) => {
  const {expanded, collapsed, lastChild} = iconsElementMap;
  const {state = {}, children: nodeChildren = []} = node;
  const {expanded: isExpanded = false} = state;
  const hasChildren = nodeChildren.length > 0;
  const iconElement = !hasChildren ? lastChild : isExpanded ? expanded : collapsed;
  const handleChange = () => onChange(updateNode(node, {expanded: !isExpanded}));

  return (
    <span onDoubleClick={handleChange}>
      <span tabIndex={0} onKeyDown={submitEvent(handleChange)} onClick={handleChange}>
        {iconElement}
      </span>
      {children}
    </span>
  );
};

Expandable.propTypes = {
  ...Renderer,
  iconsClassNameMap: PropTypes.shape({
    expanded: PropTypes.element,
    collapsed: PropTypes.element,
    lastChild: PropTypes.element,
  })
};

export default Expandable;

import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import classNames from 'classnames';

import DefaultGroupRenderer from './filtering/DefaultGroupRenderer';
import {Node} from './shapes/nodeShapes';
import {filterNodes} from './selectors/filtering';

const nameMatchesSearchTerm = searchTerm => ({name}) => {
  const upperCaseName = name.toUpperCase();
  const upperCaseSearchTerm = searchTerm.toUpperCase();

  return upperCaseName.indexOf(upperCaseSearchTerm.trim()) > -1;
};

export default class FilteringContainer extends React.Component {
  state = {
    filterText: '',
  };

  getChildContext = () => {
    return {unfilteredNodes: this.props.nodes};
  };

  static childContextTypes = {
    unfilteredNodes: PropTypes.arrayOf(PropTypes.shape(Node)).isRequired,
  };

  static defaultProps = {
    debouncer: debounce,
    groupRenderer: DefaultGroupRenderer,
  };

  constructor(props) {
    super(props);

    this.setFilterTerm = props.debouncer(this.setFilterTerm, 300);
  }

  setFilterTerm() {
    const {onFilterChange} = this.props;
    const {filterText} = this.state;
    onFilterChange({
      filterFn: nodes => filterNodes(nameMatchesSearchTerm(filterText), nodes, [], {expanded: filterText !== ""}),
      filterTerm: filterText
    });
  }

  handleFilterTextChange = e => {
    const filterText = e.target.value;

    this.setState({filterText});

    this.setFilterTerm();
  };

  render() {
    const {filterText} = this.state;
    const {
      nodes,
      nodeParentMappings,
      children: treeRenderer,
      groups,
      selectedGroup,
      groupRenderer: GroupRenderer,
      onSelectedGroupChange,
      extraClasses = {},
    } = this.props;
    const {
      filteringContainerClass = "",
      inputWrapperClass = "",
      inputClass = "",
    } = extraClasses;

    return (
      <div className={(classNames("tree-filter-container", filteringContainerClass))}>
        {treeRenderer({nodes, nodeParentMappings})}
        <div className={classNames('tree-lookup-input', inputWrapperClass, {group: !!groups})}>
          {groups && <GroupRenderer groups={groups} selectedGroup={selectedGroup} onChange={onSelectedGroupChange} />}
          <input className={inputClass} value={filterText} onChange={this.handleFilterTextChange} placeholder="Search..." />
        </div>
      </div>
    );
  }
}

FilteringContainer.propTypes = {
  children: PropTypes.func.isRequired,
  debouncer: PropTypes.func,
  groups: PropTypes.object,
  selectedGroup: PropTypes.string,
  groupRenderer: PropTypes.func,
  onSelectedGroupChange: PropTypes.func,
  nodes: PropTypes.array.isRequired,
  nodeParentMappings: PropTypes.object.isRequired
};

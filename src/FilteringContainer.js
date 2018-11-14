import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import classNames from 'classnames';

import DefaultGroupRenderer from './filtering/DefaultGroupRenderer';
import {Node} from './shapes/nodeShapes';
import {filterNodes} from './selectors/filtering';

const nameMatchesSearchTerm = searchTerm => ({xPretty}) => {
  const upperCaseName = xPretty.toUpperCase();
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
    debounceWait: 300,
    groupRenderer: DefaultGroupRenderer,
    searchIconElement: null,
    searchPlacerholder: "Search ..."
  };

  constructor(props) {
    super(props);

    this.setFilterTerm = props.debouncer(this.setFilterTerm, props.debounceWait);
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
      searchPlacerholder,
      searchIconElement
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
          {searchIconElement}
          <input className={inputClass} value={filterText} onChange={this.handleFilterTextChange} placeholder={searchPlacerholder} />
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
  debounceWait: PropTypes.number,
  searchPlacerholder: PropTypes.string,
  searchIconElement: PropTypes.element,
  nodeParentMappings: PropTypes.object.isRequired
};

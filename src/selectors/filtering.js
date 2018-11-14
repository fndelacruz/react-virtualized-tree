const INITIAL_FILTERED_VALUE = {nodes: [], nodeParentMappings: {}};

export const filterNodes = (filter, nodes, parents = [], stateOverride = () => ({})) =>
  nodes.reduce((filtered, n) => {
    const {nodes: filteredChildren, nodeParentMappings: childrenNodeMappings} = n.children
      ? filterNodes(filter, n.children, [...parents, n.x], stateOverride)
      : INITIAL_FILTERED_VALUE;

    return !(filter(n) || filteredChildren.length)
      ? filtered
      : {
          nodes: [
            ...filtered.nodes,
            {
              ...n,
              state: {
                ...(n.state || {}),
                ...stateOverride(n)
              },
              children: filteredChildren,
            },
          ],
          nodeParentMappings: {
            ...filtered.nodeParentMappings,
            ...childrenNodeMappings,
            [n.x]: parents,
          },
        };
  }, INITIAL_FILTERED_VALUE);

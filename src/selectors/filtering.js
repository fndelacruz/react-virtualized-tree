const INITIAL_FILTERED_VALUE = {nodes: [], nodeParentMappings: {}};

export const filterNodes = (filter, nodes, parents = [], stateOverride = {}) =>
  nodes.reduce((filtered, n) => {
    const {nodes: filteredChildren, nodeParentMappings: childrenNodeMappings} = n.children
      ? filterNodes(filter, n.children, [...parents, n.id], stateOverride)
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
                ...stateOverride
              },
              children: filteredChildren,
            },
          ],
          nodeParentMappings: {
            ...filtered.nodeParentMappings,
            ...childrenNodeMappings,
            [n.id]: parents,
          },
        };
  }, INITIAL_FILTERED_VALUE);

const path = require('path');

const { parseFile } = require('../../utils/parseFile');

const instructions = parseFile(path.join(__dirname, 'data.txt'));

const createNode = () => {
  return {
    isVisited: false,
    children: [],
    parents: [],
    addChild(child) {
      this.children.push(child);
    },
    addParent(parent) {
      this.parents.push(parent);
    }
  }
};

const nodes = instructions.reduce((nodes, node) => {
  const [, parentNodeKey, childNodeKey] = node.match(/step (\w).*?step (\w)/i);

  let currentParentNode = nodes[parentNodeKey];
  let currentChildNode = nodes[childNodeKey];

  if (!currentParentNode) {
    nodes[parentNodeKey] = currentParentNode = createNode();
  }

  if (!currentChildNode) {
    nodes[childNodeKey] = currentChildNode = createNode();
  }

  currentParentNode.addChild(childNodeKey);
  currentChildNode.addParent(parentNodeKey);

  return nodes;
}, {});

function calculateSequence(currentNodes, seq = '') {
  const sortedNodes = [...currentNodes].sort();
  const [curNodeKey, ...queue] = sortedNodes;

  if (!curNodeKey) {
    return seq;
  }

  const currentNode = nodes[curNodeKey];

  currentNode.isVisited = true;
  seq += curNodeKey;

  currentNode.children.forEach((childKey) => {
    const childNode = nodes[childKey];

    const isParentsCompleted = childNode.parents.every((parentKey) => {
      const parentNode = nodes[parentKey];

      return parentNode.isVisited;
    });

    if (isParentsCompleted) {
      queue.push(childKey);
    }
  });

  return calculateSequence(queue, seq);
}

const parentNodes = Object.keys(nodes)
  .filter(nodeKey => !nodes[nodeKey].parents.length);

console.log('Part 1:', calculateSequence(parentNodes));

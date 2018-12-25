const path = require('path');

const { parseFile } = require('../../utils/parseFile');

const instructions = parseFile(path.join(__dirname, 'data.txt'));

const createNode = () => {
  return {
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

const generateNodes = () => instructions.reduce((nodes, node) => {
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

const getItemTime = item => item.charCodeAt(0) - 4;

const calculateOrder = data => {
  const rootNodes = Object.keys(data)
    .filter(nodeKey => !data[nodeKey].parents.length);
  const nodesSize = Object.keys(data).length;
  const visitedNodes = [];

  let order = '';
  let sortedNodes = rootNodes;

  while (visitedNodes.length !== nodesSize) {
    sortedNodes.sort();

    const curNodeKey = sortedNodes.shift();
    const currentNode = data[curNodeKey];

    visitedNodes.push(curNodeKey);
    order += curNodeKey;

    currentNode.children.forEach((childKey) => {
      const childNode = data[childKey];

      const parentsVisited = childNode.parents
        .every((parentKey) => visitedNodes.includes(parentKey));

      if (parentsVisited) {
        sortedNodes.push(childKey);
      }
    });
  }

  return order;
};

const calculateStepDuration = (data, workersAmount = 5) => {
  const workers = Array.from({ length: workersAmount }, () => ({
    end: null,
    nodeKey: null,
  }));

  const rootNodes = Object.keys(data)
    .filter(nodeKey => !data[nodeKey].parents.length);
  const nodesSize = Object.keys(data).length;
  let visitedNodes = [];
  let totalSeconds = 0;

  let sortedNodes = rootNodes;

  while (visitedNodes.length !== nodesSize) {
    sortedNodes.sort();

    const readyWorkers = workers
      .filter(worker => worker.end <= totalSeconds);

    const availableNodes = sortedNodes.length;

    readyWorkers.forEach((worker, i) => {
      let currentNode = data[worker.nodeKey];

      if (worker.end !== totalSeconds && i < availableNodes) {
        worker.nodeKey = sortedNodes.shift();
        worker.end = totalSeconds + getItemTime(worker.nodeKey) - 1;
        currentNode = data[worker.nodeKey];
      }

      if (currentNode && worker.end === totalSeconds) {
        visitedNodes.push(worker.nodeKey);

        currentNode.children.forEach((childKey) => {
          const childNode = data[childKey];

          const parentsVisited = childNode.parents
            .every((parentKey) => visitedNodes.includes(parentKey));

          if (parentsVisited) {
            sortedNodes.push(childKey);
          }
        });
      }
    });

    totalSeconds++;
  }

  return totalSeconds;
};

const nodes = generateNodes();

console.log('Part 1:', calculateOrder(nodes));
console.log('Part 2:', calculateStepDuration(nodes));

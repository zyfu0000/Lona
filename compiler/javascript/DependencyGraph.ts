class DependencyGraphNode {
  value: string;
  dependencies: DependencyGraphNode[];

  constructor(value: string, dependencies: DependencyGraphNode[]) {
    this.value = value;
    this.dependencies = dependencies;
  }

  getDependency(value: string): DependencyGraphNode | null {
    return this.dependencies.find(node => node.value === value);
  }
}

export class DependencyGraph {
  nodes: { [key: string]: DependencyGraphNode };

  constructor() {
    this.nodes = {};
  }

  addValue(value: string) {
    if (value in this.nodes) return;

    this.nodes[value] = new DependencyGraphNode(value, []);
  }

  addDependency(value: string, dependency: string) {
    if (!this.nodes[value]) {
      throw new Error(
        `No node for ${value} when adding dependency ${dependency}`
      );
    }

    if (!this.nodes[dependency]) {
      throw new Error(
        `No node for ${dependency} when adding dependency to ${value}`
      );
    }

    const { dependencies } = this.nodes[value];

    if (dependencies.find(node => node.value === dependency)) return;

    dependencies.push(this.nodes[dependency]);
  }

  getNodeList(): DependencyGraphNode[] {
    return Object.keys(this.nodes).map(key => this.nodes[key]);
  }

  getNodesWithoutDependencies(): DependencyGraphNode[] {
    return this.getNodeList().filter(node => node.dependencies.length === 0);
  }

  getNodesThatAreNotDependedOn(): DependencyGraphNode[] {
    // Return only nodes which
    return this.getNodeList().filter(node => {
      // For every other node
      return this.getNodeList().every(other => {
        // Don't depend on that other node
        return !other.getDependency(node.value);
      });
    });
  }

  getTransitiveDependencyNodes(value: string): DependencyGraphNode[] {
    const visited: { [key: string]: boolean } = {};

    if (!this.nodes[value]) {
      throw new Error(`No node for ${value}`);
    }

    const remaining: DependencyGraphNode[] = [this.nodes[value]];
    const dependencies: DependencyGraphNode[] = [];

    while (remaining.length > 0) {
      const item = remaining.pop();

      visited[item.value] = true;

      item.dependencies.forEach(dependency => {
        if (visited[dependency.value]) return;

        remaining.push(dependency);
        dependencies.push(dependency);
      });
    }

    return dependencies;
  }
}

// const g = new DependencyGraph();

// g.addValue("a");
// g.addValue("b");
// g.addValue("c");

// console.log(g.nodes);

// g.addDependency("a", "b");
// g.addDependency("b", "c");

// console.log(g.getTransitiveDependencyNodes("a"));

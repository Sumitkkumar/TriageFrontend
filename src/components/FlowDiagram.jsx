import React, { useRef, useEffect } from 'react';
import * as joint from 'jointjs';
import dagre from 'dagre';
import data from './data.json';
import * as colors from './colors';

const FlowDiagram = () => {
  const paperRef = useRef(null);

  useEffect(() => {
    const graph = new joint.dia.Graph();
    const paper = new joint.dia.Paper({
      el: paperRef.current,
      model: graph,
      width: '100%',
      height: 200,
      gridSize: 1,
        background: {
            color: colors.neutral50
        }
    });

    // paper.scale(1, 1);

    const nodes = [];
    data.dataflows.forEach((flow, index) => {
        // console.log(index);
      const node = new joint.shapes.standard.Rectangle({
        position: { x: (index+0.075) * 270, y: 75 },
        size: { width: 225, height: 50 },
        attrs: {
          label: { 
                text: flow.dataflowName,
                fontFamily: 'Arial' 
            },
          body: {
            fill: flow.failed === 'true' ? '#ffcccc' : '#f0f0f0',
            stroke: flow.failed === 'true' ? '#ff0000' : '#999',
            strokeWidth: 1,
          },
        },
      });

      nodes.push(node);
      graph.addCell(node);
    });

    for (let i = 0; i < nodes.length - 1; i++) {
      const sourceNode = nodes[i];
      const targetNode = nodes[i + 1];

      const link = new joint.shapes.standard.Link({
        source: { id: sourceNode.id },
        target: { id: targetNode.id },
        attrs: {
          '.connection': { stroke: '#333', 'stroke-width': 3 },
        //   '.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z' },
        },
      });

      graph.addCell(link);
    }

    // const dagreLayout = new dagre.graphlib.Graph();
    // dagreLayout.setGraph({});
    // dagreLayout.setDefaultEdgeLabel(() => ({}));

    // nodes.forEach(node => {
    //   dagreLayout.setNode(node.id, { width: 200, height: 40 });
    // });

    // nodes.forEach((node, index) => {
    //   if (index < nodes.length - 1) {
    //     dagreLayout.setEdge(node.id, nodes[index + 1].id);
    //   }
    // });

    // dagre.layout(dagreLayout);

    // nodes.forEach(node => {
    //   const position = dagreLayout.node(node.id);
    //   node.position(position.x, position.y);
    // });

  }, []);

  return (
    <div className='dataflowBox' ref={paperRef} ></div>
  );
};

export default FlowDiagram;

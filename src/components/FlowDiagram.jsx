import React, { useRef, useEffect } from "react";
import * as joint from "jointjs";
import * as colors from "../utils/colors";

const FlowDiagram = ({ jsonData }) => {
  const paperRef = useRef(null);
  useEffect(() => {
    const graph = new joint.dia.Graph();
    const paper = new joint.dia.Paper({
      el: paperRef.current,
      model: graph,
      width: "100%",
      height: 200,
      drawGrid: true,
      gridSize: 1,
      background: {
        color: colors.neutral50,
      },
    });

    paper.translate(-200, 0);

    const nodes = [];
    const nodesMap = new Map();

    jsonData.forEach((flow) => {
      const node = new joint.shapes.standard.Rectangle({
        position: { x: flow.position * 300, y: 75 },
        size: { width: 250, height: 50 },
        attrs: {
          label: {
            text: flow.dataflowName,
            fontFamily: "Arial",
          },
          body: {
            fill: flow.failed === "true" ? colors.red300 : colors.gray200,
            stroke: flow.failed === "true" ? colors.red600 : colors.gray400,
            strokeWidth: 1,
          },
        },
      });

      nodes.push(node);

      nodesMap.set(Number(flow.position), node);
      graph.addCell(node);
    });

    for (let i = 0; i < nodes.length - 1; i++) {
      const sourceNode = nodesMap.get(i + 1);
      const targetNode = nodesMap.get(i + 2);

      const link = new joint.shapes.standard.Link({
        source: { id: sourceNode.id },
        target: { id: targetNode.id },
        attrs: {
          ".connection": { stroke: "#333", "stroke-width": 3 },
          // '.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z' },
        },
      });

      graph.addCell(link);
    }

    // console.log(nodesMap);

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
  }, [jsonData]);

  return <div className="dataflowBox" ref={paperRef}></div>;
};

export default FlowDiagram;

import React, { Component } from 'react'
import * as SRD from '@projectstorm/react-diagrams';
import { CanvasWidget } from '@projectstorm/react-canvas-core';
import { CanvasWidgetWrapper } from './canvasWidgetWrapper';
import PropertiesPanel from './propertiesPanel';
import UpperToolBar from './upperToolBar';

class EditorFrame extends Component {
    render() {
        var engine = SRD.default();

        var model = new SRD.DiagramModel();
        engine.setModel(model);

        //3-A) create a default node
        var node1 = new SRD.DefaultNodeModel('Node 1', 'rgb(0,192,255)');
        let port = node1.addOutPort('Out');
        node1.setPosition(100, 100);

        //3-B) create another default node
        var node2 = new SRD.DefaultNodeModel('Node 2', 'rgb(192,255,0)');
        let port2 = node2.addInPort('In');
        node2.setPosition(400, 100);

        // link the ports
        let link1 = port.link(port2);

        model.addAll(node1, node2, link1);

        return (
            <React.Fragment>
                
                <PropertiesPanel />
                <UpperToolBar />
                <div style={{ height: "calc(100% - 45px)", zIndex: "4"}}>
                    <CanvasWidgetWrapper >
                        <CanvasWidget engine={engine} />
                    </CanvasWidgetWrapper>  
                </div>
            </React.Fragment>  
        );
    }
}

export default EditorFrame;
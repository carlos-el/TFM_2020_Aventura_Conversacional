import React, { Component } from 'react'
import { Rnd } from 'react-rnd';

const ArrowHandle = () => (
    <svg className="svg-icon" viewBox="0 0 17 17">
        <path fill="none" d="M8.388,10.049l4.76-4.873c0.303-0.31,0.297-0.804-0.012-1.105c-0.309-0.304-0.803-0.293-1.105,0.012L6.726,9.516c-0.303,0.31-0.296,0.805,0.012,1.105l5.433,5.307c0.152,0.148,0.35,0.223,0.547,0.223c0.203,0,0.406-0.08,0.559-0.236c0.303-0.309,0.295-0.803-0.012-1.104L8.388,10.049z"></path>
    </svg>
);

class PropertiesPanel extends Component {
    constructor(props) {
        super(props)

        this.state = {
            visitas: []
        };
    }

    render() {
        return (
            <Rnd className={'float-right position-relative p-3 shadow-lg bg-dark'}
                style={{ border: "1px solid black", zIndex: "4"}}
                default={{ width: 300, height: '100%' }}
                minWidth={100}
                maxWidth={'80%'}
                disableDragging={true}
                bounds={'parent'}
                enableResizing={{ top: false, right: false, bottom: true, left: true, topRight: false, bottomRight: false, bottomLeft: false, topLeft: false }}
                resizeHandleComponent={{ left: <ArrowHandle /> }}
            >
                <div>ffff</div>
            </Rnd>
        );
    }
}

export default PropertiesPanel;
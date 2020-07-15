import React, { Component } from 'react'

class UpperToolBar extends Component {
    constructor(props) {
        super(props)

        this.state = {
            visitas: []
        };
    }

    render() {
        return (
            <div style={{ border: '1px solid black', height: '45px', position: "relative", float: 'rigth'}} className={'w-100 shadow-lg bg-dark'}>

            </div>
        );
    }
}

export default UpperToolBar;
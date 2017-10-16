import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import DragGridInput from './dragGridInput';
import DragGridInputImproved from './dragGridInput-improved';
import './index.scss';

class App extends Component {
    state = {
        valueLeft: '3,3,3,3',
        valueRight: '4,4,4',
    }
    onChangeLeft = (value) => {
        this.setState({
            valueLeft: value,
        });
    }

    onChangeRight = (value) => {
        this.setState({
            valueRight: value,
        });
    }

    render() {
        return (<div className="cols-input-app">
            <div className="app-header">左侧为拖拽效果 vs 右侧为模拟拖拽效果</div>
            <div className="app-body">
                <div className="app-body-left">
                    <DragGridInput value={this.state.valueLeft} onChange={this.onChangeLeft}></DragGridInput>
                    <div className="output">{this.state.valueLeft}</div>
                </div>
                <div className="app-body-right">
                    <DragGridInputImproved value="4,4,4" onChange={this.onChangeRight}></DragGridInputImproved>
                    <div className="output">{this.state.valueRight}</div>
                </div>
            </div>
        </div>);
    }
}

ReactDOM.render((<App></App>), document.getElementById('root'));

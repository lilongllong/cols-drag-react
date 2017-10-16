import React from 'react';
import PropTypes from 'prop-types';

import './drag-grid-input.scss';

export default class ColsInput extends React.Component {
    static propTypes = {
        value: PropTypes.string,
        onChange: PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.state = {
            value: this.encodeValue(props.value),
            colsMaskState: false,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.value !== this.props.value) {
            this.setState({
                value: this.encodeValue(nextProps.value),
            });
        }
    }

    hasClass(obj, cls) {
        return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
    }

    addClass(obj, cls) {
        if (!this.hasClass(obj, cls)) obj.className= `${obj.className.trim()} ${cls}`;
    }

    removeClass(obj, cls) {
        if (this.hasClass(obj, cls)) {
            const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
            obj.className = obj.className.replace(reg, ' ');
        }
    }

    encodeValue(value) {
        if (typeof value === 'string') {
            const arr = value.split(',');
            if (arr.length < 2) {
                return [];
            } else {
                arr.pop();
                let sum = -1;
                return arr.map(item => {
                    sum += parseInt(item);
                    return sum;
                });
            }
        }
        return value;
    }

    decodeValue(array) {
        const result = [];
        array.reduce((prev, curr) => {
            result.push(curr - prev);
            return curr;
        }, -1);
        result.push(11 - array[array.length - 1]);
        return result;
    }

    onDrop(currIndex, event) {
        this.setState({
            colsMaskState: false,
        });
        event.preventDefault();
        const value = this.state.value;
        const index = parseInt(event.dataTransfer.getData('index'));
        const id = event.dataTransfer.getData('id');
        const preIndex = index > 0 ? value[(index - 1)] : -1;
        const lastIndex = index < (value.length - 1) ? value[(index + 1)] : 12;
        if (preIndex < currIndex && currIndex < lastIndex) {
            const newValue = value.slice(0);
            newValue[index] = currIndex;
            const output = this.decodeValue(newValue).join(',');
            if (this.props.onChange) {
                this.props.onChange(output);
            }
        }
        this.removeClass(event.target, 'hover');
    }

    onDrag(index, event) {
        // event.persist();
        event.dataTransfer.dropEffect = 'move';
        event.dataTransfer.effectAllowed = 'move';
    }

    onDragStart(index, event) {
        // this.addClass(event.target, 'cursor-resize');
        event.dataTransfer.setData('index', index);
        event.dataTransfer.setData('id', event.target.id);
        event.dataTransfer.dropEffect = 'move';
        event.dataTransfer.effectAllowed = 'move';
        const dragImage = new Image();
        dragImage.src = 'https://gw.alicdn.com/tfs/TB1F9vUc6ihSKJjy0FlXXadEXXa-128-128.png';
        dragImage.style.cursor = 'col-resize';
        this.addClass(dragImage, 'cursor-resize')
        event.dataTransfer.setDragImage(dragImage, 0, 0);
        this.setState({
            colsMaskState: true,
        });
    }

    onDragEnd(index, event) {
        this.setState({
            colsMaskState: false,
        });
    }

    onDragEnter(event) {
        this.addClass(event.target, 'hover');
    }

    onDragOver(event) {
        event.preventDefault();

    }

    onDragLeave(event) {
        this.removeClass(event.target, 'hover');
    }

    createCol(index) {
        const currIndex = this.state.value.indexOf(index);

        if (currIndex > -1) {
            return (<div className="cols-drag-item" key={index}>
                <div className="gutter">
                    <div className="handle"
                        onDrop={this.onDrop.bind(this, index)}
                        onDragEnter={this.onDragEnter.bind(this)}
                        onDragOver={this.onDragOver.bind(this)}
                        onDragLeave={this.onDragLeave.bind(this)}
                    >
                        <div
                            id={`draggable-${currIndex}`}
                            className="arrows sprite-settings"
                            draggable="true"
                            onDragStart={this.onDragStart.bind(this, currIndex)}
                            onDrag={this.onDrag.bind(this, currIndex)}
                            onDragEnd={this.onDragEnd.bind(this, currIndex)}
                        >
                        </div>
                    </div>
                </div>
            </div>);
        } else {
            if (index === 11) {
                return (<div className="cols-drag-item last" key={index}>
                </div>);
            } else {
                return (<div className="cols-drag-item" key={index}>
                <div className="gutter">
                <div className="handle"
                onDrop={this.onDrop.bind(this, index)}
                onDragEnter={this.onDragEnter.bind(this)}
                onDragOver={this.onDragOver.bind(this)}
                onDragLeave={this.onDragLeave.bind(this)}
                >
                </div>
                </div>
                </div>);
            }
        }
    }

    createBackgroundLabel(value, index) {
        return (<div className={`background-label__item width-${value}`} key={`label-${index}`}>{
            value
        }</div>);
    }

    createGuideCols(value) {
        const result = [];
        for (let index = 0; index < value - 1; index++) {
            result.push((<div className="guide-col" key={`guide-col-${index}`}></div>));
        }
        result.push((<div className="guide-col last" key={`guide-col-${value - 1}`}></div>));
        return result;
    }


    render() {
        const { colsMaskState, value } = this.state;
        const cols = [];
        for (let i = 0; i < 12; i++) {
            cols.push(this.createCol(i));
        }
        const labels = this.decodeValue(value).map(this.createBackgroundLabel.bind(this));
        return (<div className="drag-grid-input" ref={(node) => this.rootNode = node}>
            <div className={`guide-mask ${colsMaskState ? '' : 'hidden'}`}>
                {this.createGuideCols(12)}
            </div>
            <div className="background-label">
                {labels}
            </div>
            {cols}
        </div>);
    }

    componentDidMount() {
        if (this.rootNode) {
            this.location = {
                x: this.rootNode.clientX,
                y: this.rootNode.clientY,
                width: this.rootNode.width,
            };
        }
    }
}

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import './drag-grid-input-improved.scss';

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
            dragingIndex: null,
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
            return value.split(',').map(item => parseInt(item));
        }
        return value;
    }

    decodeValue(array) {
        return array.join(',');
    }

    updateValue(value) {
        if (this.state.value.join(',') !== value.join(',')) {
            this.setState({
                value,
            }, () => {
                const onChange = this.props.onChange;
                if (onChange) {
                    onChange(value.join(','));
                }
            });
        }
    }

    createCol(value, index, last = false) {
        if (last) {
            return (<div className={`cols-drag-item last col-${value}`} key={index}>
                {value}
            </div>)
        } else {
            return (<div className={`cols-drag-item col-${value}`} key={index}>
                {value}
                <div className="gutter">
                    <div className={`handle ${this.state.dragingIndex !== index || 'hover'}`} onMouseDown={this.mousedownHandler.bind(this, index)}>
                        <div
                            id={`draggable-${index}`}
                            className="arrows sprite-settings"
                        >
                        </div>
                    </div>
                </div>
            </div>);
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

    mouseupHandler() {
        this.setState({
            colsMaskState: false,
            dragingIndex: null,
        });
    }

    mousedownHandler(index) {
        this.setState({
            colsMaskState: true,
            dragingIndex: index,
        });
    }

    mouseenterHandler(event) {
        event.stopPropagation();
        event.preventDefault();
        const { dragingIndex } = this.state;
        if (dragingIndex !== null) {
            const offsetX = event.nativeEvent.offsetX;
            const diffX = offsetX - this.location.x;
            const unitLength = parseInt((this.location.width + 10) / 12);
            const locationIndex = parseInt((diffX - diffX % unitLength) / unitLength);
            const newValue = this.computeRealLocation(dragingIndex, locationIndex);
            this.updateValue(newValue);
        }
    }

    mouseleaveHandler(event) {
        event.stopPropagation();
        event.preventDefault();
        const { dragingIndex } = this.state;
        if (dragingIndex !== null) {
            const offsetX = event.nativeEvent.offsetX;
            const diffX = offsetX - this.location.x;
            const unitLength = parseInt((this.location.width + 10) / 12);
            const locationIndex = parseInt((diffX - diffX % unitLength) / unitLength);
            const newValue = this.computeRealLocation(dragingIndex, locationIndex);
            this.updateValue(newValue);
        }
    }

    mousemoveHandler(event) {
        event.stopPropagation();
        event.preventDefault();
        const { dragingIndex } = this.state;
        if (dragingIndex !== null) {
            const offsetX = event.nativeEvent.offsetX;
            const diffX = offsetX - this.location.x;
            const unitLength = parseInt((this.location.width + 10) / 12);
            const locationIndex = parseInt((diffX - diffX % unitLength) / unitLength);
            const newValue = this.computeRealLocation(dragingIndex, locationIndex);
            this.updateValue(newValue);
        }
    }

    computeRealLocation(index, locationIndex) {
        const sumValue = [];
        this.state.value.reduce((prev, next) => {
            const sum = prev + next;
            sumValue.push(sum);
            return sum;
        }, -1);
        if (this.state.value.length === 2) {
            sumValue[index] = locationIndex < 0 ? 0 : (locationIndex >= 11 ? 10 : locationIndex);
        } else {
            if (index <= 0) {
                const right = index + 1 <= (this.state.value.length - 1) ? sumValue[index + 1] : 10;
                sumValue[index] = locationIndex <= 0 ? 0 : (locationIndex < right ? locationIndex : right - 1);
            } else if (index >= this.state.value.length - 1) {
                const left = index - 1 < 0 ? sumValue[index - 1] : -1;
                sumValue[index] = locationIndex > left ? locationIndex : 10;
            } else {
                const left = sumValue[index - 1];
                const right = sumValue[index + 1];
                if (left < locationIndex && right > locationIndex) {
                    sumValue[index] = locationIndex;
                } else if (locationIndex <= left) {
                    sumValue[index] = left + 1;
                } else {
                    sumValue[index] = right - 1;
                }
            }
        }
        const result = [];
        sumValue.reduce((prev, next) => {
            result.push(next - prev);
            return next;
        }, -1);
        return result;
    }

    render() {
        const { colsMaskState, value } = this.state;
        const cols = value.map((item, index) => {
            if (index === value.length - 1) {
                return this.createCol(item, index, true);
            } else {
                return this.createCol(item, index);
            }
        });

        return (<div
                className={`drag-grid-input-improved ${!colsMaskState || 'cursor-resize'}`}
                ref={(node) => this.rootNode = node}
                onMouseMove={this.mousemoveHandler.bind(this)}
                onMouseEnter={this.mouseenterHandler.bind(this)}
                onMouseLeave={this.mouseleaveHandler.bind(this)}
            >
            <div className={`guide-mask ${colsMaskState ? '' : 'hidden'}`}>
                {this.createGuideCols(12)}
            </div>
            <div className="drag-grid-input__content">
                {cols}
            </div>
            <div className={`mouse-receiver ${colsMaskState || 'hidden'}`}></div>
        </div>);
    }
    componentWillMount() {
        document.addEventListener('mouseup', this.mouseupHandler.bind(this));
    }

    componentDidMount() {
        if (this.rootNode) {
            const $rootNode = ReactDOM.findDOMNode(this.rootNode);
            this.location = {
                x: $rootNode.clientLeft,
                y: $rootNode.clientTop,
                width: $rootNode.clientWidth,
            };
        }
    }
}

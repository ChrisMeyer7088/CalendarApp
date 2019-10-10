import React from 'react';
import './colorWheel.css';

interface Props {
    getColor: any;
    initalRed?: number;
    initalBlue?: number;
    initalGreen?: number;
}

interface State {
    red: number;
    green: number;
    blue: number;
    showWheel: boolean;
}

class ColorWheel extends React.Component<Props, State> {
    constructor(props: any) {
        super(props);
        const { initalBlue, initalGreen, initalRed} = this.props;
        this.state = {
            red: initalRed || 0,
            green: initalGreen || 200,
            blue: initalBlue || 255,
            showWheel: false
        }
    }

    render() {
        const { getAllColorsAsHex } = this;
        const { showWheel } = this.state;

        console.log(getAllColorsAsHex())
        let triggerStyle = {
            backgroundColor: getAllColorsAsHex()
        }
        return (
            <div className="container-colorWheel">
                <button className="colorWheel-trigger" style={triggerStyle}></button>
                <div hidden={!showWheel}>

                </div>
            </div>
        )
    }

    numberToHex = (number: number): string => {
        let hex: string = number.toString(16);
        if(hex.length === 1) hex = hex + '0'
        return hex;
    }

    getAllColorsAsHex = (): string => {
        const { numberToHex } = this;
        const { red, green, blue } = this.state;

        return `#${numberToHex(red)}${numberToHex(green)}${numberToHex(blue)}`
    }
}

export default ColorWheel;

/**
 * 使用此文件来定义自定义函数和图形块。
 * 想了解更详细的信息，请前往 https://makecode.microbit.org/blocks/custom
 */


//% weight=100 color=#0fbc11 icon="\uf2db"
namespace Sensor {

	let COMMAND_I2C_ADDRESS = 0x24
    let DISPLAY_I2C_ADDRESS = 0x34
    let _SEG = [0x3F, 0x06, 0x5B, 0x4F, 0x66, 0x6D, 0x7D, 0x07, 0x7F, 0x6F, 0x77, 0x7C, 0x39, 0x5E, 0x79, 0x71];

    let _intensity = 3
    let dbuf = [0, 0, 0, 0]

    /**
     * send command to display
     * @param is command, eg: 0
     */
    function cmd(c: number) {
        pins.i2cWriteNumber(COMMAND_I2C_ADDRESS, c, NumberFormat.Int8BE)
    }

    /**
     * send data to display
     * @param is data, eg: 0
     */
    function dat(bit: number, d: number) {
        pins.i2cWriteNumber(DISPLAY_I2C_ADDRESS + (bit % 4), d, NumberFormat.Int8BE)
    }

    /**
     * turn on display
     */
    //% blockId="TM650_ON" block="开启显示"
    //% weight=50 blockGap=8
	//% subcategory="数码管"
    export function on() {
        cmd(_intensity * 16 + 1)
    }

    /**
     * turn off display
     */
    //% blockId="TM650_OFF" block="关闭显示"
    //% weight=50 blockGap=8
	//% subcategory="数码管"
    export function off() {
        _intensity = 0
        cmd(0)
    }

    /**
     * clear display content
     */
    //% blockId="TM650_CLEAR" block="清空显示"
    //% weight=40 blockGap=8
	//% subcategory="数码管"
    export function clear() {
        dat(0, 0)
        dat(1, 0)
        dat(2, 0)
        dat(3, 0)
        dbuf = [0, 0, 0, 0]
    }

    /**
     * show a digital in given position
     * @param digit is number (0-15) will be shown, eg: 1
     * @param bit is position, eg: 0
     */
    //% blockId="TM650_DIGIT" block="显示数字 %num|在 %bit"
    //% weight=80 blockGap=8
    //% num.max=15 num.min=0
	//% subcategory="数码管"
    export function digit(num: number, bit: number) {
        dbuf[bit % 4] = _SEG[num % 16]
        dat(bit, _SEG[num % 16])
    }

    /**
     * show a number in display
     * @param num is number will be shown, eg: 100
     */
    //% blockId="TM650_SHOW_NUMBER" block="显示数字 %num"
    //% weight=100 blockGap=8
	//% subcategory="数码管"
    export function showNumber(num: number) {
        if (num < 0) {
            dat(0, 0x40) // '-'
            num = -num
        }
        else
            digit(Math.idiv(num, 1000) % 10, 0)
        digit(num % 10, 3)
        digit(Math.idiv(num, 10) % 10, 2)
        digit(Math.idiv(num, 100) % 10, 1)
    }

    /**
     * show a number in hex format
     * @param num is number will be shown, eg: 123
     */
    //% blockId="TM650_SHOW_HEX_NUMBER" block="显示16进制数字 %num"
    //% weight=90 blockGap=8
	//% subcategory="数码管"
    export function showHex(num: number) {
        if (num < 0) {
            dat(0, 0x40) // '-'
            num = -num
        }
        else
            digit((num >> 12) % 16, 0)
        digit(num % 16, 3)
        digit((num >> 4) % 16, 2)
        digit((num >> 8) % 16, 1)
    }

    /**
     * show Dot Point in given position
     * @param bit is positiion, eg: 0
     * @param show is true/false, eg: true
     */
    //% blockId="TM650_SHOW_DP" block="显示小数点在第 %bit|位，同时显示数字 %num"
    //% weight=80 blockGap=8
	//% subcategory="数码管"
    export function showDpAt(bit: number, show: boolean) {
        if (show) dat(bit, dbuf[bit % 4] | 0x80)
        else dat(bit, dbuf[bit % 4] & 0x7F)
    }

    /**
     * set display intensity
     * @param dat is intensity of the display, eg: 3
     */
    //% blockId="TM650_INTENSITY" block="显示小数点在第 %dat位"
    //% weight=70 blockGap=8
	//% subcategory="数码管"
    export function setIntensity(dat: number) {
        if ((dat < 0) || (dat > 8))
            return;
        if (dat == 0)
            off()
        else {
            _intensity = dat
            cmd((dat << 4) | 0x01)
        }
    }

	
        /**
     * button pushed.
     */
    //% blockId=onPressEvent
    //% block="当按键 |%btn| 按下时" shim=IrRemote::onPressEvent group="micro:bit(v1)"
    //% subcategory="红外接收"
    export function OnPressEvent(btn: RemoteButton, body: () => void): void {
        return;
    }

    /**
     * initialises local variablesssss
     *  @param pin describe parameter here, eg: IrPins.P5  
     */
    //% blockId=IrRemote_init 
    //% block="连接红外接收在 %pin脚上" shim=IrRemote::IrRemote_init group="micro:bit(v1)"
    //% subcategory="红外接收"
    export function IrRemote_init(pin: Pins): void {
        return;
    }
    
    
    export class Packeta {
        public mye: string;
        public myparam: number;
    }


    let irstate:string;
    let state:number;
    /**
     * Read IR sensor value V2.
     */

    //% advanced=true shim=maqueenIRV2::irCode
    function irCode(): number {
        return 0;
    }

    //% weight=5
    //% group="micro:bit(v2)"
    //% blockId=IR_readv2 block="读取按键的值"
    //% subcategory="红外接收"
    export function IR_readV2(): string {
        let val = valuotokeyConversion();
        let str;
        switch (val) {
            case 11: str = 'A'; break;
            case 12: str = 'B'; break;
            case 13: str = 'C'; break;
            case 14: str = 'D'; break;
            case 21: str = 'UP'; break;
            case 66: str = '+'; break;
            case 24: str = 'LEFT'; break;
            case 55: str = 'OK'; break;
            case 22: str = 'RIGHT'; break;
            case 0: str = '0'; break;
            case 23: str = 'DOWN'; break;
            case 99: str = '-'; break;
            case 1: str = '1'; break;
            case 2: str = '2'; break;
            case 3: str = '3'; break;
            case 4: str = '4'; break;
            case 5: str = '5'; break;
            case 6: str = '6'; break;
            case 7: str = '7'; break;
            case 8: str = '8'; break;
            case 9: str = '9'; break;
            default:
                str = '-1';
        }
        return str;
    }

    //% weight=2
    //% group="micro:bit(v2)"
    //% blockId=IR_callbackUserv2 block="当接收到红外信号时"
    //% draggableParameters
    //% subcategory="红外接收"
    export function IR_callbackUserV2(cb: (message: string) => void) {
        state = 1;
        control.onEvent(11, 22, function() {
            cb(irstate)
        }) 
    }

    function valuotokeyConversion(): number {
        let irdata: number;
        switch (irCode()) {
            case 0xba45: irdata = 11; break;
            case 0xb946: irdata = 12; break;
            case 0xb847: irdata = 13; break;
            case 0xbb44: irdata = 14; break;
            case 0xbf40: irdata = 21; break;
            case 0xbc43: irdata = 66; break;
            case 0xf807: irdata = 24; break;
            case 0xea15: irdata = 55; break;
            case 0xf609: irdata = 22; break;
            case 0xe916: irdata = 0; break;
            case 0xe619: irdata = 23; break;
            case 0xf20d: irdata = 99; break;
            case 0xf30c: irdata = 1; break;
            case 0xe718: irdata = 2; break;
            case 0xa15e: irdata = 3; break;
            case 0xf708: irdata = 4; break;
            case 0xe31c: irdata = 5; break;
            case 0xa55a: irdata = 6; break;
            case 0xbd42: irdata = 7; break;
            case 0xad52: irdata = 8; break;
            case 0xb54a: irdata = 9; break;
            default:
                irdata = -1;
        }
        return irdata;
    }

    basic.forever(() => {
        if(state == 1){
            irstate = IR_readV2();
            if(irstate != '-1'){
                control.raiseEvent(11, 22)
            }
        }
    
        basic.pause(20);
    })
}



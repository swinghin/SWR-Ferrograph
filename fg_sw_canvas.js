// basic constant for dot matrix size
const BORDER = 1;
const PADDING_TOP = 7;
const PADDING_BOTTOM = 7;
const PADDING_LEFT = 9;
const PADDING_RIGHT = 9;

const MAX_SLOTS = 3;
const LINE_HEIGHT = 7;
const LINE_GAP = 2;

const TIME_HEIGHT = 12;
const TIME_WIDTH = 10;
const TIME_GAP = 2;
const TIME_GAP_HEIGHT = 5;
const TIME_TOP = BORDER + PADDING_TOP + LINE_HEIGHT * 3 + LINE_GAP * 2 + TIME_GAP_HEIGHT;
const TIME_LEFT = 60;

const COLS = 192;
const ROWS = LINE_HEIGHT * 3;
const SCALE = 16;

// set up dot matrix
const MATRIX = document.querySelector('#matrix-canvas');
MATRIX.width = (PADDING_LEFT + PADDING_RIGHT + COLS + BORDER * 2) * SCALE;
MATRIX.height = (PADDING_TOP + PADDING_BOTTOM + ROWS + (2 * LINE_GAP) + (TIME_GAP_HEIGHT - 2) + TIME_HEIGHT + BORDER * 2) * SCALE;
const SCREEN = MATRIX.getContext('2d');

// set led off style to grey colour
const LED_OFF_STYLE = '#222222';

// main bitmap
var bitmap, lastframe;
var stationName;

// array to store bitmaps for lines: 10 slots, height 10px each
var lineData;
var lineDataOld = ['', '', 0];
var lineSlotMaps;

// animation config
const SCROLL_SPEED = 1000 / 25;
const SCROLL_SPEED_H = 1000 / 50;
const SECOND = 1000;

// function to initialise bitmap array to all off, call refresh to draw to screen
function init() {
    SCREEN.fillStyle = "#999999";
    SCREEN.fillRect(0, 0, MATRIX.width, MATRIX.height);

    SCREEN.fillStyle = "#000000";
    SCREEN.fillRect(BORDER * SCALE, BORDER * SCALE, MATRIX.width - BORDER * SCALE * 2, MATRIX.height - BORDER * SCALE * 2);

    SCREEN.fillStyle = "#FFFFFF";
    SCREEN.font = LINE_HEIGHT * SCALE + "px Arial";
    SCREEN.fillText("Time", (BORDER + PADDING_LEFT + 24) * SCALE, (PADDING_TOP) * SCALE);
    SCREEN.fillText("Destination", (BORDER + PADDING_LEFT + 80) * SCALE, (PADDING_TOP) * SCALE);
    SCREEN.fillText("Expected", (BORDER + PADDING_LEFT + 164) * SCALE, (PADDING_TOP) * SCALE);

    // set up bitmap array (COLS*ROWS)
    bitmap = new Array(ROWS);
    lastframe = new Array(ROWS);
    for (var row = 0; row < ROWS; row++) {
        bitmap[row] = new Array(COLS).fill(false);
        lastframe[row] = new Array(COLS).fill(false);
    }


    lineSlotMaps = new Array(MAX_SLOTS);
    for (var slot = 0; slot < MAX_SLOTS; slot++) {
        lineSlotMaps[slot] = new Array(LINE_HEIGHT);
        for (var row = 0; row < LINE_HEIGHT; row++) {
            lineSlotMaps[slot][row] = new Array(COLS).fill(false);
        }
    }

    printString("Welcome to " + stationName, 0, 0);
    printString("For help please", 0, LINE_HEIGHT);
    printString("use the help points", 0, LINE_HEIGHT * 2);

    clockTick();
    refreshClock();
    refreshFull();
    drawClock("00:00:00");
}

// function to show bitmap to screen
function refreshFull() {
    SCREEN.clearRect((BORDER + PADDING_LEFT) * SCALE, (BORDER + PADDING_TOP) * SCALE, MATRIX.width - (BORDER + PADDING_LEFT) * SCALE * 2, (ROWS + LINE_GAP * 2 + 2) * SCALE);

    SCREEN.fillStyle = "#000000";
    SCREEN.fillRect((BORDER + PADDING_LEFT) * SCALE, (BORDER + PADDING_TOP) * SCALE, MATRIX.width - (BORDER + PADDING_LEFT) * SCALE * 2, (ROWS + LINE_GAP * 2 + 2) * SCALE);

    SCREEN.fillStyle = "#0c0c0c";
    SCREEN.fillRect((BORDER + PADDING_LEFT - 1) * SCALE, (BORDER + PADDING_TOP - 0.5) * SCALE, MATRIX.width - (BORDER + PADDING_LEFT - 1) * SCALE * 2, (ROWS + LINE_GAP * 2 + 2) * SCALE);

    for (var row = 0; row < ROWS; row++) {
        for (var col = 0; col < COLS; col++) {
            drawLed(BORDER + PADDING_TOP + row + LINE_GAP * Math.floor(row / LINE_HEIGHT), BORDER + PADDING_LEFT + col, bitmap[row][col]);
        }
    }
}
function refreshRow(rowNumber) {
    for (var row = LINE_HEIGHT * rowNumber; row < LINE_HEIGHT * (rowNumber + 1); row++) {
        for (var col = 0; col < COLS; col++) {
            if (lastframe[row][col] != bitmap[row][col]) {
                lastframe[row][col] = bitmap[row][col];
                drawLed(BORDER + PADDING_TOP + row + LINE_GAP * Math.floor(row / LINE_HEIGHT), BORDER + PADDING_LEFT + col, bitmap[row][col]);
            }
        }
    }
}
function refreshClock() {
    SCREEN.fillStyle = "#0c0c0c";
    SCREEN.fillRect((TIME_LEFT - 2) * SCALE, (TIME_TOP - 4) * SCALE, (TIME_WIDTH * 8 + TIME_GAP * 7 + 4) * SCALE, (TIME_HEIGHT + 4) * SCALE);

    var lastPos = TIME_LEFT;
    for (var char = 0; char < 8; char++) {
        for (var row = 0; row < TIME_HEIGHT; row++) {
            for (var col = 0; col < TIME_WIDTH; col++) {
                drawLed(TIME_TOP + row, lastPos + col, false);
            }
        }
        lastPos += TIME_WIDTH + TIME_GAP;
    }
}
function refresh() {
    for (var row = 0; row < ROWS; row++) {
        for (var col = 0; col < COLS; col++) {
            if (lastframe[row][col] != bitmap[row][col]) {
                lastframe[row][col] = bitmap[row][col];
                drawLed(BORDER + PADDING_TOP + row + LINE_GAP * Math.floor(row / LINE_HEIGHT), BORDER + PADDING_LEFT + col, bitmap[row][col]);
            }
        }
    }
}

function getTimeNow() {
    return new Date().getTime();
}

function clockTick() {
    var tick = window.setInterval(function () {
        var now = new Date();
        drawClock(String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0') + ':' + String(now.getSeconds()).padStart(2, '0'));
    }, SECOND);

}

function drawClock(time) {
    var timeChar = Array.from(time);
    var lastPos = TIME_LEFT;
    for (var char = 0; char < timeChar.length; char++) {
        for (var row = 0; row < TIME_HEIGHT; row++) {
            for (var col = 0; col < fgSwClockFont[timeChar[char]][row].length; col++) {
                drawLed(TIME_TOP + row, lastPos + col, fgSwClockFont[timeChar[char]][row][col]);
            }
        }
        lastPos += TIME_WIDTH + TIME_GAP;
    }
}

// function to draw individual led to canvas
function drawLed(col, row, state) {
    SCREEN.fillStyle = "#000000";
    SCREEN.fillRect(row * SCALE, col * SCALE, SCALE, SCALE);
    SCREEN.beginPath();
    SCREEN.arc(row * SCALE + SCALE / 2, col * SCALE + SCALE / 2, SCALE / 2.2, 0, Math.PI * 2, false);
    if (state) {
        var led_on_style = SCREEN.createRadialGradient(row * SCALE + SCALE / 2, col * SCALE + SCALE / 2, 0, row * SCALE + SCALE / 2, col * SCALE + SCALE / 2, SCALE * 0.70);
        led_on_style.addColorStop(0, 'rgba(255, 247, 170, 1)');
        led_on_style.addColorStop(0.13, 'rgba(252, 240, 105, 1)');
        led_on_style.addColorStop(0.37, 'rgba(253, 151, 62, 1)');
        led_on_style.addColorStop(0.70, 'rgba(255, 80, 0, 1)');
        SCREEN.fillStyle = led_on_style;
    }
    else SCREEN.fillStyle = LED_OFF_STYLE;
    SCREEN.fill();
}

function setBit(col, row, state) { bitmap[row][col] = state; }

function setBitRow(row, arr) { bitmap[row] = arr; }

function setBitToMap(charMap, col, row, state) { charMap[row][col] = state; }

function setBitAll(state) {
    for (var row = 0; row < ROWS; row++) {
        for (var col = 0; col < COLS; col++) {
            setBit(col, row, state);
        }
    }
}
function setBitAllToMap(map, state) {
    for (var row = 0; row < map.length; row++) {
        for (var col = 0; col < map[row].length; col++) {
            setBitToMap(map, col, row, state);
        }
    }
}

function writeChar(char, xpos, ypos) {
    // console.log("writing char:", char);
    if ((ypos + fgSwFont[char][0].length) <= COLS) {
        for (var i = 0; i < fgSwFont[char].length; i++) {
            for (var j = 0; j < fgSwFont[char][0].length; j++) {
                if (fgSwFont[char][i][j])
                    setBit(xpos + j, ypos + i, fgSwFont[char][i][j]);
                else
                    setBit(xpos + j, ypos + i, false);
            }
        }
    }
}

function writeCharToMap(charMap, char, xpos, ypos) {
    // console.log("writing char:", char);
    if ((ypos + fgSwFont[char][0].length) <= COLS) {
        for (var i = 0; i < fgSwFont[char].length && i < charMap.length; i++) {
            for (var j = 0; j < fgSwFont[char][0].length; j++) {
                setBitToMap(charMap, xpos + j, ypos + i, fgSwFont[char][i][j]);
            }
        }
    }
}

function buildStringMap(string) {
    var charArr = Array.from(string);
    var stringMap = new Array(LINE_HEIGHT);

    // start string map with empty space at full width of matrix
    for (var row = 0; row < LINE_HEIGHT; row++) {
        stringMap[row] = Array();
        for (var col = 0; col < COLS; col++) {
            stringMap[row][col] = false;
        }
    }

    var lastCharPos = COLS;

    charArr.forEach(char => {
        for (var row = 0; row < fgSwFont[char].length; row++) {
            for (var col = 0; col < fgSwFont[char][row].length; col++) {
                stringMap[row][col + lastCharPos] = fgSwFont[char][row][col];
            }
        }
        lastCharPos += fgSwFont[char][0].length + 1;
    })

    //add empty space at the end again
    for (var row = 0; row < LINE_HEIGHT; row++) {
        for (var col = 0; col < COLS; col++) {
            stringMap[row][col + lastCharPos] = false;
        }
    }

    return stringMap;
}

function printString(string, x, y) {
    var charArr = Array.from(string);
    var lastCharPos = x;
    for (count = 0; count < charArr.length; count++) {
        let char = charArr[count];
        writeChar(char, lastCharPos, y);
        lastCharPos += fgSwFont[char][0].length + 1;
    }
}

function printStringToMap(charMap, string, x, y) {
    var charArr = Array.from(string);
    var lastCharPos = x;
    for (count = 0; count < charArr.length; count++) {
        let char = charArr[count];
        writeCharToMap(charMap, char, lastCharPos, y);
        lastCharPos += fgSwFont[char][0].length + 1;
    }
}

function scrollRow(charMap, row) {
    var newMap = new Array(charMap.length);
    for (var i = 0; i < charMap.length; i++) {
        if (i < row)
            newMap[i] = new Array(charMap[i].length).fill(false);
        else
            newMap[i] = charMap[i - row];
    }
    return newMap;
}

function animateRow(slots) {
    var frame = LINE_HEIGHT;

    var interval = window.setInterval(function () {
        for (var i = 0; i < slots.length; i++) {
            var map = scrollRow(lineSlotMaps[slots[i]], frame);
            for (var row = 0; row < map.length; row++) {
                if (slots[i] < 4) {
                    setBitRow(LINE_HEIGHT * slots[i] + row, map[row]);
                } else {
                    setBitRow(LINE_HEIGHT * ((slots[i] - 1) % 3 + 1) + row, map[row]);
                }
            }
        }
        frame--;
        for (var i = 0; i < slots.length; i++) {
            refreshRow(slots[i]);
        }
        if (frame < 0) clearInterval(interval);
    }, SCROLL_SPEED);
}

function scrollRowH(charMap, frame) {
    var newMap = new Array(LINE_HEIGHT);
    for (var row = 0; row < LINE_HEIGHT; row++) {
        newMap[row] = new Array();
        for (var col = 0; col < COLS; col++) {
            newMap[row][col] = charMap[row][col + frame];
        }
    }
    return newMap;
}

function animateRowH(stringMap, slot) {
    var frame = 0;

    var interval = window.setInterval(function () {
        var map = scrollRowH(stringMap, frame);
        for (var row = 0; row < LINE_HEIGHT; row++) {
            for (var col = 0; col < COLS; col++) {
                setBit(col, row + slot * LINE_HEIGHT, map[row][col]);
            }
        }
        frame++;
        refreshRow(1);
        if (frame > stringMap[0].length - COLS) frame = 0;
    }, SCROLL_SPEED_H);
}

function mapToString(map) {
    var output = "";
    for (var row = 0; row < map.length; row++) {
        for (var col = 0; col < map[row].length; col++) {
            output += map[row][col] ? "*" : " ";
        }
        output += "\n";
    }
    return output;
}

function numSuffix(num) {
    // floor: make integer, abs: make positive, % 100: pattern repeats every 100 numbers
    newNum = Math.floor(Math.abs(num)) % 100;
    // if number is 11-19, append "th"
    if (newNum > 10 && newNum < 20) {
        return "th";
    } else {
        // all other numbers, ends in 1=>"st" 2=>"nd" 3=>"rd", default "th", 
        switch (newNum % 10) {
            case 1: return "st";
            case 2: return "nd";
            case 3: return "rd";
            default: return "th";
        }
    }
}
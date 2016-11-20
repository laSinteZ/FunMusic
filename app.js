$(document).ready(function () {

    var functionToParse = "";
    var notes = [];
    var numOfNotes = 16;
    var notesInScale = 7;

    //Scales
    var scales = [
        [0, 2, 4, 5, 7, 9, 11],
        [0, 2, 3, 5, 7, 9, 10],
        [0, 1, 3, 5, 7, 8, 10],
        [0, 2, 4, 6, 7, 9, 11],
        [0, 2, 4, 5, 7, 8, 10],
        [0, 2, 3, 5, 7, 8, 10],
        [0, 1, 3, 5, 6, 8, 10]
    ];
    var selectedScale = 0;

    //Root tone
    var root = 0;

    //Instrument
    var instrument = [
        _tone_Piano_323000005_461_460_45127,
        _tone_Nylon_32Gt_46o000051_461_460_45127,
        _tone_Distortion_32Gdistortiongt_461_460_45127,
        _tone_Celesta000021_461_460_45127,
        _tone_Organ_324000036_461_460_45127
    ];
    var selectedInstrument = 0;

    var bpm = 60;
    var L = 4 * 60 / bpm;
    var pieceLen = 2 * L;
    var startTime = 0;
    var started = false;

    var AudioContextFunc = window.AudioContext || window.webkitAudioContext;
    var audioContext = new AudioContextFunc();
    var player = new WebAudioFontPlayer();

    function queueLater(preset, when, pitch, duration) {
        if (when > audioContext.currentTime) {
            player.queueWaveTable(audioContext, audioContext.destination, preset, when, pitch, duration);
        }
    }

    function start() {
        if (started) {
            console.log('started already');
        } else {
            started = true;
            startTime = audioContext.currentTime + 0.1;
            nextPiece();
            startTime = startTime + pieceLen;
            setInterval(function () {
                if (audioContext.currentTime > startTime - 1 / 4 * L) {
                    startTime = startTime + pieceLen;
                }
            }, 20);
        }
    }

    function nextPiece(){
        for (var i = 0; i < numOfNotes; i++){
            queueLater(instrument[selectedInstrument], startTime + i / 8 * L, 12 * 4 + root + scales[selectedScale][notes[i]], 1);
        }
    }

    $("#play").on('click', function () {
        functionToParse = $("#funToParse").val().toLowerCase();

        if ((functionToParse === "pi") || (functionToParse === "3.14") || (functionToParse === "3,14")) {
            notes = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 8, 9, 7, 9, 3]
        } else {

            for (var i = 0; i < numOfNotes; i++) {
                notes[i] = math.eval(functionToParse, {x: i});
                notes[i] = math.abs(notes[i]);
            }
        }

        for(i = 0; i < numOfNotes; i++){
            notes[i] = notes[i] % notesInScale;
            notes[i] = math.floor(notes[i]);
        }

        start();
    });

    $("#scale").on('change', function(){
        selectedScale = this.value;
    });

    $("#root").on('change', function(){
        root = this.value-0;
    });

    $("#instrument").on('change', function(){
        selectedInstrument = this.value;
    });

    $("#tempo").on('change', function(){
        bpm = this.value;
        L = 4 * 60 / bpm;
        pieceLen = 2 * L;
    });
});
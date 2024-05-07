let CANVAS = null;
const LINE_START_Y = 50; //TODO: Double check this... shouldn't it be calculated based on Canvas?
const LINE_INCREMENT = 1; //TODO: WE likely want to tune this up as some boxes are too large?

// TODO: Create object for this?
let TRIALS = [];
let current_trial = 0;
let current_box_size = 0;
let current_line_length = 0;

// TODO: refactor the deprecated "keyCode"
const setup_canvas = (trials, canvas_html_id, canvas_width, canvas_height, button_plus_id, button_minus_id) => {
    TRIALS = trials;
    current_trial = 0;
    current_box_size = 0;
    current_line_length = 0;
    CANVAS = document.getElementById(canvas_html_id);
    CANVAS.width = canvas_width;
    CANVAS.height = canvas_height;

    window.addEventListener("keydown", function (e) {
        // space and arrow keys
        if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
            e.preventDefault();
        }
    }, false);
    let upBtn = document.getElementById(button_minus_id);
    let downBtn = document.getElementById(button_plus_id);
    upBtn.addEventListener("click", up_btn_clicked);
    downBtn.addEventListener("click", down_btn_clicked);
    document.onkeydown = function (e) {
        if (e.keyCode == 40) {
            down_btn_clicked();
        } else if (e.keyCode == 38) {
            up_btn_clicked();
        }
    }
}

const down_btn_clicked = () => {
    let newLineLength = current_line_length + LINE_INCREMENT;
    if (newLineLength <= TRIALS[current_trial-1].responseBoxSize) {
        current_line_length = newLineLength;
        redraw_canvas(current_box_size, current_line_length);
    }
}

const up_btn_clicked = () => {
    let newLineLength = current_line_length - LINE_INCREMENT;
    if (newLineLength >= 0) {
        current_line_length = newLineLength;
        redraw_canvas(current_box_size, current_line_length);
    }
}

const draw_trial_result = (finished_trial) => {
    const ctx = CANVAS.getContext("2d");
    ctx.clearRect(0, 0, CANVAS.width, CANVAS.height);
    let canvasCenter = CANVAS.width/2;
    let boxPromptCenter = canvasCenter/2;
    let boxPromptSize = finished_trial.promptBoxSize;
    let boxResponseCenter = canvasCenter+boxPromptCenter;
    let boxResponseSize = finished_trial.responseBoxSize;
    ctx.fillStyle = "black";
    //PROMPT
    ctx.strokeRect((boxPromptCenter-(boxPromptSize/2)), LINE_START_Y, boxPromptSize, boxPromptSize);
    ctx.beginPath();
    ctx.moveTo(boxPromptCenter, LINE_START_Y);
    ctx.lineTo(boxPromptCenter, LINE_START_Y + finished_trial.promptLineLength);
    ctx.stroke();
    //RESPONSE
    ctx.strokeRect((boxResponseCenter-(boxResponseSize/2)), LINE_START_Y, boxResponseSize, boxResponseSize);
    ctx.beginPath();
    ctx.moveTo(boxResponseCenter, LINE_START_Y);
    ctx.lineTo(boxResponseCenter, LINE_START_Y + finished_trial.response);
    ctx.stroke();
}

const redraw_canvas = (box_size, line_length) => {
    const ctx = CANVAS.getContext("2d");
    ctx.clearRect(0, 0, CANVAS.width, CANVAS.height);
    let canvasCenter = CANVAS.width/2;
    ctx.fillStyle = "black";
    ctx.strokeRect((canvasCenter-(box_size/2)), LINE_START_Y, box_size, box_size);
    ctx.beginPath();
    ctx.moveTo(canvasCenter, LINE_START_Y);
    ctx.lineTo(canvasCenter, LINE_START_Y + line_length);
    ctx.stroke();
}

const start_next_trial = (prompt_show_time=5000, prompt_callback=()=>{}, response_callback=()=>{}) => {
    if(++current_trial <= TRIALS.length) {
        prompt_callback();
        current_line_length = TRIALS[current_trial-1].promptLineLength;
        current_box_size = TRIALS[current_trial-1].promptBoxSize;
        redraw_canvas(current_box_size, current_line_length);
        setTimeout(function () {
            response_callback();
            current_box_size = TRIALS[current_trial-1].responseBoxSize;
            current_line_length = 0;
            redraw_canvas(current_box_size, current_line_length);
        }, prompt_show_time);
        return true;
    } else {
        return false;
    }
}

const finish_current_trial = (task_type) => {
    if(current_trial <= TRIALS.length) {
        TRIALS[current_trial-1].response = current_line_length;
        current_line_length = 0;
        current_box_size = 0;
        redraw_canvas(current_box_size, current_line_length);
        //TODO: remove listeners for every trial???
        return calculate_error(TRIALS[current_trial-1], task_type);
    } else {
        return null;
    }
}

const calculate_error = (responded_trial, trial_type='absolute') => {
    let correct_response = responded_trial.promptLineLength
    if(trial_type==='relative') {
        correct_response = Math.floor(responded_trial.responseBoxSize * responded_trial.promptLineLength/responded_trial.promptBoxSize)
    }
    responded_trial.error_abs = Math.floor(Math.abs(correct_response-responded_trial.response));
    responded_trial.error_perc = responded_trial.error_abs === 0 ? 0 : Math.floor(responded_trial.error_abs/correct_response*100);

    return JSON.parse(JSON.stringify(responded_trial));
}

const get_current_trial_number = () => {
    return current_trial;
}

const get_total_trials_number = () => {
    return TRIALS.length;
}

export {get_current_trial_number, get_total_trials_number, setup_canvas, start_next_trial, finish_current_trial, draw_trial_result}
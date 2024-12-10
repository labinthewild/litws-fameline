let CANVAS = null;
let BTN_PLUS = null;
let BTN_MINUS = null;
let WAIT_ANIMATION = null;
let RANDOM_POSITION = true;
let BOX_PLACING = {X:0 ,Y:0};
let RESPONSE = false;
let POPUPS = null;

// TODO: Create object for this?
let TRIALS = [];
let current_trial_count = 0;
let current_box_size = 0;
let current_line_length = 0;

/**
 *
 * @param trials A list of trials = {promptBoxSize: IN_PX, promptLineLength: IN_PX, responseBoxSize: IN_PX}
 * @param canvas_html_id The CANVAS HTML element where the study will be drawn.
 * @param canvas_width The desired width of the canvas. Best practice is to use fullscreen, except when doings instructions!
 * @param canvas_height The desired height of the canvas.
 * @param button_plus_id The HTML element that, when clicked, the drawn line will INCREASE in length.
 * @param button_minus_id The HTML element that, when clicked, the drawn line will DECREASE in length.
 * @param wait_element_id This element will be shown between prompt and response.
 * @param random_response_positions Indicate if the response box should be drawn in random parts of the canvas (recommended == true).
 */
const setup_canvas = (trials, canvas_html_id, canvas_width, canvas_height, button_plus_id, button_minus_id,
                      wait_element_id, popup_id, random_response_positions = true) => {
    TRIALS = trials;
    current_trial_count = 0;
    current_box_size = 0;
    current_line_length = 0;
    CANVAS = document.getElementById(canvas_html_id);
    CANVAS.width = canvas_width;
    CANVAS.height = canvas_height;
    BTN_MINUS = document.getElementById(button_minus_id);
    BTN_PLUS = document.getElementById(button_plus_id);
    WAIT_ANIMATION = document.getElementById(wait_element_id);
    RANDOM_POSITION = random_response_positions;
    RESPONSE = false;
    POPUPS = {trial_num: document.getElementById("popup_trial_num"),
                instructions: document.getElementById("popup_instructions")};

    let increment = 0;
    let interval = null;
    document.onkeydown = (event) => {
        if(!interval) {
            if (event.code === 'ArrowDown') {
                event.preventDefault();
                interval = setInterval(
                    () => {
                        if (RESPONSE) 
                            increase_line_length(++increment)
                    },
                    100);
            } else if (event.code === 'ArrowUp') {
                event.preventDefault();
                interval = setInterval(
                    () => {
                        if (RESPONSE) 
                            decrease_line_length(++increment)
                    },
                    100);
            }
        }
    }
    document.onkeyup = (event) => {
        if (['ArrowDown', 'ArrowUp'].includes(event.code)) {
            increment = 0;
            clearInterval(interval);
            interval = null;
        }
    }
    setup_btn_mouse_down(BTN_MINUS, decrease_line_length);
    setup_btn_mouse_down(BTN_PLUS, increase_line_length);
}

const setup_btn_mouse_down = (button, call_this) => {
    let interval;
    let increment = 0;
    button.addEventListener('mousedown', () => {
        interval = setInterval(() => {
            call_this(++increment);
        }, 100);
    });
    button.addEventListener('mouseup', () => {
        increment = 0;
        clearInterval(interval);
    })
}

const increase_line_length = (increment) => {
    let newLineLength = current_line_length + increment;
    if (newLineLength <= TRIALS[current_trial_count-1].responseBoxSize) {
        current_line_length = newLineLength;
    } else {
        current_line_length = TRIALS[current_trial_count-1].responseBoxSize;
    }
    redraw_canvas(current_box_size, current_line_length);
}

const decrease_line_length = (decrement) => {
    let newLineLength = current_line_length - decrement;
    if (newLineLength >= 0) {
        current_line_length = newLineLength;
    } else {
        current_line_length = 0;
    }
    redraw_canvas(current_box_size, current_line_length);
}

const set_box_to_center = () => {
    BOX_PLACING.X = CANVAS.width/2;
    BOX_PLACING.Y = CANVAS.height/2;
}

const set_box_to_random = (box_size) => {
    let buffer = 5;
    let min_val = box_size/2+buffer;
    let max_x = CANVAS.width-(box_size/2)-buffer;
    let max_y = CANVAS.height-(box_size/2)-buffer;
    BOX_PLACING.X = Math.floor(Math.random() * (max_x - min_val)) + min_val;
    BOX_PLACING.Y = Math.floor(Math.random() * (max_y - min_val)) + min_val;
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
    ctx.strokeRect((boxPromptCenter-(boxPromptSize/2)), BOX_PLACING.Y, boxPromptSize, boxPromptSize);
    ctx.beginPath();
    ctx.moveTo(boxPromptCenter, BOX_PLACING.Y);
    ctx.lineTo(boxPromptCenter, BOX_PLACING.Y + finished_trial.promptLineLength);
    ctx.stroke();
    //RESPONSE
    ctx.strokeRect((boxResponseCenter-(boxResponseSize/2)), BOX_PLACING.Y, boxResponseSize, boxResponseSize);
    ctx.strokeStyle = finished_trial.error_perc <= 10 ? "#00fe11" : "#ff0000";
    ctx.lineWidth = 3.;
    ctx.beginPath();
    ctx.moveTo(boxResponseCenter, BOX_PLACING.Y);
    ctx.lineTo(boxResponseCenter, BOX_PLACING.Y + finished_trial.response);
    ctx.stroke();
}

const redraw_canvas = (box_size, line_length) => {
    let box_x = BOX_PLACING.X-(box_size/2);
    let box_y = BOX_PLACING.Y-(box_size/2);
    const ctx = CANVAS.getContext("2d");
    ctx.clearRect(0, 0, CANVAS.width, CANVAS.height);
    ctx.fillStyle = "black";
    ctx.strokeRect(box_x, box_y, box_size, box_size);
    ctx.beginPath();
    ctx.moveTo(BOX_PLACING.X, box_y);
    ctx.lineTo(BOX_PLACING.X, box_y + line_length);
    ctx.stroke();
}

const popup_text = (text, loc, time) => {
    const ctx = CANVAS.getContext("2d");
    ctx.clearRect(0, 0, CANVAS.width, CANVAS.height);
    loc.innerHTML = text;
    loc.style.visibility = "visible";
    setTimeout(() => {
        loc.innerHTML = "";
        loc.style.visibility = "hidden";
    }, time)
}

const start_next_trial = (prompt_show_time=5000, 
                            prompt_callback=()=>{}, 
                            response_callback=()=>{}, 
                            is_practice = true, 
                            task_type = undefined) => {
    const instruction_show_time = 5000;
    const counter_show_time = 2000;
    if(++current_trial_count <= TRIALS.length) {
        let current_trial = TRIALS[current_trial_count-1];
        prompt_callback();
        set_box_to_center();
        current_line_length = current_trial.promptLineLength;
        current_box_size = current_trial.promptBoxSize;
        if (!is_practice) {
            if (current_trial_count === 1) {
                popup_text($.i18n(`study-fl-pretrial-instructions-${task_type}`),
                            POPUPS.instructions,
                            instruction_show_time);
            } else {
                popup_text(`${$.i18n(`task-type-${task_type}`)}: ${current_trial_count - 1}/${TRIALS.length}`,
                                    POPUPS.trial_num,
                                    counter_show_time / 2);
                setTimeout(() => {
                    popup_text(`${$.i18n(`task-type-${task_type}`)}: ${current_trial_count}/${TRIALS.length}`,
                                        POPUPS.trial_num,
                                        counter_show_time / 2);
                    }, counter_show_time / 2)
            }
        }
        setTimeout(() => {
            redraw_canvas(current_box_size, current_line_length);
            setTimeout( () => {
                RESPONSE = false;
                CANVAS.style.visibility = 'hidden';
                BTN_PLUS.style.visibility = 'hidden';
                BTN_MINUS.style.visibility = 'hidden';
                WAIT_ANIMATION.style.visibility = 'visible';
                setTimeout(()=>{
                    response_callback();
                    RESPONSE = true;
                    CANVAS.style.visibility = 'visible';
                    BTN_PLUS.style.visibility = 'visible';
                    BTN_MINUS.style.visibility = 'visible';
                    WAIT_ANIMATION.style.visibility = 'hidden';

                    current_box_size = current_trial.responseBoxSize;
                    if(RANDOM_POSITION) set_box_to_random(current_box_size);
                    current_line_length = 0;
                    redraw_canvas(current_box_size, current_line_length);
                }, prompt_show_time)
            }, prompt_show_time);
        }, is_practice ? 0 : current_trial_count !== 1 ? counter_show_time : instruction_show_time);
        return true;
    } else {
        document.onkeydown = () => {};
        return false;
    }
}

const finish_current_trial = (task_type) => {
    RESPONSE = false;
    if(current_trial_count <= TRIALS.length) {
        TRIALS[current_trial_count-1].response = current_line_length;
        current_line_length = 0;
        current_box_size = 0;
        redraw_canvas(current_box_size, current_line_length);
        return calculate_error(TRIALS[current_trial_count-1], task_type);
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
    return current_trial_count;
}

const get_total_trials_number = () => {
    return TRIALS.length;
}

export {get_current_trial_number, 
        get_total_trials_number, 
        setup_canvas,  
        start_next_trial, 
        finish_current_trial, 
        draw_trial_result}
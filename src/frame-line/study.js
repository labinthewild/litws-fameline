/*************************************************************
 * Main code, responsible for configuring the steps and their
 * actions.
 *
 * Author: LITW Team.
 *
 * © Copyright 2017-2023 LabintheWild.
 * For questions about this file and permission to use
 * the code, contact us at tech@labinthewild.org
 *************************************************************/

// load webpack modules
window.LITW = window.LITW || {}
window.$ = require("jquery");
window.jQuery = window.$;
require("../js/jquery.i18n");
require("../js/jquery.i18n.messagestore");
require("jquery-ui-bundle");
let Handlebars = require("handlebars");
window.$.alpaca = require("alpaca");
window.bootstrap = require("bootstrap");
window._ = require("lodash");

import * as litw_engine from "../js/litw/litw.engine.0.1.0";
LITW.engine = litw_engine;

import progressHTML from "../templates/progress.html";
Handlebars.registerPartial('prog', Handlebars.compile(progressHTML));
import introHTML from "./templates/introduction.html";
import irb_LITW_HTML from "../templates/irb2-litw.html";
import demographicsHTML from "../templates/demographics.html";
import instructionsHTML from "./templates/instructions.html";
import practiceHTML from "./templates/practice.html";
import flTaskHTML from "./templates/fl-task.html";
import resultsHTML from "./templates/results.html";
import resultsFooterHTML from "../templates/results-footer.html";
import commentsHTML from "../templates/comments.html";

//CONVERT HTML INTO TEMPLATES
let introTemplate = Handlebars.compile(introHTML);
let irbLITWTemplate = Handlebars.compile(irb_LITW_HTML);
let demographicsTemplate = Handlebars.compile(demographicsHTML);
let instructionsTemplate = Handlebars.compile(instructionsHTML);
let practiceTemplate = Handlebars.compile(practiceHTML);
let flTaskTemplate = Handlebars.compile(flTaskHTML);
let resultsTemplate = Handlebars.compile(resultsHTML);
let resultsFooterTemplate = Handlebars.compile(resultsFooterHTML);
let commentsTemplate = Handlebars.compile(commentsHTML);

import * as frameline from "./js/fl-mechanics.mjs";

module.exports = (function(exports) {
	const study_times= {
			SHORT: 5,
			MEDIUM: 10,
			LONG: 15,
		};
	let timeline = [];
	let config = {
		preLoad: ["../img/btn-next.png","../img/btn-next-active.png","../img/ajax-loader.gif"],
		study_id: "e699772e-b179-411e-87bf-df7b5735b50b",
		study_recommendation: [],
		tasks: [
			{promptBoxSize:	191.0	, promptLineLength:	21.0	, responseBoxSize:	101.0	},
			{promptBoxSize:	179.0	, promptLineLength:	31.0	, responseBoxSize:	89.0	},
			{promptBoxSize:	101.0	, promptLineLength:	21.2	, responseBoxSize:	103.0	},
			{promptBoxSize:	164.0	, promptLineLength:	41.0	, responseBoxSize:	125.0	},
			{promptBoxSize:	102.0	, promptLineLength:	29.0	, responseBoxSize:	153.0	},
			{promptBoxSize:	121.0	, promptLineLength:	38.7	, responseBoxSize:	163.0	},
			{promptBoxSize:	81.0	, promptLineLength:	30.0	, responseBoxSize:	148.0	},
			{promptBoxSize:	127.0	, promptLineLength:	53.0	, responseBoxSize:	127.0	},
			{promptBoxSize:	200.0	, promptLineLength:	92.0	, responseBoxSize:	84.0	},
			{promptBoxSize:	116.0	, promptLineLength:	56.8	, responseBoxSize:	189.0	},
			{promptBoxSize:	94.0	, promptLineLength:	49.8	, responseBoxSize:	180.0	},
			{promptBoxSize:	153.0	, promptLineLength:	87.0	, responseBoxSize:	102.0	},
			{promptBoxSize:	149.0	, promptLineLength:	92.4	, responseBoxSize:	188.0	},
			{promptBoxSize:	135.0	, promptLineLength:	90.5	, responseBoxSize:	155.0	},
			{promptBoxSize:	89.0	, promptLineLength:	62.0	, responseBoxSize:	179.0	},
			{promptBoxSize:	141.0	, promptLineLength:	104.3	, responseBoxSize:	116.0	},
			{promptBoxSize:	184.0	, promptLineLength:	145.4	, responseBoxSize:	109.0	},
			{promptBoxSize:	110.0	, promptLineLength:	90.2	, responseBoxSize:	189.0	},
			{promptBoxSize:	159.0	, promptLineLength:	136.7	, responseBoxSize:	145.0	},
			{promptBoxSize:	170.0	, promptLineLength:	151.3	, responseBoxSize:	121.0	}
		],
		task_qtd: 4,
		practice_trial: [{promptBoxSize: 150, promptLineLength: 50, responseBoxSize: 100}],
		results: {
			absolute: [],
			relative: []
		},
		slides: {
			INTRODUCTION: {
				name: "introduction",
				type: LITW.engine.SLIDE_TYPE.SHOW_SLIDE,
				template: introTemplate,
				display_element_id: "intro",
				display_next_button: false,
			},
			INFORMED_CONSENT: {
				name: "informed_consent",
				type: LITW.engine.SLIDE_TYPE.SHOW_SLIDE,
				template: irbLITWTemplate,
				template_data: {
					time: study_times.MEDIUM,
				},
				display_element_id: "irb",
				display_next_button: false,
			},
			DEMOGRAPHICS: {
				name: "demographics",
				type: LITW.engine.SLIDE_TYPE.SHOW_SLIDE,
				template: demographicsTemplate,
				template_data: {
					local_data_id: 'LITW_DEMOGRAPHICS'
				},
				display_element_id: "demographics",
				finish: function(){
					let dem_data = $('#demographicsForm').alpaca().getValue();
					LITW.data.addToLocal(this.template_data.local_data_id, dem_data);
					LITW.data.submitDemographics(dem_data);
				}
			},
			INSTRUCTIONS1: {
				name: "instructions",
				type: LITW.engine.SLIDE_TYPE.SHOW_SLIDE,
				template: instructionsTemplate,
				template_data: {
					task_order: 1,
					task_type: "",
				},
				display_element_id: "instructions",
				display_next_button: true,
			},
			PRACTICE1: {
				name: "practice",
				type: LITW.engine.SLIDE_TYPE.SHOW_SLIDE,
				template: practiceTemplate,
				template_data: {
					task_order: 1,
					task_type: "",
				},
				display_element_id: "practice",
				display_next_button: false,
			},
			TASK_ABSOLUTE: {
				name: "task_absolute",
				type: LITW.engine.SLIDE_TYPE.SHOW_SLIDE,
				template: flTaskTemplate,
				template_data: {
					config: {
						task_type: 'absolute'
					}
				},
				display_element_id: "task-abs",
				display_next_button: false,
				finish: function(){
					LITW.data.submitStudyData({
						absolute: config.results.absolute
					});
				}
			},
			INSTRUCTIONS2: {
				name: "instructions",
				type: LITW.engine.SLIDE_TYPE.SHOW_SLIDE,
				template: instructionsTemplate,
				template_data: {
					task_order: 2,
					task_type: "",
				},
				display_element_id: "instructions",
				display_next_button: true,
			},
			PRACTICE2: {
				name: "practice",
				type: LITW.engine.SLIDE_TYPE.SHOW_SLIDE,
				template: practiceTemplate,
				template_data: {
					task_order: 2,
					task_type: "",
				},
				display_element_id: "practice",
				display_next_button: false,
			},
			TASK_RELATIVE: {
				name: "task_relative",
				type: LITW.engine.SLIDE_TYPE.SHOW_SLIDE,
				template: flTaskTemplate,
				template_data: {
					config: {
						task_type: 'relative'
					}
				},
				display_element_id: "task-rel",
				display_next_button: false,
				finish: function(){
					LITW.data.submitStudyData({
						relative: config.results.relative
					});
				}

			},
			COMMENTS: {
				name: "comments",
				type: LITW.engine.SLIDE_TYPE.SHOW_SLIDE,
				template: commentsTemplate,
				display_element_id: "comments",
				finish: () => {
					let comments = $('#commentsForm').alpaca().getValue();
					if (Object.keys(comments).length > 0) {
						LITW.data.submitComments({
							comments: comments
						});
					}
				}
			},
			RESULTS: {
				name: "results",
				type: LITW.engine.SLIDE_TYPE.CALL_FUNCTION,
				display_next_button: false,
				call_fn: () => {
					calculateResults();
				}
			}
		}
	};

	function configureTimeline() {
		timeline.push(config.slides.INTRODUCTION);
		timeline.push(config.slides.INFORMED_CONSENT);
		timeline.push(config.slides.DEMOGRAPHICS);
		let relative_first = Math.random()<0.5;
		LITW.data.submitStudyConfig({
			relative_first: relative_first
		});

		if (relative_first) {
			config.slides.INSTRUCTIONS1.template_data.task_type = "relative";
			config.slides.PRACTICE1.template_data.task_type = "relative";
			config.slides.INSTRUCTIONS2.template_data.task_type = "absolute";
			config.slides.PRACTICE2.template_data.task_type = "absolute";
			timeline.push(config.slides.INSTRUCTIONS1);
			timeline.push(config.slides.PRACTICE1);
			timeline.push(config.slides.TASK_RELATIVE);
			timeline.push(config.slides.INSTRUCTIONS2);
			timeline.push(config.slides.PRACTICE2);
			timeline.push(config.slides.TASK_ABSOLUTE);
		} else {
			config.slides.INSTRUCTIONS1.template_data.task_type = "absolute";
			config.slides.PRACTICE1.template_data.task_type = "absolute";
			config.slides.INSTRUCTIONS2.template_data.task_type = "relative";
			config.slides.PRACTICE2.template_data.task_type = "relative";
			timeline.push(config.slides.INSTRUCTIONS1);
			timeline.push(config.slides.PRACTICE1);
			timeline.push(config.slides.TASK_ABSOLUTE);
			timeline.push(config.slides.INSTRUCTIONS2);
			timeline.push(config.slides.PRACTICE2);
			timeline.push(config.slides.TASK_RELATIVE);
		}
		timeline.push(config.slides.COMMENTS);
		timeline.push(config.slides.RESULTS);
		return timeline;
	}

	function calculateResults() {
		//CREATING DUMMY DATA FOR TESTING
		if(Object.keys(config.results.absolute).length === 0) {
			config.results.absolute = [
				{promptBoxSize:164,promptLineLength:41,responseBoxSize:125,response:36,error_abs:5,error_perc:12},
				{promptBoxSize:101,promptLineLength:21.2,responseBoxSize:103,response:21,error_abs:0,error_perc:0},
				{promptBoxSize:184,promptLineLength:145.4,responseBoxSize:109,response:109,error_abs:36,error_perc:24},
				{promptBoxSize:179,promptLineLength:31,responseBoxSize:89,response:21,error_abs:10,error_perc:32},
				{promptBoxSize:89,promptLineLength:62,responseBoxSize:179,response:58,error_abs:4,error_perc:6}
			]
		}
		if(Object.keys(config.results.relative).length === 0) {
			config.results.relative = [
				{promptBoxSize:164,promptLineLength:41,responseBoxSize:125,response:36,error_abs:5,error_perc:16},
				{promptBoxSize:101,promptLineLength:21.2,responseBoxSize:103,response:21,error_abs:0,error_perc:0},
				{promptBoxSize:184,promptLineLength:145.4,responseBoxSize:109,response:109,error_abs:23,error_perc:26},
				{promptBoxSize:179,promptLineLength:31,responseBoxSize:89,response:21,error_abs:6,error_perc:40},
				{promptBoxSize:89,promptLineLength:62,responseBoxSize:179,response:58,error_abs:66,error_perc:53}
			]
		}
		
		let results_data = {
			relative: _.meanBy(config.results.relative, (trial) => {return trial.error_perc}),
			absolute: _.meanBy(config.results.absolute, (trial) => {return trial.error_perc})
		}
		showResults(results_data, true);
	}

	function showResults(results = {}, showFooter = false) {
		let results_div = $("#results");
		let recom_studies = [];
		LITW.engage.getStudiesRecommendation(config.study_id, (studies) => {recom_studies = studies});
		if('PID' in LITW.data.getURLparams()) {
			//REASON: Default behavior for returning a unique PID when collecting data from other platforms
			results.code = LITW.data.getParticipantId();
		}

		results_div.html(
			resultsTemplate({
				data: results
			}));
		if(showFooter) {
			$("#results-footer").html(resultsFooterTemplate(
				{
					share_url: window.location.href,
					share_title: $.i18n('litw-irb-header'),
					share_text: $.i18n('litw-template-title'),
					more_litw_studies: recom_studies
				}
			));
		}
		results_div.i18n();
		LITW.utils.showSlide("results");
	}

	function bootstrap() {
		let good_config = LITW.engine.configure_study(config.preLoad, config.languages,
			configureTimeline(), config.study_id);
		if (good_config){
			LITW.engine.start_study();
		} else {
			console.error("Study configuration error!");
			//TODO fail nicely, maybe a page with useful info to send to the tech team?
		}
	}



	// when the page is loaded, start the study!
	$(document).ready(function() {
		bootstrap();
	});
	exports.study = {};
	exports.study.params = config;
	exports.study.frameline = frameline;

})( window.LITW = window.LITW || {} );
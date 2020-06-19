// Md. Mehadi Hasan Shimul

// Must be import module files
import Navigation from './modules/Navigation';
import Demo from './modules/Demo';

import $ from 'jquery';
/* WOW INIT */
import WOW from 'wow.js';

const wow = new WOW({
  boxClass: 'wow',
  animateClass: 'animated',
  offset: 0,
  live: true
});
new WOW().init();

// Must be call our module function
var navigation = new Navigation();
var demo			= new Demo();
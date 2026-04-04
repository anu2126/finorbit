"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IndianRupee = exports.optionsTime = exports.optionsDate = void 0;
var optionsDate = {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
};
exports.optionsDate = optionsDate;
var optionsTime = {
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  hour12: true
};
exports.optionsTime = optionsTime;
var IndianRupee = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
  minimumFractionDigits: 0
});
exports.IndianRupee = IndianRupee;
//# sourceMappingURL=helpOptions.dev.js.map

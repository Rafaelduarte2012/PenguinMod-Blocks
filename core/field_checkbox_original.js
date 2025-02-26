/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2012 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Checkbox field.  Checked or not checked.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.FieldCheckboxOriginal');

goog.require('Blockly.Field');


/**
 * Class for a checkbox field.
 * @param {string} state The initial state of the field ('TRUE' or 'FALSE').
 * @param {Function=} opt_validator A function that is executed when a new
 *     option is selected.  Its sole argument is the new checkbox state.  If
 *     it returns a value, this becomes the new checkbox state, unless the
 *     value is null, in which case the change is aborted.
 * @extends {Blockly.Field}
 * @constructor
 */
Blockly.FieldCheckboxOriginal = function(state, opt_validator) {
  Blockly.FieldCheckboxOriginal.superClass_.constructor.call(this, '', opt_validator);
  // Set the initial state.
  this.setValue(state);
  this.addArgType('checkbox');
};
goog.inherits(Blockly.FieldCheckboxOriginal, Blockly.Field);

/**
 * Construct a FieldCheckboxOriginal from a JSON arg object.
 * @param {!Object} options A JSON object with options (checked).
 * @returns {!Blockly.FieldCheckboxOriginal} The new field instance.
 * @package
 * @nocollapse
 */
Blockly.FieldCheckboxOriginal.fromJson = function(options) {
  return new Blockly.FieldCheckboxOriginal(options['checked'] ? 'TRUE' : 'FALSE');
};

/**
 * Character for the checkmark.
 */
Blockly.FieldCheckboxOriginal.CHECK_CHAR = '\u2713';

/**
 * Character for the checkmark when it is not checked.
 */
Blockly.FieldCheckboxOriginal.UNCHECKED_CHAR = 'X';

/**
 * Mouse cursor style when over the hotspot that initiates editability.
 */
Blockly.FieldCheckboxOriginal.prototype.CURSOR = 'default';

/**
 * Install this checkbox on a block.
 */
Blockly.FieldCheckboxOriginal.prototype.init = function() {
  if (this.fieldGroup_) {
    // Checkbox has already been initialized once.
    return;
  }
  Blockly.FieldCheckboxOriginal.superClass_.init.call(this);
  // The checkbox doesn't use the inherited text element.
  // Instead it uses a custom checkmark element that is either visible or not.
  this.checkElement_ = Blockly.utils.createSvgElement('text',
      {'class': 'blocklyText blocklyCheckbox', 'x': -1, 'y': 22},
      this.fieldGroup_);
  var textNode = document.createTextNode(Blockly.FieldCheckboxOriginal.CHECK_CHAR);
  this.checkTextNode_ = textNode;
  this.checkElement_.appendChild(textNode);
  // this.checkElement_.style.display = this.state_ ? 'block' : 'none';
  this.checkTextNode_.nodeValue = this.state_ ?
    Blockly.FieldCheckboxOriginal.CHECK_CHAR :
    Blockly.FieldCheckboxOriginal.UNCHECKED_CHAR;
  this.checkElement_.style.display = 'block';
  this.checkElement_.style.cursor = 'pointer';
};

/**
 * Return 'TRUE' if the checkbox is checked, 'FALSE' otherwise.
 * @return {string} Current state.
 */
Blockly.FieldCheckboxOriginal.prototype.getValue = function() {
  return String(this.state_).toUpperCase();
};

/**
 * Set the checkbox to be checked if newBool is 'TRUE' or true,
 * unchecks otherwise.
 * @param {string|boolean} newBool New state.
 */
Blockly.FieldCheckboxOriginal.prototype.setValue = function(newBool) {
  var newState = (typeof newBool == 'string') ?
      (newBool.toUpperCase() == 'TRUE') : !!newBool;
  if (this.state_ !== newState) {
    if (this.sourceBlock_ && Blockly.Events.isEnabled()) {
      Blockly.Events.fire(new Blockly.Events.BlockChange(
          this.sourceBlock_, 'field', this.name, this.state_, newState));
    }
    this.state_ = newState;
    if (this.checkElement_) {
      // this.checkElement_.style.display = newState ? 'block' : 'none';
      this.checkTextNode_.nodeValue = this.state_ ?
        Blockly.FieldCheckboxOriginal.CHECK_CHAR :
        Blockly.FieldCheckboxOriginal.UNCHECKED_CHAR;
      this.checkElement_.style.display = 'block';
    }
  }
};

/**
 * Toggle the state of the checkbox.
 * @private
 */
Blockly.FieldCheckboxOriginal.prototype.showEditor_ = function() {
  var newState = !this.state_;
  if (this.sourceBlock_) {
    // Call any validation function, and allow it to override.
    newState = this.callValidator(newState);
  }
  if (newState !== null) {
    this.setValue(String(newState).toUpperCase());
  }
};

Blockly.Field.register('field_checkbox_original', Blockly.FieldCheckboxOriginal);
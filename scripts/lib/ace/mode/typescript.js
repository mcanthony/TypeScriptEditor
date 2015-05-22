/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2012, Ajax.org B.V.
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */

/*
  THIS FILE WAS AUTOGENERATED BY mode.tmpl.js
*/

define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var jsMode = require("./javascript").Mode;
var Tokenizer = require("../tokenizer").Tokenizer;
var TypeScriptHighlightRules = require("./typescript_highlight_rules").TypeScriptHighlightRules;
var CstyleBehaviour = require("./behaviour/cstyle").CstyleBehaviour;
var CStyleFoldMode = require("./folding/cstyle").FoldMode;
var MatchingBraceOutdent = require("./matching_brace_outdent").MatchingBraceOutdent;
var WorkerClient = require("../worker/worker_client").WorkerClient;

var Mode = function() {
    var highlighter = new TypeScriptHighlightRules();
    
    this.$tokenizer = new Tokenizer(highlighter.getRules());
    this.$outdent = new MatchingBraceOutdent();
    this.$behaviour = new CstyleBehaviour();
    this.foldingRules = new CStyleFoldMode();
};
oop.inherits(Mode, jsMode);

(function() {
    this.createWorker = function(session) {
        
        var worker = new WorkerClient(
            // WorkerClient will load `ace`. 
            ["ace"], 
            // The worker client is itself located in this file
            "ace/mode/typescript_worker",
            // And within the file it wants this member as the worker class
            "TypeScriptWorker"
        );
        
        worker.attachToDocument(session.getDocument());

        worker.on("terminate", function() {
            session.clearAnnotations();
        });

        worker.on("compileErrors", function(results) {
            session.setAnnotations(results.data);
            session._emit("compileErrors", {data: results.data});

        });

        worker.on("compiled", function(result) {
            session._emit("compiled", {data: result.data});
        });

        return worker;
    };
}).call(Mode.prototype);

exports.Mode = Mode;
});
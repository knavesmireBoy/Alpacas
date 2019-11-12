/*jslint nomen: true */
/*global window: false */
/*global document: false */
/*global _: false */

   if (!window.gAlp) {
	window.gAlp = {};
}

(function () {
	"use strict";
    var con = window.console.log,
        ie6table = function(table){
            var pass = false,
                tb = document.querySelector('tbody'),
                tb2 = document.createElement('tbody'),
                table2 = document.createElement('table'),
                rows = _.toArray(tb.childNodes),
                isEl = function(node){
                    return node.nodeType === 1;
                },
                doPass = function(node, i){
                    pass = !!i;
                };
            rows = _.filter(rows, isEl);
            tb2 = table2.appendChild(tb2);
            
             _.each(rows, function(row, i, coll){
            _.each(_.filter(_.toArray(row.childNodes), isEl), doPass);
                    if(pass){
                        tb2.appendChild(coll[i]);
                    }
                 pass = false; 
        });
        table.insertBefore(table2, tb);
        };
    //ie6table(document.querySelector('table'));
}());
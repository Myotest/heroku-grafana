/*! grafana - v2.0.2 - 2015-04-22
 * Copyright (c) 2015 Torkel Ödegaard; Licensed Apache License */

define(["angular","lodash","kbn","./influxSeries","./queryBuilder","./queryCtrl","./funcEditor"],function(a,b,c,d,e){"use strict";var f=a.module("grafana.services");f.factory("InfluxDatasource",["$q","$http","templateSrv",function(a,c,f){function g(a){this.type="influxdb",this.urls=b.map(a.url.split(","),function(a){return a.trim()}),this.username=a.username,this.password=a.password,this.name=a.name,this.database=a.database,this.basicAuth=a.basicAuth,this.supportAnnotations=!0,this.supportMetrics=!0,this.editorSrc="app/features/influxdb/partials/query.editor.html",this.annotationEditorSrc="app/features/influxdb/partials/annotations.editor.html"}function h(a,b,c){return b().then(void 0,function(d){0!==d.status||d.status>=300?(d.message="InfluxDB Error: <br/>"+d.data,a.reject(d)):setTimeout(function(){return h(a,b,Math.min(2*c,3e4))},c)})}function i(a,b){var c=new d({seriesList:b,alias:a});return c.getTimeSeries()}function j(a){var b=k(a.range.from),c=k(a.range.to),d="s"===b[b.length-1];return"now()"!==c||d?"time > "+b+" and time < "+c:"time > "+b}function k(a){return b.isString(a)?a.replace("now","now()").replace("-"," - "):l(a)}function l(a){return(a.getTime()/1e3).toFixed(0)+"s"}return g.prototype.query=function(c){var d=j(c),g=b.map(c.targets,function(a){if(a.hide)return[];var g=new e(a),h=g.build();console.log("query builder result:"+h),h=h.replace("$timeFilter",d),h=h.replace(/\$interval/g,a.interval||c.interval),h=f.replace(h);var j=a.alias?f.replace(a.alias):"",k=b.partial(i,j);return this._seriesQuery(h).then(k)},this);return a.all(g).then(function(a){return{data:b.flatten(a)}})},g.prototype.annotationQuery=function(a,b){var c=j({range:b}),e=a.query.replace("$timeFilter",c);return e=f.replace(e),this._seriesQuery(e).then(function(b){return new d({seriesList:b,annotation:a}).getAnnotations()})},g.prototype.metricFindQuery=function(c,d){var e;try{e=f.replace(c)}catch(g){return a.reject(g)}return console.log("metricFindQuery called with: "+[c,d].join(", ")),this._seriesQuery(e,d).then(function(a){if(!a||0===a.results.length)return[];var c=a.results[0];if(!c.series)return[];console.log("metric find query response",a);var e=c.series[0];switch(d){case"MEASUREMENTS":return b.map(e.values,function(a){return{text:a[0],expandable:!0}});case"TAG_KEYS":var f=b.flatten(e.values);return b.map(f,function(a){return{text:a,expandable:!0}});case"TAG_VALUES":var g=b.flatten(e.values);return b.map(g,function(a){return{text:a,expandable:!0}});default:var h=b.flatten(e.values);return b.map(h,function(a){return{text:a,expandable:!0}})}})},g.prototype._seriesQuery=function(a){return this._influxRequest("GET","/query",{q:a})},g.prototype._influxRequest=function(d,e,f){var g=this,i=a.defer();return h(i,function(){var a=g.urls.shift();g.urls.push(a);var h={u:g.username,p:g.password};g.database&&(h.db=g.database),"GET"===d&&(b.extend(h,f),f=null);var j={method:d,url:a+e,params:h,data:f,precision:"ms",inspect:{type:"influxdb"}};return j.headers=j.headers||{},g.basicAuth&&(j.headers.Authorization=g.basicAuth),c(j).success(function(a){i.resolve(a)})},10),i.promise},g}])});
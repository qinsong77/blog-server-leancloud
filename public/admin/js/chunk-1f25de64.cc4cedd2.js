(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-1f25de64"],{"07e8":function(t,e,n){},"6b96":function(t,e,n){"use strict";n.r(e);var a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("div",{staticClass:"tags-list"},t._l(t.tags,function(e,a){return n("el-tag",{key:e.id,attrs:{closable:"",type:t.randomType()},on:{close:function(n){t.deleteTag(e.id,a)}}},[t._v("\n            "+t._s(e.name)+"\n        ")])})),n("el-form",{staticClass:"form-inline",attrs:{inline:!0}},[n("el-form-item",{attrs:{label:"新建标签"}},[n("el-input",{attrs:{type:"text"},model:{value:t.newTag,callback:function(e){t.newTag=e},expression:"newTag"}})],1),n("el-form-item",[n("el-button",{attrs:{type:"primary",loading:t.subLoading},on:{click:t.submitNewTag}},[t._v("保存")])],1)],1)],1)},s=[],i=(n("cadf"),n("551c"),n("097d"),{name:"tags",data:function(){return{subLoading:!1,newTag:"",tags:[]}},computed:{},created:function(){this.getTags()},mounted:function(){},methods:{randomType:function(){return["success","info","warning","danger","default"][Math.floor(5*Math.random())]},getTags:function(){var t=this;this.$Axios.get("/tag/all").then(function(e){t.tags=e.content})},submitNewTag:function(){var t=this;if(""===this.newTag.trim())return this.$message.error("新建名称不能为空"),!1;this.subLoading=!0,this.$Axios.post("tag/create",{name:this.newTag}).then(function(e){t.$message.success(e.msg),t.getTags()}).finally(function(){t.subLoading=!1})},deleteTag:function(t,e){var n=this;this.tags.splice(e,1),this.$Axios.delete("/tag/delete",{id:t}).then(function(t){n.$message.success(t.msg)})}}}),o=i,c=(n("9dba"),n("2877")),u=Object(c["a"])(o,a,s,!1,null,null,null);u.options.__file="tags.vue";e["default"]=u.exports},"9dba":function(t,e,n){"use strict";var a=n("07e8"),s=n.n(a);s.a}}]);
//# sourceMappingURL=chunk-1f25de64.cc4cedd2.js.map
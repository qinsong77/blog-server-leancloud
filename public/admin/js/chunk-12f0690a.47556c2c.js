(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-12f0690a"],{"465a":function(e,t,l){"use strict";var i=l("9f7e"),s=l.n(i);s.a},"93f4":function(e,t,l){"use strict";l.r(t);var i=function(){var e=this,t=e.$createElement,l=e._self._c||t;return l("div",[l("el-button",{attrs:{type:"primary"},on:{click:function(t){e.dialogVisible=!0}}},[e._v("上传"),l("i",{staticClass:"el-icon-upload el-icon--right"})]),l("el-dialog",{attrs:{title:"图片上传",visible:e.dialogVisible},on:{"update:visible":function(t){e.dialogVisible=t}}},[l("el-upload",{ref:"upload",staticClass:"upload-demo",attrs:{action:"/admin/api/file/upload","on-preview":e.handlePreview,"on-remove":e.handleRemove,"on-success":e.uploadSuccess,"on-error":e.uploadError,"on-change":e.fileStatusChange,"file-list":e.fileList,"list-type":"picture","auto-upload":!1}},[l("el-button",{attrs:{slot:"trigger",size:"small",type:"primary"},slot:"trigger"},[e._v("选取文件")]),l("el-button",{staticStyle:{"margin-left":"10px"},attrs:{size:"small",type:"success"},on:{click:e.submitUpload}},[e._v("上传到服务器")])],1)],1),l("div",{staticClass:"table-content"},[l("el-table",{staticStyle:{width:"100%"},attrs:{data:e.items,border:""}},[l("el-table-column",{attrs:{type:"index",width:"30"}}),l("el-table-column",{attrs:{prop:"createdAt",label:"上传日期",width:"200"},scopedSlots:e._u([{key:"default",fn:function(t){return[l("i",{staticClass:"el-icon-time"}),l("span",{staticStyle:{"margin-left":"3px"}},[e._v(e._s(new Date(t.row.createdAt).toLocaleString()))])]}}])}),l("el-table-column",{attrs:{prop:"name",label:"图片上传名称"}}),l("el-table-column",{attrs:{prop:"url","min-width":"400",label:"url"}}),l("el-table-column",{attrs:{prop:"url",width:"100",label:"缩略图"},scopedSlots:e._u([{key:"default",fn:function(e){return[l("img",{staticStyle:{"margin-left":"3px"},attrs:{src:e.row.url+"?imageView/2/w/50/h/100/q/50/format/png"}})]}}])}),l("el-table-column",{attrs:{label:"操作"},scopedSlots:e._u([{key:"default",fn:function(t){return[l("el-button",{attrs:{size:"mini",type:"warning"},on:{click:function(l){e.handleDelete(t.$index,t.row)}}},[e._v("删除")])]}}])})],1)],1)],1)},s=[],o=(l("cadf"),l("551c"),l("097d"),{data:function(){return{dialogVisible:!1,fileList:[],items:[]}},created:function(){var e=this;this.$Axios.get("/file/all").then(function(t){console.log(t),e.items=t.content.data})},methods:{submitUpload:function(){this.$refs.upload.submit()},handleRemove:function(e,t){console.log(e,t)},handlePreview:function(e){console.log(e)},uploadSuccess:function(e,t,l){e.result?(this.$message({message:e.msg,type:"success"}),e.content.createdAt=Date.now(),this.items.unshift(e.content)):this.$message({message:e.msg,type:"error"})},uploadError:function(e,t,l){console.error(e),this.$message.error(e)},fileStatusChange:function(){},handleDelete:function(e,t){var l=this;console.log(e),console.log(t),this.$Axios.delete("/file/delete",{fileId:t.objectId}).then(function(t){l.$message.success(t.msg),l.items.splice(e,1)})}}}),n=o,a=(l("465a"),l("2877")),r=Object(a["a"])(n,i,s,!1,null,"25fb5d9f",null);r.options.__file="imgUpload.vue";t["default"]=r.exports},"9f7e":function(e,t,l){}}]);
//# sourceMappingURL=chunk-12f0690a.47556c2c.js.map
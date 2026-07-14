import {defineField, defineType} from "sanity"

export const announcementType = defineType({
  name: "announcement",
  title: "Announcement",
  type: "document",
  fields: [
    defineField({name:"title",title:"Title",type:"string",validation:r=>r.required().max(100)}),
    defineField({name:"summary",title:"Announcement Text",type:"text",rows:5,validation:r=>r.required().max(500)}),
    defineField({
      name:"category",title:"Category",type:"string",initialValue:"stream",
      options:{layout:"radio",list:[
        {title:"Stream Update",value:"stream"},
        {title:"New Video",value:"video"},
        {title:"Schedule",value:"schedule"},
        {title:"Community",value:"community"},
        {title:"General",value:"announcement"},
      ]},
      validation:r=>r.required(),
    }),
    defineField({name:"image",title:"Image",type:"image",options:{hotspot:true}}),
    defineField({name:"publishedAt",title:"Publish Date",type:"datetime",initialValue:()=>new Date().toISOString(),validation:r=>r.required()}),
    defineField({name:"featured",title:"Feature on Homepage",type:"boolean",initialValue:false}),
    defineField({name:"buttonText",title:"Button Text",type:"string"}),
    defineField({name:"buttonUrl",title:"Button URL",type:"url",validation:r=>r.uri({scheme:["http","https"]})}),
  ],
  preview:{
    select:{title:"title",category:"category",media:"image",featured:"featured"},
    prepare({title,category,media,featured}){return{title:featured?`★ ${title}`:title,subtitle:category,media}},
  },
})

import {defineField, defineType} from "sanity"

export const announcementType = defineType({
  name: "announcement",
  title: "Announcement",
  type: "document",

  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: rule => rule.required().max(100),
    }),

    defineField({
      name: "summary",
      title: "Announcement Text",
      type: "text",
      rows: 5,
      validation: rule => rule.required().max(500),
    }),

    defineField({
      name: "category",
      title: "Category",
      type: "string",
      initialValue: "stream",
      options: {
        layout: "radio",
        list: [
          {title: "🎮 Stream Update", value: "stream"},
          {title: "📢 Announcement", value: "announcement"},
          {title: "👤 Personal", value: "personal"},
          {title: "📅 Schedule", value: "schedule"},
          {title: "💜 Community", value: "community"},
          {title: "🌐 Website Update", value: "website"},
          {title: "🎉 Event", value: "event"},
        ],
      },
      validation: rule => rule.required(),
    }),

    defineField({
      name: "priority",
      title: "Priority",
      type: "string",
      initialValue: "normal",
      options: {
        layout: "radio",
        list: [
          {title: "Normal", value: "normal"},
          {title: "Important", value: "important"},
          {title: "Critical", value: "critical"},
        ],
      },
      validation: rule => rule.required(),
    }),

    defineField({
      name: "author",
      title: "Author",
      type: "string",
      initialValue: "Arnimane",
      validation: rule => rule.required().max(60),
    }),

    defineField({
      name: "signoffStyle",
      title: "Author Sign-off",
      type: "string",
      initialValue: "chaos",
      options: {
        layout: "radio",
        list: [
          {title: "With Chaos, Arnimane", value: "chaos"},
          {title: "- Arnimane", value: "dash"},
        ],
      },
      validation: rule => rule.required(),
    }),

    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: {hotspot: true},
    }),

    defineField({
      name: "publishedAt",
      title: "Publish Date",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: rule => rule.required(),
    }),

    defineField({
      name: "featured",
      title: "Featured Announcement",
      description: "Pin this announcement as the main post on the homepage.",
      type: "boolean",
      initialValue: false,
    }),

    defineField({
      name: "buttonText",
      title: "Button Label",
      type: "string",
      description: "Examples: Watch on Twitch, Learn More, Join Discord",
    }),

    defineField({
      name: "buttonUrl",
      title: "Button Link",
      type: "url",
      validation: rule => rule.uri({scheme: ["http", "https"]}),
    }),
  ],

  preview: {
    select: {
      title: "title",
      category: "category",
      media: "image",
      featured: "featured",
      priority: "priority",
      author: "author",
    },

    prepare({title, category, media, featured, priority, author}) {
      const priorityPrefix =
        priority === "critical" ? "🚨 " :
        priority === "important" ? "⚠️ " :
        ""

      return {
        title: `${featured ? "★ " : ""}${priorityPrefix}${title}`,
        subtitle: `${category || "announcement"} • ${author || "Unknown author"}`,
        media,
      }
    },
  },
})

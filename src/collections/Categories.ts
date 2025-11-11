import type { CollectionConfig } from 'payload'

// Simple slugify implementation (avoid extra dependency)
function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

const setOwnerAndSlug = async ({ data, req, operation }: any) => {
  if (operation === 'create') {
    if (req.user && !data.owner) {
      data.owner = req.user.id
    }
    if (data.title && !data.slug) {
      data.slug = slugify(data.title)
    }
  }
  if (operation === 'update') {
    if (data.title && !data.slug) {
      data.slug = slugify(data.title)
    }
  }
  return data
}

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
    create: ({ req }: any) => !!req.user,
    // Use where constraints so we don't rely on `doc` being present
    update: ({ req }: any) => {
      if (!req.user) return false
      return { owner: { equals: req.user.id } }
    },
    delete: ({ req }: any) => {
      if (!req.user) return false
      return { owner: { equals: req.user.id } }
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      required: false,
    },
    {
      // Virtual join field to surface related posts referencing this category via posts.categories
      name: 'posts',
      type: 'join',
  collection: 'posts' as any,
      on: 'categories',
      label: 'Posts in this Category',
    },
  ],
  hooks: {
    beforeChange: [setOwnerAndSlug],
  },
}

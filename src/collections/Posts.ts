import type { CollectionConfig } from 'payload'

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
    create: ({ req }: any) => Boolean(req.user),
    update: ({ req }: any) => Boolean(req.user),
    delete: ({ req }: any) => Boolean(req.user),
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
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories' as any,
      hasMany: true,
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
  ],
  hooks: {
    beforeChange: [async ({ data, req, operation }: any) => {
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
    }],
  },
}

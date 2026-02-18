import type { CollectionConfig } from 'payload'

export const Customers: CollectionConfig = {
  slug: 'customers',
  admin: { useAsTitle: 'email' },
  auth: true,
  fields: [],
  //   fields: [{ name: 'email', type: 'email', required: true }],
}

import { CollectionConfig } from 'payload'
import { VideoBlock } from '../blocks/VideoBlock'
import { QuizBlock } from '../blocks/QuizBlock'
import { FinishBlock } from '../blocks/FinishBlock'

export const Courses: CollectionConfig = {
  slug: 'courses',
  admin: { useAsTitle: 'title' },
  access: {
    create: ({ req: { user } }) => user?.collection === 'users',
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => user?.collection === 'users',
    delete: ({ req: { user } }) => user?.collection === 'users',
  },
  fields: [
    { name: 'title', label: 'Title', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea', required: true },
    { name: 'image', label: 'Image', type: 'relationship', relationTo: 'media', required: true },
    {
      name: 'curriculum',
      label: 'Curriculum',
      type: 'blocks',
      blocks: [VideoBlock, QuizBlock, FinishBlock],
    },
  ],
}

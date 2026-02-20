import { NextRequest } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Course, Participation } from '@/payload-types'
import ejs from 'ejs'
import { getCustomer } from '@/app/(frontend)/(authenticated)/actions/getCustomer'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ participationId: string }> },
) {
  try {
    const payload = await getPayload({ config: configPromise })
    const customer = await getCustomer()

    // check for customer
    if (!customer) {
      return new Response('Unauthorized', { status: 401 })
    }

    const participationId = (await params).participationId

    const participation: Participation = await payload.findByID({
      collection: 'participation',
      id: participationId,
      overrideAccess: false,
      user: customer,
    })

    if (!participation) {
      return new Response('Participation not found', { status: 404 })
    }

    const course = participation.course as Course
    const curriculum = course.curriculum ?? []
    const curriculumLength = curriculum.length
    const lastModule = curriculum[curriculumLength - 1] // assume each course has at least one module...

    // Validate certificate eligibility
    if (lastModule?.blockType !== 'finish') {
      return new Response('Course has no certificate', { status: 400 })
    }

    if (participation.progress !== curriculum.length - 1) {
      return new Response('Course not completed', { status: 400 })
    }

    const html = ejs.render(lastModule.template, {
      name: customer?.email ?? 'Anonymous',
      courseTitle: course.title,
      date: new Date(participation.updatedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }),
    })

    // What we really want to do here is return a PDF file.
    // The tutorial however uses a third party API that no longer exists to perform the
    // conversion from HTML to PDF. So just return the HTML for now, even if that's a bit redundant..

    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': 'attachment; filename="Certificate.html"',
      },
    })
  } catch (err) {
    console.error('Certificate generation failed:', err)
    return new Response('Failed to generate certificate', { status: 500 })
  }
}

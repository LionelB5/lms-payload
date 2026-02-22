# Course platform built with Payload CMS

This is a project to learn more about [Payload CMS](https://github.com/payloadcms/payload), a
Next.js framework offering headless CMS functionality.

I followed [this course](https://youtube.com/playlist?list=PLPZcitw0PKPcjA2ZholMdQF0R2tTkX6to)
available on youtube to put together the project.

## What this project features

This project has the following functionality:

- User registration/login system, including forgotten password flow.
- Logged in users can view and enrol in available courses.
- Once enrolled in a course, the user can view its content (videos, quizzes).
- Progress through each course is saved to the user's account and displayed on the website.
- Upon completion of a course the user can generate a certificate of completion.
- Administrators can login to the backend and can configure course content such
  as quizzes, videos, and certificate templates.

## Technical details

Some technical details of the project:

- All items uploaded to the `media` collection are stored in S3.
- Emails are sent via the (Brevo)[https://www.brevo.com/] service (we use this service as its
  free tier is a quick and easy solution for email functionality).
- Course videos are hosted using the (Bunny)[https://bunny.net/] CDN.

## Drawbacks

The project isn't perfect, it was put together quickly to learn some Payload CMS basics:

- Ideally we'd generate PDF certificates, however the API used to convert HTML -> PDF used by
  the course no longer exists, so for now we just return a HTML certificate to the client.
- The course instructs to guard the `(authenticated)` routes by checking the user object in
  `template.tsx`. Brief mention during the course that a more performant solution might be to
  perform the authentication check in a custom middleware instead, need to investigate further.
- The `QuizModule` contains convoluted logic and should be cleaned up.
- State management is handled poorly. In the
  `/(authenticated)/dashboard/participation/[participationId]` route's page, we retrieve the logged
  in user's `Participation` object relating to the selected course and pass this object down
  to several components. As the user progresses through the course `Participation.progress` will
  be updated on the backend, and this participation object will go out of date (until the user
  refreshes the page, for instance). There is no impact on the actual behaviour of the application,
  but it's a footgun and bad smell to be passing around an object with outdated properties.

## Local development

The application relies on a Next.js server and a MongoDB database (to support Payload CMS).

To run the application locally:

1. Copy `.env.example` to `.env` and update values containing `CHANGE_ME`.
   - Note that a MongoDB database can be spun up using the supplied `docker-compose.yml`, and
     you can point the application to this DB using the `DATABASE_URL` env var.
   - You'll need to create an S3 Bucket and generate a set of credentials so the
     application is able to access it for media uploads.
2. Spin up the application by either:
   - Executing a `docker compose up`. This will bring up two containers, one running Next.js
     and the other running MongoDB.
   - Executing `npm install && npm run dev`, you can optionally run `docker compose up mongo` to
     spin up a MongoDB container.

Optionally, you can seed the database using the provided database dump.

1. Unzip `database-dump`.
2. Use a tool like `mongorestore` to restore the `test` database.

```bash
mongorestore \
  --uri="mongodb://localhost:27017/" \
  --db test \
  database-dump/test
```

When configuring `DATABASE_URL` ensure you specify `test` as the database name i.e `mongodb://mongo:27017/test`.

The credentials for the Payload CMS admin user are:

- Username: test@test.local
- Password: foobar

## Deployment

This repo doesn't contain IaC or other code/scripts to perform automated deployments.

The `Dockerfile` however makes it quite straightforward to deploy the Next.js application to a
service of your choosing (ECS/Fargate on AWS, docker running on a VPS etc.).

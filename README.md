# Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.

# Planetscale - DB commands
- pscale auth login
- pscale connect busapp dev --port 3309
- pscale org switch busapp #set auth organization
# NPM commands
- npm run dev # this runs the app locally
- npm run build # this builds the app to check for errors, always run this before commiting

# Prisma Commands
- npx prisma studio # loads prisma db page
- npx prisma generate #set up client
- npx prisma db push #pushes schema to db
- npx prisma db seed # seeds data from the seed.ts file

# GIT
- git status - Checks changes
- git add . - Adds all changes to git
- git commit -m '' - This commits the changes with a message
- git push - Pushes to github
- git pull - Pulls latest, please pull before pushing

# Google Maps
- npm install @react-google-maps/api
- npm install use-places-autocomplete
- https://www.youtube.com/watch?v=BL2XVTqz9Ek
- https://www.youtube.com/watch?v=9e-5QHpadi0
- https://dany-rivera.medium.com/how-to-add-google-maps-api-in-next-js-13-step-by-step-c027813d5769
- https://www.99darshan.com/posts/interactive-maps-using-nextjs-and-google-maps
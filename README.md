# A Stock Take App Built By Remix!

- [Remix Docs](https://remix.run/docs)

## Deployment

After having run the `create-remix` command and selected "Vercel" as a deployment target, you only need to [import your Git repository](https://vercel.com/new) into Vercel, and it will be deployed.

If you'd like to avoid using a Git repository, you can also deploy the directory by running [Vercel CLI](https://vercel.com/cli):

```sh
npm i -g vercel
vercel
```

It is generally recommended to use a Git repository, because future commits will then automatically be deployed by Vercel, through its [Git Integration](https://vercel.com/docs/concepts/git).

## Development

To run your Remix app locally, make sure your project's local dependencies are installed:

```sh
npm install
```

Afterwards, start the Remix development server like so:

```sh
npm run dev
```

Open up [http://localhost:3000](http://localhost:3000) and you should be ready to go!

If you're used to using the `vercel dev` command provided by [Vercel CLI](https://vercel.com/cli) instead, you can also use that, but it's not needed.

## App Functionalities

Consist of 3 data models:
- Product
- Item
- Order

1. A product can have multiple items, hence, a bundle kit type of product. It can also just have one item.
2. You can add/remove item(s)/product(s) and order(s).
3. Adding/removing orders will automatically update inventory (item count) as well as inventory values.
4. Email/password auth with Supabase

## Tech Stacks Used Other Than Remix

- TaildwindCSS/Material UI
- Supabase for Auth
- Sanity IO for data hosting
- Typescript

## To Get Up And Running
Set the following values in your .env file:
- SANITY_STUDIO_TOKEN
- SUPABASE_PUBLIC_KEY
- SUPABASE_PROJ_URL
- SESSION_STORAGE_SECRET
# Editing the site

The pages use Tailwind CSS classes, compiled into `styles.css` (no build step on Vercel).
If you add **new** Tailwind classes to any page, rebuild `styles.css` from the repo folder:

```bash
npm install --no-save tailwindcss@4 @tailwindcss/cli@4
npx @tailwindcss/cli -i tailwind.input.css -o styles.css --minify
```

Text-only edits don't need a rebuild.

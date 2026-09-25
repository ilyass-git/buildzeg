# BUILDZEG Website

Showcase website for BUILDZEG, a design & build company based in Casablanca, Morocco
(fit-out, design & build, renovation, interior design, joinery, project management and
facility management).

Live site: [buildzeg.com](https://buildzeg.com)

## Project structure

```
/
├── index.html        # Home: hero carousel, recent projects, core services, clients, FAQ
├── services.html     # Services
├── projets.html      # Projects portfolio
├── contact.html      # Contact details + contact form (EmailJS)
├── css/style.css     # All styles
├── js/script.js      # Menu, animations, carousel, FAQ, form validation and sending
├── js/i18n.js        # English / French switch and French translations
├── images/           # Optimised images, favicons, social share image (og-image.jpg)
├── favicon.ico
├── robots.txt
└── sitemap.xml
```

Static site: no build step and no dependencies.

## Local development

Open `index.html` in a browser, or serve the folder (for example with the VS Code
"Live Server" extension, or `python -m http.server`).

## English / French

The pages are written in English. The **FR / EN** button in the navigation switches the
whole site to French; the choice is remembered (browser `localStorage`) across pages and visits.

Translations live in `js/i18n.js`, in the `FR` object: each line maps the **exact English
text** (as it appears on the page, spaces collapsed) to its French version. When you add or
change a text in the HTML, add or update its line in `FR`, otherwise it stays in English.
Messages created by `js/script.js` (form errors, etc.) go through the `t()` helper and are
translated the same way.

## Contact form

The form on `contact.html` is sent with [EmailJS](https://www.emailjs.com/).
The configuration lives at the top of the "Contact form sending" section in `js/script.js`:

| Setting | Value |
|---------|-------|
| Recipient (`to_email`) | `younes.zeghari@buildzeg.com` |
| Service ID | `service_ntz0utf` |
| Template ID | `template_ymfdbdf` |

The public key is set in `contact.html` (`emailjs.init`).

Template variables sent: `to_email`, `from_name`, `from_email`, `reply_to`, `phone`, `message`.
In the EmailJS template settings, set **To Email** to `{{to_email}}` (or directly to
`younes.zeghari@buildzeg.com`) and **Reply To** to `{{reply_to}}`.

For security, restrict the public key to the site's domain in the EmailJS dashboard
(Account → Security → allowed origins).

## Images

Images are resized to a maximum of 1920px and saved as compressed JPG (quality ~82).
Keep new images under ~500 KB; don't upload phone photos (HEIC or 10+ MB PNG) directly.

## Design

- Colors: CSS variables at the top of `css/style.css` (primary `#03224C`)
- Fonts: Montserrat (headings), Open Sans (body), Playfair Display italic (slogans)

## Deployment

Hosted as a static site. After changing `css/style.css`, bump the `?v=` number on the
stylesheet link in **all four** HTML pages so visitors get the new version.

## Contact

**BUILDZEG** · +212 695 323 597 · younes.zeghari@buildzeg.com · Casablanca, Morocco

© 2026 BUILDZEG. All rights reserved.


import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  noIndex?: boolean;
  image?: string;
}

const BASE_URL =
  "https://code-doctor-front.vercel.app";

const DEFAULT_IMAGE =
  `${BASE_URL}/og-image.png`;

export default function SEO({
  title,
  description,
  canonical,
  noIndex = false,
  image = DEFAULT_IMAGE,
}: SEOProps) {
  useEffect(() => {
    document.title = title;

    const mettreAJourMeta = (
      attribute: "name" | "property",
      value: string,
      content: string
    ) => {
      let element = document.head.querySelector<HTMLMetaElement>(
        `meta[${attribute}="${value}"]`
      );

      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, value);
        document.head.appendChild(element);
      }

      element.setAttribute("content", content);
    };

    mettreAJourMeta(
      "name",
      "description",
      description
    );

    mettreAJourMeta(
      "name",
      "robots",
      noIndex
        ? "noindex, nofollow"
        : "index, follow"
    );

    mettreAJourMeta(
      "property",
      "og:type",
      "website"
    );

    mettreAJourMeta(
      "property",
      "og:title",
      title
    );

    mettreAJourMeta(
      "property",
      "og:description",
      description
    );

    mettreAJourMeta(
      "property",
      "og:image",
      image
    );

    mettreAJourMeta(
      "property",
      "og:site_name",
      "CodeDoctor"
    );

    mettreAJourMeta(
      "name",
      "twitter:card",
      "summary_large_image"
    );

    mettreAJourMeta(
      "name",
      "twitter:title",
      title
    );

    mettreAJourMeta(
      "name",
      "twitter:description",
      description
    );

    mettreAJourMeta(
      "name",
      "twitter:image",
      image
    );

    const url =
      canonical ||
      `${BASE_URL}${window.location.pathname}`;

    let lienCanonical =
      document.head.querySelector<HTMLLinkElement>(
        'link[rel="canonical"]'
      );

    if (!lienCanonical) {
      lienCanonical =
        document.createElement("link");

      lienCanonical.setAttribute(
        "rel",
        "canonical"
      );

      document.head.appendChild(
        lienCanonical
      );
    }

    lienCanonical.setAttribute(
      "href",
      url
    );
  }, [
    title,
    description,
    canonical,
    noIndex,
    image,
  ]);

  return null;
}

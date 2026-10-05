import React from "react";
import { Helmet } from "react-helmet";
import PropTypes from "prop-types";
import {
  SITE_NAME,
  SITE_TAGLINE,
  ORIGIN,
  DEFAULT_IMAGE,
  IMAGE_ALT,
  DEFAULT_DESCRIPTION,
} from "../../lib/pageMeta";

/**
 * SEO — sets every page's <title>, description, canonical URL, and
 * Open Graph / Twitter share tags.
 *
 * Per-route defaults live in src/lib/pageMeta.js (shared with the
 * post-build static-meta generator). Passing explicit props overrides
 * those defaults; `noIndex` keeps staff pages out of search engines.
 */
function SEO({ title, description, path = "/", image, noIndex = false }) {
  const fullTitle = title
    ? `${title} — ${SITE_NAME}`
    : `${SITE_NAME} — ${SITE_TAGLINE}`;
  const desc = description || DEFAULT_DESCRIPTION;
  const url = `${ORIGIN}${path}`;
  const imageUrl = image?.startsWith("http") ? image : `${ORIGIN}${image || DEFAULT_IMAGE}`;

  // index.html ships static, route-agnostic defaults (marked with
  // data-default-meta) so crawlers without JS still read correct tags.
  // Once the app mounts, react-helmet owns these tags — remove the static
  // ones so the DOM never holds two descriptions/canonicals.
  React.useEffect(() => {
    document
      .querySelectorAll("meta[data-default-meta], link[data-default-meta]")
      .forEach((el) => el.remove());
  }, []);

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:alt" content={IMAGE_ALT} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={imageUrl} />

      {noIndex ? <meta name="robots" content="noindex, nofollow" /> : null}
    </Helmet>
  );
}

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  path: PropTypes.string,
  image: PropTypes.string,
  noIndex: PropTypes.bool,
};

export default SEO;

import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'SaaSHub';
const SITE_URL  = 'https://saashub.in';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

// Comprehensive keyword pool — used as fallback for all pages
const DEFAULT_KEYWORDS = [
  // Core identity
  'SaaSHub', 'SaaS marketplace India', 'white label software India',
  'buy SaaS software', 'sell SaaS software India', 'software marketplace India',

  // Buyer intent
  'buy white label software India', 'buy SaaS software online India',
  'best SaaS software India', 'affordable SaaS India', 'SaaS tools for business India',
  'white label software for resellers India', 'software with reseller rights India',
  'white label software with source code', 'cloud software India',

  // Seller intent
  'list SaaS software online', 'sell white label software online',
  'SaaS vendor India', 'software vendor marketplace India',
  'free SaaS listing India', 'B2B software leads India',

  // Market / B2B
  'B2B SaaS marketplace India', 'B2B software marketplace India',
  'verified SaaS vendors India', 'trusted software vendors India',
  'Indian SaaS companies', 'Indian SaaS products',
  'SaaS reseller India', 'software reseller marketplace India',
  'enterprise software India', 'business software India',

  // White-label categories
  'white label CRM India', 'white label ERP India', 'white label HR software India',
  'white label restaurant software India', 'white label gym software India',
  'white label booking software India', 'white label AI software India',
  'white label WhatsApp marketing India', 'white label SaaS platform',

  // SaaS categories India
  'CRM software India', 'ERP software India', 'HR software India',
  'restaurant management software India', 'gym management software India',
  'booking software India', 'AI sales software India',
  'WhatsApp marketing software India', 'analytics software India',
  'payroll software India', 'accounting software India',

  // Long-tail high-intent
  'SaaS marketplace for Indian startups', 'SaaS products for small business India',
  'best white label software marketplace India', 'top Indian SaaS marketplace',
  'SaaS software comparison India', 'white label software solutions India',
  'SaaS subscription India', 'white label app India',
].join(', ');

const DEFAULT_DESC = "India's #1 marketplace to buy and sell SaaS software and white-label solutions. Discover 500+ verified products — CRM, ERP, HR, AI, restaurant, gym, booking software and more. Free to list. Zero commission.";

export default function SEO({
  title,
  description = DEFAULT_DESC,
  keywords,
  image = DEFAULT_IMAGE,
  url,
  type = 'website',
  article,
  jsonLd,
  noindex = false,
  canonical,
  breadcrumb,
}) {
  const fullTitle    = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Buy & Sell SaaS & White-Label Software in India`;
  const pageUrl      = url ? `${SITE_URL}${url}` : (typeof window !== 'undefined' ? window.location.href : SITE_URL);
  const canonicalUrl = canonical ? `${SITE_URL}${canonical}` : pageUrl;
  // Merge page-specific keywords in front of the global pool
  const allKeywords  = keywords ? `${keywords}, ${DEFAULT_KEYWORDS}` : DEFAULT_KEYWORDS;

  // Build JSON-LD array — always include BreadcrumbList when breadcrumb prop passed
  const schemas = [];
  if (jsonLd) schemas.push(jsonLd);
  if (breadcrumb) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumb.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: item.name,
        item: item.url ? `${SITE_URL}${item.url}` : undefined,
      })),
    });
  }

  return (
    <Helmet>
      {/* ── Core ── */}
      <title>{fullTitle}</title>
      <meta name="description"          content={description} />
      <meta name="keywords"             content={allKeywords} />
      <meta name="author"               content={SITE_NAME} />
      <link rel="canonical"             href={canonicalUrl} />
      {noindex
        ? <meta name="robots"           content="noindex, nofollow" />
        : <meta name="robots"           content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      }
      <meta name="googlebot"            content="index, follow, max-snippet:-1, max-image-preview:large" />

      {/* ── Geo (India-first) ── */}
      <meta name="geo.region"           content="IN" />
      <meta name="geo.placename"        content="India" />
      <meta name="geo.position"         content="20.5937;78.9629" />
      <meta name="ICBM"                 content="20.5937, 78.9629" />
      <meta name="language"             content="en-IN" />
      <meta name="content-language"     content="en-IN" />

      {/* ── Open Graph ── */}
      <meta property="og:site_name"     content={SITE_NAME} />
      <meta property="og:title"         content={fullTitle} />
      <meta property="og:description"   content={description} />
      <meta property="og:image"         content={image} />
      <meta property="og:image:width"   content="1200" />
      <meta property="og:image:height"  content="630" />
      <meta property="og:image:alt"     content={fullTitle} />
      <meta property="og:url"           content={pageUrl} />
      <meta property="og:type"          content={type} />
      <meta property="og:locale"        content="en_IN" />
      <meta property="og:locale:alternate" content="en_US" />

      {/* ── Article extras (blog posts) ── */}
      {article && <>
        <meta property="article:published_time" content={article.publishedAt} />
        <meta property="article:modified_time"  content={article.modifiedAt} />
        <meta property="article:author"         content={article.author} />
        <meta property="article:section"        content={article.section || 'Technology'} />
        {(article.tags || []).map(t => <meta key={t} property="article:tag" content={t} />)}
      </>}

      {/* ── Twitter / X ── */}
      <meta name="twitter:card"         content="summary_large_image" />
      <meta name="twitter:site"         content="@saashubindia" />
      <meta name="twitter:creator"      content="@saashubindia" />
      <meta name="twitter:title"        content={fullTitle} />
      <meta name="twitter:description"  content={description} />
      <meta name="twitter:image"        content={image} />
      <meta name="twitter:image:alt"    content={fullTitle} />

      {/* ── JSON-LD (all schemas) ── */}
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(s)}
        </script>
      ))}
    </Helmet>
  );
}

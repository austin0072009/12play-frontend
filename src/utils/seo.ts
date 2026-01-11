/**
 * SEO Utility Functions
 * Manages page metadata, structured data, and SEO optimization
 */

interface SEOMetadata {
  title: string;
  description: string;
  keywords: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonical?: string;
  robots?: string;
  alternates?: {
    hreflang: string;
    href: string;
  }[];
}

/**
 * Update page title and meta tags dynamically
 */
export function setSEOMetadata(metadata: SEOMetadata) {
  // Update title
  document.title = metadata.title;

  // Update or create description meta tag
  let descMeta = document.querySelector('meta[name="description"]');
  if (!descMeta) {
    descMeta = document.createElement('meta');
    descMeta.setAttribute('name', 'description');
    document.head.appendChild(descMeta);
  }
  descMeta.setAttribute('content', metadata.description);

  // Update or create keywords meta tag
  let keywordsMeta = document.querySelector('meta[name="keywords"]');
  if (!keywordsMeta) {
    keywordsMeta = document.createElement('meta');
    keywordsMeta.setAttribute('name', 'keywords');
    document.head.appendChild(keywordsMeta);
  }
  keywordsMeta.setAttribute('content', metadata.keywords);

  // Update robots meta tag
  if (metadata.robots) {
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.setAttribute('name', 'robots');
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.setAttribute('content', metadata.robots);
  }

  // Update OG tags
  if (metadata.ogTitle) {
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', metadata.ogTitle);
  }

  if (metadata.ogDescription) {
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute('content', metadata.ogDescription);
  }

  if (metadata.ogImage) {
    let ogImage = document.querySelector('meta[property="og:image"]');
    if (!ogImage) {
      ogImage = document.createElement('meta');
      ogImage.setAttribute('property', 'og:image');
      document.head.appendChild(ogImage);
    }
    ogImage.setAttribute('content', metadata.ogImage);
  }

  // Update canonical link
  if (metadata.canonical) {
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', metadata.canonical);
  }
}

/**
 * Add structured data (JSON-LD) to the page
 */
export function setStructuredData(data: any, id?: string) {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  if (id) {
    script.id = id;
  }
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
  return script;
}

/**
 * Remove structured data by ID
 */
export function removeStructuredData(id: string) {
  const script = document.getElementById(id);
  if (script) {
    script.remove();
  }
}

/**
 * Pre-defined SEO metadata for different pages
 */
export const pageMetadata = {
  home: {
    title: 'REDCOW - 2D3D လော်ထရီ | ထိုင်းကုန်း 2D3D ဂိမ်းကစား | အားကစား လောင်း',
    description: 'REDCOW - 2D3D မြန်မာ လော်ထရီ၊ ထိုင်းကုန်း 2D3D၊ အားကစားလောင်း၊ အရည်အသွေးကြီးဂိမ်းများ။ ၂၄/၇ ကြေးမုံး ထောက်ခံမှု။',
    keywords: 'REDCOW, 2D3D လော်ထရီ, ထိုင်းကုန်း 2D3D, 2D3D lottery, အားကစား, မြန်မာ ဂိမ်းကစား, online gaming',
    ogTitle: 'REDCOW - 2D3D လော်ထရီ ဂိမ်းကစားခွင့်',
    ogDescription: 'REDCOW နှင့်အတူ 2D3D လော်ထရီ၊ ထိုင်းကုန်း 2D3D၊ အားကစားလောင်းများကစားကြည့်။',
  },
  lottery2d: {
    title: 'REDCOW 2D လော်ထရီ | မြန်မာ 2D ဂိမ်းကစား | 2D3D Lottery',
    description: '2D လော်ထရီကစားခွင့် REDCOW တွင်။ 2D3D lottery ကစားကြည့်ပါ။ ပုံမှန် အဆိုင်း၊ အလွယ်ကူသောသုံးစွဲမှု။',
    keywords: '2D လော်ထရီ, 2D3D lottery, Myanmar 2D, ကစားခွင့်, REDCOW 2D',
    ogTitle: 'REDCOW 2D လော်ထရီ',
    ogDescription: 'REDCOW တွင် 2D လော်ထရီကစားခွင့်။ 2D3D လော်ထရီ မြန်မာ။',
  },
  lottery3d: {
    title: 'REDCOW 3D လော်ထရီ | မြန်မာ 3D ဂိမ်းကစား | 3D3D Lottery',
    description: '3D လော်ထရီကစားခွင့် REDCOW တွင်။ 2D3D lottery 3D ဗားရှင်းကစားကြည့်ပါ။ အလွယ်ကူစွာကစား။',
    keywords: '3D လော်ထရီ, 2D3D lottery, Myanmar 3D, ကစားခွင့်, REDCOW 3D',
    ogTitle: 'REDCOW 3D လော်ထရီ',
    ogDescription: 'REDCOW တွင် 3D လော်ထရီကစားခွင့်။ 2D3D 3D လော်ထရီ မြန်မာ။',
  },
  sports: {
    title: 'REDCOW အားကစား လောင်း | Thailand Sport Betting | ဆိုင်ကလုံ အားကစား',
    description: 'REDCOW တွင် အားကစားလောင်းများကစားခွင့်။ အားကစား လောင်း၊ ဆိုင်ကလုံ အားကစား။ ရှုံးခြင်းမှ ကာကွယ်ခြင်း။',
    keywords: 'အားကစား လောင်း, sport betting, Thailand sports, REDCOW sports, ကစားခွင့်',
    ogTitle: 'REDCOW အားကစား လောင်း',
    ogDescription: 'REDCOW အားကစား လောင်းကစားခွင့်။ ထိုင်းကုန်း အားကစား လောင်း။',
  },
  login: {
    title: 'REDCOW မှ လက်ခြင်းဝင်ရန် | 2D3D လောင်းကစားခွင့်',
    description: 'REDCOW မြန်မာ ဂိမ်းကစား ရင်းခွင်းစီတင်ရန်။ 2D3D လော်ထရီ၊ အားကစား လောင်း ကစားခွင့်။',
    keywords: 'မှ လက်ခြင်းဝင်ရန်, REDCOW login, 2D3D login, ရင်းခွင်း',
    ogTitle: 'REDCOW မှ လက်ခြင်းဝင်ရန်',
  },
  register: {
    title: 'REDCOW မှ စာရင်းသွင်းရန် | 2D3D လောင်းကစားခွင့် အကောင့်',
    description: 'REDCOW နယ်မြေတွင် အကောင့်ပွင့်ပါ။ 2D3D လော်ထရီ၊ အားကစားလောင်း ကစားခွင့်။',
    keywords: 'စာရင်းသွင်း, register REDCOW, အကောင့်ပွင့်ခြင်း, 2D3D အကောင့်',
    ogTitle: 'REDCOW မှ အကောင့်စာရင်းသွင်းရန်',
  },
  promotion: {
    title: 'REDCOW အလှူငွေ | 2D3D လောင်း ကစားခွင့် အလှူငွေ',
    description: 'REDCOW ရှိ အလှူငွေများကိုကြည့်ပါ။ 2D3D လော်ထရီ၊ အားကစားလောင်း အလှူငွေများ။',
    keywords: 'အလှူငွေ, promotion, REDCOW offers, ကစားခွင့် အလှူငွေ',
    ogTitle: 'REDCOW အလှူငွေများ',
  },
};

/**
 * Create rich snippet for lottery game
 */
export function createLotteryStructuredData(gameType: string) {
  const baseData = {
    '@context': 'https://schema.org',
    '@type': 'Game',
    name: `REDCOW ${gameType} လော်ထရီ`,
    description: `${gameType} လော်ထရီကစားခွင့် REDCOW တွင်။ 2D3D lottery ကစားကြည့်ပါ။`,
    url: `https://redcow.com/${gameType.toLowerCase()}`,
    applicationCategory: 'GameApplication',
    offers: {
      '@type': 'Offer',
      priceCurrency: 'MMK',
      price: '0',
      availability: 'https://schema.org/InStock',
    },
  };
  return baseData;
}

/**
 * Create rich snippet for sports betting
 */
export function createSportsBettingStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'REDCOW အားကစား လောင်း',
    description: 'အားကစားလောင်း၊ ဆိုင်ကလုံ အားကစား ကစားခွင့် REDCOW တွင်။',
    url: 'https://redcow.com/sports',
    provider: {
      '@type': 'Organization',
      name: 'REDCOW',
    },
    areaServed: {
      '@type': 'Country',
      name: 'Myanmar',
    },
  };
}

/**
 * Generate breadcrumb structured data
 */
export function createBreadcrumbStructuredData(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

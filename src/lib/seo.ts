import type { CollectionEntry } from 'astro:content';

type SchemaObject = Record<string, unknown>;

const SCHEMA_CONTEXT = 'https://schema.org';
const PERSON_NAME = 'JP Davalos';
const WEBSITE_TITLE = 'JP Davalos | Software Engineer';

const toProjectIsoDate = (value: string) =>
  value.length === 7 ? `${value}-01` : value;

const toExperienceIsoDate = (value: string) => `${value}-01`;

export const absoluteUrl = (path: string, site: URL) =>
  new URL(path, site).toString();

export const createBreadcrumbSchema = (
  site: URL,
  items: Array<{ name: string; path: string }>,
): SchemaObject => ({
  '@context': SCHEMA_CONTEXT,
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.path, site),
  })),
});

export const createProjectsCollectionSchema = (
  site: URL,
  projects: CollectionEntry<'projects'>[],
): SchemaObject => ({
  '@context': SCHEMA_CONTEXT,
  '@type': 'CollectionPage',
  name: 'Projects',
  description:
    'Software projects built by JP Davalos with links to live demos and source code.',
  url: absoluteUrl('/projects', site),
  isPartOf: {
    '@type': 'WebSite',
    name: WEBSITE_TITLE,
    url: absoluteUrl('/', site),
  },
  mainEntity: {
    '@type': 'ItemList',
    itemListOrder: 'https://schema.org/ItemListOrderDescending',
    itemListElement: projects.map((project, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: absoluteUrl(`/projects/${project.slug}`, site),
      item: {
        '@type': 'SoftwareSourceCode',
        name: project.data.title,
        description: project.data.summary,
        datePublished: toProjectIsoDate(project.data.date),
      },
    })),
  },
});

export const createProjectSchema = (
  site: URL,
  project: CollectionEntry<'projects'>,
): SchemaObject => {
  const liveUrl = project.data.links.find((link) =>
    link.label.toLowerCase().includes('live'),
  )?.url;
  const repositoryUrl = project.data.links.find((link) =>
    link.label.toLowerCase().includes('github'),
  )?.url;

  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'SoftwareSourceCode',
    name: project.data.title,
    description: project.data.summary,
    url: absoluteUrl(`/projects/${project.slug}`, site),
    datePublished: toProjectIsoDate(project.data.date),
    programmingLanguage: project.data.stack,
    author: {
      '@type': 'Person',
      name: PERSON_NAME,
    },
    image: absoluteUrl(project.data.poster, site),
    ...(liveUrl ? { sameAs: [liveUrl] } : {}),
    ...(repositoryUrl ? { codeRepository: repositoryUrl } : {}),
  };
};

export const createExperienceCollectionSchema = (
  site: URL,
  path: string,
  name: string,
  description: string,
  experience: CollectionEntry<'experience'>[],
): SchemaObject => ({
  '@context': SCHEMA_CONTEXT,
  '@type': 'CollectionPage',
  name,
  description,
  url: absoluteUrl(path, site),
  isPartOf: {
    '@type': 'WebSite',
    name: WEBSITE_TITLE,
    url: absoluteUrl('/', site),
  },
  mainEntity: {
    '@type': 'ItemList',
    itemListOrder: 'https://schema.org/ItemListOrderDescending',
    itemListElement: experience.map((entry, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: absoluteUrl(`/experience/${entry.slug}`, site),
      item: {
        '@type': 'Role',
        roleName: entry.data.role,
        startDate: toExperienceIsoDate(entry.data.start),
      },
    })),
  },
});

export const createExperienceSchema = (
  site: URL,
  experience: CollectionEntry<'experience'>,
): SchemaObject => {
  const description = experience.data.highlights[0] ??
    `${experience.data.role} at ${experience.data.org}.`;

  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'Role',
    roleName: experience.data.role,
    description,
    startDate: toExperienceIsoDate(experience.data.start),
    ...(experience.data.end
      ? { endDate: toExperienceIsoDate(experience.data.end) }
      : {}),
    mainEntityOfPage: absoluteUrl(`/experience/${experience.slug}`, site),
    worksFor: {
      '@type': 'Organization',
      name: experience.data.org,
    },
    actor: {
      '@type': 'Person',
      name: PERSON_NAME,
    },
    skills: experience.data.stack,
  };
};

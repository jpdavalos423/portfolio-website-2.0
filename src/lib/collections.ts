import { type CollectionEntry, defineCollection, z } from 'astro:content';

const projectDatePattern = /^\d{4}-(0[1-9]|1[0-2])(?:-(0[1-9]|[12]\d|3[01]))?$/;
const experienceDatePattern = /^\d{4}-(0[1-9]|1[0-2])$/;

const linkSchema = z.object({
  label: z.string().min(1),
  url: z.string().url(),
});

export const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().min(1),
    date: z
      .string()
      .regex(projectDatePattern, 'Expected YYYY-MM or YYYY-MM-DD date format'),
    featured: z.boolean(),
    summary: z
      .string()
      .min(1)
      .refine(
        (value) => !value.includes('\n'),
        'summary must be a single line',
      ),
    stack: z.array(z.string().min(1)).min(1),
    highlights: z.array(z.string().min(1)).max(3),
    poster: z.string().min(1),
    links: z.array(linkSchema).min(1),
    demoWebm: z.string().min(1).optional(),
    demoMp4: z.string().min(1).optional(),
  }),
});

export const experienceCollection = defineCollection({
  type: 'content',
  schema: z
    .object({
      role: z.string().min(1),
      org: z.string().min(1),
      type: z.enum(['industry', 'research', 'leadership']),
      start: z
        .string()
        .regex(experienceDatePattern, 'Expected YYYY-MM date format'),
      end: z
        .string()
        .regex(experienceDatePattern, 'Expected YYYY-MM date format')
        .optional(),
      present: z.boolean().optional(),
      featured: z.boolean(),
      stack: z.array(z.string().min(1)).min(1),
      highlights: z.array(z.string().min(1)).min(1),
      links: z.array(linkSchema).optional(),
    })
    .superRefine((value, ctx) => {
      const hasEnd = typeof value.end === 'string';
      const isPresent = value.present === true;

      if (hasEnd === isPresent) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Provide exactly one of "end" or present=true',
          path: ['end'],
        });
      }
    }),
});

export const collections = {
  projects: projectsCollection,
  experience: experienceCollection,
};

const normalizeDate = (value: string) =>
  value.length === 7 ? `${value}-01` : value;

export const compareProjectDateDesc = (
  a: CollectionEntry<'projects'>,
  b: CollectionEntry<'projects'>,
) => normalizeDate(b.data.date).localeCompare(normalizeDate(a.data.date));

export const compareExperienceStartDesc = (
  a: CollectionEntry<'experience'>,
  b: CollectionEntry<'experience'>,
) => b.data.start.localeCompare(a.data.start);

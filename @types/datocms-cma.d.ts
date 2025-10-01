import { ItemTypeDefinition } from '@datocms/cma-client';
type EnvironmentSettings = {
  locales: 'sv';
};
export type Program = ItemTypeDefinition<
  EnvironmentSettings,
  '965002',
  {
    program_category: {
      type: 'link';
    };
    title: {
      type: 'string';
    };
    organizer: {
      type: 'string';
    };
    intro: {
      type: 'text';
    };
    location: {
      type: 'links';
    };
    partner: {
      type: 'links';
    };
    image: {
      type: 'file';
    };
    start_time: {
      type: 'date_time';
    };
    group_show: {
      type: 'boolean';
    };
    content: {
      type: 'structured_text';
      blocks: Image | ImageGallery | Video | LinkButton;
    };
    start_date: {
      type: 'date';
    };
    end_date: {
      type: 'date';
    };
    slug: {
      type: 'slug';
    };
    permanent: {
      type: 'boolean';
    };
    time: {
      type: 'string';
    };
    misc: {
      type: 'string';
    };
    external_link: {
      type: 'string';
    };
  }
>;
export type Image = ItemTypeDefinition<
  EnvironmentSettings,
  '965017',
  {
    image: {
      type: 'file';
    };
    layout: {
      type: 'string';
    };
  }
>;
export type ImageGallery = ItemTypeDefinition<
  EnvironmentSettings,
  '970203',
  {
    images: {
      type: 'gallery';
    };
  }
>;
export type Video = ItemTypeDefinition<
  EnvironmentSettings,
  '970204',
  {
    video: {
      type: 'video';
    };
    title: {
      type: 'string';
    };
  }
>;
export type LinkButton = ItemTypeDefinition<
  EnvironmentSettings,
  '970206',
  {
    link: {
      type: 'link';
    };
  }
>;
export type ProgramCategory = ItemTypeDefinition<
  EnvironmentSettings,
  '981172',
  {
    title: {
      type: 'string';
    };
    plural: {
      type: 'string';
    };
    slug: {
      type: 'slug';
    };
    position: {
      type: 'integer';
    };
  }
>;
export type Location = ItemTypeDefinition<
  EnvironmentSettings,
  '981672',
  {
    title: {
      type: 'string';
    };
    address: {
      type: 'string';
    };
    city: {
      type: 'string';
    };
    webpage: {
      type: 'string';
    };
    map: {
      type: 'string';
    };
    slug: {
      type: 'slug';
    };
  }
>;
export type General = ItemTypeDefinition<
  EnvironmentSettings,
  '982406',
  {
    facebook: {
      type: 'string';
    };
    instagram: {
      type: 'string';
    };
    about: {
      type: 'string';
    };
    email: {
      type: 'string';
    };
  }
>;
export type StartProgram = ItemTypeDefinition<
  EnvironmentSettings,
  '1010523',
  {
    amount: {
      type: 'string';
    };
  }
>;
export type StartText = ItemTypeDefinition<
  EnvironmentSettings,
  '1010599',
  {
    headline: {
      type: 'string';
    };
    text: {
      type: 'text';
    };
    link: {
      type: 'link';
    };
  }
>;
export type StartNews = ItemTypeDefinition<
  EnvironmentSettings,
  '1010902',
  {
    amount: {
      type: 'string';
    };
  }
>;
export type StartRandomParticipant = ItemTypeDefinition<
  EnvironmentSettings,
  '1027193',
  {
    amount: {
      type: 'string';
    };
  }
>;
export type StartGallery = ItemTypeDefinition<
  EnvironmentSettings,
  '1029103',
  {
    headline: {
      type: 'string';
    };
    images: {
      type: 'gallery';
    };
    link: {
      type: 'link';
    };
  }
>;
export type StartFullscreenImage = ItemTypeDefinition<
  EnvironmentSettings,
  '1029104',
  {
    image: {
      type: 'file';
    };
    headline: {
      type: 'string';
    };
    text: {
      type: 'string';
    };
    link: {
      type: 'link';
    };
  }
>;
export type InternalLink = ItemTypeDefinition<
  EnvironmentSettings,
  '1226111',
  {
    title: {
      type: 'string';
    };
    record: {
      type: 'link';
    };
  }
>;
export type ExternalLink = ItemTypeDefinition<
  EnvironmentSettings,
  '1226273',
  {
    title: {
      type: 'string';
    };
    url: {
      type: 'string';
    };
  }
>;
export type StartFullBleedImage = ItemTypeDefinition<
  EnvironmentSettings,
  '1228491',
  {
    image: {
      type: 'file';
    };
    headline: {
      type: 'string';
    };
    text: {
      type: 'text';
    };
    link: {
      type: 'link';
    };
  }
>;
export type Partner = ItemTypeDefinition<
  EnvironmentSettings,
  '1239293',
  {
    address: {
      type: 'string';
    };
    city: {
      type: 'string';
    };
    title: {
      type: 'string';
    };
    intro: {
      type: 'text';
    };
    webpage: {
      type: 'string';
    };
    image: {
      type: 'file';
    };
    content: {
      type: 'structured_text';
      blocks: Image | ImageGallery | Video | LinkButton;
    };
    year: {
      type: 'link';
    };
    slug: {
      type: 'slug';
    };
  }
>;
export type StartFullscreenVideo = ItemTypeDefinition<
  EnvironmentSettings,
  '1241351',
  {
    video: {
      type: 'file';
    };
    headline: {
      type: 'string';
    };
    text: {
      type: 'text';
    };
    link: {
      type: 'link';
    };
  }
>;
export type StartVideo = ItemTypeDefinition<
  EnvironmentSettings,
  '1291156',
  {
    video: {
      type: 'video';
    };
    title: {
      type: 'string';
    };
  }
>;
export type Funder = ItemTypeDefinition<
  EnvironmentSettings,
  '1355625',
  {
    logo: {
      type: 'file';
    };
    url: {
      type: 'string';
    };
  }
>;
export type StartSelectedLocation = ItemTypeDefinition<
  EnvironmentSettings,
  '1671578',
  {
    locations: {
      type: 'links';
    };
  }
>;
export type StartExhibition = ItemTypeDefinition<
  EnvironmentSettings,
  '1779067',
  {
    amount: {
      type: 'string';
    };
  }
>;
export type InEnglish = ItemTypeDefinition<
  EnvironmentSettings,
  '1858815',
  {
    title: {
      type: 'string';
    };
    intro: {
      type: 'text';
    };
    image: {
      type: 'file';
    };
    content: {
      type: 'structured_text';
      blocks: Image | ImageGallery | Video | LinkButton;
    };
  }
>;
export type AnyBlock =
  | Image
  | ImageGallery
  | Video
  | LinkButton
  | StartProgram
  | StartText
  | StartNews
  | StartRandomParticipant
  | StartGallery
  | StartFullscreenImage
  | StartFullBleedImage
  | StartFullscreenVideo
  | StartVideo
  | Funder
  | StartSelectedLocation
  | StartExhibition;
export type AnyModel =
  | Program
  | ProgramCategory
  | Location
  | General
  | InternalLink
  | ExternalLink
  | Partner
  | InEnglish;
export type AnyBlockOrModel = AnyBlock | AnyModel;

export interface ProjectImage {
  id: string;
  url: string;
  caption: string;
  alt: string;
  sortOrder: number;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  coverImage: string | null;
  technologies: string[];
  category: string;
  year: number | null;
  role: string;
  githubUrl: string | null;
  liveUrl: string | null;
  featured: boolean;
  published: boolean;
  displayOrder: number;
  challenge: string | null;
  solution: string | null;
  results: string | null;
  images: ProjectImage[];
}

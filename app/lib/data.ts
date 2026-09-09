import contactData from "@/content/contact.json";
import projectsData from "@/content/projects.json";

export type Project = { slug: string; title: string; category: string; year: string; summary: string; cover: string; galleryDirectory: string; galleryCount: number; featured: boolean; gallery: string[] };
export const contact = contactData;
export const projects = projectsData as Project[];
export const featuredProjects = projects.filter((project) => project.featured);
export const getProject = (slug: string) => projects.find((project) => project.slug === slug);

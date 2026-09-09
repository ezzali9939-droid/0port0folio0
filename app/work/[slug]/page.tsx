import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectCta } from "@/app/components/project-cta";
import { getProject, projects } from "@/app/lib/data";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return projects.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> { const project = getProject((await params).slug); if (!project) return {}; return { title: project.title, description: project.summary, openGraph: { title: project.title, description: project.summary, images: [project.cover] }, twitter: { card: "summary_large_image", images: [project.cover] } }; }

export default async function ProjectPage({ params }: Props) {
  const project = getProject((await params).slug); if (!project) notFound();
  return <main id="main-content"><section className="project-detail-hero shell"><Link href="/work">← All work</Link><p className="eyebrow">{project.category} / {project.year}</p><h1>{project.title}</h1><p>{project.summary}</p><div className="project-detail-cover"><Image src={project.cover} alt={`${project.title} cover`} fill priority sizes="100vw" /></div></section><section className="project-gallery shell" aria-label={`${project.title} gallery`}>{project.gallery.map((image, index) => <figure key={image}><Image src={image} alt={`${project.title} project image ${index + 1}`} width={1600} height={1200} sizes="(max-width: 760px) 100vw, 50vw" /></figure>)}</section><ProjectCta /></main>;
}

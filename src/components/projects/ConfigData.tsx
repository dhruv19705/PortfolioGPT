import Image from 'next/image';
import { ArrowUpRight, Github } from 'lucide-react';
import { projectData, getConfig } from '@/lib/config-loader';

// Get project content from configuration
const config = getConfig();
const PROJECT_CONTENT = config.projects;

// ProjectContent component - now uses config data
const ProjectContent = ({ project }: { project: { title: string } }) => {
  const projectData = PROJECT_CONTENT.find(p => p.title === project.title);
  
  if (!projectData) return null;

  return (
    <div className="bg-card text-card-foreground max-w-4xl space-y-6 p-0">
      {/* Overview (title is already shown in the modal header) */}
      <div className="space-y-3">
        <p className="text-muted-foreground text-sm">{projectData.date}</p>
        <p className="text-muted-foreground leading-relaxed break-words whitespace-pre-wrap">
          {projectData.description}
        </p>
      </div>

      {/* Status & Achievements */}
      {(projectData.status || projectData.achievements || projectData.metrics) && (
        <div className="space-y-3">
          {projectData.status && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Status:</span>
              <span className={`text-sm px-2 py-1 rounded-full ${
                projectData.status === 'Completed' ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400' :
                projectData.status === 'Ongoing' ? 'bg-blue-500/15 text-blue-700 dark:text-blue-400' :
                'bg-muted text-muted-foreground'
              }`}>
                {projectData.status}
              </span>
            </div>
          )}
          
          {projectData.achievements && (
            <div>
              <h4 className="font-medium mb-1">Achievements</h4>
              <ul className="text-sm text-muted-foreground list-disc list-inside">
                {projectData.achievements.map((achievement, index) => (
                  <li key={index}>{achievement}</li>
                ))}
              </ul>
            </div>
          )}
          
          {projectData.metrics && (
            <div>
              <h4 className="font-medium mb-1">Key Metrics</h4>
              <div className="flex flex-wrap gap-2">
                {projectData.metrics.map((metric, index) => (
                  <span key={index} className="text-sm bg-blue-500/15 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-md font-medium">
                    {metric}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tech Stack */}
      {projectData.techStack && projectData.techStack.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium">Tech Stack</h4>
          <div className="flex flex-wrap gap-2">
            {projectData.techStack.map((tech, index) => (
              <span
                key={index}
                className="bg-accent text-accent-foreground rounded-full px-3 py-1 text-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Links */}
      {projectData.links && projectData.links.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium">Links</h4>
          <div className="flex flex-wrap gap-3">
            {projectData.links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-foreground text-background inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90"
              >
                {link.name === 'GitHub' ? <Github className="h-4 w-4" /> : null}
                {link.name === 'GitHub' ? 'View on GitHub' : link.name}
                <ArrowUpRight className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Images gallery */}
      {projectData.images && projectData.images.length > 0 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {projectData.images.map((image, index) => (
              <div
                key={index}
                className="relative overflow-hidden rounded-2xl"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={800}
                  height={600}
                  className="w-full h-auto transition-transform"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Main data export - now dynamically generated from config
export const data = projectData.map(project => {
  // Use first image if available, otherwise use a placeholder
  const imageSrc = project.images && project.images.length > 0 
    ? project.images[0].src 
    : '/placeholder.jpg';
  
  return {
    category: project.category,
    title: project.title,
    src: imageSrc,
    content: <ProjectContent project={{ title: project.title }} />,
  };
});

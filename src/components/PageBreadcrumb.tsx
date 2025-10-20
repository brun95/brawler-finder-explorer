'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";

interface BreadcrumbSegment {
  label: string;
  href?: string;
}

interface PageBreadcrumbProps {
  customSegments?: BreadcrumbSegment[];
  currentPageLabel?: string;
}

export const PageBreadcrumb = ({ customSegments, currentPageLabel }: PageBreadcrumbProps) => {
  const pathname = usePathname();

  // If custom segments are provided, use them
  if (customSegments) {
    return (
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/" className="flex items-center gap-1">
                <Home className="h-4 w-4" />
                <span className="sr-only">Home</span>
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          {customSegments.map((segment, index) => (
            <div key={index} className="flex items-center gap-1.5">
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {index === customSegments.length - 1 && !currentPageLabel ? (
                  <BreadcrumbPage>{segment.label}</BreadcrumbPage>
                ) : segment.href ? (
                  <BreadcrumbLink asChild>
                    <Link href={segment.href}>{segment.label}</Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{segment.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </div>
          ))}

          {currentPageLabel && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{currentPageLabel}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  // Auto-generate breadcrumbs from pathname
  const segments = pathname?.split('/').filter(Boolean) || [];

  if (segments.length === 0) {
    return null;
  }

  const getBreadcrumbLabel = (segment: string, index: number): string => {
    // Capitalize first letter and handle special cases
    const formatted = segment.charAt(0).toUpperCase() + segment.slice(1);

    // Handle specific routes
    if (segment === 'player' || segment === 'club') {
      return formatted + 's';
    }

    if (segment.startsWith('#') || /^[A-Z0-9]+$/.test(segment)) {
      return segment;
    }

    return formatted;
  };

  const getBreadcrumbHref = (index: number): string => {
    return '/' + segments.slice(0, index + 1).join('/');
  };

  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/" className="flex items-center gap-1">
              <Home className="h-4 w-4" />
              <span className="sr-only">Home</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1;
          const label = currentPageLabel && isLast ? currentPageLabel : getBreadcrumbLabel(segment, index);
          const href = getBreadcrumbHref(index);

          return (
            <div key={index} className="flex items-center gap-1.5">
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href}>{label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

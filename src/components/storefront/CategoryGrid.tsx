import Link from 'next/link';
import Image from 'next/image';
import type { Category } from '@/types/database';

interface CategoryCircleProps {
  category: Category;
}

export function CategoryCircle({ category }: CategoryCircleProps) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className="flex flex-col items-center group w-full"
    >
      {/* Circular Image Container with Luxury Dual Halo */}
      <div className="w-22 h-22 xs:w-26 xs:h-26 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 xl:w-46 xl:h-46 rounded-full p-1 sm:p-1.5 md:p-2 border border-[#D8C7B5]/80 bg-gradient-to-b from-[#FAF5EE] via-[#F4EDE2] to-[#EAE0D2] shadow-sm group-hover:border-tan group-hover:shadow-xl transition-all duration-500 group-hover:scale-105">
        <div className="w-full h-full rounded-full overflow-hidden relative bg-[#EFE8DC] flex items-center justify-center">
          {category.image_url ? (
            <Image
              src={category.image_url}
              alt={category.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              sizes="(max-width: 640px) 110px, (max-width: 1024px) 150px, 190px"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#FAF5EE] to-[#EAE0D2] text-[#8C6D53]">
              <span className="font-heading text-xl sm:text-2xl md:text-3xl font-semibold text-[#8C6D53]/70">
                {category.name[0]}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Category Name */}
      <h3 className="font-heading text-xs sm:text-sm md:text-[15px] lg:text-base font-bold tracking-[0.02em] text-stone-900 group-hover:text-tan transition-colors text-center mt-2.5 sm:mt-3.5 leading-snug">
        {category.name}
      </h3>

      {/* Tagline */}
      {category.tagline && (
        <p className="text-[10px] sm:text-xs md:text-[13px] text-stone-500 italic font-body text-center mt-0.5 sm:mt-1 line-clamp-1 max-w-[110px] sm:max-w-[150px] lg:max-w-[170px]">
          {category.tagline}
        </p>
      )}
    </Link>
  );
}

interface CategoryGridProps {
  categories: Category[];
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-[#FAF7F2] border-b border-[#EAE3D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Decorative Lines and Botanical Motif */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-14">
          <div className="flex items-center justify-center gap-3 sm:gap-4">
            <span className="w-8 sm:w-16 h-px bg-[#D4C3B3]" />
            <h2 className="font-heading text-base sm:text-xl lg:text-2xl tracking-[0.2em] uppercase text-stone-900 font-medium">
              Shop by Category
            </h2>
            <span className="w-8 sm:w-16 h-px bg-[#D4C3B3]" />
          </div>

          {/* Botanical Floral Ornament */}
          <div className="flex items-center justify-center mt-2">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-tan"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 2C12 2 10 7 10 10C10 11.5 10.8 12.8 12 13.5C13.2 12.8 14 11.5 14 10C14 7 12 2 12 2Z" />
              <path
                d="M5.5 14.5C5.5 14.5 9 13.5 10.5 11.5C9.8 10.5 8.5 9.8 7 9.8C4.5 9.8 3.5 13 3.5 14.2C3.5 14.8 4.5 14.5 5.5 14.5Z"
                opacity="0.85"
              />
              <path
                d="M18.5 14.5C18.5 14.5 15 13.5 13.5 11.5C14.2 10.5 15.5 9.8 17 9.8C19.5 9.8 20.5 13 20.5 14.2C20.5 14.8 19.5 14.5 18.5 14.5Z"
                opacity="0.85"
              />
            </svg>
          </div>
        </div>

        {/* Category Circles: 3 Columns on Mobile (2 rows of 3), 6 Columns on Desktop */}
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-x-3 sm:gap-x-5 lg:gap-x-5 xl:gap-x-6 gap-y-7 sm:gap-y-10 items-start justify-items-center">
          {categories.map((category) => (
            <CategoryCircle key={category.id} category={category} />
          ))}
        </div>

        {/* Fallback if empty */}
        {categories.length === 0 && (
          <div className="text-center py-10">
            <p className="text-stone-400 text-sm font-body">
              Categories will appear here once added in the admin panel.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { Chatbot } from "@/shop/components/chatbot/Chatbot";
import { HeroSlider } from "@/shop/components/home/HeroSlider";
import { FeaturedProducts } from "@/shop/components/home/FeaturedProducts";

export const HomePage = () => {
  return (
    <>

        <HeroSlider />

        <div className="mt-12">
          <FeaturedProducts
            title="Bestsellers"
            subtitle="The most beloved tales in the vault"
            filterKey="bestseller"
          />
        </div>

        {/* Browse all CTA */}
        <section className="my-12 flex flex-col items-center gap-4 rounded-2xl border border-border bg-card px-6 py-12 text-center">
          <h2 className="font-serif text-2xl font-bold text-foreground text-balance sm:text-3xl">
            Looking for something specific?
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground text-pretty">
            Search the entire vault and filter by price, format, rating, and more
            to find your next magical adventure.
          </p>
          <Button
            size="lg"
            className="mt-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Link to="/search" className="flex items-center">
              <Search className="mr-2 h-4 w-4" />
              Browse All Books
            </Link>
          </Button>
        </section>

        <FeaturedProducts
          title="New Arrivals"
          subtitle="Freshly stocked on our shelves"
          filterKey="new"
        />

      <Chatbot />
    </>
  );
}

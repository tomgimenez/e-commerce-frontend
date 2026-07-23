import { ArrowRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Link } from "react-router";
import { ProductCard } from "../ProductCard";
import type { Book } from "@/interfaces/book.interface";

type FilterKey = "bestseller" | "new" | "all";

interface FeaturedProductsProps {
  title: string;
  subtitle?: string;
  filterKey?: FilterKey;
}

const filters: Record<FilterKey, (product: (typeof products)[number]) => boolean> = {
  bestseller: (p) => p.attributes.isBestseller === true,
  new: () => true,
  all: () => true,
};

const products: Book[] = [
  {
    id: '1',
    title: "The Fellowship of the Ring",
    price: 18.99,
    images: [
      {
        id: 1,
        url: "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400&h=600&fit=crop",
        key: 'key'
      }
    ],
    categories: [{ id: "c1", name: "Epic Fantasy", slug: "epic-fantasy" }],
    description: "In ancient times the Rings of Power were crafted by the Elven-smiths, and Sauron, the Dark Lord, forged the One Ring, filling it with his own power so that he could rule all others. But the One Ring was taken from him, and though he sought it throughout Middle-earth, it remained lost to him. After many ages it fell by chance into the hands of the hobbit Bilbo Baggins.",
    rating: 5,
    reviews: 2847,
    tags: ["fantasy", "classic", "adventure"],
    slug: "the-fellowship-of-the-ring",
    stock: 32,
    user: {
      id: "u1",
      email: "seller1@example.com",
      name: "Seller",
      lastname: "One",
      isActive: true,
      roles: [{ id: "r1", name: "Admin", description: "Administrator role" }]
    },
    productType: {
      id: "pt1",
      name: "Book",
      slug: "book",
      schema: {
        author: { type: "string", required: true, label: "Author" },
        publisher: { type: "string", required: true, label: "Publisher" },
        pages: { type: "string", required: true, label: "Pages" }
      }
    },
    isActive: true,
    createdAt: new Date("2025-01-01T00:00:00Z"),
    updatedAt: new Date("2025-05-01T00:00:00Z"),
    deletedAt: new Date("1970-01-01T00:00:00Z"),
    attributes: {
      author: "J.R.R. Tolkien",
      publisher: "Houghton Mifflin",
      isBestseller: true,
      pages: '423',
    }
  },
  {
    id: '2',
    title: "Harry Potter and the Sorcerer's Stone",
    price: 14.99,
    images: [
      {
        id: 1,
        url: "https://images.unsplash.com/photo-1626618012641-bfbca5a31239?w=400&h=600&fit=crop",
        key: 'key'
      }
    ],
    categories: [{ id: "c2", name: "Young Adult Fantasy", slug: "young-adult-fantasy" }],
    description: "Harry Potter has never even heard of Hogwarts when the letters start dropping on the doormat at number four, Privet Drive. Addressed in green ink on yellowish parchment with a purple seal, they are swiftly confiscated by his grisly aunt and uncle. Then, on Harry's eleventh birthday, a great beetle-eyed giant of a man called Rubeus Hagrid bursts in with some astonishing news.",
    rating: 5,
    reviews: 5621,
    tags: ["fantasy", "young-adult", "magic"],
    slug: "harry-potter-and-the-sorcerers-stone",
    stock: 45,
    user: {
      id: "u1",
      email: "seller1@example.com",
      name: "Seller",
      lastname: "One",
      isActive: true,
      roles: [{ id: "r1", name: "Admin", description: "Administrator role" }]
    },
    productType: {
      id: "pt1",
      name: "Book",
      slug: "book",
      schema: {
        author: { type: "string", required: true, label: "Author" },
        publisher: { type: "string", required: true, label: "Publisher" },
        pages: { type: "string", required: true, label: "Pages" }
      }
    },
    isActive: true,
    createdAt: new Date("2025-01-02T00:00:00Z"),
    updatedAt: new Date("2025-05-02T00:00:00Z"),
    deletedAt: new Date("1970-01-01T00:00:00Z"),
    attributes: {
      publisher: "Scholastic",
      pages: '309',
      isBestseller: true,
      author: "J.K. Rowling",
      
    }
  },
  {
    id: '3',
    title: "A Game of Thrones",
    price: 22.99,
    images: [
      {
        id: 1,
        url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
        key: 'key'
      }
    ],
    categories: [{ id: "c3", name: "Dark Fantasy", slug: "dark-fantasy" }],
    description: "Long ago, in a time forgotten, a preternatural event threw the seasons out of balance. In a land where summers can last decades and winters a lifetime, trouble is brewing. The cold is returning, and in the frozen wastes to the north of Winterfell, sinister and supernatural forces are massing beyond the kingdom's protective Wall.",
    rating: 4,
    reviews: 3156,
    tags: ["fantasy", "epic", "political"],
    slug: "a-game-of-thrones",
    stock: 28,
    user: {
      id: "u1",
      email: "seller1@example.com",
      name: "Seller",
      lastname: "One",
      isActive: true,
      roles: [{ id: "r1", name: "Admin", description: "Administrator role" }]
    },
    productType: {
      id: "pt1",
      name: "Book",
      slug: "book",
      schema: {
        author: { type: "string", required: true, label: "Author" },
        publisher: { type: "string", required: true, label: "Publisher" },
        pages: { type: "string", required: true, label: "Pages" }
      }
    },
    isActive: true,
    createdAt: new Date("2025-01-03T00:00:00Z"),
    updatedAt: new Date("2025-05-03T00:00:00Z"),
    deletedAt: new Date("1970-01-01T00:00:00Z"),
    attributes: {
      author: "George R.R. Martin",
      pages: '694',
      publisher: "Bantam",
      isBestseller: true
    }
  },
  {
    id: '4',
    title: "The Name of the Wind",
    price: 16.99,
    images: [
      {
        id: 1,
        url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
        key: 'key'
      }
    ],
    categories: [{ id: "c4", name: "Epic Fantasy", slug: "epic-fantasy" }],
    description: "My name is Kvothe. I have stolen princesses back from sleeping barrow kings. I burned down the town of Trebon. I burned down the town of Trebon. I have spent the night with Felurian and left with both my sanity and my life. I was expelled from the University at a younger age than most people are allowed in. I tread paths by moonlight that others fear to speak of during day.",
    rating: 5,
    reviews: 1892,
    tags: ["fantasy", "epic", "adventure"],
    slug: "the-name-of-the-wind",
    stock: 22,
    user: {
      id: "u1",
      email: "seller1@example.com",
      name: "Seller",
      lastname: "One",
      isActive: true,
      roles: [{ id: "r1", name: "Admin", description: "Administrator role" }]
    },
    productType: {
      id: "pt1",
      name: "Book",
      slug: "book",
      schema: {
        author: { type: "string", required: true, label: "Author" },
        publisher: { type: "string", required: true, label: "Publisher" },
        pages: { type: "string", required: true, label: "Pages" }
      }
    },
    isActive: true,
    createdAt: new Date("2025-01-04T00:00:00Z"),
    updatedAt: new Date("2025-05-04T00:00:00Z"),
    deletedAt: new Date("1970-01-01T00:00:00Z"),
    attributes: {
      author: "Patrick Rothfuss",
      pages: '662',
      publisher: "DAW Books",
      isBestseller: true
    }
  },
  {
    id: '5',
    title: "The Way of Kings",
    price: 19.99,
    images: [
      {
        id: 1,
        url: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop",
        key: 'key'
      }
    ],
    categories: [{ id: "c5", name: "High Fantasy", slug: "high-fantasy" }],
    description: "Roshar is a world of stone and storms. Uncanny tempests of incredible power sweep across the rocky terrain so frequently that they have shaped ecology and civilization alike. Animals hide in shells, trees pull in branches, and grass retracts into the soilless ground. Cities are built only where the weights of cataclysmic rock formations provide shelter.",
    rating: 5,
    reviews: 2103,
    tags: ["fantasy", "high-fantasy", "epic"],
    slug: "the-way-of-kings",
    stock: 30,
    user: {
      id: "u1",
      email: "seller1@example.com",
      name: "Seller",
      lastname: "One",
      isActive: true,
      roles: [{ id: "r1", name: "Admin", description: "Administrator role" }]
    },
    productType: {
      id: "pt1",
      name: "Book",
      slug: "book",
      schema: {
        author: { type: "string", required: true, label: "Author" },
        publisher: { type: "string", required: true, label: "Publisher" },
        pages: { type: "string", required: true, label: "Pages" }
      }
    },
    isActive: true,
    createdAt: new Date("2025-01-05T00:00:00Z"),
    updatedAt: new Date("2025-05-05T00:00:00Z"),
    deletedAt: new Date("1970-01-01T00:00:00Z"),
    attributes: {
      author: "Brandon Sanderson",
      pages: '1007',
      publisher: "Tor Books",
      isBestseller: false
    }
  },
  {
    id: '6',
    title: "The Lies of Locke Lamora",
    price: 15.99,
    images: [
      {
        id: 1,
        url: "https://images.unsplash.com/photo-1629992101753-56d196c8aabb?w=400&h=600&fit=crop",
        key: 'key'
      }
    ],
    categories: [{ id: "c6", name: "Sword & Sorcery", slug: "sword-sorcery" }],
    description: "An orphan's life is harsh—and often short—in the mysterious island city of Camorr. But young Locke Lamora dodges death and slavery, becoming a thief under the tutelage of a gifted con artist. As leader of the band of light-fingered brothers known as the Gentleman Bastards, Locke is soon infamous, fooling even the underworld's most feared ruler.",
    rating: 4,
    reviews: 987,
    tags: ["fantasy", "sword-and-sorcery", "crime"],
    slug: "the-lies-of-locke-lamora",
    stock: 18,
    user: {
      id: "u1",
      email: "seller1@example.com",
      name: "Seller",
      lastname: "One",
      isActive: true,
      roles: [{ id: "r1", name: "Admin", description: "Administrator role" }]
    },
    productType: {
      id: "pt1",
      name: "Book",
      slug: "book",
      schema: {
        author: { type: "string", required: true, label: "Author" },
        publisher: { type: "string", required: true, label: "Publisher" },
        pages: { type: "string", required: true, label: "Pages" }
      }
    },
    isActive: true,
    createdAt: new Date("2025-01-06T00:00:00Z"),
    updatedAt: new Date("2025-05-06T00:00:00Z"),
    deletedAt: new Date("1970-01-01T00:00:00Z"),
    attributes: {
      author: "Scott Lynch",
      pages: '499',
      publisher: "Bantam Spectra",
      isBestseller: false
    }
  },
  {
    id: '7',
    title: "Mistborn: The Final Empire",
    price: 17.99,
        images: [
      {
        id: 1,
        url: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400&h=600&fit=crop",
        key: 'key'
      }
    ],
    categories: [{ id: "c7", name: "Epic Fantasy", slug: "epic-fantasy" }],
    description: "For a thousand years the ash fell and no flowers bloomed. For a thousand years the Skaa slaved in misery and lived in fear. For a thousand years the Lord Ruler, the 'Sliver of Infinity,' reigned with absolute power and ultimate terror, divinely invincible. Then, when hope was so long lost that not even its memory remained, a terribly scarred, heart-broken half-Skaa rediscovered it in the depths of the Lord Ruler's most hellish prison.",
    rating: 5,
    reviews: 2456,
    tags: ["fantasy", "epic", "science-fiction"],
    slug: "mistborn-the-final-empire",
    stock: 24,
    user: {
      id: "u1",
      email: "seller1@example.com",
      name: "Seller",
      lastname: "One",
      isActive: true,
      roles: [{ id: "r1", name: "Admin", description: "Administrator role" }]
    },
    productType: {
      id: "pt1",
      name: "Book",
      slug: "book",
      schema: {
        author: { type: "string", required: true, label: "Author" },
        publisher: { type: "string", required: true, label: "Publisher" },
        pages: { type: "string", required: true, label: "Pages" }
      }
    },
    isActive: true,
    createdAt: new Date("2025-01-07T00:00:00Z"),
    updatedAt: new Date("2025-05-07T00:00:00Z"),
    deletedAt: new Date("1970-01-01T00:00:00Z"),
    attributes: {
      author: "Brandon Sanderson",
      isBestseller: true,
      pages: '541',
      publisher: "Tor Books",
    }
  },
  {
    id: '8',
    title: "The Blade Itself",
    price: 14.99,
    images: [
      {
        id: 1,
        url: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=600&fit=crop",
        key: 'key'
      }
    ],
    categories: [{ id: "c8", name: "Dark Fantasy", slug: "dark-fantasy" }],
    description: "Logen Ninefingers, infamous barbarian, has finally run out of luck. Caught in one feud too many, he's on the verge of becoming a dead barbarian – leaving nothing behind him but bad songs, dead friends, and a lot of enemies. Captain Jezal dan Luthar, a self-satisfied nobleman and champion fencer, has nothing more dangerous in mind than fleecing his friends at cards and dreaming of glory in the upcoming Tournament.",
    rating: 4,
    reviews: 1234,
    tags: ["fantasy", "grimdark", "action"],
    slug: "the-blade-itself",
    stock: 20,
    user: {
      id: "u1",
      email: "seller1@example.com",
      name: "Seller",
      lastname: "One",
      isActive: true,
      roles: [{ id: "r1", name: "Admin", description: "Administrator role" }]
    },
    productType: {
      id: "pt1",
      name: "Book",
      slug: "book",
      schema: {
        author: { type: "string", required: true, label: "Author" },
        publisher: { type: "string", required: true, label: "Publisher" },
        pages: { type: "string", required: true, label: "Pages" }
      }
    },
    isActive: true,
    createdAt: new Date("2025-01-08T00:00:00Z"),
    updatedAt: new Date("2025-05-08T00:00:00Z"),
    deletedAt: new Date("1970-01-01T00:00:00Z"),
    attributes: {
      author: "Joe Abercrombie",
      pages: '515',
      publisher: "Pyr",
      isBestseller: false
    }
  },
  {
    id: '9',
    title: "Gardens of the Moon",
    price: 21.99,
    images: [
      {
        id: 1,
        url: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400&h=600&fit=crop",
        key: 'key'
      }
    ],
    categories: [{ id: "c9", name: "Epic Fantasy", slug: "epic-fantasy" }],
    description: "The Malazan Empire simmers with discontent, bled dry by interminable warfare, bitter infighting and bloody confrontations. Even the imperial legions, long inured to the bloodshed, yearn for some respite. Yet Empress Laseen's rule remains absolute, enforced by her dread combatants: the Claw, and Tayschrenn, deadliest combatant of them all.",
    rating: 4,
    reviews: 876,
    tags: ["fantasy", "epic", "war"],
    slug: "gardens-of-the-moon",
    stock: 14,
    user: {
      id: "u1",
      email: "seller1@example.com",
      name: "Seller",
      lastname: "One",
      isActive: true,
      roles: [{ id: "r1", name: "Admin", description: "Administrator role" }]
    },
    productType: {
      id: "pt1",
      name: "Book",
      slug: "book",
      schema: {
        author: { type: "string", required: true, label: "Author" },
        publisher: { type: "string", required: true, label: "Publisher" },
        pages: { type: "string", required: true, label: "Pages" }
      }
    },
    isActive: true,
    createdAt: new Date("2025-01-09T00:00:00Z"),
    updatedAt: new Date("2025-05-09T00:00:00Z"),
    deletedAt: new Date("1970-01-01T00:00:00Z"),
    attributes: {
      author: "Steven Erikson",
      pages: '657',
      publisher: "Tor Books",
      isBestseller: false
    }
  },
  {
    id: '10',
    title: "The Priory of the Orange Tree",
    price: 19.99,
    images: [
      {
        id: 1,
        url: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=600&fit=crop",
        key: 'key'
      }
    ],
    categories: [{ id: "c10", name: "High Fantasy", slug: "high-fantasy" }],
    description: "The House of Berethnet has ruled Inys for a thousand years. Still unwed, Queen Sabran the Ninth must conceive a daughter to protect her realm from destruction—but assassins are getting closer to her door. Ead Duryan is an outsider at court. Though she has risen to the high-ranking position of lady-in-waiting, she is loyal to a hidden society of mages.",
    rating: 4,
    reviews: 1567,
    tags: ["fantasy", "high-fantasy", "epic"],
    slug: "the-priory-of-the-orange-tree",
    stock: 16,
    user: {
      id: "u1",
      email: "seller1@example.com",
      name: "Seller",
      lastname: "One",
      isActive: true,
      roles: [{ id: "r1", name: "Admin", description: "Administrator role" }]
    },
    productType: {
      id: "pt1",
      name: "Book",
      slug: "book",
      schema: {
        author: { type: "string", required: true, label: "Author" },
        publisher: { type: "string", required: true, label: "Publisher" },
        pages: { type: "string", required: true, label: "Pages" }
      }
    },
    isActive: true,
    createdAt: new Date("2025-01-10T00:00:00Z"),
    updatedAt: new Date("2025-05-10T00:00:00Z"),
    deletedAt: new Date("1970-01-01T00:00:00Z"),
    attributes: {
      author: "Samantha Shannon",
      pages: '848',
      publisher: "Bloomsbury",
      isBestseller: false
    }
  },
  {
    id: '11',
    title: "The Fifth Season",
    price: 16.99,
    reviews: 1893,
    images: [
      {
        id: 1,
        url: "https://images.unsplash.com/photo-1531988042231-d39a9cc12a9a?w=400&h=600&fit=crop",
        key: 'key'
      }
    ],
    categories: [{ id: "c11", name: "Dark Fantasy", slug: "dark-fantasy" }],
    description: "This is the way the world ends. Again. Three terrible things happen in a single day. Essun, a woman living an ordinary life in a small town, comes home to find that her husband has brutally murdered their son and kidnapped their daughter. Meanwhile, mighty combatants—Loss, with the power to reshape the very fabric of the earth—Loss cause the great red rift across the heart of the world's sole continent.",
    rating: 5,
    tags: ["fantasy", "science-fiction", "award-winning"],
    slug: "the-fifth-season",
    stock: 20,
    user: {
      id: "u1",
      email: "seller1@example.com",
      name: "Seller",
      lastname: "One",
      isActive: true,
      roles: [{ id: "r1", name: "Admin", description: "Administrator role" }]
    },
    productType: {
      id: "pt1",
      name: "Book",
      slug: "book",
      schema: {
        author: { type: "string", required: true, label: "Author" },
        publisher: { type: "string", required: true, label: "Publisher" },
        pages: { type: "string", required: true, label: "Pages" }
      }
    },
    isActive: true,
    createdAt: new Date("2025-01-11T00:00:00Z"),
    updatedAt: new Date("2025-05-11T00:00:00Z"),
    deletedAt: new Date("1970-01-01T00:00:00Z"),
    attributes: {
      author: "N.K. Jemisin",
      isBestseller: true,
      publisher: "Orbit",
      pages: '468',
    }
  },
  {
    id: '12',
    title: "Circe",
    price: 15.99,
    rating: 5,
    reviews: 2341,
    tags: ["fantasy", "mythology", "literary"],
    images: [{
      id: 3,
      url: "https://images.unsplash.com/photo-1610882099717-7d3cf1c1c739?w=400&h=600&fit=crop",
      key: 'key'
    }],
    slug: "circe",
    stock: 26,
    user: {
      id: "u1",
      email: "seller1@example.com",
      name: "Seller",
      lastname: "One",
      isActive: true,
      roles: [{ id: "r1", name: "Admin", description: "Administrator role" }]
    },
    productType: {
      id: "pt1",
      name: "Book",
      slug: "book",
      schema: {
        author: { type: "string", required: true, label: "Author" },
        publisher: { type: "string", required: true, label: "Publisher" },
        pages: { type: "string", required: true, label: "Pages" }
      }
    },
    isActive: true,
    createdAt: new Date("2025-01-12T00:00:00Z"),
    updatedAt: new Date("2025-05-12T00:00:00Z"),
    deletedAt: new Date("1970-01-01T00:00:00Z"),
    categories: [{ id: "c12", name: "Mythic Fantasy", slug: "mythic-fantasy" }],
    description: "In the house of Helios, god of the sun and mightiest of the Titans, a daughter is born. But Circe is a strange child—not powerful, like her father, nor viciously alluring like her mother. Turning to the world of mortals for companionship, she discovers that she does possess power—the power of witchcraft, which can transform rivals into monsters and menace the gods themselves.",
    attributes: {
      author: "Madeline Miller",
      pages: '393',
      publisher: "Little, Brown and Company",
      isBestseller: false
    }
  },
];

export function FeaturedProducts({ title, subtitle, filterKey = "all" }: FeaturedProductsProps) {
  const items = products.filter(filters[filterKey]);

  return (
    <section className="py-4">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <Link
          to="/search"
          className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          View all
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <Carousel opts={{ align: "start", loop: true }} className="w-full">
        <CarouselContent className="-ml-4">
          {items.map((product) => (
            <CarouselItem
              key={product.id}
              className="pl-4 basis-1/2 sm:basis-1/3 lg:basis-1/4 xl:basis-1/5"
            >
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex border-border bg-background/80 text-foreground hover:bg-background hover:text-primary" />
        <CarouselNext className="hidden sm:flex border-border bg-background/80 text-foreground hover:bg-background hover:text-primary" />
      </Carousel>
    </section>
  );
}

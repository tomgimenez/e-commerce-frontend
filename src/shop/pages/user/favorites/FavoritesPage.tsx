import { useState } from "react";
import { Heart, Star, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

const products = [
  {
    id: 1,
    title: "The Fellowship of the Ring",
    author: "J.R.R. Tolkien",
    price: 18.99,
    originalPrice: 24.99,
    rating: 5,
    reviews: 2847,
    image: "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400&h=600&fit=crop",
    category: "Epic Fantasy",
    isBestseller: true,
    description: "In ancient times the Rings of Power were crafted by the Elven-smiths, and Sauron, the Dark Lord, forged the One Ring, filling it with his own power so that he could rule all others. But the One Ring was taken from him, and though he sought it throughout Middle-earth, it remained lost to him. After many ages it fell by chance into the hands of the hobbit Bilbo Baggins.",
    pages: 423,
    language: "English",
    publisher: "Houghton Mifflin",
    publishDate: "1954-07-29",
    isbn: "978-0547928210",
  },
  {
    id: 2,
    title: "Harry Potter and the Sorcerer's Stone",
    author: "J.K. Rowling",
    price: 14.99,
    rating: 5,
    reviews: 5621,
    image: "https://images.unsplash.com/photo-1626618012641-bfbca5a31239?w=400&h=600&fit=crop",
    category: "Young Adult Fantasy",
    isBestseller: true,
    description: "Harry Potter has never even heard of Hogwarts when the letters start dropping on the doormat at number four, Privet Drive. Addressed in green ink on yellowish parchment with a purple seal, they are swiftly confiscated by his grisly aunt and uncle. Then, on Harry's eleventh birthday, a great beetle-eyed giant of a man called Rubeus Hagrid bursts in with some astonishing news.",
    pages: 309,
    language: "English",
    publisher: "Scholastic",
    publishDate: "1998-09-01",
    isbn: "978-0590353427",
  },
  {
    id: 3,
    title: "A Game of Thrones",
    author: "George R.R. Martin",
    price: 22.99,
    originalPrice: 29.99,
    rating: 4,
    reviews: 3156,
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
    category: "Dark Fantasy",
    description: "Long ago, in a time forgotten, a preternatural event threw the seasons out of balance. In a land where summers can last decades and winters a lifetime, trouble is brewing. The cold is returning, and in the frozen wastes to the north of Winterfell, sinister and supernatural forces are massing beyond the kingdom's protective Wall.",
    pages: 694,
    language: "English",
    publisher: "Bantam",
    publishDate: "1996-08-01",
    isbn: "978-0553573404",
  },
  {
    id: 4,
    title: "The Name of the Wind",
    author: "Patrick Rothfuss",
    price: 16.99,
    rating: 5,
    reviews: 1892,
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
    category: "Epic Fantasy",
    isNew: true,
    description: "My name is Kvothe. I have stolen princesses back from sleeping barrow kings. I burned down the town of Trebon. I have spent the night with Felurian and left with both my sanity and my life. I was expelled from the University at a younger age than most people are allowed in. I tread paths by moonlight that others fear to speak of during day.",
    pages: 662,
    language: "English",
    publisher: "DAW Books",
    publishDate: "2007-03-27",
    isbn: "978-0756404741",
  },
  {
    id: 5,
    title: "The Way of Kings",
    author: "Brandon Sanderson",
    price: 19.99,
    originalPrice: 26.99,
    rating: 5,
    reviews: 2103,
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop",
    category: "High Fantasy",
    description: "Roshar is a world of stone and storms. Uncanny tempests of incredible power sweep across the rocky terrain so frequently that they have shaped ecology and civilization alike. Animals hide in shells, trees pull in branches, and grass retracts into the soilless ground. Cities are built only where the weights of cataclysmic rock formations provide shelter.",
    pages: 1007,
    language: "English",
    publisher: "Tor Books",
    publishDate: "2010-08-31",
    isbn: "978-0765326355",
  },
  {
    id: 6,
    title: "The Lies of Locke Lamora",
    author: "Scott Lynch",
    price: 15.99,
    rating: 4,
    reviews: 987,
    image: "https://images.unsplash.com/photo-1629992101753-56d196c8aabb?w=400&h=600&fit=crop",
    category: "Sword & Sorcery",
    isNew: true,
    description: "An orphan's life is harsh—and often short—in the mysterious island city of Camorr. But young Locke Lamora dodges death and slavery, becoming a thief under the tutelage of a gifted con artist. As leader of the band of light-fingered brothers known as the Gentleman Bastards, Locke is soon infamous, fooling even the underworld's most feared ruler.",
    pages: 499,
    language: "English",
    publisher: "Bantam Spectra",
    publishDate: "2006-06-27",
    isbn: "978-0553588941",
  },
  {
    id: 7,
    title: "Mistborn: The Final Empire",
    author: "Brandon Sanderson",
    price: 17.99,
    originalPrice: 22.99,
    rating: 5,
    reviews: 2456,
    image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400&h=600&fit=crop",
    category: "Epic Fantasy",
    isBestseller: true,
    description: "For a thousand years the ash fell and no flowers bloomed. For a thousand years the Skaa slaved in misery and lived in fear. For a thousand years the Lord Ruler, the 'Sliver of Infinity,' reigned with absolute power and ultimate terror, divinely invincible. Then, when hope was so long lost that not even its memory remained, a terribly scarred, heart-broken half-Skaa rediscovered it in the depths of the Lord Ruler's most hellish prison.",
    pages: 541,
    language: "English",
    publisher: "Tor Books",
    publishDate: "2006-07-17",
    isbn: "978-0765311788",
  },
  {
    id: 8,
    title: "The Blade Itself",
    author: "Joe Abercrombie",
    price: 14.99,
    rating: 4,
    reviews: 1234,
    image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=600&fit=crop",
    category: "Dark Fantasy",
    description: "Logen Ninefingers, infamous barbarian, has finally run out of luck. Caught in one feud too many, he's on the verge of becoming a dead barbarian – leaving nothing behind him but bad songs, dead friends, and a lot of enemies. Captain Jezal dan Luthar, a self-satisfied nobleman and champion fencer, has nothing more dangerous in mind than fleecing his friends at cards and dreaming of glory in the upcoming Tournament.",
    pages: 515,
    language: "English",
    publisher: "Pyr",
    publishDate: "2007-09-04",
    isbn: "978-1591025948",
  },
  {
    id: 9,
    title: "Gardens of the Moon",
    author: "Steven Erikson",
    price: 21.99,
    originalPrice: 28.99,
    rating: 4,
    reviews: 876,
    image: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400&h=600&fit=crop",
    category: "Epic Fantasy",
    description: "The Malazan Empire simmers with discontent, bled dry by interminable warfare, bitter infighting and bloody confrontations. Even the imperial legions, long inured to the bloodshed, yearn for some respite. Yet Empress Laseen's rule remains absolute, enforced by her dread combatants: the Claw, and Tayschrenn, deadliest combatant of them all.",
    pages: 657,
    language: "English",
    publisher: "Tor Books",
    publishDate: "2004-12-01",
    isbn: "978-0765348784",
  },
  {
    id: 10,
    title: "The Priory of the Orange Tree",
    author: "Samantha Shannon",
    price: 19.99,
    rating: 4,
    reviews: 1567,
    image: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=600&fit=crop",
    category: "High Fantasy",
    isNew: true,
    description: "The House of Berethnet has ruled Inys for a thousand years. Still unwed, Queen Sabran the Ninth must conceive a daughter to protect her realm from destruction—but assassins are getting closer to her door. Ead Duryan is an outsider at court. Though she has risen to the high-ranking position of lady-in-waiting, she is loyal to a hidden society of mages.",
    pages: 848,
    language: "English",
    publisher: "Bloomsbury",
    publishDate: "2019-02-26",
    isbn: "978-1635570298",
  },
  {
    id: 11,
    title: "The Fifth Season",
    author: "N.K. Jemisin",
    price: 16.99,
    originalPrice: 21.99,
    rating: 5,
    reviews: 1893,
    image: "https://images.unsplash.com/photo-1531988042231-d39a9cc12a9a?w=400&h=600&fit=crop",
    category: "Dark Fantasy",
    isBestseller: true,
    description: "This is the way the world ends. Again. Three terrible things happen in a single day. Essun, a woman living an ordinary life in a small town, comes home to find that her husband has brutally murdered their son and kidnapped their daughter. Meanwhile, mighty combatants—Loss, with the power to reshape the very fabric of the earth—Loss cause the great red rift across the heart of the world's sole continent.",
    pages: 468,
    language: "English",
    publisher: "Orbit",
    publishDate: "2015-08-04",
    isbn: "978-0316229296",
  },
  {
    id: 12,
    title: "Circe",
    author: "Madeline Miller",
    price: 15.99,
    rating: 5,
    reviews: 2341,
    image: "https://images.unsplash.com/photo-1610882099717-7d3cf1c1c739?w=400&h=600&fit=crop",
    category: "Mythic Fantasy",
    description: "In the house of Helios, god of the sun and mightiest of the Titans, a daughter is born. But Circe is a strange child—not powerful, like her father, nor viciously alluring like her mother. Turning to the world of mortals for companionship, she discovers that she does possess power—the power of witchcraft, which can transform rivals into monsters and menace the gods themselves.",
    pages: 393,
    language: "English",
    publisher: "Little, Brown and Company",
    publishDate: "2018-04-10",
    isbn: "978-0316556347",
  },
];

// Simulate the user's saved favorites (subset of the catalog).
const initialFavoriteIds = [1, 2, 4, 5, 7, 11];

export default function FavoritesPage() {
  const [favoriteIds] = useState<number[]>(initialFavoriteIds);

  const favoriteProducts = products.filter((p) => favoriteIds.includes(p.id));

  return (

      <>
        {/* Page header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground text-balance">
              My Favorites
            </h1>
            <p className="text-muted-foreground mt-1">
              {favoriteProducts.length}{" "}
              {favoriteProducts.length === 1 ? "book" : "books"} saved to your
              collection
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary shrink-0">
            <Heart className="h-6 w-6 text-primary fill-primary" />
          </div>
        </div>

        {favoriteProducts.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center text-center py-20">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary mb-4">
              <Heart className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              No favorites yet
            </h2>
            <p className="text-muted-foreground max-w-sm mb-6">
              Start exploring our enchanted tomes and tap the heart to save the
              ones you love here.
            </p>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link to="/">Browse the Vault</Link>
            </Button>
          </div>
        ) : (
          /* Favorites grid */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favoriteProducts.map((product) => {
              const discount = product.originalPrice
                ? Math.round(
                    ((product.originalPrice - product.price) /
                      product.originalPrice) *
                      100
                  )
                : 0;

              return (
                <div
                  key={product.id}
                  className="group relative bg-card border border-border rounded-xl overflow-hidden transition-colors hover:border-primary/50"
                >
                  {/* Remove button */}
                  <button
                    type="button"
                    aria-label={`Remove ${product.title} from favorites`}
                    className="absolute top-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur-sm transition-colors hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  {/* Image */}
                  <Link
                    to={`/product/${product.id}`}
                    className="relative block aspect-3/4 bg-secondary overflow-hidden"
                  >
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {discount > 0 && (
                      <span className="absolute top-2 left-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-medium text-primary-foreground">
                        -{discount}%
                      </span>
                    )}
                  </Link>

                  {/* Info */}
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">
                      {product.category}
                    </p>
                    <Link to={`/product/${product.id}`}>
                      <h3 className="font-medium text-foreground line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                        {product.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground mb-2">
                      {product.author}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${
                            i < product.rating
                              ? "text-primary fill-primary"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                      <span className="text-xs text-muted-foreground ml-1">
                        ({product.reviews})
                      </span>
                    </div>

                    {/* Price + add to cart */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-semibold text-foreground">
                          ${product.price.toFixed(2)}
                        </span>
                        {!!product.originalPrice && (
                          <span className="text-xs text-muted-foreground line-through">
                            ${product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <Button
                        size="sm"
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </>
  );
}

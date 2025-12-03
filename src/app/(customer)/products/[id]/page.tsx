import { getServerSession } from "@/server/session";
import { getProductById, getRelatedProducts } from "@/lib/queries/products";
import { notFound } from "next/navigation";
import { ProductClient } from "./product-client";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const session = await getServerSession();
  const user = session?.user;

  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  // Fetch related products from the same category
  const relatedProducts = product.category.id 
    ? await getRelatedProducts(product.category.id, product.id)
    : [];

  return (
    <main className="relative min-h-screen">
      <ProductClient
        product={product}
        relatedProducts={relatedProducts}
        userId={user?.id}
      />
    </main>
  );
}

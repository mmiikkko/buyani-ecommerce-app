import { notFound } from "next/navigation";
import { getServerSession } from "@/server/session";
import { getProductById } from "@/lib/queries/products";
import { ProductDetailClient } from "./product-detail-client";

type ProductPageProps = {
  params: Promise<{
    productId: string;
  }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { productId } = await params;
  const product = await getProductById(productId);

  if (!product) {
    notFound();
  }

  const session = await getServerSession();
  const userId = session?.user?.id;

  return (
    <main className="relative min-h-screen bg-slate-50">
      <ProductDetailClient product={product} userId={userId} />
    </main>
  );
}

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { v4 as uuidv4 } from "uuid";
import type { Product, Variant } from "@/types/products";

interface AddProductsProps {
  onAdd: (product: Product) => void;
}

/* --- Helper: cartesian product to generate variant combos --- */
function cartesianProduct(arrays: string[][]): string[][] {
  if (!arrays.length) return [];
  return arrays.reduce<string[][]>(
    (a, b) => a.flatMap(d => b.map(e => [...d, e])),
    [[]]
  );
}

/* --- Default categories --- */
const demoCategories = [
  { id: "cat-fruits", name: "Fruits" },
  { id: "cat-vegetables", name: "Vegetables" },
  { id: "cat-electronics", name: "Electronics" },
  { id: "cat-apparel", name: "Apparel" },
];

export function AddProducts({ onAdd }: AddProductsProps) {
  // BASIC
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // IMAGES
  const [imagePreviews, setImagePreviews] = useState<string[]>(["/mnt/data/cd282b9a-854b-424e-8299-1e421d8c3b67.png"]);

  // CATEGORY
  const [categoryId, setCategoryId] = useState<string>(demoCategories[0].id);

  // VARIATIONS
  const [variationGroups, setVariationGroups] = useState<{ id: string; name: string; options: string[] }[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);

  // PRICING & STOCK
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [status, setStatus] = useState("Available");

  // SHIPPING
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState("kg");
  const [lengthVal, setLengthVal] = useState("");
  const [widthVal, setWidthVal] = useState("");
  const [heightVal, setHeightVal] = useState("");
  const [shippingFee, setShippingFee] = useState("");

  // ERROR
  const [error, setError] = useState("");

  /* --- Variation handlers --- */
  const addVariationGroup = () =>
    setVariationGroups(prev => [...prev, { id: uuidv4(), name: "New Variation", options: [] }]);
  const removeVariationGroup = (id: string) =>
    setVariationGroups(prev => prev.filter(g => g.id !== id));
  const updateVariationName = (id: string, nameVal: string) =>
    setVariationGroups(prev => prev.map(g => g.id === id ? { ...g, name: nameVal } : g));
  const addOptionToGroup = (id: string, option: string) =>
    setVariationGroups(prev => prev.map(g => g.id === id ? { ...g, options: [...g.options, option] } : g));
  const removeOptionFromGroup = (groupId: string, optIdx: number) =>
    setVariationGroups(prev => prev.map(g => g.id === groupId ? { ...g, options: g.options.filter((_, i) => i !== optIdx) } : g));

  // Generate variants whenever groups/options change
  useEffect(() => {
    if (!variationGroups.length || variationGroups.some(g => g.options.length === 0)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVariants([]);
      return;
    }

    const optionsArrays = variationGroups.map(g => g.options);
    const combos = cartesianProduct(optionsArrays);

    const generated: Variant[] = combos.map(combo => {
      const initials = combo.map(opt => opt.split(" ").map(w => w[0]?.toUpperCase() || "").join("")).join("-");
      const skuBase = (name || "PRD").replace(/\s+/g, "").toUpperCase().slice(0, 6);
      const sku = `${skuBase}-${initials}-${Math.random().toString(36).slice(2,6).toUpperCase()}`;
      return { id: uuidv4(), sku, optionCombo: combo, price: price ? Number(price) : 0, stock: 0 };
    });

    setVariants(generated);
  }, [variationGroups, name, price]);

  const updateVariant = (id: string, patch: Partial<Variant>) =>
    setVariants(prev => prev.map(v => v.id === id ? { ...v, ...patch } : v));

  /* --- Submit --- */
  const handleSubmit = () => {
    if (!name.trim()) return setError("Product name is required.");
    if (!variants.length) {
      if (!price.trim() || isNaN(Number(price)) || Number(price) <= 0) return setError("Enter a valid price.");
      if (!stock.trim() || isNaN(Number(stock)) || Number(stock) < 0) return setError("Enter valid stock quantity.");
    } else {
      for (const v of variants) {
        if (isNaN(v.price) || v.price < 0) return setError("Every variant needs a valid price.");
        if (isNaN(v.stock) || v.stock < 0) return setError("Every variant needs a valid stock value.");
      }
    }

    setError("");

    const productId = uuidv4();
    const totalStock = variants.length ? variants.reduce((s, v) => s + Number(v.stock || 0), 0) : Number(stock || 0);
    const skuBase = (name || "PRD").replace(/\s+/g, "").toUpperCase().slice(0, 6);

    const product: Product = {
      id: productId,
      productName: name,
      description,
      price: variants.length ? undefined : Number(price),
      stock: totalStock,
      images: imagePreviews.map((img, idx) => ({
        id: uuidv4(),
        product_id: productId,
        image_url: [img],
        is_primary: idx === 0,
      })),
      categoryId: categoryId || "",
      SKU: skuBase,
      shipping: {
        weight: weight ? Number(weight) : undefined,
        weightUnit,
        length: lengthVal ? Number(lengthVal) : undefined,
        width: widthVal ? Number(widthVal) : undefined,
        height: heightVal ? Number(heightVal) : undefined,
        shippingFee: shippingFee ? Number(shippingFee) : undefined,
      },
      status,
      shopId: "",
      isAvailable: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    onAdd(product);

    // reset
    setName(""); setDescription(""); setImagePreviews(["/mnt/data/cd282b9a-854b-424e-8299-1e421d8c3b67.png"]);
    setCategoryId(demoCategories[0].id); setVariationGroups([]); setVariants([]);
    setPrice(""); setStock(""); setWeight(""); setWeightUnit("kg"); setLengthVal(""); setWidthVal(""); setHeightVal(""); setShippingFee("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#2E7D32] text-white rounded-md hover:bg-[#27632a] cursor-pointer">
          + Add Product
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[950px] max-h-[750px] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-[#2E7D32] text-xl font-bold">
            Products Information
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full mt-4">
          <TabsList className="flex space-x-2 bg-transparent">
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="images">Product Images</TabsTrigger>
            <TabsTrigger value="category">Category</TabsTrigger>
            <TabsTrigger value="variations">Variations</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="shipping">Shipping Info</TabsTrigger>
          </TabsList>

          {/* BASIC */}
          <TabsContent value="basic" className="mt-4 space-y-4">
            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
            <input type="text" placeholder="Product Name" value={name} onChange={(e)=>setName(e.target.value)} className="w-full border rounded-md px-3 py-2"/>
            <textarea placeholder="Product Description" value={description} onChange={(e)=>setDescription(e.target.value)} className="w-full border rounded-md px-3 py-2 min-h-[100px]"/>
            {!variants.length && <input type="number" placeholder="Stock" value={stock} onChange={(e)=>setStock(e.target.value)} className="w-full border rounded-md px-3 py-2"/>}
          </TabsContent>

          {/* IMAGES */}
          <TabsContent value="images" className="mt-4">
            <div className="border p-4 rounded-md space-y-3">
              <input type="file" accept="image/*" multiple onChange={(e)=>{
                const files = e.target.files; if(!files) return; 
                setImagePreviews(prev => [...prev, ...Array.from(files).map(f=>URL.createObjectURL(f))]);
              }} />
              <div className="mt-3 grid grid-cols-4 gap-3">
                {imagePreviews.map((src, idx) => (
                  <div key={idx} className="relative border rounded-md overflow-hidden">
                    <Image src={src} alt={`preview-${idx}`} width={200} height={200} className="object-cover"/>
                    <button onClick={()=>setImagePreviews(prev=>prev.filter((_,i)=>i!==idx))} className="absolute top-1 right-1 bg-black/50 text-white text-xs px-2 py-1 rounded" type="button">Remove</button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* CATEGORY */}
          <TabsContent value="category" className="mt-4">
            <div className="border p-4 rounded-md">
              <label className="block text-sm font-medium mb-2">Select Category</label>
              <select value={categoryId} onChange={(e)=>setCategoryId(e.target.value)} className="w-full border rounded-md px-3 py-2">
                {demoCategories.map(cat=><option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>
          </TabsContent>

          {/* VARIATIONS */}
          <TabsContent value="variations" className="mt-4">
            <div className="border p-4 rounded-md space-y-4">
              {variationGroups.map((g) => (
                <div key={g.id} className="border rounded p-3">
                  <div className="flex gap-2 items-center mb-2">
                    <input value={g.name} onChange={(e)=>updateVariationName(g.id, e.target.value)} className="flex-1 border rounded px-2 py-1"/>
                    <button onClick={()=>removeVariationGroup(g.id)} className="px-2 py-1 bg-red-500 text-white rounded">Remove Group</button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input placeholder="New option" id={`opt-${g.id}`} className="flex-1 border rounded px-2 py-1"/>
                      <button onClick={()=>{
                        const el = document.getElementById(`opt-${g.id}`) as HTMLInputElement|null;
                        if(!el) return; const val=el.value.trim(); if(!val) return; addOptionToGroup(g.id,val); el.value="";
                      }} className="px-3 py-1 bg-green-600 text-white rounded">Add Option</button>
                    </div>
                    <div className="flex flex-wrap gap-2">{g.options.map((opt, oi)=>(
                      <div key={oi} className="bg-gray-100 px-2 py-1 rounded flex items-center gap-2"><span className="text-sm">{opt}</span><button onClick={()=>removeOptionFromGroup(g.id,oi)} className="text-xs text-red-500">x</button></div>
                    ))}</div>
                  </div>
                </div>
              ))}
              <div className="flex gap-2">
                <button onClick={addVariationGroup} className="px-3 py-2 bg-blue-600 text-white rounded">+ Add Variation Group</button>
                <div className="text-sm text-gray-500 self-center">{variants.length ? `${variants.length} variants generated` : 'No variant combos yet'}</div>
              </div>

              {variants.length>0 && <div className="mt-3 space-y-2">
                <h4 className="font-medium">Variants</h4>
                <div className="space-y-2">{variants.map(v=>(
                  <div key={v.id} className="flex gap-2 items-center">
                    <div className="flex-1"><div className="text-sm">{v.optionCombo.join(" / ")}</div><div className="text-xs text-muted-foreground">{v.sku}</div></div>
                    <input type="number" value={String(v.price)} onChange={(e)=>updateVariant(v.id,{price:Number(e.target.value)})} className="w-28 border rounded px-2 py-1" placeholder="Price"/>
                    <input type="number" value={String(v.stock)} onChange={(e)=>updateVariant(v.id,{stock:Number(e.target.value)})} className="w-24 border rounded px-2 py-1" placeholder="Stock"/>
                  </div>
                ))}</div>
              </div>}
            </div>
          </TabsContent>

          {/* PRICING */}
          <TabsContent value="pricing" className="mt-4">
            {!variants.length && <input type="number" placeholder="Price" value={price} onChange={(e)=>setPrice(e.target.value)} className="w-full border rounded-md px-3 py-2"/>}
            <label className="block text-sm mt-2">Status</label>
            <select value={status} onChange={(e)=>setStatus(e.target.value)} className="w-full border rounded px-3 py-2"><option>Available</option><option>Draft</option><option>Out of stock</option><option>Discontinued</option></select>
          </TabsContent>

          {/* SHIPPING */}
          <TabsContent value="shipping" className="mt-4">
            <div className="grid grid-cols-3 gap-3">
              <input type="number" placeholder="Weight" value={weight} onChange={e=>setWeight(e.target.value)} className="border rounded px-2 py-1"/>
              <select value={weightUnit} onChange={e=>setWeightUnit(e.target.value)} className="border rounded px-2 py-1"><option value="kg">kg</option><option value="g">g</option><option value="lb">lb</option></select>
              <input type="number" placeholder="Shipping Fee" value={shippingFee} onChange={e=>setShippingFee(e.target.value)} className="border rounded px-2 py-1"/>
              <input type="number" placeholder="Length" value={lengthVal} onChange={e=>setLengthVal(e.target.value)} className="border rounded px-2 py-1"/>
              <input type="number" placeholder="Width" value={widthVal} onChange={e=>setWidthVal(e.target.value)} className="border rounded px-2 py-1"/>
              <input type="number" placeholder="Height" value={heightVal} onChange={e=>setHeightVal(e.target.value)} className="border rounded px-2 py-1"/>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 mt-6">
          <button className="px-5 py-2 bg-gray-200 rounded-md">Save as Draft</button>
          <button onClick={handleSubmit} className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Save and Publish</button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

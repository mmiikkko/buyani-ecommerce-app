"use client"

import { useState, useEffect } from "react";
import { Dialog,
         DialogContent,
         DialogHeader,
         DialogTitle,
         DialogTrigger } from "@/components/ui/dialog"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { v4 as uuidv4 } from "uuid";
import type { Product, Variant } from "@/types/products";

interface AddProductsProps {
  onAdd: (product: Product) => void;
}

/* --- Helper: cartesian product to generate variant combos --- */
function cartesianProduct(arrays: string[][]): string[][] {
  if (!arrays.length) return [];
  return arrays.reduce<string[][]>(
    (a, b) =>
      a.flatMap(d => b.map(e => [...d, e])),
    [[]]
  );
}

/* --- Default categories (replace with dynamic data later) --- */
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
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([
    // use provided local path as initial placeholder
    "/mnt/data/cd282b9a-854b-424e-8299-1e421d8c3b67.png",
  ]);

  // CATEGORY
  const [categoryId, setCategoryId] = useState<string | undefined>(demoCategories[0].id);

  // VARIATIONS: array of groups like {name: "Size", options: ["S","M","L"]}
  const [variationGroups, setVariationGroups] = useState<{ id: string; name: string; options: string[] }[]>([]);

  // GENERATED VARIANTS (combinations)
  const [variants, setVariants] = useState<Variant[]>([]);

  // PRICING (moved here)
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("Available");

  // SHIPPING
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState("kg");
  const [lengthVal, setLengthVal] = useState("");
  const [widthVal, setWidthVal] = useState("");
  const [heightVal, setHeightVal] = useState("");
  const [shippingFee, setShippingFee] = useState("");

  // STOCK (if no variants)
  const [stock, setStock] = useState("");

  // ERROR
  const [error, setError] = useState("");

  /* --- Image handlers --- */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const arr = Array.from(files);
    setImageFiles(prev => [...prev, ...arr]);

    // create previews
    const newPreviews = arr.map(f => URL.createObjectURL(f));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removePreview = (idx: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== idx));
    setImageFiles(prev => prev.filter((_, i) => i !== idx));
  };

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
      setVariants([]); // no complete variants
      return;
    }

    const optionsArrays = variationGroups.map(g => g.options);
    const combos = cartesianProduct(optionsArrays); // array of option arrays

    const generated: Variant[] = combos.map(combo => {
      // build sku from product name + initials of options (simple approach)
      const initials = combo.map(opt => opt.split(" ").map(w => w[0]?.toUpperCase() || "").join("")).join("-");
      const skuBase = (name || "PRD").replace(/\s+/g, "").toUpperCase().slice(0, 6);
      const sku = `${skuBase}-${initials}-${Math.random().toString(36).slice(2,6).toUpperCase()}`;

      return {
        id: uuidv4(),
        sku,
        optionCombo: combo,
        price: price ? Number(price) : 0,
        stock: 0,
      };
    });

    setVariants(generated);
  }, [variationGroups, name, price]);

  // update single variant fields
  const updateVariant = (id: string, patch: Partial<Variant>) =>
    setVariants(prev => prev.map(v => v.id === id ? { ...v, ...patch } : v));

  /* --- Submit --- */
  const handleSubmit = () => {
    // Basic validation
    if (!name.trim()) return setError("Product name is required.");
    // If there are no variants, ensure pricing and stock valid
    if (!variants.length) {
      if (!price.trim() || isNaN(Number(price)) || Number(price) <= 0) return setError("Enter a valid price.");
      if (!stock.trim() || isNaN(Number(stock)) || Number(stock) < 0) return setError("Enter valid stock quantity.");
    } else {
      // with variants: ensure each variant has price and non-negative stock
      for (const v of variants) {
        if (isNaN(v.price) || v.price < 0) return setError("Every variant needs a valid price.");
        if (isNaN(v.stock) || v.stock < 0) return setError("Every variant needs a valid stock value.");
      }
    }

    setError("");

    const productId = uuidv4();

    const finalImages = imagePreviews.length ? imagePreviews : ["/mnt/data/cd282b9a-854b-424e-8299-1e421d8c3b67.png"];

    const totalStock = variants.length ? variants.reduce((s, v) => s + Number(v.stock || 0), 0) : Number(stock || 0);

    const product: Product = {
      id: productId,
      name,
      description,
      price: variants.length ? undefined : Number(price),
      stock: totalStock,
      images: finalImages,
      categoryId,
      sku: undefined,
      variants: variants.length ? variants : undefined,
      shipping: {
        weight: weight ? Number(weight) : undefined,
        weightUnit,
        length: lengthVal ? Number(lengthVal) : undefined,
        width: widthVal ? Number(widthVal) : undefined,
        height: heightVal ? Number(heightVal) : undefined,
        shippingFee: shippingFee ? Number(shippingFee) : undefined,
      },
      status,
    };

    onAdd(product);

    // clear form
    setName("");
    setDescription("");
    setImageFiles([]);
    setImagePreviews(["/mnt/data/cd282b9a-854b-424e-8299-1e421d8c3b67.png"]);
    setCategoryId(demoCategories[0].id);
    setVariationGroups([]);
    setVariants([]);
    setPrice("");
    setStock("");
    setWeight("");
    setWeightUnit("kg");
    setLengthVal("");
    setWidthVal("");
    setHeightVal("");
    setShippingFee("");
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

          {/* BASIC INFO */}
          <TabsContent value="basic" className="mt-4">
            <div className="space-y-4">
              {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

              <input
                type="text"
                placeholder="Product Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded-md px-3 py-2"
              />

              <textarea
                placeholder="Product Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border rounded-md px-3 py-2 min-h-[100px]"
              />

              {/* If no variants, show stock here (keeps simple flow) */}
              {!variants.length && (
                <input
                  type="number"
                  placeholder="Stock"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full border rounded-md px-3 py-2"
                />
              )}
            </div>
          </TabsContent>

          {/* IMAGES */}
          <TabsContent value="images" className="mt-4">
            <div className="border p-4 rounded-md space-y-3">
              <p className="text-sm text-gray-600">Upload product images here (multiple allowed)</p>

              <input type="file" accept="image/*" multiple onChange={handleImageChange} />

              <div className="mt-3 grid grid-cols-4 gap-3">
                {imagePreviews.map((src, idx) => (
                  <div key={idx} className="relative border rounded-md overflow-hidden">
                    <img src={src} alt={`preview-${idx}`} className="w-full h-28 object-cover" />
                    <button
                      onClick={() => removePreview(idx)}
                      className="absolute top-1 right-1 bg-black/50 text-white text-xs px-2 py-1 rounded"
                      type="button"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* CATEGORY */}
          <TabsContent value="category" className="mt-4">
            <div className="border p-4 rounded-md">
              <label className="block text-sm font-medium mb-2">Select Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full border rounded-md px-3 py-2"
              >
                {demoCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </TabsContent>

          {/* VARIATIONS */}
          <TabsContent value="variations" className="mt-4">
            <div className="border p-4 rounded-md space-y-4">
              <p className="text-sm text-gray-600">Add variation groups (e.g. Size, Color) and options for each group.</p>

              <div className="space-y-3">
                {variationGroups.map((g, gi) => (
                  <div key={g.id} className="border rounded p-3">
                    <div className="flex gap-2 items-center mb-2">
                      <input
                        value={g.name}
                        onChange={(e) => updateVariationName(g.id, e.target.value)}
                        className="flex-1 border rounded px-2 py-1"
                      />
                      <button onClick={() => removeVariationGroup(g.id)} className="px-2 py-1 bg-red-500 text-white rounded">Remove Group</button>
                    </div>

                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input placeholder="New option (e.g. Small)" id={`opt-${g.id}`} className="flex-1 border rounded px-2 py-1" />
                        <button
                          onClick={() => {
                            const el = document.getElementById(`opt-${g.id}`) as HTMLInputElement | null;
                            if (!el) return;
                            const val = el.value.trim();
                            if (!val) return;
                            addOptionToGroup(g.id, val);
                            el.value = "";
                          }}
                          className="px-3 py-1 bg-green-600 text-white rounded"
                        >
                          Add Option
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {g.options.map((opt, oi) => (
                          <div key={oi} className="bg-gray-100 px-2 py-1 rounded flex items-center gap-2">
                            <span className="text-sm">{opt}</span>
                            <button
                              onClick={() => removeOptionFromGroup(g.id, oi)}
                              className="text-xs text-red-500"
                            >
                              x
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <button onClick={addVariationGroup} className="px-3 py-2 bg-blue-600 text-white rounded">+ Add Variation Group</button>
                <div className="text-sm text-gray-500 self-center">
                  {variants.length ? `${variants.length} variants generated` : 'No variant combos yet'}
                </div>
              </div>

              {/* Show generated variants with editable price/stock */}
              {variants.length > 0 && (
                <div className="mt-3 space-y-2">
                  <h4 className="font-medium">Variants</h4>
                  <div className="space-y-2">
                    {variants.map(v => (
                      <div key={v.id} className="flex gap-2 items-center">
                        <div className="flex-1">
                          <div className="text-sm">{v.optionCombo.join(" / ")}</div>
                          <div className="text-xs text-muted-foreground">{v.sku}</div>
                        </div>
                        <input
                          type="number"
                          value={String(v.price)}
                          onChange={(e) => updateVariant(v.id, { price: Number(e.target.value) })}
                          className="w-28 border rounded px-2 py-1"
                          placeholder="Price"
                        />
                        <input
                          type="number"
                          value={String(v.stock)}
                          onChange={(e) => updateVariant(v.id, { stock: Number(e.target.value) })}
                          className="w-24 border rounded px-2 py-1"
                          placeholder="Stock"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* PRICING */}
          <TabsContent value="pricing" className="mt-4">
            <div className="border p-4 rounded-md space-y-3">
              <p className="text-sm text-gray-600">Set unit price and availability. If you created variants, set variant prices individually.</p>

              {/* If variants exist, we allow editing individual prices only (they're shown in Variations tab) */}
              {!variants.length && (
                <input
                  type="number"
                  placeholder="Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full border rounded-md px-3 py-2"
                />
              )}

              <label className="block text-sm mt-2">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full border rounded px-3 py-2">
                <option>Available</option>
                <option>Draft</option>
                <option>Out of stock</option>
                <option>Discontinued</option>
              </select>
            </div>
          </TabsContent>

          {/* SHIPPING */}
          <TabsContent value="shipping" className="mt-4">
            <div className="border p-4 rounded-md space-y-3">
              <p className="text-sm text-gray-600">Shipping and logistics fields</p>

              <div className="grid grid-cols-3 gap-3">
                <input
                  type="number"
                  placeholder="Weight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="border rounded px-2 py-1"
                />
                <select value={weightUnit} onChange={(e) => setWeightUnit(e.target.value)} className="border rounded px-2 py-1">
                  <option value="kg">kg</option>
                  <option value="g">g</option>
                  <option value="lb">lb</option>
                </select>
                <input
                  type="number"
                  placeholder="Shipping Fee"
                  value={shippingFee}
                  onChange={(e) => setShippingFee(e.target.value)}
                  className="border rounded px-2 py-1"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <input type="number" placeholder="Length" value={lengthVal} onChange={(e) => setLengthVal(e.target.value)} className="border rounded px-2 py-1" />
                <input type="number" placeholder="Width" value={widthVal} onChange={(e) => setWidthVal(e.target.value)} className="border rounded px-2 py-1" />
                <input type="number" placeholder="Height" value={heightVal} onChange={(e) => setHeightVal(e.target.value)} className="border rounded px-2 py-1" />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 mt-6">
          <button className="px-5 py-2 bg-gray-200 rounded-md">
            Save as Draft
          </button>

          <button
            onClick={handleSubmit}
            className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Save and Publish
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

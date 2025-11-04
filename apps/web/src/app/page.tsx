import Image from "next/image";

export default function Home() {
  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold text-centers">
        Welcome to BuyAni Ecommerce
      </h1>

      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="bg-white shadow-md rounded-lg p-6 max-w-3xl mx-auto"
        >
          <h2 className="text-xl font-semibold mb-2">Sample Section {i + 1}</h2>
          <p className="text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
            euismod, nunc vel tincidunt sagittis, justo risus convallis leo, in
            pretium lorem risus sit amet magna. Duis et nunc non purus pretium
            tristique vel ut enim.
          </p>
        </div>
      ))}
    </div>
  );
}

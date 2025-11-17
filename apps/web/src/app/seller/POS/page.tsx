"use client";
import { CardsPosProd } from "../_components/cards-pos-prod";

export default function POS() {

  return (

    <section className="relative min-h-screen min-w-[80%] max-w-[100%] overflow-hidden space-y-5 mt-18 mx-3">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col">
          <h1 className="text-xl mb-1 font-bold text-[#2E7D32]">POS</h1>
          <p>Process in-store transactions</p>
        </div>
        
      </div>
      <div className="flex flex-row gap-1">
        <CardsPosProd />
      </div>
      
    </section>


  )
}

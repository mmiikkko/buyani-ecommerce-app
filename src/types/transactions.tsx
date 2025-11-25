export type Transaction = {
    id: string;
    userId: string;
    orderId: string;
  
    transactionType: string | null;
    remarks: string | null;
  
    createdAt: Date | null;
    updatedAt: Date | null;
  };


  export type Payment = {
    id: string;
    orderId: string;
  
    paymentMethod: number | null;
    paymentReceived: number | null;
    change: number | null;
    status: string | null;
  
    createdAt: Date | null;
    updatedAt: Date;
  };
  
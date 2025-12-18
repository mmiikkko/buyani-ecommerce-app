"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ArrowLeft, Download, Eye, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

type ApplicationData = {
  shop: {
    id: string;
    sellerId: string;
    shopName: string;
    shopRating?: string;
    description?: string;
    imageURL?: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
  seller: {
    id: string;
    name: string;
    email?: string;
    firstName?: string;
    lastName?: string;
  };
  application: {
    id: string;
    status: string;
    submittedAt: string;
    reviewedAt?: string;
  } | null;
  documents: Array<{
    id: string;
    documentType: string;
    documentURL: string;
    uploadedAt: string;
    verified: boolean;
  }>;
};

export default function SellerApprovalDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const shopId = params?.id as string;
  const [data, setData] = useState<ApplicationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!shopId) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/admin/seller-applications/${shopId}`);
        if (!res.ok) {
          throw new Error("Failed to fetch application details");
        }
        const applicationData = await res.json();
        setData(applicationData);
      } catch (error) {
        console.error("Error fetching application details:", error);
        toast.error("Failed to load application details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [shopId]);

  const handleApprove = async () => {
    if (!data) return;

    setProcessing(true);
    try {
      // Update shop status to approved
      const shopRes = await fetch(`/api/shops?id=${data.shop.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "approved" }),
      });

      if (!shopRes.ok) {
        throw new Error("Failed to approve shop");
      }

      // Update user role to seller
      const userRes = await fetch("/api/sellers/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: data.seller.id }),
      });

      if (!userRes.ok) {
        throw new Error("Failed to update user role");
      }

      toast.success("Shop approved successfully!");
      router.push("/admin/shops");
    } catch (error) {
      console.error("Error approving shop:", error);
      toast.error("Failed to approve shop");
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!data) return;

    if (!confirm("Are you sure you want to reject this application?")) {
      return;
    }

    setProcessing(true);
    try {
      const res = await fetch(`/api/shops?id=${data.shop.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to reject shop");
      }

      toast.success("Application rejected");
      router.push("/admin/shops");
    } catch (error) {
      console.error("Error rejecting shop:", error);
      toast.error("Failed to reject application");
    } finally {
      setProcessing(false);
    }
  };

  const handleViewDocument = (documentURL: string, documentType: string) => {
    // Open document in new window
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head>
            <title>${documentType}</title>
            <style>
              body { margin: 0; padding: 20px; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #f5f5f5; }
              img { max-width: 100%; max-height: 90vh; object-fit: contain; }
            </style>
          </head>
          <body>
            <img src="${documentURL}" alt="${documentType}" />
          </body>
        </html>
      `);
    }
  };

  const handleDownloadDocument = (documentURL: string, documentType: string) => {
    const link = document.createElement("a");
    link.href = documentURL;
    link.download = `${documentType}_${Date.now()}.${documentURL.includes("pdf") ? "pdf" : "jpg"}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading application details...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-gray-500">Application not found</p>
        <Button onClick={() => router.push("/admin/shops")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Shops
        </Button>
      </div>
    );
  }

  const notarizedAgreement = data.documents.find(
    (doc) => doc.documentType === "notarized_agreement"
  );
  const validId = data.documents.find((doc) => doc.documentType === "valid_id");

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => router.push("/admin/shops")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Seller Application Details</h1>
          <p className="text-sm text-gray-600">Review shop and seller information</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shop Information */}
        <Card>
          <CardHeader>
            <CardTitle>Shop Information</CardTitle>
            <CardDescription>Details about the shop</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.shop.imageURL && (
              <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                <Image
                  src={data.shop.imageURL}
                  alt={data.shop.shopName}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="space-y-2">
              <div>
                <span className="font-semibold text-sm text-gray-600">Shop Name:</span>
                <p className="text-lg font-medium">{data.shop.shopName}</p>
              </div>
              <div>
                <span className="font-semibold text-sm text-gray-600">Status:</span>
                <span
                  className={`ml-2 px-2 py-1 rounded text-sm font-medium ${
                    data.shop.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : data.shop.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {data.shop.status}
                </span>
              </div>
              {data.shop.description && (
                <div>
                  <span className="font-semibold text-sm text-gray-600">Description:</span>
                  <p className="text-sm text-gray-700 mt-1">{data.shop.description}</p>
                </div>
              )}
              <div>
                <span className="font-semibold text-sm text-gray-600">Created:</span>
                <p className="text-sm text-gray-700">
                  {new Date(data.shop.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seller Information */}
        <Card>
          <CardHeader>
            <CardTitle>Seller Information</CardTitle>
            <CardDescription>Details about the seller</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div>
                <span className="font-semibold text-sm text-gray-600">Name:</span>
                <p className="text-lg font-medium">{data.seller.name}</p>
              </div>
              {data.seller.email && (
                <div>
                  <span className="font-semibold text-sm text-gray-600">Email:</span>
                  <p className="text-sm text-gray-700">{data.seller.email}</p>
                </div>
              )}
              {data.application && (
                <div>
                  <span className="font-semibold text-sm text-gray-600">Application Status:</span>
                  <span
                    className={`ml-2 px-2 py-1 rounded text-sm font-medium ${
                      data.application.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : data.application.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {data.application.status}
                  </span>
                </div>
              )}
              {data.application && (
                <div>
                  <span className="font-semibold text-sm text-gray-600">Submitted:</span>
                  <p className="text-sm text-gray-700">
                    {new Date(data.application.submittedAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Documents */}
      <Card>
        <CardHeader>
          <CardTitle>Application Documents</CardTitle>
          <CardDescription>Review uploaded documents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Notarized Agreement */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Notarized Agreement</h3>
                {notarizedAgreement?.verified && (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                )}
              </div>
              {notarizedAgreement ? (
                <div className="space-y-2">
                  <div className="relative w-full h-64 rounded-lg overflow-hidden border bg-gray-100">
                    <Image
                      src={notarizedAgreement.documentURL}
                      alt="Notarized Agreement"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleViewDocument(
                          notarizedAgreement.documentURL,
                          "Notarized Agreement"
                        )
                      }
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleDownloadDocument(
                          notarizedAgreement.documentURL,
                          "Notarized Agreement"
                        )
                      }
                      className="flex-1"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Uploaded: {new Date(notarizedAgreement.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Notarized agreement not found</p>
              )}
            </div>

            {/* Valid ID */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Valid ID</h3>
                {validId?.verified && <CheckCircle className="h-5 w-5 text-green-600" />}
              </div>
              {validId ? (
                <div className="space-y-2">
                  <div className="relative w-full h-64 rounded-lg overflow-hidden border bg-gray-100">
                    <Image
                      src={validId.documentURL}
                      alt="Valid ID"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDocument(validId.documentURL, "Valid ID")}
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadDocument(validId.documentURL, "Valid ID")}
                      className="flex-1"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Uploaded: {new Date(validId.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Valid ID not found</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-end">
        <Button
          variant="destructive"
          onClick={handleReject}
          disabled={processing || data.shop.status === "approved"}
          className="flex items-center gap-2"
        >
          <XCircle className="h-4 w-4" />
          Reject
        </Button>
        <Button
          onClick={handleApprove}
          disabled={processing || data.shop.status === "approved"}
          className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
        >
          <CheckCircle className="h-4 w-4" />
          {processing ? "Processing..." : "Approve"}
        </Button>
      </div>
    </div>
  );
}


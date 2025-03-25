"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Edit2 } from "lucide-react";
import ProductForm from "@/components/products/ProductForm";
import { ProductFormData } from "@/types/products";

interface MockProducts {
  [key: string]: ProductFormData;
}

// Mock product data for demonstration
const mockProducts: MockProducts = {
  "prod-1": {
    id: "prod-1",
    name: "Christmas gift stickers",
    slug: "christmas-gift-stickers",
    shortDescription:
      "High-quality Christmas gift stickers perfect for holiday packaging.",
    description:
      "Add a festive touch to your holiday gifts with these beautiful Christmas gift stickers. Made with premium materials, these stickers are durable, easy to apply, and add a personal touch to any wrapped present.",
    regularPrice: 50.0,
    salePrice: 45.0,
    featuredImage: "/images/christmas-sticker-1.jpg",
    galleryImages: [
      "/images/christmas-sticker-1.jpg",
      "/images/christmas-sticker-2.jpg",
      "/images/christmas-sticker-3.jpg",
    ],
    categories: [{ id: "cat-1", name: "Invitation Card" }],
    tags: [
      { id: "tag-1", name: "Christmas" },
      { id: "tag-2", name: "Stickers" },
    ],
    collections: [{ id: "col-1", name: "New Arrival" }],
    labels: [{ id: "label-1", name: "New", type: "new" }],
    status: "published",
    isFeatured: true,
    tax: "tax-1",
    faqs: [
      {
        id: "faq-1",
        question: "What Payment Methods Are Accepted?",
        answer:
          "Fringilla nam tempor elit platonem fugit. Hac kasd dicat postulant dolores. Amet latine abhorreant est solum. Senserit hendrerit ceteros non lorem eam veniam delicata adipisci molestie euripidis.",
      },
      {
        id: "faq-2",
        question: "What Payment Methods Are Accepted?",
        answer:
          "Fringilla nam tempor elit platonem fugit. Hac kasd dicat postulant dolores. Amet latine abhorreant est solum. Senserit hendrerit ceteros non lorem eam veniam delicata adipisci molestie euripidis.",
      },
    ],
    relatedProducts: [
      {
        id: "prod-2",
        name: "Invitation Cards",
        image: "/images/invitation-card-1.jpg",
        price: 99.5,
        regularPrice: 120.0,
      },
      {
        id: "prod-3",
        name: "Invitation Cards",
        image: "/images/invitation-card-2.jpg",
        price: 89.5,
        regularPrice: 110.0,
      },
    ],
    seo: {
      title: "Christmas Gift Stickers - Premium Holiday Packaging Stickers",
      description:
        "Enhance your holiday gift wrapping with premium Christmas stickers. Perfect for gifts, cards, envelopes & more. Shop now!",
      keywords: ["Christmas stickers", "gift stickers", "holiday packaging"],
      internalLink: "/blog/christmas-gift-wrapping-ideas",
      externalLink: "https://pinterest.com/holiday-crafts",
    },
    // updatedAt: "2025-02-18T10:30:00Z",
    // createdAt: "2025-02-18T10:30:00Z",
  },
  "prod-2": {
    id: "prod-2",
    name: "Invitation Cards",
    slug: "invitation-cards",
    shortDescription: "Beautiful invitation cards for all occasions.",
    description:
      "Our invitation cards are designed to make a lasting impression. Perfect for weddings, birthdays, corporate events, and any special occasion. Available in various designs and customization options.",
    regularPrice: 99.5,
    salePrice: 89.5,
    featuredImage: "/images/invitation-card-1.jpg",
    galleryImages: [
      "/images/invitation-card-1.jpg",
      "/images/invitation-card-2.jpg",
      "/images/invitation-card-3.jpg",
    ],
    categories: [{ id: "cat-1", name: "Invitation Card" }],
    tags: [
      { id: "tag-3", name: "Invitation" },
      { id: "tag-4", name: "Cards" },
    ],
    collections: [{ id: "col-2", name: "Best Sellers" }],
    labels: [{ id: "label-2", name: "Hot", type: "hot" }],
    status: "published",
    isFeatured: true,
    tax: "tax-1",
    faqs: [
      {
        id: "faq-3",
        question: "How do I customize my invitation?",
        answer:
          "You can customize your invitation by providing your details during the ordering process. We offer various customization options including text, colors, and layouts.",
      },
      {
        id: "faq-4",
        question: "What is the delivery time?",
        answer:
          "Standard delivery takes 3-5 business days. Express delivery options are available for an additional fee.",
      },
    ],
    relatedProducts: [
      {
        id: "prod-1",
        name: "Christmas gift stickers",
        image: "/images/christmas-sticker-1.jpg",
        price: 45.0,
        regularPrice: 50.0,
      },
    ],
    seo: {
      title: "Premium Invitation Cards for All Occasions - Druckland",
      description:
        "Beautiful invitation cards for weddings, birthdays, corporate events, and all special occasions. Customizable and available in various designs.",
      keywords: [
        "invitation cards",
        "wedding invitations",
        "birthday invitations",
      ],
      internalLink: "/blog/invitation-etiquette",
      externalLink: "",
    },
    // createdAt: "2025-02-10T14:30:00Z",
    // updatedAt: "2025-02-15T09:45:00Z",
  },
};

export default function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [product, setProduct] = useState<ProductFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch from your API
    // const fetchProduct = async () => {
    //   const response = await fetch(`/api/products/${params.id}`);
    //   const data = await response.json();
    //   setProduct(data);
    //   setIsLoading(false);
    // };

    // Simulate API call with mock data
    const fetchProduct = async () => {
      if (!params.id) {
        return;
      }
      try {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        const data = mockProducts[params.id] || null;

        if (data) {
          setProduct(data);
        } else {
          // Handle not found case
          router.push("/admin/products");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [params.id, router]);

  const handleSubmit = async (data: ProductFormData) => {
    // In a real application, you would update the data via your API
    // For now, we'll just navigate back to the list page
    router.push("/admin/products");
  };

  const handleDelete = () => {
    // In a real application, you would delete the data via your API
    // For now, we'll just navigate back to the list page
    router.push("/admin/products");
  };

  if (isLoading) {
    return (
      <div className="edit-product-page">
        <div className="edit-product-page__loading bg-white p-8 rounded-md text-center">
          <div className="animate-spin h-8 w-8 border-4 border-[#DCE8F8] border-t-[#007BF9] rounded-full mx-auto mb-4"></div>
          <p className="text-[#49617E]">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="edit-product-page">
        <div className="edit-product-page__not-found bg-white p-8 rounded-md text-center">
          <p className="text-[#F85464] mb-4">Product not found</p>
          <button
            onClick={() => router.push("/admin/products")}
            className="text-[#007BF9] hover:underline"
          >
            Return to Products List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-product-page">
      <div className="edit-product-page__header mb-6">
        <h1 className="text-[#2B4F60] text-2xl font-semibold flex items-center">
          <Edit2 className="mr-2" size={24} />
          Edit Product: {product.name}
        </h1>
        <p className="text-[#49617E] mt-1">
          Update product information, images, and settings
        </p>
      </div>

      <ProductForm
        initialData={product}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
      />
    </div>
  );
}

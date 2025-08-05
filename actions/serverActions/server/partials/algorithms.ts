import prisma from "@/lib/prisma";
import { Animal } from "@prisma/client";

// Utility: Split array into chunks
function chunkArray<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

async function rankPost(post: any) {
  // Recency Score
  const hoursSincePost =
    (Date.now() - post.createdAt.getTime()) / (1000 * 60 * 60);
  const recencyScore = 1 / (hoursSincePost + 1);

  // Engagement Score: likes & views
  const likeScore = post.likes / (post.views > 0 ? post.views : 1); // CTR style
  const viewWeight = Math.log(post.views + 1) / 10; // dampen high views
  const engagementScore = likeScore * 0.7 + viewWeight * 0.3;

  // Content Completeness
  const requiredFields = [
    "type",
    "breed",
    "averageAge",
    "averageWeight",
    "colorMarkings",
    "images",
    "description",
  ];
  const filledFields = requiredFields.filter(
    (field) => post[field] != null
  ).length;
  const contentCompleteness = filledFields / requiredFields.length;

  // Price Competitiveness
  const avgPriceObj = await prisma.animal.aggregate({
    _avg: { price: true },
    where: { type: post.type, sold: false },
  });
  const avgPrice = avgPriceObj._avg.price ?? post.price;
  const priceRatio = Math.min(avgPrice / post.price, post.price / avgPrice);
  const priceCompetitiveness = Math.min(priceRatio, 1);

  // Random Factor
  const randomFactor = Math.random();

  // Final Score (weights tuned)
  const score =
    recencyScore * 0.3 +
    engagementScore * 0.35 +
    contentCompleteness * 0.2 +
    priceCompetitiveness * 0.05 +
    randomFactor * 0.1;

  // Update rank in DB (0–100 scale)
  await prisma.animal.update({
    where: { id: post.id },
    data: { rank: Math.round(score * 100) },
  });

  return score;
}
async function rankPostsInBatch() {
  console.log("Batch ranking started:", new Date().toISOString());

  // 1. Get all unsold posts
  const posts = await prisma.animal.findMany({
    where: { sold: false },
    include: {
      user: {
        select: {
          followers: true,
          bids: true,
        },
      },
    },
  });

  if (posts.length === 0) return [];

  // 2. Get average prices grouped by type (one query for all)
  const avgPrices = await prisma.animal.groupBy({
    by: ["type"],
    _avg: { price: true },
    where: { sold: false },
  });

  // Create a lookup map
  const avgPriceMap: Record<string, number> = {};
  avgPrices.forEach((p) => {
    avgPriceMap[p.type] = p._avg.price ?? 0;
  });

  // 3. Process posts
  const rankedPosts = posts.map((post) => {
    const hoursSincePost =
      (Date.now() - post.createdAt.getTime()) / (1000 * 60 * 60);
    const recencyScore = 1 / (hoursSincePost + 1);

    const likeScore = post.likes / (post.views > 0 ? post.views : 1);
    const viewWeight = Math.log(post.views + 1) / 10;
    const engagementScore = likeScore * 0.7 + viewWeight * 0.3;

    const requiredFields = [
      "type",
      "breed",
      "averageAge",
      "averageWeight",
      "colorMarkings",
      "images",
      "description",
    ];
    const filledFields = requiredFields.filter(
      (field) => post[field as keyof typeof post] != null
    ).length;
    const contentCompleteness = filledFields / requiredFields.length;

    const avgPrice = avgPriceMap[post.type] || post.price;
    const priceRatio = Math.min(avgPrice / post.price, post.price / avgPrice);
    const priceCompetitiveness = Math.min(priceRatio, 1);

    const randomFactor = Math.random();

    const score =
      recencyScore * 0.3 +
      engagementScore * 0.35 +
      contentCompleteness * 0.2 +
      priceCompetitiveness * 0.05 +
      randomFactor * 0.1;

    return {
      id: post.id,
      rank: Math.round(score * 100),
    };
  });

  // 4. Bulk update in batches
  for (const chunk of chunkArray(rankedPosts, 100)) {
    const tx = chunk.map((p) =>
      prisma.animal.update({
        where: { id: p.id },
        data: { rank: p.rank },
      })
    );
    await prisma.$transaction(tx);
  }

  console.log("Batch ranking completed:", new Date().toISOString());
  return rankedPosts;
}

export const algorithms = {
  rankPost,
  rankPostsInBatch,
};
